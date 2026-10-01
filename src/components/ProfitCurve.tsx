import { useMemo } from 'react'
import { computeCircuit, profitCurve } from '../lib/marx'
import { useApp } from '../store/useApp'

const W = 660
const H = 250
const PAD = { l: 46, r: 14, t: 14, b: 30 }
const K_MIN = 0.5
const K_MAX = 12

const FAMILY = [0.5, 1, 1.5, 2, 3]

function scale(k: number, g: number, maxG: number) {
  const x = PAD.l + ((k - K_MIN) / (K_MAX - K_MIN)) * (W - PAD.l - PAD.r)
  const y = H - PAD.b - (g / maxG) * (H - PAD.t - PAD.b)
  return { x, y }
}

export default function ProfitCurve() {
  const { k, e, mode } = useApp()
  const current = computeCircuit(k, e)

  const { paths, familyPaths, maxG } = useMemo(() => {
    const maxG = Math.max(...FAMILY.map((fe) => computeCircuit(K_MIN, fe).profitRate), computeCircuit(K_MIN, e).profitRate) * 1.08
    const toPath = (fe: number) =>
      profitCurve(fe, K_MIN, K_MAX)
        .map((p, i) => {
          const { x, y } = scale(p.k, p.g, maxG)
          return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(' ')
    const familyPaths = FAMILY.filter((fe) => Math.abs(fe - e) > 0.01).map((fe) => ({ d: toPath(fe), fe }))
    return { paths: [toPath(e)], familyPaths, maxG }
  }, [e])

  const pt = scale(k, current.profitRate, maxG)

  const xTicks = [1, 4, 8, 12]
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxG)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-200">
          {mode !== 'avancado' ? (
            <>Quanto maior a automação, menor o lucro sobre o total investido</>
          ) : (
            <>Tendência da taxa de lucro <span className="font-mono text-zinc-500">g = m/(c+v)</span></>
          )}
        </h3>
        <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
          curvas de família para e fixo · marcador = simulação atual
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Curva de tendência da taxa de lucro">
        {/* grid */}
        {yTicks.map((g) => (
          <g key={g}>
            <line x1={PAD.l} y1={scale(0, g, maxG).y} x2={W - PAD.r} y2={scale(0, g, maxG).y}
              stroke="#27272a" strokeWidth={1} />
            <text x={PAD.l - 6} y={scale(0, g, maxG).y + 3} textAnchor="end" fontSize="9"
              className="fill-zinc-500 font-mono">{g.toFixed(0)}%</text>
          </g>
        ))}
        {xTicks.map((tk) => (
          <text key={tk} x={scale(tk, 0, maxG).x} y={H - PAD.b + 16} textAnchor="middle" fontSize="9"
            className="fill-zinc-500 font-mono">{tk}</text>
        ))}
        <text x={(W - PAD.r + PAD.l) / 2} y={H - 4} textAnchor="middle" fontSize="10"
          className="fill-zinc-400">
          {mode !== 'avancado' ? 'nível de automação →' : 'composição orgânica k = c/v →'}
        </text>

        {/* família */}
        {familyPaths.map((p) => (
          <path key={p.fe} d={p.d} fill="none" stroke="#52525b" strokeWidth={1.2} opacity={0.55} />
        ))}
        {/* curva atual */}
        {paths.map((d) => (
          <path key={d} d={d} fill="none" stroke="#34d399" strokeWidth={2.5} />
        ))}

        {/* marcador atual */}
        <line x1={pt.x} y1={PAD.t} x2={pt.x} y2={H - PAD.b} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 4" opacity={0.8} />
        <circle cx={pt.x} cy={pt.y} r={5.5} fill="#fbbf24" stroke="#18181b" strokeWidth={2} />
        <text x={Math.min(pt.x + 10, W - 90)} y={Math.max(pt.y - 10, PAD.t + 12)} fontSize="11" fontWeight="700"
          className="fill-amber-300 font-mono">g = {current.profitRate.toFixed(1)}%</text>
      </svg>

      <InsightNote profitRate={current.profitRate} k={k} />
    </div>
  )
}

function InsightNote({ profitRate, k }: { profitRate: number; k: number }) {
  const gRef = computeCircuit(K_MIN, useApp.getState().e).profitRate
  const loss = gRef - profitRate
  return (
    <p className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/70 p-2.5 text-xs leading-relaxed text-zinc-400">
      Com <span className="font-mono text-sky-300">k = {k.toFixed(1)}</span>, a taxa de lucro é{' '}
      <span className="font-mono font-semibold text-emerald-300">{profitRate.toFixed(1)}%</span>. Subir k
      (automação) eleva a produtividade, mas reduz o trabalho vivo que gera valor:{' '}
      <span className="text-zinc-200">desde o mínimo (k={K_MIN}), g já caiu {loss.toFixed(1)} p.p.</span> — a{' '}
      <em className="text-red-300 not-italic underline decoration-red-300/40 underline-offset-2">
        tendência decrescente da taxa de lucro
      </em>.
    </p>
  )
}
