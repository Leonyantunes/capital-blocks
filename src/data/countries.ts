/**
 * BASELINE EMBUTIDA — Grandes agregados (base FMI, valores aproximados 2025/26)
 * e decomposição DIDÁTICA estimada do PIB por frações de capital.
 * As frações são ilustrativas para fins pedagógicos, não estatística oficial.
 */

export type FractionKey = 'produtivo' | 'financeiro' | 'comercial' | 'ficticio' | 'estatal'

export const FRACTION_META: Record<FractionKey, { label: string; color: string; desc: string }> = {
  produtivo: {
    label: 'Capital Produtivo',
    color: '#34d399',
    desc: 'Indústria, infraestrutura, agro, manufatura — passa por P.',
  },
  financeiro: {
    label: 'Capital Financeiro',
    color: '#fbbf24',
    desc: 'Bancos, fundos, capital portador de juros (M—M′).',
  },
  comercial: {
    label: 'Capital Comercial',
    color: '#38bdf8',
    desc: 'Trade, logística, varejo — realiza o valor em M—C—M.',
  },
  ficticio: {
    label: 'Capital Fictício',
    color: '#e879f9',
    desc: 'Ações, dívida pública, derivativos — direitos sobre renda futura.',
  },
  estatal: {
    label: 'Capital Estatal',
    color: '#f87171',
    desc: 'SOEs e infraestrutura pública — condições gerais da acumulação.',
  },
}

export interface Faction {
  name: string
  thesis: string
  firms: string[]
  color?: string
}

export interface IlaiseStats {
  /** Exército Industrial de Reserva (milhões de pessoas) */
  reservaMilhoes: number
  reservaPct: number
  desindustrializacao: { ano: number; pctIndustria: number }[]
  remessasLucros: string
}

/** PILAR 4 — Teoria Marxista da Dependência (Marini, dos Santos, Bambirra) */
export interface TmdStats {
  posicaoNaHierarquia: string
  superexploracao: string
  trocaDesigual: string
  vazaRendas: string
  gargaloCambial: string
}

export interface Country {
  id: string
  name: string
  code: string
  region: string
  /** PIB nominal, trilhões USD (aprox.) */
  gdpNominal: number
  /** PIB PPP, trilhões USD (aprox.) */
  gdpPPP: number
  profile: string
  /** participação % de cada fração no bloco interno (soma = 100) */
  fractions: Record<FractionKey, number>
  factions: Faction[]
  ilaese?: IlaiseStats
  tmd?: TmdStats
}

