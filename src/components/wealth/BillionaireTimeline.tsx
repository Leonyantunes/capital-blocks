import { useEffect, useMemo, useState } from 'react'
import { m } from 'framer-motion'
import { BILLIONAIRES, REF_GDPS } from '../../data/concentration'
import { useApp } from '../../store/useApp'
import { modRef } from '../../data/modules'
import { textoPorModo } from '../../lib/simples'
import { locale, pick, type Lang } from '../../i18n'

function gdpName(lang: Lang, name: string) {
  const names: Record<string, [string, string]> = {
    Alemanha: ['Germany', 'Alemania'], Japão: ['Japan', 'Japón'], 'Reino Unido': ['United Kingdom', 'Reino Unido'],
    França: ['France', 'Francia'], Itália: ['Italy', 'Italia'], Canadá: ['Canada', 'Canadá'], Brasil: ['Brazil', 'Brasil'],
    Rússia: ['Russia', 'Rusia'], 'Coreia do Sul': ['South Korea', 'Corea del Sur'], Austrália: ['Australia', 'Australia'],
    México: ['Mexico', 'México'], Espanha: ['Spain', 'España'], Indonésia: ['Indonesia', 'Indonesia'], Turquia: ['Türkiye', 'Turquía'],
    'Arábia Saudita': ['Saudi Arabia', 'Arabia Saudita'], Suíça: ['Switzerland', 'Suiza'],
  }
  const translated = names[name]
  return translated ? pick(lang, name, translated[0], translated[1]) : name
}

/**
 * PILAR CONCENTRAÇÃO — corrida das fortunas 1987→2025 (Forbes, aprox.).
 * Slider + play: top 5 por ano, nº de bilionários e dimensão vs PIBs nacionais.
 */
