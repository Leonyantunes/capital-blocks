/**
 * MOTOR SQL REAL NO BROWSER (DuckDB-Wasm).
 *
 * Contrato:
 * - assets WASM/Worker são servidos pelo próprio build (sem CDN);
 * - SQL livre só é executado pelo DuckDB;
 * - se WASM/Worker não iniciar, falha de forma explícita — nunca simula SQL.
 */

import { COMEX_DATA, PWT_DATA, OWNERSHIP_DATA, DEBT_DATA } from '../../data/analyticsDatasets'

export const DEFAULT_MAX_ROWS = 1000

export interface QueryOptions {
  maxRows?: number
  signal?: AbortSignal
  cancelPrevious?: boolean
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  totalRowCount: number
  durationMs: number
  truncated: boolean
}

export class DuckDBUnavailableError extends Error {
  readonly code = 'DUCKDB_UNAVAILABLE'
  constructor(message: string) {
    super(message)
    this.name = 'DuckDBUnavailableError'
  }
}

export class DuckDBQueryError extends Error {
  readonly code = 'DUCKDB_QUERY_ERROR'
  constructor(message: string) {
    super(message)
    this.name = 'DuckDBQueryError'
  }
}

let connectionInstance: any = null
let dbInstance: any = null
let workerInstance: Worker | null = null
let initPromise: Promise<any> | null = null

let activeQueryPromise: Promise<QueryResult> | null = null
let activeAbortController: AbortController | null = null

const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err)

/** Permite que testes injetem uma conexão mockada */
export function __setConnectionForTesting(conn: any) {
  connectionInstance = conn
}

/** Permite que testes ou a UI verifiquem se há consulta ativa */
export function isQueryInProgress(): boolean {
  return activeQueryPromise !== null
}

/**
 * Cancela a consulta em andamento no DuckDB de forma graciosa.
 */
export async function cancelCurrentQuery(): Promise<boolean> {
  if (!activeAbortController && !activeQueryPromise) {
    return false
  }

  if (activeAbortController) {
    activeAbortController.abort()
  }

  if (connectionInstance && typeof connectionInstance.cancelSent === 'function') {
    try {
      await connectionInstance.cancelSent()
    } catch {
      // ignore
    }
  }

  try {
    await activeQueryPromise
  } catch {
    // expected abort/cancellation error
  }

  activeQueryPromise = null
  activeAbortController = null
  return true
}

/**
 * Reseta o estado global da conexão e limpa workers/banco.
 * Útil para testes e recuperação de falhas críticas.
 */
export async function resetDuckDBConnection(): Promise<void> {
  initPromise = null
  const conn = connectionInstance
  const db = dbInstance
  const worker = workerInstance

  connectionInstance = null
  dbInstance = null
  workerInstance = null
  activeQueryPromise = null
  activeAbortController = null

  if (conn && typeof conn.close === 'function') {
    try {
      await conn.close()
    } catch {
      // ignore
    }
  }

  if (db && typeof db.terminate === 'function') {
    try {
      await db.terminate()
    } catch {
      // ignore
    }
  }

  if (worker && typeof worker.terminate === 'function') {
    try {
      worker.terminate()
    } catch {
      // ignore
    }
  }
}

/**
 * Inicializa uma única conexão DuckDB-Wasm usando bundles locais gerenciados
 * pelo Vite. Os arquivos grandes continuam lazy: só são buscados ao abrir/usar
 * o laboratório.
 */
