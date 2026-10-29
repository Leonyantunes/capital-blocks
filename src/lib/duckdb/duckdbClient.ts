/**
 * MOTOR SQL REAL NO BROWSER (DuckDB-Wasm).
 *
 * Contrato:
 * - assets WASM/Worker são servidos pelo próprio build (sem CDN);
 * - SQL livre só é executado pelo DuckDB;
 * - se WASM/Worker não iniciar, falha de forma explícita — nunca simula SQL.
 */

import { COMEX_DATA, PWT_DATA, OWNERSHIP_DATA, DEBT_DATA } from '../../data/analyticsDatasets'

export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  durationMs: number
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
let initPromise: Promise<any> | null = null

const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err)

/**
 * Inicializa uma única conexão DuckDB-Wasm usando bundles locais gerenciados
 * pelo Vite. Os arquivos grandes continuam lazy: só são buscados ao abrir/usar
 * o laboratório.
 */
export async function getDuckDBConnection() {
  if (connectionInstance) return connectionInstance
  if (initPromise) return initPromise

  initPromise = (async () => {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      throw new DuckDBUnavailableError(
        'DuckDB-Wasm requer um navegador com suporte a Web Worker e WebAssembly.',
      )
    }

    let worker: Worker | null = null
    try {
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
      const logger = new duckdb.ConsoleLogger()
      const db = new duckdb.AsyncDuckDB(logger, worker)
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
      worker?.terminate()
      if (err instanceof DuckDBUnavailableError) throw err
      throw new DuckDBUnavailableError(
        `DuckDB-Wasm não pôde ser inicializado: ${errorMessage(err)}`,
      )
    }
  })()

  return initPromise
}

/** Executa SQL real. Não existe fallback que tente adivinhar a consulta. */
export async function runSqlQuery(sql: string): Promise<QueryResult> {
  const start = performance.now()
  const conn = await getDuckDBConnection()

  try {
    const arrowTable = await conn.query(sql)
    const columns = arrowTable.schema.fields.map((field: any) => field.name)
    const rows: Record<string, unknown>[] = []

    for (let i = 0; i < arrowTable.numRows; i++) {
      const row: Record<string, unknown> = {}
      for (const col of columns) {
        const val = arrowTable.getChild(col)?.get(i)
        row[col] = typeof val === 'bigint' ? Number(val) : val
      }
      rows.push(row)
    }

    return {
      columns,
      rows,
      rowCount: rows.length,
      durationMs: Math.round((performance.now() - start) * 10) / 10,
    }
  } catch (err) {
    throw new DuckDBQueryError(`Consulta SQL rejeitada pelo DuckDB: ${errorMessage(err)}`)
  }
}