export const COUNTRIES: Country[] = [
  {
    id: 'usa',
    name: 'Estados Unidos',
    code: 'USA',
    region: 'América do Norte',
    gdpNominal: 32.38,
    gdpPPP: 32.38,
    profile: 'Finanças tecnológicas, complexo militar-industrial, dólar hegemônico.',
    fractions: { produtivo: 21, financeiro: 26, comercial: 19, ficticio: 24, estatal: 10 },
    factions: [
      {
        name: 'Bloco A — Neoliberal-Globalista',
        thesis: 'Globalização de cadeias, ESG, serviços de software; alinhado ao Partido Democrata.',
        firms: ['BlackRock', 'Vanguard', 'Microsoft', 'Apple'],
      },
      {
        name: 'Bloco B — Nacional-Industrial',
        thesis: 'Energia fóssil, reindustrialização doméstica, tarifas protecionistas; alinhado ao Partido Republicano.',
        firms: ['Chevron', 'Lockheed Martin', 'Real Estate', 'Agro do Rust Belt'],
      },
    ],
  },
  {
    id: 'eu',
    name: 'União Europeia',
    code: 'EU',
    region: 'Europa',
    gdpNominal: 23.03,
    gdpPPP: 28.5,
    profile: 'Indústria exportadora (Alemanha), serviços financeiros (França/Luxemburgo).',
    fractions: { produtivo: 30, financeiro: 24, comercial: 24, ficticio: 14, estatal: 8 },
    factions: [
      {
        name: 'Núcleo Exportador Germânico',
        thesis: 'Superávits comerciais via manufatura de capital; dependente de demanda externa e energia barata.',
        firms: ['Volkswagen', 'Siemens', 'BASF'],
      },
      {
        name: 'Complexo Franco-Parisiense de Serviços',
        thesis: 'Rentismo financeiro e farmacêutico; pressiona por integração de capitais (mercado único de capitais).',
        firms: ['BNP Paribas', 'LVMH', 'Airbus'],
      },
    ],
  },
  {
    id: 'china',
    name: 'China',
    code: 'CHN',
    region: 'Ásia Oriental',
    gdpNominal: 20.85,
    gdpPPP: 44.3,
    profile: 'Capital estatal de grande escala, manufatura de infraestrutura, tech de exportação.',
    fractions: { produtivo: 42, financeiro: 13, comercial: 17, ficticio: 5, estatal: 23 },
    factions: [
      {
        name: 'Bloco Estatal-SOE',
        thesis: 'Planejamento quinquenal, crédito dirigido, infraestrutura e energia; espinha dorsal do partido-Estado.',
        firms: ['State Grid', 'Sinopec', 'CRRC'],
      },
      {
        name: 'Tech Privado Costeiro',
        thesis: 'Plataformas e semicondutores sob tutela estatal; tensão entre inovação e controle político.',
        firms: ['Huawei', 'Alibaba', 'Tencent'],
      },
    ],
  },
  {
    id: 'india',
    name: 'Índia',
    code: 'IND',
    region: 'Ásia Meridional',
    gdpNominal: 4.15,
    gdpPPP: 18.9,
    profile: 'Serviços de TI, conglomerados industriais familiares, finanças nacionais.',
    fractions: { produtivo: 33, financeiro: 18, comercial: 27, ficticio: 12, estatal: 10 },
    factions: [
      {
        name: 'Conglomerados Familiares',
        thesis: 'Diversificação vertical (portos, energia, mídia); captura de política via proximidade com o Estado.',
        firms: ['Adani Group', 'Reliance', 'Tata'],
      },
      {
        name: 'Serviços Globais de TI',
        thesis: 'Exportação de trabalho qualificado barato (terceirização); integra-se ao circuito anglo-americano.',
        firms: ['TCS', 'Infosys', 'Wipro'],
      },
    ],
    tmd: {
      posicaoNaHierarquia: 'Periferia de serviços + agro · subcontratada do circuito anglo-americano',
      superexploracao:
        'Terceirização de TI paga engenheiros a fração do custo dos EUA; trabalho informal agrícola/urbano massivo abaixo do valor de reprodução.',
      trocaDesigual:
        'Exporta serviços intensivos em trabalho e commodities (arroz/açúcar/ferrocromo); importa capital tecnológico e defesa — déficit tecnológico estrutural com a China e o Ocidente.',
      vazaRendas:
        'Repatriação por matrizes de Big Techs/indústria + serviço da dívida externa drenam reservas acumuladas com esforço exportador.',
      gargaloCambial:
        'Rúpia pressionada em ciclos de Fed; reservas defendidas à custa de contenção salarial e importações essenciais.',
    },
  },
  {
    id: 'jpn',
    name: 'Japão',
    code: 'JPN',
    region: 'Ásia Oriental',
    gdpNominal: 4.18,
    gdpPPP: 6.84,
    profile: 'Keiretsu industriais, exportador de capital de bens, rearmamento gradual sob tutela dos EUA.',
    fractions: { produtivo: 38, financeiro: 22, comercial: 20, ficticio: 12, estatal: 8 },
    factions: [
      {
        name: 'Keiretsu Industriais',
        thesis: 'Conglomerados verticais exportadores (auto, eletrônica, robótica) com crédito cruzado entre empresas do grupo.',
        firms: ['Toyota', 'Sony', 'Mitsubishi'],
      },
      {
        name: 'Estado-desenvolvimentista & Defesa',
        thesis: 'Burocracia METI herdada + rearmamento acelerado (2% do PIB até 2027) alinhado à contenção da China.',
        firms: ['Mitsubishi Heavy', 'Kawasaki', 'METI'],
      },
    ],
  },
  {
    id: 'gbr',
    name: 'Reino Unido',
    code: 'GBR',
    region: 'Europa Ocidental',
    gdpNominal: 3.64,
    gdpPPP: 4.19,
    profile: 'City de Londres como praça financeira offshore global; fóssil do Mar do Norte em declínio; militarismo atlantista.',
    fractions: { produtivo: 17, financeiro: 34, comercial: 22, ficticio: 20, estatal: 7 },
    factions: [
      {
        name: 'City of London',
        thesis: 'Rentismo global: câmbio, derivativos, paraísos associados (ilhas britânicas); lobby contra regulação pós-Brexit.',
        firms: ['HSBC', 'Barclays', "Lloyd's"],
      },
      {
        name: 'Capital Fóssil & Defesa',
        thesis: 'BP/Shell + BAE: energia do Mar do Norte e exportação de armamento ancoram influência atlantista.',
        firms: ['BP', 'Shell', 'BAE Systems'],
      },
    ],
  },
  {
    id: 'kor',
    name: 'Coreia do Sul',
    code: 'KOR',
    region: 'Ásia Oriental',
    gdpNominal: 1.95,
    gdpPPP: 3.09,
    profile: 'Chaebols verticais (semicondutores, baterias, estaleiros); integrada e tensa entre EUA e China.',
    fractions: { produtivo: 45, financeiro: 16, comercial: 21, ficticio: 9, estatal: 9 },
    factions: [
      {
        name: 'Chaebols',
        thesis: 'Samsung/Hyundai/SK: conglomerados familiares com apoio estatal histórico e domínio de exportação.',
        firms: ['Samsung', 'Hyundai Motor', 'SK Group'],
      },
      {
        name: 'Bloco Semicondutores & Bateria',
        thesis: 'Memória/HBM e baterias de EV: refém das sanções americanas vs. demanda chinesa — pressão por alinhamento.',
        firms: ['Samsung Electronics', 'SK Hynix', 'LG Energy Solution'],
      },
    ],
  },
  {
    id: 'can',
    name: 'Canadá',
    code: 'CAN',
    region: 'América do Norte',
    gdpNominal: 2.33,
    gdpPPP: 2.67,
    profile: 'Extrativismo de recursos + financeiro-imobiliário; economia integrada aos EUA (USMCA).',
    fractions: { produtivo: 26, financeiro: 25, comercial: 22, ficticio: 17, estatal: 10 },
    factions: [
      {
        name: 'Capital de Recursos',
        thesis: 'Óleo sands, mineração e agroexportação: extrativismo com matrizes/mercado nos EUA.',
        firms: ['Suncor', 'Barrick Gold', 'Nutrien'],
      },
      {
        name: 'Financeiro-Imobiliário',
        thesis: 'Big Six banks + Brookfield: hipotecário/construção como principal motor do PIB não-petrolífero.',
        firms: ['RBC', 'TD Bank', 'Brookfield'],
      },
    ],
  },
  {
    id: 'aus',
    name: 'Austrália',
    code: 'AUS',
    region: 'Oceania',
    gdpNominal: 1.9,
    gdpPPP: 2.06,
    profile: 'Superpotência mineral: ferro/gás/LG alimentando a indústria chinesa sob guarda militar americana.',
    fractions: { produtivo: 28, financeiro: 24, comercial: 21, ficticio: 18, estatal: 9 },
    factions: [
      {
        name: 'Mineradoras',
        thesis: 'Ferro para a China = superávit estrutural; tensão diplomática nunca rompe o fluxo do minério.',
        firms: ['BHP', 'Rio Tinto', 'Fortescue'],
      },
      {
        name: 'Fóssil / LGN',
        thesis: 'Entre os maiores exportadores mundiais de gás liquefeito; lobby contra metas climáticas reais.',
        firms: ['Woodside', 'Santos', 'Glencore Coal'],
      },
    ],
  },
  {
    id: 'mex',
    name: 'México',
    code: 'MEX',
    region: 'América do Norte',
    gdpNominal: 1.86,
    gdpPPP: 3.24,
    profile: 'Plataforma maquiladora do nearshoring: manufatura de baixo custo para os EUA sob T-MEC.',
    fractions: { produtivo: 34, financeiro: 18, comercial: 27, ficticio: 10, estatal: 11 },
    factions: [
      {
        name: 'Maquiladoras / Nearshoring',
        thesis: 'Plantas automotivas-eletrônicas de matrizes estrangeiras: valor agregado local mínimo, salários comprimidos.',
        firms: ['GM México', 'Grupo México', 'CEMEX'],
      },
      {
        name: 'Telecom-Financeiro Concentrado',
        thesis: 'Monopólios privados herdados das privatizações capturam renda de infraestrutura e crédito ao consumo.',
        firms: ['América Móvil', 'Banorte', 'Grupo Financiero Inbursa'],
      },
    ],
    tmd: {
      posicaoNaHierarquia: 'Periferia manufatureira de plataforma · subcontratada do capital norte-americano (T-MEC)',
      superexploracao:
        'Salário manufatureiro ~1/8 do americano sustenta a "vantagem" do nearshoring; sindicatos de proteção patronal nas maquiladoras.',
      trocaDesigual:
        'Exporta montagem de baixo conteúdo nacional; importa insumos/máquinas dos EUA e alimentos básicos (milho) — soberania alimentar erodida pelo TLCAN.',
      vazaRendas:
        'Lucros de matrizes + remessas inversas de royalties; dívida externa corporativa dolarizada amplifica ciclos de Fed.',
      gargaloCambial:
        'Peso é dos mais voláteis dos emergentes: cada pânico financeiro derruba o câmbio e barateia o trabalho local em dólares.',
    },
  },
  {
    id: 'sau',
    name: 'Arábia Saudita',
    code: 'SAU',
    region: 'Oriente Médio',
    gdpNominal: 1.11,
    gdpPPP: 2.35,
    profile: 'Núcleo do petrodólar: Aramco + fundo soberano PIF reciclando renda petrolífera em ativos globais.',
    fractions: { produtivo: 32, financeiro: 20, comercial: 22, ficticio: 8, estatal: 18 },
    factions: [
      {
        name: 'Petrodólar Estatal (Aramco/PIF)',
        thesis: 'Monopólio petrolífico estatal + Public Investment Fund: compra de equipes, chips e infraestrutura global.',
        firms: ['Saudi Aramco', 'PIF', 'SABIC'],
      },
      {
        name: 'Holding Dinástico-Imobiliário',
        thesis: 'Megaprojetos (NEOM) e imobiliário do Golfo: absorção interna do excedente petrolífero.',
        firms: ['NEOM', 'Emaar Properties', 'Kingdom Holding'],
      },
    ],
  },
  {
    id: 'idn',
    name: 'Indonésia',
    code: 'IDN',
    region: 'Sudeste Asiático',
    gdpNominal: 1.43,
    gdpPPP: 4.66,
    profile: 'Membro BRICS+: níquel/carvão para a transição energética chinesa; downstream forçado por proibição de exportação bruta.',
    fractions: { produtivo: 41, financeiro: 16, comercial: 25, ficticio: 7, estatal: 11 },
    factions: [
      {
        name: 'Oligarquia Carvão-Níquel',
        thesis: 'Magnatas do carvão convertidos a níquel para baterias: joint ventures com capitais chineses em Halmahera/Sulawesi.',
        firms: ['Adaro Energy', 'Harita Nickel', 'Merdeka Copper'],
      },
      {
        name: 'Conglomerados Históricos',
        thesis: 'Grupos Salim/Sinar Mas: agronegócio, palm oil e mídia — ponte política com Pequim e Washington.',
        firms: ['Salim Group', 'Sinar Mas', 'Astra International'],
      },
    ],
    tmd: {
      posicaoNaHierarquia: 'Semi-periferia mineral da transição energética · níquel sob comando tecnológico chinês',
      superexploracao:
        'Mineração de níquel em ilhas: jornadas extensivas, acidentes crônicos e comunidades deslocadas para abastecer baterias "verdes".',
      trocaDesigual:
        'Exporta níquel-ferro ligado e carvão; importa equipamentos e tecnologia — o valor adicionado da cadeia EV fica fora.',
      vazaRendas:
        'Dividendos de JVs com capitais estrangeiros + serviço da dívida de projetos (project finance em USD).',
      gargaloCambial:
        'Rúpia indonésia sensível a saída de portfólio; BI defende reservas vendendo títulos e elevando juros contra o próprio crescimento.',
    },
  },
  {
    id: 'twn',
    name: 'Taiwan',
    code: 'TWN',
    region: 'Ásia Oriental',
    gdpNominal: 0.81,
    gdpPPP: 1.72,
    profile: 'O escudo de silício: ~90% dos semicondutores avançados do mundo sob disputa sino-americana.',
    fractions: { produtivo: 46, financeiro: 14, comercial: 22, ficticio: 10, estatal: 8 },
    factions: [
      {
        name: 'Complexo TSMC-Cêntrico',
        thesis: 'Foundry dominante como seguro existencial: "silício > tratados" — ninguém pode deixar a ilha quebrar.',
        firms: ['TSMC', 'MediaTek', 'ASE Technology'],
      },
      {
        name: 'Eletrônica de Montagem Exportadora',
        thesis: 'EMS/OEM (Foxconn!) organizando a linha de montagem global da Apple e demais marcas.',
        firms: ['Foxconn (Hon Hai)', 'Quanta', 'Compal'],
      },
    ],
  },
  {
    id: 'tur',
    name: 'Turquia',
    code: 'TUR',
    region: 'Eurásia / OTAN',
    gdpNominal: 1.32,
    gdpPPP: 3.57,
    profile: 'Construção + indústria média entre Europa e Ásia; lira cronicamente inflacionária.',
    fractions: { produtivo: 33, financeiro: 20, comercial: 26, ficticio: 10, estatal: 11 },
    factions: [
      {
        name: 'Conglomerados Construtivos',
        thesis: 'Koç/Sabancı: obras públicas, energia e autopeças exportando para a UE.',
        firms: ['Koç Holding', 'Sabancı', 'Şişecam'],
      },
      {
        name: 'Capital Protecionista Anatólio',
        thesis: 'PMIs anatolianos alinhados ao governo: contratos estatais, defesa (Baykar drones) e mercados muçulmanos.',
        firms: ['Baykar', 'Yıldız Holding', 'İhlas'],
      },
    ],
  },
  {
    id: 'zaf',
    name: 'África do Sul',
    code: 'ZAF',
    region: 'África Austral',
    gdpNominal: 0.38,
    gdpPPP: 0.98,
    profile: 'BRICS+ · complexo mineral-energético legado do apartheid; desemprego estrutural extremo.',
    fractions: { produtivo: 31, financeiro: 24, comercial: 22, ficticio: 11, estatal: 12 },
    factions: [
      {
        name: 'Mineral-Energy Complex',
        thesis: 'Platina, ouro e carvão: Anglo American/SASOL herdam infraestrutura segregacionista a serviço da exportação.',
        firms: ['Anglo American', 'SASOL', 'Sibanye-Stillwater'],
      },
      {
        name: 'Financeiro Anglófono',
        thesis: 'Bancos conectados a Londres/Johannesburgo administram a maior bolsa africana (JSE) e poupança regional.',
        firms: ['Standard Bank', 'Old Mutual', 'FirstRand'],
      },
    ],
    tmd: {
      posicaoNaHierarquia: 'Periferia mineral · complexo mineral-energético com superexploração histórica racializada',
      superexploracao:
        'Desemprego ~32% + migrantes mineiros precarizados: reserva laboral gigante comprime salários da mineração profunda.',
      trocaDesigual:
        'Exporta platina/ouro/carvão bruto; importa manufaturas e combustíveis refinados — falta de refino local é escolha de classe.',
      vazaRendas:
        'Matrizes duplas (Londres) remetem dividendos; Eskom/Electricidade cara subsidiada ao consumo das mineradoras.',
      gargaloCambial:
        'Rand como moeda emergente de alta beta: cada crise global derruba o câmbio e socializa perdas via inflação de importados.',
    },
  },
  {
    id: 'are',
    name: 'Emirados Árabes Unidos',
    code: 'ARE',
    region: 'Golfo Pérsico',
    gdpNominal: 0.56,
    gdpPPP: 0.83,
    profile: 'BRICS+ · hub de re-exportação, petróleo (ADNOC) e lavagem dourada de capitais entre Oriente e Ocidente.',
    fractions: { produtivo: 26, financeiro: 26, comercial: 30, ficticio: 9, estatal: 9 },
    factions: [
      {
        name: 'Holdings Estatais Energéticas-Logísticas',
        thesis: 'ADNOC + DP World + Emirates: controle do estreito de Hormuz ao comércio global de contêineres.',
        firms: ['ADNOC', 'DP World', 'Emirates Group'],
      },
      {
        name: 'Imobiliário-Financeiro Dubai',
        thesis: 'Free zones, ouro e cripto: interface de liquidez entre blocos sancionados e o sistema dólar.',
        firms: ['Emaar', 'DAMAC', 'Dubai Islamic Bank'],
      },
    ],
  },
  {
    id: 'irn',
    name: 'Irã',
    code: 'IRN',
    region: 'Ásia Ocidental',
    gdpNominal: 0.4,
    gdpPPP: 1.74,
    profile: 'BRICS+ · economia sob sanções totais: petróleo para a China via frota fantasma, redes estatais-paralelas.',
    fractions: { produtivo: 37, financeiro: 12, comercial: 25, ficticio: 5, estatal: 21 },
    factions: [
      {
        name: 'Fundações (Bonyads)',
        thesis: 'Conglomerados parafiscais-religiosos controlando importações e indústria pesada fora do orçamento público.',
        firms: ['Bonyad Mostazafan', 'Astadan Quds', 'EKTA'],
      },
      {
        name: 'Conglomerados da Guarda Revolucionária',
        thesis: 'IRGC: construção, petroquímica e contrabando de combustível — economia de guerra sob sanções.',
        firms: ['Khatam al-Anbiya', 'Sadra', 'Ghadir'],
      },
    ],
  },
  {
    id: 'russia',
    name: 'Rússia',
    code: 'RUS',
    region: 'Eurásia',
    gdpNominal: 2.66,
    gdpPPP: 7.53,
    profile: 'Commodities/energia estatal, complexo de defesa, mineração.',
    fractions: { produtivo: 36, financeiro: 14, comercial: 19, ficticio: 7, estatal: 24 },
    factions: [
      {
        name: 'Energia Estatal',
        thesis: 'Rendas petrolíferas como poder geopolítico; redirecionamento de fluxos da Europa para a Ásia.',
        firms: ['Gazprom', 'Rosneft', 'Transneft'],
      },
      {
        name: 'Complexo Defesa/Militar-Industrial',
        thesis: 'Produção bélica como locomotiva keynesiana de guerra; prioridade orçamentária em conflito.',
        firms: ['Rostec', 'Almaz-Antey', 'Uralvagonzavod'],
      },
    ],
  },
  {
    id: 'brasil',
    name: 'Brasil',
    code: 'BRA',
    region: 'América do Sul',
    gdpNominal: 2.64,
    gdpPPP: 5.23,
    profile: 'Agrotech exportador, finanças concentradas, extração energética (Petrobras).',
    fractions: { produtivo: 31, financeiro: 27, comercial: 17, ficticio: 11, estatal: 14 },
    factions: [
      {
        name: 'Bloco Agro-Exportador',
        thesis: 'Commodities para China/EUA; pressiona por baixa tributação da exportação e expansão de fronteira agrícola.',
        firms: ['JBS', 'Amaggi', 'Cosan'],
      },
      {
        name: 'Bloco Financeiro',
        thesis: 'Captura de renda via juros altos e rolagem da dívida pública (capital portador de juros M—M′).',
        firms: ['Itaú', 'Bradesco', 'BTG Pactual'],
      },
      {
        name: 'Bloco Estatal/Produtivo',
        thesis: 'Tensão entre privatização (atender ao financeiro) e investimento estratégico de longo prazo.',
        firms: ['Petrobras', 'Embraer', 'Base Industrial'],
      },
    ],
    ilaese: {
      reservaMilhoes: 92.1,
      reservaPct: 43.65,
      desindustrializacao: [
        { ano: 1985, pctIndustria: 27.0 },
        { ano: 2004, pctIndustria: 17.79 },
        { ano: 2020, pctIndustria: 11.3 },
      ],
      remessasLucros: 'R$ 195–294 bi/ano',
    },
    tmd: {
      posicaoNaHierarquia: 'Periferia extrativo-agro-exportadora · associada-subordinada ao imperialismo dolarizado',
      superexploracao:
        'Salários rebaixados + jornada/intensidade ampliadas compensam a troca desigual e sustentam a "competitividade" das commodities (Marini). Exército de reserva de 92,1 mi comprime v permanentemente.',
      trocaDesigual:
        'Exporta minério/grãos/proteína com valor agregado baixo; importa manufatura, fármacos e tecnologia precificadas pelo Centro (Prebisch–Singer). Reprimarização documentada: indústria 27% (1985) → 11,3% (2020) do PIB.',
      vazaRendas:
        'Remessas de lucros/dividendos R$ 195–294 bi/ano + royalties + serviço da dívida em divisa: o excedente interno financia a acumulação do Norte.',
      gargaloCambial:
        'Dependência de divisas para insumos críticos: ciclos de juros do Fed e fuga de capitais geram desvalorizações que barateiam salário real e facilitam aquisição de ativos locais pelo capital estrangeiro.',
    },
  },
]

