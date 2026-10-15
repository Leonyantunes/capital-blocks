import { useState } from 'react'
import { THEORY_TOPICS, HETERODOX_SCHOOLS } from '../data/theory'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'
import { generatedText } from '../data/generatedTranslations'
import { pick } from '../i18n'
import MethodologyNote from './ui/MethodologyNote'

/**
 * PILAR 2/3/4 — Card comparativo: interpretação Ortodoxa dominante ×
 * leitura Heterodoxa (MMT · Marx · TMD) + Matriz das 4 Escolas Críticas.
 */
export default function TheoryCompareCard() {
  const [activeTab, setActiveTab] = useState<'debates' | 'escolas'>('debates')
  const [topicId, setTopicId] = useState(THEORY_TOPICS[0].id)
  const [schoolId, setSchoolId] = useState(HETERODOX_SCHOOLS[0].id)

  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const li = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2

  const topic = THEORY_TOPICS.find((t) => t.id === topicId)!
  const ortoTese = generatedText(lang, topic.ortodoxa.tese)
  const ortoContra = generatedText(lang, topic.ortodoxa.contra)
  const heteroTese = generatedText(lang, topic.heterodoxa.tese)
  const heteroAutores = generatedText(lang, topic.heterodoxa.autores)
  const ortoBody = textoPorModo(mode, ortoTese, `${ortoTese} ${ortoContra}`)
  const hetBody = textoPorModo(mode, heteroTese, `${heteroTese} · Ref.: ${heteroAutores}`)

  const currentSchool = HETERODOX_SCHOOLS.find((s) => s.id === schoolId)!

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      {/* Seletor Principal: Debates vs. 4 Escolas */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('debates')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              activeTab === 'debates'
                ? 'bg-money text-onaccent shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            {pick(lang, 'Ortodoxa × Heterodoxa', 'Orthodox × Heterodox', 'Ortodoxa × Heterodoxa')}
          </button>
          <button
            onClick={() => setActiveTab('escolas')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              activeTab === 'escolas'
                ? 'bg-sky-500 text-onaccent shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            {pick(lang, '4 Escolas Críticas', '4 Critical Schools', '4 Escuelas Críticas')}
          </button>
        </div>

        {/* Sub-seletores */}
        {activeTab === 'debates' ? (
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
            {THEORY_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopicId(t.id)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  topicId === t.id ? 'bg-money text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {generatedText(lang, t.titulo)}
              </button>
            ))}
          </div>
        ) : (
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
            {HETERODOX_SCHOOLS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSchoolId(s.id)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  schoolId === s.id ? 'bg-sky-500 text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s.nome.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'debates' ? (
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
      ) : (
        <article className="mt-3 rounded-lg border border-sky-500/30 bg-sky-950/15 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-bold text-sky-200">{currentSchool.nome}</h4>
            <span className="rounded bg-sky-400/20 px-2 py-0.5 font-mono text-[10px] text-sky-300">
              {currentSchool.enfase}
            </span>
          </div>

          <div className="mt-2 rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 font-mono text-xs text-emerald-300">
            <code>{currentSchool.equacaoChave}</code>
          </div>

          <p className="mt-2.5 text-xs leading-relaxed text-zinc-200">
            {currentSchool.teseCentral[li]}
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-3 text-[11px]">
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900/60 p-2">
              <span className="font-bold text-zinc-400 block mb-0.5">{pick(lang, 'Papel do Estado:', 'Role of the State:', 'Papel del Estado:')}</span>
              <span className="text-zinc-300 leading-snug">{currentSchool.papelDoEstado[li]}</span>
            </div>
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900/60 p-2">
              <span className="font-bold text-zinc-400 block mb-0.5">{pick(lang, 'Natureza da Moeda:', 'Nature of Money:', 'Naturaleza del Dinero:')}</span>
              <span className="text-zinc-300 leading-snug">{currentSchool.visaoDaMoeda[li]}</span>
            </div>
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900/60 p-2">
              <span className="font-bold text-zinc-400 block mb-0.5">{pick(lang, 'Ponto Forte Analítico:', 'Analytical Strength:', 'Punto Fuerte:')}</span>
              <span className="text-zinc-300 leading-snug">{currentSchool.pontoForte[li]}</span>
            </div>
          </div>
        </article>
      )}

      <MethodologyNote topic="theory" />
    </section>
  )
}