export default function BillionaireTimeline() {
  const [idx, setIdx] = useState(BILLIONAIRES.length - 1)
  const [playing, setPlaying] = useState(false)
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const didatico = mode !== 'avancado'
  const loc = locale(lang)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const biUnit = tx('bi', 'bn', 'mil M')
  const triUnit = tx('tri', 'tn', 'bill.')

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setIdx((i) => (i + 1) % BILLIONAIRES.length), 1200)
    return () => clearInterval(t)
  }, [playing])

  const year = BILLIONAIRES[idx]
  const sorted = useMemo(() => [...year.top].sort((a, b) => b.bi - a.bi), [year])
  const maxBi = sorted[0]?.bi ?? 1
  const sum = sorted.reduce((s, x) => s + x.bi, 0)
  const sumTri = sum / 1000

  const ref = [...REF_GDPS].reverse().find((g) => g.tri <= sumTri)
  const refText = ref
    ? tx(
      `≈ PIB anual de ${gdpName(lang, ref.nome)} (US$ ${ref.tri.toLocaleString(loc)} ${triUnit})`,
      `≈ ${gdpName(lang, ref.nome)} annual GDP (US$ ${ref.tri.toLocaleString(loc)} ${triUnit})`,
      `≈ PIB anual de ${gdpName(lang, ref.nome)} (US$ ${ref.tri.toLocaleString(loc)} ${triUnit})`,
    )
    : tx('menor que o PIB anual da Suíça', 'less than Switzerland’s annual GDP', 'menor que el PIB anual de Suiza')

  // gráfico de degraus: nº de bilionários
  const SW = 300
  const SH = 84
  const maxN = Math.max(...BILLIONAIRES.map((b) => b.nBilionarios))
  const step = (i: number) => {
    const x = 8 + (i / (BILLIONAIRES.length - 1)) * (SW - 20)
    const y = SH - 14 - (BILLIONAIRES[i].nBilionarios / maxN) * (SH - 26)
    return { x, y }
  }
  const lineD = BILLIONAIRES.map((_, i) => {
    const p = step(i)
    return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`
  }).join(' ')

  const first = BILLIONAIRES[0]
  const last = BILLIONAIRES[BILLIONAIRES.length - 1]
  const topGrowth = Math.round(last.top[0].bi / first.top[0].bi)

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">{tx('A era dos bilionários — 1987 → hoje', 'The billionaire era — 1987 → today', 'La era de los multimillonarios — 1987 → hoy')}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setPlaying((p) => !p)}
            className="rounded-md border border-zinc-700 px-2.5 py-1 font-mono text-[11px] text-zinc-300 hover:border-money hover:text-money">
            {playing ? tx('❚❚ pausar', '❚❚ pause', '❚❚ pausar') : tx('▶ animar', '▶ animate', '▶ animar')}
          </button>
          <span className="font-mono text-[10px] text-zinc-500">{tx('Forbes, aprox.', 'Forbes, approx.', 'Forbes, aprox.')}</span>
        </div>
      </div>

      {/* ano + slider */}
      <div className="mt-2 flex items-center gap-3">
        <span className="w-20 shrink-0 font-mono text-3xl font-extrabold text-money">{year.ano}</span>
        <input
          type="range" min={0} max={BILLIONAIRES.length - 1} step={1} value={idx}
          onChange={(e) => { setPlaying(false); setIdx(parseInt(e.target.value)) }}
          className="flex-1"
          aria-label={tx('Ano da corrida dos bilionários', 'Year in the billionaire race', 'Año en la carrera de los multimillonarios')}
        />
      </div>
      <div className="mt-0.5 flex justify-between font-mono text-[9.5px] text-zinc-600">
        <span>1987 · {tx('nº1', '#1', 'n.º 1')}: US$ 20 {biUnit}</span>
        <span>2025 · {tx('nº1', '#1', 'n.º 1')}: US$ 440 {biUnit} ({topGrowth}× {tx('em dólares nominais', 'in nominal dollars', 'en dólares nominales')})</span>
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        {/* barras top 5 */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-[10.5px]">
            <span className="text-zinc-400">{tx(`Maiores fortunas do ano (US$ ${biUnit})`, `Largest fortunes of the year (US$ ${biUnit})`, `Mayores fortunas del año (US$ ${biUnit})`)}</span>
            <span className="font-mono text-zinc-500">{year.nBilionarios.toLocaleString(loc)} {tx('bilionários no mundo', 'billionaires worldwide', 'multimillonarios en el mundo')}</span>
          </div>
          <div className="space-y-1.5">
            {sorted.map((b, i) => (
              <div key={b.nome} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-right font-mono text-[10px] text-zinc-600">{lang === 'en' ? `#${i + 1}` : `${i + 1}.º`}</span>
                <span className="w-36 shrink-0 truncate text-[11px] text-zinc-200">{b.nome}</span>
                <span className="hidden w-8 shrink-0 font-mono text-[9px] text-zinc-600 sm:block">{b.pais === 'EUA' ? tx('EUA', 'USA', 'EEUU') : b.pais}</span>
                <div className="h-5 flex-1 overflow-hidden rounded bg-zinc-800/70">
                  <m.div
                    initial={false}
                    animate={{ width: `${(b.bi / maxBi) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                    className="h-full rounded"
                    style={{ background: i === 0 ? '#ffc107' : `rgba(255,193,7,${0.85 - i * 0.15})` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[11px] font-bold text-money">
                  ${b.bi.toLocaleString(loc)} {biUnit}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 rounded-lg bg-zinc-950/70 p-2.5 text-[11px] leading-relaxed text-zinc-400">
            <span className="font-mono font-bold text-zinc-200">
              {tx('Top 5 somadas', 'Top 5 combined', 'Top 5 sumadas')}: US$ {sumTri.toLocaleString(loc, { maximumFractionDigits: 2 })} {triUnit}
            </span>{' '}
            — {refText}.{' '}
            {didatico
              ? tx('Em 1987, o homem mais rico do mundo “tinha só” US$ 20 bi e era um japonês de trens. Hoje o topo é um magnata de carros-foguete e redes sociais com 20× mais — e a lista inteira virou americana e tecnológica.', 'In 1987, the world’s richest person had about US$20 bn and built his fortune around Japanese rail and real estate. Today the top fortune is more than 20× larger, and the leading ranks are dominated by US technology wealth.', 'En 1987, la persona más rica del mundo tenía unos US$20 mil M y su fortuna estaba ligada a ferrocarriles e inmuebles japoneses. Hoy la mayor fortuna es más de 20× superior y los primeros puestos están dominados por riqueza tecnológica estadounidense.')
              : tx('Composição do topo migra de renda fundiária/industrial (JPN, anos 80) para capitalização de expectativas tecnológicas: a fortuna é o desconto da m futura apropriada via plataformas — amplificada por buybacks e juros reais baixos pós-2010.', 'The composition of the top shifts from land/industrial wealth (Japan, 1980s) toward capitalization of technology expectations: fortunes discount future surplus appropriated through platforms, amplified by buybacks and low real rates after 2010.', 'La composición de la cima pasa de riqueza inmobiliaria/industrial (Japón, años 80) a la capitalización de expectativas tecnológicas: las fortunas descuentan excedente futuro apropiado mediante plataformas, amplificado por recompras y tipos reales bajos después de 2010.')}
          </p>
        </div>

        {/* nº de bilionários + contexto */}
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">{tx('Nº de bilionários no mundo', 'Number of billionaires worldwide', 'Número de multimillonarios en el mundo')}</div>
            <svg viewBox={`0 0 ${SW} ${SH}`} className="h-auto w-full" role="img" aria-label={tx('Evolução do número de bilionários', 'Change in the number of billionaires', 'Evolución del número de multimillonarios')}>
              <path d={`${lineD} L ${step(BILLIONAIRES.length - 1).x},${SH - 14} L ${step(0).x},${SH - 14} Z`}
                fill="#ba68c822" />
              <path d={lineD} fill="none" stroke="#ba68c8" strokeWidth="2" />
              {BILLIONAIRES.map((_, i) => {
                const p = step(i)
                const cur = i === idx
                return <circle key={i} cx={p.x} cy={p.y} r={cur ? 4.5 : 2.2}
                  fill={cur ? '#ffc107' : '#ba68c8'} stroke="#161b22" strokeWidth={cur ? 1.5 : 0} />
              })}
              <text x={step(idx).x} y={step(idx).y - 8} textAnchor="middle" fontSize="10"
                fontWeight="700" className="fill-zinc-100 font-mono">
                {year.nBilionarios.toLocaleString(loc)}
              </text>
              <text x="8" y={SH - 3} fontSize="8" className="fill-zinc-600">1987</text>
              <text x={SW - 8} y={SH - 3} textAnchor="end" fontSize="8" className="fill-zinc-600">2025</text>
            </svg>
            <p className="mt-1 text-[10.5px] leading-snug text-zinc-500">
              {textoPorModo(
                mode,
                tx('De 140 para mais de 3 mil bilionários em uma geração — a lista cresceu 20× enquanto salários reais mal saíram do lugar.', 'From 140 to more than 3,000 billionaires in a generation — the list grew about 20× while real wages rose much more slowly.', 'De 140 a más de 3.000 multimillonarios en una generación — la lista creció cerca de 20× mientras los salarios reales aumentaron mucho más lentamente.'),
                tx('Expansão da classe rentista global: financeirização + valorização de ativos (equities/real estate) + abertura de mercados periféricos à captura de excedente.', 'Expansion of the global rentier class: financialization + asset appreciation (equities/real estate) + opening peripheral markets to surplus capture.', 'Expansión de la clase rentista global: financiarización + valorización de activos (acciones/inmuebles) + apertura de mercados periféricos a la captura de excedente.'),
                tx('A lista mundial passou de cerca de 140 bilionários para mais de 3 mil. Use a linha do tempo para ver como o número e as maiores fortunas mudaram.', 'The global list grew from about 140 billionaires to more than 3,000. Use the timeline to see how the count and largest fortunes changed.', 'La lista mundial pasó de unos 140 multimillonarios a más de 3.000. Usa la línea de tiempo para ver cómo cambiaron el número y las mayores fortunas.'),
              )}
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-money/40 bg-money/5 p-3 text-[11px] leading-relaxed text-zinc-300">
            {mode === 'simples' ? (
              <>
                <strong className="text-money">{tx('Compare com o', 'Compare with', 'Compara con')} {modRef('companies', lang)}:</strong> {tx('o funcionário médio da Walmart ganha cerca de US$ 32 mil por ano. Uma fortuna de centenas de bilhões de dólares equivale a milhares de anos desse salário.', 'the average Walmart employee earns about US$32,000 per year. A fortune worth hundreds of billions of dollars equals thousands of years of that pay.', 'el empleado medio de Walmart gana cerca de US$32.000 al año. Una fortuna de cientos de miles de millones de dólares equivale a miles de años de ese salario.')}
              </>
            ) : didatico ? (
              <>
                <strong className="text-money">{tx('Compare com o', 'Compare with', 'Compara con')} {modRef('companies', lang)}:</strong>{' '}
                {tx('o funcionário médio da Walmart ganha ~US$ 32 mil', 'the average Walmart employee earns ~US$32,000', 'el empleado medio de Walmart gana ~US$32.000')} <em>{tx('por ano', 'per year', 'al año')}</em>.{' '}
                {tx('Em 2025, a fortuna do topo equivale a', 'In 2025, the top fortune equals', 'En 2025, la mayor fortuna equivale a')}{' '}
                <strong>{tx('13.750 anos', '13,750 years', '13.750 años')}</strong> {tx('desse salário. E nenhuma fortuna dessa lista foi construída sem a jornada não paga de milhões de trabalhadores.', 'of that pay. Fortunes on this scale also depend on the labor and value chains of millions of workers.', 'de ese salario. Fortunas de esta escala también dependen del trabajo y de las cadenas de valor de millones de trabajadores.')}
              </>
            ) : (
              <>
                <strong className="text-money">{tx('Acumulação por disposição (Marx):', 'Accumulation through control (Marx):', 'Acumulación mediante control (Marx):')}</strong>{' '}
                {tx('a escala patrimonial contemporânea combina apropriação direta de m (plataformas), renda de monopólio (redes, IP) e valorização fictícia — o ranking é um índice da expropriação socializada.', 'contemporary wealth at this scale combines direct appropriation of surplus (platforms), monopoly rents (networks, IP), and fictitious valuation — the ranking is an index of highly socialized accumulation.', 'el patrimonio contemporáneo a esta escala combina apropiación directa del excedente (plataformas), rentas de monopolio (redes, PI) y valorización ficticia — el ranking funciona como índice de una acumulación altamente socializada.')}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
