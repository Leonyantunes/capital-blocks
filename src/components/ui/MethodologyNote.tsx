import { useState } from 'react'
import { useApp } from '../../store/useApp'
import { pick } from '../../i18n'

export type MethodologyTopic = 'circuit' | 'companies' | 'debt' | 'theory' | 'pib' | 'tmd'

interface TopicDetails {
  title: [pt: string, en: string, es: string]
  formula?: string
  source: string
  points: [pt: string, en: string, es: string][]
  snaComparison: [pt: string, en: string, es: string]
}

export const METHODOLOGY_DETAILS: Record<MethodologyTopic, TopicDetails> = {
  circuit: {
    title: [
      'Identidade Contábil do Circuito e Conversão Marxista',
      'Circuit Accounting Identity & Marxian Conversion',
      'Identidad Contable del Circuito y Conversión Marxista',
    ],
    formula: 'W = c + v + m \\quad \\implies \\quad g = \\frac{m}{c + v} = \\frac{e}{k + 1}',
    source: 'Shaikh & Tonak (1994, Measuring the Wealth of Nations); ILAESE (2024)',
    points: [
      [
        'Capital Constante (c): Meios de produção, matérias-primas e depreciação de máquinas transferidos à mercadoria durante o ciclo.',
        'Constant Capital (c): Means of production, raw materials, and machinery depreciation transferred to commodities.',
        'Capital Constante (c): Medios de producción, materias primas y depreciación de maquinaria transferidos a la mercancía.',
      ],
      [
        'Capital Variável (v): Valor pago pela compra da força de trabalho (salários diretos e indiretos de reprodução).',
        'Variable Capital (v): Value advanced to purchase labor power (direct and social reproduction wages).',
        'Capital Variable (v): Valor adelantado para adquirir fuerza de trabajo (salarios de reproducción).',
      ],
      [
        'Mais-Valia (m): Valor novo excedente gerado pelo trabalho vivo além do tempo necessário para repor os salários.',
        'Surplus Value (m): New surplus value produced by living labor beyond necessary labor-time.',
        'Plusvalía (m): Valor nuevo excedente producido por el trabajo vivo más allá del tiempo necesario.',
      ],
      [
        'Conversão Didática em Horas: H = J · e/(e+1), onde J é a jornada (8h). Em e = 1,5, são 04h48min de trabalho gratuito.',
        'Didactic Time Metric: H = J · e/(e+1) for an 8h shift. At e = 1.5, 04h48min represents uncompensated labor.',
        'Conversión en Horas: H = J · e/(e+1) en jornada de 8h. Con e = 1,5, 04h48min es trabajo gratuito.',
      ],
    ],
    snaComparison: [
      'Contraponto SCN/IBGE: O Sistema de Contas Nacionais registra apenas PIB = Salários + Excedente Operacional Bruto + Impostos Líquidos, tratando juros e publicidade como agregação de valor em vez de custos de circulação deduzidos da mais-valia.',
      'SNA/IBGE Contrast: Standard System of National Accounts treats Gross Operating Surplus as an amorphous residual, obscuring the boundary between productive value creation and circulation deductions (advertising, financial fees).',
      'Contrapunto SCN/IBGE: El Sistema de Cuentas Nacionales agrupa la plusvalía en Excedente Operativo Bruto, invisibilizando la diferencia entre creación de valor y gastos de circulación.',
    ],
  },
  companies: {
    title: [
      'Tradução de Balanços Corporativos (DRE) em Categorias de Valor',
      'Translating Corporate Financial Statements (IFRS/US-GAAP) into Value Categories',
      'Traducción de Balances Corporativos a Categorías de Valor',
    ],
    formula: '\\text{Receita Líquida} = c + v + m; \\quad \\text{Capital Fictício} = \\text{Market Cap} - \\text{Patrimônio Líquido}',
    source: 'SEC EDGAR 10-K / CVM Demonstrações Financeiras / Bloomberg Data (2024–2026)',
    points: [
      [
        'Capital Variável (v): Estimado pela folha salarial declarada ou pelo produto: Headcount Total × Salário Médio Setorial da Jurisdição.',
        'Variable Capital (v): Estimated via disclosed payroll or headcount multiplied by sector-specific average local wages.',
        'Capital Variable (v): Estimado mediante nómina salarial o plantilla multiplicada por el salario medio sectorial.',
      ],
      [
        'Mais-Valia Apropriada (m): Proxy pelo Lucro Líquido consolidado somado a dividendos, recompras de ações e juros sobre capital próprio.',
        'Appropriated Surplus Value (m): Proxied by net operating profit after tax plus distributed dividends, stock buybacks, and net financial expenses.',
        'Plusvalía Apropiada (m): Estimada por el beneficio neto consolidado más dividendos, recompras de acciones e intereses financieros.',
      ],
      [
        'Capital Constante (c): Calculado como resíduo operacional: Receita Líquida − (v + m), cobrindo CPV (insumos) e SG&A operacional.',
        'Constant Capital (c): Derived as operating residual: Net Revenue − (v + m), encompassing COGS inputs and operational SG&A.',
        'Capital Constante (c): Calculado como residuo operativo: Ingresos Netos − (v + m), cubriendo costos de insumos y depreciación.',
      ],
      [
        'Capital Fictício: A sobrecapitalização bolsista em relação aos ativos físicos tangíveis reflete capitalização de rendas de monopólio e expectativas especulativas.',
        'Fictitious Capital: Equity market capitalization exceeding physical book value reflects capitalization of future monopoly rents and speculative claims.',
        'Capital Ficticio: La capitalización bursátil por encima de los activos tangibles refleja la capitalización de rentas futuras de monopolio.',
      ],
    ],
    snaComparison: [
      'Alerta Metodológico Marxista: A taxa m/v contábil em bancos ou mineradoras reflete tanto exploração direta quanto redistribuição intersetorial de mais-valia via preços de monopólio e juros (Marx, O Capital, Livro III).',
      'Marxian Methodological Caution: High accounting m/v in tech or finance reflects not only direct exploitation but also cross-sectoral surplus value capture through prices of production and monopoly rents.',
      'Alerta Metodológico Marxista: La tasa m/v contable en tecnología o finanzas refleja tanto explotación directa como captura intersectorial de plusvalía mediante precios de monopolio.',
    ],
  },
  debt: {
    title: [
      'Identidade dos Balanços Setoriais e Dinâmica Monetária',
      'Sectoral Balances Identity & Monetary Sovereignty',
      'Identidad de Balances Sectoriales y Soberanía Monetaria',
    ],
    formula: '(S - I) \\equiv (G - T) + (X - M); \\quad \\text{Lucros (Kalecki)} = I + C_k + (G - T) + (X - M)',
    source: 'Wynne Godley & Marc Lavoie (Monetary Economics); Michal Kalecki (1971); Stephanie Kelton (2020)',
    points: [
      [
        'Identidade de Godley: O déficit do governo (G - T) é contabilmente idêntico ao superávit financeiro líquido do setor privado somado ao déficit externo.',
        'Godley Sectoral Identity: Government deficit (G - T) equals the net financial surplus of the private sector plus the current account deficit.',
        'Identidad de Godley: El déficit del gobierno (G - T) equivale al superávit financiero neto del sector privado más el saldo externo.',
      ],
      [
        'Equação de Lucros de Kalecki: Os capitalistas ganham o que gastam; trabalhadores gastam o que ganham. O déficit público garante a realização do lucro privado.',
        'Kalecki’s Profit Equation: Capitalists earn what they spend; workers spend what they earn. Fiscal deficits sustain aggregate corporate profit realization.',
        'Ecuación de Kalecki: Los capitalistas ganan lo que gastan; los trabajadores gastan lo que ganan. El déficit público sostiene los beneficios privados.',
      ],
      [
        'Hierarquia Monetária: Países emissores de moeda de reserva (EUA) operam sem restrição externa, enquanto países periféricos enfrentam dreno em divisa.',
        'Currency Hierarchy: Core reserve currency issuers operate without external balance-of-payments constraints, while the periphery faces dollar drainage.',
        'Jerarquía Monetaria: Los emisores de moneda de reserva operan sin restricción externa, mientras la periferia enfrenta drenaje de divisas.',
      ],
    ],
    snaComparison: [
      'Atenção ao Orçamento Geral da União (Brasil): Distinguir a rolagem/refinanciamento da dívida mobiliária federal (que infla o gráfico da LOA) do resultado primário e juros reais líquidos apurados pelo Banco Central.',
      'Brazilian Budget Caveat: Crucial to distinguish public debt rollover/refinancing (which inflates statutory budget totals) from net real interest in national accounts.',
      'Advertencia Presupuestaria: Distinguir la refinanciación de la deuda pública (que infla el presupuesto formal) del gasto neto real en intereses.',
    ],
  },
  theory: {
    title: [
      'Contraponto de Escolas Heterodoxas e Síntese Analítica',
      'Heterodox Schools Comparison & Analytical Synthesis',
      'Comparativa de Escuelas Heterodoxas y Síntesis Analítica',
    ],
    formula: '\\text{Marx (Valor)} \\leftrightarrow \\text{Kalecki (Demanda)} \\leftrightarrow \\text{MMT (Moeda)} \\leftrightarrow \\text{TMD (Dependência)}',
    source: 'Marx (O Capital); Kalecki (Teoria da Dinâmica Econômica); Wray (MMT); Marini (Dialética da Dependência)',
    points: [
      [
        'Pilar 1 — Marx (Produção de Valor): Toda riqueza mercantil decorre do trabalho vivo socialmente necessário; lucro é mais-valia não remunerada.',
        'Pillar 1 — Marx (Value Production): Wealth stems from socially necessary living labor; profit is unpaid surplus-value extracted in production.',
        'Pilar 1 — Marx (Producción de Valor): Toda riqueza proviene del trabajo vivo; la ganancia es plusvalía no remunerada.',
      ],
      [
        'Pilar 2 — Kalecki (Realização e Distribuição): A extração em fábrica não garante a venda: a demanda agregada condiciona a realização dos lucros.',
        'Pillar 2 — Kalecki (Realization): Factory extraction does not guarantee sale: aggregate effective demand determines whether surplus is realized.',
        'Pilar 2 — Kalecki (Realización): La extracción fabril no asegura la venta: la demanda efectiva condiciona la realización de beneficios.',
      ],
      [
        'Pilar 3 — MMT (Moeda Soberana): O Estado soberano emite a moeda ao gastar; títulos públicos são reservas remuneradas para a liquidez privada.',
        'Pillar 3 — MMT (Sovereign Money): The sovereign state issues currency by spending; government bonds provide interest-bearing safe assets.',
        'Pilar 3 — MMT (Moneda Soberana): El Estado emite moneda al gastar; los bonos públicos remuneran la liquidez del sector privado.',
      ],
      [
        'Pilar 4 — TMD (Drenagem Imperial): O centro apropria excedente periférico via troca desigual e juros; a periferia superexplora o trabalho para compensar.',
        'Pillar 4 — Dependency Theory (Imperial Drain): The core extracts peripheral surplus through unequal exchange; the periphery super-exploits labor to compensate.',
        'Pilar 4 — TMD (Drenaje Imperial): El centro extrae excedente periférico mediante intercambio desigual; la periferia superexplota el trabajo.',
      ],
    ],
    snaComparison: [
      'Síntese Crítica: Os 4 pilares não são contraditórios, mas níveis complementares: Produção (Marx) $\\rightarrow$ Circulação (Kalecki) $\\rightarrow$ Estado/Moeda (MMT) $\\rightarrow$ Ordem Geopolítica Global (TMD).',
      'Critical Synthesis: The 4 pillars represent complementary analytical levels: Production (Marx) -> Circulation (Kalecki) -> State/Monetary Macro (MMT) -> Global Imperial Hierarchy (TMD).',
      'Síntesis Crítica: Los 4 pilares articulan niveles complementarios: Producción (Marx) -> Circulación (Kalecki) -> Estado/Moneda (MMT) -> Orden Geopolítico (TMD).',
    ],
  },
  pib: {
    title: [
      'Mensuração de PIB Nominal vs. PPP e Frações de Capital',
      'Nominal vs. PPP GDP Measurement & Capital Fraction Breakdown',
      'Medición de PIB Nominal vs. PPA y Fracciones de Capital',
    ],
    formula: '\\text{PIB Nominal} = \\sum P_i Q_i; \\quad \\text{PIB PPP} = \\sum P_{\\text{EUA}} Q_i; \\quad \\text{Fração Fictícia} = \\text{Ativos Financeiros}/\\text{PIB}',
    source: 'FMI WEO (2025/2026); Penn World Table 10.01; ILAESE Contas Nacionais',
    points: [
      [
        'PIB Nominal: Mede o poder de compra e comando geopolítico no mercado internacional em dólares correntes.',
        'Nominal GDP: Measures international purchasing power and geopolitical command in current US dollars.',
        'PIB Nominal: Mide el poder de compra y mando geopolítico internacional en dólares corrientes.',
      ],
      [
        'PIB PPP (Paridade de Poder de Compra): Corrige discrepâncias de preços internos, revelando a verdadeira capacidade física de produção e consumo (onde a China lidera o mundo).',
        'PPP GDP (Purchasing Power Parity): Adjusts for internal price differences, reflecting real physical output capacity (where China leads globally).',
        'PIB PPA: Corrige precios internos, reflejando la capacidad física real de producción (donde China lidera).',
      ],
      [
        'Frações de Capital: A decomposição por fração produtiva, financeira, comercial, fictícia e estatal baseia-se em matrizes de contas sociais adaptadas de Shaikh & Tonak.',
        'Capital Fractions: Breakdown across productive, financial, commercial, fictitious, and state capital draws on social accounting matrices adapted from Shaikh & Tonak.',
        'Fracciones de Capital: Desglose por capital productivo, financiero, comercial, ficticio y estatal basado en matrices de Shaikh & Tonak.',
      ],
    ],
    snaComparison: [
      'Limitação das Estatísticas Ortodoxas: O Banco Mundial e o FMI utilizam o PIB per capita sem desagregação de classe, mascarando que 1% do topo concentra até 50% da renda nacional em países periféricos.',
      'Orthodox Statistic Bias: World Bank and IMF per capita GDP metrics conceal that the top 1% appropriates up to 50% of national income in peripheral formations.',
      'Sesgo Estadístico Oficial: El PIB per cápita del FMI oculta que el 1% superior concentra hasta el 50% del ingreso nacional en la periferia.',
    ],
  },
  tmd: {
    title: [
      'Mecanismos de Transferência de Valor Sul → Norte (TMD)',
      'South-to-North Value Transfer Mechanisms (Marxian Dependency Theory)',
      'Mecanismos de Transferencia de Valor Sur → Norte (TMD)',
    ],
    formula: '\\text{Dreno Total} = \\text{Troca Desigual} + \\text{Remessas de Lucros} + \\text{Serviço da Dívida} + \\text{Fuga Ilícita de Capitais}',
    source: 'Ruy Mauro Marini (1973); Theotônio dos Santos; Jason Hickel et al. (Nature/Lancet 2022); Gabriel Zucman (2014)',
    points: [
      [
        'Troca Desigual: Bens manufaturados do centro incorporam menos horas de trabalho por dólar do que bens primários da periferia, drenando valor incorporado líquido anualmente.',
        'Unequal Exchange: Core manufactured goods embody fewer labor-hours per dollar than peripheral commodities, draining net incorporated labor yearly.',
        'Intercambio Desigual: Las manufacturas del centro incorporan menos horas de trabajo por dólar que los bienes primarios de la periferia.',
      ],
      [
        'Superexploração da Força de Trabalho: Mecanismo de compensação pelo qual o capitalista periférico rebaixa o salário abaixo do valor de reprodução para manter margens competitivas.',
        'Labor Super-exploitation: Compensatory mechanism whereby peripheral capital compresses wages below reproduction costs to maintain export competitiveness.',
        'Superexplotación: Mecanismo por el cual el capital periférico reduce salarios por debajo del valor de reproducción para sostener márgenes.',
      ],
      [
        'Remessas e Royalties: Filiais transnacionais repatriam dividendos, taxas de gestão e patentes (R$ 195–294 bi/ano no Brasil), esvaziando o reinvestimento local.',
        'Profit Repatriation & Royalties: Transnational affiliates repatriate dividends and IP fees ($40-60bn/year in Brazil), curbing local productive reinvestment.',
        'Remesas y Regalías: Filiales transnacionales repatrian dividendos y patentes, vaciando el fondo de reinversión productiva local.',
      ],
    ],
    snaComparison: [
      'Hickel et al. (2022): Estudo quantitativo recente estima que a transferência líquida de valor físico e trabalho do Sul Global para o Norte excede US$ 10 trilhões por ano, mais de 100 vezes o valor de toda ajuda externa internacional.',
      'Hickel et al. (2022): Quantitative estimates indicate net embodied value drained from the Global South to the North exceeds $10 trillion per year—over 100 times official development aid.',
      'Hickel et al. (2022): Estimaciones cuantitativas demuestran que la transferencia neta del Sur al Norte supera los US$ 10 billones anuales.',
    ],
  },
}

