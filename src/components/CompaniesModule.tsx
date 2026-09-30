import { Fragment, memo, useEffect, useMemo, useState } from 'react'
import {
  COMPANIES_ALL, WORLD_AGGREGATES, WORLD_COMPANIES, brView, fmtBRL, metricsFor,
  type CompanyRecord,
} from '../data/companies'
import type { ValueDecomposition } from '../lib/companyMetrics'
import { MiniClock, UnpaidClock } from './Clocks'
import DonutChart from './DonutChart'
import Tip from './ui/Tip'
import ModeBadge from './ui/ModeBadge'
import { fmtHours } from '../lib/marx'
import { mt } from '../i18n'
import { useApp } from '../store/useApp'
import type { ApiProvider } from '../lib/marketApi/types'
import {
  loadCachedQuotes, loadSyncSettings, quotesToRecords, runSync, saveSyncSettings,
} from '../lib/marketApi/sync'

type Dataset = 'global' | 'brasil'
const PAGE = 40

function severityColor(taxa: number): string {
  if (taxa >= 1000) return '#f44336'
  if (taxa >= 400) return '#ffb300'
  if (taxa >= 200) return '#ffc107'
  return '#4caf50'
}

/* ───────────────────── linhas pré-computadas ───────────────────── */

interface RowBase {
  id: string
  nome: string
  setor: string
  ticker?: string
  nota?: string
  estimate?: boolean
  origem?: 'base' | 'api'
  fonte?: string
  d: ValueDecomposition
}

interface GlRow extends RowBase {
  pais: string
  capTri?: number
  receitaBi: number
  lucroBi: number
  funcionariosMil: number
  pctMktCap?: number
  anosReceita?: number
}

interface BrRow extends RowBase {
  produtividade: number
  taxaExploracao: number
  minutosNaoPagos: number
  dividendosBi: number
  receitaBi: number
  lucroBi: number
  funcionariosMil: number
  moeda: 'BRL' | 'USD'
}

/**
 * Base + cotações de API SEM duplicar: quando ticker (ou nome) coincide,
 * a cotação fresca da API substitui o registro da base — e empresas que só
 * existem na API entram no fim da lista.
 */
function mergeApiRecords(apiRecords: CompanyRecord[]): CompanyRecord[] {
  if (!apiRecords.length) return COMPANIES_ALL
  const key = (r: CompanyRecord) => (r.ticker ?? r.nome).trim().toUpperCase()
  const apiByKey = new Map(apiRecords.map((r) => [key(r), r]))
  const baseKeys = new Set(COMPANIES_ALL.map(key))
  const out: CompanyRecord[] = COMPANIES_ALL.map((r) => apiByKey.get(key(r)) ?? r)
  for (const [k, r] of apiByKey) if (!baseKeys.has(k)) out.push(r)
  return out
}

function buildGlRows(apiRecords: CompanyRecord[]): GlRow[] {
  return mergeApiRecords(apiRecords)
    .filter((r) => r.mercado === 'GLOBAL')
    .map((rec) => {
      const d = metricsFor(rec)
      return {
        id: rec.id, nome: rec.nome, pais: rec.pais, setor: rec.setor, ticker: rec.ticker,
        capTri: rec.capTri, receitaBi: rec.receitaBi, lucroBi: rec.lucroBi,
        funcionariosMil: rec.funcionariosMil, nota: rec.nota, estimate: rec.estimate,
        origem: rec.origem, fonte: rec.fonte, d,
        pctMktCap: rec.capTri !== undefined ? (rec.capTri / WORLD_AGGREGATES.marketCapMundialTri) * 100 : undefined,
        anosReceita: rec.capTri !== undefined && rec.receitaBi > 0 ? (rec.capTri * 1000) / rec.receitaBi : undefined,
      }
    })
}

function buildBrRows(apiRecords: CompanyRecord[]): BrRow[] {
  return mergeApiRecords(apiRecords)
    .filter((r) => r.mercado === 'BR')
    .map((rec) => {
      const v = brView(rec)
      return {
        id: rec.id, nome: rec.nome, setor: rec.setor, ticker: rec.ticker,
        produtividade: v.produtividade, taxaExploracao: v.taxaExploracao,
        minutosNaoPagos: v.minutosNaoPagos, dividendosBi: v.dividendosBi,
        receitaBi: rec.receitaBi, lucroBi: rec.lucroBi, funcionariosMil: rec.funcionariosMil,
        moeda: rec.moeda, nota: rec.nota, estimate: rec.estimate, origem: rec.origem,
        fonte: rec.fonte, d: metricsFor(rec),
      }
    })
}

/* ───────────────────── painel de fontes dinâmicas ───────────────────── */

