/**
 * INDICADORES GLOBAIS PESQUISADOS — cada entrada exige: valor, unidade, ano,
 * fonte primária e textos compatíveis com os três níveis de leitura.
 * Ver DATA-GUIDELINES.md na raiz para as diretrizes de inclusão.
 */

export interface Indicator {
  id: string
  label: string
  value: string
  sub?: string
  year: string
  source: string
  sourceUrl?: string
  didatico: string
  avancado: string
  color: string
}

export const INDICATORS: Indicator[] = [
  {
    id: 'cofer-usd',
    label: 'Dólar nas reservas mundiais',
    value: '56,8%',
    sub: 'de 71% em 2000 · € 20,3% · ¥ 5,6%',
    year: 'Q4 2025',
    source: 'IMF COFER',
    sourceUrl: 'https://data.imf.org/en/datasets/IMF.STA:COFER',
    didatico:
      'De cada US$100 guardados nos cofres dos bancos centrais do mundo, quase US$57 estão em dólar. É o que dá aos EUA um "cartão de crédito infinito" — e o que os BRICS tentam furar.',
    avancado:
      'Share alocado do USD caiu de ~71% (2000) para 56,8% (US$7,46 tri); EUR 20,25%, JPY 5,56%, GBP 4,64%, CNY 1,95%. A desdolarização é deriva gradual — não colapso; ajustado por câmbio, Q2-Q3/2025 ficou estável.',
    color: '#ffc107',
  },
  {
    id: 'sipri-mil',
    label: 'Gasto militar global',
    value: 'US$ 2.718 bi',
    sub: '+9,4% em 2024 · EUA 37% · NATO US$ 1,51 tri',
    year: '2024',
    source: 'SIPRI',
    sourceUrl: 'https://www.sipri.org/databases/milex',
    didatico:
      'O mundo gastou mais com exércitos do que nunca: US$ 2,72 trilhões num só ano. Os EUA sozinhos respondem por mais de um terço — o braço armado da hegemonia do dólar.',
    avancado:
      'EUA $997 bi (37%), CHN $314 bi, RUS $149 bi (7,1% do PIB russo), DEU $88,5 bi, IND $86,1 bi. Europa +17% ($693 bi) sob guerra Ucrânia: militarização como saída à sobreacumulação do complexo belico-industrial.',
    color: '#f44336',
  },
  {
    id: 'jpn-debt',
    label: 'Dívida pública do Japão',
    value: '~230–250% do PIB',
    sub: 'sem default há décadas · moeda soberana',
    year: '2024–25',
    source: 'IMF WEO / MoF Japão',
    sourceUrl: 'https://www.imf.org/external/datamapper/GGXWDG_NGDP@WEO/JPN',
    didatico:
      'O Japão deve mais que o dobro do que produz — e ninguém deixou de emprestar. Por quê? A dívida é na própria moeda e está nas mãos de japoneses. Prova viva de que "teto de dívida" é mais política do que matemática.',
    avancado:
      'Evidência central MMT: emissor monetário soberano não dá calote involuntário na própria moeda (BoJ ancora yields via YCC). Contrafactual: Grécia entrou em crise a ~130% SEM controle monetário (euro). Risco real = inflação/câmbio, não solvência.',
    color: '#ba68c8',
  },
  {
    id: 'usa-interest',
    label: 'Juros da dívida dos EUA',
    value: '> US$ 1 tri/ano',
    sub: 'ultrapassou o orçamento de defesa',
    year: '2024–25',
    source: 'U.S. Treasury / CBO',
    sourceUrl: 'https://www.cbo.gov/topics/budget',
    didatico:
      'Os EUA gastam mais pagando juros aos donos da dívida do que com o maior exército do planeta. Quem recebe essa conta? Bancos, fundos e rentistas — o capital portador de juros.',
    avancado:
      'Net interest ≈ US$ 880 bi–1 tri anualizado (2024-25), superando Defense DOD (~$850 bi): consolidação do bloco financeiro como destinatário estrutural da renda fiscal — captura de mais-valia globalizada via Tesouro.',
    color: '#ffc107',
  },
  {
    id: 'brics-share',
    label: 'BRICS+ na economia mundial',
    value: '~40% PIB PPP',
    sub: '10 membros · ~49% da população',
    year: '2025',
    source: 'BCB / IMF PPP',
    sourceUrl: 'https://www.bcb.gov.br/en/about/brics-en',
    didatico:
      'O clube dos emergentes (agora com Indonésia, Egito, Irã, Emirados e Etiópia) já pesa quase metade da humanidade e ~40% da economia mundial em paridade de compra. O mapa multipolar não é retórica — é estatística.',
    avancado:
      'Expansão 2024-25 (EGY ETH IRN ARE IDN): BRICS pleno ≈ 49% população, ~35-40% GDP(PPP), 23% do comércio. Base material para infraestrutura de pagamentos alternativa (mBridge/CIPS) contra sanções do sistema SWIFT.',
    color: '#26c6da',
  },
  {
    id: 'tsmc-advanced',
    label: 'Chips de lógica de ponta feitos pela TSMC',
    value: '~90% do mundo',
    sub: 'lógica leading-edge · gargalo da guerra tech',
    year: '2024',
    source: 'NIST / Dept. de Comércio dos EUA',
    sourceUrl: 'https://www.nist.gov/news-events/news/2024/04/biden-harris-administration-announces-preliminary-terms-tsmc-expanded',
    didatico:
      'Quase todos os chips lógicos mais sofisticados do planeta são fabricados pela TSMC. Por isso a guerra dos semicondutores entre EUA e China é tão feroz — quem controla a fábrica controla o futuro.',
    avancado:
      'O NIST afirma que a TSMC fabrica mais de 90% dos chips lógicos de ponta do mundo. A formulação canônica é “leading-edge logic chips”, não um único nó nanométrico; controles de exportação usam 7 nm e abaixo como limiar operacional.',
    color: '#42a5f5',
  },
]

