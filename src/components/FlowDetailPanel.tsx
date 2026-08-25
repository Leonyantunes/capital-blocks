import { AnimatePresence, m } from 'framer-motion'
import { TYPE_STYLE, type FlowDef } from '../data/flows'
import { BLOCS } from '../lib/world'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useApp } from '../store/useApp'

/** Painel detalhado do fluxo selecionado no mapa-home (fluxo ou estado BR). */
export default function FlowDetailPanel({ flow, onClose, dim = true }: { flow: FlowDef | null; onClose: () => void; dim?: boolean }) {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const trapRef = useFocusTrap(!!flow)

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
        <>
          {dim && (
            <m.div key="f-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/60" onClick={onClose} />
          )}
          <m.aside key="f-panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog" aria-modal="true" aria-label="Detalhes do fluxo" ref={trapRef}
            className="thin-scroll fixed inset-y-0 right-0 z-[56] w-full overflow-y-auto border-l border-zinc-800 bg-zinc-900 shadow-2xl sm:w-[470px]"
          >
            <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 px-5 py-4 backdrop-blur">
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
                  <h2 className="mt-1 text-lg font-bold leading-tight text-zinc-100">{flow.titulo}</h2>
                </div>
                <button onClick={onClose} aria-label="Fechar"
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200">✕</button>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-5 py-4">
              {/* total */}
              <div className="rounded-xl border p-3.5" style={{ borderColor: `${st.color}55`, background: `${st.color}0a` }}>
                <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">escala anual do fluxo</div>
                <div className="mt-0.5 font-mono text-2xl font-extrabold" style={{ color: st.color }}>{flow.totalAnual}</div>
              </div>

              {/* mecanismo dual */}
              <p className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs leading-relaxed text-zinc-200">
                {didatico ? flow.did : flow.adv}
              </p>

              {/* itens */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {flow.type === 'commodities' ? 'O que viaja nessa rota' : flow.type === 'drain' ? 'Quem tira, de onde, para onde' : 'Composição do fluxo'}
                </h3>
                <div className="space-y-1.5">
                  {flow.itens.map((it) => (
                    <div key={it.rotulo} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11.5px] font-semibold text-zinc-100">{it.rotulo}</span>
                        <span className="shrink-0 font-mono text-[11px] font-bold" style={{ color: st.color }}>{it.valor}</span>
                      </div>
                      {it.nota && <div className="mt-0.5 text-[10px] leading-snug text-zinc-500">{it.nota}</div>}
                    </div>
                  ))}
                </div>
              </section>

              {flow.fonte && (
                <p className="font-mono text-[9.5px] leading-relaxed text-zinc-600">fontes: {flow.fonte}</p>
              )}

              <p className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/40 p-2.5 text-[10px] leading-snug text-zinc-500">
                {didatico
                  ? 'Como ler: a largura da linha no mapa representa o tamanho do fluxo, e as partículas mostram a direção. Os valores são anuais e aproximados — o importante é a ORDEM DE GRANDEZA e quem fica com o quê.'
                  : 'Leitura: espessura ∝ escala do fluxo; direção das partículas = sentido da transferência de valor. Valores anuais aproximados — ordem de grandeza e direção importam mais que a casa decimal.'}
              </p>
            </div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  )
}
