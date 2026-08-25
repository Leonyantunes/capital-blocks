import { memo } from 'react'

export interface Segment {
  key: string
  label: string
  value: number // 0–100 (%)
  color: string
}

interface DonutChartProps {
  segments: Segment[]
  centerLabel: string
  centerValue: string
}

const R = 70
const CX = 110
const CY = 110
const STROKE = 32

export default memo(function DonutChart({ segments, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const circumference = 2 * Math.PI * R
  let acc = 0

  return (
    <svg viewBox="0 0 220 220" className="h-52 w-52 shrink-0">
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#27272a" strokeWidth={STROKE} />
      {segments.map((seg) => {
        const frac = seg.value / total
        const len = frac * circumference
        const offset = -acc * circumference
        acc += frac
        return (
          <circle
            key={seg.key}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE}
            strokeDasharray={`${Math.max(len - 1.5, 0)} ${circumference - Math.max(len - 1.5, 0)}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${CX} ${CY})`}
            strokeLinecap="butt"
          />
        )
      })}
      <text x={CX} y={CY - 8} textAnchor="middle" className="fill-zinc-500 font-mono" fontSize="10">
        {centerLabel}
      </text>
      <text x={CX} y={CY + 12} textAnchor="middle" className="fill-zinc-100 font-mono font-semibold" fontSize="17">
        {centerValue}
      </text>
    </svg>
  )
})

/** Barra empilhada horizontal compacta (usada nos cards comparativos). */
export function StackedBar({ segments, height = 8 }: { segments: Segment[]; height?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  return (
    <div className="flex w-full overflow-hidden rounded-full bg-zinc-800" style={{ height }}>
      {segments.map((seg) => (
        <div key={seg.key} style={{ width: `${(seg.value / total) * 100}%`, background: seg.color }} />
      ))}
    </div>
  )
}
