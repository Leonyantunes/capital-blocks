import Tip from './ui/Tip'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  accent?: string
  formula?: string
  /** micro-explicação exibida ao passar o mouse sobre o valor */
  tip?: string
}

export default function MetricCard({ label, value, sub, accent = 'text-zinc-100', formula, tip }: MetricCardProps) {
  const valueNode = (
    <div className={`mt-1 font-mono text-xl font-semibold ${accent}`}>{value}</div>
  )
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
      {tip ? <Tip text={tip}><span className="inline-block cursor-help">{valueNode}</span></Tip> : valueNode}
      {sub && <div className="mt-0.5 text-[11px] leading-tight text-zinc-400">{sub}</div>}
      {formula && (
        <div className="mt-1.5 inline-block rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
          {formula}
        </div>
      )}
    </div>
  )
}