function MarketSyncPanel({ records, onLoad }: {
  records: CompanyRecord[]
  onLoad: (recs: CompanyRecord[]) => void
}) {
  const [initial] = useState(loadSyncSettings)
  const [enabled, setEnabled] = useState(initial.enabled)
  const [provider, setProvider] = useState<ApiProvider>(initial.provider)
  const [token, setToken] = useState(initial.token)
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  /* cache válido? hidrata sem chamadas */
  useEffect(() => {
    const cached = loadCachedQuotes()
    if (!cached || !loadSyncSettings().enabled) return
    onLoad(quotesToRecords(cached))
    setStatus(`cache de ${new Date(cached.at).toLocaleString('pt-BR')} · ${cached.quotes.length} empresas`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = (next: { enabled?: boolean; provider?: ApiProvider; token?: string }) => {
    const s = { enabled, provider, token, ...next }
    setEnabled(s.enabled); setProvider(s.provider); setToken(s.token)
    saveSyncSettings(s)
  }

  const sync = async () => {
    if (syncing) return
    if (provider === 'alphavantage' && !token.trim()) {
      setStatus('Alpha Vantage exige a chave gratuita no campo acima.')
      return
    }
    setSyncing(true); setErrors([]); setStatus('sincronizando…')
    try {
      const res = await runSync(provider, token.trim())
      onLoad(quotesToRecords(res))
      setStatus(`${res.quotes.length} empresas recebidas · ${new Date(res.at).toLocaleTimeString('pt-BR')}`)
      setErrors(res.errors.slice(0, 3))
    } catch (e) {
      setStatus(null)
      setErrors([e instanceof Error ? e.message : 'falha desconhecida na sincronização'])
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <label className="flex cursor-pointer items-center gap-2.5">
        <button
          role="switch" aria-checked={enabled}
          onClick={() => persist({ enabled: !enabled })}
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${enabled ? 'left-[18px]' : 'left-0.5'}`} />
        </button>
        <span className="text-xs font-semibold text-zinc-200">⚡ Fontes dinâmicas de mercado</span>
        <span className="font-mono text-[10px] text-zinc-500">
          {records.length > 0 ? `${records.length} via API` : 'desligado'}
        </span>
      </label>

      {enabled && (
        <div className="mt-3 space-y-2.5 border-t border-zinc-800 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {([
              ['brapi', 'BRAPI · Brasil (B3, 1 chamada)'],
              ['alphavantage', 'Alpha Vantage · Globais'],
            ] as [ApiProvider, string][]).map(([p, label]) => (
              <button key={p} onClick={() => persist({ provider: p })}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  provider === p ? 'bg-money text-onaccent' : 'border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="password" value={token}
              onChange={(e) => persist({ token: e.target.value })}
              placeholder={provider === 'brapi' ? 'token brapi.dev (opcional na cota free)' : 'chave alphavantage.co (grátis)'}
              className="min-w-[220px] flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-money/60"
            />
            <a href={provider === 'brapi' ? 'https://brapi.dev' : 'https://www.alphavantage.co/support/#api-key'}
              target="_blank" rel="noreferrer"
              className="text-[11px] text-sky-400 underline decoration-dotted hover:text-sky-300">
              obter chave ↗
            </a>
            <button onClick={sync} disabled={syncing}
              className="rounded-lg bg-money px-3 py-1.5 text-xs font-bold text-onaccent transition-opacity hover:opacity-90 disabled:opacity-40">
              {syncing ? 'sincronizando…' : 'Sincronizar agora'}
            </button>
          </div>

          <p className="text-[10px] leading-relaxed text-zinc-500">
            Cotações entram no Raio-X com badge <span className="font-mono">API·est.</span>; fundamentais ausentes são
            estimados por margem/folha setoriais. Cache local de 24 h — nada é enviado para servidores próprios.
            {provider === 'alphavantage' && <> Cota free ≈ 20 empresas/dia (retome amanhã).</>}
          </p>

          {status && <p className="font-mono text-[10px] text-emerald-300">{status}</p>}
          {errors.map((er) => (
            <p key={er} className="font-mono text-[10px] text-amber-400">{er}</p>
          ))}
        </div>
      )}
    </div>
  )
}

/* ───────────────────── células GLOBAL ───────────────────── */

const GlCells = memo(function GlCells({ r }: { r: GlRow }) {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const eOk = Number.isFinite(r.d.e) && r.d.e > 0
  return (
    <>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-zinc-100">{r.nome}</span>
          {r.origem === 'api' ? (
            <Tip text={`Cotação dinâmica (${r.fonte}). Fundamentais ausentes estimados por setor.`}>
              <span className="rounded border border-sky-700 px-1 font-mono text-[9px] text-sky-400">API</span>
            </Tip>
          ) : r.estimate ? (
            <Tip text="Entrada ilustrativa para fins pedagógicos.">
              <span className="rounded border border-zinc-700 px-1 font-mono text-[9px] text-zinc-500">est.</span>
            </Tip>
          ) : null}
        </div>
        <span className="text-[10.5px] text-zinc-500">{r.setor} · {r.pais}</span>
      </td>
      <td className="px-3 py-2.5 text-right">
        {r.pctMktCap !== undefined ? (
          <Tip text={`${r.pctMktCap.toFixed(1)}% de todo o mercado acionário mundial`}>
            <span className="cursor-help font-mono text-[13px] font-bold text-fuchsia-300">
              ${r.capTri!.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} tri
            </span>
          </Tip>
        ) : <span className="text-zinc-600">—</span>}
      </td>
      <td className="px-3 py-2.5 text-right font-mono text-[13px] text-zinc-200">
        ${r.receitaBi > 0 ? r.receitaBi.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '—'}
      </td>
      <td className="px-3 py-2.5 text-right font-mono text-[13px] text-emerald-300">
        ${r.lucroBi.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
      </td>
      <td className="px-3 py-2.5 text-right font-mono text-[13px] text-zinc-300">
        {r.funcionariosMil > 0 ? `${(r.funcionariosMil / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} mi` : '—'}
      </td>
      <td className="px-3 py-2.5">
        <Tip text={eOk
          ? `Exploração ESTIMADA pela decomposição W=c+v+m (${fmtHours(r.d.minutesUnpaid / 60)} não pagas em jornada de 8h). Salário médio assumido por país/setor.`
          : 'Sem folha estimável para este registro — exploração não calculada.'}>
          <span className="inline-flex cursor-help items-center gap-2">
            <MiniClock minutesUnpaid={eOk ? r.d.minutesUnpaid : 0} />
            <span className="font-mono text-[12.5px] font-bold" style={{ color: severityColor(Math.min(r.d.e, 1500)) }}>
              {eOk ? `${r.d.e.toFixed(0)}%` : '—'}
            </span>
          </span>
        </Tip>
      </td>
      <td className="px-3 py-2.5 text-right">
        {r.anosReceita !== undefined ? (
          <Tip text={`O mercado paga ${r.anosReceita.toFixed(1)} anos da receita atual pela empresa — quanto maior, mais expectativa (fictício) embutida. ${didatico ? '' : '(capitalização/receita)'}`}>
            <span className="cursor-help font-mono text-[13px] font-bold text-sky-300">{r.anosReceita.toFixed(1)}×</span>
          </Tip>
        ) : <span className="text-zinc-600">—</span>}
      </td>
    </>
  )
})

const GlCardM = memo(function GlCardM({ r }: { r: GlRow }) {
  const eOk = Number.isFinite(r.d.e) && r.d.e > 0
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-zinc-100">
            {r.nome} {r.origem === 'api' && <sup className="font-mono text-[9px] text-sky-400">API</sup>}
          </h4>
          <span className="text-[10.5px] text-zinc-500">{r.setor} · {r.pais}</span>
        </div>
        <MiniClock minutesUnpaid={eOk ? r.d.minutesUnpaid : 0} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-zinc-950/60 p-2">
          <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">Valor de mercado</div>
          <div className="font-mono text-lg font-bold text-fuchsia-300">
            {r.capTri !== undefined ? `$${r.capTri.toLocaleString('pt-BR')} tri` : '—'}
          </div>
          <div className="text-[9.5px] text-zinc-500">{r.pctMktCap?.toFixed(1) ?? '—'}% do mundo</div>
        </div>
        <div className="rounded-lg bg-zinc-950/60 p-2">
          <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">Exploração (est.)</div>
          <div className="font-mono text-lg font-bold" style={{ color: severityColor(Math.min(r.d.e, 1500)) }}>
            {eOk ? `${r.d.e.toFixed(0)}%` : '—'}
          </div>
          <div className="font-mono text-[9.5px] text-emerald-300">{fmtHours(r.d.minutesUnpaid / 60)} não pagas</div>
        </div>
        <div className="text-[11px] text-zinc-400">Receita: <span className="font-mono text-zinc-200">${r.receitaBi.toLocaleString('pt-BR')} bi</span></div>
        <div className="text-right text-[11px] text-zinc-400">Lucro: <span className="font-mono text-emerald-300">${r.lucroBi.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi</span></div>
      </div>
    </div>
  )
})

/* ───────────────────── células BRASIL ───────────────────── */

const BrCells = memo(function BrCells({ r }: { r: BrRow }) {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const prodOk = r.funcionariosMil > 0
  return (
    <>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-zinc-100">{r.nome}</span>
          {r.ticker && <span className="rounded bg-zinc-800 px-1 font-mono text-[9px] text-zinc-500">{r.ticker}</span>}
          {r.origem === 'api' ? (
            <Tip text={`Cotação dinâmica (${r.fonte}).`}>
              <span className="rounded border border-sky-700 px-1 font-mono text-[9px] text-sky-400">API</span>
            </Tip>
          ) : r.estimate ? (
            <Tip text="Valores aproximados das demonstrações FY2024 — ver fonte na linha expandida.">
              <span className="rounded border border-zinc-700 px-1 font-mono text-[9px] text-zinc-500">est.</span>
            </Tip>
          ) : null}
        </div>
        <span className="text-[10.5px] text-zinc-500">{r.setor}</span>
      </td>
      <td className="px-3 py-2.5 text-right">
        {prodOk ? (
          <Tip text={didatico ? 'Quanto riqueza cada trabalhador gera por ano, em média.' : 'Valor novo (v+m) produzido por trabalhador/ano.'}>
            <span className="font-mono text-[13px]">{fmtBRL(r.produtividade)}</span>
          </Tip>
        ) : <span className="text-zinc-600">—</span>}
      </td>
      <td className="px-3 py-2.5 text-right">
        <Tip text={didatico
          ? 'De cada R$1 pago de salário, este é o número de reais de lucro que a empresa extrai do trabalho.'
          : 'e = m/v: mais-valia dividida pelo capital variável (%).'}>
          <span className="font-mono text-[13px] font-bold" style={{ color: severityColor(r.taxaExploracao) }}>
            {Number.isFinite(r.taxaExploracao) ? `${r.taxaExploracao.toLocaleString('pt-BR')}%` : '—'}
          </span>
        </Tip>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-2">
          <Tip text={`Numa jornada de 8h, ${fmtHours(r.minutosNaoPagos / 60)} são trabalho gratuito para a empresa.`}>
            <MiniClock minutesUnpaid={r.minutosNaoPagos} />
          </Tip>
          <span className="font-mono text-[12.5px] text-emerald-300">{fmtHours(r.minutosNaoPagos / 60)}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-right">
        {r.dividendosBi > 0 ? (
          <Tip text={didatico ? 'Lucro distribuído aos donos — parte pode vazar para o exterior.' : 'Massa de mais-valia distribuída como dividendos no exercício.'}>
            <span className="cursor-help font-mono text-[13px] text-fuchsia-300">
              R$ {r.dividendosBi.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} bi
            </span>
          </Tip>
        ) : <span className="text-zinc-600">—</span>}
      </td>
    </>
  )
})

const BrCardM = memo(function BrCardM({ r }: { r: BrRow }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-zinc-100">
            {r.nome} {r.ticker && <sup className="font-mono text-[9px] text-zinc-500">{r.ticker}</sup>}
            {(r.origem === 'api' || r.estimate) && (
              <sup className={`ml-1 font-mono text-[9px] ${r.origem === 'api' ? 'text-sky-400' : 'text-zinc-500'}`}>
                {r.origem === 'api' ? 'API' : 'est.'}
              </sup>
            )}
          </h4>
          <span className="text-[10.5px] text-zinc-500">{r.setor}</span>
        </div>
        <MiniClock minutesUnpaid={r.minutosNaoPagos} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-zinc-950/60 p-2">
          <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">Exploração m/v</div>
          <div className="font-mono text-lg font-bold" style={{ color: severityColor(r.taxaExploracao) }}>
            {Number.isFinite(r.taxaExploracao) ? `${r.taxaExploracao.toLocaleString('pt-BR')}%` : '—'}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950/60 p-2">
          <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">Não pago · 8h</div>
          <div className="font-mono text-lg font-bold text-emerald-300">{fmtHours(r.minutosNaoPagos / 60)}</div>
        </div>
        <div className="text-[11px] text-zinc-400">
          Produt.: {r.funcionariosMil > 0 ? <span className="font-mono text-zinc-200">{fmtBRL(r.produtividade)}</span> : '—'}
        </div>
        <div className="text-right text-[11px] text-zinc-400">
          Divid.: {r.dividendosBi > 0 ? <span className="font-mono text-fuchsia-300">R$ {r.dividendosBi.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi</span> : '—'}
        </div>
      </div>
    </div>
  )
})

/* ───────────────────── linha expandida (raio-X completo) ───────────────────── */

function ExpandedRow({ segments, centerLabel, centerValue, notes, bars, texto, colSpan = 7 }: {
  segments: { key: string; label: string; value: number; color: string }[]
  centerLabel: string
  centerValue: string
  notes: React.ReactNode
  bars?: React.ReactNode
  texto: string
  /** nº de colunas da tabela (global = 7, brasil = 5) */
  colSpan?: number
}) {
  return (
    <tr className="bg-zinc-950/70">
      <td colSpan={colSpan} className="border-t border-zinc-800/60 px-4 py-4">
        <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex items-center gap-3">
            <DonutChart segments={segments} centerLabel={centerLabel} centerValue={centerValue} />
            <ul className="space-y-1 text-[11px]">
              {segments.map((s) => (
                <li key={s.key} className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />{s.label}:{' '}
                  <span className="font-mono font-bold">{s.value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi</span>
                </li>
              ))}
              <li className="max-w-[340px] pt-1 text-[10px] leading-snug text-zinc-500">{notes}</li>
            </ul>
          </div>
          <div className="space-y-2">
            {bars}
            <p className="rounded-lg bg-zinc-900/80 p-2.5 text-[11px] leading-relaxed text-zinc-400">{texto}</p>
          </div>
        </div>
      </td>
    </tr>
  )
}

function BarLine({ label, value, color, hint }: { label: string; value: number; color: string; hint: string }) {
  return (
    <Tip text={hint}>
      <div className="cursor-help">
        <div className="mb-0.5 flex justify-between text-[10.5px]">
          <span className="text-zinc-400">{label}</span>
          <span className="font-mono font-bold" style={{ color }}>{value.toFixed(2)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
        </div>
      </div>
    </Tip>
  )
}

/* ───────────────────── MÓDULO ───────────────────── */

type SortGl = 'capTri' | 'receitaBi' | 'lucroBi' | 'funcionariosMil' | 'exploracao' | 'anosReceita'
const SORT_GL: Record<SortGl, string> = {
  capTri: 'Valor de mercado',
  receitaBi: 'Receita anual',
  lucroBi: 'Lucro líquido',
  funcionariosMil: 'Funcionários',
  exploracao: 'Taxa exploração (est.)',
  anosReceita: 'Mercado ÷ Receita',
}
type SortBr = 'taxaExploracao' | 'produtividade' | 'minutosNaoPagos' | 'dividendosBi'
const SORT_BR: Record<SortBr, string> = {
  taxaExploracao: 'Taxa de exploração',
  produtividade: 'Produtividade/trabalhador',
  minutosNaoPagos: 'Horas não pagas',
  dividendosBi: 'Dividendos pagos',
}

export default function CompaniesModule() {
  const lang = useApp((s) => s.lang)
  const [dataset, setDataset] = useState<Dataset>('global')
  const [apiRecords, setApiRecords] = useState<CompanyRecord[]>([])
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('todas')
  const [sortGl, setSortGl] = useState<{ key: SortGl; dir: 1 | -1 }>({ key: 'capTri', dir: -1 })
  const [sortBr, setSortBr] = useState<{ key: SortBr; dir: 1 | -1 }>({ key: 'taxaExploracao', dir: -1 })
  const [expanded, setExpanded] = useState<string | null>(null)
  const [page, setPage] = useState(PAGE)

  /* listas completas (base + API) pré-computadas UMA vez */
  const allGl = useMemo(() => buildGlRows(apiRecords), [apiRecords])
  const allBr = useMemo(() => buildBrRows(apiRecords), [apiRecords])

  const sectors = useMemo(
    () => Array.from(new Set((dataset === 'global' ? allGl : allBr).map((r) => r.setor))).sort(),
    [dataset, allGl, allBr],
  )

  /* filtro + ordenação + paginação */
  const q = query.trim().toLowerCase()

  /* síntese global: base estática + registros dinâmicos */
  const wsFull = useMemo(() => {
    const apiGl = apiRecords.filter((r) => r.mercado === 'GLOBAL')
    const cap = WORLD_COMPANIES.reduce((s, c) => s + (c.capTri ?? 0), 0) + apiGl.reduce((s, r) => s + (r.capTri ?? 0), 0)
    const rec = WORLD_COMPANIES.reduce((s, c) => s + c.receitaBi, 0) + apiGl.reduce((s, r) => s + r.receitaBi, 0)
    const luc = WORLD_COMPANIES.reduce((s, c) => s + Math.max(c.lucroBi, 0), 0) + apiGl.reduce((s, r) => s + Math.max(r.lucroBi, 0), 0)
    const emp = WORLD_COMPANIES.reduce((s, c) => s + c.funcionariosMil, 0) + apiGl.reduce((s, r) => s + r.funcionariosMil, 0)
    return {
      capTri: cap,
      pctMarketCapMundial: (cap / WORLD_AGGREGATES.marketCapMundialTri) * 100,
      receitaBi: rec,
      pctPibMundial: (rec / (WORLD_AGGREGATES.pibMundialTri * 1000)) * 100,
      lucroBi: luc,
      funcionariosMil: emp,
      total: WORLD_COMPANIES.length + apiGl.length,
    }
  }, [apiRecords])

  const filteredGl = useMemo(() => {
    const val = (r: GlRow): number => {
      switch (sortGl.key) {
        case 'exploracao': return Number.isFinite(r.d.e) ? r.d.e : -1
        case 'anosReceita': return r.anosReceita ?? -1
        case 'capTri': return r.capTri ?? -1
        default: return r[sortGl.key]
      }
    }
    return allGl
      .filter((r) => sector === 'todas' || r.setor === sector)
      .filter((r) => !q || `${r.nome} ${r.pais}`.toLowerCase().includes(q))
      .sort((a, b) => sortGl.dir * (val(a) - val(b)))
  }, [allGl, q, sector, sortGl])

  const filteredBr = useMemo(() =>
    allBr
      .filter((r) => sector === 'todas' || r.setor === sector)
      .filter((r) => !q || r.nome.toLowerCase().includes(q))
      .sort((a, b) => sortBr.dir * (a[sortBr.key] - b[sortBr.key]))
  , [allBr, q, sector, sortBr])

  const rowsCount = dataset === 'global' ? filteredGl.length : filteredBr.length
  const visibleGl = useMemo(() => filteredGl.slice(0, page), [filteredGl, page])
  const visibleBr = useMemo(() => filteredBr.slice(0, page), [filteredBr, page])

  useEffect(() => { setPage(PAGE) }, [dataset, query, sector, sortGl, sortBr])

  const toggleSortGl = (key: SortGl) =>
    setSortGl((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: -1 }))
  const toggleSortBr = (key: SortBr) =>
    setSortBr((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: -1 }))

  const topBr = useMemo(() => filteredBr.reduce<BrRow | null>(
    (a, b) => (!a || b.taxaExploracao > a.taxaExploracao ? b : a), null), [filteredBr])

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">{mt(lang, 'companies').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'companies').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Das maiores do Brasil às maiores do planeta — todas decompostas pelo mesmo motor{' '}
          <span className="font-mono text-zinc-300">W&nbsp;=&nbsp;c+v+m</span>: quem extrai mais trabalho não pago,
          quanto cada gigante representa do mercado mundial — e quanto de "promessa" está embutido no preço.
        </p>
      </header>

      {/* controles */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {(['global', 'brasil'] as Dataset[]).map((ds) => (
            <button key={ds} onClick={() => { setDataset(ds); setSector('todas'); setQuery('') }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                dataset === ds ? 'bg-money text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
              }`}>
              {ds === 'global'
                ? `Maiores do Mundo (${filteredGl.length})`
                : `Brasil (${filteredBr.length})`}
            </button>
          ))}
        </div>

        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder={dataset === 'global' ? 'Pesquisar empresa/país…' : 'Pesquisar empresa/ticker…'}
          className="w-52 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-money/60" />

        <select value={sector} onChange={(e) => setSector(e.target.value)}
          aria-label="Filtrar por setor"
          className="h-[34px] cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-300 outline-none focus:border-money/60">
          <option value="todas">Todos os setores ({sectors.length})</option>
          {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="ml-auto w-full sm:w-auto sm:min-w-[280px]">
          <MarketSyncPanel records={apiRecords} onLoad={setApiRecords} />
        </div>
      </div>

      {dataset === 'brasil' ? (
        <>
          {topBr && (
            <div className="flex flex-wrap items-center gap-4 rounded-xl border p-4" style={{ borderColor: '#f4433655', background: '#f443360d' }}>
              <UnpaidHero minutes={topBr.minutosNaoPagos} nome={topBr.nome} taxa={topBr.taxaExploracao} />
              <p className="min-w-[240px] flex-1 text-xs leading-relaxed text-zinc-300">
                <strong className="text-red-300">{topBr.nome}</strong> lidera a amostra brasileira:{' '}
                {Number.isFinite(topBr.taxaExploracao) ? `${topBr.taxaExploracao.toLocaleString('pt-BR')}% de exploração` : 'exploração não calculável'} — o trabalho pago se esgota em{' '}
                <span className="font-mono">{fmtHours((480 - topBr.minutosNaoPagos) / 60)}</span> da jornada.
              </p>
            </div>
          )}

          <div className="hidden overflow-x-auto rounded-xl border border-zinc-800 md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-3 py-2.5">Empresa</th>
                  {(Object.keys(SORT_BR) as SortBr[]).map((k) => (
                    <th key={k} className="cursor-pointer select-none px-3 py-2.5 text-right hover:text-zinc-300"
                      onClick={() => toggleSortBr(k)}>
                      {SORT_BR[k]} {sortBr.key === k && (sortBr.dir === -1 ? '▼' : '▲')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {visibleBr.map((r) => (
                  <Fragment key={r.id}>
                    <tr onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className={`cursor-pointer transition-colors hover:bg-zinc-900/70 ${expanded === r.id ? 'bg-zinc-900/60' : ''}`}>
                      <BrCells r={r} />
                    </tr>
                    {expanded === r.id && <ExpandedBrRow r={r} />}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:hidden">
            {visibleBr.map((r) => <BrCardM key={r.id} r={r} />)}
          </div>
        </>
      ) : (
        <>
          {/* síntese global */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <SumCard label={`Valor somado das ${wsFull.total}`} value={`US$ ${wsFull.capTri.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} tri`} sub={`${wsFull.pctMarketCapMundial.toFixed(0)}% do mercado acionário mundial`} color="text-fuchsia-300" tip={`Somando os valores de mercado das mega-caps rastreadas (incluindo fontes dinâmicas), chega-se a uma fração enorme de TODAS as empresas listadas do planeta.`} />
            <SumCard label="Receitas anuais somadas" value={`US$ ${(wsFull.receitaBi / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tri`} sub={`${wsFull.pctPibMundial.toFixed(1)}% do PIB mundial`} color="text-emerald-300" tip="O fluxo produtivo/comercial organizado por essas empresas equivale a vários 'Brasis' por ano." />
            <SumCard label="Lucros apropriados" value={`US$ ${(wsFull.lucroBi / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tri/ano`} sub="massa de mais-valia capturada" color="text-money" tip="Lucro líquido anual somado: a mais-valia que vira dividendos, buybacks e poder de compra dos acionistas." />
            <SumCard label="Força de trabalho" value={`${(wsFull.funcionariosMil / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`} sub="empregados diretos" color="text-red-300" tip="Trabalhadores diretamente empregados — fora disso, cadeias inteiras de terceirizados." />
          </div>

          {/* tabela global */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-3 py-2.5">Empresa (clique p/ raio-X)</th>
                  {(Object.keys(SORT_GL) as SortGl[]).map((k) => (
                    <th key={k} className="cursor-pointer select-none px-3 py-2.5 text-right hover:text-zinc-300"
                      onClick={() => toggleSortGl(k)}>
                      {SORT_GL[k]} {sortGl.key === k && (sortGl.dir === -1 ? '▼' : '▲')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {visibleGl.map((r) => (
                  <Fragment key={r.id}>
                    <tr onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className={`cursor-pointer transition-colors hover:bg-zinc-900/70 ${expanded === r.id ? 'bg-zinc-900/60' : ''}`}>
                      <GlCells r={r} />
                    </tr>
                    {expanded === r.id && <ExpandedGlRow r={r} />}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid gap-3 sm:grid-cols-2">
            {visibleGl.map((r) => <GlCardM key={r.id} r={r} />)}
          </div>

          <p className="text-[10px] leading-relaxed text-zinc-600">
            Base estática: relatórios anuais FY2024/FY2025 (10-K/20-F) e market caps dez/2025; Brasil em DFs FY2024.
            Taxa de exploração derivada do modelo W=c+v+m com remuneração média ESTIMADA por país/setor — ver
            DATA-GUIDELINES §9. Registros <span className="font-mono">API·est.</span> usam cotações dinâmicas com
            fundamentais estimados por setor. Clique numa linha para abrir o raio-X completo.
          </p>
        </>
      )}

      {rowsCount > (dataset === 'global' ? visibleGl.length : visibleBr.length) && (
        <button onClick={() => setPage((p) => p + PAGE)}
          className="mx-auto rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-money/60 hover:text-money">
          Mostrar mais {Math.min(PAGE, rowsCount - (dataset === 'global' ? visibleGl.length : visibleBr.length))} de{' '}
          {rowsCount - (dataset === 'global' ? visibleGl.length : visibleBr.length)} restantes ↓
        </button>
      )}
    </div>
  )
}

function ExpandedGlRow({ r }: { r: GlRow }) {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const segments = [
    { key: 'c', label: 'Insumos + máquinas consumidas (c)', value: r.d.c, color: '#2196f3' },
    { key: 'v', label: 'Folha de salários (v)', value: r.d.v, color: '#f44336' },
    { key: 'm', label: 'Lucro apropriado (m)', value: r.d.m, color: '#4caf50' },
  ]
  const folhaMediaK = r.funcionariosMil > 0 ? ((r.d.v * 1e6) / r.funcionariosMil / 1000).toFixed(0) : null
  return (
    <ExpandedRow
      segments={segments} centerLabel="receita W" centerValue="= c+v+m"
      notes={
        <>
          Modelo contábil-documentado (DATA-GUIDELINES §9).{' '}
          {folhaMediaK !== null && <>Salário médio <span className="font-mono">$ {folhaMediaK}k/ano</span> é estimativa país/setor — badge est./API.</>}
          {' '}Sem headcount da API, v é estimado pelo share setorial de folha.
          {r.fonte && <> Fonte: <em>{r.fonte}</em>.</>}
          {r.nota && <> Nota: <em>{r.nota}</em>.</>}
        </>
      }
      bars={r.pctMktCap !== undefined && (
        <>
          <BarLine label="% do mercado acionário MUNDIAL" value={r.pctMktCap} color="#ba68c8"
            hint={`${r.nome} sozinha equivale a ${r.pctMktCap.toFixed(1)}% de todas as empresas listadas do planeta`} />
          <BarLine label="% do PIB mundial (fluxo de receita)" value={(r.receitaBi / (WORLD_AGGREGATES.pibMundialTri * 1000)) * 100} color="#4caf50"
            hint={`A receita anual da ${r.nome} move ${((r.receitaBi / (WORLD_AGGREGATES.pibMundialTri * 1000)) * 100).toFixed(2)}% do que o mundo inteiro produz em um ano`} />
        </>
      )}
      texto={didatico
        ? `Traduzindo: o mercado avalia ${r.nome} em ${r.capTri?.toLocaleString('pt-BR') ?? '?'} trilhões — uma promessa sobre lucros futuros que vale ${r.anosReceita?.toFixed(1) ?? '?'} anos da sua produção atual. Quanto maior esse número sem aumento de produção real, mais "ar fictício" tem o preço.`
        : `Capitalização/receita = ${r.anosReceita?.toFixed(1) ?? '?'}×: prêmio de expectativa sobre fluxos futuros de m. Extensão do fictício embutido no preço do título de propriedade.`}
    />
  )
}

function ExpandedBrRow({ r }: { r: BrRow }) {
  const segments = [
    { key: 'c', label: 'Insumos + máquinas consumidas (c)', value: r.d.c, color: '#2196f3' },
    { key: 'v', label: 'Folha de salários (v)', value: r.d.v, color: '#f44336' },
    { key: 'm', label: 'Lucro apropriado (m)', value: r.d.m, color: '#4caf50' },
  ]
  return (
    <ExpandedRow
      colSpan={5}
      segments={segments} centerLabel="receita W" centerValue="= c+v+m"
      notes={
        <>
          Decomposição unificada em R$ bi (mesmo motor da tabela global).
          {r.funcionariosMil > 0 && <> Folha média ≈ <span className="font-mono">R$ {((r.d.v * 1e6) / r.funcionariosMil).toFixed(0)}k/ano</span> (est.).</>}
          {r.fonte && <> Fonte: <em>{r.fonte}</em>.</>}
          {r.nota && <> Nota: <em>{r.nota}</em>.</>}
        </>
      }
      texto={`Raio-X completo: de cada R$100 de receita, ~${((r.d.v / Math.max(r.receitaBi, 1e-9)) * 100).toFixed(1)} vão para salários e ~${((r.d.m / Math.max(r.receitaBi, 1e-9)) * 100).toFixed(1)} viram lucro dos donos — o resto paga insumos, máquinas e depreciação (c).`}
    />
  )
}

function SumCard({ label, value, sub, color, tip }: { label: string; value: string; sub: string; color: string; tip?: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">{label}</div>
      <Tip text={tip ?? ''}>
        <div className={`mt-1 cursor-help font-mono text-lg font-extrabold ${color}`}>{value}</div>
      </Tip>
      <div className="mt-0.5 text-[10px] text-zinc-500">{sub}</div>
    </div>
  )
}

function UnpaidHero({ minutes, nome, taxa }: { minutes: number; nome: string; taxa: number }) {
  return (
    <div className="flex items-center gap-3">
      <UnpaidClock minutesUnpaid={minutes} size={150} />
      <div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-500">Campeã de exploração (BR)</div>
        <div className="text-sm font-bold text-zinc-100">{nome}</div>
        <div className="font-mono text-2xl font-extrabold text-red-400">
          {Number.isFinite(taxa) ? `${taxa.toLocaleString('pt-BR')}%` : '—'}
        </div>
      </div>
    </div>
  )
}
