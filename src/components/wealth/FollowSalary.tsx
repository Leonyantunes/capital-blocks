import { useState } from 'react'
import { SALARY_PRESETS } from '../../data/concentration'
import { useApp } from '../../store/useApp'

const W = 900
const H = 470

interface DestNode {
  key: 'renda' | 'corporacoes' | 'bancos' | 'estado'
  label: string
  sub: string
  color: string
  y: number
}

const DESTS: DestNode[] = [
  { key: 'renda', label: 'Proprietários & fundos', sub: 'aluguel, financiamento imobiliário', color: '#ba68c8', y: 118 },
  { key: 'corporacoes', label: 'Corporações', sub: 'consumo vira lucro extra', color: '#4caf50', y: 198 },
  { key: 'bancos', label: 'Bancos', sub: 'juros — dinheiro rendendo dinheiro', color: '#ffc107', y: 278 },
  { key: 'estado', label: 'Estado → dívida → rentistas', sub: 'impostos pagos viram juros', color: '#f87171', y: 358 },
]

const HALO = {
  paintOrder: 'stroke' as const,
  stroke: '#0d1117',
  strokeWidth: 4.5,
  strokeLinejoin: 'round' as const,
}

/** SIGA O SALÁRIO — percentuais vivem nas caixas de destino (zero sobreposição). */
export default function FollowSalary() {
  const [presetId, setPresetId] = useState(SALARY_PRESETS[1].id)
  const preset = SALARY_PRESETS.find((p) => p.id === presetId)!
  const sobra = Math.max(100 - preset.streams.reduce((s, x) => s + x.pct, 0), 0)
  const didatico = useApp((s) => s.mode) === 'didatico'

  const workerX = 218
  const destX = 596
  const pctOf = (dest: DestNode['key']) => preset.streams.find((s) => s.dest === dest)?.pct ?? 0

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">Siga o salário: para onde vai cada real</h3>
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {SALARY_PRESETS.map((p) => (
            <button key={p.id} onClick={() => setPresetId(p.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                presetId === p.id ? 'bg-money text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-0.5 text-[11px] text-zinc-500">
        Orçamento doméstico ilustrativo · {preset.faixa} · os percentuais aparecem em cada caixa de destino
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-auto w-full" role="img" aria-label="Fluxo do salário do trabalhador para as frações de capital">
        <defs>
          {DESTS.map((d) => (
            <marker key={d.key} id={`salArr-${d.key}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={d.color} />
            </marker>
          ))}
          <marker id="salArrM" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ce93d8" />
          </marker>
          <marker id="salArrV" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f44336" />
          </marker>
        </defs>

        {/* ── ACIONISTAS ── */}
        <g>
          <rect x={destX} y={16} width={264} height={48} rx={9} fill="#1a1220" stroke="#ce93d8" strokeOpacity="0.8" />
          <text x={destX + 12} y={35} fontSize="11.5" fontWeight="700" fill="#ce93d8">ACIONISTAS</text>
          <text x={destX + 12} y={50} fontSize="9" className="fill-zinc-500">dividendos · buybacks · valorização</text>
          <title>Mais-valia: produzida pelo trabalho, apropriada diretamente por quem possui.</title>
        </g>

        {/* ── fluxo +m ── */}
        <path d={`M 218 54 Q 407 30 596 40`} fill="none" stroke="#ce93d8" strokeWidth="2.6"
          strokeDasharray="7 5" className="flow-line" markerEnd="url(#salArrM)">
          <title>Mais-valia: o trabalho não pago vai direto para quem possui — sem passar pelo bolso do trabalhador.</title>
        </path>
        <text x={407} y={22} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#ce93d8"
          className="font-mono" style={HALO}>
          {didatico ? '+ trabalho não pago — nunca volta' : '+m (trabalho não pago) — nunca volta'}
        </text>

        {/* ── EMPRESA ── */}
        <g>
          <rect x={40} y={30} width={178} height={64} rx={10} fill="#161b22" stroke="#4caf50" strokeOpacity="0.6" />
          <text x={129} y={52} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-300">EMPRESA</text>
          {didatico ? (
            <>
              <text x={129} y={68} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">vende o produto pelo preço cheio…</text>
              <text x={129} y={82} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">…e paga só o salário</text>
            </>
          ) : (
            <>
              <text x={129} y={68} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">recebe C′ = c+v+m</text>
              <text x={129} y={82} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">devolve só v ao trabalho</text>
            </>
          )}
          <title>A empresa vende o produto pelo valor cheio que o trabalho criou — e paga apenas a parte do salário.</title>
        </g>

        {/* salário */}
        <path d={`M 129 94 L 129 156`} fill="none" stroke="#f44336" strokeWidth="2.5" markerEnd="url(#salArrV)">
          <title>Salário: a única fração do valor produzido que chega ao trabalhador.</title>
        </path>
        <text x={139} y={130} fontSize="10" className="fill-red-300 font-mono" style={HALO}>
          {didatico ? 'salário' : '−v (salário)'}
        </text>

        {/* ── TRABALHADOR ── */}
        <g>
          <rect x={40} y={162} width={178} height={112} rx={12} fill="#161b22" stroke="#f44336" strokeWidth="2" />
          <text x={129} y={188} textAnchor="middle" fontSize="13" fontWeight="800" className="fill-zinc-100">TRABALHADOR(A)</text>
          {didatico ? (
            <>
              <text x={129} y={206} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">produz TODA a riqueza</text>
              <text x={129} y={222} textAnchor="middle" fontSize="9.5" className="fill-red-300">recebe só o salário</text>
            </>
          ) : (
            <>
              <text x={129} y={206} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">produz W = c+v+m</text>
              <text x={129} y={222} textAnchor="middle" fontSize="9.5" className="fill-red-300 font-mono">fica com v (salário)</text>
            </>
          )}
          <text x={129} y={240} textAnchor="middle" fontSize="9.5" className="fill-sky-300 font-mono">
            sobra: {sobra}% (poupança)
          </text>
          <text x={129} y={258} textAnchor="middle" fontSize="8.5" className="fill-zinc-500">
            {didatico ? 'o resto vai p/ quem está acima ↑' : 'o resto sustenta o sistema ↑'}
          </text>
          <title>O trabalhador produz o valor inteiro; o salário é só uma fração. O que sobra vaza para as frações de capital à direita.</title>
        </g>

        {sobra >= 15 && (
          <text x={129} y={292} textAnchor="middle" fontSize="9" className="fill-sky-300">
            {didatico ? 'renda alta → dá até para guardar e investir' : 'renda alta → a sobra vira capital (r > g)'}
          </text>
        )}

        {/* ── fluxos (sem rótulos no meio — pct nas caixas) ── */}
        {preset.streams.map((st, i) => {
          const dest = DESTS.find((d) => d.key === st.dest)!
          const bend = (i % 2 === 0 ? 1 : -1) * (18 + i * 12)
          const mx = (workerX + destX) / 2
          const my = (210 + dest.y) / 2
          const d = `M ${workerX} 210 Q ${mx} ${my - bend} ${destX} ${dest.y}`
          const w = 1.6 + (st.pct / 34) * 3.2
          return (
            <path key={st.rotulo} d={d} fill="none" stroke={dest.color} strokeWidth={w}
              strokeDasharray="6 5" opacity="0.85" markerEnd={`url(#salArr-${st.dest})`}>
              <title>{`${st.rotulo}: ${st.pct}% do salário → ${dest.label} (${dest.sub})`}</title>
            </path>
          )
        })}
        {[0, 1].map((j) =>
          preset.streams.map((st, i) => {
            const dest = DESTS.find((d) => d.key === st.dest)!
            const bend = (i % 2 === 0 ? 1 : -1) * (18 + i * 12)
            const mx = (workerX + destX) / 2
            const my = (210 + dest.y) / 2
            const d = `M ${workerX} 210 Q ${mx} ${my - bend} ${destX} ${dest.y}`
            return (
              <circle key={`${st.rotulo}-${j}`} r="2.4" fill={dest.color}>
                <animateMotion dur={`${3.2 + i * 0.4}s`} repeatCount="indefinite"
                  begin={`-${j * (3.2 + i * 0.4) / 2}s`} path={d} />
              </circle>
            )
          }),
        )}

        {/* ── nós destino (com percentual embutido) ── */}
        {DESTS.map((d) => {
          const pct = pctOf(d.key)
          return (
            <g key={d.key}>
              <rect x={destX} y={d.y - 28} width={264} height={56} rx={9} fill="#161b22" stroke={d.color} strokeOpacity="0.65" />
              <text x={destX + 12} y={d.y - 8} fontSize="11.5" fontWeight="700" fill={d.color}>{d.label}</text>
              <text x={destX + 12} y={d.y + 6} fontSize="9" className="fill-zinc-500">{d.sub}</text>
              <text x={destX + 12} y={d.y + 20} fontSize="9.5" fontWeight="700" fill={d.color} className="font-mono">
                {pct}% do salário vai para cá
              </text>
              <title>{`${d.label}: ${pct}% do salário — ${d.sub}`}</title>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 text-xs leading-relaxed text-zinc-300">
        {didatico ? (
          <>
            Repare no desenho:{' '}
            <strong className="text-red-300">o trabalhador produz o valor inteiro — e quase nada retorna para ele.</strong>{' '}
            O salário se despedaça em aluguel, juro, imposto e lucro de outrem em poucos dias. A única linha que
            nunca chega de volta é a roxa do topo: o trabalho não pago indo direto para os acionistas. E a “sobra”?
            Só existe quando o salário já é alto o bastante.
          </>
        ) : (
          <>
            Circulação do valor entre classes: o adiantamento `v` retorna como rendimento e é reabsorvido pelas
            frações (renda fundiária, lucro comercial, juros, tributo→serviço da dívida); a massa `m` realiza-se
            diretamente na esfera acionária. A “sobra” crescente nos presets de renda alta é a porta de entrada da
            capitalização individual — microfundamento do r &gt; g pikettiano.
          </>
        )}
      </div>
    </section>
  )
}