export function getCountry(id: string | null): Country | null {
  return COUNTRIES.find((c) => c.id === id) ?? null
}

export function fmtTri(t: number): string {
  return `$${t.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tri`
}

type CountryLang = 'pt' | 'en' | 'es'
type FactionLocale = Pick<Faction, 'name' | 'thesis'>
type CountryLocale = Pick<Country, 'name' | 'region' | 'profile'> & {
  factions: FactionLocale[]
  tmd?: TmdStats
}

const COUNTRY_I18N: Record<string, Record<'en' | 'es', CountryLocale>> = {
  usa: {
    en: { name: 'United States', region: 'North America', profile: 'Technology finance, military-industrial complex and the hegemonic dollar.', factions: [
      { name: 'Bloc A — Neoliberal-Globalist', thesis: 'Globalized supply chains, ESG and software services; politically aligned with the Democratic Party.' },
      { name: 'Bloc B — National-Industrial', thesis: 'Fossil energy, domestic reindustrialization and protectionist tariffs; politically aligned with the Republican Party.' },
    ] },
    es: { name: 'Estados Unidos', region: 'América del Norte', profile: 'Finanzas tecnológicas, complejo militar-industrial y dólar hegemónico.', factions: [
      { name: 'Bloque A — Neoliberal-globalista', thesis: 'Cadenas globalizadas, ESG y servicios de software; alineamiento político con el Partido Demócrata.' },
      { name: 'Bloque B — Nacional-industrial', thesis: 'Energía fósil, reindustrialización doméstica y aranceles proteccionistas; alineamiento político con el Partido Republicano.' },
    ] },
  },
  eu: {
    en: { name: 'European Union', region: 'Europe', profile: 'Export manufacturing (Germany) and financial services (France/Luxembourg).', factions: [
      { name: 'German Export Core', thesis: 'Trade surpluses through capital-intensive manufacturing, dependent on external demand and relatively cheap energy.' },
      { name: 'Franco-Parisian Services Complex', thesis: 'Financial and pharmaceutical rentier interests pressing for deeper capital-market integration.' },
    ] },
    es: { name: 'Unión Europea', region: 'Europa', profile: 'Industria exportadora (Alemania) y servicios financieros (Francia/Luxemburgo).', factions: [
      { name: 'Núcleo exportador alemán', thesis: 'Superávits comerciales mediante manufactura intensiva en capital, dependiente de demanda externa y energía relativamente barata.' },
      { name: 'Complejo franco-parisino de servicios', thesis: 'Intereses rentistas financieros y farmacéuticos que presionan por una mayor integración de mercados de capital.' },
    ] },
  },
  china: {
    en: { name: 'China', region: 'East Asia', profile: 'Large-scale state capital, infrastructure manufacturing and export technology.', factions: [
      { name: 'State-SOE Bloc', thesis: 'Five-year planning, directed credit, infrastructure and energy form the backbone of the party-state economy.' },
      { name: 'Coastal Private Tech', thesis: 'Platforms and semiconductors operate under state oversight, balancing innovation with political control.' },
    ] },
    es: { name: 'China', region: 'Asia Oriental', profile: 'Capital estatal a gran escala, manufactura de infraestructura y tecnología exportadora.', factions: [
      { name: 'Bloque estatal-SOE', thesis: 'Planificación quinquenal, crédito dirigido, infraestructura y energía forman la columna vertebral de la economía partido-Estado.' },
      { name: 'Tecnología privada costera', thesis: 'Plataformas y semiconductores bajo supervisión estatal, con tensión entre innovación y control político.' },
    ] },
  },
  india: {
    en: { name: 'India', region: 'South Asia', profile: 'IT services, family industrial conglomerates and domestic finance.', factions: [
      { name: 'Family Conglomerates', thesis: 'Vertical diversification across ports, energy and media, with strong proximity to the state.' },
      { name: 'Global IT Services', thesis: 'Exports relatively low-cost skilled labor through outsourcing and integrates with Anglo-American corporate circuits.' },
    ], tmd: {
      posicaoNaHierarquia: 'Services + agrarian periphery · subcontracted into the Anglo-American circuit',
      superexploracao: 'IT outsourcing pays engineers a fraction of U.S. costs while massive informal agricultural and urban work remains below a fully secure reproduction standard.',
      trocaDesigual: 'Exports labor-intensive services and commodities while importing technology-intensive capital goods and defense equipment, leaving a structural technology gap with China and the West.',
      vazaRendas: 'Profit repatriation by foreign technology and industrial firms plus external-debt service drains reserves accumulated through exports.',
      gargaloCambial: 'The rupee is pressured during Fed tightening cycles; reserve defense can come at the cost of tighter domestic demand and essential imports.',
    } },
    es: { name: 'India', region: 'Asia Meridional', profile: 'Servicios de TI, conglomerados industriales familiares y finanzas domésticas.', factions: [
      { name: 'Conglomerados familiares', thesis: 'Diversificación vertical en puertos, energía y medios, con fuerte proximidad al Estado.' },
      { name: 'Servicios globales de TI', thesis: 'Exporta trabajo calificado de costo relativamente bajo mediante tercerización y se integra al circuito corporativo angloestadounidense.' },
    ], tmd: {
      posicaoNaHierarquia: 'Periferia de servicios + agro · subcontratada del circuito angloestadounidense',
      superexploracao: 'La tercerización de TI paga a ingenieros una fracción del costo estadounidense, mientras el trabajo informal agrícola y urbano masivo permanece por debajo de un estándar seguro de reproducción.',
      trocaDesigual: 'Exporta servicios intensivos en trabajo y commodities e importa bienes de capital tecnológicos y defensa, manteniendo una brecha tecnológica estructural con China y Occidente.',
      vazaRendas: 'La repatriación de ganancias de tecnológicas e industriales extranjeras y el servicio de deuda externa drenan reservas acumuladas mediante exportaciones.',
      gargaloCambial: 'La rupia sufre presión en ciclos de endurecimiento de la Fed; defender reservas puede exigir menor demanda doméstica y restricciones sobre importaciones esenciales.',
    } },
  },
  jpn: {
    en: { name: 'Japan', region: 'East Asia', profile: 'Industrial keiretsu, exporter of capital goods and gradual rearmament under the U.S. security umbrella.', factions: [
      { name: 'Industrial Keiretsu', thesis: 'Vertically linked export conglomerates in autos, electronics and robotics, supported by cross-shareholding and group finance.' },
      { name: 'Developmental State & Defense', thesis: 'Legacy METI bureaucracy plus accelerated rearmament aligned with China-containment strategy.' },
    ] },
    es: { name: 'Japón', region: 'Asia Oriental', profile: 'Keiretsu industriales, exportador de bienes de capital y rearme gradual bajo el paraguas de seguridad de EE. UU.', factions: [
      { name: 'Keiretsu industriales', thesis: 'Conglomerados exportadores integrados en autos, electrónica y robótica, apoyados por participaciones cruzadas y finanzas de grupo.' },
      { name: 'Estado desarrollista y defensa', thesis: 'Herencia burocrática del METI más rearme acelerado alineado con la estrategia de contención de China.' },
    ] },
  },
  gbr: {
    en: { name: 'United Kingdom', region: 'Western Europe', profile: 'The City of London as a global offshore financial center, declining North Sea fossil production and Atlanticist militarism.', factions: [
      { name: 'City of London', thesis: 'Global rentier finance across FX, derivatives and associated offshore jurisdictions, with strong lobbying against post-Brexit regulation.' },
      { name: 'Fossil Capital & Defense', thesis: 'BP/Shell and BAE connect North Sea energy and arms exports to Atlanticist geopolitical influence.' },
    ] },
    es: { name: 'Reino Unido', region: 'Europa Occidental', profile: 'La City de Londres como plaza financiera offshore global, fósiles del Mar del Norte en declive y militarismo atlantista.', factions: [
      { name: 'City of London', thesis: 'Finanzas rentistas globales en divisas, derivados y jurisdicciones offshore asociadas, con fuerte lobby contra regulación pos-Brexit.' },
      { name: 'Capital fósil y defensa', thesis: 'BP/Shell y BAE conectan energía del Mar del Norte y exportaciones de armas con influencia geopolítica atlantista.' },
    ] },
  },
  kor: {
    en: { name: 'South Korea', region: 'East Asia', profile: 'Vertically integrated chaebols in semiconductors, batteries and shipbuilding, economically tied to both the U.S. and China.', factions: [
      { name: 'Chaebols', thesis: 'Samsung, Hyundai and SK are family-controlled conglomerates built with historical state support and export dominance.' },
      { name: 'Semiconductors & Batteries Bloc', thesis: 'Memory/HBM and EV batteries face U.S. technology restrictions while remaining deeply exposed to Chinese demand.' },
    ] },
    es: { name: 'Corea del Sur', region: 'Asia Oriental', profile: 'Chaebols verticales en semiconductores, baterías y astilleros, vinculados económicamente tanto a EE. UU. como a China.', factions: [
      { name: 'Chaebols', thesis: 'Samsung, Hyundai y SK son conglomerados familiares construidos con apoyo estatal histórico y dominio exportador.' },
      { name: 'Bloque de semiconductores y baterías', thesis: 'Memoria/HBM y baterías de vehículos eléctricos enfrentan restricciones tecnológicas de EE. UU. y gran exposición a la demanda china.' },
    ] },
  },
  can: {
    en: { name: 'Canada', region: 'North America', profile: 'Resource extraction plus finance and real estate in an economy tightly integrated with the United States through USMCA.', factions: [
      { name: 'Resource Capital', thesis: 'Oil sands, mining and agribusiness are deeply linked to U.S. ownership structures and markets.' },
      { name: 'Finance & Real Estate', thesis: 'The Big Six banks and Brookfield connect mortgage finance and construction to a major non-oil growth engine.' },
    ] },
    es: { name: 'Canadá', region: 'América del Norte', profile: 'Extracción de recursos más finanzas e inmobiliario en una economía fuertemente integrada con EE. UU. por el T-MEC.', factions: [
      { name: 'Capital de recursos', thesis: 'Arenas petrolíferas, minería y agronegocio están profundamente vinculados a estructuras de propiedad y mercados estadounidenses.' },
      { name: 'Finanzas e inmobiliario', thesis: 'Los seis grandes bancos y Brookfield conectan hipotecas y construcción con un importante motor de crecimiento no petrolero.' },
    ] },
  },
  aus: {
    en: { name: 'Australia', region: 'Oceania', profile: 'Mineral superpower supplying iron ore and LNG to Chinese industry under a U.S.-centered security alliance.', factions: [
      { name: 'Mining Capital', thesis: 'Iron ore exports to China create structural surpluses that survive recurring diplomatic tensions.' },
      { name: 'Fossil / LNG Capital', thesis: 'One of the world’s largest LNG export sectors, with strong lobbying against stricter climate constraints.' },
    ] },
    es: { name: 'Australia', region: 'Oceanía', profile: 'Superpotencia mineral que suministra mineral de hierro y GNL a la industria china bajo una alianza de seguridad centrada en EE. UU.', factions: [
      { name: 'Capital minero', thesis: 'Las exportaciones de mineral de hierro a China generan superávits estructurales que sobreviven a tensiones diplomáticas recurrentes.' },
      { name: 'Capital fósil / GNL', thesis: 'Uno de los mayores sectores exportadores de GNL del mundo, con fuerte lobby contra restricciones climáticas más estrictas.' },
    ] },
  },
  mex: {
    en: { name: 'Mexico', region: 'North America', profile: 'Nearshoring maquila platform: lower-cost manufacturing for the U.S. market under USMCA.', factions: [
      { name: 'Maquiladoras / Nearshoring', thesis: 'Foreign-owned automotive and electronics plants combine low domestic value added with compressed wages.' },
      { name: 'Concentrated Telecom & Finance', thesis: 'Private monopolies inherited from privatization capture infrastructure rents and consumer-credit income.' },
    ], tmd: {
      posicaoNaHierarquia: 'Manufacturing-platform periphery · subcontracted to North American capital under USMCA',
      superexploracao: 'Manufacturing wages around one eighth of U.S. levels sustain part of the nearshoring cost advantage alongside historically employer-friendly labor relations.',
      trocaDesigual: 'Exports assembly with limited domestic content while importing machinery, inputs and basic foods, leaving technology and food-system dependence.',
      vazaRendas: 'Parent-company profits, royalties and dollarized corporate debt payments transmit income outward and amplify Fed cycles.',
      gargaloCambial: 'The peso can move sharply during global risk episodes, changing real wages in dollar terms and the price of imported inputs.',
    } },
    es: { name: 'México', region: 'América del Norte', profile: 'Plataforma maquiladora del nearshoring: manufactura de menor costo para el mercado estadounidense bajo el T-MEC.', factions: [
      { name: 'Maquiladoras / Nearshoring', thesis: 'Plantas automotrices y electrónicas de capital extranjero combinan bajo valor agregado doméstico con salarios comprimidos.' },
      { name: 'Telecom y finanzas concentradas', thesis: 'Monopolios privados heredados de las privatizaciones capturan rentas de infraestructura e ingresos de crédito al consumo.' },
    ], tmd: {
      posicaoNaHierarquia: 'Periferia de plataforma manufacturera · subcontratada del capital norteamericano bajo el T-MEC',
      superexploracao: 'Salarios manufactureros cercanos a una octava parte de los estadounidenses sostienen parte de la ventaja de costos del nearshoring junto con relaciones laborales históricamente favorables al empleador.',
      trocaDesigual: 'Exporta ensamblaje con contenido doméstico limitado e importa maquinaria, insumos y alimentos básicos, manteniendo dependencia tecnológica y alimentaria.',
      vazaRendas: 'Ganancias de matrices, regalías y pagos de deuda corporativa dolarizada trasladan renta hacia fuera y amplifican los ciclos de la Fed.',
      gargaloCambial: 'El peso puede moverse con fuerza en episodios globales de riesgo, modificando salarios reales en dólares y el precio de insumos importados.',
    } },
  },
  sau: {
    en: { name: 'Saudi Arabia', region: 'Middle East', profile: 'Petrodollar core: Aramco and the PIF recycle oil income into global assets.', factions: [
      { name: 'State Petrodollar Bloc (Aramco/PIF)', thesis: 'State oil monopoly plus the Public Investment Fund use hydrocarbon income to acquire technology, infrastructure and global assets.' },
      { name: 'Dynastic Real-Estate Holdings', thesis: 'Megaprojects and Gulf real estate absorb part of the oil surplus inside the region.' },
    ] },
    es: { name: 'Arabia Saudita', region: 'Oriente Medio', profile: 'Núcleo del petrodólar: Aramco y el PIF reciclan renta petrolera en activos globales.', factions: [
      { name: 'Bloque estatal del petrodólar (Aramco/PIF)', thesis: 'El monopolio petrolero estatal y el Public Investment Fund usan renta de hidrocarburos para adquirir tecnología, infraestructura y activos globales.' },
      { name: 'Holdings dinásticos inmobiliarios', thesis: 'Megaproyectos e inmobiliario del Golfo absorben internamente parte del excedente petrolero.' },
    ] },
  },
  idn: {
    en: { name: 'Indonesia', region: 'Southeast Asia', profile: 'BRICS+ member using nickel and coal to enter China-centered energy-transition chains through domestic-processing requirements.', factions: [
      { name: 'Coal-Nickel Oligarchy', thesis: 'Coal magnates moved into battery nickel through joint ventures with Chinese capital in Halmahera and Sulawesi.' },
      { name: 'Historic Conglomerates', thesis: 'Salim and Sinar Mas groups span agribusiness, palm oil and media, bridging political ties with Beijing and Washington.' },
    ], tmd: {
      posicaoNaHierarquia: 'Mineral semi-periphery of the energy transition · nickel under Chinese technological leadership',
      superexploracao: 'Nickel mining and processing on island sites combines long shifts, chronic accidents and displaced communities in supply chains marketed as green.',
      trocaDesigual: 'Exports processed nickel and coal while importing equipment and technology, leaving higher-value EV-chain knowledge outside the country.',
      vazaRendas: 'Dividends from foreign joint ventures and project-finance debt service move part of the generated surplus abroad.',
      gargaloCambial: 'The rupiah is sensitive to portfolio outflows; defending reserves can require bond sales and higher interest rates that slow domestic growth.',
    } },
    es: { name: 'Indonesia', region: 'Sudeste Asiático', profile: 'Miembro BRICS+ que usa níquel y carbón para entrar en cadenas de transición energética centradas en China mediante requisitos de procesamiento doméstico.', factions: [
      { name: 'Oligarquía carbón-níquel', thesis: 'Magnates del carbón pasaron al níquel para baterías mediante joint ventures con capital chino en Halmahera y Sulawesi.' },
      { name: 'Conglomerados históricos', thesis: 'Los grupos Salim y Sinar Mas abarcan agronegocio, aceite de palma y medios, conectando relaciones políticas con Pekín y Washington.' },
    ], tmd: {
      posicaoNaHierarquia: 'Semiperiferia mineral de la transición energética · níquel bajo liderazgo tecnológico chino',
      superexploracao: 'La minería y el procesamiento de níquel en islas combinan jornadas largas, accidentes crónicos y comunidades desplazadas en cadenas comercializadas como verdes.',
      trocaDesigual: 'Exporta níquel procesado y carbón e importa equipos y tecnología, dejando fuera del país conocimiento de mayor valor de la cadena EV.',
      vazaRendas: 'Dividendos de joint ventures extranjeras y servicio de deuda de project finance trasladan al exterior parte del excedente generado.',
      gargaloCambial: 'La rupia es sensible a salidas de cartera; defender reservas puede exigir ventas de bonos y tasas más altas que frenan el crecimiento doméstico.',
    } },
  },
  twn: {
    en: { name: 'Taiwan', region: 'East Asia', profile: 'The silicon shield: roughly 90% of the world’s leading-edge logic chips are tied to a territory at the center of U.S.-China rivalry.', factions: [
      { name: 'TSMC-Centered Complex', thesis: 'The dominant foundry acts as an existential strategic asset: global supply chains cannot easily absorb disruption on the island.' },
      { name: 'Export Electronics Assembly', thesis: 'EMS/OEM groups such as Foxconn organize major parts of the global assembly chain for Apple and other brands.' },
    ] },
    es: { name: 'Taiwán', region: 'Asia Oriental', profile: 'El escudo de silicio: cerca del 90% de la lógica de vanguardia mundial está vinculada a un territorio en el centro de la rivalidad EE. UU.-China.', factions: [
      { name: 'Complejo centrado en TSMC', thesis: 'La foundry dominante funciona como activo estratégico existencial: las cadenas globales no pueden absorber fácilmente una interrupción en la isla.' },
      { name: 'Ensamblaje electrónico exportador', thesis: 'Grupos EMS/OEM como Foxconn organizan grandes partes de la cadena global de ensamblaje de Apple y otras marcas.' },
    ] },
  },
  tur: {
    en: { name: 'Türkiye', region: 'Eurasia / NATO', profile: 'Construction and mid-tech industry between Europe and Asia, with a chronically inflationary lira.', factions: [
      { name: 'Construction Conglomerates', thesis: 'Koç and Sabancı link public works, energy and auto parts to EU export markets.' },
      { name: 'Anatolian Protectionist Capital', thesis: 'Government-aligned Anatolian firms combine state contracts, defense production and markets across Muslim-majority economies.' },
    ] },
    es: { name: 'Turquía', region: 'Eurasia / OTAN', profile: 'Construcción e industria de tecnología media entre Europa y Asia, con una lira crónicamente inflacionaria.', factions: [
      { name: 'Conglomerados de construcción', thesis: 'Koç y Sabancı vinculan obras públicas, energía y autopartes con mercados de exportación de la UE.' },
      { name: 'Capital proteccionista anatolio', thesis: 'Empresas anatolias alineadas con el gobierno combinan contratos estatales, producción de defensa y mercados en economías de mayoría musulmana.' },
    ] },
  },
  zaf: {
    en: { name: 'South Africa', region: 'Southern Africa', profile: 'BRICS+ · mineral-energy complex inherited from apartheid and extremely high structural unemployment.', factions: [
      { name: 'Mineral-Energy Complex', thesis: 'Platinum, gold and coal groups inherited infrastructure built around segregated extraction and export.' },
      { name: 'Anglophone Finance', thesis: 'Banks linked to London and Johannesburg manage the continent’s largest stock exchange and regional savings.' },
    ], tmd: {
      posicaoNaHierarquia: 'Mineral periphery · mineral-energy complex with historically racialized super-exploitation',
      superexploracao: 'Very high unemployment and precarious migrant mine labor create a large reserve workforce that weakens wage bargaining in deep mining.',
      trocaDesigual: 'Exports raw platinum, gold and coal while importing manufactures and refined fuels, leaving limited domestic processing.',
      vazaRendas: 'Cross-listed parent companies remit dividends while high domestic energy costs and infrastructure burdens are socialized unevenly.',
      gargaloCambial: 'The rand behaves as a high-beta emerging-market currency: global shocks can quickly pass into depreciation and imported inflation.',
    } },
    es: { name: 'Sudáfrica', region: 'África Austral', profile: 'BRICS+ · complejo mineral-energético heredado del apartheid y desempleo estructural extremadamente alto.', factions: [
      { name: 'Complejo mineral-energético', thesis: 'Grupos de platino, oro y carbón heredaron infraestructura organizada alrededor de extracción segregada y exportación.' },
      { name: 'Finanzas anglófonas', thesis: 'Bancos vinculados a Londres y Johannesburgo administran la mayor bolsa del continente y ahorro regional.' },
    ], tmd: {
      posicaoNaHierarquia: 'Periferia mineral · complejo mineral-energético con superexplotación históricamente racializada',
      superexploracao: 'El desempleo muy alto y el trabajo minero migrante precario crean una gran reserva laboral que debilita la negociación salarial en la minería profunda.',
      trocaDesigual: 'Exporta platino, oro y carbón en bruto e importa manufacturas y combustibles refinados, con procesamiento doméstico limitado.',
      vazaRendas: 'Matrices con cotización cruzada remiten dividendos mientras costos energéticos e infraestructura se socializan de manera desigual.',
      gargaloCambial: 'El rand funciona como moneda emergente de beta alta: shocks globales pueden transformarse rápidamente en depreciación e inflación importada.',
    } },
  },
  are: {
    en: { name: 'United Arab Emirates', region: 'Persian Gulf', profile: 'BRICS+ · re-export hub, ADNOC oil and a financial bridge between sanctioned and Western-centered capital circuits.', factions: [
      { name: 'State Energy-Logistics Holdings', thesis: 'ADNOC, DP World and Emirates connect energy, ports, aviation and container trade from Hormuz to global markets.' },
      { name: 'Dubai Real Estate & Finance', thesis: 'Free zones, gold and crypto create a liquidity interface between sanctioned blocs and the dollar system.' },
    ] },
    es: { name: 'Emiratos Árabes Unidos', region: 'Golfo Pérsico', profile: 'BRICS+ · hub de reexportación, petróleo de ADNOC y puente financiero entre circuitos sancionados y capital centrado en Occidente.', factions: [
      { name: 'Holdings estatales de energía y logística', thesis: 'ADNOC, DP World y Emirates conectan energía, puertos, aviación y comercio de contenedores desde Ormuz hasta mercados globales.' },
      { name: 'Inmobiliario y finanzas de Dubái', thesis: 'Zonas francas, oro y cripto crean una interfaz de liquidez entre bloques sancionados y el sistema del dólar.' },
    ] },
  },
  irn: {
    en: { name: 'Iran', region: 'West Asia', profile: 'BRICS+ · heavily sanctioned economy selling oil to China through shadow fleets and parallel state-linked networks.', factions: [
      { name: 'Foundations (Bonyads)', thesis: 'Parafiscal-religious conglomerates control imports and heavy industry outside ordinary public-budget channels.' },
      { name: 'Revolutionary Guard Conglomerates', thesis: 'IRGC-linked groups operate in construction, petrochemicals and fuel trade under a sanctions-driven war economy.' },
    ] },
    es: { name: 'Irán', region: 'Asia Occidental', profile: 'BRICS+ · economía fuertemente sancionada que vende petróleo a China mediante flotas fantasma y redes paralelas vinculadas al Estado.', factions: [
      { name: 'Fundaciones (Bonyads)', thesis: 'Conglomerados parafiscales-religiosos controlan importaciones e industria pesada fuera de los canales presupuestarios ordinarios.' },
      { name: 'Conglomerados de la Guardia Revolucionaria', thesis: 'Grupos ligados al IRGC operan en construcción, petroquímica y comercio de combustibles bajo una economía de guerra condicionada por sanciones.' },
    ] },
  },
  russia: {
    en: { name: 'Russia', region: 'Eurasia', profile: 'State-centered commodities and energy, defense industry and mining.', factions: [
      { name: 'State Energy', thesis: 'Oil and gas rents are used as geopolitical power while flows are redirected from Europe toward Asia.' },
      { name: 'Defense / Military-Industrial Complex', thesis: 'War production acts as a major demand engine and receives budget priority during conflict.' },
    ] },
    es: { name: 'Rusia', region: 'Eurasia', profile: 'Commodities y energía centradas en el Estado, industria de defensa y minería.', factions: [
      { name: 'Energía estatal', thesis: 'Las rentas de petróleo y gas se usan como poder geopolítico mientras los flujos se redirigen de Europa hacia Asia.' },
      { name: 'Complejo de defensa / militar-industrial', thesis: 'La producción bélica funciona como gran motor de demanda y recibe prioridad presupuestaria durante el conflicto.' },
    ] },
  },
  brasil: {
    en: { name: 'Brazil', region: 'South America', profile: 'Export-oriented agritech, concentrated finance and energy extraction led by Petrobras.', factions: [
      { name: 'Agro-Export Bloc', thesis: 'Commodity exports to China and the U.S.; pushes for low export taxation and expansion of the agricultural frontier.' },
      { name: 'Financial Bloc', thesis: 'Captures income through high interest rates and public-debt rollover, strengthening interest-bearing capital.' },
      { name: 'State / Productive Bloc', thesis: 'Tension between privatization pressures and long-term strategic investment through state-linked productive capacity.' },
    ], tmd: {
      posicaoNaHierarquia: 'Extractive-agro-export periphery · associated and subordinated to dollar-centered imperial power',
      superexploracao: 'Lower wages plus longer or more intense work compensate for unequal exchange and sustain commodity competitiveness. A reserve workforce of 92.1 million weakens labor bargaining power in this dataset.',
      trocaDesigual: 'Exports low-value-added ore, grains and protein while importing manufactures, pharmaceuticals and technology. Industrial share fell from 27% (1985) to 11.3% (2020) of GDP in the series used here.',
      vazaRendas: 'Profit and dividend remittances of R$195–294 bn/year plus royalties and foreign-currency debt service move domestically generated surplus abroad.',
      gargaloCambial: 'Dependence on foreign currency for critical imports means Fed cycles and capital flight can drive depreciation, reduce real wages and cheapen local assets in foreign-currency terms.',
    } },
    es: { name: 'Brasil', region: 'América del Sur', profile: 'Agrotecnología exportadora, finanzas concentradas y extracción energética liderada por Petrobras.', factions: [
      { name: 'Bloque agroexportador', thesis: 'Exporta commodities a China y EE. UU.; presiona por baja tributación de exportaciones y expansión de la frontera agrícola.' },
      { name: 'Bloque financiero', thesis: 'Captura renta mediante tasas altas y refinanciamiento de la deuda pública, fortaleciendo el capital portador de interés.' },
      { name: 'Bloque estatal / productivo', thesis: 'Tensión entre presiones privatizadoras e inversión estratégica de largo plazo mediante capacidad productiva vinculada al Estado.' },
    ], tmd: {
      posicaoNaHierarquia: 'Periferia extractivo-agroexportadora · asociada y subordinada al poder imperial centrado en el dólar',
      superexploracao: 'Salarios menores junto con jornadas más largas o intensas compensan el intercambio desigual y sostienen competitividad de commodities. Una reserva laboral de 92,1 millones debilita el poder de negociación del trabajo en este conjunto de datos.',
      trocaDesigual: 'Exporta mineral, granos y proteína de bajo valor agregado e importa manufacturas, fármacos y tecnología. La participación industrial cayó de 27% (1985) a 11,3% (2020) del PIB en la serie usada aquí.',
      vazaRendas: 'Remesas de ganancias y dividendos de R$195–294 mil M/año más regalías y servicio de deuda en divisas trasladan al exterior excedente generado internamente.',
      gargaloCambial: 'La dependencia de divisas para importaciones críticas hace que ciclos de la Fed y fuga de capitales puedan provocar depreciación, reducir salarios reales y abaratar activos locales medidos en moneda extranjera.',
    } },
  },
}

