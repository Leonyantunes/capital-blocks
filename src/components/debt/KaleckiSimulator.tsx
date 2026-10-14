import { useState } from 'react'
import { m } from 'framer-motion'
import Tip from '../ui/Tip'
import { locale, pick } from '../../i18n'
import { useApp } from '../../store/useApp'

/**
 * PILAR 2 — Equação kaleckiana dos lucros (simulador):
 *   Π ≈ I + (G−T) + NX + C_cap − S_trab
 * "Os trabalhadores gastam o que ganham; os capitalistas ganham o que gastam."
 */

const DEFAULTS = { investimento: 18, deficit: 6, nx: 2, consumoCap: 12, poupancaTrab: 3 }

const SCENARIOS: { id: string; label: string; v: typeof DEFAULTS; hint: string }[] = [
  { id: 'normal', label: 'Economia normal', v: DEFAULTS, hint: 'fluxo equilibrado' },
  { id: 'crise', label: 'Crise', v: { investimento: 8, deficit: 6, nx: 2, consumoCap: 10, poupancaTrab: 3 }, hint: 'empresários assustados param de investir' },
  { id: 'austeridade', label: 'Austeridade', v: { investimento: 8, deficit: 0, nx: 2, consumoCap: 10, poupancaTrab: 3 }, hint: 'Estado corta gastos na pior hora' },
  { id: 'estimulo', label: 'Estímulo fiscal', v: { investimento: 12, deficit: 12, nx: 2, consumoCap: 12, poupancaTrab: 3 }, hint: 'Estado injeta demanda' },
]

