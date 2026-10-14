import { AnimatePresence, m } from 'framer-motion'
import { flowForLang, flowTypeStyleForLang, type FlowDef } from '../data/flows'
import { BLOCS } from '../lib/world'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'

/** Card flutuante do fluxo selecionado no mapa 2D — mesma estética dos painéis do mapa. */
export default function FlowCard({ flow, onClose }: { flow: FlowDef | null; onClose: () => void }) {
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const displayFlow = flow ? flowForLang(flow, lang) : null
  const copy = lang === 'en'
    ? { origin: 'ORIGIN', aria: 'Flow details', close: 'Close flow details', annual: 'annual flow scale', commodities: 'What travels on this route', drain: 'Who extracts it, from where, to where', composition: 'Flow composition', sources: 'sources' }
    : lang === 'es'
      ? { origin: 'ORIGEN', aria: 'Detalles del flujo', close: 'Cerrar detalles del flujo', annual: 'escala anual del flujo', commodities: 'Qué viaja por esta ruta', drain: 'Quién extrae, de dónde y hacia dónde', composition: 'Composición del flujo', sources: 'fuentes' }
      : { origin: 'ORIGEM', aria: 'Detalhes do fluxo', close: 'Fechar detalhes do fluxo', annual: 'escala anual do fluxo', commodities: 'O que viaja nessa rota', drain: 'Quem tira, de onde, para onde', composition: 'Composição do fluxo', sources: 'fontes' }

  const code = (id: string | [number, number], label?: string) => {
    if (typeof id === 'string') {
      const b = BLOCS.find((x) => x.id === id)
      if (b) return { code: b.code, color: b.color }
    }
    return { code: label ?? copy.origin, color: '#8b949e' }
  }
  const from = displayFlow ? code(displayFlow.from, displayFlow.fromLabel) : null
  const to = displayFlow ? code(displayFlow.to, displayFlow.toLabel) : null
  const st = displayFlow ? flowTypeStyleForLang(displayFlow.type, lang) : null

  return (
    <AnimatePresence>
      {displayFlow && st && from && to && (
        <m.div
          key="flow-card"
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 24, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          role="dialog"
          aria-modal="false"
          aria-label={copy.aria}
          className="thin-scroll absolute bottom-14 left-1/2 z-30 max-h-[54%] w-[min(94%,580px)] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/95 shadow-2xl backdrop-blur max-md:bottom-[5rem]"
          style={{ boxShadow: `0 0 32px ${st.color}26, 0 18px 50px rgba(0,0,0,.55)` }}
        >
          <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 px-4 py-3 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <span style={{ color: from.color }}>{from.code}</span>
                  <span className="text-zinc-600">──▶</span>
                  <span style={{ color: to.color }}>{to.code}</span>
                  <span className="ml-1 rounded px-1.5 py-0.5" style={{ background: `${st.color}22`, color: st.color }}>
                    {st.label.split('(')[0].trim()}
                  </span>
                </div>
                <h2 className="mt-1 text-base font-bold leading-tight text-zinc-100">{displayFlow.titulo}</h2>
              </div>
              <button onClick={onClose} aria-label={copy.close}
                className="shrink-0 rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200">✕</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4 py-3">
            {/* total */}
            <div className="rounded-xl border p-3" style={{ borderColor: `${st.color}55`, background: `${st.color}0a` }}>
              <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">{copy.annual}</div>
              <div className="mt-0.5 font-mono text-xl font-extrabold" style={{ color: st.color }}>{displayFlow.totalAnual}</div>
            </div>

            {/* mecanismo dual */}
            <p className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-xs leading-relaxed text-zinc-200">
              {textoPorModo(mode, displayFlow.did, displayFlow.adv)}
            </p>

            {/* itens */}
            <section>
              <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                {displayFlow.type === 'commodities' ? copy.commodities : displayFlow.type === 'drain' ? copy.drain : copy.composition}
              </h3>
              <div className="space-y-1.5">
                {displayFlow.itens.map((it) => (
                  <div key={it.rotulo} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[11px] font-semibold text-zinc-100">{it.rotulo}</span>
                      <span className="shrink-0 font-mono text-[10.5px] font-bold" style={{ color: st.color }}>{it.valor}</span>
                    </div>
                    {it.nota && <div className="mt-0.5 text-[10px] leading-snug text-zinc-500">{it.nota}</div>}
                  </div>
                ))}
              </div>
            </section>

            {displayFlow.fonte && (
              <p className="font-mono text-[9px] leading-relaxed text-zinc-600">{copy.sources}: {displayFlow.fonte}</p>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
