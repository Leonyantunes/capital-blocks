import { useState } from 'react'
import { m } from 'framer-motion'
import Tip from './ui/Tip'
import { useApp } from '../store/useApp'
import { modRef } from '../data/modules'
import { locale, pick } from '../i18n'
import { textoPorModo } from '../lib/simples'

type Lens = 'marx' | 'mmt' | 'both'

const LENS_META: Record<Lens, { label: readonly [string, string, string]; color: string }> = {
  marx: { label: ['Leitura Marxista', 'Marxist lens', 'Lectura marxista'], color: '#f44336' },
  mmt: { label: ['Leitura MMT', 'MMT lens', 'Lectura MMT'], color: '#42a5f5' },
  both: { label: ['Comparativo', 'Comparison', 'Comparación'], color: '#ba68c8' },
}

function SectoralBalances() {
  const lang = useApp((s) => s.lang)
  const loc = locale(lang)
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const [gt, setGt] = useState(6) // G − T (% PIB)
  const [xm, setXm] = useState(2.5) // X − M (% PIB)
  const si = gt + xm // (S − I) ≡ (G − T) + (X − M)
  const overheating = gt > 7

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-100">{tr('Identidade setorial interativa', 'Interactive sectoral-balance identity', 'Identidad sectorial interactiva')}</h3>
        <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
          (S − I) ≡ (G − T) + (X − M)
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
        {tr('O déficit público de um lado é, obrigatoriamente, excedente do outro. Mexa nos controles e veja quem fica com o saldo espelhado:', 'A public deficit on one side necessarily appears as a surplus elsewhere. Move the controls and see who holds the mirror balance:', 'Un déficit público de un lado necesariamente aparece como superávit en otro. Mueve los controles y observa quién mantiene el saldo espejo:')}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-fuchsia-300">{tr('Déficit público (G − T)', 'Public deficit (G − T)', 'Déficit público (G − T)')}</span>
            <span className="font-mono font-bold text-zinc-200">{gt.toLocaleString(loc)}%</span>
          </div>
          <input type="range" min={0} max={14} step={0.5} value={gt} onChange={(e) => setGt(parseFloat(e.target.value))} />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-emerald-300">{tr('Superávit externo (X − M)', 'External surplus (X − M)', 'Superávit externo (X − M)')}</span>
            <span className="font-mono font-bold text-zinc-200">{xm.toLocaleString(loc)}%</span>
          </div>
          <input type="range" min={-5} max={8} step={0.5} value={xm} onChange={(e) => setXm(parseFloat(e.target.value))} />
        </div>
      </div>

      {/* barras espelhadas */}
      <div className="mt-3 space-y-1.5">
        {[
          { label: tr('Setor governo (G − T)', 'Government sector (G − T)', 'Sector gobierno (G − T)'), v: gt, color: '#9c27b0' },
          { label: tr('Setor privado (S − I)', 'Private sector (S − I)', 'Sector privado (S − I)'), v: si, color: '#4caf50' },
          { label: tr('Setor externo (X − M)', 'External sector (X − M)', 'Sector externo (X − M)'), v: xm, color: '#ffc107' },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="w-36 shrink-0 text-right text-[10.5px] text-zinc-400">{row.label}</span>
            <div className="relative h-4 flex-1 rounded bg-zinc-800/70">
              <m.div
                animate={{ width: `${Math.max(row.v, 0) * 4}%` }}
                transition={{ type: 'spring', stiffness: 130, damping: 22 }}
                className={`h-full rounded ${row.v < 0 ? 'hidden' : ''}`}
                style={{ background: row.color }}
              />
              {row.v < 0 && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-red-300">
                  {tr('déficit', 'deficit', 'déficit')} {row.v.toLocaleString(loc)}%
                </span>
              )}
            </div>
            <span className="w-12 shrink-0 font-mono text-[11px] font-bold text-zinc-200">
              {row.v >= 0 ? `+${row.v.toLocaleString(loc)}` : row.v.toLocaleString(loc)}%
            </span>
          </div>
        ))}
      </div>

      <div className={`mt-3 rounded-lg border p-2.5 text-[11px] leading-relaxed ${
        overheating ? 'border-money/50 bg-money/10 text-amber-200' : 'border-zinc-700 bg-zinc-950/60 text-zinc-400'
      }`}>
        {overheating
          ? tr('⚠ Estímulo fiscal acima da capacidade oculta típica: na ótica MMT o limite não é a dívida, é a INFLAÇÃO — gastar além dos recursos reais disponíveis empurra preços.', '⚠ Fiscal stimulus above typical spare capacity: in the MMT view the limit is not debt but INFLATION — spending beyond available real resources pushes prices up.', '⚠ Estímulo fiscal por encima de la capacidad ociosa típica: para la MMT el límite no es la deuda sino la INFLACIÓN — gastar más allá de los recursos reales disponibles presiona los precios.')
          : tr('✓ Dentro de uma faixa compatível com capacidade oculta estimada: para a MMT, o constrangimento relevante é inflação/recursos reais — nunca a "falta de dinheiro" do Tesouro.', '✓ Within a range compatible with estimated spare capacity: for MMT, the relevant constraint is inflation/real resources — never the Treasury "running out of money".', '✓ Dentro de un rango compatible con la capacidad ociosa estimada: para la MMT, la restricción relevante es inflación/recursos reales — nunca que el Tesoro "se quede sin dinero".')}
      </div>
      <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-600">
        {tr('Exemplos aproximados: Brasil 2023–24 → G−T ≈ 6%, X−M ≈ +2,5% (superávit comercial recorde); EUA 2020 (pandemia) → G−T ≈ 15%, X−M ≈ −3%. Valores ilustrativos em % do PIB.', 'Approximate examples: Brazil 2023–24 → G−T ≈ 6%, X−M ≈ +2.5% (record trade surplus); US 2020 (pandemic) → G−T ≈ 15%, X−M ≈ −3%. Illustrative values as % of GDP.', 'Ejemplos aproximados: Brasil 2023–24 → G−T ≈ 6%, X−M ≈ +2,5% (superávit comercial récord); EE. UU. 2020 (pandemia) → G−T ≈ 15%, X−M ≈ −3%. Valores ilustrativos como % del PIB.')}
      </p>
    </div>
  )
}