export default function KaleckiSimulator() {
  const lang = useApp((s) => s.lang)
  const loc = locale(lang)
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const [p, setP] = useState(DEFAULTS)
  const set = <K extends keyof typeof DEFAULTS>(k: K) => (v: number) => setP((s) => ({ ...s, [k]: v }))
  const pi = p.investimento + p.deficit + p.nx + p.consumoCap - p.poupancaTrab

  const rows = [
    { label: tr('Investimento privado (I)', 'Private investment (I)', 'Inversión privada (I)'), v: p.investimento, color: '#42a5f5', tip: tr('Gasto dos capitalistas em máquinas e construção: cria demanda E capacidade.', 'Capitalists’ spending on machinery and construction creates both demand AND capacity.', 'El gasto de los capitalistas en maquinaria y construcción crea demanda Y capacidad.') },
    { label: tr('Déficit público (G − T)', 'Public deficit (G − T)', 'Déficit público (G − T)'), v: p.deficit, color: '#9c27b0', tip: tr('O Estado injeta renda líquida — sustenta vendas e margens quando o privado recua.', 'The state injects net income — supporting sales and margins when private spending retreats.', 'El Estado inyecta ingreso neto — sostiene ventas y márgenes cuando retrocede el gasto privado.') },
    { label: tr('Exportações líquidas (X − M)', 'Net exports (X − M)', 'Exportaciones netas (X − M)'), v: p.nx, color: '#ffc107', tip: tr('Demanda estrangeira líquida soma aos lucros domésticos.', 'Net foreign demand adds to domestic profits.', 'La demanda externa neta se suma a los beneficios internos.') },
    { label: tr('Consumo dos capitalistas', 'Capitalist consumption', 'Consumo de los capitalistas'), v: p.consumoCap, color: '#ba68c8', tip: tr('Iates, dividendos gastos, festas: também são receita de alguém.', 'Yachts, spent dividends and parties are someone else’s revenue too.', 'Yates, dividendos gastados y fiestas también son ingresos para alguien.') },
    { label: tr('(−) Poupança dos trabalhadores', '(−) Workers’ saving', '(−) Ahorro de los trabajadores'), v: -p.poupancaTrab, color: '#f44336', tip: tr('Cada real não gasto pelos trabalhadores deixa de virar venda — e portanto lucro. Paradoxo da parcimônia!', 'Every unit workers do not spend fails to become a sale — and therefore profit. The paradox of thrift!', 'Cada unidad que los trabajadores no gastan deja de convertirse en venta — y por tanto en beneficio. ¡Paradoja del ahorro!') },
  ]
  const rowTips = {
    investimento: rows[0].tip,
    deficit: rows[1].tip,
    nx: rows[2].tip,
    consumoCap: rows[3].tip,
    poupancaTrab: rows[4].tip,
  }
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.v)), Math.abs(pi), 1)

  return (
    <section className="rounded-xl border border-money/30 bg-money/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-1.5">
        <h3 className="text-sm font-bold text-zinc-100">
          {tr('Por que os capitalistas amam o déficit (e fingem que odeiam) — Kalecki', 'Why capitalists love deficits (and pretend to hate them) — Kalecki', 'Por qué los capitalistas aman el déficit (y fingen odiarlo) — Kalecki')}
        </h3>
        <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
          Π ≈ I + (G−T) + X−M + C<sub>cap</sub> − S<sub>trab</sub> · % do PIB
        </span>
      </div>

      {/* cenários rápidos */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SCENARIOS.map((sc) => {
          const active = JSON.stringify(sc.v) === JSON.stringify(p)
          return (
            <button key={sc.id} title={sc.id === 'normal'
              ? tr('fluxo equilibrado', 'balanced flow', 'flujo equilibrado')
              : sc.id === 'crise'
                ? tr('empresários assustados param de investir', 'frightened firms stop investing', 'las empresas asustadas dejan de invertir')
                : sc.id === 'austeridade'
                  ? tr('Estado corta gastos na pior hora', 'the state cuts spending at the worst moment', 'el Estado recorta gasto en el peor momento')
                  : tr('Estado injeta demanda', 'the state injects demand', 'el Estado inyecta demanda')} onClick={() => setP({ ...sc.v })}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active ? 'border-money/70 bg-money/15 text-money' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              }`}>
              {sc.id === 'normal' ? tr('Economia normal', 'Normal economy', 'Economía normal')
                : sc.id === 'crise' ? tr('Crise', 'Crisis', 'Crisis')
                  : sc.id === 'austeridade' ? tr('Austeridade', 'Austerity', 'Austeridad')
                    : tr('Estímulo fiscal', 'Fiscal stimulus', 'Estímulo fiscal')}
            </button>
          )
        })}
      </div>

      {/* sliders */}
      <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[]).map((k) => {
          const labels: Record<string, string> = {
            investimento: tr('Investimento I', 'Investment I', 'Inversión I'),
            deficit: tr('Déficit público G−T', 'Public deficit G−T', 'Déficit público G−T'),
            nx: tr('Exportações líquidas', 'Net exports', 'Exportaciones netas'),
            consumoCap: tr('Consumo capitalista', 'Capitalist consumption', 'Consumo capitalista'),
            poupancaTrab: tr('Poupança dos trabalhadores', 'Workers’ saving', 'Ahorro de los trabajadores'),
          }
          return (
            <div key={k}>
              <div className="mb-0.5 flex justify-between text-[11px]">
                <Tip text={rowTips[k]}>
                  <span className="cursor-help text-zinc-300">{labels[k]} <span className="rounded border border-zinc-700 px-1 font-mono text-[8.5px] text-zinc-500">?</span></span>
                </Tip>
                <span className="font-mono font-bold text-zinc-200">{p[k].toLocaleString(loc)}%</span>
              </div>
              <input type="range" min={k === 'nx' ? -4 : 0}
                max={k === 'investimento' ? 30 : k === 'consumoCap' ? 25 : k === 'deficit' ? 14 : k === 'nx' ? 8 : 10}
                step={1} value={p[k]} onChange={(e) => set(k)(parseFloat(e.target.value))} />
            </div>
          )
        })}
      </div>

      {/* resultado */}
      <div className="mt-3 rounded-lg bg-zinc-950/70 p-3">
        <div className="flex flex-wrap items-baseline justify-between gap-1">
          <span className="font-mono text-sm font-bold text-emerald-300">Π = {pi.toLocaleString(loc)}% {tr('do PIB', 'of GDP', 'del PIB')}</span>
          <span className="text-[10px] text-zinc-500">{tr('massa de lucros agregada = exatamente a soma dos componentes', 'aggregate profit mass = exactly the sum of the components', 'masa agregada de beneficios = exactamente la suma de los componentes')}</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {[...rows, { label: tr('= LUCROS AGREGADOS (Π)', '= AGGREGATE PROFITS (Π)', '= BENEFICIOS AGREGADOS (Π)'), v: pi, color: '#4caf50', tip: '' }].map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className={`w-52 shrink-0 truncate text-right text-[10px] ${r.v < 0 ? 'text-red-300' : 'text-zinc-400'} ${r.label.startsWith('=') ? 'font-bold text-zinc-100' : ''}`}>
                {r.label}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded bg-zinc-800/70">
                <m.div animate={{ width: `${(Math.abs(r.v) / maxAbs) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                  className={`ml-auto h-full rounded ${r.v >= 0 ? '' : 'mr-auto ml-0'}`}
                  style={{ width: `${(Math.abs(r.v) / maxAbs) * 100}%`, background: r.color }} />
              </div>
              <span className="w-12 shrink-0 font-mono text-[10px] font-bold text-zinc-200">
                {r.v > 0 ? `+${r.v}` : r.v}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
        {tr('Zere o déficit e veja os lucros encolherem na mesma régua: é por isso que cortes públicos em crise derrubam a arrecadação e a própria margem do empresariado —', 'Set the deficit to zero and watch profits shrink by the same measure: this is why public spending cuts in a crisis reduce tax revenue and business margins —', 'Lleva el déficit a cero y observa cómo los beneficios se reducen en la misma medida: por eso los recortes públicos en una crisis reducen la recaudación y los márgenes empresariales —')}{' '}
        <span className="text-zinc-200">{tr('paradoxo da parcimônia aplicado ao Estado', 'the paradox of thrift applied to the state', 'la paradoja del ahorro aplicada al Estado')}</span>. {tr('E aumente a poupança dos trabalhadores: lucro cai junto, porque salário gasto é venda.', 'Then raise workers’ saving: profit falls too, because wages spent become sales.', 'Y aumenta el ahorro de los trabajadores: el beneficio también cae, porque el salario gastado se convierte en venta.')}
      </p>
    </section>
  )
}