export default function MethodologyNote({
  topic = 'circuit',
  className = '',
}: {
  topic?: MethodologyTopic
  className?: string
}) {
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const [open, setOpen] = useState(false)

  // Em modo simples ou didático, a nota fica disponível sob demanda; no modo avançado, ganha destaque
  const isAdv = mode === 'avancado'
  const li = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2
  const item = METHODOLOGY_DETAILS[topic]
  if (!item) return null

  return (
    <div
      className={`my-3 rounded-xl border ${
        isAdv ? 'border-sky-500/40 bg-sky-950/20' : 'border-zinc-800 bg-zinc-900/50'
      } p-3.5 transition-all ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-sky-400/50 bg-sky-400/15 font-mono text-[10px] font-bold text-sky-300">
            M
          </span>
          <span className="text-xs font-bold text-zinc-200">
            {item.title[li]}
          </span>
          {isAdv && (
            <span className="rounded bg-sky-500/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-sky-300">
              {pick(lang, 'Rigor Acadêmico', 'Academic Rigor', 'Rigor Académico')}
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-zinc-400">{open ? '▲' : '▼'}</span>
      </button>

      {(open || isAdv) && (
        <div className="mt-3 space-y-2.5 border-t border-zinc-800/80 pt-2.5 text-xs text-zinc-300">
          {item.formula && (
            <div className="rounded-lg border border-sky-500/20 bg-zinc-950/80 px-3 py-2 font-mono text-[11px] font-semibold text-sky-200">
              <code>{item.formula}</code>
            </div>
          )}

          <ul className="space-y-1.5 pl-4 list-disc marker:text-sky-400 text-[11.5px] leading-relaxed">
            {item.points.map((pt, i) => (
              <li key={i}>{pt[li]}</li>
            ))}
          </ul>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-[11px] leading-relaxed text-zinc-400">
            <span className="font-semibold text-zinc-300">
              {pick(lang, 'Comparativo Contas Nacionais / SNA:', 'SNA / National Accounts Comparison:', 'Comparativa Cuentas Nacionales / SCN:')}{' '}
            </span>
            {item.snaComparison[li]}
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500 font-mono">
            <span>{pick(lang, 'Fonte Metodológica:', 'Methodological Source:', 'Fuente Metodológica:')} {item.source}</span>
          </div>
        </div>
      )}
    </div>
  )
}
