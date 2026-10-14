import { CONCENTRATION_STATS, TOP1_SERIES, TOP1_ERAS, WEALTH_BANDS, type WealthBand } from '../../data/concentration'
import Tip from '../ui/Tip'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'
import { locale, pick, type Lang } from '../../i18n'

const CW = 720
const CH = 260
const PADL = 42
const PADR = 16
const PADT = 14
const PADB = 30

function bandLabel(lang: Lang, b: WealthBand) {
  switch (b.banda) {
    case '> US$ 1 milhão': return pick(lang, b.banda, '> US$ 1 million', '> US$ 1 millón')
    case 'US$ 100 mil – 1 mi': return pick(lang, b.banda, 'US$ 100k – 1m', 'US$ 100 mil – 1 mill.')
    case 'US$ 10 mil – 100 mil': return pick(lang, b.banda, 'US$ 10k – 100k', 'US$ 10 mil – 100 mil')
    case '< US$ 10 mil': return pick(lang, b.banda, '< US$ 10k', '< US$ 10 mil')
    default: return b.banda
  }
}

function statCopy(lang: Lang, index: number, raw: (typeof CONCENTRATION_STATS)[number]) {
  if (index === 0) return {
    label: pick(lang, raw.label, 'New wealth captured by the Top 1% since 2020', 'Nueva riqueza capturada por el 1% más rico desde 2020'),
    value: raw.value,
    sub: pick(lang, raw.sub, '≈ US$ 42 tn of US$ 63 tn created', '≈ US$ 42 bill. de US$ 63 bill. creados'),
    source: pick(lang, raw.source, 'Oxfam, Jan/2024', 'Oxfam, ene/2024'),
    tipDidatico: pick(lang, raw.tipDidatico, 'Of every US$3 in NEW wealth created worldwide after the pandemic, about US$2 went to the top. The gains were far from evenly distributed.', 'De cada US$3 de riqueza NUEVA creada en el mundo después de la pandemia, cerca de US$2 fueron a la cima. Las ganancias estuvieron lejos de repartirse por igual.'),
    tipAvancado: pick(lang, raw.tipAvancado, 'Overaccumulation channeled upward through asset appreciation (equities/real estate) — a Cantillon-style effect of post-2020 monetary expansion.', 'Sobreacumulación canalizada hacia arriba mediante la valorización de activos (acciones/inmuebles) — un efecto tipo Cantillon de la expansión monetaria posterior a 2020.'),
  }
  if (index === 1) return {
    label: pick(lang, raw.label, 'Billionaires worldwide', 'Multimillonarios en el mundo'),
    value: pick(lang, raw.value, '≈ 2.8k', '≈ 2,8 mil'),
    sub: pick(lang, raw.sub, 'combined wealth ≈ US$ 14–16 tn', 'patrimonio conjunto ≈ US$ 14–16 bill.'),
    source: raw.source,
    tipDidatico: pick(lang, raw.tipDidatico, 'Fewer people than fit in a large neighborhood hold wealth comparable to several major national economies.', 'Menos personas de las que caben en un gran barrio concentran una riqueza comparable a varias grandes economías nacionales.'),
    tipAvancado: pick(lang, raw.tipAvancado, 'Wealth concentration as a regime condition: billionaires act as channels for political allocation of surplus through lobbying, media ownership, and strategic philanthropy.', 'Concentración patrimonial como condición del régimen: los multimillonarios actúan como canales de asignación política del excedente mediante lobby, medios y filantropía estratégica.'),
  }
  return {
    label: pick(lang, raw.label, 'Adults with < US$ 10k', 'Adultos con < US$ 10 mil'),
    value: pick(lang, raw.value, '2.8 billion', '2,8 mil millones'),
    sub: pick(lang, raw.sub, 'half of humanity · 1.3% of wealth', 'mitad de la humanidad · 1,3% de la riqueza'),
    source: raw.source,
    tipDidatico: pick(lang, raw.tipDidatico, 'Half of the world’s adults share just over 1% of global wealth. The bottom of the distribution holds very little net wealth.', 'La mitad de los adultos del mundo comparte poco más del 1% de la riqueza global. La base de la distribución posee muy poco patrimonio neto.'),
    tipAvancado: pick(lang, raw.tipAvancado, 'A globalized reserve army of labor: permanent compression at the base supports margins in the center (dependency theory applied at planetary scale).', 'Ejército industrial de reserva globalizado: la compresión permanente de la base sostiene márgenes en el centro (teoría de la dependencia aplicada a escala planetaria).'),
  }
}

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
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const didatico = mode !== 'avancado'
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const trough = point(1975, 22)
  const now = point(2024, 36)
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">
          {textoPorModo(mode,
            tx('A riqueza voltou às mãos de poucos — e está indo além de 1929', 'Wealth returned to fewer hands — approaching the levels around 1929', 'La riqueza volvió a menos manos — acercándose a los niveles de 1929'),
            tx('Concentração patrimonial do Top 1% nos EUA (1913–2024)', 'Top 1% wealth concentration in the US (1913–2024)', 'Concentración patrimonial del 1% más rico en EE. UU. (1913–2024)'),
            tx('Quanto da riqueza ficou com o 1% mais rico ao longo do tempo', 'How much wealth the richest 1% held over time', 'Cuánta riqueza quedó en manos del 1% más rico a lo largo del tiempo'),
          )}
        </h3>
        <span className="font-mono text-[10px] text-zinc-500">{tx('parcela da riqueza detida pelo Top 1% · EUA · WID.world', 'share of wealth held by the Top 1% · US · WID.world', 'porción de riqueza del 1% más rico · EE. UU. · WID.world')}</span>
      </div>
      <svg viewBox={`0 0 ${CW} ${CH}`} className="mt-2 h-auto w-full" role="img" aria-label={tx('Série histórica da concentração da riqueza no Top 1%', 'Historical series of wealth concentration in the Top 1%', 'Serie histórica de concentración de riqueza en el 1% más rico')}>
        {TOP1_ERAS.map((era) => {
          const a = point(Math.max(era.from, 1913), 50)
          const b = point(era.to, 0)
          return (
            <g key={era.from}>
              <rect x={a.x} y={PADT} width={b.x - a.x} height={CH - PADT - PADB} fill={era.color} />
              <text x={(a.x + b.x) / 2} y={PADT + 12} textAnchor="middle" fontSize="8.5"
                className={era.from >= 1980 ? 'fill-red-300/80' : 'fill-emerald-300/80'}>
                {era.from >= 1980 ? tx('Financeirização', 'Financialization', 'Financiarización') : tx('Compressão', 'Compression', 'Compresión')}
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
        <text x={point(1929, 46).x + 8} y={point(1929, 46).y - 6} fontSize="9.5" className="fill-red-300">{tx('1929 · pico pré-crise', '1929 · pre-crash peak', '1929 · pico precrisis')}</text>
        <circle cx={trough.x} cy={trough.y} r="4" fill="#4caf50" />
        <text x={trough.x - 8} y={trough.y + 18} textAnchor="end" fontSize="9.5" className="fill-emerald-300">
          {textoPorModo(mode, tx('1975 · ponto mais baixo', '1975 · lowest point', '1975 · punto más bajo'), tx('1975 · vale da compressão', '1975 · compression trough', '1975 · valle de compresión'), tx('1975 · ponto mais baixo', '1975 · lowest point', '1975 · punto más bajo'))}
        </text>
        <circle cx={now.x} cy={now.y} r="4.5" fill="#ffc107" stroke="#161b22" strokeWidth="1.5" />
        <text x={now.x - 8} y={now.y - 10} textAnchor="end" fontSize="10" fontWeight="700" className="fill-money font-mono">{tx('36% e subindo', '36% and rising', '36% y subiendo')}</text>

        {didatico && (
          <text x={point(1957, 42).x} y={point(1957, 42).y} textAnchor="middle" fontSize="9" className="fill-zinc-400">
            {textoPorModo(mode, tx('impostos sobre altas rendas + sindicatos reduziram a concentração…', 'taxes on high incomes + unions reduced concentration…', 'impuestos a rentas altas + sindicatos redujeron la concentración…'), tx('imposto progressivo + sindicatos derrubaram a concentração…', 'progressive taxation + unions pushed concentration down…', 'impuestos progresivos + sindicatos redujeron la concentración…'), tx('impostos e sindicatos ajudaram a reduzir essa fatia…', 'taxes and unions helped reduce this share…', 'impuestos y sindicatos ayudaron a reducir esta porción…'))}
          </text>
        )}
      </svg>
      <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
        {textoPorModo(
          mode,
          tx('Não é “sempre foi assim”: entre os anos 1930 e 1970, imposto alto sobre herança/renda alta, sindicatos fortes e Estado de bem-estar COMPRIMIRAM a fatia dos 1% pela metade. A partir de Reagan/Thatcher, desregulamentação e financeirização devolveram tudo — e a curva segue subindo.', 'It was not “always like this”: from the 1930s through the 1970s, high taxes on inheritances and top incomes, strong unions, and welfare-state institutions COMPRESSED the top 1% share by roughly half. From the Reagan/Thatcher era onward, deregulation and financialization reversed much of that decline.', 'No “siempre fue así”: entre los años 1930 y 1970, impuestos altos a herencias y rentas superiores, sindicatos fuertes y el Estado de bienestar COMPRIMIERON aproximadamente a la mitad la porción del 1%. Desde la era Reagan/Thatcher, la desregulación y la financiarización revirtieron gran parte de esa caída.'),
          tx('Mecânica Piketty (r > g): retorno patrimonial supera crescimento salarial → recomposição autômática da concentração na ausência de compressão política (tributação de herança/patrimônio, densidade sindical).', 'Piketty mechanism (r > g): returns on wealth outpace wage growth → concentration rebuilds when political compression is absent (inheritance/wealth taxation, union density).', 'Mecanismo de Piketty (r > g): el rendimiento patrimonial supera el crecimiento salarial → la concentración se recompone cuando falta compresión política (impuestos a herencia/patrimonio, densidad sindical).'),
          tx('A parte da riqueza do 1% mais rico mudou bastante no último século. Ela caiu por várias décadas e depois voltou a subir. Impostos, salários, sindicatos, crescimento e preços de imóveis e ações fazem parte dessa história.', 'The richest 1% share of wealth changed substantially over the last century. It fell for several decades and then rose again. Taxes, wages, unions, growth, and housing and stock prices all played a role.', 'La parte de la riqueza del 1% más rico cambió mucho durante el último siglo. Cayó durante varias décadas y luego volvió a subir. Impuestos, salarios, sindicatos, crecimiento y precios de viviendas y acciones forman parte de esa historia.'),
        )}
      </p>
    </div>
  )
}

/** Segmento com tooltip próprio (sem depender de largura herdada). */
function Segment({ b, field, total, lang }: { b: WealthBand; field: 'adultosPct' | 'riquezaPct'; total: number; lang: Lang }) {
  const pct = (b[field] / total) * 100
  const showLabel = pct >= 12
  const loc = locale(lang)
  return (
    <div className="group/seg relative h-full" style={{ width: `${pct}%` }}>
      <div className="h-full" style={{ background: b.color }} />
      {showLabel && (
        <span className="pointer-events-none absolute inset-0 flex items-start justify-center pt-1 font-mono text-[9.5px] font-bold text-onaccent">
          {b[field].toLocaleString(loc)}%
        </span>
      )}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 hidden w-44 -translate-x-1/2 rounded-md border border-zinc-700 bg-zinc-900/95 p-1.5 text-center text-[10px] leading-snug text-zinc-200 shadow-xl group-hover/seg:block">
        {bandLabel(lang, b)}: {b.adultosPct.toLocaleString(loc)}% {pick(lang, 'das pessoas', 'of people', 'de las personas')} · {b.riquezaPct.toLocaleString(loc)}% {pick(lang, 'da riqueza', 'of wealth', 'de la riqueza')}
      </span>
    </div>
  )
}

/** Espelho população × riqueza (UBS GWR 2024) — três níveis de leitura. */
export function MirrorBars() {
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const loc = locale(lang)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const totalA = WEALTH_BANDS.reduce((s, b) => s + b.adultosPct, 0)
  const totalR = WEALTH_BANDS.reduce((s, b) => s + b.riquezaPct, 0)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-sm font-bold text-zinc-100">{tx('Metade da humanidade · 1,3% da riqueza', 'Half of humanity · 1.3% of wealth', 'Mitad de la humanidad · 1,3% de la riqueza')}</h3>
      <p className="mt-0.5 text-[11px] text-zinc-500">
        {tx('faixas de patrimônio por adulto — UBS Global Wealth Report 2024 · passe o mouse nas faixas', 'wealth bands per adult — UBS Global Wealth Report 2024 · hover over the bands', 'franjas de patrimonio por adulto — UBS Global Wealth Report 2024 · pasa el cursor por las franjas')}
      </p>
      <div className="mt-3 space-y-3">
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">{tx('População adulta mundial', 'World adult population', 'Población adulta mundial')}</div>
          <div className="flex h-9 w-full overflow-hidden rounded-lg border border-zinc-800">
            {WEALTH_BANDS.map((b) => <Segment key={b.banda} b={b} field="adultosPct" total={totalA} lang={lang} />)}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">{tx('Riqueza total do planeta', 'Total world wealth', 'Riqueza total del planeta')}</div>
          <div className="flex h-9 w-full overflow-hidden rounded-lg border border-zinc-800">
            {WEALTH_BANDS.map((b) => <Segment key={b.banda} b={b} field="riquezaPct" total={totalR} lang={lang} />)}
          </div>
        </div>
      </div>
      <ul className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-2">
        {WEALTH_BANDS.map((b) => (
          <li key={b.banda} className="flex items-center justify-between gap-2 text-[10.5px]">
            <span className="flex min-w-0 items-center gap-1.5 text-zinc-300">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: b.color }} />{bandLabel(lang, b)}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-zinc-400">
              {b.adultosPct.toLocaleString(loc)}% {tx('das pessoas', 'of people', 'de las personas')} → {b.riquezaPct.toLocaleString(loc)}% {tx('da riqueza', 'of wealth', 'de la riqueza')}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 rounded-lg bg-zinc-950/70 p-2.5 text-[11px] leading-relaxed text-zinc-300">
        {textoPorModo(
          mode,
          tx('Como ler: corte as duas barras na mesma altura. A fatia roxa (1,1% das pessoas) quase some na barra de cima — mas DOMINA a de baixo, com 43% de toda a riqueza. Já a fatia vermelha (metade da humanidade) é gigante em cima e vira um fio de cabelo embaixo. Essa assimetria É a concentração.', 'How to read it: compare the same color across both bars. The purple slice (1.1% of people) is tiny in the population bar but dominates the wealth bar with 43% of all wealth. The red slice (about half of adults) is huge above and nearly disappears below. That asymmetry is concentration.', 'Cómo leerlo: compara el mismo color en ambas barras. La franja morada (1,1% de las personas) es mínima en la barra de población, pero domina la de riqueza con 43% del total. La franja roja (casi la mitad de los adultos) es enorme arriba y casi desaparece abajo. Esa asimetría es concentración.'),
          tx('Distribuição log-normal com cauda de Pareto: a cauda superior captura a valorização de ativos (r > g), enquanto a base monetiza exclusivamente força de trabalho. A assimetria entre as barras é a assinatura gráfica da financeirização.', 'Log-normal distribution with a Pareto tail: the upper tail captures asset appreciation (r > g), while the base primarily monetizes labor power. The asymmetry between the bars is a graphic signature of financialization.', 'Distribución lognormal con cola de Pareto: la cola superior captura la valorización de activos (r > g), mientras la base monetiza principalmente fuerza de trabajo. La asimetría entre las barras es una firma gráfica de la financiarización.'),
          tx('Compare as duas barras: um grupo muito pequeno de pessoas aparece com uma parte muito grande da riqueza, enquanto a metade com menos patrimônio fica com uma parcela pequena.', 'Compare the two bars: a very small group of people holds a very large share of wealth, while the half with less wealth holds only a small share.', 'Compara las dos barras: un grupo muy pequeño de personas posee una parte muy grande de la riqueza, mientras la mitad con menos patrimonio conserva una porción pequeña.'),
        )}
      </p>
    </div>
  )
}

export function ConcentrationStats() {
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {CONCENTRATION_STATS.map((st, index) => {
        const copy = statCopy(lang, index, st)
        return (
        <Tip key={st.label} className="w-full" text={textoPorModo(mode, copy.tipDidatico, copy.tipAvancado)}>
          <article className="h-full w-full cursor-help rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 transition-colors hover:border-zinc-600">
            <div className="font-mono text-2xl font-extrabold text-money">{copy.value}</div>
            <div className="mt-1 text-xs font-semibold leading-snug text-zinc-200">{copy.label}</div>
            <div className="mt-0.5 text-[10.5px] text-zinc-500">{copy.sub}</div>
            <div className="mt-1.5 inline-block rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">{copy.source}</div>
          </article>
        </Tip>
      )})}
    </div>
  )
}
