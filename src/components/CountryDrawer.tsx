import { AnimatePresence, m } from 'framer-motion'
import { COUNTRIES, FRACTION_META, type FractionKey } from '../data/countries'
import DonutChart from './DonutChart'
import Tip from './ui/Tip'
import { fmtTri } from '../data/countries'
import { TMD_CHANNELS } from '../data/theory'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useFractions } from '../lib/useModo'
import { useApp } from '../store/useApp'

/** PILAR 4 — bloco TMD: três canais de vazamento + tubo animado Sul → Norte. */
function TmdBlock({ countryName }: { countryName: string }) {
  const mode = useApp((s) => s.mode)
  const didatico = mode === 'didatico'
  return (
    <section className="rounded-xl border border-labor/40 bg-labor/5 p-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-red-300">
        TMD · Vaza de valor ao Centro (Marini/dos Santos)
      </h3>

      {/* tubo de drenagem */}
      <svg viewBox="0 0 320 84" className="mt-2 h-auto w-full" role="img" aria-label="Fluxo de valor do Sul para o Norte">
        {[18, 42, 66].map((y) => (
          <path key={y} d={`M 8 ${y} C 110 ${y}, 200 42, 300 42`} fill="none"
            stroke={['#f44336', '#ba68c8', '#ffc107'][[18, 42, 66].indexOf(y)]} strokeWidth="1.6"
            strokeDasharray="4 4" className="flow-line" opacity="0.85" />
        ))}
        {[0, 1].map((i) => (
          [18, 42, 66].map((y) => (
            <circle key={`${y}-${i}`} r="2.2" fill={['#f44336', '#ba68c8', '#ffc107'][[18, 42, 66].indexOf(y)]}>
              <animateMotion dur="3.4s" repeatCount="indefinite" begin={`-${i * 1.7}s`} path={`M 8 ${y} C 110 ${y}, 200 42, 300 42`} />
            </circle>
          ))
        ))}
        <text x="10" y="12" fontSize="9" className="fill-zinc-400">{countryName}</text>
        <rect x="252" y="30" width="64" height="24" rx="5" fill="#161b22" stroke="#30363d" />
        <text x="284" y="40" textAnchor="middle" fontSize="7.5" className="fill-zinc-400">Centro</text>
        <text x="284" y="49" textAnchor="middle" fontSize="7.5" className="fill-zinc-500">NYC / Londres</text>
      </svg>

      <div className="mt-2 space-y-1.5">
        {TMD_CHANNELS.map((ch, i) => (
          <Tip key={ch.tipo} text={didatico ? ch.textoDidatico : ch.textoAvancado}>
            <div className="cursor-help rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 transition-colors hover:border-zinc-600">
              <div className="flex items-center gap-1.5 text-[11px] font-bold"
                style={{ color: ['#f44336', '#ba68c8', '#ffc107'][i] }}>
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: ['#f44336', '#ba68c8', '#ffc107'][i] }} />
                {ch.tipo}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
                {didatico ? ch.textoDidatico : ch.textoAvancado}
              </p>
            </div>
          </Tip>
        ))}
      </div>
    </section>
  )
}

/** Monta os segmentos da rosca com os rótulos do nível de leitura atual. */
function toSegments(
  c: (typeof COUNTRIES)[number],
  hidden: FractionKey[],
  fracs: { key: FractionKey; label: string; color: string }[],
) {
  return fracs
    .filter((f) => !hidden.includes(f.key))
    .map((f) => ({ key: f.key, label: f.label, value: c.fractions[f.key], color: f.color }))
}

