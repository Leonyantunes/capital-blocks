import { CONCENTRATION_STATS, TOP1_SERIES, TOP1_ERAS, WEALTH_BANDS, type WealthBand } from '../../data/concentration'
import Tip from '../ui/Tip'
import { useApp } from '../../store/useApp'

const CW = 720
const CH = 260
const PADL = 42
const PADR = 16
const PADT = 14
const PADB = 30

function point(ano: number, pct: number) {
  const x = PADL + ((ano - 1913) / (2024 - 1913)) * (CW - PADL - PADR)
  const y = CH - PADB - (pct / 50) * (CH - PADT - PADB)
  return { x, y }
}

function top1Path() {
  return TOP1_SERIES.map((p, i) => {
    const { x, y } = point(p.ano, p.pct)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

/** Gráfico Top 1% EUA (1913→2024) com eras anotadas. */
export function TopOneChart() {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const trough = point(1975, 22)
  const now = point(2024, 36)
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">A riqueza voltou às mãos de poucos — e está indo além de 1929</h3>
        <span className="font-mono text-[10px] text-zinc-500">parcela da riqueza detida pelo Top 1% · EUA · WID.world</span>
      </div>
      <svg viewBox={`0 0 ${CW} ${CH}`} className="mt-2 h-auto w-full" role="img" aria-label="Série histórica da concentração da riqueza no Top 1%">
        {TOP1_ERAS.map((era) => {
          const a = point(Math.max(era.from, 1913), 50)
          const b = point(era.to, 0)
          return (
            <g key={era.from}>
              <rect x={a.x} y={PADT} width={b.x - a.x} height={CH - PADT - PADB} fill={era.color} />
              <text x={(a.x + b.x) / 2} y={PADT + 12} textAnchor="middle" fontSize="8.5"
                className={era.from >= 1980 ? 'fill-red-300/80' : 'fill-emerald-300/80'}>
                {era.label.split(':')[0]}
              </text>
            </g>
          )
        })}

        {[0, 25, 50].map((g) => {
          const p = point(1913, g)
          return (
            <g key={g}>
              <line x1={PADL} y1={p.y} x2={CW - PADR} y2={p.y} stroke="#27272a" />
              <text x={PADL - 6} y={p.y + 3} textAnchor="end" fontSize="9" className="fill-zinc-500 font-mono">{g}%</text>
            </g>
          )
        })}
        {[1913, 1950, 1975, 2000, 2024].map((yr) => {
          const p = point(yr, 0)
          return <text key={yr} x={p.x} y={CH - 12} textAnchor="middle" fontSize="9" className="fill-zinc-500 font-mono">{yr}</text>
        })}
        <line x1={PADL} y1={CH - PADB} x2={CW - PADR} y2={CH - PADB} stroke="#30363d" />

        <path d={top1Path()} fill="none" stroke="#ffc107" strokeWidth="2.6" strokeLinejoin="round" />

        <circle cx={point(1929, 46).x} cy={point(1929, 46).y} r="4" fill="#f44336" />
        <text x={point(1929, 46).x + 8} y={point(1929, 46).y - 6} fontSize="9.5" className="fill-red-300">1929 · pico pré-crise</text>
        <circle cx={trough.x} cy={trough.y} r="4" fill="#4caf50" />
        <text x={trough.x - 8} y={trough.y + 18} textAnchor="end" fontSize="9.5" className="fill-emerald-300">1975 · vale da compressão</text>
        <circle cx={now.x} cy={now.y} r="4.5" fill="#ffc107" stroke="#161b22" strokeWidth="1.5" />
        <text x={now.x - 8} y={now.y - 10} textAnchor="end" fontSize="10" fontWeight="700" className="fill-money font-mono">36% e subindo</text>

        {didatico && (
          <text x={point(1957, 42).x} y={point(1957, 42).y} textAnchor="middle" fontSize="9" className="fill-zinc-400">
            imposto progressivo + sindicatos derrubaram a concentração…
          </text>
        )}
      </svg>
      <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
        {didatico
          ? 'Não é “sempre foi assim”: entre os anos 1930 e 1970, imposto alto sobre herança/renda alta, sindicatos fortes e Estado de bem-estar COMPRIMIRAM a fatia dos 1% pela metade. A partir de Reagan/Thatcher, desregulamentação e financeirização devolveram tudo — e a curva segue subindo.'
          : 'Mecânica Piketty (r > g): retorno patrimonial supera crescimento salarial → recomposição autômática da concentração na ausência de compressão política (tributação de herança/patrimônio, densidade sindical).'}
      </p>
    </div>
  )
}

/** Segmento com tooltip próprio (sem depender de largura herdada). */
function Segment({ b, field, total }: { b: WealthBand; field: 'adultosPct' | 'riquezaPct'; total: number }) {
  const pct = (b[field] / total) * 100
  const showLabel = pct >= 12
  return (
    <div className="group/seg relative h-full" style={{ width: `${pct}%` }}>
      <div className="h-full" style={{ background: b.color }} />
      {showLabel && (
        <span className="pointer-events-none absolute inset-0 flex items-start justify-center pt-1 font-mono text-[9.5px] font-bold text-zinc-950">
          {b[field].toLocaleString('pt-BR')}%
        </span>
      )}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 hidden w-44 -translate-x-1/2 rounded-md border border-zinc-700 bg-zinc-900/95 p-1.5 text-center text-[10px] leading-snug text-zinc-200 shadow-xl group-hover/seg:block">
        {b.banda}: {b.adultosPct.toLocaleString('pt-BR')}% das pessoas · {b.riquezaPct.toLocaleString('pt-BR')}% da riqueza
      </span>
    </div>
  )
}

/** Espelho população × riqueza (UBS GWR 2024) — dual-mode. */
export function MirrorBars() {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const totalA = WEALTH_BANDS.reduce((s, b) => s + b.adultosPct, 0)
  const totalR = WEALTH_BANDS.reduce((s, b) => s + b.riquezaPct, 0)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-sm font-bold text-zinc-100">Metade da humanidade · 1,3% da riqueza</h3>
      <p className="mt-0.5 text-[11px] text-zinc-500">
        faixas de patrimônio por adulto — UBS Global Wealth Report 2024 · passe o mouse nas faixas
      </p>
      <div className="mt-3 space-y-3">
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">População adulta mundial</div>
          <div className="flex h-9 w-full overflow-hidden rounded-lg border border-zinc-800">
            {WEALTH_BANDS.map((b) => <Segment key={b.banda} b={b} field="adultosPct" total={totalA} />)}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">Riqueza total do planeta</div>
          <div className="flex h-9 w-full overflow-hidden rounded-lg border border-zinc-800">
            {WEALTH_BANDS.map((b) => <Segment key={b.banda} b={b} field="riquezaPct" total={totalR} />)}
          </div>
        </div>
      </div>
      <ul className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-2">
        {WEALTH_BANDS.map((b) => (
          <li key={b.banda} className="flex items-center justify-between gap-2 text-[10.5px]">
            <span className="flex min-w-0 items-center gap-1.5 text-zinc-300">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: b.color }} />{b.banda}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-zinc-400">
              {b.adultosPct.toLocaleString('pt-BR')}% das pessoas → {b.riquezaPct.toLocaleString('pt-BR')}% da riqueza
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 rounded-lg bg-zinc-950/70 p-2.5 text-[11px] leading-relaxed text-zinc-300">
        {didatico
          ? 'Como ler: corte as duas barras na mesma altura. A fatia roxa (1,1% das pessoas) quase some na barra de cima — mas DOMINA a de baixo, com 43% de toda a riqueza. Já a fatia vermelha (metade da humanidade) é gigante em cima e vira um fio de cabelo embaixo. Essa assimetria É a concentração.'
          : 'Distribuição log-normal com cauda de Pareto: a cauda superior captura a valorização de ativos (r > g), enquanto a base monetiza exclusivamente força de trabalho. A assimetria entre as barras é a assinatura gráfica da financeirização.'}
      </p>
    </div>
  )
}

export function ConcentrationStats() {
  const mode = useApp((s) => s.mode)
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {CONCENTRATION_STATS.map((st) => (
        <Tip key={st.label} className="w-full" text={mode === 'didatico' ? st.tipDidatico : st.tipAvancado}>
          <article className="h-full w-full cursor-help rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 transition-colors hover:border-zinc-600">
            <div className="font-mono text-2xl font-extrabold text-money">{st.value}</div>
            <div className="mt-1 text-xs font-semibold leading-snug text-zinc-200">{st.label}</div>
            <div className="mt-0.5 text-[10.5px] text-zinc-500">{st.sub}</div>
            <div className="mt-1.5 inline-block rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">{st.source}</div>
          </article>
        </Tip>
      ))}
    </div>
  )
}
