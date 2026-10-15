/**
 * TEIAS DE CONTROLE ACIONÁRIO E CONCENTRAÇÃO DO CAPITAL FINANCEIRO
 * 
 * Mapeamento da estrutura de "Common Ownership" (propriedade comum horizontal)
 * e custódia institucional dos Big Three (BlackRock, Vanguard, State Street)
 * e fundos soberanos sobre conglomerados mundiais e ativos listados na B3.
 * 
 * Fontes: SEC Form 13F (Q4 2024 / Q1 2025), CVM Formulários de Referência (2024-2025),
 * Morningstar Direct, Fiamoncini & Schmalz (2020, The New Monopoly Capitalism).
 */

export type NodeKind = 'fund' | 'corporation' | 'sovereign' | 'bank'
export type CapitalFraction = 'produtivo' | 'financeiro' | 'comercial' | 'ficticio' | 'estatal'

export interface OwnershipNode {
  id: string
  name: string
  ticker?: string
  kind: NodeKind
  fraction: CapitalFraction
  country: string
  /** AUM para fundos, Market Cap para corporações (em US$ bilhões) */
  sizeBi: number
  description: [pt: string, en: string, es: string]
  color: string
}

export interface OwnershipEdge {
  id: string
  source: string // investor id
  target: string // company id
  /** Participação no capital total (%) */
  sharePct: number
  /** Valor estimado da fatia (em US$ bilhões) */
  valueBi: number
  notes?: [pt: string, en: string, es: string]
}

