import { useState } from 'react'
import { THEORY_TOPICS } from '../data/theory'
import { useApp } from '../store/useApp'

/**
 * PILAR 2/3/4 — Card comparativo: interpretação Ortodoxa dominante ×
 * leitura Heterodoxa (MMT · Marx · TMD) sobre dívida, câmbio e comércio.
 */
export default function TheoryCompareCard() {
  const [topicId, setTopicId] = useState(THEORY_TOPICS[0].id)
  const didatico = useApp((s) => s.mode) !== 'avancado'
  const topic = THEORY_TOPICS.find((t) => t.id === topicId)!
  const ortoBody = didatico ? topic.ortodoxa.tese : `${topic.ortodoxa.tese} ${topic.ortodoxa.contra}`
  const hetBody = didatico ? topic.heterodoxa.tese : `${topic.heterodoxa.tese} · Ref.: ${topic.heterodoxa.autores}`

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">Duas lentes, três debates</h3>
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {THEORY_TOPICS.map((t) => (
            <button key={t.id} onClick={() => setTopicId(t.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                topicId === t.id ? 'bg-money text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
              }`}>
              {t.titulo}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border border-sky-400/40 bg-sky-400/5 p-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Visão Ortodoxa <span className="font-normal normal-case text-zinc-500">(dominante)</span>
          </h4>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-300">{ortoBody}</p>
        </article>
        <article className="rounded-lg border border-emerald-400/40 bg-emerald-400/5 p-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Leitura Heterodoxa <span className="font-normal normal-case text-zinc-500">MMT · Marx · TMD</span>
          </h4>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-200">{hetBody}</p>
        </article>
      </div>
    </section>
  )
}
