import { useState } from 'react'
import { useApp } from '../../store/useApp'
import { pick } from '../../i18n'
import type { TourQuiz } from '../../data/tour'

interface TourQuizCardProps {
  quiz: TourQuiz
  accentColor?: string
}

export default function TourQuizCard({ quiz, accentColor = '#10b981' }: TourQuizCardProps) {
  const lang = useApp((s) => s.lang)
  const li = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const isCorrect = selected === quiz.correta

  const handleSelect = (idx: number) => {
    setSelected(idx)
    setRevealed(true)
  }

  const handleReset = () => {
    setSelected(null)
    setRevealed(false)
  }

  return (
    <div className="mt-3 rounded-xl border border-amber-500/30 bg-zinc-950/80 p-3.5 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          {pick(lang, 'Desafio de Aprendizagem / Quiz', 'Learning Challenge / Quiz', 'Desafío de Aprendizaje / Quiz')}
        </span>
        {revealed && (
          <button
            onClick={handleReset}
            className="text-[10px] text-zinc-400 underline decoration-dotted hover:text-zinc-200"
          >
            {pick(lang, 'Tentar novamente', 'Try again', 'Intentar de nuevo')}
          </button>
        )}
      </div>

      <h5 className="text-xs font-semibold leading-relaxed text-zinc-100">
        {quiz.pergunta[li]}
      </h5>

      <div className="mt-2.5 space-y-1.5">
        {quiz.opcoes.map((opcao, idx) => {
          let btnStyle = 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80'

          if (revealed) {
            if (idx === quiz.correta) {
              btnStyle = 'border-emerald-500/80 bg-emerald-500/20 text-emerald-200 font-medium'
            } else if (idx === selected) {
              btnStyle = 'border-red-500/80 bg-red-500/20 text-red-200 line-through'
            } else {
              btnStyle = 'border-zinc-800/40 bg-zinc-950/40 text-zinc-500'
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
              className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-colors flex items-start gap-2.5 ${btnStyle}`}
            >
              <span className="shrink-0 font-mono text-[10px] opacity-70 mt-0.5">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span className="leading-snug">{opcao[li]}</span>
            </button>
          )
        })}
      </div>

      {revealed && (
        <div
          className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-relaxed transition-all ${
            isCorrect
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {isCorrect ? (
              <>
                <span className="text-emerald-400">✓</span>
                <span>{pick(lang, 'Resposta Correta!', 'Correct Answer!', '¡Respuesta Correcta!')}</span>
              </>
            ) : (
              <>
                <span className="text-amber-400">ℹ</span>
                <span>{pick(lang, 'Veja a fundamentação:', 'See the explanation:', 'Mira la fundamentación:')}</span>
              </>
            )}
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-300">{quiz.explicacao[li]}</p>
        </div>
      )}
    </div>
  )
}
