import MapWorld, { ConflictSelector } from './MapWorld'
import IndicatorsStrip from './IndicatorsStrip'
import WorldWealthPanel from './WorldWealthPanel'
import { COUNTRIES, countriesForLang, fmtTriLang, fractionMetaForLang, type Country, type FractionKey } from '../data/countries'
import { StackedBar } from './DonutChart'
import ModeBadge from './ui/ModeBadge'
import { useApp } from '../store/useApp'
import { modRef } from '../data/modules'

/** Segmentos da rosca com os rótulos do nível de leitura atual. */
function useSegmentsOf() {
  const lang = useApp((s) => s.lang)
  const mode = useApp((s) => s.mode)
  const keys = Object.keys(COUNTRIES[0].fractions) as FractionKey[]
  return (c: Country) => keys.map((key) => {
    const meta = fractionMetaForLang(key, lang, mode === 'simples')
    return { key, label: meta.label, value: c.fractions[key], color: meta.color }
  })
}

/** HOME — "Mapa Geopolítico Interativo de Blocos e Fluxos de Capital" */
export default function MapModule() {
  const { basis, setBasis, openCountry, lang } = useApp()
  const segmentsOf = useSegmentsOf()
  const countries = countriesForLang(lang)
  const copy = lang === 'en'
    ? {
        title: 'The global capitalism board',
        intro: 'Each particle is wealth in motion: grain and ore moving out of the Global South, profits flowing north, dollars enforcing monetary power, and alternative routes trying to emerge. Click a bloc to see who holds power inside it.',
        nominal: 'Nominal GDP', read: 'How to read this map', quick: 'quick guide',
        guide: [
          ['Click/tap any country', 'colored countries open the full panel; gray countries show their ISO code for future data connections.'],
          ['Particles show the direction of money', 'commodities move out of the South, profits flow north, dollars carry monetary power, and the dashed cyan route represents BRICS payment alternatives.'],
          ['On desktop', 'scroll zooms and drag pans.'],
          ['On mobile', 'pinch with two fingers to zoom and drag with one finger; the bottom bar contains layers, legend and the tour.'],
          ['The “Bloc wars” buttons', 'highlight the routes of each conflict; each red particle represents weapons, money or energy in motion.'],
        ],
        warsAria: 'Bloc wars', wars: 'Bloc wars & proxy wars', anatomy: 'Bloc anatomy →', nominalOther: 'Nominal',
      }
    : lang === 'es'
      ? {
          title: 'El tablero del capitalismo global',
          intro: 'Cada partícula es riqueza en movimiento: granos y mineral saliendo del Sur Global, ganancias fluyendo hacia el norte, dólares imponiendo poder monetario y rutas alternativas intentando surgir. Haz clic en un bloque para ver quién concentra el poder dentro.',
          nominal: 'PIB nominal', read: 'Cómo leer este mapa', quick: 'guía rápida',
          guide: [
            ['Haz clic/toca cualquier país', 'los países coloreados abren el panel completo; los grises muestran su código ISO para futuras conexiones de datos.'],
            ['Las partículas muestran la dirección del dinero', 'commodities salen del Sur, ganancias fluyen hacia el norte, dólares transportan poder monetario y la ruta cian discontinua representa alternativas de pago BRICS.'],
            ['En computadora', 'la rueda hace zoom y arrastrar desplaza el mapa.'],
            ['En móvil', 'pellizca con dos dedos para hacer zoom y arrastra con uno; la barra inferior contiene capas, leyenda y tour.'],
            ['Los botones de “Guerras de bloques”', 'resaltan las rutas de cada conflicto; cada partícula roja representa armas, dinero o energía en movimiento.'],
          ],
          warsAria: 'Guerras de bloques', wars: 'Guerras de bloques y proxy wars', anatomy: 'Anatomía del bloque →', nominalOther: 'Nominal',
        }
      : {
          title: 'O tabuleiro do capitalismo global',
          intro: 'Cada partícula é riqueza em movimento: grãos e minério subindo do Sul Global, lucros vazando para o Norte, dólares impondo hegemonia — e rotas alternativas tentando nascer. Clique num bloco para ver quem manda dentro dele.',
          nominal: 'PIB Nominal', read: 'Como ler este mapa', quick: 'guia rápido',
          guide: [
            ['Clique/toque em qualquer país', 'os coloridos abrem o painel completo; os cinzas mostram o código ISO para conectar dados depois.'],
            ['As partículas mostram a direção do dinheiro', 'commodities subindo do Sul, lucros vazando para o Norte, dólares impondo hegemonia — e a roxa tracejada tentando furar o cerco (BRICS Pay).'],
            ['No computador', 'scroll dá zoom, arrastar move.'],
            ['No celular', 'pinch com 2 dedos dá zoom, 1 dedo move — e a barra inferior tem camadas, legenda e o tour.'],
            ['Os botões “Guerras de blocos”', 'acendem as rotas de cada conflito — cada partícula vermelha é arma, dinheiro ou energia em movimento.'],
          ],
          warsAria: 'Guerras de blocos', wars: 'Guerras de blocos & proxy wars', anatomy: 'Anatomia do bloco →', nominalOther: 'Nominal',
        }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">Home · {modRef('home', lang)}</span>
            <ModeBadge />
          </div>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">
            {copy.title}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
            {copy.intro}
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {(['nominal', 'ppp'] as const).map((b) => (
            <button key={b} onClick={() => setBasis(b)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                basis === b ? 'bg-money text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
              }`}>
              {b === 'nominal' ? copy.nominal : 'PPP'}
            </button>
          ))}
        </div>
      </header>

      <MapWorld />

      <details className="group rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-zinc-200">
          <span>{copy.read} <span className="ml-1.5 font-mono text-[9.5px] font-normal uppercase tracking-wider text-zinc-500">{copy.quick}</span></span>
          <span className="text-zinc-500 transition-transform group-open:rotate-180">▾</span>
        </summary>
        <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-zinc-400">
          <li><strong className="text-zinc-200">{copy.guide[0][0]}</strong> — {copy.guide[0][1]}</li>
          <li><strong className="text-zinc-200">{copy.guide[1][0]}</strong>: {copy.guide[1][1]}</li>
          <li><strong className="text-zinc-200">{copy.guide[2][0]}</strong>: {copy.guide[2][1]} <strong className="text-zinc-200">{copy.guide[3][0]}</strong>: {copy.guide[3][1]}</li>
          <li><strong className="text-zinc-200">{copy.guide[4][0]}</strong> {copy.guide[4][1]}</li>
        </ul>
      </details>

      <IndicatorsStrip />

      <WorldWealthPanel />

      <section aria-label={copy.warsAria}>
        <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          {copy.wars}
        </h3>
        <ConflictSelector />
      </section>

      <ComparisonStrip />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {countries.map((c) => {
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
              <div className="mt-3 font-mono text-2xl font-bold text-zinc-100">{fmtTriLang(gdp, lang)}</div>
              <div className="text-[11px] text-zinc-600">
                {basis === 'nominal' ? 'PPP' : copy.nominalOther}: <span className="font-mono">{fmtTriLang(other, lang)}</span>
              </div>
              <div className="mt-3">
                <StackedBar segments={segmentsOf(c)} />
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-money opacity-70 transition-opacity group-hover:opacity-100">
                {copy.anatomy}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ComparisonStrip() {
  const { openCountry, lang } = useApp()
  const segmentsOf = useSegmentsOf()
  const countries = countriesForLang(lang)
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 thin-scroll">
      {countries.map((c) => (
        <button key={c.id} onClick={() => openCountry(c.id)}
          className="w-36 shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-2 text-left hover:border-zinc-600">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-mono text-[11px] font-bold text-zinc-200">{c.code}</span>
            <span className="font-mono text-[10px] text-zinc-500">{fmtTriLang(c.gdpNominal, lang)}</span>
          </div>
          <StackedBar segments={segmentsOf(c)} />
        </button>
      ))}
    </div>
  )
}
