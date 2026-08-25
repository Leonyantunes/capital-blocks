import { computeCircuit, units } from '../lib/marx'
import { useApp } from '../store/useApp'

function Arrow({ x1, x2, y = 165, dotted = false, slow = false }: { x1: number; x2: number; y?: number; dotted?: boolean; slow?: boolean }) {
  return (
    <line
      x1={x1} y1={y} x2={x2} y2={y}
      stroke={dotted ? '#52525b' : '#a1a1aa'}
      strokeWidth="2"
      markerEnd="url(#arr)"
      className={dotted ? 'flow-line flow-line--slow' : 'flow-line'}
      opacity={slow ? 0.8 : 1}
    />
  )
}

export default function CircuitDiagram() {
  const { k, e } = useApp()
  const r = computeCircuit(k, e)
  const cShare = (r.c / r.M) * 100
  const vShare = (r.v / r.M) * 100

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <svg viewBox="0 0 1000 330" className="h-auto w-full" role="img" aria-label="Diagrama do circuito do capital">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a1a1aa" />
          </marker>
        </defs>

        {/* ---------- M ---------- */}
        <circle cx={88} cy={165} r={36} fill="#18181b" stroke="#fbbf24" strokeWidth="2" />
        <text x={88} y={173} textAnchor="middle" fontSize="24" fontWeight="700" className="fill-amber-300 font-mono">M</text>
        <text x={88} y={228} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-zinc-200 font-mono">{units(r.M)}</text>
        <text x={88} y={245} textAnchor="middle" fontSize="10" className="fill-zinc-500">capital-dinheiro</text>

        {/* M —> C */}
        <Arrow x1={128} x2={198} />
        <text x={163} y={150} textAnchor="middle" fontSize="10" className="fill-zinc-500 font-mono">D—M · compra</text>

        {/* ---------- C (L / MP) ---------- */}
        <rect x={206} y={100} width={158} height={130} rx={14} fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
        <text x={285} y={122} textAnchor="middle" fontSize="15" fontWeight="700" className="fill-zinc-200 font-mono">C</text>

        <rect x={220} y={133} width={130} height={40} rx={8} fill="#f8717114" stroke="#f87171" strokeOpacity="0.55" />
        <text x={230} y={150} fontSize="9.5" className="fill-red-200/80">L — força de trabalho</text>
        <text x={230} y={165} fontSize="11" fontWeight="700" className="fill-red-300 font-mono">v = {units(r.v)}</text>

        <rect x={220} y={181} width={130} height={40} rx={8} fill="#38bdf814" stroke="#38bdf8" strokeOpacity="0.55" />
        <text x={230} y={198} fontSize="9.5" className="fill-sky-200/80">MP — meios de produção</text>
        <text x={230} y={213} fontSize="11" fontWeight="700" className="fill-sky-300 font-mono">c = {units(r.c)}</text>

        {/* C …> P */}
        <Arrow x1={370} x2={462} dotted />
        <text x={416} y={150} textAnchor="middle" fontSize="10" className="fill-zinc-500 font-mono">…</text>

        {/* ---------- P (produção / mais-valia) ---------- */}
        <circle cx={520} cy={165} r={52} fill="none" stroke="#52525b" strokeWidth="2" strokeDasharray="4 8"
          className="spin-slow" style={{ transformOrigin: '520px 165px' }} />
        <circle cx={520} cy={165} r={43} fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <circle cx={520} cy={165} r={43} fill="none" stroke="#f87171" strokeWidth="2" className="red-pulse" />
        <text x={520} y={174} textAnchor="middle" fontSize="26" fontWeight="700" className="fill-zinc-100 font-mono">P</text>
        <rect x={494} y={234} width={52} height={20} rx={10} fill="#05966933" stroke="#34d399" strokeOpacity="0.7" />
        <text x={520} y={248} textAnchor="middle" fontSize="11" fontWeight="700" className="fill-emerald-300 font-mono">+m {units(r.m)}</text>
        <text x={520} y={272} textAnchor="middle" fontSize="10" className="fill-zinc-500">extração de mais-valia</text>

        {/* P —> C' */}
        <Arrow x1={578} x2={648} />
        <text x={613} y={150} textAnchor="middle" fontSize="10" className="fill-zinc-500 font-mono">…′</text>

        {/* ---------- C' ---------- */}
        <rect x={656} y={132} width={132} height={66} rx={12} fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
        <text x={722} y={156} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-zinc-200 font-mono">C′</text>
        <text x={722} y={178} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-zinc-100 font-mono">{units(r.W)}</text>
        <text x={722} y={193} textAnchor="middle" fontSize="9" className="fill-zinc-500 font-mono">c + v + m</text>

        {/* C' —> M' */}
        <Arrow x1={794} x2={862} />
        <text x={828} y={150} textAnchor="middle" fontSize="10" className="fill-zinc-500 font-mono">realização</text>

        {/* ---------- M' ---------- */}
        <circle cx={906} cy={165} r={38} fill="#271c05" stroke="#fbbf24" strokeWidth="2.5" className="glow-mprime" />
        <text x={906} y={172} textAnchor="middle" fontSize="21" fontWeight="700" className="fill-amber-300 font-mono">M′</text>
        <text x={906} y={228} textAnchor="middle" fontSize="11" fontWeight="700" className="fill-emerald-300 font-mono">+ΔM = m</text>
        <text x={906} y={244} textAnchor="middle" fontSize="10" className="fill-zinc-500">valor expandido</text>

        {/* ---------- composição do capital adiantado ---------- */}
        <text x={332} y={304} textAnchor="end" fontSize="10" className="fill-zinc-500 font-mono">M = c + v</text>
        <rect x={344} y={295} width={(cShare / 100) * 320} height={12} rx={3} fill="#38bdf8" opacity={0.85} />
        <rect x={344 + (cShare / 100) * 320} y={295} width={(vShare / 100) * 320} height={12} rx={3} fill="#f87171" opacity={0.85} />
        <text x={344 + 320 + 12} y={304} fontSize="10" className="fill-zinc-500">
          <tspan className="fill-sky-300">c {cShare.toFixed(0)}%</tspan>
          <tspan className="fill-zinc-600"> · </tspan>
          <tspan className="fill-red-300">v {vShare.toFixed(0)}%</tspan>
        </text>
      </svg>
    </div>
  )
}