function IlaiseBlock() {
  const c = COUNTRIES.find((x) => x.id === 'brasil')!
  const il = c.ilaese!
  const maxPct = Math.max(...il.desindustrializacao.map((d) => d.pctIndustria))
  return (
    <section className="rounded-xl border border-labor/40 bg-labor/5 p-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-red-300">
        Raio-X ILAESE · Reprimarização
      </h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Tip text="Exército Industrial de Reserva: quem está fora do emprego formal ou subempregado — pressão permanente sobre salários e condições.">
          <div className="cursor-help rounded-lg bg-zinc-950/60 p-2">
            <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">Exército de reserva</div>
            <div className="font-mono text-base font-bold text-red-300">{il.reservaMilhoes.toLocaleString('pt-BR')} mi</div>
            <div className="font-mono text-[10px] text-zinc-500">{il.reservaPct.toLocaleString('pt-BR')}% da população</div>
          </div>
        </Tip>
        <div className="rounded-lg bg-zinc-950/60 p-2">
          <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">Remessas de lucros</div>
          <div className="font-mono text-sm font-bold text-fuchsia-300">{il.remessasLucros}</div>
          <div className="text-[10px] text-zinc-500">vaza da mais-valia nacional</div>
        </div>
      </div>
      <div className="mt-2">
        <div className="mb-1 text-[9.5px] uppercase tracking-wider text-zinc-500">
          Participação da indústria no PIB
        </div>
        <div className="flex items-end gap-2">
          {il.desindustrializacao.map((d) => (
            <div key={d.ano} className="flex flex-1 flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-zinc-400">{d.pctIndustria.toLocaleString('pt-BR')}%</span>
              <div className="w-full rounded-t bg-gradient-to-t from-sky-400/30 to-red-400"
                style={{ height: `${(d.pctIndustria / maxPct) * 52}px` }} />
              <span className="font-mono text-[10px] text-zinc-500">{d.ano}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function CountryDrawer() {
  const { countryId, closeCountry, basis, setBasis, hiddenFractions, toggleFraction } = useApp()
  const c = countryId ? COUNTRIES.find((x) => x.id === countryId) ?? null : null
  const trapRef = useFocusTrap<HTMLElement>(!!c, closeCountry)
  /* rótulos das frações no nível de leitura atual (Simples mostra "Fábricas e
     máquinas" em vez de "Capital Produtivo") */
  const fracs = useFractions()

  return (
    <>
      <AnimatePresence>
        {c && (
          <m.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60" onClick={closeCountry}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {c && (
          <m.aside
            key="panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog" aria-modal="true" aria-label="Painel do país" ref={trapRef}
            className="thin-scroll fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-zinc-800 bg-zinc-900 shadow-2xl sm:w-[440px]"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-zinc-800 bg-zinc-900/95 px-5 py-4 backdrop-blur">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">{c.region} · bloco interno</div>
                <h2 className="text-lg font-bold text-zinc-100">{c.name}</h2>
                <p className="mt-0.5 text-xs leading-snug text-zinc-400">{c.profile}</p>
              </div>
              <button onClick={closeCountry} aria-label="Fechar painel"
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-5 px-5 py-4">
              {/* PIB + base de preço */}
              <section>
                <div className="mb-2 inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
                  {(['nominal', 'ppp'] as const).map((b) => (
                    <button key={b} onClick={() => setBasis(b)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                        basis === b ? 'bg-money text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
                      }`}>
                      {b === 'nominal' ? 'PIB Nominal' : 'PPP'}
                    </button>
                  ))}
                </div>
                <Tip text={basis === 'nominal'
                  ? 'Tamanho da economia convertido aos câmbios atuais — mede o poder de compra internacional dos capitais dominantes.'
                  : 'Ajustado pelo custo de vida local — aproxima o tamanho "físico" real da economia.'}>
                  <span className="inline-block cursor-help font-mono text-3xl font-bold text-zinc-100">{fmtTri(basis === 'nominal' ? c.gdpNominal : c.gdpPPP)}</span>
                </Tip>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {basis === 'nominal' ? 'PPP equivalente: ' : 'Nominal: '}
                  <span className="font-mono text-zinc-400">{fmtTri(basis === 'nominal' ? c.gdpPPP : c.gdpNominal)}</span> · fonte aproximada: FMI
                </div>
              </section>

              {/* Rosca por fração */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  Decomposição por frações de capital
                </h3>
                <div className="flex items-center gap-4">
                  <DonutChart
                    segments={toSegments(c, hiddenFractions, fracs)}
                    centerLabel={basis === 'nominal' ? 'PIB nominal' : 'PIB PPP'}
                    centerValue={fmtTri(basis === 'nominal' ? c.gdpNominal : c.gdpPPP)}
                  />
                  <ul className="min-w-0 flex-1 space-y-1.5">
                    {(Object.keys(FRACTION_META) as FractionKey[]).map((f) => {
                      const meta = fracs.find((x) => x.key === f) ?? { ...FRACTION_META[f], key: f }
                      const off = hiddenFractions.includes(f)
                      return (
                        <li key={f}>
                          <button onClick={() => toggleFraction(f)} title="Clique para ocultar/mostrar"
                            className={`group flex w-full items-center justify-between gap-2 rounded-md border px-2 py-1 text-left transition-colors ${
                              off ? 'border-transparent opacity-40' : 'border-zinc-800 hover:border-zinc-600'
                            }`}>
                            <span className="flex min-w-0 items-center gap-1.5">
                              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: meta.color }} />
                              <span className="truncate text-[11px] text-zinc-300">{meta.label}</span>
                            </span>
                            {!off && (
                              <span className="shrink-0 font-mono text-[10px] text-zinc-400">
                                {c.fractions[f]}% · {fmtTri((c.fractions[f] / 100) * (basis === 'nominal' ? c.gdpNominal : c.gdpPPP))}
                              </span>
                            )}
                          </button>
                          {!off && <p className="mt-0.5 pl-4 text-[10px] leading-tight text-zinc-500">{meta.desc}</p>}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <p className="mt-1.5 text-[10px] text-zinc-600">Decomposição didática estimada — não é estatística oficial.</p>
              </section>

              {c.ilaese && <IlaiseBlock />}

              {c.tmd && <TmdBlock countryName={c.name} />}

              {/* Guerras internas entre frações */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-red-400">
                  Guerra interna de blocos
                </h3>
                <div className="space-y-2">
                  {c.factions.map((fa) => (
                    <article key={fa.name} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                      <h4 className="text-sm font-semibold text-zinc-100">{fa.name}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">{fa.thesis}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {fa.firms.map((firm) => (
                          <span key={firm} className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
                            {firm}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </m.aside>
        )}
      </AnimatePresence>
    </>
  )
}
