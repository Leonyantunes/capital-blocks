import { AnimatePresence, m } from 'framer-motion'
import Tip from '../ui/Tip'
import { MMT_BR, SOVEREIGN_STEPS } from '../../data/theory'
import { useApp } from '../../store/useApp'
import { pick } from '../../i18n'
import { textoPorModo } from '../../lib/simples'

export type FiscalLens = 'ortodoxa' | 'mmt'

export function FiscalLensToggle({ lens, setLens }: { lens: FiscalLens; setLens: (l: FiscalLens) => void }) {
  const lang = useApp((s) => s.lang)
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">
        {tr('Lente monetária — como explicar a dívida?', 'Monetary lens — how should debt be explained?', 'Lente monetaria — ¿cómo explicar la deuda?')}
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        <button onClick={() => setLens('ortodoxa')}
          className={`rounded-lg border px-3 py-2 text-left transition-colors ${
            lens === 'ortodoxa' ? 'border-sky-400/70 bg-sky-400/10' : 'border-zinc-800 hover:border-zinc-600'
          }`}>
          <div className={`text-xs font-bold ${lens === 'ortodoxa' ? 'text-sky-300' : 'text-zinc-300'}`}>
            {tr('Visão Ortodoxa (dominante)', 'Orthodox view (dominant)', 'Visión ortodoxa (dominante)')}
          </div>
          <div className="text-[10.5px] leading-snug text-zinc-500">
            {tr('“Estado-família”: austeridade e restrição orçamentária', '“State as household”: austerity and budget constraint', '“Estado como familia”: austeridad y restricción presupuestaria')}
          </div>
        </button>
        <button onClick={() => setLens('mmt')}
          className={`rounded-lg border px-3 py-2 text-left transition-colors ${
            lens === 'mmt' ? 'border-emerald-400/70 bg-emerald-400/10' : 'border-zinc-800 hover:border-zinc-600'
          }`}>
          <div className={`text-xs font-bold ${lens === 'mmt' ? 'text-emerald-300' : 'text-zinc-300'}`}>
            {tr('Visão Heterodoxa / MMT', 'Heterodox view / MMT', 'Visión heterodoxa / MMT')}
          </div>
          <div className="text-[10.5px] leading-snug text-zinc-500">
            {tr('Soberania monetária & restrição de recursos reais', 'Monetary sovereignty & real-resource constraint', 'Soberanía monetaria y restricción de recursos reales')}
          </div>
        </button>
      </div>
    </div>
  )
}