export const OWNERSHIP_NODES: OwnershipNode[] = [
  // --- OS GESTORES INSTITUCIONAIS ("BIG THREE" + SOBERANOS) ---
  {
    id: 'vanguard',
    name: 'The Vanguard Group',
    kind: 'fund',
    fraction: 'ficticio',
    country: 'EUA',
    sizeBi: 9300,
    description: [
      'Maior gestora mútua do mundo (~US$ 9,3 tri). Não possui ações em bolsa (pertence aos próprios cotistas de seus fundos passivos), mas exerce direito de voto concentrado em praticamente todas as empresas do S&P 500.',
      'World’s largest mutual fund manager (~$9.3T). Not publicly traded (owned by its passive fund investors), but exercises massive proxy voting power across the S&P 500.',
      'Mayor gestora mutual del mundo (~US$ 9,3 billones). No cotiza en bolsa (pertenece a los partícipes de sus fondos), ejerciendo enorme poder de voto en el S&P 500.',
    ],
    color: '#b91c1c', // red-700
  },
  {
    id: 'blackrock',
    name: 'BlackRock Inc.',
    ticker: 'BLK',
    kind: 'fund',
    fraction: 'ficticio',
    country: 'EUA',
    sizeBi: 10500,
    description: [
      'Maior gestora de ativos do planeta (~US$ 10,5 tri). Opera a plataforma Aladdin (que monitora dezenas de trilhões de dólares) e lidera os ETFs iShares com controle de voto em conselhos globais.',
      'Largest asset manager globally (~$10.5T). Operates the Aladdin risk platform and iShares ETFs, wielding systemic board proxy influence across worldwide capital.',
      'Mayor gestora de activos del planeta (~US$ 10,5 billones). Opera la plataforma Aladdin y lidera los ETF iShares con influencia directa en directorios globales.',
    ],
    color: '#1e293b', // slate-800
  },
  {
    id: 'state-street',
    name: 'State Street Global Advisors',
    ticker: 'STT',
    kind: 'fund',
    fraction: 'ficticio',
    country: 'EUA',
    sizeBi: 4400,
    description: [
      'Terceira perna dos Big Three (~US$ 4,4 tri). Pioneira no primeiro ETF dos EUA (SPY) e custodiante de títulos soberanos mundiais.',
      'Third pillar of the Big Three (~$4.4T). Pioneer of the first US index ETF (SPY) and major custodian of global institutional portfolios.',
      'Tercer pilar de los Big Three (~US$ 4,4 billones). Creadora del ETF SPY y custodio clave de carteras institucionales.',
    ],
    color: '#0369a1', // sky-700
  },
  {
    id: 'norges-bank',
    name: 'Norges Bank (Fundo da Noruega)',
    kind: 'sovereign',
    fraction: 'ficticio',
    country: 'Noruega',
    sizeBi: 1700,
    description: [
      'Maior fundo soberano público do mundo (~US$ 1,7 tri), gerido a partir das rendas petrolíferas do Mar do Norte. Detém em média 1,5% de todas as ações de empresas listadas no planeta.',
      'World’s largest sovereign wealth fund (~$1.7T), financed by North Sea petroleum rents. Owns on average 1.5% of every listed company on Earth.',
      'Mayor fondo soberano del mundo (~US$ 1,7 billones), financiado por la renta petrolera del Mar del Norte. Posee en promedio el 1,5% de las cotizadas del mundo.',
    ],
    color: '#047857', // emerald-700
  },

  // --- MEGABANCOS TRANSNACIONAIS ---
  {
    id: 'jpmorgan',
    name: 'JPMorgan Chase & Co.',
    ticker: 'JPM',
    kind: 'bank',
    fraction: 'financeiro',
    country: 'EUA',
    sizeBi: 610,
    description: [
      'Maior banco comercial e de investimentos dos EUA. Financiador primário de emissões de títulos da dívida externa de países periféricos.',
      'Largest US commercial and investment bank. Primary underwriter and market maker for peripheral sovereign bond emissions.',
      'Mayor banco de EE. UU. Financiador clave de emisiones de bonos soberanos de la periferia.',
    ],
    color: '#d97706', // amber-600
  },

  // --- BIG TECHS & SEMICONDUTORES (CAPITAL PRODUTIVO / PLATAFORMA) ---
  {
    id: 'apple',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    kind: 'corporation',
    fraction: 'produtivo',
    country: 'EUA',
    sizeBi: 3450,
    description: [
      'Aparelho produtivo terceirizado e lucros apropriados por marca/patentes. Campeã mundial de recompras de ações (buybacks) com capital fictício.',
      'Outsourced hardware production with monopoly value capture via patents and iOS platform rent. Global leader in share buybacks.',
      'Producción física tercerizada y apropiación de plusvalía mediante patentes y plataforma iOS.',
    ],
    color: '#475569',
  },
  {
    id: 'microsoft',
    name: 'Microsoft Corp.',
    ticker: 'MSFT',
    kind: 'corporation',
    fraction: 'produtivo',
    country: 'EUA',
    sizeBi: 3150,
    description: [
      'Infraestrutura de nuvem (Azure) e monopólio corporativo em software e inteligência artificial.',
      'Enterprise cloud infrastructure (Azure) and corporate software monopoly expanding through generative AI.',
      'Infraestructura en la nube (Azure) y monopolio de software empresarial en plena expansión hacia la IA.',
    ],
    color: '#2563eb',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    kind: 'corporation',
    fraction: 'produtivo',
    country: 'EUA',
    sizeBi: 3300,
    description: [
      'Monopólio mundial dos aceleradores gráficos e GPUs de IA (>80% do mercado). Fixação do capital constante chave da nova revolução técnica.',
      'Global monopoly in AI accelerators and datacenter GPUs (>80% share). Strategic constant capital supplier.',
      'Monopolio mundial de aceleradores de IA y GPU (>80% del mercado). Proveedor estratégico de capital constante.',
    ],
    color: '#16a34a',
  },
  {
    id: 'alphabet',
    name: 'Alphabet (Google)',
    ticker: 'GOOGL',
    kind: 'corporation',
    fraction: 'comercial',
    country: 'EUA',
    sizeBi: 2150,
    description: [
      'Monopólio de publicidade digital e mediação comercial algorítmica da circulação de mercadorias.',
      'Digital search monopoly extracting commercial circulation rents from worldwide advertising flows.',
      'Monopolio publicitario digital y mediación comercial algorítmica de la circulación global.',
    ],
    color: '#ea580c',
  },
  {
    id: 'tsmc',
    name: 'TSMC (Taiwan Semiconductor)',
    ticker: 'TSM',
    kind: 'corporation',
    fraction: 'produtivo',
    country: 'Taiwan',
    sizeBi: 880,
    description: [
      'Fundição de semicondutores de ponta (<7nm). Elo material mais insubstituível da divisão internacional do trabalho.',
      'World’s primary advanced chip foundry (<7nm). The single most irreplaceable physical node in global production.',
      'Fundición líder mundial de chips avanzados (<7nm). El nodo físico más insustituible de la producción global.',
    ],
    color: '#0284c7',
  },

  // --- ENERGIA & COMMODITIES ---
  {
    id: 'exxon',
    name: 'ExxonMobil Corp.',
    ticker: 'XOM',
    kind: 'corporation',
    fraction: 'produtivo',
    country: 'EUA',
    sizeBi: 460,
    description: [
      'Gigante petrolífera transnacional. Captura de renda da terra diferencial e concessões em águas profundas.',
      'Transnational oil major capturing differential ground rents and deepwater offshore fields.',
      'Gigante petrolero transnacional con captura masiva de renta diferencial de la tierra.',
    ],
    color: '#be123c',
  },

  // --- CONGLOMERADOS BRASILEIROS DA B3 ---
  {
    id: 'vale',
    name: 'Vale S.A.',
    ticker: 'VALE3',
    kind: 'corporation',
    fraction: 'produtivo',
    country: 'Brasil',
    sizeBi: 55,
    description: [
      'Maior exportadora de minério de ferro do Ocidente. Corporation sem controlador estatal direto, dominada por fundos estrangeiros e pensões.',
      'Western hemisphere’s iron ore giant. Privately held corporation dominated by foreign institutional investors.',
      'Gigante del mineral de hierro. Corporación privada con control difuso en manos de fondos transnacionales.',
    ],
    color: '#059669',
  },
  {
    id: 'petrobras',
    name: 'Petrobras',
    ticker: 'PETR4',
    kind: 'corporation',
    fraction: 'estatal',
    country: 'Brasil',
    sizeBi: 88,
    description: [
      'Controle estatal da União (50,3% das ordinárias), mas com a maioria do capital total nas mãos de investidores de Wall Street e dividendos recordes.',
      'State-controlled voting block with majority economic interest held by international Wall Street capital via ADRs.',
      'Control de voto estatal pero con mayoría económica en manos de fondos extranjeros de Wall Street vía ADRs.',
    ],
    color: '#15803d',
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    ticker: 'ITUB4',
    kind: 'bank',
    fraction: 'financeiro',
    country: 'Brasil',
    sizeBi: 60,
    description: [
      'Maior banco privado da América Latina. Captura de spread bancário e custódia da dívida pública interna brasileira.',
      'Latin America’s largest private bank, capturing massive credit spreads and holding federal Treasury bonds.',
      'Mayor banco privado de América Latina. Captura de margen financiero y tenedor de deuda pública brasileña.',
    ],
    color: '#ea580c',
  },
  {
    id: 'embraer',
    name: 'Embraer',
    ticker: 'EMBR3',
    kind: 'corporation',
    fraction: 'produtivo',
    country: 'Brasil',
    sizeBi: 9,
    description: [
      '3ª maior fabricante mundial de aviões comerciais. Exportadora de alta intensidade tecnológica da periferia.',
      '3rd largest commercial jet builder worldwide. High-tech peripheral export champion.',
      '3er fabricante mundial de aviones comerciales. Campeón tecnológico de exportación del Sur.',
    ],
    color: '#0284c7',
  },
  {
    id: 'b3',
    name: 'B3 S.A. (Bolsa do Brasil)',
    ticker: 'B3SA3',
    kind: 'corporation',
    fraction: 'financeiro',
    country: 'Brasil',
    sizeBi: 13,
    description: [
      'Monopólio da infraestrutura de liquidação financeira e negociação de ações do Brasil. Propriedade altamente diluída entre fundos dos EUA.',
      'Brazil’s monopoly financial exchange and clearinghouse. Widely owned by Anglo-American institutional funds.',
      'Monopolio de la infraestructura bursátil y de compensación en Brasil, dominada por fondos estadounidenses.',
    ],
    color: '#9333ea',
  },
]

