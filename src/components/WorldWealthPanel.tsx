import DonutChart from './DonutChart'
import Tip from './ui/Tip'
import { useApp } from '../store/useApp'
import {
  WORLD_GDP_TRI, CLAIMS, DERIV_NOTIONAL_TRI, PRIVATE_NET_WEALTH_TRI, claimsTotal,
} from '../data/worldWealth'
import { worldSummary, WORLD_COMPANIES } from '../data/companies'
import { modRef } from '../data/modules'
import { textoPorModo } from '../lib/simples'
import { locale, pick, type Lang } from '../i18n'

function claimCopy(lang: Lang, claim: (typeof CLAIMS)[number]) {
  if (claim.key === 'equities') return {
    label: pick(lang, claim.label, 'Equities (global stock market)', 'Acciones (mercado bursátil mundial)'),
    year: pick(lang, claim.year, 'end-2024', 'fin de 2024'),
    didatico: pick(lang, claim.didatico, 'All listed-company shares worldwide are worth about US$124 tn — claims on a portion of companies’ FUTURE profits.', 'Todas las acciones de empresas cotizadas del planeta valen unos US$124 bill. — derechos sobre una parte de los beneficios FUTUROS de las empresas.'),
    avancado: pick(lang, claim.avancado, 'The quintessential private fictitious-capital form: a property title whose price capitalizes expected profits over an open-ended horizon. The AI rally concentrated gains in tech mega-caps.', 'Forma privada por excelencia del capital ficticio: título de propiedad cuyo precio capitaliza beneficios esperados en un horizonte abierto. El rally de IA concentró ganancias en las megacaps tecnológicas.'),
  }
  if (claim.key === 'pubdebt') return {
    label: pick(lang, claim.label, 'Global public debt', 'Deuda pública mundial'),
    year: claim.year,
    didatico: pick(lang, claim.didatico, 'Governments owe about US$100 tn — signed promises on which banks and investors receive interest.', 'Los gobiernos deben unos US$100 bill. — promesas firmadas sobre las que bancos e inversores cobran intereses.'),
    avancado: pick(lang, claim.avancado, 'About 93% of global GDP (after the GFC/pandemic peak). In a sovereign currency it is state fictitious capital anchored by the central bank; in foreign currency it creates a real external constraint.', 'Cerca del 93% del PIB mundial (tras el pico posterior a la crisis financiera y la pandemia). En moneda soberana es capital ficticio estatal anclado por el banco central; en moneda extranjera crea una restricción externa real.'),
  }
  return {
    label: pick(lang, claim.label, 'Private non-financial debt', 'Deuda privada no financiera'),
    year: claim.year,
    didatico: pick(lang, claim.didatico, 'Companies and households owe about US$95 tn to banks and credit markets.', 'Empresas y hogares deben unos US$95 bill. a bancos y mercados de crédito.'),
    avancado: pick(lang, claim.avancado, 'Bank credit creates deposits (endogenous money): private borrowing brings demand forward and mortgages future surplus through debt service.', 'El crédito bancario crea depósitos (dinero endógeno): el endeudamiento privado adelanta demanda e hipoteca excedente futuro mediante el servicio de la deuda.'),
  }
}

/**
 * RIQUEZA MUNDIAL SOB RAIO-X — quanto do patrimônio do planeta é
 * base real × esfera de títulos (capital fictício), com fontes.
 */