type IndicatorLocale = Pick<Indicator, 'label' | 'value' | 'sub' | 'source' | 'didatico' | 'avancado'>

const INDICATOR_I18N: Record<string, Record<'en' | 'es', IndicatorLocale>> = {
  'cofer-usd': {
    en: {
      label: 'Dollar share of global reserves',
      value: '56.8%',
      sub: 'down from 71% in 2000 · € 20.3% · ¥ 5.6%',
      source: 'IMF COFER',
      didatico: 'Of every US$100 held in central-bank reserves worldwide, almost US$57 are in dollars. That is part of what gives the United States extraordinary financial reach — and what BRICS initiatives are trying to reduce.',
      avancado: 'The allocated USD share fell from about 71% (2000) to 56.8% (US$7.46 tn); EUR 20.25%, JPY 5.56%, GBP 4.64%, CNY 1.95%. De-dollarization is a gradual drift, not a collapse; adjusted for exchange rates, Q2-Q3/2025 was broadly stable.',
    },
    es: {
      label: 'Dólar en las reservas mundiales',
      value: '56,8%',
      sub: 'desde 71% en 2000 · € 20,3% · ¥ 5,6%',
      source: 'FMI COFER',
      didatico: 'De cada US$100 guardados en las reservas de los bancos centrales del mundo, casi US$57 están en dólares. Eso ayuda a dar a Estados Unidos un alcance financiero extraordinario — y es justamente lo que las iniciativas BRICS intentan reducir.',
      avancado: 'La participación asignada del USD cayó de ~71% (2000) a 56,8% (US$7,46 billones); EUR 20,25%, JPY 5,56%, GBP 4,64%, CNY 1,95%. La desdolarización es una deriva gradual, no un colapso; ajustada por tipo de cambio, Q2-Q3/2025 se mantuvo relativamente estable.',
    },
  },
  'sipri-mil': {
    en: {
      label: 'Global military spending',
      value: 'US$ 2.718 tn',
      sub: '+9.4% in 2024 · U.S. 37% · NATO US$ 1.51 tn',
      source: 'SIPRI',
      didatico: 'The world spent more on armed forces than ever before: US$2.72 trillion in a single year. The United States alone accounts for more than one third — the military arm of dollar-centered power.',
      avancado: 'U.S. US$997 bn (37%), CHN US$314 bn, RUS US$149 bn (7.1% of Russian GDP), DEU US$88.5 bn, IND US$86.1 bn. Europe +17% (US$693 bn) amid the Ukraine war: militarization as an outlet for overaccumulation in the military-industrial complex.',
    },
    es: {
      label: 'Gasto militar mundial',
      value: 'US$ 2,718 billones',
      sub: '+9,4% en 2024 · EE. UU. 37% · OTAN US$ 1,51 billones',
      source: 'SIPRI',
      didatico: 'El mundo gastó más en fuerzas armadas que nunca: US$2,72 billones en un solo año. Estados Unidos por sí solo representa más de un tercio — el brazo militar del poder centrado en el dólar.',
      avancado: 'EE. UU. US$997 mil M (37%), CHN US$314 mil M, RUS US$149 mil M (7,1% del PIB ruso), DEU US$88,5 mil M, IND US$86,1 mil M. Europa +17% (US$693 mil M) bajo la guerra de Ucrania: militarización como salida a la sobreacumulación del complejo militar-industrial.',
    },
  },
  'jpn-debt': {
    en: {
      label: "Japan's public debt",
      value: '~230–250% of GDP',
      sub: 'no default for decades · sovereign currency',
      source: 'IMF WEO / Japan MoF',
      didatico: 'Japan owes more than twice what it produces in a year — yet lenders did not disappear. Why? Most of the debt is issued in its own currency and held domestically. It is a living example that a debt ceiling is as political as it is mathematical.',
      avancado: 'A central MMT example: a sovereign currency issuer does not face involuntary default in its own unit of account (the BoJ can anchor yields). Counterexample: Greece entered crisis near 130% without monetary control under the euro. The binding risks are inflation and the exchange rate, not mechanical solvency.',
    },
    es: {
      label: 'Deuda pública de Japón',
      value: '~230–250% del PIB',
      sub: 'sin default durante décadas · moneda soberana',
      source: 'FMI WEO / Ministerio de Finanzas de Japón',
      didatico: 'Japón debe más del doble de lo que produce en un año — y aun así los prestamistas no desaparecieron. ¿Por qué? La deuda está emitida en su propia moneda y gran parte permanece en manos locales. Es una prueba viva de que un “techo de deuda” es tan político como matemático.',
      avancado: 'Ejemplo central para la MMT: un emisor soberano de moneda no enfrenta un default involuntario en su propia unidad de cuenta (el BoJ puede anclar rendimientos). Contraste: Grecia entró en crisis cerca de 130% sin control monetario bajo el euro. Los riesgos reales son inflación y tipo de cambio, no solvencia mecánica.',
    },
  },
  'usa-interest': {
    en: {
      label: 'Interest on U.S. public debt',
      value: '> US$ 1 tn/year',
      sub: 'surpassed the defense budget',
      source: 'U.S. Treasury / CBO',
      didatico: 'The United States now spends more on interest paid to holders of public debt than on the world’s largest military. Who receives that flow? Banks, funds and rentiers — interest-bearing capital.',
      avancado: 'Net interest is roughly US$880 bn–1 tn annualized (2024-25), above DoD defense spending (~US$850 bn): consolidation of the financial bloc as a structural recipient of fiscal income and a channel for capturing globally produced surplus through Treasury securities.',
    },
    es: {
      label: 'Intereses de la deuda de EE. UU.',
      value: '> US$ 1 billón/año',
      sub: 'superaron el presupuesto de defensa',
      source: 'Tesoro de EE. UU. / CBO',
      didatico: 'Estados Unidos ya gasta más pagando intereses a los dueños de la deuda pública que en el mayor aparato militar del planeta. ¿Quién recibe ese flujo? Bancos, fondos y rentistas — capital portador de interés.',
      avancado: 'El interés neto ronda US$880 mil M–1 billón anualizado (2024-25), por encima del gasto de defensa del DoD (~US$850 mil M): consolidación del bloque financiero como receptor estructural de renta fiscal y canal de captura del excedente producido globalmente vía títulos del Tesoro.',
    },
  },
  'brics-share': {
    en: {
      label: 'BRICS+ share of the world economy',
      value: '~40% GDP PPP',
      sub: '10 members · ~49% of the population',
      source: 'BCB / IMF PPP',
      didatico: 'The emerging-economy group — now including Indonesia, Egypt, Iran, the UAE and Ethiopia — represents almost half of humanity and roughly 40% of world output at purchasing-power parity. A more multipolar map is measurable, not just rhetorical.',
      avancado: '2024-25 expansion (EGY ETH IRN ARE IDN): full BRICS ≈49% of population, ~35-40% of GDP (PPP), 23% of trade. That creates a material base for alternative payment infrastructure (mBridge/CIPS) that can reduce exposure to SWIFT-based sanctions.',
    },
    es: {
      label: 'BRICS+ en la economía mundial',
      value: '~40% PIB PPA',
      sub: '10 miembros · ~49% de la población',
      source: 'BCB / FMI PPP',
      didatico: 'El grupo de economías emergentes — ahora con Indonesia, Egipto, Irán, Emiratos y Etiopía — representa casi la mitad de la humanidad y cerca del 40% de la producción mundial en paridad de poder adquisitivo. Un mapa más multipolar se puede medir; no es solo retórica.',
      avancado: 'Expansión 2024-25 (EGY ETH IRN ARE IDN): BRICS pleno ≈49% de la población, ~35-40% del PIB (PPP) y 23% del comercio. Eso crea una base material para infraestructura alternativa de pagos (mBridge/CIPS) capaz de reducir exposición a sanciones basadas en SWIFT.',
    },
  },
  'tsmc-advanced': {
    en: {
      label: 'Leading-edge logic chips made by TSMC',
      value: '~90% worldwide',
      sub: 'leading-edge logic · bottleneck in the tech war',
      source: 'NIST / U.S. Department of Commerce',
      didatico: 'Nearly all of the most advanced logic chips are manufactured by TSMC. That is why the semiconductor conflict between the United States and China is so intense: control of the production bottleneck shapes the future of computing.',
      avancado: 'NIST states that TSMC manufactures more than 90% of the world’s leading-edge logic chips. The canonical wording is “leading-edge logic chips,” not one nanometer node; export-control regimes commonly use 7 nm and below as an operational threshold.',
    },
    es: {
      label: 'Chips lógicos de vanguardia fabricados por TSMC',
      value: '~90% mundial',
      sub: 'lógica leading-edge · cuello de botella de la guerra tecnológica',
      source: 'NIST / Departamento de Comercio de EE. UU.',
      didatico: 'Casi todos los chips lógicos más avanzados son fabricados por TSMC. Por eso el conflicto de semiconductores entre Estados Unidos y China es tan intenso: controlar ese cuello de botella productivo condiciona el futuro de la computación.',
      avancado: 'El NIST afirma que TSMC fabrica más del 90% de los chips lógicos de vanguardia del mundo. La formulación canónica es “leading-edge logic chips”, no un único nodo nanométrico; los controles de exportación suelen usar 7 nm e inferiores como umbral operativo.',
    },
  },
}

export function indicatorsForLang(lang: 'pt' | 'en' | 'es'): Indicator[] {
  if (lang === 'pt') return INDICATORS
  return INDICATORS.map((indicator) => ({ ...indicator, ...INDICATOR_I18N[indicator.id][lang] }))
}
