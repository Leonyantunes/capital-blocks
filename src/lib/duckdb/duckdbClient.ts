/**
 * MOTOR DE PROCESSAMENTO ANALÍTICO NO BROWSER (DuckDB-Wasm).
 * Executa consultas SQL ultrarrápidas em memória WebAssembly isolada em Web Worker.
 * Inclui fallback gracioso para ambientes sem WebWorker/WASM (ex.: testes ou mobile antigo).
 */

import { COMEX_DATA, PWT_DATA, OWNERSHIP_DATA, DEBT_DATA } from '../../data/analyticsDatasets'

export interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
  rowCount: number
  durationMs: number
  isFallback?: boolean
}

let duckdbInstance: any = null
let connectionInstance: any = null
let initPromise: Promise<any> | null = null

/**
 * Inicializa a instância Singleton do DuckDB-Wasm sob demanda.
 */
export async function getDuckDBConnection() {
  if (connectionInstance) return connectionInstance
  if (initPromise) return initPromise

  initPromise = (async () => {
    // Verificação de ambiente: no Node / SSR / Vitest sem worker real, retorna null para ativar fallback
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      return null
    }

    try {
      const duckdb = await import('@duckdb/duckdb-wasm')
      const bundles = duckdb.getJsDelivrBundles()
      const bundle = await duckdb.selectBundle(bundles)

      if (!bundle || !bundle.mainWorker) {
        return null
      }

      const worker = new Worker(bundle.mainWorker)
      const logger = new duckdb.ConsoleLogger()
      const db = new duckdb.AsyncDuckDB(logger, worker)
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

      const conn = await db.connect()

      // Registrar tabelas canônicas em memória
      await db.registerFileText('comex.json', JSON.stringify(COMEX_DATA))
      await conn.query(`CREATE TABLE comex_fluxos AS SELECT * FROM read_json_auto('comex.json')`)

      await db.registerFileText('pwt.json', JSON.stringify(PWT_DATA))
      await conn.query(`CREATE TABLE penn_world_table AS SELECT * FROM read_json_auto('pwt.json')`)

      await db.registerFileText('ownership.json', JSON.stringify(OWNERSHIP_DATA))
      await conn.query(`CREATE TABLE corporate_ownership AS SELECT * FROM read_json_auto('ownership.json')`)

      await db.registerFileText('debt.json', JSON.stringify(DEBT_DATA))
      await conn.query(`CREATE TABLE divida_soberana AS SELECT * FROM read_json_auto('debt.json')`)

      duckdbInstance = db
      connectionInstance = conn
      return conn
    } catch (err) {
      console.warn('[DuckDB] Falha na inicialização do WASM Worker, operando no modo fallback analítico em memória JS:', err)
      return null
    }
  })()

  return initPromise
}

/**
 * Executa uma consulta SQL.
 * Se DuckDB-Wasm estiver operacional, roda no WASM a 100k+ linhas/s.
 * Caso contrário, processa com o motor analítico fallback JS.
 */
export async function runSqlQuery(sql: string): Promise<QueryResult> {
  const start = performance.now()

  try {
    const conn = await getDuckDBConnection()
    if (conn) {
      const arrowTable = await conn.query(sql)
      const columns = arrowTable.schema.fields.map((f: any) => f.name)
      const rows: Record<string, any>[] = []

      for (let i = 0; i < arrowTable.numRows; i++) {
        const row: Record<string, any> = {}
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
        durationMs,
        isFallback: false,
      }
    }
  } catch (wasmError) {
    console.warn('[DuckDB] Erro de execução WASM, utilizando resolvedor de fallback:', wasmError)
  }

  // MOTOR FALLBACK ANALÍTICO EM MEMÓRIA
  const fallback = executeFallbackQuery(sql)
  const durationMs = Math.round((performance.now() - start) * 10) / 10
  return {
    ...fallback,
    durationMs,
    isFallback: true,
  }
}

/**
 * Resolvedor analítico fallback para testes locais e dispositivos sem suporte a WASM threads.
 */