export default function MmtPanel() {
  const [lens, setLens] = useState<Lens>('mmt')
  const { mode, lang } = useApp()
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const didatico = mode !== 'avancado'

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-machine/30 bg-machine/5 p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-zinc-100">
            {tr('A dívida sob outra lente: Teoria Monetária Moderna (MMT)', 'Debt through another lens: Modern Monetary Theory (MMT)', 'La deuda desde otra lente: Teoría Monetaria Moderna (MMT)')}
          </h3>
          <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-zinc-400">
            {tr('O fluxo acima mostra a leitura marxista (quem captura os juros). A MMT discorda do diagnóstico de “sustentabilidade” — e a tensão entre as duas lentes é esclarecedora:', 'The flow above shows the Marxist reading (who captures interest). MMT disputes the conventional diagnosis of debt “sustainability” — and the tension between the two lenses is revealing:', 'El flujo anterior muestra la lectura marxista (quién captura los intereses). La MMT discrepa del diagnóstico convencional de “sostenibilidad” — y la tensión entre ambas lentes resulta esclarecedora:')}
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {(Object.keys(LENS_META) as Lens[]).map((l) => (
            <button key={l} onClick={() => setLens(l)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                lens === l ? 'text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              style={lens === l ? { background: LENS_META[l].color } : undefined}>
              {pick(lang, LENS_META[l].label[0], LENS_META[l].label[1], LENS_META[l].label[2])}
            </button>
          ))}
        </div>
      </header>

      {lens === 'marx' && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2 sm:grid-cols-3">
          {[
            { t: tr('Dívida = captura de renda', 'Debt = capture of income', 'Deuda = captura de renta'), d: tr('O título público transfere mais-valia presente e futura ao capital portador de juros — impostos sobre trabalho pagam a conta.', 'Public bonds transfer present and future surplus value to interest-bearing capital — taxes on labor foot the bill.', 'Los títulos públicos transfieren plusvalía presente y futura al capital que devenga intereses — los impuestos sobre el trabajo pagan la cuenta.') },
            { t: tr('Capital fictício', 'Fictitious capital', 'Capital ficticio'), d: tr('Preço do título = valor capitalizado dos juros prometidos: riqueza de papel sem contrapartida produtiva (Marx, Livro III).', 'Bond price = capitalized value of promised interest: paper wealth without a productive counterpart (Marx, Volume III).', 'Precio del título = valor capitalizado de los intereses prometidos: riqueza de papel sin contrapartida productiva (Marx, Libro III).') },
            { t: tr('Estado como campo de batalha', 'The state as a battlefield', 'El Estado como campo de batalla'), d: tr('A política fiscal reflete a correlação de forças entre frações do capital e classe trabalhadora — nunca um "orçamento neutro".', 'Fiscal policy reflects the balance of power between fractions of capital and the working class — never a "neutral budget".', 'La política fiscal refleja la correlación de fuerzas entre fracciones del capital y la clase trabajadora — nunca un "presupuesto neutral".') },
          ].map((c) => (
            <article key={c.t} className="rounded-lg border border-labor/40 bg-labor/5 p-3">
              <h4 className="text-xs font-bold text-red-300">{c.t}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{c.d}</p>
            </article>
          ))}
        </m.div>
      )}

      {lens === 'mmt' && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2 sm:grid-cols-2">
          {[
            {
              t: textoPorModo(mode,
                tr('Quem imprime a moeda não quebra nela', 'A currency issuer cannot run out of its own currency', 'Quien emite la moneda no se queda sin ella'),
                tr('Emissor soberano ≠ família', 'Sovereign issuer ≠ household', 'Emisor soberano ≠ familia'),
                tr('Um país que cria sua própria moeda funciona diferente de uma família', 'A country that issues its own currency works differently from a household', 'Un país que crea su propia moneda funciona de forma distinta a una familia')),
              d: textoPorModo(mode,
                tr('O Brasil só deve em real, e o BCB é quem cria reais. Por isso o Japão convive com dívida de 230–250% do PIB há décadas sem calote — diferente da Grécia, que devia em euro (moeda que não controla).', 'Brazil owes primarily in reais, and the BCB is the issuer of reais. That helps explain why Japan has carried debt around 230–250% of GDP for decades without default — unlike Greece, which owed in euros, a currency it does not control.', 'Brasil debe principalmente en reales, y el BCB es quien emite reales. Eso ayuda a explicar por qué Japón convive con una deuda de alrededor del 230–250% del PIB desde hace décadas sin impago — a diferencia de Grecia, que debía en euros, una moneda que no controla.'),
                tr('Emissor de moeda fiduciária soberana paga sempre seus títulos resgatáveis na própria unidade; default involuntário é categoria inaplicável (ver Japão 2024: ~230-250% PIB, yields ancorados por BoJ).', 'A sovereign fiat-currency issuer can always settle securities redeemable in its own unit; involuntary default is not the same category of constraint (see Japan 2024: ~230–250% of GDP, yields anchored by the BoJ).', 'Un emisor soberano de moneda fiduciaria siempre puede liquidar títulos rescatables en su propia unidad; el impago involuntario no es la misma categoría de restricción (véase Japón 2024: ~230–250% del PIB, rendimientos anclados por el BoJ).'),
                tr('Na visão da MMT, um governo que emite a moeda em que deve tem limites diferentes de uma família. O problema principal passa a ser inflação, produção disponível e moeda estrangeira, e não simplesmente “ficar sem dinheiro”.', 'In the MMT view, a government that issues the currency in which it owes faces different limits from a household. The key constraints become inflation, available production and foreign currency, rather than simply “running out of money.”', 'Desde la MMT, un gobierno que emite la moneda en la que debe enfrenta límites distintos a los de una familia. Las restricciones clave pasan a ser la inflación, la producción disponible y la moneda extranjera, no simplemente “quedarse sin dinero”.')),
            },
            {
              t: textoPorModo(mode,
                tr('Impostos não pagam as contas do Estado', 'Taxes do not operationally pre-fund state spending', 'Los impuestos no prefinancian operativamente el gasto estatal'),
                tr('Impostos não financiam o gasto no sentido operacional', 'Taxes don’t fund spending', 'Los impuestos no financian el gasto en sentido operativo'),
                tr('Na MMT, impostos têm funções além de arrecadar', 'In MMT, taxes do more than collect revenue', 'En la MMT, los impuestos cumplen funciones más allá de recaudar')),
              d: textoPorModo(mode,
                tr('Na ordem operacional, o Estado gasta primeiro (cria moeda) e cobra depois. Os impostos servem para dar valor à moeda, redistribuir e conter excessos — não para "juntar dinheiro".', 'Operationally, the state spends first by crediting money and taxes afterward. Taxes support demand for the currency, redistribute income and restrain excess demand — rather than functioning like a household savings jar.', 'Operativamente, el Estado gasta primero acreditando dinero y cobra impuestos después. Los impuestos sostienen la demanda por la moneda, redistribuyen ingreso y contienen excesos — no funcionan como una alcancía familiar.'),
                tr('Sequência operacional: gasto credora reservas; tributação debita reservas criando demanda pela moeda e liberando espaço de capacidade produtiva — não financia no sentido técnico.', 'Operational sequence: spending credits reserves; taxation debits reserves, creates demand for the currency and frees productive capacity — it does not technically finance spending in the household sense.', 'Secuencia operativa: el gasto acredita reservas; los impuestos debitan reservas, crean demanda por la moneda y liberan capacidad productiva — no financian técnicamente el gasto en el sentido doméstico.'),
                tr('A MMT destaca que impostos também reduzem poder de compra, ajudam a sustentar a demanda pela moeda e podem redistribuir renda. Essa é uma interpretação específica do funcionamento monetário.', 'MMT emphasizes that taxes also reduce purchasing power, help sustain demand for the currency and can redistribute income. This is a specific interpretation of monetary operations.', 'La MMT destaca que los impuestos también reducen poder de compra, ayudan a sostener la demanda por la moneda y pueden redistribuir ingreso. Es una interpretación específica del funcionamiento monetario.')),
            },
            {
              t: textoPorModo(mode,
                tr('Déficit público = poupança privada', 'Public deficit = private financial surplus', 'Déficit público = superávit financiero privado'),
                tr('Identidade dos balanços setoriais', 'Sectoral balances identity', 'Identidad de balances sectoriales'),
                tr('O saldo de um setor aparece no saldo de outro', 'One sector’s balance appears in another sector’s balance', 'El saldo de un sector aparece en el saldo de otro')),
              d: textoPorModo(mode,
                tr('Toda vez que o governo gasta mais do que arrecada, ALGUÉM do outro lado recebe esse excedente: empresas, famílias ou o resto do mundo. É matemática das contas nacionais — veja no simulador abaixo.', 'Whenever the government spends more than it taxes, SOMEONE on the other side receives the corresponding surplus: firms, households or the rest of the world. That is national-accounting arithmetic — see the simulator below.', 'Cada vez que el gobierno gasta más de lo que recauda, ALGUIEN del otro lado recibe el superávit correspondiente: empresas, familias o el resto del mundo. Es aritmética de las cuentas nacionales — véase el simulador de abajo.'),
                tr('(S−I) ≡ (G−T)+(X−M): déficit fiscal é contraface do superávit privado/externo. Austeridade busca reduzir G−T sem perguntar qual setor absorverá o ajuste.', '(S−I) ≡ (G−T)+(X−M): the fiscal deficit is the counterpart of the private/external surplus. Austerity tries to reduce G−T without asking which sector will absorb the adjustment.', '(S−I) ≡ (G−T)+(X−M): el déficit fiscal es la contrapartida del superávit privado/externo. La austeridad busca reducir G−T sin preguntar qué sector absorberá el ajuste.'),
                tr('Nas contas nacionais, receitas e gastos dos setores se conectam. Se um setor termina com saldo positivo, outro precisa aparecer com o saldo correspondente.', 'In national accounts, sectoral income and spending are linked. If one sector ends with a positive balance, another must show the corresponding balance.', 'En las cuentas nacionales, los ingresos y gastos sectoriales están conectados. Si un sector termina con saldo positivo, otro debe mostrar el saldo correspondiente.')),
            },
            {
              t: textoPorModo(mode,
                tr('O limite verdadeiro é a inflação', 'The binding limit is inflation and real resources', 'El límite vinculante es la inflación y los recursos reales'),
                tr('Restrição de recursos reais', 'Real resource constraint', 'Restricción de recursos reales'),
                tr('Produção e preços também limitam o gasto', 'Production capacity and prices also constrain spending', 'La capacidad productiva y los precios también limitan el gasto')),
              d: textoPorModo(mode,
                tr('A pergunta certa não é "temos dinheiro?" mas "temos fábricas, trabalhadores e materiais?". Gastar além disso empurra os preços para cima — esse é o freio real, não a dívida.', 'The relevant question is not “do we have money?” but “do we have factories, workers and materials?” Spending beyond those real limits pushes prices up — that is the constraint.', 'La pregunta relevante no es “¿tenemos dinero?” sino “¿tenemos fábricas, trabajadores y materiales?”. Gastar más allá de esos límites reales empuja los precios al alza — esa es la restricción.'),
                tr('Restrição = capacidade produtiva ociosa e trajetória de preços; instrumentos: tributação seletiva, crédito dirigido, controles de mark-up. Debate aberto: coordenação fiscal-monetária vs independência formal do BCB.', 'Constraint = spare productive capacity and the price path; instruments include selective taxation, directed credit and mark-up controls. Open debate: fiscal-monetary coordination versus formal central-bank independence.', 'Restricción = capacidad productiva ociosa y trayectoria de precios; instrumentos: tributación selectiva, crédito dirigido y controles de margen. Debate abierto: coordinación fiscal-monetaria frente a independencia formal del banco central.'),
                tr('Mesmo que o governo consiga emitir moeda, não consegue criar trabalhadores, máquinas ou alimentos instantaneamente. Gastar acima da capacidade de produção pode aumentar preços.', 'Even if the government can issue currency, it cannot instantly create workers, machines or food. Spending beyond productive capacity can raise prices.', 'Aunque el gobierno pueda emitir moneda, no puede crear instantáneamente trabajadores, máquinas o alimentos. Gastar por encima de la capacidad productiva puede elevar los precios.')),
            },
          ].map((c) => (
            <article key={c.t} className="rounded-lg border border-sky-400/40 bg-sky-400/5 p-3">
              <h4 className="text-xs font-bold text-sky-300">{c.t}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{c.d}</p>
            </article>
          ))}
        </m.div>
      )}

      {lens === 'both' && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2 md:grid-cols-2">
          <article className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <h4 className="text-xs font-bold text-emerald-300">{tr('Pontos de encontro', 'Points of convergence', 'Puntos de convergencia')}</h4>
            <ul className="mt-1.5 space-y-1.5 text-[11px] leading-relaxed text-zinc-300">
              <li>· <strong>{tr('Dinheiro endógeno:', 'Endogenous money:', 'Dinero endógeno:')}</strong> {tr('bancos criam crédito ao emprestar — ambos rejeitam a "poupança prévia" ortodoxa.', 'banks create credit when they lend — both approaches reject the orthodox idea that lending requires prior saving.', 'los bancos crean crédito al prestar — ambos enfoques rechazan la idea ortodoxa de que el préstamo exige ahorro previo.')}</li>
              <li>· <strong>{tr('Juros são distribuição:', 'Interest is distribution:', 'Los intereses son distribución:')}</strong> {tr('taxa alta transfere renda a rentistas (MMT: sem função alocativa maior; Marx: captura pelo capital portador de juros).', 'high rates transfer income to rentiers (MMT: limited allocative role; Marx: capture by interest-bearing capital).', 'las tasas altas transfieren ingreso a rentistas (MMT: papel asignativo limitado; Marx: captura por el capital que devenga intereses).')}</li>
              <li>· <strong>{tr('Contra a austeridade naturalizada:', 'Against naturalized austerity:', 'Contra la austeridad naturalizada:')}</strong> {tr('o "teto de gastos" é escolha política, não lei física.', 'a spending cap is a political choice, not a law of nature.', 'un techo de gasto es una elección política, no una ley física.')}</li>
              <li>· <strong>{tr('Contrafactual grego:', 'Greek counterfactual:', 'Contrafactual griego:')}</strong> {tr('crise de solvência é produto da hierarquia monetária (euro), não do tamanho numérico da dívida.', 'the solvency crisis reflects the monetary hierarchy of the euro, not debt’s numerical size alone.', 'la crisis de solvencia refleja la jerarquía monetaria del euro, no solo el tamaño numérico de la deuda.')}</li>
            </ul>
          </article>
          <article className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <h4 className="text-xs font-bold text-red-300">{tr('Divergências decisivas', 'Key divergences', 'Divergencias decisivas')}</h4>
            <ul className="mt-1.5 space-y-1.5 text-[11px] leading-relaxed text-zinc-300">
              <li>· <strong>{tr('Classe social:', 'Social class:', 'Clase social:')}</strong> {tr('MMT trata o Estado como gestor da moeda com espaço de política; para Marx, ele organiza condições de acumulação e sua política fiscal expressa relações de poder entre classes.', 'MMT emphasizes the state’s policy space as currency issuer; Marxist analysis emphasizes how the state organizes conditions for accumulation and how fiscal policy reflects class power.', 'La MMT enfatiza el espacio de política del Estado como emisor de moneda; el análisis marxista enfatiza cómo el Estado organiza condiciones de acumulación y cómo la política fiscal refleja el poder de clase.')}</li>
              <li>· <strong>{tr('Inflação:', 'Inflation:', 'Inflación:')}</strong> {tr('MMT foca demanda × capacidade; Marx acrescenta conflito distributivo, mark-ups monopolistas e choques de câmbio/commodities.', 'MMT focuses on demand versus capacity; Marxist analysis adds distributive conflict, monopoly mark-ups and exchange-rate/commodity shocks.', 'La MMT se centra en demanda frente a capacidad; el análisis marxista añade conflicto distributivo, márgenes monopólicos y choques cambiarios/de commodities.')}</li>
              <li>· <strong>{tr('Hierarquia monetária global:', 'Global monetary hierarchy:', 'Jerarquía monetaria global:')}</strong> {tr(`a lente MMT nasce em emissores centrais; para a periferia, a hegemonia do dólar impõe uma restrição externa real (ver ${modRef('home', lang)}).`, `MMT was developed mainly around core currency issuers; for peripheral economies, dollar dominance creates a real external constraint (see ${modRef('home', lang)}).`, `La MMT se desarrolló principalmente alrededor de emisores monetarios centrales; para las economías periféricas, la hegemonía del dólar crea una restricción externa real (véase ${modRef('home', lang)}).`)}</li>
            </ul>
          </article>
        </m.div>
      )}

      <SectoralBalances />

      <div className="flex flex-wrap gap-2">
        <Tip text={didatico
          ? tr('O Japão deve mais que o dobro do que produz e paga juros baixíssimos há décadas — porque deve em iene, na própria moeda.', 'Japan owes more than twice its annual output and has paid very low rates for decades — because the debt is in yen, its own currency.', 'Japón debe más del doble de lo que produce al año y paga tasas muy bajas desde hace décadas — porque la deuda está en yenes, su propia moneda.')
          : tr('IMF WEO/MoF: dívida bruta geral ~230–250% do PIB (2024–25); BoJ ancora a curva (YCC); alta titularidade doméstica reduz risco de fuga.', 'IMF WEO/MoF: general gross debt ~230–250% of GDP (2024–25); BoJ anchors the curve (YCC); high domestic ownership reduces flight risk.', 'IMF WEO/MoF: deuda bruta general ~230–250% del PIB (2024–25); el BoJ ancla la curva (YCC); la alta tenencia doméstica reduce el riesgo de fuga.')}>
          <span className="cursor-help rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1.5 text-[10.5px] text-zinc-300">
            [JPN] {tr('Japão: dívida ~230–250% PIB · sem default', 'Japan: debt ~230–250% GDP · no default', 'Japón: deuda ~230–250% PIB · sin impago')} · <em>IMF/MoF</em>
          </span>
        </Tip>
        <Tip text={didatico
          ? tr('A Grécia entrou em crise devendo proporcionalmente MENOS que o Japão — porque devia em euro, moeda que não controla.', 'Greece entered crisis with a lower debt ratio than Japan — because it owed in euros, a currency it does not control.', 'Grecia entró en crisis con una ratio de deuda menor que Japón — porque debía en euros, una moneda que no controla.')
          : tr('Contrafactual da zona do euro: crise a ~130% PIB (2010–12) por ausência de emitente soberano — a troika impôs austeridade pró-cíclica.', 'Euro-area counterfactual: crisis at ~130% of GDP (2010–12) without a sovereign currency issuer — the troika imposed procyclical austerity.', 'Contrafactual de la zona euro: crisis con ~130% del PIB (2010–12) sin emisor monetario soberano — la troika impuso austeridad procíclica.')}>
          <span className="cursor-help rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1.5 text-[10.5px] text-zinc-300">
            [GRC] {tr('Grécia: crise a ~130% PIB · sem moeda própria', 'Greece: crisis at ~130% GDP · no sovereign currency', 'Grecia: crisis con ~130% PIB · sin moneda propia')} · <em>{tr('eurozona', 'euro area', 'zona euro')}</em>
          </span>
        </Tip>
        <Tip text={didatico
          ? tr('Os EUA já gastam mais em juros da dívida do que com defesa — uma enorme transferência anual para detentores de ativos financeiros.', 'The US now spends more on net debt interest than on defense — a huge annual transfer to holders of financial assets.', 'EE. UU. ya gasta más en intereses netos de la deuda que en defensa — una enorme transferencia anual a tenedores de activos financieros.')
          : tr('Juros líquidos ≈ US$ 880 bi–1 tri (2024–25) > defesa DOD (~US$ 850 bi): rentistas aparecem como grandes destinatários estruturais do orçamento federal.', 'Net interest ≈ US$880bn–1tn (2024–25) > DOD defense (~US$850bn): rentiers are major structural recipients of the federal budget.', 'Intereses netos ≈ US$ 880 mil M–1 billón (2024–25) > defensa DOD (~US$ 850 mil M): los rentistas son grandes receptores estructurales del presupuesto federal.')}>
          <span className="cursor-help rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1.5 text-[10.5px] text-zinc-300">
            [USA] {tr('EUA: juros', 'US: interest', 'EE. UU.: intereses')} {'>'} US$ 1 {tr('tri/ano', 'tn/year', 'billón/año')} {'>'} {tr('defesa', 'defense', 'defensa')} · <em>Treasury/CBO</em>
          </span>
        </Tip>
      </div>
    </section>
  )
}
