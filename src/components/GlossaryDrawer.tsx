import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { GLOSSARY, type GlossaryTerm } from '../data/glossary'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'

const CAT_LABEL: Record<GlossaryTerm['categoria'], { label: string; color: string }> = {
  valor: { label: 'Valor & exploração', color: '#f44336' },
  moeda: { label: 'Moeda & dívida', color: '#ffc107' },
  dependencia: { label: 'Dependência & imperialismo', color: '#ba68c8' },
  crise: { label: 'Crises', color: '#42a5f5' },
}

/** GLOSSÁRIO GLOBAL — termos-chave com definições para os três níveis de leitura. */
export default function GlossaryDrawer() {
  const { glossaryOpen, setGlossaryOpen, mode } = useApp()
  const [query, setQuery] = useState('')
  const trapRef = useFocusTrap(glossaryOpen, () => setGlossaryOpen(false))
  const didatico = mode !== 'avancado'

  const list = GLOSSARY.filter((g) =>
    !query || `${g.termo} ${g.formal} ${g.didatico} ${g.avancado}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <AnimatePresence>
      {glossaryOpen && (
        <>
          <m.div key="g-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60" onClick={() => setGlossaryOpen(false)} />
          <m.aside key="g-panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog" aria-modal="true" aria-label="Glossário" ref={trapRef}
            className="thin-scroll fixed inset-y-0 right-0 z-[61] w-full overflow-y-auto border-l border-zinc-800 bg-zinc-900 shadow-2xl sm:w-[460px]"
          >
            <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">
                    {textoPorModo(mode, 'as ideias do site, sem enrolação', 'categorias teóricas · THEORY.md', 'palavras difíceis explicadas de forma simples')}
                  </div>
                  <h2 className="text-lg font-bold text-zinc-100">Glossário</h2>
                </div>
                <button onClick={() => setGlossaryOpen(false)} aria-label="Fechar glossário"
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200">✕</button>
              </div>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar termo…"
                className="mt-2.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-money/60" />
            </div>

            <div className="flex flex-col gap-3 px-5 py-4">
              {list.map((g) => (
                <article key={g.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-zinc-100">{g.termo}</h3>
                    <span className="shrink-0 rounded px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider"
                      style={{ color: CAT_LABEL[g.categoria].color, background: `${CAT_LABEL[g.categoria].color}18` }}>
                      {CAT_LABEL[g.categoria].label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-200">{textoPorModo(mode, g.didatico, g.avancado)}</p>
                  <p className="mt-1.5 font-mono text-[9.5px] text-zinc-600">
                    {textoPorModo(mode, `nos livros aparece como: ${g.formal}`, g.formal, `nome usado nos livros: ${g.formal}`)}
                  </p>
                </article>
              ))}
              {list.length === 0 && (
                <p className="py-8 text-center text-xs text-zinc-600">nenhum termo encontrado para “{query}”</p>
              )}
            </div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  )
}
