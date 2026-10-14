import { AnimatePresence, m } from 'framer-motion'
import { COUNTRIES, FRACTION_META, countryForLang, fmtTriLang, fractionMetaForLang, type FractionKey } from '../data/countries'
import DonutChart from './DonutChart'
import Tip from './ui/Tip'
import { TMD_CHANNELS } from '../data/theory'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { textoPorModo } from '../lib/simples'
import { useApp } from '../store/useApp'

/** PILAR 4 — bloco TMD: três canais de vazamento + tubo animado Sul → Norte. */
function TmdBlock({ countryName }: { countryName: string }) {
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const copy = lang === 'en'
    ? {
        title: 'Dependency theory · Value drain toward the Center (Marini/dos Santos)', aria: 'Value flow from the Global South to the Global North', center: 'Center', london: 'NYC / London',
        channels: [
          { tipo: 'Unequal exchange', did: 'The South exports lower-priced agricultural and mineral goods and imports expensive machinery, medicines and software. More embodied labor can be exchanged for less monetary value.', adv: 'Declining or asymmetric terms of trade for primary goods can transfer embodied labor toward higher-productivity centers, especially when technology, brands and pricing power remain concentrated there.' },
          { tipo: 'Super-exploitation of labor (Marini)', did: 'Low wages, long hours and intense work help keep export prices competitive while shifting part of the social cost of reproduction onto workers and households.', adv: 'In Marini’s framework, unequal exchange is compensated through labor-power remuneration below its reproduction value plus intensification or extension of the working day.' },
          { tipo: 'Property income + debt outflow', did: 'Profits, royalties and foreign-currency debt service move hard currency back toward multinational headquarters and creditors instead of remaining available for domestic uses.', adv: 'Profit, dividend and royalty repatriation plus external-debt service drain foreign currency and connect domestic surplus generation to accumulation in core financial centers.' },
        ],
      }
    : lang === 'es'
      ? {
          title: 'Teoría de la dependencia · Drenaje de valor hacia el Centro (Marini/dos Santos)', aria: 'Flujo de valor del Sur Global al Norte Global', center: 'Centro', london: 'NYC / Londres',
          channels: [
            { tipo: 'Intercambio desigual', did: 'El Sur exporta bienes agrícolas y minerales de menor precio e importa maquinaria, medicamentos y software caros. Puede intercambiarse más trabajo incorporado por menos valor monetario.', adv: 'Términos de intercambio declinantes o asimétricos para bienes primarios pueden transferir trabajo incorporado hacia centros de mayor productividad, especialmente cuando tecnología, marcas y poder de fijación de precios quedan concentrados allí.' },
            { tipo: 'Superexplotación del trabajo (Marini)', did: 'Salarios bajos, jornadas largas y trabajo intenso ayudan a mantener precios exportadores competitivos mientras trasladan parte del costo social de reproducción a trabajadores y hogares.', adv: 'En el marco de Marini, el intercambio desigual se compensa mediante remuneración de la fuerza de trabajo por debajo de su valor de reproducción más intensificación o extensión de la jornada.' },
            { tipo: 'Salida de rentas de propiedad + deuda', did: 'Ganancias, regalías y servicio de deuda en moneda extranjera trasladan divisas hacia matrices multinacionales y acreedores en lugar de permanecer disponibles para usos domésticos.', adv: 'La repatriación de ganancias, dividendos y regalías más el servicio de deuda externa drenan divisas y conectan el excedente generado internamente con la acumulación en centros financieros.' },
          ],
        }
      : {
          title: 'TMD · Vaza de valor ao Centro (Marini/dos Santos)', aria: 'Fluxo de valor do Sul para o Norte', center: 'Centro', london: 'NYC / Londres',
          channels: TMD_CHANNELS.map((ch) => ({ tipo: ch.tipo, did: ch.textoDidatico, adv: ch.textoAvancado })),
        }
  return (
    <section className="rounded-xl border border-labor/40 bg-labor/5 p-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-red-300">
        {copy.title}
      </h3>

      {/* tubo de drenagem */}
      <svg viewBox="0 0 320 84" className="mt-2 h-auto w-full" role="img" aria-label={copy.aria}>
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
        <text x="284" y="40" textAnchor="middle" fontSize="7.5" className="fill-zinc-400">{copy.center}</text>
        <text x="284" y="49" textAnchor="middle" fontSize="7.5" className="fill-zinc-500">{copy.london}</text>
      </svg>

      <div className="mt-2 space-y-1.5">
        {copy.channels.map((ch, i) => (
          <Tip key={ch.tipo} text={textoPorModo(mode, ch.did, ch.adv)}>
            <div className="cursor-help rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 transition-colors hover:border-zinc-600">
              <div className="flex items-center gap-1.5 text-[11px] font-bold"
                style={{ color: ['#f44336', '#ba68c8', '#ffc107'][i] }}>
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: ['#f44336', '#ba68c8', '#ffc107'][i] }} />
                {ch.tipo}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
                {textoPorModo(mode, ch.did, ch.adv)}
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
  const lang = useApp((s) => s.lang)
  const base = COUNTRIES.find((x) => x.id === 'brasil')!
  const c = countryForLang(base, lang)
  const il = c.ilaese!
  const maxPct = Math.max(...il.desindustrializacao.map((d) => d.pctIndustria))
  const locale = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR'
  const copy = lang === 'en'
    ? { title: 'ILAESE X-ray · Reprimarization', tip: 'Reserve army of labor: people outside formal employment or underemployed — a persistent pressure on wages and working conditions.', reserve: 'Reserve army', population: 'of the population', remittances: 'Profit remittances', drain: 'outflow from domestically produced surplus', industry: 'Industry share of GDP' }
    : lang === 'es'
      ? { title: 'Radiografía ILAESE · Reprimarización', tip: 'Ejército industrial de reserva: personas fuera del empleo formal o subempleadas — presión permanente sobre salarios y condiciones laborales.', reserve: 'Ejército de reserva', population: 'de la población', remittances: 'Remesas de ganancias', drain: 'salida del excedente producido internamente', industry: 'Participación de la industria en el PIB' }
      : { title: 'Raio-X ILAESE · Reprimarização', tip: 'Exército Industrial de Reserva: quem está fora do emprego formal ou subempregado — pressão permanente sobre salários e condições.', reserve: 'Exército de reserva', population: 'da população', remittances: 'Remessas de lucros', drain: 'vaza da mais-valia nacional', industry: 'Participação da indústria no PIB' }
  return (
    <section className="rounded-xl border border-labor/40 bg-labor/5 p-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-red-300">
        {copy.title}
      </h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Tip text={copy.tip}>
          <div className="cursor-help rounded-lg bg-zinc-950/60 p-2">
            <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">{copy.reserve}</div>
            <div className="font-mono text-base font-bold text-red-300">{il.reservaMilhoes.toLocaleString(locale)} {lang === 'en' ? 'm' : 'mi'}</div>
            <div className="font-mono text-[10px] text-zinc-500">{il.reservaPct.toLocaleString(locale)}% {copy.population}</div>
          </div>
        </Tip>
        <div className="rounded-lg bg-zinc-950/60 p-2">
          <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">{copy.remittances}</div>
          <div className="font-mono text-sm font-bold text-fuchsia-300">{il.remessasLucros}</div>
          <div className="text-[10px] text-zinc-500">{copy.drain}</div>
        </div>
      </div>
      <div className="mt-2">
        <div className="mb-1 text-[9.5px] uppercase tracking-wider text-zinc-500">
          {copy.industry}
        </div>
        <div className="flex items-end gap-2">
          {il.desindustrializacao.map((d) => (
            <div key={d.ano} className="flex flex-1 flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-zinc-400">{d.pctIndustria.toLocaleString(locale)}%</span>
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
  const { countryId, closeCountry, basis, setBasis, hiddenFractions, toggleFraction, lang, mode } = useApp()
  const baseCountry = countryId ? COUNTRIES.find((x) => x.id === countryId) ?? null : null
  const c = baseCountry ? countryForLang(baseCountry, lang) : null
  const trapRef = useFocusTrap<HTMLElement>(!!c, closeCountry)
  const fracs = (Object.keys(FRACTION_META) as FractionKey[]).map((key) => ({ key, ...fractionMetaForLang(key, lang, mode === 'simples') }))
  const copy = lang === 'en'
    ? { aria: 'Country panel', internal: 'internal bloc', close: 'Close panel', nominal: 'Nominal GDP', nominalCenter: 'Nominal GDP', pppCenter: 'GDP PPP', nominalTip: 'Size of the economy converted at current exchange rates — useful for comparing international purchasing power.', pppTip: 'Adjusted for local price levels — approximates the economy’s real purchasing-power scale.', pppEq: 'PPP equivalent: ', nominalEq: 'Nominal: ', source: 'approximate source: IMF', decomposition: 'Breakdown by capital fractions', toggle: 'Click to hide/show', estimate: 'Estimated teaching decomposition — not an official statistic.', internalWar: 'Internal bloc conflict' }
    : lang === 'es'
      ? { aria: 'Panel del país', internal: 'bloque interno', close: 'Cerrar panel', nominal: 'PIB nominal', nominalCenter: 'PIB nominal', pppCenter: 'PIB PPP', nominalTip: 'Tamaño de la economía convertido a tipos de cambio actuales — útil para comparar poder de compra internacional.', pppTip: 'Ajustado por niveles de precios locales — aproxima la escala real de poder de compra de la economía.', pppEq: 'PPP equivalente: ', nominalEq: 'Nominal: ', source: 'fuente aproximada: FMI', decomposition: 'Descomposición por fracciones de capital', toggle: 'Haz clic para ocultar/mostrar', estimate: 'Descomposición didáctica estimada — no es una estadística oficial.', internalWar: 'Conflicto interno de bloques' }
      : { aria: 'Painel do país', internal: 'bloco interno', close: 'Fechar painel', nominal: 'PIB Nominal', nominalCenter: 'PIB nominal', pppCenter: 'PIB PPP', nominalTip: 'Tamanho da economia convertido aos câmbios atuais — mede o poder de compra internacional dos capitais dominantes.', pppTip: 'Ajustado pelo custo de vida local — aproxima o tamanho "físico" real da economia.', pppEq: 'PPP equivalente: ', nominalEq: 'Nominal: ', source: 'fonte aproximada: FMI', decomposition: 'Decomposição por frações de capital', toggle: 'Clique para ocultar/mostrar', estimate: 'Decomposição didática estimada — não é estatística oficial.', internalWar: 'Guerra interna de blocos' }

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
            role="dialog" aria-modal="true" aria-label={copy.aria} ref={trapRef}
            className="thin-scroll fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-zinc-800 bg-zinc-900 shadow-2xl sm:w-[440px]"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-zinc-800 bg-zinc-900/95 px-5 py-4 backdrop-blur">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">{c.region} · {copy.internal}</div>
                <h2 className="text-lg font-bold text-zinc-100">{c.name}</h2>
                <p className="mt-0.5 text-xs leading-snug text-zinc-400">{c.profile}</p>
              </div>
              <button onClick={closeCountry} aria-label={copy.close}
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
                      {b === 'nominal' ? copy.nominal : 'PPP'}
                    </button>
                  ))}
                </div>
                <Tip text={basis === 'nominal' ? copy.nominalTip : copy.pppTip}>
                  <span className="inline-block cursor-help font-mono text-3xl font-bold text-zinc-100">{fmtTriLang(basis === 'nominal' ? c.gdpNominal : c.gdpPPP, lang)}</span>
                </Tip>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {basis === 'nominal' ? copy.pppEq : copy.nominalEq}
                  <span className="font-mono text-zinc-400">{fmtTriLang(basis === 'nominal' ? c.gdpPPP : c.gdpNominal, lang)}</span> · {copy.source}
                </div>
              </section>

              {/* Rosca por fração */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {copy.decomposition}
                </h3>
                <div className="flex items-center gap-4">
                  <DonutChart
                    segments={toSegments(c, hiddenFractions, fracs)}
                    centerLabel={basis === 'nominal' ? copy.nominalCenter : copy.pppCenter}
                    centerValue={fmtTriLang(basis === 'nominal' ? c.gdpNominal : c.gdpPPP, lang)}
                  />
                  <ul className="min-w-0 flex-1 space-y-1.5">
                    {(Object.keys(FRACTION_META) as FractionKey[]).map((f) => {
                      const meta = fracs.find((x) => x.key === f) ?? { ...FRACTION_META[f], key: f }
                      const off = hiddenFractions.includes(f)
                      return (
                        <li key={f}>
                          <button onClick={() => toggleFraction(f)} title={copy.toggle}
                            className={`group flex w-full items-center justify-between gap-2 rounded-md border px-2 py-1 text-left transition-colors ${
                              off ? 'border-transparent opacity-40' : 'border-zinc-800 hover:border-zinc-600'
                            }`}>
                            <span className="flex min-w-0 items-center gap-1.5">
                              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: meta.color }} />
                              <span className="truncate text-[11px] text-zinc-300">{meta.label}</span>
                            </span>
                            {!off && (
                              <span className="shrink-0 font-mono text-[10px] text-zinc-400">
                                {c.fractions[f]}% · {fmtTriLang((c.fractions[f] / 100) * (basis === 'nominal' ? c.gdpNominal : c.gdpPPP), lang)}
                              </span>
                            )}
                          </button>
                          {!off && <p className="mt-0.5 pl-4 text-[10px] leading-tight text-zinc-500">{meta.desc}</p>}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <p className="mt-1.5 text-[10px] text-zinc-600">{copy.estimate}</p>
              </section>

              {c.ilaese && <IlaiseBlock />}

              {c.tmd && <TmdBlock countryName={c.name} />}

              {/* Guerras internas entre frações */}
              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-red-400">
                  {copy.internalWar}
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
