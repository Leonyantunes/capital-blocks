/**
 * INDICADORES GLOBAIS PESQUISADOS — cada entrada exige: valor, unidade, ano,
 * fonte primária e textos dual-mode (didático + avançado).
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