export const OWNERSHIP_EDGES: OwnershipEdge[] = [
  // --- VANGUARD'S PORTFOLIO ---
  { id: 'v-aapl', source: 'vanguard', target: 'apple', sharePct: 8.4, valueBi: 290 },
  { id: 'v-msft', source: 'vanguard', target: 'microsoft', sharePct: 8.9, valueBi: 280 },
  { id: 'v-nvda', source: 'vanguard', target: 'nvidia', sharePct: 8.4, valueBi: 277 },
  { id: 'v-googl', source: 'vanguard', target: 'alphabet', sharePct: 7.9, valueBi: 170 },
  { id: 'v-jpm', source: 'vanguard', target: 'jpmorgan', sharePct: 9.1, valueBi: 55 },
  { id: 'v-xom', source: 'vanguard', target: 'exxon', sharePct: 9.3, valueBi: 43 },
  { id: 'v-vale', source: 'vanguard', target: 'vale', sharePct: 5.6, valueBi: 3.1 },
  { id: 'v-petr', source: 'vanguard', target: 'petrobras', sharePct: 4.3, valueBi: 3.8 },
  { id: 'v-itub', source: 'vanguard', target: 'itau', sharePct: 3.9, valueBi: 2.3 },
  { id: 'v-embr', source: 'vanguard', target: 'embraer', sharePct: 4.2, valueBi: 0.38 },
  { id: 'v-b3', source: 'vanguard', target: 'b3', sharePct: 4.8, valueBi: 0.62 },

  // --- BLACKROCK'S PORTFOLIO ---
  { id: 'b-aapl', source: 'blackrock', target: 'apple', sharePct: 7.8, valueBi: 269 },
  { id: 'b-msft', source: 'blackrock', target: 'microsoft', sharePct: 8.2, valueBi: 258 },
  { id: 'b-nvda', source: 'blackrock', target: 'nvidia', sharePct: 8.5, valueBi: 280 },
  { id: 'b-googl', source: 'blackrock', target: 'alphabet', sharePct: 7.1, valueBi: 152 },
  { id: 'b-jpm', source: 'blackrock', target: 'jpmorgan', sharePct: 9.4, valueBi: 57 },
  { id: 'b-xom', source: 'blackrock', target: 'exxon', sharePct: 7.2, valueBi: 33 },
  { id: 'b-tsm', source: 'blackrock', target: 'tsmc', sharePct: 5.3, valueBi: 46 },
  { id: 'b-vale', source: 'blackrock', target: 'vale', sharePct: 5.2, valueBi: 2.8 },
  { id: 'b-petr', source: 'blackrock', target: 'petrobras', sharePct: 4.8, valueBi: 4.2 },
  { id: 'b-itub', source: 'blackrock', target: 'itau', sharePct: 4.1, valueBi: 2.4 },
  { id: 'b-embr', source: 'blackrock', target: 'embraer', sharePct: 4.5, valueBi: 0.4 },
  { id: 'b-b3', source: 'blackrock', target: 'b3', sharePct: 5.4, valueBi: 0.7 },

  // --- STATE STREET'S PORTFOLIO ---
  { id: 's-aapl', source: 'state-street', target: 'apple', sharePct: 4.1, valueBi: 141 },
  { id: 's-msft', source: 'state-street', target: 'microsoft', sharePct: 4.3, valueBi: 135 },
  { id: 's-nvda', source: 'state-street', target: 'nvidia', sharePct: 4.2, valueBi: 138 },
  { id: 's-googl', source: 'state-street', target: 'alphabet', sharePct: 3.8, valueBi: 81 },
  { id: 's-jpm', source: 'state-street', target: 'jpmorgan', sharePct: 4.5, valueBi: 27 },
  { id: 's-xom', source: 'state-street', target: 'exxon', sharePct: 4.9, valueBi: 22 },
  { id: 's-vale', source: 'state-street', target: 'vale', sharePct: 2.9, valueBi: 1.6 },

  // --- NORGES BANK SOVEREIGN PORTFOLIO ---
  { id: 'n-aapl', source: 'norges-bank', target: 'apple', sharePct: 1.2, valueBi: 41 },
  { id: 'n-msft', source: 'norges-bank', target: 'microsoft', sharePct: 1.3, valueBi: 40 },
  { id: 'n-nvda', source: 'norges-bank', target: 'nvidia', sharePct: 1.1, valueBi: 36 },
  { id: 'n-tsm', source: 'norges-bank', target: 'tsmc', sharePct: 1.4, valueBi: 12 },
  { id: 'n-petr', source: 'norges-bank', target: 'petrobras', sharePct: 1.8, valueBi: 1.6 },
  { id: 'n-vale', source: 'norges-bank', target: 'vale', sharePct: 1.7, valueBi: 0.9 },

  // --- PARTICIPAÇÕES CRUZADAS NO PRÓPRIO CAPITAL FINANCEIRO (COMMON OWNERSHIP) ---
  {
    id: 'v-blk',
    source: 'vanguard',
    target: 'blackrock',
    sharePct: 8.5,
    valueBi: 12.8,
    notes: [
      'A Vanguard é a maior acionista individual da BlackRock. O capital financeiro custodia e vota nas ações do seu concorrente direto.',
      'Vanguard is BlackRock’s #1 individual shareholder. Financial capital holds ownership stakes in its direct competitors.',
      'Vanguard es el mayor accionista de BlackRock. El capital financiero custodia acciones de su competidor directo.',
    ],
  },
  {
    id: 'b-stt',
    source: 'blackrock',
    target: 'state-street',
    sharePct: 8.1,
    valueBi: 2.2,
    notes: [
      'A BlackRock é a maior acionista individual da State Street, completando a teia circular de interesses acionários idênticos.',
      'BlackRock is the largest shareholder in State Street, closing the circular loop of common ownership incentives.',
      'BlackRock es el mayor accionista de State Street, cerrando el bucle de propiedad común cruzada.',
    ],
  },
]

/**
 * Retorna estatísticas de concentração acionária agregada
 */
export function getBigThreeConcentration(targetId: string): {
  totalPct: number
  totalValueBi: number
  investors: { name: string; pct: number; valueBi: number }[]
} {
  const edges = OWNERSHIP_EDGES.filter((e) => e.target === targetId)
  const totalPct = edges.reduce((acc, cur) => acc + cur.sharePct, 0)
  const totalValueBi = edges.reduce((acc, cur) => acc + cur.valueBi, 0)
  const investors = edges.map((e) => {
    const node = OWNERSHIP_NODES.find((n) => n.id === e.source)
    return {
      name: node?.name ?? e.source,
      pct: e.sharePct,
      valueBi: e.valueBi,
    }
  })
  return { totalPct, totalValueBi, investors }
}