function executeFallbackQuery(sql: string): { columns: string[]; rows: Record<string, any>[]; rowCount: number } {
  const normalized = sql.toLowerCase()

  if (normalized.includes('comex_fluxos')) {
    const grouped = new Map<string, { bloco_origem: string; bloco_destino: string; categoria: string; total_usd_bi: number; drenagem_liquida_bi: number }>()

    for (const r of COMEX_DATA) {
      const key = `${r.bloco_origem}|${r.bloco_destino}|${r.categoria}`
      const existing = grouped.get(key) || {
        bloco_origem: r.bloco_origem,
        bloco_destino: r.bloco_destino,
        categoria: r.categoria,
        total_usd_bi: 0,
        drenagem_liquida_bi: 0,
      }
      existing.total_usd_bi += r.usd_bi
      existing.drenagem_liquida_bi += r.drenagem_bi
      grouped.set(key, existing)
    }

    const rows = Array.from(grouped.values())
      .map((r) => ({
        bloco_origem: r.bloco_origem,
        bloco_destino: r.bloco_destino,
        categoria: r.categoria,
        total_usd_bi: Math.round(r.total_usd_bi * 10) / 10,
        drenagem_liquida_bi: Math.round(r.drenagem_liquida_bi * 10) / 10,
      }))
      .sort((a, b) => b.drenagem_liquida_bi - a.drenagem_liquida_bi)

    return {
      columns: ['bloco_origem', 'bloco_destino', 'categoria', 'total_usd_bi', 'drenagem_liquida_bi'],
      rows,
      rowCount: rows.length,
    }
  }

  if (normalized.includes('penn_world_table')) {
    const rows = PWT_DATA.filter((r) => ['Brasil', 'Estados Unidos', 'China'].includes(r.pais))
      .sort((a, b) => a.pais.localeCompare(b.pais) || b.ano - a.ano)
      .map((r) => ({
        pais: r.pais,
        ano: r.ano,
        composicao_k: Math.round(r.composicao_organica_k * 100) / 100,
        taxa_mais_valia: `${Math.round(r.taxa_exploracao_e * 1000) / 10}%`,
        taxa_lucro_r: `${Math.round(r.taxa_lucro_r * 1000) / 10}%`,
      }))

    return {
      columns: ['pais', 'ano', 'composicao_k', 'taxa_mais_valia', 'taxa_lucro_r'],
      rows,
      rowCount: rows.length,
    }
  }

  if (normalized.includes('corporate_ownership')) {
    const rows = [...OWNERSHIP_DATA]
      .map((r) => ({
        empresa: r.empresa,
        pais: r.pais,
        setor: r.setor,
        fracao_capital: r.fracao_capital,
        total_big_three: `${Math.round((r.pct_blackrock + r.pct_vanguard + r.pct_statestreet) * 10) / 10}%`,
        market_cap_bi: r.market_cap_bi,
      }))
      .sort((a, b) => parseFloat(b.total_big_three) - parseFloat(a.total_big_three))

    return {
      columns: ['empresa', 'pais', 'setor', 'fracao_capital', 'total_big_three', 'market_cap_bi'],
      rows,
      rowCount: rows.length,
    }
  }

  // Padrão: Dívida
  const rows = [...DEBT_DATA]
    .map((r) => ({
      pais: r.pais,
      regiao: r.regiao,
      divida_pib: `${r.divida_pib_pct}%`,
      divida_em_dolar: `${r.divida_dolar_pct}%`,
      juros_orcamento: `${r.juros_orcamento_pct}%`,
      reservas_usd_bi: r.reservas_bi,
    }))
    .sort((a, b) => parseFloat(b.divida_em_dolar) - parseFloat(a.divida_em_dolar))

  return {
    columns: ['pais', 'regiao', 'divida_pib', 'divida_em_dolar', 'juros_orcamento', 'reservas_usd_bi'],
    rows,
    rowCount: rows.length,
  }
}
