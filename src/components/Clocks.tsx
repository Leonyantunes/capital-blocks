import { memo } from 'react'
import { fmtHours } from '../lib/marx'

const CX = 80
const CY = 80
const R = 58

function polar(angleDeg: number, r: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)]
}

function arc(fromPct: number, toPct: number, r: number): string {
  const a1 = fromPct * 360
  const a2 = toPct * 360
  const [x1, y1] = polar(a1, r)
  const [x2, y2] = polar(a2, r)
  const large = a2 - a1 > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

/**
 * RELÓGIO DA JORNADA (8h) — arco verde = trabalho não pago (para o capital),
 * arco vermelho = trabalho pago (para o trabalhador).
 */
export function UnpaidClock({ minutesUnpaid, size = 190 }: { minutesUnpaid: number; size?: number }) {
  const pctUnpaid = Math.min(minutesUnpaid / 480, 1)
  return (
    <svg viewBox="0 0 160 160" style={{ width: size, height: size }} role="img" aria-label={`Relógio da jornada: ${fmtHours(minutesUnpaid / 60)} não pagos`}>
      <circle cx={CX} cy={CY} r={R + 12} fill="#161b22" stroke="#30363d" />
      {/* trilho */}
      <path d={arc(0, 0.9999, R)} fill="none" stroke="#30363d" strokeWidth={13} strokeLinecap="round" />
      {/* pago (trabalhador) — começa onde o não-pago termina */}
      <path d={arc(pctUnpaid, 0.9999, R)} fill="none" stroke="#f44336" strokeWidth={13} strokeLinecap="round" opacity={pctUnpaid < 1 ? 0.85 : 0} />
      {/* não pago (capital) */}
      <path d={arc(0, Math.max(pctUnpaid, 0.001), R)} fill="none" stroke="#4caf50" strokeWidth={13} strokeLinecap="round" />
      {/* ponteiro no fim do trabalho pago */}
      {[...Array(8)].map((_, i) => {
        const [tx, ty] = polar(i / 8 * 360, R + 20)
        return <circle key={i} cx={tx} cy={ty} r={1.6} fill="#6e7681" />
      })}
      <text x={CX} y={CY - 4} textAnchor="middle" fontSize="15" fontWeight="700" className="fill-emerald-300 font-mono">
        {fmtHours(minutesUnpaid / 60)}
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" fontSize="8.5" className="fill-zinc-400">
        não pagos · jornada 8h
      </text>
    </svg>
  )
}

/** Versão compacta para tabelas/linhas. */
export const MiniClock = memo(function MiniClock({ minutesUnpaid }: { minutesUnpaid: number }) {
  const pct = Math.min(minutesUnpaid / 480, 1)
  return (
    <svg viewBox="0 0 36 36" className="h-7 w-7 shrink-0" role="img" aria-label={fmtHours(minutesUnpaid / 60)}>
      <circle cx="18" cy="18" r="14" fill="none" stroke="#30363d" strokeWidth="5" />
      <circle cx="18" cy="18" r="14" fill="none" stroke="#4caf50" strokeWidth="5"
        strokeDasharray={`${pct * 87.96} 87.96`} transform="rotate(-90 18 18)" strokeLinecap="round" />
    </svg>
  )
})
