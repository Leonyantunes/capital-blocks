import { useState } from 'react'
import { m } from 'framer-motion'
import Tip from '../ui/Tip'

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
  const [p, setP] = useState(DEFAULTS)
  const set = <K extends keyof typeof DEFAULTS>(k: K) => (v: number) => setP((s) => ({ ...s, [k]: v }))
  const pi = p.investimento + p.deficit + p.nx + p.consumoCap - p.poupancaTrab

  const rows = [
    { label: 'Investimento privado (I)', v: p.investimento, color: '#42a5f5', tip: 'Gasto dos capitalistas em máquinas e construção: cria demanda E capacidade.' },
    { label: 'Déficit público (G − T)', v: p.deficit, color: '#9c27b0', tip: 'O Estado injeta renda líquida — sustenta vendas e margens quando o privado recua.' },
    { label: 'Exportações líquidas (X − M)', v: p.nx, color: '#ffc107', tip: 'Demanda estrangeira líquida soma aos lucros domésticos.' },
    { label: 'Consumo dos capitalistas', v: p.consumoCap, color: '#ba68c8', tip: 'Iates, dividendos gastos, festas: também são receita de alguém.' },
    { label: '(−) Poupança dos trabalhadores', v: -p.poupancaTrab, color: '#f44336', tip: 'Cada real não gasto pelos trabalhadores deixa de virar venda — e portanto lucro. Paradoxo da parcimônia!' },
  ]
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.v)), Math.abs(pi), 1)

  return (
    <section className="rounded-xl border border-money/30 bg-money/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-1.5">
        <h3 className="text-sm font-bold text-zinc-100">
          Por que os capitalistas amam o déficit (e fingem que odeiam) — Kalecki
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
            <button key={sc.id} title={sc.hint} onClick={() => setP({ ...sc.v })}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active ? 'border-money/70 bg-money/15 text-money' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              }`}>
              {sc.label}
            </button>
          )
        })}
      </div>

      {/* sliders */}
      <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[]).map((k) => {
          const labels: Record<string, string> = {
            investimento: 'Investimento I',
            deficit: 'Déficit público G−T',
            nx: 'Exportações líquidas',
            consumoCap: 'Consumo capitalista',
            poupancaTrab: 'Poupança dos trabalhadores',
          }
          return (
            <div key={k}>
              <div className="mb-0.5 flex justify-between text-[11px]">
                <Tip text={
                  k === 'poupancaTrab' ? rows[4].tip : rows.find((r) => r.label.startsWith(labels[k].split(' ')[0]))?.tip ?? ''
                }>
                  <span className="cursor-help text-zinc-300">{labels[k]} <span className="rounded border border-zinc-700 px-1 font-mono text-[8.5px] text-zinc-500">?</span></span>
                </Tip>
                <span className="font-mono font-bold text-zinc-200">{p[k].toLocaleString('pt-BR')}%</span>
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
          <span className="font-mono text-sm font-bold text-emerald-300">Π = {pi.toLocaleString('pt-BR')}% do PIB</span>
          <span className="text-[10px] text-zinc-500">massa de lucros agregada = exatamente a soma dos componentes</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {[...rows, { label: '= LUCROS AGREGADOS (Π)', v: pi, color: '#4caf50', tip: '' }].map((r) => (
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
        Zere o déficit e veja os lucros encolherem na mesma régua: é por isso que cortes
        públicos em crise derrubam a arrecadação e a própria margem do empresariado —{' '}
        <span className="text-zinc-200">paradoxo da parcimônia aplicado ao Estado</span>. E
        aumente a poupança dos trabalhadores: lucro cai junto, porque salário gasto é venda.
      </p>
    </section>
  )
}