export async function getDuckDBConnection() {
  if (connectionInstance) return connectionInstance
  if (initPromise) return initPromise

  initPromise = (async () => {
    let worker: Worker | null = null
    let db: any = null
    try {
      if (typeof window === 'undefined' || typeof Worker === 'undefined') {
        throw new DuckDBUnavailableError(
          'DuckDB-Wasm requer um navegador com suporte a Web Worker e WebAssembly.',
        )
      }

      const [duckdb, mvpWasmMod, mvpWorkerMod, ehWasmMod, ehWorkerMod] = await Promise.all([
        import('@duckdb/duckdb-wasm'),
        import('@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'),
        import('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'),
        import('@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'),
        import('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'),
      ])

      const bundle = await duckdb.selectBundle({
        mvp: {
          mainModule: mvpWasmMod.default,
          mainWorker: mvpWorkerMod.default,
        },
        eh: {
          mainModule: ehWasmMod.default,
          mainWorker: ehWorkerMod.default,
        },
      })

      if (!bundle?.mainWorker || !bundle.mainModule) {
        throw new Error('nenhum bundle DuckDB compatível foi selecionado')
      }

      worker = new Worker(bundle.mainWorker)
      workerInstance = worker
      const logger = new duckdb.ConsoleLogger()
      db = new duckdb.AsyncDuckDB(logger, worker)
      dbInstance = db
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

      const conn = await db.connect()

      await db.registerFileText('comex.json', JSON.stringify(COMEX_DATA))
      await conn.query(`CREATE TABLE comex_fluxos AS SELECT * FROM read_json_auto('comex.json')`)

      await db.registerFileText('pwt.json', JSON.stringify(PWT_DATA))
      await conn.query(`CREATE TABLE penn_world_table AS SELECT * FROM read_json_auto('pwt.json')`)

      await db.registerFileText('ownership.json', JSON.stringify(OWNERSHIP_DATA))
      await conn.query(`CREATE TABLE corporate_ownership AS SELECT * FROM read_json_auto('ownership.json')`)

      await db.registerFileText('debt.json', JSON.stringify(DEBT_DATA))
      await conn.query(`CREATE TABLE divida_soberana AS SELECT * FROM read_json_auto('debt.json')`)

      connectionInstance = conn
      return conn
    } catch (err) {
      // AUD-007: Reset initPromise and clean up partially initialized references
      // so transient failures can be retried without requiring a page reload.
      initPromise = null
      connectionInstance = null

      if (db && typeof db.terminate === 'function') {
        try {
          await db.terminate()
        } catch {
          // ignore cleanup error
        }
      }
      dbInstance = null

      if (worker && typeof worker.terminate === 'function') {
        try {
          worker.terminate()
        } catch {
          // ignore cleanup error
        }
      }
      workerInstance = null

      if (err instanceof DuckDBUnavailableError) throw err
      throw new DuckDBUnavailableError(
        `DuckDB-Wasm não pôde ser inicializado: ${errorMessage(err)}`,
      )
    }
  })()

  return initPromise
}

/** Executa SQL real com limite de memória, rastreio de duração e proteção de concorrência. */
export async function runSqlQuery(
  sql: string,
  options?: QueryOptions,
): Promise<QueryResult> {
  // AUD-006: Proteção contra consultas concorrentes sobrepostas
  if (activeQueryPromise) {
    if (options?.cancelPrevious) {
      await cancelCurrentQuery()
    } else {
      throw new DuckDBQueryError(
        'Já existe uma consulta em andamento no DuckDB. Aguarde a conclusão ou cancele a consulta ativa.',
      )
    }
  }

  const abortController = new AbortController()
  activeAbortController = abortController

  if (options?.signal) {
    if (options.signal.aborted) {
      activeAbortController = null
      throw new DuckDBQueryError('Consulta cancelada pelo usuário.')
    }
    options.signal.addEventListener(
      'abort',
      () => {
        abortController.abort()
        if (connectionInstance && typeof connectionInstance.cancelSent === 'function') {
          connectionInstance.cancelSent().catch(() => {})
        }
      },
      { once: true },
    )
  }

  let queryExecution: Promise<QueryResult> | null = null
  queryExecution = (async () => {
    const start = performance.now()
    const conn = await getDuckDBConnection()

    if (abortController.signal.aborted) {
      throw new DuckDBQueryError('Consulta cancelada pelo usuário.')
    }

    try {
      const arrowTable = await conn.query(sql)

      if (abortController.signal.aborted) {
        throw new DuckDBQueryError('Consulta cancelada pelo usuário.')
      }

      const columns: string[] =
        arrowTable.schema?.fields?.map((field: any) => field.name) ?? []
      const totalRowCount = arrowTable.numRows ?? 0

      // AUD-006: Limitar registros materializados na memória JS (máx. 1000 por padrão)
      const maxRows = options?.maxRows ?? DEFAULT_MAX_ROWS
      const rowsToMaterialize = Math.min(totalRowCount, maxRows)
      const truncated = totalRowCount > maxRows
      const rows: Record<string, unknown>[] = []

      for (let i = 0; i < rowsToMaterialize; i++) {
        if (abortController.signal.aborted) {
          throw new DuckDBQueryError('Consulta cancelada pelo usuário.')
        }
        const row: Record<string, unknown> = {}
        for (const col of columns) {
          const val = arrowTable.getChild(col)?.get(i)
          row[col] = typeof val === 'bigint' ? Number(val) : val
        }
        rows.push(row)
      }

      const durationMs = Math.round((performance.now() - start) * 10) / 10

      return {
        columns,
        rows,
        rowCount: rows.length,
        totalRowCount,
        durationMs,
        truncated,
      }
    } catch (err) {
      if (abortController.signal.aborted) {
        throw new DuckDBQueryError('Consulta cancelada pelo usuário.')
      }
      if (err instanceof DuckDBQueryError) throw err
      throw new DuckDBQueryError(
        `Consulta SQL rejeitada pelo DuckDB: ${errorMessage(err)}`,
      )
    } finally {
      if (activeAbortController === abortController) {
        activeAbortController = null
      }
      if (activeQueryPromise === queryExecution) {
        activeQueryPromise = null
      }
    }
  })()

  activeQueryPromise = queryExecution
  return queryExecution
}
