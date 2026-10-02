import { AnimatePresence, m } from 'framer-motion'
import { TYPE_STYLE, type FlowDef } from '../data/flows'
import { BLOCS } from '../lib/world'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'

/** Card flutuante do fluxo selecionado no mapa 2D — mesma estética dos painéis do mapa. */
export default function FlowCard({ flow, onClose }: { flow: FlowDef | null; onClose: () => void }) {
  const mode = useApp((s) => s.mode)
  const didatico = mode !== 'avancado'

  const code = (id: string | [number, number], label?: string) => {
    if (typeof id === 'string') {
      const b = BLOCS.find((x) => x.id === id)
      if (b) return { code: b.code, color: b.color }
    }
    return { code: label ?? 'ORIGEM', color: '#8b949e' }
  }
  const from = flow ? code(flow.from, flow.fromLabel) : null
  const to = flow ? code(flow.to, flow.toLabel) : null
  const st = flow ? TYPE_STYLE[flow.type] : null

  return (
    <AnimatePresence>
      {flow && st && from && to && (
        <m.div
          key="flow-card"
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 24, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          role="dialog"
          aria-modal="false"
          aria-label="Detalhes do fluxo"
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
                <h2 className="mt-1 text-base font-bold leading-tight text-zinc-100">{flow.titulo}</h2>
              </div>
              <button onClick={onClose} aria-label="Fechar detalhes do fluxo"
                className="shrink-0 rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200">✕</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4 py-3">
            {/* total */}
            <div className="rounded-xl border p-3" style={{ borderColor: `${st.color}55`, background: `${st.color}0a` }}>
              <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">escala anual do fluxo</div>
              <div className="mt-0.5 font-mono text-xl font-extrabold" style={{ color: st.color }}>{flow.totalAnual}</div>
            </div>

            {/* mecanismo dual */}
            <p className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-xs leading-relaxed text-zinc-200">
              {textoPorModo(mode, flow.did, flow.adv)}
            </p>

            {/* itens */}
            <section>
              <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                {flow.type === 'commodities' ? 'O que viaja nessa rota' : flow.type === 'drain' ? 'Quem tira, de onde, para onde' : 'Composição do fluxo'}
              </h3>
              <div className="space-y-1.5">
                {flow.itens.map((it) => (
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

            {flow.fonte && (
              <p className="font-mono text-[9px] leading-relaxed text-zinc-600">fontes: {flow.fonte}</p>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
