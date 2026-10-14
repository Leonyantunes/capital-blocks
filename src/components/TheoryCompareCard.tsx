import { useState } from 'react'
import { THEORY_TOPICS } from '../data/theory'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'
import { generatedText } from '../data/generatedTranslations'
import { pick } from '../i18n'

/**
 * PILAR 2/3/4 — Card comparativo: interpretação Ortodoxa dominante ×
 * leitura Heterodoxa (MMT · Marx · TMD) sobre dívida, câmbio e comércio.
 */
export default function TheoryCompareCard() {
  const [topicId, setTopicId] = useState(THEORY_TOPICS[0].id)
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const topic = THEORY_TOPICS.find((t) => t.id === topicId)!
  const ortoTese = generatedText(lang, topic.ortodoxa.tese)
  const ortoContra = generatedText(lang, topic.ortodoxa.contra)
  const heteroTese = generatedText(lang, topic.heterodoxa.tese)
  const heteroAutores = generatedText(lang, topic.heterodoxa.autores)
  const ortoBody = textoPorModo(mode, ortoTese, `${ortoTese} ${ortoContra}`)
  const hetBody = textoPorModo(mode, heteroTese, `${heteroTese} · Ref.: ${heteroAutores}`)

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">
          {pick(lang, 'Duas lentes, três debates', 'Two lenses, three debates', 'Dos lentes, tres debates')}
        </h3>
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {THEORY_TOPICS.map((t) => (
            <button key={t.id} onClick={() => setTopicId(t.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                topicId === t.id ? 'bg-money text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
              }`}>
              {generatedText(lang, t.titulo)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border border-sky-400/40 bg-sky-400/5 p-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
            {pick(lang, 'Visão Ortodoxa', 'Orthodox view', 'Visión ortodoxa')}{' '}
            <span className="font-normal normal-case text-zinc-500">
              {pick(lang, '(dominante)', '(mainstream)', '(dominante)')}
            </span>
          </h4>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-300">{ortoBody}</p>
        </article>
        <article className="rounded-lg border border-emerald-400/40 bg-emerald-400/5 p-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            {pick(lang, 'Leitura Heterodoxa', 'Heterodox reading', 'Lectura heterodoxa')}{' '}
            <span className="font-normal normal-case text-zinc-500">MMT · Marx · TMD</span>
          </h4>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-200">{hetBody}</p>
        </article>
      </div>
    </section>
  )
}
