import { useState } from 'react'
import { m } from 'framer-motion'
import { useApp } from '../../store/useApp'

interface Q {
  pergunta: string
  unidade: string
  min: number
  max: number
  step: number
  real: number
  formato?: (n: number) => string
  fonte: string
  did: string
}

const QS: Q[] = [
  {
    pergunta: 'Quantos % da riqueza mundial pertence ao Top 1%?',
    unidade: '% da riqueza', min: 0, max: 100, step: 1, real: 47.5,
    fonte: 'UBS Global Wealth Report 2024',
    did: 'Quase metade de tudo — e a fatia cresce a cada ano desde 1980.',
  },
  {
    pergunta: 'Quantos US$ bilhões/ano de lucro de multinacionais são deslocados para paraísos fiscais?',
    unidade: 'US$ bi/ano', min: 0, max: 2000, step: 10, real: 1000,
    fonte: 'Tørsløv–Wier–Zucman (Missing Profits)',
    did: '≈ 1 trilhão por ano — 36 a 40% de TODOS os lucros multinacionais do planeta.',
  },
  {
    pergunta: 'Quantas pessoas morrem por ano de causas ligadas ao TRABALHO (acidentes + doenças)?',
    unidade: 'milhões/ano', min: 0, max: 5, step: 0.05, real: 2.9,
    formato: (n) => `${n.toFixed(2)} mi`,
    fonte: 'ILO, 2023',
    did: 'Quase 3 milhões por ano — mais que guerras. E é tratado como custo operacional.',
  },
  {
    pergunta: 'Quantos bilhões de horas de trabalho de cuidado NÃO PAGO são realizadas por dia no mundo?',
    unidade: 'bilhões de horas/dia', min: 0, max: 30, step: 0.5, real: 16.4,
    fonte: 'ILO, 2018 (~9% do PIB mundial, 80% por mulheres)',
    did: 'A economia invisível que sustenta a visível — e não aparece em nenhum PIB.',
  },
  {
    pergunta: 'Quantos milhões de pessoas vivem hoje em ESCRAVIDÃO CONTEMPORÂNEA?',
    unidade: 'milhões', min: 0, max: 100, step: 1, real: 50,
    fonte: 'ILO / Walk Free, 2021',
    did: '50 milhões — mais do que em qualquer ponto da história da escravidão atlântica.',
  },
]

/** QUIZ ANTES DA REVELAÇÃO — chute primeiro, dado depois (data-journalism). */
export default function DataQuiz() {
  const [idx, setIdx] = useState(0)
  const [guess, setGuess] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const didatico = useApp((s) => s.mode) === 'didatico'
  const q = QS[idx]

  const fmt = (n: number) => q.formato ? q.formato(n) : `${n.toLocaleString('pt-BR')} ${q.unidade}`
  const distancia = guess === null ? 0 : Math.abs(guess - q.real) / q.real

  const revelar = () => setRevealed(true)
  const proxima = () => {
    setIdx((i) => (i + 1) % QS.length)
    setGuess(null); setRevealed(false)
  }

  return (
    <section className="rounded-xl border border-money/40 bg-money/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">Antes de ver o dado: CHUTE 🎯</h3>
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span>pergunta {idx + 1}/{QS.length}</span>
          <button onClick={proxima} className="rounded border border-zinc-700 px-1.5 py-0.5 text-[9.5px] text-zinc-400 hover:text-zinc-200">
            pular →
          </button>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-zinc-500">
        {didatico
          ? 'Estudos mostram que a gente lembra melhor quando erra o chute primeiro. Arraste, arrisque e descubra a realidade:'
          : 'Elicitação de estimativa prévia → ancoragem corrigida: técnica padrão de retenção em data-journalism.'}
      </p>

      <p className="mt-3 text-sm font-semibold text-zinc-100">{q.pergunta}</p>

      {!revealed ? (
        <div className="mt-2">
          <input type="range" min={q.min} max={q.max} step={q.step} value={guess ?? q.min}
            onChange={(e) => setGuess(parseFloat(e.target.value))} className="w-full" />
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-zinc-100">
              seu chute: {guess === null ? '—' : fmt(guess)}
            </span>
            <button onClick={revelar} disabled={guess === null}
              className="rounded-lg bg-money px-3 py-1.5 text-xs font-bold text-zinc-950 disabled:opacity-40">
              revelar o real
            </button>
          </div>
        </div>
      ) : (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
          <div className="rounded-lg border border-emerald-400/50 bg-emerald-400/10 p-3">
            <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">o dado real</div>
            <div className="font-mono text-2xl font-extrabold text-emerald-300">{fmt(q.real)}</div>
            <div className="mt-1 text-[11px] text-zinc-400">
              {guess !== null && (
                <>
                  seu chute: <span className="font-mono font-bold text-zinc-200">{fmt(guess)}</span> ·
                  distância: <span className="font-mono font-bold text-zinc-200">{(distancia * 100).toFixed(0)}%</span>{' '}
                  {distancia < 0.15 ? '— perto demais, você já conhecia?' : distancia < 0.6 ? '— dentro do comum: o sistema conta histórias para esconder esses números.' : '— longe? Normal: é exatamente isso que a narrativa dominante quer.'}
                </>
              )}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-300">{q.did}</p>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-600">fonte: {q.fonte}</div>
          </div>
          <button onClick={proxima}
            className="mt-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 hover:border-money hover:text-money">
            próxima pergunta →
          </button>
        </m.div>
      )}
    </section>
  )
}