const FRACTION_I18N: Record<FractionKey, Record<'en' | 'es', { label: string; desc: string; simpleLabel: string; simpleDesc: string }>> = {
  produtivo: {
    en: { label: 'Productive Capital', desc: 'Industry, infrastructure, agriculture and manufacturing — passes through P.', simpleLabel: 'Factories and machinery', simpleDesc: 'Companies that make goods, build infrastructure and produce food.' },
    es: { label: 'Capital productivo', desc: 'Industria, infraestructura, agro y manufactura — pasa por P.', simpleLabel: 'Fábricas y máquinas', simpleDesc: 'Empresas que producen bienes, construyen infraestructura y producen alimentos.' },
  },
  financeiro: {
    en: { label: 'Financial Capital', desc: 'Banks, funds and interest-bearing capital (M—M′).', simpleLabel: 'Banks and interest', simpleDesc: 'Banks, funds, loans and investments that earn financial income.' },
    es: { label: 'Capital financiero', desc: 'Bancos, fondos y capital portador de interés (M—M′).', simpleLabel: 'Bancos e intereses', simpleDesc: 'Bancos, fondos, préstamos e inversiones que reciben renta financiera.' },
  },
  comercial: {
    en: { label: 'Commercial Capital', desc: 'Trade, logistics and retail — realizes value in M—C—M.', simpleLabel: 'Stores and trade', simpleDesc: 'Retail, logistics and foreign trade that move and sell goods.' },
    es: { label: 'Capital comercial', desc: 'Comercio, logística y minoristas — realiza valor en M—C—M.', simpleLabel: 'Tiendas y comercio', simpleDesc: 'Venta, logística y comercio exterior que mueven y venden bienes.' },
  },
  ficticio: {
    en: { label: 'Fictitious Capital', desc: 'Stocks, public debt and derivatives — claims on future income.', simpleLabel: 'Claims on future gains', simpleDesc: 'Financial assets whose price depends on income expected in the future.' },
    es: { label: 'Capital ficticio', desc: 'Acciones, deuda pública y derivados — derechos sobre renta futura.', simpleLabel: 'Derechos sobre ganancias futuras', simpleDesc: 'Activos financieros cuyo precio depende de ingresos esperados en el futuro.' },
  },
  estatal: {
    en: { label: 'State Capital', desc: 'SOEs and public infrastructure — general conditions for accumulation.', simpleLabel: 'Government and public companies', simpleDesc: 'Public companies and infrastructure funded or controlled by the state.' },
    es: { label: 'Capital estatal', desc: 'Empresas estatales e infraestructura pública — condiciones generales de acumulación.', simpleLabel: 'Gobierno y empresas públicas', simpleDesc: 'Empresas públicas e infraestructura financiada o controlada por el Estado.' },
  },
}

