/**
 * TOUR COMPARTILHADO 2D ⇄ 3D — "Como o capitalismo funciona".
 * As MESMAS paradas nos dois mapas; só a apresentação do card muda:
 * - modo didático: narrativa suave + 2–3 números grandes e diretos
 * - modo avançado: texto denso completo (o padrão anterior do tour)
 * Linguagem didática suave, ideologia pouco explícita; os dados demonstram.
 * Valores anuais aproximados (2024) — mesma base dos fluxos.
 *
 * As referências a módulos no texto usam `modRef()` de `data/modules.ts` —
 * renumerar um módulo reflete em todos os cards de tour automaticamente.
 */

import { modNum, modRef } from './modules'

export interface TourStat {
  v: string
  k: string
  /** ids canônicos de `data/sources.ts` que sustentam esta estatística */
  sourceIds: string[]
}

export interface TourQuiz {
  pergunta: [pt: string, en: string, es: string]
  opcoes: [pt: string, en: string, es: string][]
  correta: number
  explicacao: [pt: string, en: string, es: string]
}

export interface TourStop {
  id: string
  chapter: string
  titulo: string
  lng: number
  lat: number
  /** zoom do mapa 2D (o 3D deriva a distância da câmera via distFromK) */
  k: number
  /** override da distância da câmera 3D (opcional; padrão = distFromK(k)) */
  dist?: number
  flowId?: string
  conflict?: 'semis' | 'energia' | 'reprimaria'
  layer?: 'deaths' | 'wages'
  /** ISOs destacados, SOMADOS às pontas do fluxo do flowId (ver stopIsos) */
  isos?: string[]
  /** narrativa didática (suave, poucos dados no texto) */
  did: string
  /** versão opcional curada para fundamental / início do ensino médio */
  simples?: string
  /** números pontuais do card didático */
  didStats: TourStat[]
  /** versão avançada (densa, completa) */
  adv: string
  dica?: string
  bncc?: string[]
  perguntaDebate?: string
  lenteSugerida?: 'geografia' | 'historia' | 'economia'
  quiz?: TourQuiz
}

/**
 * k (zoom do 2D) → distância da câmera no 3D — FONTE ÚNICA de paridade entre
 * os mapas. k=1.3 (visão mundial) → ~4.0 · k=2.2 (região) → ~3.0 · k=3.2
 * (país de perto) → ~1.9. Paradas de tour novo não precisam definir dist.
 */
export const distFromK = (k: number): number => Math.min(4.6, Math.max(1.7, 5.4 - 1.1 * k))