/** Painel da narrativa dominante — cada tese com o contraponto anotado. */
export function OrthodoxPanel() {
  const lang = useApp((s) => s.lang)
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const claims = [
    {
      tese: tr('“O Estado gasta como uma família: precisa arrecadar antes de gastar.”', '“The state spends like a household: it must collect revenue before it can spend.”', '“El Estado gasta como una familia: debe recaudar antes de gastar.”'),
      contra: tr('Operacionalmente é o INVERSO: o gasto público cria a moeda que depois é tributada. Família usa a moeda; o Estado a emite.', 'Operationally, the sequence is reversed for a currency issuer: public spending credits money that taxation later removes. Households use the currency; the state issues it.', 'Operativamente, para un emisor monetario la secuencia es inversa: el gasto público acredita dinero que luego los impuestos retiran. Las familias usan la moneda; el Estado la emite.'),
    },
    {
      tese: tr('“Dívida acima de X% do PIB = risco de calote iminente / fardo dos netos.”', '“Debt above X% of GDP = imminent default risk / burden on our grandchildren.”', '“Deuda por encima de X% del PIB = riesgo de impago inminente / carga para los nietos.”'),
      contra: tr('Japão convive com ~230–250% há décadas sem default. Calote involuntário exige uma restrição monetária diferente, como dívida em moeda que o Estado não emite (Grécia/euro). Os “netos” também herdam os títulos como ativos.', 'Japan has lived with roughly 230–250% debt for decades without default. Involuntary default involves a different monetary constraint, such as debt in a currency the state does not issue (Greece/euro). Future generations also inherit the bonds as assets.', 'Japón convive con aproximadamente 230–250% de deuda desde hace décadas sin impago. El impago involuntario implica otra restricción monetaria, como deuda en una moneda que el Estado no emite (Grecia/euro). Las generaciones futuras también heredan los títulos como activos.'),
    },
    {
      tese: tr('“Superávit primário é o caminho para derrubar a razão dívida/PIB.”', '“A primary surplus is the route to lowering the debt-to-GDP ratio.”', '“El superávit primario es el camino para reducir la relación deuda/PIB.”'),
      contra: tr('Austeridade encolhe o PIB (denominador) via demanda efetiva: a razão pode PIORAR cortando gastos. r×D − g×D domina o resultado.', 'Austerity can shrink GDP, the denominator, through effective demand: the ratio may WORSEN after spending cuts. The interaction of r×D and g×D matters.', 'La austeridad puede reducir el PIB, el denominador, mediante la demanda efectiva: la relación puede EMPEORAR tras recortes del gasto. Importa la interacción de r×D y g×D.'),
    },
    {
      tese: tr('“O mercado financeiro pune governos irresponsáveis com juros altos.”', '“Financial markets punish irresponsible governments with high interest rates.”', '“Los mercados financieros castigan a gobiernos irresponsables con tasas altas.”'),
      contra: tr('Taxas exigidas por detentores de títulos também refletem poder financeiro e distribuição: juros altos elevam o serviço da dívida e podem aumentar o estoque indexado à Selic sem novo gasto primário.', 'Rates demanded by bondholders also reflect financial power and distribution: high rates raise debt service and can increase Selic-linked debt without new primary spending.', 'Las tasas exigidas por los tenedores de títulos también reflejan poder financiero y distribución: tasas altas elevan el servicio de la deuda y pueden aumentar la deuda indexada a la Selic sin nuevo gasto primario.'),
    },
  ]
  return (
    <m.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-sky-400/40 bg-sky-400/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-1.5">
        <h3 className="text-sm font-bold text-sky-300">{tr('A metáfora burguesa do Estado-família', 'The bourgeois “state as household” metaphor', 'La metáfora burguesa del “Estado como familia”')}</h3>
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-500">
          {tr('narrativa predominante · mídia/agências de rating', 'dominant narrative · media/rating agencies', 'narrativa dominante · medios/agencias de rating')}
        </span>
      </div>
      <ul className="mt-2 space-y-2.5">
        {claims.map((c) => (
          <li key={c.tese} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
            <p className="text-xs font-medium leading-relaxed text-zinc-200">{c.tese}</p>
            <Tip text={tr('Contraponto heterodoxo documentado em THEORY.md, Pilar 3.', 'Heterodox counterpoint documented in THEORY.md, Pillar 3.', 'Contrapunto heterodoxo documentado en THEORY.md, Pilar 3.')}>
              <p className="mt-1 cursor-help rounded bg-red-400/10 px-2 py-1 text-[11px] leading-snug text-red-300">
                ✕ {c.contra}
              </p>
            </Tip>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] leading-snug text-zinc-600">
        {tr('Esta lente descreve como a ortodoxia explica a dívida — mantida no app como objeto de crítica, nunca como autoridade normativa.', 'This lens describes how orthodox economics explains debt — included here as an object of critique, not as normative authority.', 'Esta lente describe cómo la ortodoxia explica la deuda — incluida aquí como objeto de crítica, no como autoridad normativa.')}
      </p>
    </m.section>
  )
}

/** Painel MMT — operacionalização moeda × dívida + caso Brasil (soberania parcial). */
export function SovereignPanel() {
  const { mode, lang } = useApp()
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const didatico = mode !== 'avancado'
  const trap = tr(MMT_BR.armadilhaRentista,
    'A large share of domestic debt is remunerated at the Selic rate: high interest can expand the stock without new primary spending — a structural transfer to interest-bearing capital.',
    'Una gran parte de la deuda interna se remunera a la tasa Selic: intereses altos pueden ampliar el stock sin nuevo gasto primario — una transferencia estructural al capital que devenga intereses.')
  const sovereignSteps = SOVEREIGN_STEPS.map((st, i) => ({
    ...st,
    t: i === 0 ? tr(st.t, '1 · The state spends by CREATING reais', '1 · El Estado gasta CREANDO reales')
      : i === 1 ? tr(st.t, '2 · Taxes REMOVE reais', '2 · Los impuestos RETIRAN reales')
        : tr(st.t, '3 · Bonds = interest-bearing private saving', '3 · Títulos = ahorro privado remunerado'),
    didatico: i === 0
      ? tr(st.didatico, 'When the government pays a hospital or retiree, it credits reais into bank accounts. The monetary balance is created through that payment operation.', 'Cuando el gobierno paga a un hospital o jubilado, acredita reales en las cuentas bancarias. El saldo monetario se crea mediante esa operación de pago.')
      : i === 1
        ? tr(st.didatico, 'Taxes remove purchasing power from the economy. In the MMT account, they support demand for the real, redistribute income and free productive capacity.', 'Los impuestos retiran poder de compra de la economía. En la lectura MMT, sostienen la demanda por el real, redistribuyen ingreso y liberan capacidad productiva.')
        : tr(st.didatico, 'The government deficit corresponds to a net financial asset held by the non-government sector. Public debt in reais is a safe asset for banks, funds, firms and households.', 'El déficit del gobierno corresponde a un activo financiero neto mantenido por el sector no gubernamental. La deuda pública en reales es un activo seguro para bancos, fondos, empresas y familias.'),
    avancado: i === 0
      ? tr(st.avancado, 'Net spending credits reserve accounts at the BCB (Treasury-BCB consolidation): fiat money is a state liability issued through spending operations.', 'El gasto neto acredita cuentas de reservas en el BCB (consolidación Tesoro-BCB): la moneda fiduciaria es un pasivo estatal emitido mediante operaciones de gasto.')
      : i === 1
        ? tr(st.avancado, 'Tax debits redeem state liabilities: taxation creates demand for the currency and frees real capacity, helping manage inflationary pressure.', 'Los débitos tributarios rescatan pasivos estatales: la tributación crea demanda por la moneda y libera capacidad real, ayudando a gestionar la presión inflacionaria.')
        : tr(st.avancado, 'Public bonds are net financial assets of the non-government sector; issuance meets demand for safe assets while debt service channels income to holders.', 'Los títulos públicos son activos financieros netos del sector no gubernamental; su emisión satisface la demanda de activos seguros mientras el servicio de la deuda canaliza ingresos a sus tenedores.'),
  }))
  return (
    <m.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3">
      {/* passos operacionais */}
      <div className="grid gap-2 md:grid-cols-3">
        {sovereignSteps.map((st) => (
          <article key={st.t} className="rounded-xl border border-emerald-400/40 bg-emerald-400/5 p-3">
            <h4 className="text-xs font-bold text-emerald-300">{st.t}</h4>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{textoPorModo(mode, st.didatico, st.avancado)}</p>
          </article>
        ))}
      </div>

      {/* Brasil: soberania parcial */}
      <div className="rounded-xl border p-4" style={{ borderColor: '#ffc10744', background: '#ffc10708' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-money">{tr('Caso Brasil: soberania monetária PARCIAL', 'Brazil case: PARTIAL monetary sovereignty', 'Caso Brasil: soberanía monetaria PARCIAL')}</h3>
          <Tip text={trap}>
            <span className="cursor-help rounded bg-money/15 px-2 py-0.5 font-mono text-[10px] text-money">{tr('armadilha Selic ↗', 'Selic trap ↗', 'trampa Selic ↗')}</span>
          </Tip>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat label={tr('Dívida interna em reais', 'Domestic debt in reais', 'Deuda interna en reales')} value={`≈${MMT_BR.dividaInternaReaisPct}%`} sub={tr('da dívida pública federal', 'of federal public debt', 'de la deuda pública federal')} tip={tr('Quase toda a dívida brasileira é interna e denominada em reais: o país paga em moeda que EMITE.', 'Almost all Brazilian federal public debt is domestic and denominated in reais: the country services it in a currency it ISSUES.', 'Casi toda la deuda pública federal brasileña es interna y está denominada en reales: el país la paga en una moneda que EMITE.')} />
          <MiniStat label={tr('Estrangeiros nos títulos', 'Foreign holders of bonds', 'Extranjeros en los títulos')} value={`<${MMT_BR.estrangeirosPctMax}%`} sub={tr('baixa exposição externa hoje', 'low external exposure today', 'baja exposición externa hoy')} tip={tr('Ao contrário dos anos 80, a dívida atual não depende de rolagem em dólar.', 'Unlike in the 1980s, today’s federal debt does not depend mainly on dollar rollover.', 'A diferencia de los años 80, la deuda federal actual no depende principalmente de refinanciación en dólares.')} />
          <MiniStat label={tr('Soberania', 'Sovereignty', 'Soberanía')} value={tr('Parcial', 'Partial', 'Parcial')} sub={tr(MMT_BR.soberania, 'Partial / Intermediate', 'Parcial / Intermedia')} tip={tr('Moeda própria e flutuante — mas economia aberta dependente de divisas para importar insumos críticos.', 'Own floating currency — but an open economy that depends on foreign currency to import critical inputs.', 'Moneda propia y flotante — pero una economía abierta que depende de divisas para importar insumos críticos.')} />
          <MiniStat label={tr('Restrição REAL', 'REAL constraint', 'Restricción REAL')} value={tr('Recursos', 'Resources', 'Recursos')} sub={textoPorModo(mode, tr('inflação + capacidade produtiva + câmbio', 'inflation + productive capacity + exchange rate', 'inflación + capacidad productiva + tipo de cambio'), tr(MMT_BR.restricaoReal, 'Spare productive capacity + foreign-exchange bottleneck for essential imports + inflation from distributive conflict', 'Capacidad productiva ociosa + cuello de botella cambiario para importaciones esenciales + inflación por conflicto distributivo'), tr('preços + capacidade de produzir + dólares', 'prices + capacity to produce + foreign currency', 'precios + capacidad de producir + divisas'))} tip={tr('O limite do gasto público brasileiro é inflação e gargalo cambial — não escassez de reais.', 'Brazilian public spending is constrained by inflation and foreign-exchange bottlenecks — not by a physical scarcity of reais.', 'El gasto público brasileño está limitado por la inflación y los cuellos de botella cambiarios — no por una escasez física de reales.')} />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
          {didatico
            ? tr('Tradução: o Brasil não enfrenta a mesma restrição de solvência em reais de quem deve numa moeda estrangeira, mas pode sofrer com inflação e falta de dólares — e juros altos transferem renda aos donos dos títulos. São restrições diferentes.', 'Translation: Brazil does not face the same solvency constraint in reais as a borrower in foreign currency, but it can face inflation and foreign-currency shortages — while high interest transfers income to bondholders. These are different constraints.', 'Traducción: Brasil no enfrenta la misma restricción de solvencia en reales que quien debe en moneda extranjera, pero puede sufrir inflación y escasez de divisas — mientras tasas altas transfieren ingreso a los tenedores de títulos. Son restricciones distintas.')
            : `${trap} ${tr('Restrição externa (TMD): serviços de dívida/remessas drenam divisas — ver bloco TMD no drawer do Brasil.', 'External constraint (dependency theory): debt service and remittances drain foreign currency — see the dependency block in the Brazil drawer.', 'Restricción externa (teoría de la dependencia): el servicio de la deuda y las remesas drenan divisas — véase el bloque de dependencia en el panel de Brasil.')}`}
        </p>
      </div>

      {/* espelho déficit = ativo líquido */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h4 className="text-sm font-semibold text-zinc-100">{tr('O espelho contábil: déficit de um lado = ativo líquido do outro', 'The accounting mirror: one side’s deficit = the other side’s net asset', 'El espejo contable: déficit de un lado = activo neto del otro')}</h4>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-fuchsia-400/40 bg-fuchsia-400/5 p-2.5 text-center">
            <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">{tr('Governo (G − T)', 'Government (G − T)', 'Gobierno (G − T)')}</div>
            <div className="font-mono text-lg font-bold text-fuchsia-300">−R$ 100 {tr('bi déficit', 'bn deficit', 'mil M déficit')}</div>
          </div>
          <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/5 p-2.5 text-center">
            <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">{tr('Setor privado (+ resto)', 'Private sector (+ rest)', 'Sector privado (+ resto)')}</div>
            <div className="font-mono text-lg font-bold text-emerald-300">+R$ 100 {tr('bi líquido', 'bn net', 'mil M netos')}</div>
          </div>
        </div>
        <div className="mx-auto my-2 h-6 w-px bg-gradient-to-b from-fuchsia-400 to-emerald-400" />
        <p className="text-center text-[11px] leading-relaxed text-zinc-400">
          {didatico
            ? tr('A “dívida” do governo corresponde ao ativo financeiro acumulado por empresas, bancos e famílias em títulos públicos. Cortar o déficit reduz esse fluxo de ativos líquidos.', 'Government “debt” corresponds to financial assets accumulated by firms, banks and households in public bonds. Cutting the deficit reduces that flow of net financial assets.', 'La “deuda” del gobierno corresponde a activos financieros acumulados por empresas, bancos y familias en títulos públicos. Reducir el déficit disminuye ese flujo de activos financieros netos.')
            : tr('(S−I) ≡ (G−T)+(X−M): austeridade transfere o ajuste para o balanço privado — quem absorve o encaixe negativo decide a crise.', '(S−I) ≡ (G−T)+(X−M): austerity shifts the adjustment onto private-sector balance sheets — which sector absorbs the negative position shapes the crisis.', '(S−I) ≡ (G−T)+(X−M): la austeridad traslada el ajuste a los balances privados — qué sector absorbe la posición negativa determina la forma de la crisis.')}
        </p>
      </div>
    </m.section>
  )
}

function MiniStat({ label, value, sub, tip }: { label: string; value: string; sub: string; tip?: string }) {
  return (
    <Tip text={tip ?? ''}>
      <div className="h-full cursor-help rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 transition-colors hover:border-zinc-600">
        <div className="text-[9px] uppercase tracking-widest text-zinc-500">{label}</div>
        <div className="mt-0.5 font-mono text-base font-extrabold text-zinc-100">{value}</div>
        <div className="text-[9.5px] leading-tight text-zinc-500">{sub}</div>
      </div>
    </Tip>
  )
}

export function LensPanels({ lens }: { lens: FiscalLens }) {
  return (
    <AnimatePresence mode="wait">
      {lens === 'ortodoxa' ? (
        <m.div key="ortho" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <OrthodoxPanel />
        </m.div>
      ) : (
        <m.div key="mmt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SovereignPanel />
        </m.div>
      )}
    </AnimatePresence>
  )
}
