import { useEffect, useMemo, useState } from 'react'
import { m } from 'framer-motion'
import { BILLIONAIRES, REF_GDPS } from '../../data/concentration'
import { useApp } from '../../store/useApp'
import { modRef } from '../../data/modules'

/**
 * PILAR CONCENTRAÇÃO — corrida das fortunas 1987→2025 (Forbes, aprox.).
 * Slider + play: top 5 por ano, nº de bilionários e dimensão vs PIBs nacionais.
 */
export default function BillionaireTimeline() {
  const [idx, setIdx] = useState(BILLIONAIRES.length - 1)
  const [playing, setPlaying] = useState(false)
  const didatico = useApp((s) => s.mode) === 'didatico'

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
    ? `≈ PIB anual de ${ref.nome} (US$ ${ref.tri.toLocaleString('pt-BR')} tri)`
    : 'menor que o PIB anual da Suíça'

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
        <h3 className="text-sm font-bold text-zinc-100">A era dos bilionários — 1987 → hoje</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setPlaying((p) => !p)}
            className="rounded-md border border-zinc-700 px-2.5 py-1 font-mono text-[11px] text-zinc-300 hover:border-money hover:text-money">
            {playing ? '❚❚ pausar' : '▶ animar'}
          </button>
          <span className="font-mono text-[10px] text-zinc-500">Forbes, aprox.</span>
        </div>
      </div>

      {/* ano + slider */}
      <div className="mt-2 flex items-center gap-3">
        <span className="w-20 shrink-0 font-mono text-3xl font-extrabold text-money">{year.ano}</span>
        <input
          type="range" min={0} max={BILLIONAIRES.length - 1} step={1} value={idx}
          onChange={(e) => { setPlaying(false); setIdx(parseInt(e.target.value)) }}
          className="flex-1"
          aria-label="Ano da corrida dos bilionários"
        />
      </div>
      <div className="mt-0.5 flex justify-between font-mono text-[9.5px] text-zinc-600">
        <span>1987 · nº1: US$ 20 bi</span>
        <span>2025 · nº1: US$ 440 bi ({topGrowth}× em dólares nominais)</span>
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        {/* barras top 5 */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-[10.5px]">
            <span className="text-zinc-400">Maiores fortunas do ano (US$ bi)</span>
            <span className="font-mono text-zinc-500">{year.nBilionarios.toLocaleString('pt-BR')} bilionários no mundo</span>
          </div>
          <div className="space-y-1.5">
            {sorted.map((b, i) => (
              <div key={b.nome} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-right font-mono text-[10px] text-zinc-600">{i + 1}º</span>
                <span className="w-36 shrink-0 truncate text-[11px] text-zinc-200">{b.nome}</span>
                <span className="hidden w-8 shrink-0 font-mono text-[9px] text-zinc-600 sm:block">{b.pais}</span>
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
                  ${b.bi.toLocaleString('pt-BR')} bi
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 rounded-lg bg-zinc-950/70 p-2.5 text-[11px] leading-relaxed text-zinc-400">
            <span className="font-mono font-bold text-zinc-200">
              Top 5 somadas: US$ {sumTri.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tri
            </span>{' '}
            — {refText}.{' '}
            {didatico
              ? 'Em 1987, o homem mais rico do mundo “tinha só” US$ 20 bi e era um japonês de trens. Hoje o topo é um magnata de carros-foguete e redes sociais com 20× mais — e a lista inteira virou americana e tecnológica.'
              : 'Composição do topo migra de renda fundiária/industrial (JPN, anos 80) para capitalização de expectativas tecnológicas: a fortuna é o desconto da m futura apropriada via plataformas — amplificada por buybacks e juros reais baixos pós-2010.'}
          </p>
        </div>

        {/* nº de bilionários + contexto */}
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">Nº de bilionários no mundo</div>
            <svg viewBox={`0 0 ${SW} ${SH}`} className="h-auto w-full" role="img" aria-label="Evolução do número de bilionários">
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
                {year.nBilionarios.toLocaleString('pt-BR')}
              </text>
              <text x="8" y={SH - 3} fontSize="8" className="fill-zinc-600">1987</text>
              <text x={SW - 8} y={SH - 3} textAnchor="end" fontSize="8" className="fill-zinc-600">2025</text>
            </svg>
            <p className="mt-1 text-[10.5px] leading-snug text-zinc-500">
              {didatico
                ? 'De 140 para mais de 3 mil bilionários em uma geração — a lista cresceu 20× enquanto salários reais mal saíram do lugar.'
                : 'Expansão da classe rentista global: financeirização + valorização de ativos (equities/real estate) + abertura de mercados periféricos à captura de excedente.'}
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-money/40 bg-money/5 p-3 text-[11px] leading-relaxed text-zinc-300">
            {didatico ? (
              <>
                <strong className="text-money">Compare com o {modRef('companies')}:</strong> o funcionário médio da Walmart
                ganha ~US$ 32 mil <em>por ano</em>. Em 2025, a fortuna do topo equivale a{' '}
                <strong>13.750 anos</strong> desse salário. E nenhuma fortuna dessa lista foi construída sem a
                jornada não paga de milhões de trabalhadores.
              </>
            ) : (
              <>
                <strong className="text-money">Acumulação por disposição (Marx):</strong> a escala patrimonial
                contemporânea combina apropriação direta de m (plataformas), renda de monopólio (redes, IP) e
                valorização fictícia — o ranking é um índice da expropriação socializada.
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
