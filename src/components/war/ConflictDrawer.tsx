import { Fragment } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Tip from '../ui/Tip'
import { WAR_CONFLICTS, warText } from '../../data/wars'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'
import { locale, pick, type Lang } from '../../i18n'

function SurgeChart({ s, lang }: {
  s: { baseLabel: string; baseVal: number; nowLabel: string; nowVal: number }
  lang: Lang
}) {
  const max = Math.max(s.baseVal, s.nowVal)
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
      <div className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-500">
        {pick(lang, 'Ação / lucro (índice normalizado)', 'Stock / profit (normalized index)', 'Acción / beneficio (índice normalizado)')}
      </div>
      <div className="space-y-1.5">
        <Bar label={warText(lang, s.baseLabel)} val={s.baseVal} max={max} color="#6b7280" lang={lang} />
        <Bar label={warText(lang, s.nowLabel)} val={s.nowVal} max={max} color="#4caf50" lang={lang} />
      </div>
      <div className="mt-1 font-mono text-[10px] text-emerald-300">
        ×{(s.nowVal / s.baseVal).toLocaleString(locale(lang), { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {pick(lang, 'desde o início', 'since the start', 'desde el inicio')}
      </div>
    </div>
  )
}

function Bar({ label, val, max, color, lang }: { label: string; val: number; max: number; color: string; lang: Lang }) {
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[10px] text-zinc-400">
        <span>{label}</span>
        <span className="font-mono">{val.toLocaleString(locale(lang))}</span>
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
  const lang = useApp((s) => s.lang)
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
            role="dialog" aria-modal="true" aria-label={pick(lang, 'Quem lucra com esta guerra', 'Who profits from this war', 'Quién gana con esta guerra')} ref={trapRef}
            className="thin-scroll fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-zinc-800 bg-zinc-900 shadow-2xl sm:w-[480px]"
          >
            <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-red-300">War Room · {pick(lang, 'quem lucra', 'who profits', 'quién gana')}</div>
                  <h2 className="mt-0.5 text-lg font-bold leading-tight text-zinc-100">{warText(lang, c.nome)}</h2>
                  <p className="mt-0.5 text-xs text-zinc-500">{warText(lang, c.periodo)}</p>
                </div>
                <button onClick={onClose} aria-label={pick(lang, 'Fechar', 'Close', 'Cerrar')}
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200">✕</button>
              </div>
            </div>

            <div className="flex flex-col gap-5 px-5 py-4">
              {/* mecanismo */}
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {pick(lang, 'Como o capital lucra aqui', 'How capital profits here', 'Cómo gana el capital aquí')}
                </h3>
                <p className="mt-1.5 rounded-lg border p-3 text-xs leading-relaxed text-zinc-200"
                  style={{ borderColor: '#f4433655', background: '#f443360d' }}>
                  {textoPorModo(mode, warText(lang, c.mecanismoDidatico), warText(lang, c.mecanismoAvancado))}
                </p>
              </section>

              {/* stats */}
              {c.stats.length > 0 && (
                <section className="grid gap-2 sm:grid-cols-2">
                  {c.stats.map((st) => (
                    <div key={st.label} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
                      <div className="font-mono text-sm font-bold text-money">{warText(lang, st.valor)}</div>
                      <div className="mt-0.5 text-[10.5px] leading-snug text-zinc-400">{warText(lang, st.label)}</div>
                      <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-600">{warText(lang, st.fonte)}</div>
                    </div>
                  ))}
                </section>
              )}

              {/* quem lucra */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
                  {pick(lang, 'Quem lucra com esta guerra', 'Who profits from this war', 'Quién gana con esta guerra')}
                </h3>
                <div className="space-y-2.5">
                  {c.empresas.map((emp) => (
                    <article key={emp.nome} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100">{warText(lang, emp.nome)}</h4>
                          <span className="text-[10.5px] text-zinc-500">{warText(lang, emp.setor)} · {warText(lang, emp.pais)}</span>
                        </div>
                        {emp.ref && (
                          <Tip text={pick(lang, 'Matriz rastreada no mapa — a linha de suprimento parte da sede.', 'Headquarters tracked on the map — the supply line starts at its headquarters.', 'Sede rastreada en el mapa — la línea de suministro parte de la sede.')}>
                            <span className="cursor-help rounded bg-money/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-money">{pick(lang, 'matriz', 'HQ', 'sede')}</span>
                          </Tip>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                        {textoPorModo(mode, warText(lang, emp.ganhoDidatico), warText(lang, emp.ganhoAvancado))}
                      </p>
                      {emp.surge && (
                        <div className="mt-2">
                          <SurgeChart s={emp.surge} lang={lang} />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>

              {/* origem da mais-valia */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-fuchsia-300">
                  {pick(lang, 'Origem da mais-valia do conflito', 'Origin of conflict surplus value', 'Origen de la plusvalía del conflicto')}
                </h3>
                <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 rounded-xl border border-dashed border-fuchsia-400/40 bg-fuchsia-400/5 p-3 text-[11px]">
                  {[
                    { t: pick(lang, 'Impostos + dívida pública', 'Taxes + public debt', 'Impuestos + deuda pública'), d: textoPorModo(mode, pick(lang, 'O dinheiro sai do bolso dos trabalhadores (impostos sobre consumo/salário) e de títulos comprados por bancos.', 'The money comes from workers’ pockets (consumption/wage taxes) and from bonds purchased by banks.', 'El dinero sale del bolsillo de los trabajadores (impuestos al consumo/salario) y de bonos comprados por bancos.'), pick(lang, 'Fiscalização regressiva + endividamento: o serviço da dívida amplia o repasse ao capital portador de juros.', 'Regressive taxation + indebtedness: debt service expands transfers to interest-bearing capital.', 'Fiscalidad regresiva + endeudamiento: el servicio de la deuda amplía la transferencia al capital portador de interés.'), pick(lang, 'Governos financiam gastos com impostos e emissão de dívida, dependendo das regras de cada país.', 'Governments finance spending through taxes and debt issuance, depending on each country’s rules.', 'Los gobiernos financian el gasto con impuestos y emisión de deuda, según las reglas de cada país.')) },
                    { t: pick(lang, 'Orçamento de defesa', 'Defense budget', 'Presupuesto de defensa'), d: textoPorModo(mode, pick(lang, 'O Congresso/Parlamento aprova verbas bilionárias "de emergência" para a guerra.', 'Congress/Parliament approves billions in "emergency" war funding.', 'El Congreso/Parlamento aprueba miles de millones en fondos "de emergencia" para la guerra.'), pick(lang, 'Apropriações suplementares contornam escrutínio orçamentário ordinário.', 'Supplemental appropriations bypass ordinary budget scrutiny.', 'Las asignaciones suplementarias eluden el escrutinio presupuestario ordinario.'), pick(lang, 'Parlamentos e governos aprovam verbas para defesa e, em guerras, também podem abrir gastos extras.', 'Parliaments and governments approve defense funding and can also authorize extra spending during wars.', 'Parlamentos y gobiernos aprueban fondos de defensa y, durante guerras, también pueden autorizar gastos extra.')) },
                    { t: pick(lang, 'Contratos públicos', 'Public contracts', 'Contratos públicos'), d: textoPorModo(mode, pick(lang, 'Empresas recebem encomendas com preço garantido e lucro embutido (cost-plus).', 'Companies receive orders with guaranteed pricing and built-in profit (cost-plus).', 'Las empresas reciben pedidos con precio garantizado y beneficio incluido (cost-plus).'), pick(lang, 'Cost-plus / IDIQ: socialização do risco, privatização da margem.', 'Cost-plus / IDIQ: socialization of risk, privatization of margin.', 'Cost-plus / IDIQ: socialización del riesgo, privatización del margen.'), pick(lang, 'Empresas de defesa recebem contratos do governo para entregar armas, peças e serviços.', 'Defense companies receive government contracts to deliver weapons, parts and services.', 'Las empresas de defensa reciben contratos del gobierno para entregar armas, piezas y servicios.')) },
                    { t: pick(lang, 'Dividendos & ações', 'Dividends & stocks', 'Dividendos y acciones'), d: textoPorModo(mode, pick(lang, 'Os acionistas recebem dividendos e as ações sobem — enquanto os estoques de munição viram fogo de artilharia.', 'Shareholders receive dividends and stocks rise — while ammunition inventories turn into artillery fire.', 'Los accionistas reciben dividendos y las acciones suben — mientras los arsenales de munición se convierten en fuego de artillería.'), pick(lang, 'Buybacks/dividendos financiam valorização acionária; backlog converte destruição em receita projetada.', 'Buybacks/dividends finance stock appreciation; backlog converts destruction into projected revenue.', 'Las recompras/dividendos financian la valorización bursátil; el backlog convierte destrucción en ingresos proyectados.'), pick(lang, 'Quando receitas e expectativas mudam, dividendos e preços das ações dessas empresas também podem mudar.', 'When revenue and expectations change, these companies’ dividends and stock prices can change as well.', 'Cuando cambian los ingresos y las expectativas, también pueden cambiar los dividendos y precios de las acciones de estas empresas.')) },
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
                  {pick(lang, 'Estado paga → contratada lucra → acionista embolsa · o risco fica com quem paga os impostos', 'State pays → contractor profits → shareholder pockets it · the risk stays with taxpayers', 'El Estado paga → la contratista gana → el accionista cobra · el riesgo queda con quien paga impuestos')}
                </p>
              </section>
            </div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  )
}
