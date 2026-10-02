import { Fragment } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Tip from '../ui/Tip'
import { WAR_CONFLICTS } from '../../data/wars'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'

function SurgeChart({ s }: {
  s: { baseLabel: string; baseVal: number; nowLabel: string; nowVal: number }
}) {
  const max = Math.max(s.baseVal, s.nowVal)
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
      <div className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-500">
        Ação / lucro (índice normalizado)
      </div>
      <div className="space-y-1.5">
        <Bar label={s.baseLabel} val={s.baseVal} max={max} color="#6b7280" />
        <Bar label={s.nowLabel} val={s.nowVal} max={max} color="#4caf50" />
      </div>
      <div className="mt-1 font-mono text-[10px] text-emerald-300">
        ×{(s.nowVal / s.baseVal).toFixed(1)} desde o início
      </div>
    </div>
  )
}

function Bar({ label, val, max, color }: { label: string; val: number; max: number; color: string }) {
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[10px] text-zinc-400">
        <span>{label}</span>
        <span className="font-mono">{val.toLocaleString('pt-BR')}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-zinc-800">
        <m.div initial={{ width: 0 }} animate={{ width: `${(val / max) * 100}%` }}
          transition={{ duration: 0.7 }} className="h-full rounded" style={{ background: color }} />
      </div>
    </div>
  )
}

/** Painel lateral do conflito — “quem lucra com esta guerra”. */
export default function ConflictDrawer({
  conflictId,
  onClose,
}: {
  conflictId: string | null
  onClose: () => void
}) {
  const mode = useApp((s) => s.mode)
  const didatico = mode !== 'avancado'
  const trapRef = useFocusTrap(!!conflictId, onClose)
  const c = WAR_CONFLICTS.find((x) => x.id === conflictId) ?? null

  return (
    <AnimatePresence>
      {c && (
        <>
          <m.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
          <m.aside key="panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog" aria-modal="true" aria-label="Quem lucra com esta guerra" ref={trapRef}
            className="thin-scroll fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-zinc-800 bg-zinc-900 shadow-2xl sm:w-[480px]"
          >
            <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-red-300">War Room · quem lucra</div>
                  <h2 className="mt-0.5 text-lg font-bold leading-tight text-zinc-100">{c.nome}</h2>
                  <p className="mt-0.5 text-xs text-zinc-500">{c.periodo}</p>
                </div>
                <button onClick={onClose} aria-label="Fechar"
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200">✕</button>
              </div>
            </div>

            <div className="flex flex-col gap-5 px-5 py-4">
              {/* mecanismo */}
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  Como o capital lucra aqui
                </h3>
                <p className="mt-1.5 rounded-lg border p-3 text-xs leading-relaxed text-zinc-200"
                  style={{ borderColor: '#f4433655', background: '#f443360d' }}>
                  {textoPorModo(mode, c.mecanismoDidatico, c.mecanismoAvancado)}
                </p>
              </section>

              {/* stats */}
              {c.stats.length > 0 && (
                <section className="grid gap-2 sm:grid-cols-2">
                  {c.stats.map((st) => (
                    <div key={st.label} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
                      <div className="font-mono text-sm font-bold text-money">{st.valor}</div>
                      <div className="mt-0.5 text-[10.5px] leading-snug text-zinc-400">{st.label}</div>
                      <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-600">{st.fonte}</div>
                    </div>
                  ))}
                </section>
              )}

              {/* quem lucra */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
                  Quem lucra com esta guerra
                </h3>
                <div className="space-y-2.5">
                  {c.empresas.map((emp) => (
                    <article key={emp.nome} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100">{emp.nome}</h4>
                          <span className="text-[10.5px] text-zinc-500">{emp.setor} · {emp.pais}</span>
                        </div>
                        {emp.ref && (
                          <Tip text={`Matriz rastreada no mapa — a linha de suprimento parte da sede.`}>
                            <span className="cursor-help rounded bg-money/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-money">matriz</span>
                          </Tip>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                        {textoPorModo(mode, emp.ganhoDidatico, emp.ganhoAvancado)}
                      </p>
                      {emp.surge && (
                        <div className="mt-2">
                          <SurgeChart s={emp.surge} />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>

              {/* origem da mais-valia */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-fuchsia-300">
                  Origem da mais-valia do conflito
                </h3>
                <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 rounded-xl border border-dashed border-fuchsia-400/40 bg-fuchsia-400/5 p-3 text-[11px]">
                  {[
                    { t: 'Impostos + dívida pública', d: textoPorModo(mode, 'O dinheiro sai do bolso dos trabalhadores (impostos sobre consumo/salário) e de títulos comprados por bancos.', 'Fiscalização regressiva + endividamento: o serviço da dívida amplia o repasse ao capital portador de juros.', 'Governos financiam gastos com impostos e emissão de dívida, dependendo das regras de cada país.') },
                    { t: 'Orçamento de defesa', d: textoPorModo(mode, 'O Congresso/Parlamento aprova verbas bilionárias "de emergência" para a guerra.', 'Apropriações suplementares contornam escrutínio orçamentário ordinário.', 'Parlamentos e governos aprovam verbas para defesa e, em guerras, também podem abrir gastos extras.') },
                    { t: 'Contratos públicos', d: textoPorModo(mode, 'Empresas recebem encomendas com preço garantido e lucro embutido (cost-plus).', 'Cost-plus / IDIQ: socialização do risco, privatização da margem.', 'Empresas de defesa recebem contratos do governo para entregar armas, peças e serviços.') },
                    { t: 'Dividendos & ações', d: textoPorModo(mode, 'Os acionistas recebem dividendos e as ações sobem — enquanto os estoques de munição viram fogo de artilharia.', 'Buybacks/dividendos financiam valorização acionária; backlog converte destruição em receita projetada.', 'Quando receitas e expectativas mudam, dividendos e preços das ações dessas empresas também podem mudar.') },
                  ].map((step, i, arr) => (
                    <Fragment key={step.t}>
                      <div className="flex h-full items-center">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-fuchsia-400/70 font-mono text-[9px] font-bold text-fuchsia-300">{i + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-100">{step.t}</div>
                        <div className="text-[10.5px] leading-snug text-zinc-400">{step.d}</div>
                      </div>
                      {i < arr.length - 1 && <div />}
                    </Fragment>
                  ))}
                </div>
                <p className="mt-1.5 text-center text-[10px] text-zinc-600">
                  Estado paga → contratada lucra → acionista embolsa · o risco fica com quem paga os impostos
                </p>
              </section>
            </div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  )
}
