import { useState, useEffect } from 'react'
import { PRESET_QUERIES, type PresetQuery } from '../../data/analyticsDatasets'
import {
  DuckDBQueryError,
  DuckDBUnavailableError,
  runSqlQuery,
  cancelCurrentQuery,
  type QueryResult,
} from '../../lib/duckdb/duckdbClient'
import { pick } from '../../i18n'
import { useApp } from '../../store/useApp'

/**
 * Converte e escapa com segurança uma célula individual para formato RFC 4180
 * com proteção contra injeção de fórmulas CSV (OWASP).
 */
export function formatCsvCell(val: unknown): string {
  if (val === null || val === undefined) {
    return ''
  }

  let str = typeof val === 'string' ? val : String(val)

  // Prevenção de CSV Formula Injection:
  // Células de texto iniciando com '=', '+', '-', '@', tab (\t) ou carriage return (\r)
  // são prefixadas com apóstrofo para impedir execução em softwares como Excel/Calc.
  if (typeof val === 'string' && /^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`
  }

  // RFC 4180: Se contiver aspas duplas, duplica-as (" -> "")
  const hasQuotes = str.includes('"')
  const hasComma = str.includes(',')
  const hasNewline = str.includes('\n') || str.includes('\r')

  if (hasQuotes) {
    str = str.replace(/"/g, '""')
  }

  // RFC 4180: Células contendo vírgula, aspas ou quebras de linha (\r, \n)
  // DEVEM ser envolvidas por aspas duplas.
  if (hasQuotes || hasComma || hasNewline) {
    return `"${str}"`
  }

  return str
}

/**
 * Gera string CSV segura conforme RFC 4180 a partir de colunas e linhas.
 */
export function generateCsv(
  columns: string[],
  rows: Record<string, unknown>[]
): string {
  const header = columns.map(formatCsvCell).join(',')
  const dataRows = rows.map((row) =>
    columns.map((col) => formatCsvCell(row[col])).join(',')
  )
  return [header, ...dataRows].join('\r\n')
}

export default function AnalyticsLab() {
  const lang = useApp((s) => s.lang)
  const [selectedPreset, setSelectedPreset] = useState<PresetQuery>(PRESET_QUERIES[0])
  const [sql, setSql] = useState<string>(PRESET_QUERIES[0].sql)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [engineStatus, setEngineStatus] = useState<'initializing' | 'ready' | 'unavailable'>('initializing')

  const handleExecute = async (customSql?: string, options?: { cancelPrevious?: boolean }) => {
    const queryToRun = customSql ?? sql
    setError(null)
    setIsLoading(true)
    try {
      const res = await runSqlQuery(queryToRun, {
        cancelPrevious: options?.cancelPrevious ?? true,
      })
      setResult(res)
      setEngineStatus('ready')
    } catch (err: unknown) {
      setResult(null)
      if (err instanceof DuckDBUnavailableError) {
        setEngineStatus('unavailable')
        setError(pick(
          lang,
          'DuckDB-Wasm não pôde iniciar neste navegador. O laboratório foi desativado e nenhuma consulta foi simulada.',
          'DuckDB-Wasm could not start in this browser. The lab is disabled and no query was simulated.',
          'DuckDB-Wasm no pudo iniciarse en este navegador. El laboratorio está desactivado y no se simuló ninguna consulta.',
        ))
      } else if (err instanceof DuckDBQueryError) {
        if (engineStatus !== 'unavailable') {
          setEngineStatus('ready')
        }
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : pick(
          lang,
          'Erro inesperado ao executar SQL.',
          'Unexpected error while running SQL.',
          'Error inesperado al ejecutar SQL.',
        ))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Executa o preset inicial
  useEffect(() => {
    handleExecute(PRESET_QUERIES[0].sql)
  }, [])

  const handleSelectPreset = (preset: PresetQuery) => {
    setSelectedPreset(preset)
    setSql(preset.sql)
    handleExecute(preset.sql, { cancelPrevious: true })
  }

  const handleCancelQuery = async () => {
    try {
      await cancelCurrentQuery()
      setIsLoading(false)
      setError(pick(
        lang,
        'Consulta cancelada pelo usuário.',
        'Query cancelled by user.',
        'Consulta cancelada por el usuario.',
      ))
    } catch {
      setIsLoading(false)
    }
  }

  const handleRetry = async () => {
    setEngineStatus('initializing')
    setError(null)
    await handleExecute()
  }

  const handleExportCsv = () => {
    if (!result || result.rows.length === 0) return
    const csvContent = generateCsv(result.columns, result.rows)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = typeof URL !== 'undefined' && URL.createObjectURL
      ? URL.createObjectURL(blob)
      : 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)

    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `capital-blocks-${selectedPreset.id}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (typeof URL !== 'undefined' && URL.revokeObjectURL && url.startsWith('blob:')) {
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
      {/* Cabeçalho do Laboratório */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${
              engineStatus === 'ready'
                ? 'bg-emerald-400'
                : engineStatus === 'unavailable'
                  ? 'bg-red-400'
                  : 'animate-pulse bg-amber-400'
            }`} />
            <h3 className="text-base font-bold text-zinc-100">
              {pick(
                lang,
                'Laboratório Analítico SQL no Navegador (DuckDB-Wasm)',
                'Browser In-Memory SQL Analytics Lab (DuckDB-Wasm)',
                'Laboratorio Analítico SQL en el Navegador (DuckDB-Wasm)'
              )}
            </h3>
          </div>
          <p className="mt-1 max-w-2xl text-xs text-zinc-400">
            {pick(
              lang,
              'Execute SQL real diretamente na memória do seu dispositivo. O Worker e o WASM são servidos pelo próprio app; nenhuma consulta é enviada a um servidor.',
              'Run real SQL directly in your device memory. The Worker and WASM are served by the app itself; no query is sent to a server.',
              'Ejecute SQL real directamente en la memoria de su dispositivo. El Worker y el WASM son servidos por la propia app; ninguna consulta se envía a un servidor.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-400">
            WASM local · Web Worker
          </span>
          <span className={`rounded-md border px-2.5 py-1 font-mono text-[11px] ${
            engineStatus === 'unavailable'
              ? 'border-red-500/40 bg-red-950/30 text-red-300'
              : 'border-zinc-700 bg-zinc-900 text-zinc-300'
          }`}>
            {engineStatus === 'initializing'
              ? pick(lang, 'Inicializando DuckDB…', 'Initializing DuckDB…', 'Inicializando DuckDB…')
              : engineStatus === 'unavailable'
                ? pick(lang, 'DuckDB indisponível', 'DuckDB unavailable', 'DuckDB no disponible')
                : 'Engine: DuckDB-Wasm'}
          </span>
          {engineStatus === 'unavailable' && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isLoading}
              className="rounded-md border border-red-500/50 bg-red-900/40 px-2.5 py-1 text-[11px] font-semibold text-red-200 transition-colors hover:bg-red-800/60 disabled:opacity-50"
            >
              🔄 {pick(lang, 'Tentar novamente', 'Retry', 'Intentar de nuevo')}
            </button>
          )}
        </div>
      </div>

      {/* Chips de Consultas Didáticas Pré-Prontas */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-300">
          {pick(lang, '🎯 Consultas Didáticas Prontas (clique para rodar):', '🎯 Ready-to-Run Pedagogical Queries:', '🎯 Consultas Didácticas Listas:')}
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              disabled={engineStatus === 'unavailable'}
              className={`flex flex-col rounded-xl border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
                selectedPreset.id === preset.id
                  ? 'border-money bg-money/10 shadow-md'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-wider text-money">
                <span>{preset.categoria}</span>
                {selectedPreset.id === preset.id && <span className="h-1.5 w-1.5 rounded-full bg-money" />}
              </div>
              <div className="mt-1 text-xs font-bold text-zinc-100">{preset.titulo}</div>
              <div className="mt-1 line-clamp-2 text-[11px] text-zinc-400">{preset.descricao}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor SQL */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>SQL Query Console (Tabelas: comex_fluxos, penn_world_table, corporate_ownership, divida_soberana)</span>
          <span>{result ? `${result.rowCount}${result.truncated ? '+' : ''} linhas em ${result.durationMs}ms` : ''}</span>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#0d1117]">
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={5}
            spellCheck={false}
            className="w-full resize-y bg-transparent p-3.5 font-mono text-xs leading-relaxed text-emerald-300 outline-none selection:bg-emerald-800 selection:text-white"
            placeholder="Digite sua query SQL aqui (ex.: SELECT * FROM comex_fluxos LIMIT 10)..."
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 bg-zinc-900/80 px-3 py-2">
            <span className="font-mono text-[10px] text-zinc-500">
              {engineStatus === 'unavailable'
                ? pick(lang, '⚠ SQL desativado — nenhum fallback simulado', '⚠ SQL disabled — no simulated fallback', '⚠ SQL desactivado — sin fallback simulado')
                : engineStatus === 'initializing'
                  ? pick(lang, '⏳ Inicializando DuckDB-Wasm local…', '⏳ Initializing local DuckDB-Wasm…', '⏳ Inicializando DuckDB-Wasm local…')
                  : pick(lang, '🚀 SQL real no DuckDB Web Worker', '🚀 Real SQL in the DuckDB Web Worker', '🚀 SQL real en el DuckDB Web Worker')}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={!result || result.rows.length === 0}
                className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700 disabled:opacity-40"
              >
                📥 {pick(lang, 'Exportar CSV', 'Export CSV', 'Exportar CSV')}
              </button>

              {engineStatus === 'unavailable' ? (
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="rounded-lg border border-red-500/50 bg-red-900/60 px-4 py-1.5 text-xs font-bold text-red-100 shadow-md transition-colors hover:bg-red-800 disabled:opacity-50"
                >
                  🔄 {pick(lang, 'Tentar novamente', 'Retry', 'Intentar de nuevo')}
                </button>
              ) : isLoading ? (
                <button
                  type="button"
                  onClick={handleCancelQuery}
                  className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-red-500"
                >
                  ⏹ {pick(lang, 'Cancelar consulta', 'Cancel query', 'Cancelar consulta')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleExecute()}
                  className="rounded-lg bg-money px-4 py-1.5 text-xs font-bold text-onaccent shadow-md transition-colors hover:bg-money/90"
                >
                  ▶ {pick(lang, 'Executar SQL', 'Run SQL', 'Ejecutar SQL')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exibição de Erros com Botão de Tentar Novamente */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-950/30 p-3 font-mono text-xs text-red-300">
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
          {engineStatus === 'unavailable' && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isLoading}
              className="rounded-lg border border-red-500/50 bg-red-900/60 px-3 py-1 font-sans text-xs font-semibold text-red-100 transition-colors hover:bg-red-800 disabled:opacity-50"
            >
              🔄 {pick(lang, 'Tentar novamente', 'Retry', 'Intentar de nuevo')}
            </button>
          )}
        </div>
      )}

      {/* Alerta de Truncamento de Registros (Proteção de Memória) */}
      {result && result.truncated && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-300">
          <span className="text-sm">⚠️</span>
          <span>
            {pick(
              lang,
              `Limite de exibição atingido: exibindo os primeiros ${result.rowCount.toLocaleString()} registros de ${result.totalRowCount.toLocaleString()} encontrados na consulta. Utilize a cláusula LIMIT no SQL para refinar.`,
              `Display limit reached: showing first ${result.rowCount.toLocaleString()} records of ${result.totalRowCount.toLocaleString()} found. Use the LIMIT clause in SQL to refine your query.`,
              `Límite de visualización alcanzado: mostrando los primeros ${result.rowCount.toLocaleString()} registros de ${result.totalRowCount.toLocaleString()} encontrados. Use la cláusula LIMIT en SQL para refinar.`
            )}
          </span>
        </div>
      )}

      {/* Tabela de Resultados */}
      {result && result.rows.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Resultados da Consulta</span>
            <span className="font-mono text-[11px] text-zinc-500">
              {result.truncated
                ? `Mostrando ${result.rowCount} registros (de ${result.totalRowCount} totais)`
                : `Mostrando ${result.rowCount} registros`}
            </span>
          </div>

          <div className="max-h-[380px] overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/40 shadow-inner">
            <table className="w-full text-left font-mono text-xs">
              <thead className="sticky top-0 border-b border-zinc-800 bg-zinc-950 text-zinc-400">
                <tr>
                  {result.columns.map((col) => (
                    <th key={col} className="px-3.5 py-2.5 font-semibold tracking-wider text-zinc-200">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {result.rows.map((row, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-zinc-800/30">
                    {result.columns.map((col) => {
                      const val = row[col]
                      const isNumber = typeof val === 'number'
                      return (
                        <td
                          key={col}
                          className={`whitespace-nowrap px-3.5 py-2 ${
                            isNumber ? 'text-right font-medium text-amber-300' : 'text-zinc-300'
                          }`}
                        >
                          {val !== null && val !== undefined ? String(val) : '—'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
