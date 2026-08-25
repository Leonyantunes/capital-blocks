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
