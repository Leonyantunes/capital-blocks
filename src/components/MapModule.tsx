import MapWorld, { ConflictSelector } from './MapWorld'
import IndicatorsStrip from './IndicatorsStrip'
import WorldWealthPanel from './WorldWealthPanel'
import { COUNTRIES, FRACTION_META, fmtTri } from '../data/countries'
import { StackedBar } from './DonutChart'
import ModeBadge from './ui/ModeBadge'
import { useApp } from '../store/useApp'
import { modRef } from '../data/modules'

function segmentsOf(c: (typeof COUNTRIES)[number]) {
  return (Object.keys(FRACTION_META) as (keyof typeof FRACTION_META)[]).map((f) => ({
    key: f,
    label: FRACTION_META[f].label,
    value: c.fractions[f],
    color: FRACTION_META[f].color,
  }))
}

/** HOME — "Mapa Geopolítico Interativo de Blocos e Fluxos de Capital" */
export default function MapModule() {
  const { basis, setBasis, openCountry } = useApp()

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">Home · {modRef('home')}</span>
            <ModeBadge />
          </div>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">
            O tabuleiro do capitalismo global
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Cada partícula é riqueza em movimento: grãos e minério subindo do Sul Global, lucros vazando para o
            Norte, dólares impondo hegemonia — e rotas alternativas tentando nascer. Clique num bloco para ver quem
            manda dentro dele.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {(['nominal', 'ppp'] as const).map((b) => (
            <button key={b} onClick={() => setBasis(b)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                basis === b ? 'bg-money text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}>
              {b === 'nominal' ? 'PIB Nominal' : 'PPP'}
            </button>
          ))}
        </div>
      </header>

      <MapWorld />

      <details className="group rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-zinc-200">
          <span>Como ler este mapa <span className="ml-1.5 font-mono text-[9.5px] font-normal uppercase tracking-wider text-zinc-500">guia rápido</span></span>
          <span className="text-zinc-500 transition-transform group-open:rotate-180">▾</span>
        </summary>
        <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-zinc-400">
          <li><strong className="text-zinc-200">Clique/toque em qualquer país</strong> — os coloridos abrem o painel completo; os cinzas mostram o código ISO para conectar dados depois.</li>
          <li><strong className="text-zinc-200">As partículas mostram a direção do dinheiro</strong>: commodities subindo do Sul, lucros vazando para o Norte, dólares impondo hegemonia — e a roxa tracejada tentando furar o cerco (BRICS Pay).</li>
          <li><strong className="text-zinc-200">No computador</strong>: scroll dá zoom, arrastar move. <strong className="text-zinc-200">No celular</strong>: pinch com 2 dedos dá zoom, 1 dedo move — e a barra inferior tem camadas, legenda e o tour.</li>
          <li><strong className="text-zinc-200">Os botões "Guerras de blocos"</strong> acendem as rotas de cada conflito — cada partícula vermelha é arma, dinheiro ou energia em movimento.</li>
        </ul>
      </details>

      <IndicatorsStrip />

      <WorldWealthPanel />

      <section aria-label="Guerras de blocos">
        <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Guerras de blocos & proxy wars
        </h3>
        <ConflictSelector />
      </section>

      <ComparisonStrip />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {COUNTRIES.map((c) => {
          const gdp = basis === 'nominal' ? c.gdpNominal : c.gdpPPP
          const other = basis === 'nominal' ? c.gdpPPP : c.gdpNominal
          return (
            <button key={c.id} onClick={() => openCountry(c.id)}
              className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-left transition-colors hover:border-money/50 hover:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-zinc-300 group-hover:bg-money/15 group-hover:text-money">
                  {c.code}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">{c.region}</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-zinc-100">{c.name}</h3>
              <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs leading-snug text-zinc-500">{c.profile}</p>
              <div className="mt-3 font-mono text-2xl font-bold text-zinc-100">{fmtTri(gdp)}</div>
              <div className="text-[11px] text-zinc-600">
                {basis === 'nominal' ? 'PPP' : 'Nominal'}: <span className="font-mono">{fmtTri(other)}</span>
              </div>
              <div className="mt-3">
                <StackedBar segments={segmentsOf(c)} />
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-money opacity-70 transition-opacity group-hover:opacity-100">
                Anatomia do bloco →
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ComparisonStrip() {
  const { openCountry } = useApp()
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 thin-scroll">
      {COUNTRIES.map((c) => (
        <button key={c.id} onClick={() => openCountry(c.id)}
          className="w-36 shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-2 text-left hover:border-zinc-600">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-mono text-[11px] font-bold text-zinc-200">{c.code}</span>
            <span className="font-mono text-[10px] text-zinc-500">{fmtTri(c.gdpNominal)}</span>
          </div>
          <StackedBar segments={segmentsOf(c)} />
        </button>
      ))}
    </div>
  )
}