export const TOUR_STOPS: TourStop[] = [
  {
    id: 'tabuleiro',
    chapter: 'Abertura',
    titulo: 'O tabuleiro',
    lng: -15, lat: 15, k: 1.3,
    did: 'Este é o tabuleiro da economia global — e cada linha é riqueza em movimento. Nas próximas paradas, vamos seguir esse dinheiro pelo mundo: de onde ele sai, quem transforma, para onde vai o lucro — e quem paga a conta.',
    simples: 'Este mapa mostra como dinheiro, produtos e trabalho circulam entre países. Siga as linhas para ver quem produz, quem vende e quem fica com a maior parte do dinheiro.',
    didStats: [
      { v: '28', k: 'paradas neste tour', sourceIds: ['fluxos-tiers'] },
      { v: '6', k: 'tipos de fluxo', sourceIds: ['fluxos-tiers'] },
      { v: '49', k: 'rotas desenhadas', sourceIds: ['fluxos-tiers'] },
    ],
    adv: 'Sistema-mundo (Wallerstein): as rotas desenham a divisão internacional do trabalho — primário periférico, manufatura asiática, rentismo do centro. Cada camada do mapa é um canal da acumulação (Pilares 1 e 4).',
    dica: 'use os botões de camada para ligar/desligar cada tipo de fluxo',
  },
  {
    id: 'origem',
    chapter: 'Cap. 1 · De onde sai',
    titulo: 'Tudo começa na terra',
    lng: -35, lat: -12, k: 2.3, flowId: 'com-bra-chn',
    did: 'Tudo começa com alguém plantando e cavando. A linha azul leva soja, minério e petróleo do Brasil para a China — a maior rota de matérias-primas do planeta. Repare: junto com cada saca e cada tonelada viajam horas de trabalho, vendidas barato.',
    simples: 'O Brasil vende muita soja, minério e petróleo para a China. Vamos seguir essa rota para ver quanto dinheiro ela movimenta e quem ganha em cada etapa.',
    didStats: [
      { v: 'US$ 95 bi', k: 'por ano, Brasil → China', sourceIds: ['comex-mdic', 'alfandegas-estatisticas-nacionais'] },
      { v: '1 em 4', k: 'dólares do Brasil vêm da China', sourceIds: ['comex-mdic', 'alfandegas-estatisticas-nacionais'] },
      { v: '70 mi t', k: 'de soja por ano', sourceIds: ['comex-mdic', 'alfandegas-estatisticas-nacionais'] },
    ],
    adv: 'Primarização (TMD): o Sul exporta trabalho incorporado e natureza a preços declinantes (Prebisch–Singer); o processamento e a marca ficam no centro. A China hoje é o centro fabril — a periferia trocou de cliente, não de função.',
    dica: 'clique na linha azul para abrir os itens e valores',
  },
  {
    id: 'farmacia',
    chapter: 'Cap. 1 · De onde sai',
    titulo: 'A farmácia do Sul',
    lng: 60, lat: 25, k: 2.0, flowId: 'com-ind-eu',
    did: 'Nem toda riqueza do Sul é minério: a Índia faz 1 em cada 5 remédios genéricos do planeta — os comprimidos baratos que abastecem postos de saúde na África, no Brasil e na Europa. E ainda refina petróleo barato e revende como diesel. Quem produz o essencial, cobra pouco por ele.',
    simples: 'A Índia fabrica muitos remédios genéricos usados no mundo todo. Ela também compra petróleo, refina e vende combustível para outros países.',
    didStats: [
      { v: '20%', k: 'dos genéricos do mundo', sourceIds: ['alfandegas-estatisticas-nacionais', 'unctad'] },
      { v: '≈ US$ 55 bi', k: 'por ano, Índia → Europa', sourceIds: ['alfandegas-estatisticas-nacionais', 'unctad'] },
    ],
    adv: 'Genéricos (≈20% do volume global) + arbitragem de refino (Urals→diesel em Jamnagar): o Sul fornece bens essenciais e energia processada com margens comprimidas — dependência com verniz industrial.',
    dica: 'a rota azul-escura também leva diesel refinado',
  },
  {
    id: 'mina',
    chapter: 'Cap. 1 · De onde sai',
    titulo: 'O metal dentro do seu bolso',
    lng: 23, lat: -2, k: 2.6, flowId: 'det-cod-chn',
    did: 'O celular no seu bolso e o carro elétrico da vitrine têm um pedaço do Congo: de lá sai a maior parte do cobalto do mundo, o metal das baterias. Uma parte é tirada à mão, em garimpo — inclusive por crianças. A "transição verde" de fora começa aqui.',
    simples: 'Grande parte do cobalto usado em baterias vem do Congo. Esse metal está em celulares e carros elétricos, e parte da extração acontece em condições muito ruins.',
    didStats: [
      { v: '~70%', k: 'do cobalto mundial é congolês', sourceIds: ['unctad', 'alfandegas-estatisticas-nacionais'] },
      { v: 'baterias', k: 'de celular e carro elétrico', sourceIds: ['unctad', 'alfandegas-estatisticas-nacionais'] },
    ],
    adv: 'Cobalto (CMOC/Glencore + garimpo): ~70% global; refino chinês >75% — a cadeia das baterias repete o enclave extrativo colonial com nova suserania e processamento mínimo local.',
    dica: 'afaste e aproxime o zoom: rotas regionais aparecem no zoom',
  },
  {
    id: 'fabrica',
    chapter: 'Cap. 2 · Quem transforma',
    titulo: 'A fábrica do mundo',
    lng: 150, lat: 40, k: 1.9, flowId: 'man-chn-usa',
    did: 'A matéria-prima vira produto aqui. A linha rosa cruza o Pacífico com iPhones, notebooks e TVs montados na China. Mas quem desenha a marca fica com a maior fatia: de cada iPhone, cerca de 60% do valor fica com a empresa americana — não com a fábrica.',
    simples: 'Muitos eletrônicos usados nos EUA são montados na China. A fábrica faz o produto, mas a empresa dona da marca costuma ficar com uma parte grande do valor.',
    didStats: [
      { v: 'US$ 440 bi', k: 'por ano, China → EUA', sourceIds: ['alfandegas-estatisticas-nacionais', 'relatorios-anuais-empresas'] },
      { v: '~60%', k: 'de cada iPhone fica com a marca', sourceIds: ['alfandegas-estatisticas-nacionais', 'relatorios-anuais-empresas'] },
    ],
    adv: 'GVC (cadeias globais de valor): captura de margem pelo detentor da marca/IP; o déficit bilateral estrutura a guerra tecnológica — montar não é o mesmo que mandar.',
    dica: `veja o ${modRef('companies')} para o Raio-X das empresas da rota`,
    quiz: {
      pergunta: [
        'Na cadeia global de um smartphone montado na Ásia, quem retém a maior parcela do valor final?',
        'In the global value chain of an Asia-assembled smartphone, who captures the largest share of final value?',
        'En la cadena global de un smartphone ensamblado en Asia, ¿quién retiene la mayor parte del valor final?',
      ],
      opcoes: [
        [
          'A montadora asiática encarregada das linhas de produção física',
          'The Asian contract manufacturer operating physical assembly lines',
          'El fabricante asiático que opera las líneas de montaje físico',
        ],
        [
          'A corporação transnacional detentora de patentes, design e marca',
          'The transnational corporation owning patents, design, and brand IP',
          'La corporación transnacional dueña de patentes, diseño y marca',
        ],
        [
          'Os mineradores artesanais que extraem o cobalto e o lítio brutos',
          'Artisanal miners extracting raw cobalt and lithium',
          'Los mineros artesanales que extraen el cobalto y litio brutos',
        ],
      ],
      correta: 1,
      explicacao: [
        'Estudos de decomposição de valor (Kraemer et al.; UNCTAD) mostram que cerca de 58% a 60% do preço de varejo vai para propriedade intelectual, lucro e marketing no centro, enquanto a montagem física na periferia/semiperiferia retém menos de 5%.',
        'Empirical value chain studies (Kraemer et al.; UNCTAD) show that 58% to 60% of retail price is captured as IP, profit, and brand margin in the core, while assembly in the periphery/semi-periphery retains under 5%.',
        'Estudios de descomposición de valor (Kraemer et al.; UNCTAD) demuestran que cerca del 58% al 60% del precio final va a propiedad intelectual, beneficios y marketing en el centro, mientras el montaje en la periferia retiene menos del 5%.',
      ],
    },
  },
  {
    id: 'fabrica-muda',
    chapter: 'Cap. 2 · Quem transforma',
    titulo: 'A fábrica muda de endereço',
    lng: 108, lat: 16, k: 2.4, flowId: 'det-vnm-usa',
    did: 'Quando a disputa comercial aperta, as fábricas não voltam para os salários altos — elas se mudam para salários ainda menores. Foi assim com o Vietnã: metade dos celulares Galaxy e dos tênis Nike hoje sai de lá. O modelo é o mesmo; só o endereço é novo.',
    simples: 'Quando produzir na China fica mais caro ou difícil, algumas empresas levam fábricas para países como o Vietnã. O lugar muda, mas a busca por custos menores continua.',
    didStats: [
      { v: '~50%', k: 'dos Galaxy e dos Nike vêm do Vietnã', sourceIds: ['alfandegas-estatisticas-nacionais', 'relatorios-anuais-empresas'] },
      { v: 'nº 1', k: 'novo endereço das fábricas', sourceIds: ['alfandegas-estatisticas-nacionais', 'relatorios-anuais-empresas'] },
    ],
    adv: 'China+1: realocação da montagem sem redistribuir o excedente — a compressão salarial viaja junto com a fábrica (TMD continental em nova sede).',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'seda',
    chapter: 'Cap. 2 · Quem transforma',
    titulo: 'A rota da seda sobre trilhos',
    lng: 60, lat: 52, k: 1.8, flowId: 'man-chn-eu',
    did: 'Não é só navio: trens de carga cruzam a Ásia Central levando produtos chineses até a Alemanha pela "Nova Rota da Seda". A Europa compra da China mais do que de qualquer outro país. Junto com a mercadoria viajam portos, ferrovias e empréstimos — infraestrutura também é influência.',
    simples: 'Produtos chineses também chegam à Europa de trem. Ferrovias, portos e empréstimos ajudam a China a vender mais e aumentar sua influência.',
    didStats: [
      { v: '≈ US$ 550 bi', k: 'por ano, China → Europa', sourceIds: ['alfandegas-estatisticas-nacionais', 'unctad'] },
      { v: '15 mil', k: 'viagens de trem por ano', sourceIds: ['alfandegas-estatisticas-nacionais', 'unctad'] },
    ],
    adv: 'Belt & Road Initiative: corredores ferroviários (Chongqing–Duisburg), portos (Piraeus) e crédito reduzem tempo de circulação e reorganizam a logística eurasiática. A infraestrutura vira ativo estratégico: encadeia demanda, financiamento e acesso a mercados, ampliando poder de barganha e capacidade de realização do capital chinês.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'quintal',
    chapter: 'Cap. 2 · Quem transforma',
    titulo: 'A fábrica do quintal',
    lng: -105, lat: 30, k: 2.2, flowId: 'det-mex-usa',
    did: 'Os EUA montaram sua fábrica no quintal: o México exporta quase meio trilhão por ano — carros e TVs montados por quem ganha cerca de 1/8 do salário americano. Perto no mapa, longe no salário: é assim que o produto chega barato às lojas.',
    simples: 'O México monta muitos carros, TVs e peças vendidos nos EUA. Os salários mexicanos são bem menores, então produzir perto dos EUA pode sair mais barato.',
    didStats: [
      { v: '≈ US$ 500 bi', k: 'por ano, México → EUA', sourceIds: ['alfandegas-estatisticas-nacionais', 'oit-trabalho'] },
      { v: '1/8', k: 'do salário americano', sourceIds: ['alfandegas-estatisticas-nacionais', 'oit-trabalho'] },
    ],
    adv: 'USMCA/nearshoring: integração de montagem com compressão salarial estrutural — redução do v na cadeia norte-americana sem sair do continente (TMD continental).',
    dica: 'essa rota só aparece com zoom — como esta',
  },
  {
    id: 'costureiras',
    chapter: 'Cap. 2 · Quem transforma',
    titulo: 'Quem costura sua roupa',
    lng: 90, lat: 22, k: 2.4, flowId: 'det-bgd-eu',
    did: 'Quatro milhões de pessoas — a maioria mulheres — costuram para a Europa ganhando cerca de US$ 120 por mês. Em 2013, um prédio de fábricas desabou e matou 1.134 costureiras. A roupa barata da vitrine tem esse custo embutido — só que quem paga não é você.',
    simples: 'Milhões de pessoas costuram roupas em Bangladesh por salários baixos. O desastre do Rana Plaza mostrou o risco de produzir barato sem segurança.',
    didStats: [
      { v: '1.134', k: 'mortas em Rana Plaza, 2013', sourceIds: ['oit-trabalho', 'desastres-corporativos'] },
      { v: 'US$ 120', k: 'o salário mensal', sourceIds: ['oit-trabalho', 'desastres-corporativos'] },
    ],
    adv: 'Rana Plaza condensa a lógica da cadeia global de valor têxtil: marcas no topo capturam margem e reputação, fornecedores competem por custo e trabalhadores absorvem a compressão salarial e o risco. O salário mínimo em torno de US$113–120/mês e a escala de 4 milhões de trabalhadores mostram arbitragem laboral típica da TMD aplicada à manufatura exportadora.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'chip',
    chapter: 'Cap. 3 · O elo mais valioso',
    titulo: 'O ponto mais sensível do mapa',
    lng: 122, lat: 28, k: 2.4, flowId: 'det-twn-usa', conflict: 'semis',
    did: 'Existe um produto sem o qual nada moderno funciona: o chip avançado. Quase todos saem de uma ilha, Taiwan. Sem essa linha não há inteligência artificial, smartphone — nem míssil. Por isso dois blocos disputam esse pedacinho do mapa.',
    simples: 'Os chips mais avançados são fabricados principalmente pela TSMC, em Taiwan. Eles são usados em celulares, computadores, inteligência artificial e equipamentos militares.',
    didStats: [
      { v: '~90%', k: 'da lógica de ponta vem da TSMC', sourceIds: ['nist-chips', 'relatorios-anuais-empresas'] },
      { v: '1 ilha', k: 'no centro da disputa', sourceIds: ['nist-chips', 'relatorios-anuais-empresas'] },
    ],
    adv: 'TSMC→EUA (<7nm) como chokepoint estratégico: o "escudo de silício" estrutura a contenção à China — export controls (ASML/EUV, NVIDIA) sobre o capital constante mais avançado.',
    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',
    quiz: {
      pergunta: [
        'Por que a ilha de Taiwan e a empresa TSMC representam o nó mais vulnerável da economia digital global?',
        'Why do Taiwan and TSMC constitute the single most vulnerable node in the global digital economy?',
        '¿Por qué Taiwán y TSMC representan el nodo más vulnerable de la economía digital global?',
      ],
      opcoes: [
        [
          'Porque concentram mais de 90% da fundição mundial de chips lógicos de ponta (<7nm)',
          'Because they concentrate over 90% of global foundry capacity for leading-edge logic chips (<7nm)',
          'Porque concentran más del 90% de la fundición mundial de chips lógicos de vanguardia (<7nm)',
        ],
        [
          'Porque detêm as maiores jazidas de areia de silício natural do mundo',
          'Because they control the largest natural silicon sand deposits in the world',
          'Porque poseen los mayores yacimientos de arena de silicio natural del mundo',
        ],
        [
          'Porque compram a totalidade das ações das Big Techs no mercado financeiro',
          'Because they acquire all outstanding shares of Big Tech firms on financial markets',
          'Porque compran la totalidad de las acciones de las Big Tech en el mercado financiero',
        ],
      ],
      correta: 0,
      explicacao: [
        'A TSMC responde por mais de 90% de toda a fundição de processadores e aceleradores de IA de ponta. Uma interrupção no Estreito de Taiwan paralisaria montadoras automotivas, servidores e smartphones em semanas em escala planetária.',
        'TSMC accounts for over 90% of world foundry capacity for advanced AI accelerators and processors. Any disruption across the Taiwan Strait would freeze automotive, server, and phone assembly globally within weeks.',
        'TSMC representa más del 90% de la fundición mundial de procesadores y aceleradores de IA avanzados. Una interrupción en el Estrecho de Taiwán paralizaría el ensamblaje global de automóviles, servidores y teléfonos en pocas semanas.',
      ],
    },
  },
  {
    id: 'vaza',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'A linha mais invisível',
    lng: -45, lat: 3, k: 2.4, flowId: 'drn-bra-usa',
    did: 'Esta é a linha que ninguém mostra nos jornais. Todo ano, parte do que o Brasil produz sobe para os EUA como lucro, dividendo e taxa: cada assinatura de streaming, cada passagem de cartão, cada licença de programa deixa uma fatia lá fora. É riqueza feita aqui que não volta.',
    simples: 'Parte do dinheiro gerado no Brasil vai para empresas e investidores de outros países como lucros, juros e pagamentos de tecnologia. Essa saída acontece todos os anos.',
    didStats: [
      { v: 'US$ 40–55 bi', k: 'saem do Brasil por ano', sourceIds: ['bcb-portal', 'ilaese-anuario'] },
      { v: 'streaming + cartões', k: 'pingam lucro todo mês', sourceIds: ['bcb-portal', 'ilaese-anuario'] },
    ],
    adv: 'Canal 3 da TMD: remessa de rendas de propriedade (ILAESE: R$195–294 bi/ano só do Brasil) — juros, royalties e dividendos capitalizam matrizes do centro (dos Santos: dependência como reprodução do subdesenvolvimento).',
    dica: 'o painel da rota lista empresa por empresa',
    quiz: {
      pergunta: [
        'O que caracteriza o "dreno de valor" e a dependência financeira na Teoria Marxista da Dependência (TMD)?',
        'What characterizes value drainage and financial dependence in Marxist Dependency Theory (TMD)?',
        '¿Qué caracteriza el drenaje de valor y la dependencia financiera en la Teoría Marxista de la Dependencia (TMD)?',
      ],
      opcoes: [
        [
          'O fluxo contínuo de ajuda humanitária e doações do Norte Global para o Sul',
          'The continuous net inflow of humanitarian grants and aid from the North to the South',
          'El flujo neto continuo de ayuda humanitaria y donaciones del Norte hacia el Sur',
        ],
        [
          'A remessa líquida estrutural de mais-valia da periferia ao centro via lucros, juros da dívida e royalties',
          'The structural net remittance of surplus value from periphery to core via profits, debt service, and royalties',
          'La remisión neta estructural de plusvalía de la periferia al centro mediante beneficios, deuda y regalías',
        ],
        [
          'A equalização espontânea dos salários e do desenvolvimento produtivo entre todas as nações',
          'Spontaneous equalization of wages and productive development across all nations',
          'La igualación espontánea de salarios y desarrollo productivo entre todas las naciones',
        ],
      ],
      correta: 1,
      explicacao: [
        'Segundo Mauro Marini e Theotônio dos Santos, a periferia transfere sistematicamente mais-valia ao centro financeiro. Essa perda líquida de recursos (R$ 195–294 bi/ano no Brasil) bloqueia a soberania produtiva nacional e reforça a superexploração do trabalho.',
        'According to Marini and dos Santos, peripheral economies systematically transfer surplus value to imperialist financial cores. This net outflow drain locks in dependent subordination and reinforces super-exploitation of labor.',
        'Según Marini y dos Santos, la periferia transfiere sistemáticamente plusvalía a los centros financieros. Esta fuga neta de recursos perpetúa la subordinación dependiente y profundiza la superexplotación del trabajo.',
      ],
    },
  },
  {
    id: 'remessas',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'O suor volta em gotas',
    lng: -100, lat: 22, k: 2.2, flowId: 'drn-mex-usa',
    did: 'As fábricas "mexicanas" mandam o lucro de volta para as matrizes — cerca de US$ 45 bilhões por ano. E os mexicanos que trabalham nos EUA mandam US$ 63 bilhões para casa. Repare a diferença: o lucro volta inteiro; o suor, em gotas.',
    simples: 'Empresas mandam lucros do México para suas matrizes, enquanto trabalhadores mexicanos nos EUA mandam dinheiro para suas famílias. São dois fluxos diferentes entre os mesmos países.',
    didStats: [
      { v: 'US$ 45 bi+', k: 'de lucro remetido/ano', sourceIds: ['banco-mundial', 'alfandegas-estatisticas-nacionais'] },
      { v: 'US$ 63 bi', k: 'de remessas das famílias', sourceIds: ['banco-mundial', 'alfandegas-estatisticas-nacionais'] },
    ],
    adv: 'Conta de rendas (≈US$45 bi) vs. remessas (≈US$63 bi): o Sul fornece trabalho duas vezes — na fábrica e na diáspora — e o Norte devolve o preço do trabalho, não o valor gerado.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'vaza-africa',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'O mesmo desenho, na África',
    lng: 17, lat: 6, k: 2.0, flowId: 'drn-afr-eu',
    did: 'Na África o desenho se repete em escala maior: petróleo da Nigéria, minérios do Congo, cacau da Costa do Marfim saem brutos — e voltam como produto pronto, com a margem. O lucro das gigantes que operam lá é anunciado em Londres e na Suíça.',
    simples: 'Muitos países africanos vendem petróleo, minérios e cacau com pouco processamento. Depois compram produtos prontos, que costumam valer mais.',
    didStats: [
      { v: 'bruto sai', k: 'pronto volta, com margem', sourceIds: ['unctad', 'relatorios-anuais-empresas'] },
      { v: 'Londres · Suíça', k: 'onde o lucro é anunciado', sourceIds: ['unctad', 'relatorios-anuais-empresas'] },
    ],
    adv: 'Agregado de extração + renda de propriedade: petróleo (Shell/Eni), minerais (Glencore; Anglo American–LSE), cacau (traders europeus) — processamento e marca retidos no Norte (Rodney: subdesenvolvimento como produção ativa).',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'divida',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'A dívida que nunca termina',
    lng: -64, lat: -30, k: 2.4, flowId: 'drn-arg-usa',
    did: 'A Argentina já deixou de pagar várias vezes — e mesmo assim os credores voltam a emprestar, com juros maiores. Quem paga o ajuste, no fim, é sempre o salário: menos emprego, preços maiores, serviços cortados. A dívida vira uma torneira que nunca fecha.',
    simples: 'A Argentina toma empréstimos, enfrenta crises e renegocia dívidas. Quando o governo corta gastos ou a moeda perde valor, a população sente isso no emprego e nos preços.',
    didStats: [
      { v: 'US$ 44 bi', k: 'o programa com o FMI', sourceIds: ['imf-weo', 'imf-fiscal-monitor'] },
      { v: 'salários', k: 'pagam o ajuste, sempre', sourceIds: ['imf-weo', 'imf-fiscal-monitor'] },
    ],
    adv: 'Ciclo dívida → default → reestruturação: serviço ≈US$15–20 bi/ano; programa FMI + Vaca Muerta (Chevron/Exxon/Total) — disciplinamento via crise (TMD + restrição cambial real).',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'tecnologia',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'A conta digital da Índia',
    lng: 80, lat: 15, k: 2.2, flowId: 'drn-ind-usa',
    did: 'O dreno também é digital: cada anúncio, cada assinatura, cada taxa de cartão na Índia pinga uma parte para a Califórnia — uns US$ 25 bilhões por ano. E há a conta antiga: historiadores calculam em US$ 45 trilhões o que o colonialismo tirou da Índia. O cano mudou; a direção, não.',
    simples: 'Serviços digitais também movem dinheiro entre países. Empresas de tecnologia recebem pagamentos da Índia, enquanto pesquisadores também discutem quanto o colonialismo retirou do país no passado.',
    didStats: [
      { v: 'US$ 25 bi+', k: 'para Big Techs, por ano', sourceIds: ['relatorios-anuais-empresas', 'vitimas-pesquisa-historica'] },
      { v: 'US$ 45 tri', k: 'a conta do colonialismo', sourceIds: ['relatorios-anuais-empresas', 'vitimas-pesquisa-historica'] },
    ],
    adv: 'Canal 3 em versão digital (publicidade/cloud/taxas) + drain histórico (Patnaik: US$45 tri, 1765–1938) — continuidade secular da transferência de excedente.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'dolar',
    chapter: 'Cap. 5 · A moeda que manda',
    titulo: 'Quem decide o preço do feijão',
    lng: -40, lat: 28, k: 2.2, flowId: 'fin-usa-bra',
    did: 'A linha amarela não leva produto: leva poder. Como soja, petróleo e minério são cotados em dólar, quando os juros sobem nos EUA o real cai — e o feijão sobe no Brasil. A moeda americana participa de cada compra no mercado.',
    simples: 'Muitos produtos internacionais são cobrados em dólar. Quando o dólar fica mais caro para o Brasil, produtos e alimentos podem ficar mais caros aqui.',
    didStats: [
      { v: 'US$ 240 bi', k: 'do Brasil guardados em dólar', sourceIds: ['bcb-portal', 'us-treasury-tic'] },
      { v: 'Fed sobe', k: 'feijão sobe aqui', sourceIds: ['bcb-portal', 'us-treasury-tic'] },
    ],
    adv: 'Hierarquia monetária (Pilar 3): Treasuries + precificação dolarizada + dívida corporativa externa — a política do Fed transmite-se ao custo de vida periférico sem passar por nenhuma urna.',
    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',
    quiz: {
      pergunta: [
        'Como a hegemonia do dólar (privilégio exorbitante) opera no comércio e na finança internacional?',
        'How does the hegemony of the US dollar (exorbitant privilege) function in international trade and finance?',
        '¿Cómo opera la hegemonía del dólar estadounidense (privilegio exorbitante) en el comercio y las finanzas globales?',
      ],
      opcoes: [
        [
          'Exigindo que o dólar seja lastreado integralmente em reservas físicas de ouro desde 1971',
          'By requiring the dollar to be 100% backed by physical gold reserves since 1971',
          'Exigiendo que el dólar esté respaldado íntegramente en reservas físicas de oro desde 1971',
        ],
        [
          'Permitindo aos EUA importar bens reais e energia emitindo passivos na sua própria moeda soberana, que o mundo é forçado a reter como reservas',
          'By enabling the US to import real commodities and energy by issuing liabilities in its own currency, which other nations are obliged to hold as reserves',
          'Permitiendo a EE. UU. importar bienes reales y energía emitiendo pasivos en su propia moneda, que el resto del mundo retiene como reservas',
        ],
        [
          'Impedindo qualquer banco central periférico de emitir moeda nacional',
          'By prohibiting any peripheral central bank from issuing local currency',
          'Prohibiendo a cualquier banco central periférico emitir moneda nacional',
        ],
      ],
      correta: 1,
      explicacao: [
        'Por ser a moeda de liquidação das principais commodities (petróleo, grãos) e o padrão de liquidez global, os EUA compram produtos do trabalho estrangeiro emitindo títulos do Tesouro e dólares, exportando inflação e impondo a taxa de juros do Fed ao planeta.',
        'As the clearing standard for energy and global reserves, the US buys real foreign labor output with its own currency, exporting fiscal imbalances and dictating world financing conditions via Fed policy.',
        'Como moneda de liquidación de materias primas y reserva global, EE. UU. adquiere trabajo real extranjero con su propia moneda, exportando desequilibrios y determinando las condiciones financieras mundiales mediante la tasa de la Fed.',
      ],
    },
  },
  {
    id: 'credor',
    chapter: 'Cap. 5 · A moeda que manda',
    titulo: 'Quem financia o patrão da moeda',
    lng: 160, lat: 40, k: 2.3, flowId: 'det-jpn-tsy',
    did: 'Plot twist: o maior financiador do governo americano é o Japão, com mais de US$ 1 trilhão em títulos. Décadas vendendo carros e eletrônicos geraram um cofre — que voltou para os EUA como empréstimo barato. Até o dono da moeda precisa de credor.',
    simples: 'O Japão guarda mais de US$ 1 trilhão em títulos do governo dos EUA. Isso significa que parte do dinheiro japonês ajuda a financiar o governo americano.',
    didStats: [
      { v: 'US$ 1,1 tri', k: 'em títulos americanos', sourceIds: ['us-treasury-tic'] },
      { v: 'nº 1', k: 'credor estrangeiro dos EUA', sourceIds: ['us-treasury-tic'] },
    ],
    adv: 'Reciclagem de superávits via GPIF e bancos: a demanda japonesa por duration ancora os juros longos dos EUA — segurança e finança num só circuito.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'fantasma',
    chapter: 'Cap. 5 · O dinheiro invisível',
    titulo: 'O lucro que muda de endereço',
    lng: -25, lat: 48, k: 2.6, flowId: 'fant-usa-irl',
    did: 'E há o dinheiro que ninguém vê: todo ano, centenas de bilhões em lucros "mudam de endereço" para paraísos fiscais — no papel, sem sair do lugar. Um ano, a Irlanda "cresceu" 26% só com essa contabilidade. São US$ 480 bilhões em impostos que escolas e hospitais do mundo inteiro deixam de receber.',
    simples: 'Empresas podem registrar lucros em países com impostos baixos mesmo quando venderam em outro lugar. Isso pode reduzir quanto os governos arrecadam.',
    didStats: [
      { v: '+26%', k: 'o "crescimento" da Irlanda em 2015', sourceIds: ['zucman-tjn-paraísos'] },
      { v: 'US$ 480 bi', k: 'perdidos em impostos/ano', sourceIds: ['zucman-tjn-paraísos'] },
      { v: 'US$ 140 bi', k: 'deslocados p/ Irlanda/ano', sourceIds: ['zucman-tjn-paraísos'] },
    ],
    adv: 'Missing Profits (Zucman): 36–40% dos lucros multinacionais deslocados; TJN: US$480 bi/ano de arrecadação perdida; offshore: US$10–12 tri — o fictício administrativo.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'tios',
    chapter: 'Cap. 5 · O dinheiro invisível',
    titulo: 'A ilha das 18 mil empresas',
    lng: -80, lat: 25, k: 2.2, flowId: 'fant-usa-cym',
    did: 'As Ilhas Cayman têm 100 mil habitantes — e guardam trilhões em fundos. Um único prédio já foi "sede" de 18 mil empresas ao mesmo tempo. Nenhuma delas fabrica nada lá: o endereço É o produto.',
    simples: 'As Ilhas Cayman têm muitas empresas e fundos registrados no papel. Para muita gente, o principal produto do lugar é justamente oferecer esse endereço financeiro.',
    didStats: [
      { v: '18 mil', k: 'empresas num só prédio', sourceIds: ['zucman-tjn-paraísos'] },
      { v: 'US$ 70 bi', k: 'deslocados por ano', sourceIds: ['zucman-tjn-paraísos'] },
    ],
    adv: 'Cayman/Bermuda como jurisdições-produto: hedge funds e seguros; Bermuda lidera o deslocamento per capita (Zucman) — o endereço como ativo financeiro.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'gaveta',
    chapter: 'Cap. 5 · O dinheiro invisível',
    titulo: 'O país-gaveta',
    lng: 6, lat: 50, k: 2.6, flowId: 'fant-eu-lux',
    did: 'Luxemburgo tem 600 mil habitantes e captura US$ 130 bilhões em lucros de empresas que operam em OUTROS países. Documentos vazados mostraram 340 acordos secretos de imposto — alguns abaixo de 1%. O paraíso fiscal também fala francês e fica na Europa.',
    simples: 'Luxemburgo recebe muitos lucros registrados por empresas que trabalham em outros países. Acordos fiscais secretos ajudaram algumas a pagar impostos muito baixos.',
    didStats: [
      { v: 'US$ 130 bi', k: 'capturados por ano', sourceIds: ['zucman-tjn-paraísos'] },
      { v: '< 1%', k: 'de imposto em alguns acordos', sourceIds: ['zucman-tjn-paraísos'] },
    ],
    adv: 'LuxLeaks (2014, ICIJ): 340+ rulings secretos; fundos + royalties como máquinas de deslocamento intra-europeu — o paraíso não é exceção tropical, é peça do centro.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'saida',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'Uma rachadura no muro',
    lng: 100, lat: 55, k: 2.0, flowId: 'brics-chn-rus',
    did: 'Rússia e China passaram a fazer quase todo o comércio entre elas sem dólar — em yuan e rublos. É o maior desvio já feito por fora da moeda americana, nascido das sanções. Ainda é uma rachadura, não uma porta: o substituto do dólar não existe.',
    simples: 'Rússia e China passaram a usar mais yuan e rublo no comércio entre elas. Isso reduz o uso do dólar, mas ainda não cria uma nova moeda dominante.',
    didStats: [
      { v: '>90%', k: 'sem dólar, Rússia–China', sourceIds: ['pboc-cips', 'alfandegas-estatisticas-nacionais'] },
      { v: 'US$ 245 bi', k: 'de comércio por ano', sourceIds: ['pboc-cips', 'alfandegas-estatisticas-nacionais'] },
    ],
    adv: 'Pós-2022: >90% em moedas locais; CIPS como clearing alternativo — fragmentação monetária sem substituto hegemônico pronto (multipolaridade assimétrica).',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'ponte',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'O real aperta a mão do yuan',
    lng: -40, lat: -5, k: 2.0, flowId: 'brics-chn-bra',
    did: 'Brasil e China já testam vender e comprar em yuan, com um swap de R$ 190 bilhões entre os bancos centrais. Ainda é pequeno perto do dólar — mas é a primeira rachadura oficial desse lado do Atlântico.',
    simples: 'Brasil e China criaram formas de comprar e vender usando real e yuan. Ainda é pequeno perto do dólar, mas mostra uma tentativa de depender menos dele.',
    didStats: [
      { v: 'R$ 190 bi', k: 'de swap BCB–PBoC', sourceIds: ['bcb-brics', 'bcb-portal', 'pboc-cips'] },
      { v: 'piloto', k: 'comércio em yuan via ICBC', sourceIds: ['bcb-brics', 'bcb-portal', 'pboc-cips'] },
    ],
    adv: 'Swap (2013) + liquidação em yuan via ICBC (2023) + mBridge (CBDC): infraestrutura embrionária de desdolarização bilateral, escala ainda marginal vs. stock USD.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'desconto',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'O petróleo com desconto',
    lng: 60, lat: 45, k: 1.9, flowId: 'brics-ind-rus',
    did: 'A Índia virou a maior compradora do petróleo russo — com desconto, pago em rúpias. O detalhe curioso: a Rússia acumula rúpias que mal consegue gastar, e passa a pedir yuan. Fugir do dólar é fácil; achar um substituto, nem tanto.',
    simples: 'A Índia passou a comprar muito petróleo russo com desconto. Como rúpias não são fáceis de usar fora da Índia, parte dos pagamentos acaba migrando para outras moedas, como o yuan.',
    didStats: [
      { v: '≈ US$ 50 bi', k: 'de óleo por ano', sourceIds: ['alfandegas-estatisticas-nacionais', 'pboc-cips'] },
      { v: 'a rúpia', k: 'que sobra sem ter onde gastar', sourceIds: ['alfandegas-estatisticas-nacionais', 'pboc-cips'] },
    ],
    adv: 'Desconto do Urals + impasse rúpia-rublo: a Índia captura parte do spread energético enquanto a Rússia acumula uma moeda de baixa convertibilidade externa. A fragmentação monetária reduz o uso do dólar em algumas transações, mas preserva assimetrias de liquidez, profundidade financeira e função de reserva; por isso o yuan ganha espaço sem reproduzir integralmente a hegemonia do dólar.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'energia',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'Quando a energia vira arma',
    lng: 65, lat: 33, k: 2.0, conflict: 'energia', isos: ['643', '276'],
    did: 'Com as sanções, os dutos russos mudaram de direção: o gás e o petróleo que iam para a Europa agora vão para a Ásia — e a indústria europeia ficou com energia bem mais cara. Energia também é poder: quem controla o cano, participa da decisão.',
    simples: 'Depois das sanções contra a Rússia, mais petróleo e gás russos foram para a Ásia. A Europa precisou buscar outros fornecedores e pagou mais por energia.',
    didStats: [
      { v: 'leste', k: 'o novo rumo do gás russo', sourceIds: ['alfandegas-estatisticas-nacionais', 'sipri-milex'] },
      { v: 'conta maior', k: 'para a indústria europeia', sourceIds: ['alfandegas-estatisticas-nacionais', 'sipri-milex'] },
    ],
    adv: 'Redirecionamento do capital energético russo (Ásia no lugar da Europa) e elevação dos custos do capital produtivo europeu — desindustrialização relativa + militarização (Europa +17% gasto militar, SIPRI 2024).',

    dica: 'observe os países destacados e avance para ver como a disputa muda os fluxos',},
  {
    id: 'canal',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'O pedágio do mundo',
    lng: 32, lat: 28, k: 2.4, flowId: 'det-egy-eu',
    did: 'Por um canal no Egito passa 12% de todo o comércio do planeta — e o Egito cobra pedágio. Quando os ataques no Mar Vermelho derrubaram o tráfego em 2024, a receita afundou 60% e o país entrou em crise. Quem vive de passagem, vive de risco.',
    simples: 'O Canal de Suez é um atalho importante para navios. Quando o tráfego cai por causa de conflitos, o Egito perde receita e o frete pode ficar mais caro.',
    didStats: [
      { v: '12%', k: 'do comércio passa em Suez', sourceIds: ['alfandegas-estatisticas-nacionais', 'imf-weo'] },
      { v: '-60%', k: 'de receita em 2024', sourceIds: ['alfandegas-estatisticas-nacionais', 'imf-weo'] },
    ],
    adv: 'Renda de passagem como variável crítica do balanço egípcio (US$9–10 bi/ano pré-2024); Houthis como choque exógeno — chokepoints enquanto alavanca geopolítica.',

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
  {
    id: 'salario',
    chapter: 'Cap. 7 · Quem paga a conta',
    titulo: 'O mapa dos salários',
    lng: 20, lat: 8, k: 1.3, layer: 'wages',
    did: 'Imagine um termômetro salarial sobre o mapa: o vermelho (menos de US$ 300 por mês) cobriria quase todo o Sul — é de lá que saem a matéria-prima e a montagem barata. O Norte compra barato, processa caro e revende. Essa diferença de cor não é acidente: ela é o sistema funcionando.',
    simples: 'Os salários são muito diferentes entre os países. Muitas matérias-primas e produtos baratos vêm de lugares onde os trabalhadores ganham bem menos.',
    didStats: [
      { v: '< US$ 300', k: 'por mês em quase todo o Sul', sourceIds: ['oit-trabalho', 'gallup-statista-salarios'] },
      { v: 'a cor', k: 'é o sistema funcionando', sourceIds: ['oit-trabalho', 'gallup-statista-salarios'] },
    ],
    adv: 'Mapa salarial = hierarquia do valor: salários baixos não são "vantagem comparativa" — são superexploração (Marini) institucionalizada pela divisão internacional do trabalho.',
    dica: 'no mapa 2D dá para acender essa camada e ver país por país',
  },
  {
    id: 'custo',
    chapter: 'Cap. 7 · Quem paga a conta',
    titulo: 'O preço que não está em dólar',
    lng: 78, lat: 20, k: 1.6, layer: 'deaths',
    did: 'Bhopal, Mariana e Brumadinho, as costureiras de Rana Plaza, meio milhão de vidas nos opioides — somados aos quase 3 milhões que morrem POR ANO por causas ligadas ao trabalho. Este é o preço que o mapa não mostra em dólares.',
    simples: 'Acidentes de trabalho e desastres industriais também fazem parte da economia. Quase 3 milhões de pessoas morrem por ano por causas ligadas ao trabalho, segundo a OIT.',
    didStats: [
      { v: '2,9 mi', k: 'mortes ligadas ao trabalho/ano', sourceIds: ['oit-trabalho', 'desastres-corporativos'] },
      { v: '1.134', k: 'costureiras em Rana Plaza', sourceIds: ['oit-trabalho', 'desastres-corporativos'] },
      { v: '500 mil', k: 'vidas na crise dos opioides', sourceIds: ['oit-trabalho', 'desastres-corporativos'] },
    ],
    adv: 'Violência corporativa como externalização estrutural: Bhopal (duplo padrão), Rana Plaza (compressão salarial), Mariana/Brumadinho (custo mínimo) — o custo humano é variável de ajuste (Nixon: slow violence; ILO: 2,93 mi/ano).',
    dica: 'no mapa 2D, a camada vermelha conta cada caso',
  },
  {
    id: 'agora',
    chapter: 'Encerramento',
    titulo: 'E agora?',
    lng: -53, lat: -10, k: 2.8, isos: ['076'],
    did: `O diagnóstico está completo: o trabalho produz, o Sul fornece barato, o lucro viaja para o Norte, a moeda comanda e a conta chega em vidas. Mas o ${modRef('alternatives')} mostra que alternativas REAIS já funcionam — cooperativas gigantes, cidades com orçamento democrático, comunidades que cuidam do comum. O tabuleiro pode ser reorganizado.`,
    simples: 'O sistema pode ser organizado de outros jeitos. Existem cooperativas, serviços públicos participativos e outras experiências que dividem decisões e resultados de forma diferente.',
    didStats: [
      { v: modNum('alternatives'), k: 'o módulo das alternativas', sourceIds: ['ica-wcm', 'mondragon-casos', 'ostrom-commons', 'un-habitat-orcamento'] },
      { v: 'reais', k: 'casos que já funcionam', sourceIds: ['ica-wcm', 'mondragon-casos', 'ostrom-commons', 'un-habitat-orcamento'] },
    ],
    adv: 'Transição institucional exige combinar formas de propriedade, governança e financiamento: cooperativas alteram a apropriação do excedente; commons mudam direitos de uso; orçamento participativo redistribui poder fiscal; política monetária e industrial condiciona escala. O problema avançado é coordenar produtividade, investimento, restrição externa e distribuição sem recriar concentração privada ou burocrática.',
    dica: `finalize o tour para ir ao ${modRef('alternatives')}`,
  },
]

type TourLang = 'pt' | 'en' | 'es'
type TourStopLocale = {
  chapter: string
  titulo: string
  did: string
  simples: string
  adv: string
  stats: string[]
  dica?: string
}

/**
 * Editorial translations for the shared 2D/3D tour. Geometry, flow ids,
 * source ids, numeric values and every other behavioral field stay on the
 * canonical Portuguese stop above.
 */
const TOUR_STOP_I18N: Record<string, Record<'en' | 'es', TourStopLocale>> = {
  tabuleiro: {
    en: { chapter: 'Opening', titulo: 'The board', did: 'This is the board of the global economy, and every line is wealth in motion. We will follow the money around the world: where it starts, who transforms it, where profits go, and who pays the bill.', simples: 'This map shows how money, products and work move between countries. Follow the lines to see who produces, who sells and who keeps the largest share.', adv: 'A world-systems reading: the routes trace an international division of labor between primary-export peripheries, Asian manufacturing hubs and rentier centers. Each map layer represents a channel of accumulation.', stats: ['stops in this tour', 'types of flow', 'routes drawn'], dica: 'use the layer buttons to turn each type of flow on or off' },
    es: { chapter: 'Apertura', titulo: 'El tablero', did: 'Este es el tablero de la economía mundial y cada línea es riqueza en movimiento. Vamos a seguir el dinero por el mundo: de dónde sale, quién lo transforma, adónde va la ganancia y quién paga la cuenta.', simples: 'Este mapa muestra cómo circulan dinero, productos y trabajo entre países. Sigue las líneas para ver quién produce, quién vende y quién se queda con la mayor parte.', adv: 'Lectura de sistema-mundo: las rutas dibujan una división internacional del trabajo entre periferias primario-exportadoras, centros manufactureros asiáticos y centros rentistas. Cada capa del mapa representa un canal de acumulación.', stats: ['paradas en este tour', 'tipos de flujo', 'rutas dibujadas'], dica: 'usa los botones de capa para activar o desactivar cada tipo de flujo' },
  },
  origem: {
    en: { chapter: 'Ch. 1 · Where it starts', titulo: 'Everything begins in the ground', did: 'It starts with someone planting or digging. This route carries soy, iron ore and oil from Brazil to China, one of the largest raw-material corridors on the map. Every sack and every tonne also embodies hours of work.', simples: 'Brazil sells large volumes of soy, iron ore and oil to China. Follow the route to see how much money it moves and who gains at each stage.', adv: 'A dependency-theory reading: primary specialization exports nature and embodied labor while higher-value processing, technology and branding remain elsewhere. China changed the main destination of Brazilian exports without automatically changing Brazil’s position in the chain.', stats: ['per year, Brazil → China', 'of Brazil’s export dollars come from China', 'of soy per year'], dica: 'click the blue line to open the items and values' },
    es: { chapter: 'Cap. 1 · De dónde sale', titulo: 'Todo empieza en la tierra', did: 'Todo comienza con alguien sembrando o cavando. Esta ruta lleva soja, mineral de hierro y petróleo de Brasil a China, uno de los mayores corredores de materias primas del mapa. Cada saco y cada tonelada también contienen horas de trabajo.', simples: 'Brasil vende grandes volúmenes de soja, mineral y petróleo a China. Sigue la ruta para ver cuánto dinero mueve y quién gana en cada etapa.', adv: 'Lectura desde la teoría de la dependencia: la especialización primaria exporta naturaleza y trabajo incorporado mientras procesamiento, tecnología y marca de mayor valor quedan en otros lugares. China cambió el principal destino de las exportaciones brasileñas sin cambiar automáticamente la posición de Brasil en la cadena.', stats: ['por año, Brasil → China', 'de los dólares de exportación de Brasil vienen de China', 'de soja por año'], dica: 'haz clic en la línea azul para abrir productos y valores' },
  },
  farmacia: {
    en: { chapter: 'Ch. 1 · Where it starts', titulo: 'The South’s pharmacy', did: 'Not all wealth from the Global South is raw ore. India makes about one fifth of the world’s generic medicines and also refines discounted crude for re-export as fuel.', simples: 'India manufactures many generic medicines used around the world. It also buys crude oil, refines it and sells fuel abroad.', adv: 'Generic-drug scale and refinery arbitrage give India industrial capacity, but margins remain compressed in parts of the chain and key technologies and brands are still unevenly distributed.', stats: ['of the world’s generic medicines', 'per year, India → Europe'], dica: 'the dark-blue route also carries refined fuel' },
    es: { chapter: 'Cap. 1 · De dónde sale', titulo: 'La farmacia del Sur', did: 'No toda la riqueza del Sur Global es mineral bruto. India fabrica cerca de una quinta parte de los medicamentos genéricos del mundo y también refina crudo con descuento para reexportarlo como combustible.', simples: 'India fabrica muchos medicamentos genéricos usados en todo el mundo. También compra petróleo, lo refina y vende combustible al exterior.', adv: 'La escala de genéricos y el arbitraje de refino dan a India capacidad industrial, pero los márgenes siguen comprimidos en partes de la cadena y tecnologías y marcas clave permanecen distribuidas de forma desigual.', stats: ['de los genéricos del mundo', 'por año, India → Europa'], dica: 'la ruta azul oscuro también lleva combustible refinado' },
  },
  mina: {
    en: { chapter: 'Ch. 1 · Where it starts', titulo: 'The metal in your pocket', did: 'The phone in your pocket and many electric vehicles contain cobalt from the Democratic Republic of the Congo. A large share of global supply begins there, including some artisanal mining under dangerous conditions.', simples: 'Much of the cobalt used in batteries comes from the Congo. It is found in phones and electric cars, and some extraction happens in very poor conditions.', adv: 'Cobalt extraction in the DRC and highly concentrated refining in China reproduce an enclave structure: raw mineral is extracted locally while most processing, technology and bargaining power sit elsewhere in the chain.', stats: ['of world cobalt comes from the DRC', 'phone and EV batteries'], dica: 'zoom out and in: regional routes appear as you get closer' },
    es: { chapter: 'Cap. 1 · De dónde sale', titulo: 'El metal dentro de tu bolsillo', did: 'El teléfono de tu bolsillo y muchos vehículos eléctricos contienen cobalto de la República Democrática del Congo. Una gran parte de la oferta mundial comienza allí, incluida minería artesanal en condiciones peligrosas.', simples: 'Gran parte del cobalto usado en baterías viene del Congo. Está en celulares y autos eléctricos, y parte de la extracción ocurre en condiciones muy malas.', adv: 'La extracción de cobalto en la RDC y el refino altamente concentrado en China reproducen una estructura de enclave: el mineral se extrae localmente mientras gran parte del procesamiento, la tecnología y el poder de negociación quedan fuera.', stats: ['del cobalto mundial viene de la RDC', 'baterías de celular y vehículo eléctrico'], dica: 'aleja y acerca el zoom: las rutas regionales aparecen al acercarte' },
  },
  fabrica: {
    en: { chapter: 'Ch. 2 · Who transforms it', titulo: 'The world’s factory', did: 'Raw materials become finished goods here. The pink route crosses the Pacific with phones, laptops and televisions assembled in China, while brand owners and intellectual-property holders capture a large share of the final margin.', simples: 'Many electronics used in the United States are assembled in China. The factory makes the product, but the brand owner often keeps a large share of the value.', adv: 'Global value chains separate assembly from control over design, intellectual property, brands and distribution. Manufacturing location therefore does not by itself determine where the largest margins are captured.', stats: ['per year, China → U.S.', 'of an iPhone’s value captured by the brand, approx.'], dica: 'open the company module to compare firms along the route' },
    es: { chapter: 'Cap. 2 · Quién transforma', titulo: 'La fábrica del mundo', did: 'Aquí las materias primas se convierten en bienes terminados. La ruta rosa cruza el Pacífico con teléfonos, laptops y televisores ensamblados en China, mientras dueños de marcas y propiedad intelectual capturan una gran parte del margen final.', simples: 'Muchos electrónicos usados en Estados Unidos se ensamblan en China. La fábrica hace el producto, pero el dueño de la marca suele quedarse con gran parte del valor.', adv: 'Las cadenas globales de valor separan el ensamblaje del control sobre diseño, propiedad intelectual, marcas y distribución. Por eso el lugar de fabricación no determina por sí solo dónde se capturan los mayores márgenes.', stats: ['por año, China → EE. UU.', 'del valor de un iPhone capturado por la marca, aprox.'], dica: 'abre el módulo de empresas para comparar firmas de la ruta' },
  },
  'fabrica-muda': {
    en: { chapter: 'Ch. 2 · Who transforms it', titulo: 'The factory changes address', did: 'When trade tensions rise, some production moves from China to lower-cost locations such as Vietnam. The address changes, but the search for low production costs often remains.', simples: 'When producing in China becomes more expensive or difficult, some companies move factories to countries such as Vietnam. The place changes, but the search for lower costs continues.', adv: 'The “China+1” strategy redistributes assembly across Asia without necessarily redistributing ownership, technology or surplus. Wage competition can travel with the factory.', stats: ['of selected Galaxy/Nike production linked to Vietnam, approx.', 'a leading new factory destination'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 2 · Quién transforma', titulo: 'La fábrica cambia de dirección', did: 'Cuando aumentan las tensiones comerciales, parte de la producción sale de China hacia lugares de menor costo como Vietnam. Cambia la dirección, pero suele continuar la búsqueda de costos bajos.', simples: 'Cuando producir en China se vuelve más caro o difícil, algunas empresas llevan fábricas a países como Vietnam. Cambia el lugar, pero continúa la búsqueda de costos menores.', adv: 'La estrategia “China+1” redistribuye el ensamblaje por Asia sin redistribuir necesariamente propiedad, tecnología o excedente. La competencia salarial puede viajar junto con la fábrica.', stats: ['de parte de la producción Galaxy/Nike vinculada a Vietnam, aprox.', 'uno de los principales nuevos destinos fabriles'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  seda: {
    en: { chapter: 'Ch. 2 · Who transforms it', titulo: 'The Silk Road on rails', did: 'Chinese goods also reach Europe by freight rail across Central Asia. Ports, railways and credit lower circulation time and connect infrastructure investment to trade influence.', simples: 'Chinese products also reach Europe by train. Railways, ports and loans help China sell more and increase its influence.', adv: 'Belt and Road corridors combine logistics and finance. Infrastructure changes circulation time, creates demand for capital goods and can increase bargaining power over access to markets.', stats: ['per year, China → Europe', 'freight-train trips per year'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 2 · Quién transforma', titulo: 'La Ruta de la Seda sobre rieles', did: 'Los bienes chinos también llegan a Europa por ferrocarril de carga a través de Asia Central. Puertos, trenes y crédito reducen el tiempo de circulación y conectan inversión en infraestructura con influencia comercial.', simples: 'Productos chinos también llegan a Europa en tren. Ferrocarriles, puertos y préstamos ayudan a China a vender más y aumentar su influencia.', adv: 'Los corredores de la Franja y la Ruta combinan logística y finanzas. La infraestructura cambia el tiempo de circulación, crea demanda de bienes de capital y puede aumentar el poder de negociación sobre el acceso a mercados.', stats: ['por año, China → Europa', 'viajes de tren de carga por año'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  quintal: {
    en: { chapter: 'Ch. 2 · Who transforms it', titulo: 'The factory next door', did: 'Mexico exports close to half a trillion dollars a year to the United States in cars, electronics and other manufactured goods. Proximity and a large wage gap make nearshoring attractive.', simples: 'Mexico assembles many cars, televisions and parts sold in the United States. Mexican wages are much lower, so producing close to the U.S. can cost less.', adv: 'USMCA nearshoring integrates North American manufacturing while preserving major wage differentials. The geography becomes shorter while the hierarchy inside the production chain can remain.', stats: ['per year, Mexico → U.S.', 'of U.S. manufacturing wages, approx.'], dica: 'this route appears only when zoomed in — like now' },
    es: { chapter: 'Cap. 2 · Quién transforma', titulo: 'La fábrica de al lado', did: 'México exporta cerca de medio billón de dólares al año a Estados Unidos en autos, electrónicos y otros bienes manufacturados. La proximidad y una gran brecha salarial vuelven atractivo el nearshoring.', simples: 'México ensambla muchos autos, televisores y piezas vendidos en Estados Unidos. Los salarios mexicanos son mucho menores, así que producir cerca de EE. UU. puede costar menos.', adv: 'El nearshoring bajo el T-MEC integra la manufactura norteamericana mientras conserva grandes diferencias salariales. La geografía se acorta, pero la jerarquía dentro de la cadena puede permanecer.', stats: ['por año, México → EE. UU.', 'del salario manufacturero de EE. UU., aprox.'], dica: 'esta ruta aparece solo al acercar el zoom — como ahora' },
  },
  costureiras: {
    en: { chapter: 'Ch. 2 · Who transforms it', titulo: 'Who sews your clothes', did: 'Millions of workers, most of them women, sew clothes in Bangladesh for global brands. Rana Plaza exposed what can happen when price and delivery pressure outrun workplace safety.', simples: 'Millions of people sew clothes in Bangladesh for low wages. The Rana Plaza disaster showed the risk of producing cheaply without adequate safety.', adv: 'Rana Plaza exposed fragmented governance in garment value chains: brands control orders and prices, suppliers compress time and costs, and workers hold less bargaining power. Safety depends on rules that reach the top of the chain.', stats: ['killed at Rana Plaza, 2013', 'monthly wage, approx.'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 2 · Quién transforma', titulo: 'Quién cose tu ropa', did: 'Millones de trabajadores, en su mayoría mujeres, cosen ropa en Bangladesh para marcas globales. Rana Plaza mostró qué ocurre cuando la presión por precio y entrega supera a la seguridad laboral.', simples: 'Millones de personas cosen ropa en Bangladesh por salarios bajos. El desastre de Rana Plaza mostró el riesgo de producir barato sin seguridad adecuada.', adv: 'Rana Plaza expuso una gobernanza fragmentada en las cadenas textiles: marcas controlan pedidos y precios, proveedores comprimen tiempo y costos y trabajadores tienen menos poder de negociación. La seguridad depende de reglas que alcancen la cima de la cadena.', stats: ['muertos en Rana Plaza, 2013', 'salario mensual, aprox.'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  chip: {
    en: { chapter: 'Ch. 3 · The most valuable link', titulo: 'The most sensitive point on the map', did: 'Advanced logic chips are essential to AI, smartphones, vehicles and military systems, and production is highly concentrated in Taiwan. That concentration makes the island a central point in U.S.-China competition.', simples: 'The most advanced chips are made mainly by TSMC in Taiwan. They are used in phones, computers, AI and military equipment.', adv: 'TSMC’s leading-edge foundry capacity is a strategic chokepoint. Export controls over lithography, advanced GPUs and manufacturing equipment turn capital goods and intellectual property into geopolitical instruments.', stats: ['of leading-edge logic from TSMC, approx.', 'island at the center of the dispute'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 3 · El eslabón más valioso', titulo: 'El punto más sensible del mapa', did: 'Los chips lógicos avanzados son esenciales para IA, teléfonos, vehículos y sistemas militares, y su producción está muy concentrada en Taiwán. Esa concentración convierte a la isla en un punto central de la competencia EE. UU.-China.', simples: 'Los chips más avanzados son fabricados principalmente por TSMC en Taiwán. Se usan en teléfonos, computadoras, IA y equipos militares.', adv: 'La capacidad de foundry de vanguardia de TSMC es un cuello de botella estratégico. Los controles de exportación sobre litografía, GPU avanzadas y equipos de fabricación convierten bienes de capital y propiedad intelectual en instrumentos geopolíticos.', stats: ['de la lógica de vanguardia viene de TSMC, aprox.', 'isla en el centro de la disputa'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  vaza: {
    en: { chapter: 'Ch. 4 · Where profit goes', titulo: 'The most invisible line', did: 'Part of the income generated in Brazil flows abroad every year as profits, dividends, royalties, technology services and fees. Unlike a commodity shipment, this flow is mostly invisible on a physical map.', simples: 'Part of the money generated in Brazil goes to firms and investors in other countries as profits, interest and technology payments. This happens every year.', adv: 'This is the property-income channel emphasized by dependency theory: profit, dividend, interest and royalty payments connect domestic production to accumulation in foreign headquarters and financial centers.', stats: ['leave Brazil per year', 'streaming + cards create recurring payments'], dica: 'the route panel lists the main channels' },
    es: { chapter: 'Cap. 4 · Adónde va la ganancia', titulo: 'La línea más invisible', did: 'Parte de la renta generada en Brasil fluye al exterior cada año como ganancias, dividendos, regalías, servicios tecnológicos y tasas. A diferencia de un cargamento físico, este flujo casi no se ve en un mapa.', simples: 'Parte del dinero generado en Brasil va a empresas e inversores de otros países como ganancias, intereses y pagos de tecnología. Esto ocurre todos los años.', adv: 'Es el canal de renta de propiedad destacado por la teoría de la dependencia: pagos de ganancias, dividendos, intereses y regalías conectan la producción doméstica con acumulación en matrices y centros financieros externos.', stats: ['salen de Brasil por año', 'streaming + tarjetas generan pagos recurrentes'], dica: 'el panel de la ruta enumera los principales canales' },
  },
  remessas: {
    en: { chapter: 'Ch. 4 · Where profit goes', titulo: 'Labor returns in drops', did: 'Foreign-owned factories remit profits out of Mexico, while Mexican workers abroad send household remittances back home. The two flows move between the same countries but come from very different relationships.', simples: 'Companies send profits from Mexico to parent firms, while Mexican workers in the U.S. send money to their families. These are two different flows between the same countries.', adv: 'Comparing investment-income outflows with household remittances reveals two distinct circuits: returns to ownership and compensation earned through labor migration.', stats: ['of profit remittances per year', 'in household remittances'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 4 · Adónde va la ganancia', titulo: 'El trabajo vuelve en gotas', did: 'Fábricas de capital extranjero remiten ganancias fuera de México, mientras trabajadores mexicanos en el exterior envían remesas a sus hogares. Los dos flujos recorren los mismos países pero surgen de relaciones muy distintas.', simples: 'Empresas envían ganancias de México a sus matrices, mientras trabajadores mexicanos en EE. UU. mandan dinero a sus familias. Son dos flujos distintos entre los mismos países.', adv: 'Comparar salidas de renta de inversión con remesas familiares revela dos circuitos distintos: retornos a la propiedad y compensación obtenida mediante migración laboral.', stats: ['de ganancias remitidas por año', 'en remesas familiares'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  'vaza-africa': {
    en: { chapter: 'Ch. 4 · Where profit goes', titulo: 'The same pattern in Africa', did: 'Oil, minerals and cocoa often leave African economies with limited processing and return as higher-value products. Corporate profits are frequently booked and announced in financial centers abroad.', simples: 'Many African countries sell oil, minerals and cocoa with little processing and later buy finished products that usually cost more.', adv: 'Extraction, processing and ownership are spatially separated. When refining, branding and corporate ownership remain abroad, a large share of value added and property income can leave the producing economy.', stats: ['raw goods leave', 'where many profits are booked'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 4 · Adónde va la ganancia', titulo: 'El mismo patrón en África', did: 'Petróleo, minerales y cacao suelen salir de economías africanas con poco procesamiento y volver como productos de mayor valor. Muchas ganancias corporativas se registran y anuncian en centros financieros externos.', simples: 'Muchos países africanos venden petróleo, minerales y cacao con poco procesamiento y después compran productos terminados que suelen costar más.', adv: 'Extracción, procesamiento y propiedad están separados geográficamente. Cuando refino, marca y propiedad corporativa quedan fuera, una gran parte del valor agregado y de la renta de propiedad puede salir de la economía productora.', stats: ['salen bienes en bruto', 'donde se registran muchas ganancias'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  divida: {
    en: { chapter: 'Ch. 4 · Where profit goes', titulo: 'The debt that never ends', did: 'Argentina repeatedly borrows, restructures and faces hard-currency shortages. Adjustment programs can reach daily life through employment, public services, prices and the exchange rate.', simples: 'Argentina borrows, faces crises and renegotiates debts. When spending is cut or the currency loses value, people feel it through jobs and prices.', adv: 'The debt cycle combines foreign-currency constraints, refinancing risk, IMF conditionality and commodity or energy projects that generate future dollar revenues. External liquidity becomes a recurring macroeconomic constraint.', stats: ['IMF program', 'absorb much of the adjustment'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 4 · Adónde va la ganancia', titulo: 'La deuda que nunca termina', did: 'Argentina toma préstamos, reestructura y enfrenta escasez recurrente de divisas. Los programas de ajuste llegan a la vida cotidiana mediante empleo, servicios públicos, precios y tipo de cambio.', simples: 'Argentina toma préstamos, enfrenta crisis y renegocia deudas. Cuando se recorta gasto o la moneda pierde valor, la población lo siente en empleo y precios.', adv: 'El ciclo de deuda combina restricciones de divisas, riesgo de refinanciamiento, condicionalidad del FMI y proyectos de commodities o energía que prometen futuros ingresos en dólares. La liquidez externa se vuelve una restricción macroeconómica recurrente.', stats: ['programa con el FMI', 'absorben gran parte del ajuste'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  tecnologia: {
    en: { chapter: 'Ch. 4 · Where profit goes', titulo: 'India’s digital bill', did: 'Advertising, cloud services, software and card networks move part of the income generated in India toward foreign technology companies. The flow is digital, but it is still a cross-border income flow.', simples: 'Digital services also move money between countries. Technology companies receive payments from India, while researchers also debate the much larger historical drain under colonial rule.', adv: 'Digital platforms extend the property-income channel through advertising, cloud fees, software and payment networks. Ownership of intangible assets allows income to cross borders without a physical shipment.', stats: ['to Big Tech per year, estimate', 'historical colonial-drain estimate'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 4 · Adónde va la ganancia', titulo: 'La factura digital de India', did: 'Publicidad, nube, software y redes de tarjetas trasladan parte de la renta generada en India hacia empresas tecnológicas extranjeras. El flujo es digital, pero sigue siendo una transferencia transfronteriza de renta.', simples: 'Los servicios digitales también mueven dinero entre países. Empresas tecnológicas reciben pagos de India, mientras investigadores también debaten el drenaje histórico mucho mayor del período colonial.', adv: 'Las plataformas digitales amplían el canal de renta de propiedad mediante publicidad, nube, software y redes de pago. La propiedad de activos intangibles permite que la renta cruce fronteras sin un cargamento físico.', stats: ['hacia Big Tech por año, estimación', 'estimación histórica del drenaje colonial'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  dolar: {
    en: { chapter: 'Ch. 5 · The currency that rules', titulo: 'Who influences the price of beans', did: 'The yellow line carries monetary power rather than a physical good. Because commodities and finance are heavily dollarized, changes in U.S. interest rates can affect the Brazilian real and domestic prices.', simples: 'Many international goods are priced in dollars. When the dollar becomes more expensive in Brazil, food and other products can also become more expensive.', adv: 'The monetary hierarchy links reserves, dollar pricing and external corporate debt to Federal Reserve policy. Exchange-rate transmission carries decisions made at the center into peripheral prices and balance sheets.', stats: ['of Brazil’s reserves in dollar assets, approx.', 'Fed tightening can raise local prices'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 5 · La moneda que manda', titulo: 'Quién influye en el precio de los frijoles', did: 'La línea amarilla transporta poder monetario y no un bien físico. Como commodities y finanzas están muy dolarizados, cambios en las tasas de EE. UU. pueden afectar al real brasileño y a los precios internos.', simples: 'Muchos productos internacionales se cotizan en dólares. Cuando el dólar se encarece en Brasil, alimentos y otros productos también pueden subir.', adv: 'La jerarquía monetaria conecta reservas, precios en dólares y deuda corporativa externa con la política de la Reserva Federal. La transmisión cambiaria lleva decisiones del centro a precios y balances periféricos.', stats: ['de las reservas de Brasil en activos en dólares, aprox.', 'subas de la Fed pueden elevar precios locales'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  credor: {
    en: { chapter: 'Ch. 5 · The currency that rules', titulo: 'Who finances the issuer of the currency', did: 'Japan holds more than a trillion dollars in U.S. Treasury securities. Decades of external surpluses are recycled into dollar assets that help finance the U.S. state.', simples: 'Japan holds more than US$1 trillion in U.S. government securities. Part of Japanese savings therefore helps finance the U.S. government.', adv: 'Reserve accumulation and institutional demand for U.S. Treasuries recycle trade surpluses into dollar assets, linking security relationships, exchange-rate policy and long-term U.S. interest rates.', stats: ['in U.S. Treasuries', 'foreign holder of U.S. Treasuries'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 5 · La moneda que manda', titulo: 'Quién financia al emisor de la moneda', did: 'Japón mantiene más de un billón de dólares en títulos del Tesoro estadounidense. Décadas de superávits externos se reciclan en activos en dólares que ayudan a financiar al Estado de EE. UU.', simples: 'Japón posee más de US$1 billón en títulos del gobierno estadounidense. Parte del ahorro japonés ayuda así a financiar al gobierno de EE. UU.', adv: 'La acumulación de reservas y la demanda institucional de Treasuries reciclan superávits comerciales en activos en dólares, conectando relaciones de seguridad, política cambiaria y tasas largas de EE. UU.', stats: ['en Treasuries de EE. UU.', 'tenedor extranjero de Treasuries de EE. UU.'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  fantasma: {
    en: { chapter: 'Ch. 5 · Invisible money', titulo: 'The profit that changes address', did: 'Multinational profits can be booked in low-tax jurisdictions without production moving in the same proportion. Ireland’s 2015 GDP jump became a famous example of how accounting can reshape national statistics.', simples: 'Companies can register profits in low-tax countries even when sales happened elsewhere. That can reduce the tax revenue collected by governments.', adv: 'Profit shifting separates the legal location of taxable income from the location of production and sales. Intangible assets, transfer pricing and holding structures allow large income flows to move on paper.', stats: ['Ireland’s headline growth in 2015', 'in global tax revenue lost per year, estimate', 'shifted to Ireland per year, estimate'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 5 · El dinero invisible', titulo: 'La ganancia que cambia de dirección', did: 'Ganancias de multinacionales pueden registrarse en jurisdicciones de bajos impuestos sin que la producción se mueva en la misma proporción. El salto del PIB irlandés en 2015 se volvió un ejemplo famoso de cómo la contabilidad altera estadísticas nacionales.', simples: 'Empresas pueden registrar ganancias en países de impuestos bajos aunque las ventas hayan ocurrido en otro lugar. Eso puede reducir la recaudación de los gobiernos.', adv: 'El traslado de beneficios separa la ubicación legal de la renta imponible del lugar de producción y ventas. Activos intangibles, precios de transferencia y holdings permiten mover grandes flujos de renta sobre el papel.', stats: ['crecimiento nominal de Irlanda en 2015', 'de recaudación mundial perdida por año, estimación', 'trasladados a Irlanda por año, estimación'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  tios: {
    en: { chapter: 'Ch. 5 · Invisible money', titulo: 'The island of 18,000 companies', did: 'The Cayman Islands host enormous fund and corporate structures relative to their population. In offshore finance, the legal address itself is part of the product.', simples: 'The Cayman Islands have many companies and funds registered on paper. For many investors, the main product is the financial address itself.', adv: 'Offshore jurisdictions specialize in legal domicile, fund administration and tax-neutral structures. Financial claims can therefore be located far from the people and firms whose activity generated the underlying income.', stats: ['companies once registered at one building', 'shifted per year, estimate'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 5 · El dinero invisible', titulo: 'La isla de las 18 mil empresas', did: 'Las Islas Caimán albergan estructuras enormes de fondos y empresas en relación con su población. En las finanzas offshore, la dirección legal es parte del producto.', simples: 'Las Islas Caimán tienen muchas empresas y fondos registrados sobre el papel. Para muchos inversores, el producto principal es la propia dirección financiera.', adv: 'Las jurisdicciones offshore se especializan en domicilio legal, administración de fondos y estructuras fiscalmente neutrales. Así, derechos financieros pueden ubicarse lejos de las personas y empresas cuya actividad generó la renta subyacente.', stats: ['empresas registradas alguna vez en un solo edificio', 'trasladados por año, estimación'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  gaveta: {
    en: { chapter: 'Ch. 5 · Invisible money', titulo: 'The filing-cabinet country', did: 'Luxembourg hosts profits and holding structures far larger than its resident economy. The LuxLeaks documents exposed hundreds of confidential tax rulings used by multinational firms.', simples: 'Luxembourg receives profits booked by companies operating in other countries. Secret tax agreements helped some firms pay very low effective rates.', adv: 'LuxLeaks showed how holding companies, royalties and bilateral rulings can shift profits inside Europe. Tax-haven functions are therefore part of the core financial architecture, not only a tropical exception.', stats: ['captured per year, estimate', 'effective tax in some rulings'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 5 · El dinero invisible', titulo: 'El país-archivador', did: 'Luxemburgo alberga ganancias y holdings mucho mayores que su economía residente. Los documentos LuxLeaks expusieron cientos de acuerdos fiscales confidenciales usados por multinacionales.', simples: 'Luxemburgo recibe ganancias registradas por empresas que operan en otros países. Acuerdos fiscales secretos ayudaron a algunas a pagar tasas muy bajas.', adv: 'LuxLeaks mostró cómo holdings, regalías y acuerdos bilaterales pueden trasladar ganancias dentro de Europa. La función de paraíso fiscal forma parte de la arquitectura financiera central, no es solo una excepción tropical.', stats: ['capturados por año, estimación', 'de impuesto efectivo en algunos acuerdos'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  saida: {
    en: { chapter: 'Ch. 6 · Attempts to exit', titulo: 'A crack in the wall', did: 'Russia and China now settle most bilateral trade in yuan and rubles rather than dollars. Sanctions accelerated the change, although no alternative currency yet matches the dollar’s global depth and liquidity.', simples: 'Russia and China now use more yuan and rubles in trade with each other. That reduces dollar use but does not create a new dominant currency.', adv: 'Local-currency settlement and CIPS reduce dependence on dollar clearing in some bilateral flows. The shift is meaningful but remains an asymmetric monetary fragmentation rather than a complete replacement of the dollar system.', stats: ['settled without dollars, Russia–China', 'in bilateral trade per year'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 6 · Intentos de salida', titulo: 'Una grieta en el muro', did: 'Rusia y China ya liquidan la mayor parte de su comercio bilateral en yuanes y rublos en vez de dólares. Las sanciones aceleraron el cambio, aunque ninguna moneda alternativa iguala todavía la profundidad y liquidez global del dólar.', simples: 'Rusia y China usan más yuanes y rublos en su comercio. Eso reduce el uso del dólar, pero no crea una nueva moneda dominante.', adv: 'La liquidación en monedas locales y CIPS reducen la dependencia del clearing en dólares en algunos flujos bilaterales. El cambio es relevante, pero sigue siendo una fragmentación monetaria asimétrica y no un reemplazo completo del sistema dólar.', stats: ['liquidado sin dólares, Rusia–China', 'de comercio bilateral por año'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  ponte: {
    en: { chapter: 'Ch. 6 · Attempts to exit', titulo: 'The real shakes hands with the yuan', did: 'Brazil and China have tested settlement in yuan and maintain a central-bank swap line. The scale is still small relative to the dollar system, but it creates infrastructure for bilateral trade outside dollar settlement.', simples: 'Brazil and China created ways to trade using reais and yuan. It is still small compared with the dollar, but it shows an attempt to depend on it less.', adv: 'Swap lines, yuan settlement through ICBC and CBDC experiments such as mBridge create an embryonic infrastructure for bilateral de-dollarization, although its scale remains limited relative to dollar assets and clearing.', stats: ['BCB–PBoC swap line', 'yuan-trade pilot via ICBC'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 6 · Intentos de salida', titulo: 'El real estrecha la mano del yuan', did: 'Brasil y China probaron liquidación en yuanes y mantienen una línea swap entre bancos centrales. La escala sigue siendo pequeña frente al sistema dólar, pero crea infraestructura para comercio bilateral fuera de la liquidación en dólares.', simples: 'Brasil y China crearon formas de comerciar usando reales y yuanes. Todavía es pequeño frente al dólar, pero muestra un intento de depender menos de él.', adv: 'Líneas swap, liquidación en yuanes vía ICBC y experimentos de CBDC como mBridge crean infraestructura embrionaria para desdolarización bilateral, aunque su escala sigue limitada frente a activos y clearing en dólares.', stats: ['línea swap BCB–PBoC', 'piloto de comercio en yuanes vía ICBC'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  desconto: {
    en: { chapter: 'Ch. 6 · Attempts to exit', titulo: 'Discounted oil', did: 'India became a major buyer of discounted Russian oil. Payments in rupees, dirhams and yuan show both the move away from dollars and the limits of using currencies that are less liquid internationally.', simples: 'India began buying much more discounted Russian oil. Because rupees are hard to spend outside India, some payments also use currencies such as the yuan.', adv: 'The Urals discount lets Indian refiners capture part of the energy spread, while settlement problems reveal the hierarchy among non-dollar currencies. De-dollarization can grow without eliminating differences in convertibility and financial depth.', stats: ['of oil per year', 'currency that can be hard to recycle abroad'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 6 · Intentos de salida', titulo: 'El petróleo con descuento', did: 'India se volvió un gran comprador de petróleo ruso con descuento. Pagos en rupias, dirhams y yuanes muestran tanto la salida parcial del dólar como los límites de monedas con menor liquidez internacional.', simples: 'India empezó a comprar mucho más petróleo ruso con descuento. Como las rupias son difíciles de gastar fuera de India, algunos pagos también usan monedas como el yuan.', adv: 'El descuento del Urals permite a refinerías indias capturar parte del diferencial energético, mientras los problemas de liquidación revelan jerarquías entre monedas no dolarizadas. La desdolarización puede crecer sin eliminar diferencias de convertibilidad y profundidad financiera.', stats: ['de petróleo por año', 'moneda difícil de reciclar en el exterior'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  energia: {
    en: { chapter: 'Ch. 6 · Attempts to exit', titulo: 'When energy becomes a weapon', did: 'Sanctions redirected part of Russia’s oil and gas from Europe toward Asia, while European industry had to secure more expensive alternative supplies. Energy routes are also geopolitical leverage.', simples: 'After sanctions on Russia, more Russian oil and gas went to Asia. Europe had to find other suppliers and paid more for energy.', adv: 'Forced energy decoupling redirected Russian hydrocarbons and raised input costs for parts of European industry. Pipelines, LNG terminals and sanctions become instruments in the distribution of rents and productive costs.', stats: ['new direction of Russian gas', 'for European industry'], dica: 'watch the highlighted countries and continue to see how the dispute changes flows' },
    es: { chapter: 'Cap. 6 · Intentos de salida', titulo: 'Cuando la energía se vuelve arma', did: 'Las sanciones desviaron parte del petróleo y gas rusos desde Europa hacia Asia, mientras la industria europea tuvo que buscar proveedores alternativos más caros. Las rutas energéticas también son instrumentos geopolíticos.', simples: 'Después de las sanciones a Rusia, más petróleo y gas rusos fueron a Asia. Europa tuvo que buscar otros proveedores y pagó más por energía.', adv: 'El desacople energético forzado redirigió hidrocarburos rusos y elevó costos de insumos para partes de la industria europea. Ductos, terminales de GNL y sanciones se vuelven instrumentos en la distribución de rentas y costos productivos.', stats: ['nuevo rumbo del gas ruso', 'para la industria europea'], dica: 'observa los países destacados y continúa para ver cómo cambia los flujos la disputa' },
  },
  canal: {
    en: { chapter: 'Ch. 6 · Attempts to exit', titulo: 'The world’s toll booth', did: 'About 12% of world trade normally passes through the Suez Canal. When Red Sea attacks reduced traffic, Egypt lost major toll revenue and shipping routes became longer and more expensive.', simples: 'The Suez Canal is an important shortcut for ships. When conflict reduces traffic, Egypt loses revenue and shipping can become more expensive.', adv: 'Suez and Bab el-Mandeb are strategic chokepoints. Rerouting around the Cape raises freight and insurance costs while reducing Egypt’s transit income and external-currency receipts.', stats: ['of world trade passes through Suez', 'revenue decline in 2024'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Cap. 6 · Intentos de salida', titulo: 'El peaje del mundo', did: 'Cerca del 12% del comercio mundial suele pasar por el Canal de Suez. Cuando los ataques del Mar Rojo redujeron el tráfico, Egipto perdió importantes ingresos de peaje y las rutas marítimas se hicieron más largas y caras.', simples: 'El Canal de Suez es un atajo importante para barcos. Cuando el conflicto reduce el tráfico, Egipto pierde ingresos y el transporte puede encarecerse.', adv: 'Suez y Bab el-Mandeb son cuellos de botella estratégicos. Desviar barcos por el Cabo eleva fletes y seguros mientras reduce los ingresos de tránsito y divisas de Egipto.', stats: ['del comercio mundial pasa por Suez', 'caída de ingresos en 2024'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  salario: {
    en: { chapter: 'Ch. 7 · Who pays the bill', titulo: 'The wage map', did: 'A wage heatmap reveals a strong geographic hierarchy: many countries that supply raw materials and low-cost assembly have far lower monthly wages than the main consumer and financial centers.', simples: 'Wages differ greatly between countries. Many raw materials and low-cost products come from places where workers earn much less.', adv: 'The wage map is a map of value hierarchy. Persistent wage differences interact with productivity, bargaining power, exchange rates and the international division of labor rather than functioning as a neutral comparative advantage.', stats: ['per month across much of the Global South', 'reflects the structure of the system'], dica: 'on the 2D map you can turn on the wage layer country by country' },
    es: { chapter: 'Cap. 7 · Quién paga la cuenta', titulo: 'El mapa de salarios', did: 'Un mapa de calor salarial revela una fuerte jerarquía geográfica: muchos países que suministran materias primas y ensamblaje barato tienen salarios mensuales mucho menores que los principales centros de consumo y finanzas.', simples: 'Los salarios son muy diferentes entre países. Muchas materias primas y productos baratos vienen de lugares donde trabajadores ganan mucho menos.', adv: 'El mapa salarial es también un mapa de jerarquía de valor. Diferencias salariales persistentes interactúan con productividad, poder de negociación, tipo de cambio y división internacional del trabajo, y no son una simple ventaja comparativa neutral.', stats: ['por mes en gran parte del Sur Global', 'refleja la estructura del sistema'], dica: 'en el mapa 2D puedes activar la capa salarial país por país' },
  },
  custo: {
    en: { chapter: 'Ch. 7 · Who pays the bill', titulo: 'The price not measured in dollars', did: 'Bhopal, Rana Plaza, Mariana and Brumadinho, the opioid crisis and millions of annual work-related deaths reveal costs that do not appear in a commodity price or corporate balance sheet.', simples: 'Work accidents and industrial disasters are also part of the economy. The ILO estimates almost 3 million deaths each year from work-related causes.', adv: 'Corporate harm can be analyzed as cost externalization: firms capture revenue while environmental, health and labor risks are shifted onto workers, communities and states. Regulation determines how much of that cost remains outside the balance sheet.', stats: ['work-related deaths per year', 'garment workers killed at Rana Plaza', 'deaths associated with the opioid crisis'], dica: 'on the 2D map, the red layer shows each documented case' },
    es: { chapter: 'Cap. 7 · Quién paga la cuenta', titulo: 'El precio que no está en dólares', did: 'Bhopal, Rana Plaza, Mariana y Brumadinho, la crisis de opioides y millones de muertes anuales relacionadas con el trabajo muestran costos que no aparecen en el precio de una commodity ni en un balance corporativo.', simples: 'Accidentes de trabajo y desastres industriales también forman parte de la economía. La OIT estima casi 3 millones de muertes al año por causas relacionadas con el trabajo.', adv: 'El daño corporativo puede analizarse como externalización de costos: empresas capturan ingresos mientras riesgos ambientales, sanitarios y laborales se trasladan a trabajadores, comunidades y Estados. La regulación determina cuánto de ese costo queda fuera del balance.', stats: ['muertes relacionadas con el trabajo por año', 'trabajadores textiles muertos en Rana Plaza', 'muertes asociadas a la crisis de opioides'], dica: 'en el mapa 2D, la capa roja muestra cada caso documentado' },
  },
  agora: {
    en: { chapter: 'Closing', titulo: 'What now?', did: 'The diagnosis is complete: work produces, global production chains distribute value unevenly, monetary power shapes prices and finance, and social and environmental costs are often shifted away from those who capture the largest returns. The alternatives module explores institutions that organize ownership and decision-making differently.', simples: 'The economy can be organized in other ways. Cooperatives, participatory public services and other institutions share decisions and results differently.', adv: 'Institutional transition requires combining ownership, governance and finance: cooperatives change surplus appropriation, commons change use rights, participatory budgeting changes fiscal power, and industrial and monetary policy shape scale and external constraints.', stats: ['the alternatives module', 'cases already operating in practice'], dica: 'finish the tour to open the alternatives module' },
    es: { chapter: 'Cierre', titulo: '¿Y ahora?', did: 'El diagnóstico está completo: el trabajo produce, las cadenas globales distribuyen valor de forma desigual, el poder monetario influye en precios y finanzas, y costos sociales y ambientales suelen desplazarse lejos de quienes capturan los mayores retornos. El módulo de alternativas explora instituciones que organizan propiedad y decisiones de otra manera.', simples: 'La economía puede organizarse de otras formas. Cooperativas, servicios públicos participativos y otras instituciones reparten decisiones y resultados de manera diferente.', adv: 'La transición institucional exige combinar propiedad, gobernanza y financiamiento: cooperativas cambian la apropiación del excedente, commons cambian derechos de uso, presupuestos participativos cambian poder fiscal y políticas industrial y monetaria condicionan escala y restricción externa.', stats: ['el módulo de alternativas', 'casos que ya funcionan en la práctica'], dica: 'termina el tour para abrir el módulo de alternativas' },
  },
}

export function tourStopForLang(stop: TourStop, lang: TourLang): TourStop {
  if (lang === 'pt') return stop
  const locale = TOUR_STOP_I18N[stop.id]?.[lang]
  if (!locale) return stop
  return {
    ...stop,
    chapter: locale.chapter,
    titulo: locale.titulo,
    did: locale.did,
    simples: locale.simples,
    adv: locale.adv,
    dica: locale.dica,
    didStats: stop.didStats.map((stat, index) => ({ ...stat, k: locale.stats[index] ?? stat.k })),
  }
}

export function tourStopsForLang(lang: TourLang): TourStop[] {
  if (lang === 'pt') return TOUR_STOPS
  return TOUR_STOPS.map((stop) => tourStopForLang(stop, lang))
}
