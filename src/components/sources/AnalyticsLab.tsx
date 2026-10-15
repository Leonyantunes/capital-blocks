import { useState, useEffect } from 'react'
import { PRESET_QUERIES, type PresetQuery } from '../../data/analyticsDatasets'
import { runSqlQuery, type QueryResult } from '../../lib/duckdb/duckdbClient'
import { pick } from '../../i18n'
import { useApp } from '../../store/useApp'

export default function AnalyticsLab() {
  const lang = useApp((s) => s.lang)
  const [selectedPreset, setSelectedPreset] = useState<PresetQuery>(PRESET_QUERIES[0])
  const [sql, setSql] = useState<string>(PRESET_QUERIES[0].sql)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleExecute = async (customSql?: string) => {
    const queryToRun = customSql ?? sql
    setError(null)
    setIsLoading(true)
    try {
      const res = await runSqlQuery(queryToRun)
      setResult(res)
    } catch (err: any) {
      setError(err?.message || 'Erro ao executar consulta SQL.')
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
    handleExecute(preset.sql)
  }

  const handleExportCsv = () => {
    if (!result || result.rows.length === 0) return
    const header = result.columns.join(',')
    const rows = result.rows.map((row) =>
      result.columns
        .map((col) => {
          const val = row[col] ?? ''
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        })
        .join(',')
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([header, ...rows].join('\n'))
    const link = document.createElement('a')
    link.setAttribute('href', csvContent)
    link.setAttribute('download', `capital-blocks-${selectedPreset.id}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
      {/* Cabeçalho do Laboratório */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
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
              'Execute consultas relacionais de alto desempenho diretamente na memória do seu dispositivo. Zero requisições a servidores externos; privacidade e processamento colunar de alta velocidade.',
              'Execute high-performance relational queries directly in your device memory. Zero external server requests; full privacy and fast columnar analytics.',
              'Ejecute consultas relacionales de alto rendimiento directamente en la memoria de su dispositivo. Cero solicitudes a servidores externos.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-400">
            WASM SIMD 64-bit
          </span>
          <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
            Engine: DuckDB-Wasm
          </span>
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
              className={`flex flex-col rounded-xl border p-3 text-left transition-all ${
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
          <span>{result ? `${result.rowCount} linhas em ${result.durationMs}ms` : ''}</span>
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
              {result?.isFallback ? '⚡ Modo fallback analítico em memória JS' : '🚀 Executando nativamente no DuckDB Web Worker'}
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

              <button
                type="button"
                onClick={() => handleExecute()}
                disabled={isLoading}
                className="rounded-lg bg-money px-4 py-1.5 text-xs font-bold text-onaccent shadow-md transition-colors hover:bg-money/90 disabled:opacity-50"
              >
                {isLoading ? '⏳ Processando…' : '▶ Executar SQL'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exibição de Erros */}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 font-mono text-xs text-red-300">
          ❌ {error}
        </div>
      )}

      {/* Tabela de Resultados */}
      {result && result.rows.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Resultados da Consulta</span>
            <span className="font-mono text-[11px] text-zinc-500">Mostrando {result.rowCount} registros</span>
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