export function fractionMetaForLang(key: FractionKey, lang: CountryLang, simple = false) {
  const base = FRACTION_META[key]
  if (lang === 'pt') return base
  const locale = FRACTION_I18N[key][lang]
  return { ...base, label: simple ? locale.simpleLabel : locale.label, desc: simple ? locale.simpleDesc : locale.desc }
}

export function countryForLang(country: Country, lang: CountryLang): Country {
  if (lang === 'pt') return country
  const locale = COUNTRY_I18N[country.id]?.[lang]
  if (!locale) return country
  return {
    ...country,
    name: locale.name,
    region: locale.region,
    profile: locale.profile,
    factions: country.factions.map((faction, index) => ({ ...faction, ...(locale.factions[index] ?? {}) })),
    tmd: country.tmd && locale.tmd ? { ...country.tmd, ...locale.tmd } : country.tmd,
    ilaese: country.ilaese
      ? { ...country.ilaese, remessasLucros: lang === 'en' ? 'R$ 195–294 bn/year' : 'R$ 195–294 mil M/año' }
      : undefined,
  }
}

export function countriesForLang(lang: CountryLang): Country[] {
  if (lang === 'pt') return COUNTRIES
  return COUNTRIES.map((country) => countryForLang(country, lang))
}

export function fmtTriLang(t: number, lang: CountryLang): string {
  if (lang === 'pt') return fmtTri(t)
  const locale = lang === 'en' ? 'en-US' : 'es-ES'
  const suffix = lang === 'en' ? 'tn' : 'bill.'
  return `$${t.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${suffix}`
}