export default function WorldWealthPanel() {
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const didatico = mode !== 'avancado'
  const loc = locale(lang)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const triUnit = tx('tri', 'tn', 'bill.')
  const claims = claimsTotal()
  const claimsYears = claims / WORLD_GDP_TRI
  const wealthYears = PRIVATE_NET_WEALTH_TRI / WORLD_GDP_TRI
  const derivMultiple = DERIV_NOTIONAL_TRI / WORLD_GDP_TRI
  const localizedClaims = CLAIMS.map((c) => ({ ...c, ...claimCopy(lang, c) }))
  const donutSegments = localizedClaims.map((c) => ({ key: c.key, label: c.label, value: c.tri, color: c.color }))
  const ws = worldSummary()

  return (
    <section aria-label={tx('Riqueza mundial', 'World wealth', 'Riqueza mundial')} className="flex flex-col gap-3">
      <header>
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-fuchsia-300">
          {tx('A riqueza do planeta: base real × esfera de títulos', 'The planet’s wealth: real base × claims sphere', 'La riqueza del planeta: base real × esfera de títulos')}
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {didatico
            ? tx('Quanto vale TUDO o que existe de papel (ações, dívidas, derivativos) comparado com o que o mundo realmente PRODUZ num ano? Quando o papel cresce muito mais rápido que a produção, a riqueza vira promessa — e promessa pode virar bolha.', 'How much are ALL financial claims — shares, debt, derivatives — worth compared with what the world actually PRODUCES in a year? When claims grow much faster than production, more wealth rests on promises — and promises can become bubbles.', '¿Cuánto valen TODOS los derechos financieros — acciones, deudas, derivados — frente a lo que el mundo realmente PRODUCE en un año? Cuando esos derechos crecen mucho más rápido que la producción, una parte mayor de la riqueza descansa en promesas — y las promesas pueden convertirse en burbujas.')
            : tx('A esfera de titularidade (fictício) cresce sobre a base produtivo-rentista; quando o múltiplo título/PIB se estica, a sobreacumulação de pretensões antecede as crises de realização (2000, 2008).', 'The sphere of financial claims (fictitious capital) expands over the productive/rentier base; when the claims-to-GDP multiple stretches, overaccumulated claims can precede realization crises (2000, 2008).', 'La esfera de derechos financieros (capital ficticio) crece sobre la base productiva/rentista; cuando se estira el múltiplo derechos/PIB, la sobreacumulación de derechos puede preceder crisis de realización (2000, 2008).')}
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* Donut da esfera de títulos + razões-chave */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-zinc-100">{tx('Composição da esfera de títulos', 'Composition of the claims sphere', 'Composición de la esfera de títulos')}</h4>
            <span className="font-mono text-xs text-zinc-500">
              {tx('total', 'total', 'total')} ≈ US$ {claims.toLocaleString(loc)} {triUnit} = {claimsYears.toLocaleString(loc, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}× {tx('PIB anual', 'annual GDP', 'PIB anual')}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <DonutChart segments={donutSegments} centerLabel={tx('títulos', 'claims', 'títulos')} centerValue={`US$${claims.toLocaleString(loc)} ${triUnit}`} />
            <ul className="min-w-[220px] flex-1 space-y-2">
              {localizedClaims.map((c) => (
                <li key={c.key}>
                  <Tip text={textoPorModo(mode, c.didatico, c.avancado)}>
                    <div className="flex cursor-help items-center justify-between gap-2 rounded-md border border-zinc-800 px-2 py-1.5 hover:border-zinc-600">
                      <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-zinc-300">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: c.color }} />
                        {c.label}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] font-bold" style={{ color: c.color }}>
                        US$ {c.tri.toLocaleString(loc)} {triUnit} · {((c.tri / claims) * 100).toLocaleString(loc, { maximumFractionDigits: 0 })}%
                      </span>
                    </div>
                  </Tip>
                  <p className="mt-0.5 pl-4 font-mono text-[9.5px] text-zinc-600">{c.source} · {c.year}</p>
                </li>
              ))}
              <li className="pl-1 pt-1 text-[10px] leading-snug text-zinc-500">
                {tx('100% desta esfera é', '100% of this sphere is', 'El 100% de esta esfera es')} <strong className="text-fuchsia-300">{tx('capital fictício', 'fictitious capital', 'capital ficticio')}</strong>: {tx('direitos sobre mais-valia futura — nada aqui é máquina, grão ou fábrica.', 'claims on future surplus — none of these entries is itself a machine, grain, or factory.', 'derechos sobre excedente futuro — ninguna de estas partidas es en sí misma una máquina, grano o fábrica.')}
              </li>
            </ul>
          </div>
        </div>

        {/* Razões estruturais */}
        <div className="grid grid-cols-2 content-start gap-2">
          <RatioCard label={tx('Riqueza líquida privada', 'Private net wealth', 'Riqueza neta privada')} value={`US$ ${PRIVATE_NET_WEALTH_TRI.toLocaleString(loc)} ${triUnit}`} sub={`≈ ${wealthYears.toLocaleString(loc, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}× ${tx('o PIB anual do planeta', 'the planet’s annual GDP', 'el PIB anual del planeta')}`} source={tx('UBS GWR · fim-2023', 'UBS GWR · end-2023', 'UBS GWR · fin de 2023')}
            tip={didatico
              ? tx('Somando casas, ações e contas das famílias (menos dívidas), os privados do mundo guardam o equivalente a ~4 anos de TODA produção mundial.', 'Adding homes, shares, and household accounts (minus debts), private net wealth equals roughly four years of total world output.', 'Sumando viviendas, acciones y cuentas de los hogares (menos deudas), la riqueza neta privada equivale a unos cuatro años de toda la producción mundial.')
              : tx('Ativos financeiros + reais − dívidas dos households: a riqueza privada vale múltiplos do fluxo anual que a gera — assinatura da dominância rentista.', 'Financial + real assets − household debts: private wealth is worth multiples of the annual flow that supports it — a signature of rentier dominance.', 'Activos financieros + reales − deudas de los hogares: la riqueza privada vale múltiplos del flujo anual que la sostiene — una señal de dominancia rentista.')} />
          <RatioCard label={tx('Imobiliário mundial', 'Global real estate', 'Inmobiliario mundial')} value={`US$ ${(380).toLocaleString(loc)} ${triUnit}`} sub={tx('maior ativo real do globo', 'largest real asset class worldwide', 'mayor clase de activo real del mundo')} source="Savills · 2023"
            tip={didatico
              ? tx('Tijolo é a maior "poupança" da humanidade — e o colateral por trás de grande parte dos empréstimos bancários.', 'Property is humanity’s largest store of wealth — and collateral behind a large share of bank lending.', 'El inmueble es la mayor reserva de riqueza de la humanidad — y el colateral detrás de gran parte del crédito bancario.')
              : tx('Ativo real não-produtivo (renda fundiária); funciona como colateral-chave do crédito, acoplando ciclos imobiliário e financeiro.', 'A non-productive real asset in the strict sense (ground rent); it acts as key credit collateral, coupling property and financial cycles.', 'Activo real no productivo en sentido estricto (renta del suelo); funciona como colateral clave del crédito y acopla los ciclos inmobiliario y financiero.')} />
          <RatioCard label={tx('Derivativos (nocional)', 'Derivatives (notional)', 'Derivados (nocional)')} value={`US$ ${DERIV_NOTIONAL_TRI.toLocaleString(loc)} ${triUnit}`} sub={`${derivMultiple.toLocaleString(loc, { maximumFractionDigits: 0 })}× ${tx('o PIB · apostas s/ apostas', 'GDP · bets on bets', 'el PIB · apuestas sobre apuestas')}`} source={tx('BIS · jun/2024', 'BIS · Jun/2024', 'BIS · jun/2024')}
            tip={didatico
              ? tx('Contratos de derivativos somam quase US$700 tri em "valor de face". Não é dinheiro no bolso — é o tamanho das APOSTAS feitas sobre juros, câmbio e preços.', 'Derivative contracts total nearly US$700 tn in notional value. That is not cash in a vault — it is the reference amount behind positions on rates, currencies, and prices.', 'Los contratos de derivados suman casi US$700 bill. de valor nocional. No es dinero guardado — es el monto de referencia detrás de posiciones sobre tipos, divisas y precios.')
              : tx('Nocional ≠ valor de mercado (MV ≈ US$ 15–20 tri): mede exposição. Rede de interdependência cuja falha sincronizada materializa crises (AIG 2008).', 'Notional ≠ market value (MV ≈ US$15–20 tn): it measures exposure. A network of interdependence whose synchronized failure can materialize crises (AIG 2008).', 'Nocional ≠ valor de mercado (MV ≈ US$15–20 bill.): mide exposición. Una red de interdependencia cuya falla sincronizada puede materializar crisis (AIG 2008).')} />
          <RatioCard label={tx('Mega-caps no Raio-X', 'Mega-caps in X-Ray', 'Megacaps en Rayos-X')} value={`US$ ${ws.capTri.toLocaleString(loc, { maximumFractionDigits: 1 })} ${triUnit}`} sub={`${ws.pctMarketCapMundial.toLocaleString(loc, { maximumFractionDigits: 0 })}% ${tx('de todo o mercado acionário', 'of the entire stock market', 'de todo el mercado bursátil')}`} source={tx('10-K/FY24 · dez/2025', '10-K/FY24 · Dec/2025', '10-K/FY24 · dic/2025')}
            tip={didatico
              ? tx(`As ${WORLD_COMPANIES.length} maiores empresas rastreadas juntas valem cerca de US$ ${ws.capTri.toLocaleString(loc, { maximumFractionDigits: 0 })} ${triUnit} — ${ws.pctMarketCapMundial.toLocaleString(loc, { maximumFractionDigits: 0 })}% do valor de TODAS as empresas listadas do mundo.`, `The ${WORLD_COMPANIES.length} tracked mega-companies together are worth about US$ ${ws.capTri.toLocaleString(loc, { maximumFractionDigits: 0 })} ${triUnit} — ${ws.pctMarketCapMundial.toLocaleString(loc, { maximumFractionDigits: 0 })}% of the value of ALL listed companies worldwide.`, `Las ${WORLD_COMPANIES.length} megaempresas seguidas valen juntas cerca de US$ ${ws.capTri.toLocaleString(loc, { maximumFractionDigits: 0 })} ${triUnit} — ${ws.pctMarketCapMundial.toLocaleString(loc, { maximumFractionDigits: 0 })}% del valor de TODAS las empresas cotizadas del mundo.`)
              : tx(`Σ cap das rastreadas = ${ws.pctMarketCapMundial.toLocaleString(loc, { maximumFractionDigits: 0 })}% do market cap global; Σ receitas = ${ws.pctPibMundial.toLocaleString(loc, { maximumFractionDigits: 1 })}% do PIB mundial.`, `Σ tracked market cap = ${ws.pctMarketCapMundial.toLocaleString(loc, { maximumFractionDigits: 0 })}% of global market cap; Σ revenue = ${ws.pctPibMundial.toLocaleString(loc, { maximumFractionDigits: 1 })}% of world GDP.`, `Σ capitalización seguida = ${ws.pctMarketCapMundial.toLocaleString(loc, { maximumFractionDigits: 0 })}% de la capitalización global; Σ ingresos = ${ws.pctPibMundial.toLocaleString(loc, { maximumFractionDigits: 1 })}% del PIB mundial.`)} />
        </div>
      </div>

      {/* barra base produtiva vs esfera titular */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h4 className="text-sm font-semibold text-zinc-100">{tx('Base real × promessas', 'Real base × promises', 'Base real × promesas')}</h4>
        <div className="mt-2 space-y-2">
          <StackedRatio label={tx('PIB mundial — produção REAL de um ano', 'World GDP — one year of REAL output', 'PIB mundial — producción REAL de un año')} value={WORLD_GDP_TRI} max={Math.max(claims, PRIVATE_NET_WEALTH_TRI)} color="#4caf50" lang={lang} />
          <StackedRatio label={tx('Esfera de títulos (ações + dívidas)', 'Claims sphere (equities + debt)', 'Esfera de títulos (acciones + deudas)')} value={claims} max={Math.max(claims, PRIVATE_NET_WEALTH_TRI)} color="#9c27b0" lang={lang} />
          <StackedRatio label={tx('Riqueza líquida privada', 'Private net wealth', 'Riqueza neta privada')} value={PRIVATE_NET_WEALTH_TRI} max={Math.max(claims, PRIVATE_NET_WEALTH_TRI)} color="#ffc107" lang={lang} />
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-zinc-600">
          {didatico
            ? tx('Leitura: para cada US$100 que o mundo produz em um ano, existem ~US$280 em papéis prometendo pedaços desse bolo nos próximos anos. O sistema não quebra enquanto as promessas forem acreditadas — Marx chamava isso de capital fictício.', 'Reading: for every US$100 the world produces in a year, there are about US$280 in financial claims on pieces of future income. The system holds while those claims remain credible — Marx called this fictitious capital.', 'Lectura: por cada US$100 que el mundo produce en un año, existen unos US$280 en derechos financieros sobre partes de ingresos futuros. El sistema se sostiene mientras esos derechos mantengan credibilidad — Marx llamó a esto capital ficticio.')
            : tx(`Claims/PIB ≈ ${(claims / WORLD_GDP_TRI).toLocaleString(loc, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}×: a titularização corre à frente da valorização real. Historicamente o múltiplo se comprime via crise (destruição de capital fictício) — ver Timeline 1929/2008.`, `Claims/GDP ≈ ${(claims / WORLD_GDP_TRI).toLocaleString(loc, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}×: securitized claims run ahead of real valorization. Historically the multiple compresses through crises that destroy fictitious capital — see the 1929/2008 timeline.`, `Derechos/PIB ≈ ${(claims / WORLD_GDP_TRI).toLocaleString(loc, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}×: la titularización avanza por delante de la valorización real. Históricamente el múltiplo se comprime mediante crisis que destruyen capital ficticio — ver la línea de tiempo 1929/2008.`)}
        </p>
        <button
          onClick={() => useApp.getState().setTab('wealth')}
          className="mt-3 w-full rounded-lg border border-money/50 bg-money/10 px-3 py-2 text-xs font-semibold text-money transition-colors hover:bg-money/20"
        >
          {tx('E quem produz tudo isso?', 'And who produces all of this?', '¿Y quién produce todo esto?')} → {modRef('wealth', lang)} · {tx('Quem Sustenta Quê?', 'Who Sustains What?', '¿Quién Sostiene Qué?')}
        </button>
      </div>
    </section>
  )
}

function StackedRatio({ label, value, max, color, lang }: { label: string; value: number; max: number; color: string; lang: Lang }) {
  const loc = locale(lang)
  const triUnit = pick(lang, 'tri', 'tn', 'bill.')
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[10.5px]">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono font-bold text-zinc-200">US$ {value.toLocaleString(loc)} {triUnit}</span>
      </div>
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  )
}

function RatioCard({ label, value, sub, source, tip }: {
  label: string; value: string; sub: string; source: string; tip?: string
}) {
  const body = (
    <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 transition-colors hover:border-zinc-600">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-lg font-extrabold text-zinc-100">{value}</div>
      <div className="mt-0.5 text-[10.5px] leading-snug text-zinc-400">{sub}</div>
      <div className="mt-1.5 inline-block rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">{source}</div>
    </div>
  )
  return tip ? <Tip text={tip}><span className="block h-full cursor-help">{body}</span></Tip> : body
}
