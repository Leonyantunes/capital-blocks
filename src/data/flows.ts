/**
 * FLUXOS DO MAPA-HOME COM DETALHAMENTO COMPLETO.
 * Cada fluxo é clicável: itens, valores, empresas, mecanismo dual-mode.
 * Valores anuais aproximados (2024) — fontes citadas por fluxo.
 * tier: 'base' = sempre visível · 'detail' = só com zoom (rotas regionais).
 */

export type FlowType = 'commodities' | 'manufatura' | 'drain' | 'dollar' | 'brics' | 'fantasma'

export interface FlowItem {
  rotulo: string
  valor: string
  nota?: string
}

export interface FlowDef {
  id: string
  type: FlowType
  /** id de bloco OU âncora geográfica custom [lng, lat] */
  from: string | [number, number]
  to: string | [number, number]
  /** rótulos exibidos quando a âncora é custom (sem bloco) */
  fromLabel?: string
  toLabel?: string
  /** ISO do país de origem (p/ destaque no mapa em rotas custom) */
  iso?: string
  bend: number
  dur: number
  /** largura visual base (1–3) proporcional à importância */
  peso: number
  titulo: string
  totalAnual: string
  did: string
  adv: string
  itens: FlowItem[]
  fonte?: string
  /** base = sempre visível · detail = só com zoom (rotas regionais) */
  tier?: 'base' | 'detail'
}

export const TYPE_STYLE: Record<FlowType, { color: string; dash: string; label: string }> = {
  commodities: { color: '#42a5f5', dash: '', label: 'Commodities (matérias-primas)' },
  manufatura: { color: '#f472b6', dash: '', label: 'Manufatura & bens industriais' },
  drain: { color: '#ce93d8', dash: '3 4', label: 'Vaza de mais-valia (lucros/juros)' },
  dollar: { color: '#ffc107', dash: '', label: 'Liquidez em Dólar (SWIFT/Tesouro)' },
  brics: { color: '#26c6da', dash: '5 5', label: 'Alternativa BRICS Pay / Yuan' },
  fantasma: { color: '#9c27b0', dash: '2 6', label: 'Lucro fantasma (paraísos fiscais)' },
}

export const FLOWS: FlowDef[] = [
  /* ═══ MANUFATURA (base) ═══ */
  {
    id: 'man-chn-bra', type: 'manufatura', from: 'china', to: 'brasil', bend: -0.3, dur: 8.5, peso: 2,
    titulo: 'O minério vai, o celular volta',
    totalAnual: '≈ US$ 60 bi / ano',
    did: 'O Brasil manda minério e soja de navio para a China — e recebe de volta NAVIOS CHEIOS de celular, notebook, máquina e peça. Importamos mais de US$ 60 bilhões em manufatura chinesa por ano: o valor agregado fica lá.',
    adv: 'Troca desigual assimétrica com centro asiático: primário sai (US$95 bi), manufatura entra (US$60 bi) — clássico padrão centro-periferia reproduzido com novo suserano industrial; déficit tecnológico estrutural (TMD).',
    itens: [
      { rotulo: 'Eletrônicos (celulares, notebooks)', valor: '≈ US$ 20 bi/ano', nota: 'a Zona Franca de Manaus compete com importados' },
      { rotulo: 'Máquinas e equipamentos industriais', valor: '≈ US$ 15 bi/ano', nota: 'a indústria brasileira depende de máquinas chinesas' },
      { rotulo: 'Químicos, autopeças, vestuário', valor: '≈ US$ 25 bi/ano' },
    ],
    fonte: 'Comex Stat · GACC · 2024 aprox.',
  },
  {
    id: 'man-chn-usa', type: 'manufatura', from: 'china', to: 'usa', bend: -0.72, dur: 9, peso: 3,
    titulo: 'A fábrica do mundo abastece o império',
    totalAnual: '≈ US$ 440 bi / ano',
    did: 'A China exporta para os EUA quase meio TRILHÃO de dólares por ano em produtos prontos: iPhone, notebook, TV, roupa, brinquedo. O consumidor americano vive do trabalho fabril chinês — e o lucro das marcas fica com… as marcas americanas.',
    adv: 'Cadeias globais de valor (GVC): a China monta, o EUA desenha e captura a margem (Apple: ~60% do valor do iPhone fica na Califórnia) — déficit comercial bilateral como eixo da guerra tecnológica.',
    itens: [
      { rotulo: 'Eletrônicos (iPhone, laptops)', valor: '≈ US$ 150 bi/ano', nota: 'montados em Shenzen/Zhengzhou' },
      { rotulo: 'Bens de consumo diversos', valor: '≈ US$ 150 bi/ano', nota: 'vestuário, móveis, brinquedos, eletrodomésticos' },
      { rotulo: 'Máquinas e insumos', valor: '≈ US$ 100 bi/ano' },
    ],
    fonte: 'US Census Bureau · 2024 aprox.',
  },
  {
    id: 'man-chn-eu', type: 'manufatura', from: 'china', to: 'eu', bend: 0.12, dur: 8, peso: 2.5,
    titulo: 'A Nova Rota da Seda sobre trilhos',
    totalAnual: '≈ US$ 550 bi / ano',
    did: 'Trens de carga cruzam a Ásia Central levando produtos chineses para a Europa pela "Nova Rota da Seda" (Belt & Road). A UE importa da China mais do que de qualquer outro país — exceto ela mesma.',
    adv: 'Belt & Road Initiative: corredores ferroviários (Chongqing–Duisburg) + portos de propriedade chinesa (Piraeus) — infraestrutura como instrumento de projeção de acumulação.',
    itens: [
      { rotulo: 'Eletrônicos e telecom', valor: '≈ US$ 180 bi/ano' },
      { rotulo: 'Têxteis, vestuário, móveis', valor: '≈ US$ 120 bi/ano' },
      { rotulo: 'Trens de carga (ferrovia)', valor: '~15 mil viagens/ano', nota: 'Nova Rota da Seda terrestre' },
    ],
    fonte: 'Eurostat · 2024 aprox.',
  },

  /* ═══ DETALHE — manufatura regional (zoom) ═══ */
  {
    id: 'det-mex-usa', tier: 'detail', type: 'manufatura', from: 'mex', to: 'usa', bend: -0.08, dur: 6, peso: 2.5,
    titulo: 'Nearshoring: a montadora do vizinho',
    totalAnual: '≈ US$ 500 bi / ano',
    did: 'O México exporta para os EUA quase MEIO TRILHÃO de dólares por ano — carros montados por trabalhadores que ganham 1/8 do salário americano. O "nearshoring" é isso: a fábrica perto, o salário longe.',
    adv: 'USMCA: integração de montagem com compressão salarial estrutural (~1/8 do salário US) — nearshoring como estratégia de redução do v na cadeia norte-americana (TMD continental).',
    itens: [
      { rotulo: 'Automóveis e autopeças', valor: '≈ US$ 150 bi/ano' },
      { rotulo: 'Eletrônicos e eletrodomésticos', valor: '≈ US$ 100 bi/ano' },
      { rotulo: 'Salário manufatureiro', valor: '~1/8 do americano', nota: 'a "vantagem competitiva"' },
    ],
    fonte: 'US Census · INEGI · 2024',
  },
  {
    id: 'det-deu-usa', tier: 'detail', type: 'manufatura', from: [10.5, 51], to: 'usa', fromLabel: 'DEU', bend: 0.1, dur: 6.5, peso: 1.5,
    titulo: 'A engenharia alemã cruza o Atlântico',
    totalAnual: '≈ US$ 160 bi / ano',
    did: 'A Alemanha exporta para os EUA carros de luxo, máquinas industriais e químicos — o coração manufatureiro da UE dependente do consumidor americano.',
    adv: 'Mittelstand + automobilismo premium (BMW/Mercedes/Porsche): superávit alemão dependente da demanda americana — energia cara pós-UCR comprime o modelo.',
    itens: [
      { rotulo: 'Automóveis premium', valor: '≈ US$ 45 bi/ano' },
      { rotulo: 'Máquinas e químicos', valor: '≈ US$ 60 bi/ano' },
    ],
    fonte: 'Destatis · US Census · 2024',
  },
  {
    id: 'det-jpn-usa', tier: 'detail', type: 'manufatura', from: 'jpn', to: 'usa', bend: -0.4, dur: 6, peso: 1.5,
    titulo: 'Carros japoneses, a rota clássica',
    totalAnual: '≈ US$ 140 bi / ano',
    did: 'A rota mais antiga do Pacífico: desde os anos 60 o Japão inunda os EUA de carros (Toyota, Honda) — o modelo original de como a manufatura asiática reorganizou o trabalho industrial americano.',
    adv: 'Toyota/Honda: o caso fundador da reorganização da indústria americana (lean production, anos 80) — precedente de todas as rotas asiáticas seguintes.',
    itens: [
      { rotulo: 'Automóveis e peças', valor: '≈ US$ 60 bi/ano' },
      { rotulo: 'Máquinas e eletrônicos', valor: '≈ US$ 40 bi/ano' },
    ],
    fonte: 'US Census · JAMA · 2024',
  },
  {
    id: 'det-kor-usa', tier: 'detail', type: 'manufatura', from: 'kor', to: 'usa', bend: -0.45, dur: 6, peso: 1.5,
    titulo: 'Chips de memória e carros coreanos',
    totalAnual: '≈ US$ 100 bi / ano',
    did: 'A Coreia do Sul exporta para os EUA chips de memória, carros elétricos e baterias — sob a sombra das mesmas sanções tecnológicas que atingem a China.',
    adv: 'Samsung/SK Hynix (HBM para IA) + Hyundai EV: alinhamento forçado às export controls — subsídio cruzado (IRA) como captura de cadeia.',
    itens: [
      { rotulo: 'Semicondutores (HBM/DRAM)', valor: '≈ US$ 30 bi/ano' },
      { rotulo: 'Automóveis e baterias', valor: '≈ US$ 35 bi/ano' },
    ],
    fonte: 'US Census · 2024',
  },
  {
    id: 'det-twn-usa', tier: 'detail', type: 'manufatura', from: 'twn', to: 'usa', bend: -0.5, dur: 6, peso: 1.5,
    titulo: 'Os chips que não podem faltar',
    totalAnual: '≈ US$ 70 bi / ano',
    did: 'Taiwan exporta para os EUA os CHIPS mais avançados do mundo (TSMC). Sem essa linha, não existe IA, smartphone ou míssil americano — por isso a ilha é o ponto mais sensível do mapa.',
    adv: 'TSMC→EUA: semicondutores avançados (<7nm) como chokepoint estratégico — o "escudo de silício" que estrutura a contenção da China (ver conflito Semicondutores).',
    itens: [
      { rotulo: 'Semicondutores avançados', valor: '≈ US$ 70 bi/ano', nota: '~90% dos nós <7nm mundiais' },
    ],
    fonte: 'US Census · TSMC filings · 2024',
  },
  {
    id: 'det-vnm-usa', tier: 'detail', type: 'manufatura', from: [105.8, 21.3], to: 'usa', fromLabel: 'VNM', iso: '704', bend: -0.45, dur: 6.5, peso: 1.5,
    titulo: 'O novo destino das fábricas que fogem da China',
    totalAnual: '≈ US$ 130 bi / ano',
    did: 'Com a guerra comercial, as fábricas "sairam da China" — e foram para o Vietnã: Samsung monta metade dos celulares Galaxy lá, Nike faz 50% dos tênis. Mesmo modelo, salário ainda menor.',
    adv: 'China+1 strategy: Vietnã como destino da realocação (Samsung: ~50% dos Galaxy; Nike: ~50% dos tênis) — a rotação do trabalho barato segue o manual da TMD com novo endereço.',
    itens: [
      { rotulo: 'Eletrônicos (Samsung)', valor: '≈ US$ 80 bi/ano', nota: '~20% das exportações totais do Vietnã' },
      { rotulo: 'Têxteis e calçados (Nike/Adidas)', valor: '≈ US$ 30 bi/ano' },
    ],
    fonte: 'US Census · GSO Vietnã · 2024',
  },
  {
    id: 'det-bgd-eu', tier: 'detail', type: 'manufatura', from: [90.4, 23.7], to: 'eu', fromLabel: 'BGD', iso: '050', bend: 0.15, dur: 6.5, peso: 1.5,
    titulo: 'As costureiras de Bangladesh',
    totalAnual: '≈ US$ 22 bi / ano',
    did: '4 milhões de trabalhadores (85% mulheres) costuram roupa para a Europa por ~US$ 120/mês. Em 2013, o prédio Rana Plaza desabou e matou 1.134 costureiras — as marcas ocidentais sabiam dos riscos.',
    adv: 'Rana Plaza (2013): 1.134 mortos — símbolo da compressão salarial global (salário mínimo ≈ US$113/mês); 4 mi de trabalhadores, 85% mulheres, abastecendo H&M/Zara/Primark (TMD em versão têxtil).',
    itens: [
      { rotulo: 'Vestuário para a UE', valor: '≈ US$ 22 bi/ano', nota: '2º maior exportador mundial de roupa' },
      { rotulo: 'Rana Plaza (2013)', valor: '1.134 mortos', nota: 'o preço do fast fashion' },
    ],
    fonte: 'EPB Bangladesh · ILO · 2024',
  },

  /* ═══ COMMODITIES (base) ═══ */
  {
    id: 'com-bra-chn', type: 'commodities', from: 'brasil', to: 'china', bend: 0.24, dur: 8, peso: 3,
    titulo: 'Soja, minério e petróleo: o motor do Brasil profundo',
    totalAnual: '≈ US$ 95 bi / ano',
    did: 'Mais de 1 em cada 4 dólares que o Brasil recebe do mundo vem da China — em forma de saca de soja, tonelada de minério e barril de petróleo. É a maior rota de commodities do planeta.',
    adv: 'Primarização em estado puro (TMD): exporta-se trabalho incorporado + natureza baratos e importa-se manufatura/tecnologia — o déficit tecnológico fecha o ciclo da dependência.',
    itens: [
      { rotulo: 'Soja em grãos', valor: '≈ US$ 43 bi/ano', nota: '~70 mi t — China compra mais da metade da soja brasileira' },
      { rotulo: 'Minério de ferro', valor: '≈ US$ 27 bi/ano', nota: '~230 mi t para os altos-fornos chineses' },
      { rotulo: 'Petróleo cru (pré-sal)', valor: '≈ US$ 20 bi/ano', nota: 'a China virou o maior destino do óleo brasileiro' },
      { rotulo: 'Carne bovina e frango', valor: '≈ US$ 9 bi/ano', nota: 'proteína animal para a classe média chinesa' },
    ],
    fonte: 'Comex Stat/MDIC · GACC China · valores 2024 aprox.',
  },
  {
    id: 'com-aus-chn', type: 'commodities', from: 'aus', to: 'china', bend: 0.2, dur: 7, peso: 3,
    titulo: 'O minério que constrói a China',
    totalAnual: '≈ US$ 90 bi / ano',
    did: 'A Austrália vende para a China quase US$ 100 bilhões em MINÉRIO DE FERRO por ano — o maior fluxo de uma única commodity do planeta. Cada prédio chinês tem um pedaço do subsolo australiano.',
    adv: 'Maior fluxo bilateral de commodity do mundo (~60% do ferro importado pela China): interdependência assimétrica — Canberra depende da demanda, Pequim da qualidade do minério.',
    itens: [
      { rotulo: 'Minério de ferro', valor: '≈ US$ 85 bi/ano', nota: '~60% das importações chinesas de ferro (BHP/Rio Tinto/Fortescue)' },
      { rotulo: 'Gás natural (LNG)', valor: '≈ US$ 15 bi/ano', nota: 'Woodside/Santos' },
      { rotulo: 'Lítio e bauxita', valor: 'crescente', nota: 'insumo das baterias da transição energética' },
    ],
    fonte: 'DFAT Austrália · GACC · 2024 aprox.',
  },
  {
    id: 'com-rus-chn', type: 'commodities', from: 'russia', to: 'china', bend: 0.35, dur: 4.5, peso: 2.5,
    titulo: 'Petróleo e gás siberianos sob sanções',
    totalAnual: '≈ US$ 95 bi / ano',
    did: 'Depois das sanções ocidentais, o petróleo russo trocou de cliente: a China virou o comprador número 1 — pagando em yuan. As sanções empurraram a Rússia para os braços chineses.',
    adv: 'Sanções reorientaram o excedente energético russo ao leste: desconto Urals + liquidação em yuan consolidam o eixo Moscou–Pequim fora do SWIFT.',
    itens: [
      { rotulo: 'Petróleo bruto e derivados', valor: '≈ US$ 60 bi/ano', nota: 'Urals com desconto · rotas ESPO e marítimas' },
      { rotulo: 'Gás (Power of Siberia)', valor: '≈ US$ 10 bi/ano', nota: 'gasoduto Gazprom–PetroChina' },
      { rotulo: 'Carvão', valor: '≈ US$ 15 bi/ano' },
      { rotulo: 'Cobre e metais', valor: '≈ US$ 8 bi/ano' },
    ],
    fonte: 'GACC China · 2024 aprox.',
  },
  {
    id: 'com-bra-eu', type: 'commodities', from: 'brasil', to: 'eu', bend: 0.2, dur: 6.5, peso: 2,
    titulo: 'O café da manhã europeu é brasileiro',
    totalAnual: '≈ US$ 50 bi / ano',
    did: 'O café da manhã de Lisboa a Helsinque passa pelo Brasil: o café, o açúcar, o suco de laranja, o farelo de soja que alimenta os porcos europeus — e o minério das siderúrgicas.',
    adv: 'Exportação primária + semimanufaturados com baixo valor agregado retido: o suco de laranja de São Paulo responde por ~80% do mercado mundial.',
    itens: [
      { rotulo: 'Café', valor: '≈ US$ 5 bi/ano', nota: '1 em cada 3 xícaras do mundo é brasileira' },
      { rotulo: 'Açúcar', valor: '≈ US$ 6 bi/ano', nota: 'maior exportador global' },
      { rotulo: 'Farelo de soja', valor: '≈ US$ 8 bi/ano', nota: 'ração animal europeia' },
      { rotulo: 'Suco de laranja', valor: '≈ US$ 2 bi/ano', nota: '~80% do suco global é paulista' },
      { rotulo: 'Minério p/ siderurgia', valor: '≈ US$ 12 bi/ano' },
    ],
    fonte: 'Comex Stat · Eurostat · 2024 aprox.',
  },
  {
    id: 'com-ind-eu', type: 'commodities', from: 'india', to: 'eu', bend: -0.16, dur: 5.5, peso: 2,
    titulo: 'A farmácia do mundo e os tanques de refino',
    totalAnual: '≈ US$ 55 bi / ano',
    did: 'A Índia produz 20% dos REMÉDIOS genéricos do planeta — os comprimidos baratos que sustentam o SUS, a África e a Europa. Também refina petróleo russo barato e reexporta como diesel europeu.',
    adv: 'Genéricos indianos = ~20% do volume global (doses para o SUS e África); Urals descontados refinados em Jamnagar (Reliance) reexportados como diesel — arbitragem sanitária/energética da dependência.',
    itens: [
      { rotulo: 'Medicamentos genéricos', valor: '~20% do volume global', nota: '"a farmácia do mundo" (SUS compra em larga escala)' },
      { rotulo: 'Combustíveis refinados', valor: '≈ US$ 15 bi/ano', nota: 'óleo russo barato refinado e reexportado' },
      { rotulo: 'Têxteis e vestuário', valor: '≈ US$ 8 bi/ano' },
      { rotulo: 'Arroz Basmati', valor: '≈ US$ 4 bi/ano' },
    ],
    fonte: 'Pharmexcil · Eurostat · 2024 aprox.',
  },
  {
    id: 'com-sau-chn', type: 'commodities', from: 'sau', to: 'china', bend: 0.22, dur: 6, peso: 2,
    titulo: 'O óleo do reino para a fábrica do mundo',
    totalAnual: '≈ US$ 55 bi / ano',
    did: 'A Arábia Saudita vende ~US$ 50 bilhões em petróleo por ano para a China — e já aceita parte em YUAN. Um sinal de que o monopólio do dólar no óleo começa a rachar.',
    adv: 'Aramco → refinarias teapot chinesas; pagamentos parciais em CNY — primeira fissura formal no sistema petrodólar (com precedentes Rússia/Índia).',
    itens: [
      { rotulo: 'Petróleo bruto', valor: '≈ US$ 50 bi/ano', nota: 'Aramco' },
      { rotulo: 'Petroquímicos', valor: '≈ US$ 5 bi/ano' },
    ],
    fonte: 'GACC · Aramco filings · 2024 aprox.',
  },

  /* ═══ DETALHE — commodities regionais (zoom) ═══ */
  {
    id: 'det-civ-eu', tier: 'detail', type: 'commodities', from: [-5.5, 7.5], to: 'eu', fromLabel: 'CIV', iso: '384', bend: 0.18, dur: 6, peso: 1.5,
    titulo: 'Cacau: o ouro marrom que não enriquece',
    totalAnual: '≈ US$ 4 bi / ano',
    did: 'A Costa do Marfim produz 40% do cacau do mundo. O chocolate que isso vira vale dezenas de bilhões na Europa — o país fica com migalhas e usa trabalho infantil em larga escala.',
    adv: 'Cadeia do cacau: CIV/GHA produzem ~60% do global; processamento/marca na UE capturam o valor — traders suíços (Cargill, Barry Callebaut) intermediam; trabalho infantil ~1,5 mi de crianças (NORC).',
    itens: [
      { rotulo: 'Cacau em grãos', valor: '≈ US$ 4 bi/ano', nota: '~40% da produção mundial' },
      { rotulo: 'Contraste', valor: 'mercado global de chocolate ≈ US$ 130 bi', nota: 'onde fica o valor' },
    ],
    fonte: 'ICCO · Barry Callebaut · 2024',
  },
  {
    id: 'det-cod-chn', tier: 'detail', type: 'commodities', from: [23, -5], to: 'china', fromLabel: 'COD', iso: '180', bend: 0.15, dur: 6.5, peso: 1.5,
    titulo: 'Cobalto do Congo para as baterias chinesas',
    totalAnual: '≈ US$ 10 bi / ano',
    did: 'O RD Congo fornece ~70% do COBALTO do mundo — o metal das baterias de carro elétrico e celular. Minado em parte por garimpeiros, incluindo crianças, para alimentar a "transição verde" de fora.',
    adv: 'Cobalto (CMOC/Glencore + garimpo): ~70% global; refino chinês >75% — a "transição energética" do Norte/leste reproduz o padrão extrativista do EP04 (borracha → cobalto).',
    itens: [
      { rotulo: 'Cobalto', valor: '~70% da produção mundial', nota: 'Katanga/Lualaba' },
      { rotulo: 'Cobre', valor: '≈ US$ 8 bi/ano', nota: 'CMOC (CHN) · Glencore (CHE)' },
    ],
    fonte: 'USGS · 2024',
  },
  {
    id: 'det-zaf-chn', tier: 'detail', type: 'commodities', from: 'zaf', to: 'china', bend: 0.2, dur: 6.5, peso: 1.5,
    titulo: 'Platina e minério sul-africanos',
    totalAnual: '≈ US$ 15 bi / ano',
    did: 'A África do Sul exporta para a China platina (dos catalizadores dos carros), minério de ferro e carvão — com os salários mais comprimidos da mineração profunda.',
    adv: 'Complexo mineral-energético legado do apartheid: platina (~80% global), ferro e carvão para a indústria chinesa — superexploração histórica racializada (Wolpe).',
    itens: [
      { rotulo: 'Platina e metais do grupo', valor: '~80% da produção mundial' },
      { rotulo: 'Minério de ferro e carvão', valor: '≈ US$ 10 bi/ano' },
    ],
    fonte: 'SARS · Minerals Council SA · 2024',
  },
  {
    id: 'det-zaf-eu', tier: 'detail', type: 'commodities', from: 'zaf', to: 'eu', bend: 0.16, dur: 6, peso: 1.5,
    titulo: 'Platina, frutas e vinho para a antiga metrópole',
    totalAnual: '≈ US$ 8 bi / ano',
    did: 'A Europa compra da África do Sul platina, ferro, frutas cítricas e VINHO — o vinho que os colonos holandeses e franceses começaram a fazer com trabalho escravizado nos séculos XVII-XVIII.',
    adv: 'Rota colonial preservada: UE é o 2º maior parceiro comercial; vinho/frutas do Western Cape (estrutura fundiária colonial intacta).',
    itens: [
      { rotulo: 'Platina e metais', valor: '≈ US$ 3 bi/ano' },
      { rotulo: 'Frutas cítricas e vinho', valor: '≈ US$ 2 bi/ano', nota: 'Western Cape: estrutura fundiária colonial' },
    ],
    fonte: 'SARS · Eurostat · 2024',
  },
  {
    id: 'det-gha-chn', tier: 'detail', type: 'commodities', from: [-1.2, 7.9], to: 'china', fromLabel: 'GHA', iso: '288', bend: 0.18, dur: 6.5, peso: 1.5,
    titulo: 'Ouro do Gana para as reservas chinesas',
    totalAnual: '≈ US$ 6 bi / ano',
    did: 'O Gana é o maior produtor de ouro da África — e a China é o maior comprador. Mineração ilegal chinesa (galamsey) destrói rios inteiros com mercúrio, repetindo o envenenamento do EP01.',
    adv: 'Galamsey (mineração ilegal chinesa): mercúrio nos rios Pra/Offin — repetição literal do padrão colonial de Potosí (EP01) com novo suserano; ouro como reserva do Banco Central de Gana.',
    itens: [
      { rotulo: 'Ouro', valor: '≈ US$ 6 bi/ano', nota: 'maior produtor africano' },
      { rotulo: 'Custo', valor: 'rios envenenados por mercúrio', nota: 'galamsey ilegal' },
    ],
    fonte: 'Ghana Chamber of Mines · 2024',
  },
  {
    id: 'det-per-chn', tier: 'detail', type: 'commodities', from: [-75.5, -10], to: 'china', fromLabel: 'PER', iso: '604', bend: 0.25, dur: 7, peso: 1.5,
    titulo: 'Cobre do Peru para as fábricas chinesas',
    totalAnual: '≈ US$ 14 bi / ano',
    did: 'O Peru é o segundo maior produtor de cobre do mundo — e a China compra quase tudo: Las Bambas (chinesa MMG) já parou várias vezes por protestos de comunidades indígenas.',
    adv: 'Las Bambas (MMG-CHN), Antamina: cobre peruano para a indústria chinesa; conflitos socioambientais recorrentes com comunidades andinas — extrativismo de enclave clássico.',
    itens: [
      { rotulo: 'Cobre', valor: '≈ US$ 14 bi/ano', nota: '2º maior produtor mundial' },
      { rotulo: 'Conflitos', valor: 'Las Bambas bloqueada 4 vezes', nota: 'comunidades Quechua vs MMG (CHN)' },
    ],
    fonte: 'BCRP · MINEM · 2024',
  },
  {
    id: 'det-arg-chn', tier: 'detail', type: 'commodities', from: [-64, -34.5], to: 'china', fromLabel: 'ARG', iso: '032', bend: 0.22, dur: 7, peso: 1.5,
    titulo: 'Soja e lítio argentinos',
    totalAnual: '≈ US$ 9 bi / ano',
    did: 'A Argentina vende soja, carne e começa a exportar LÍTIO (o metal das baterias) para a China — enquanto negocia moeda-swap para pagar dívidas. O mesmo desenho do Brasil, mais ao sul.',
    adv: 'Complexo sojeiro + triângulo do lítio (Jujuy/SQM): swap PBoC-BCRA para rolar dívida — dependência dupla (comercial chinesa × financeira FMI).',
    itens: [
      { rotulo: 'Soja e derivados', valor: '≈ US$ 6 bi/ano' },
      { rotulo: 'Lítio do triângulo andino', valor: 'crescente', nota: 'Jujuy/Salta/Catamarca' },
    ],
    fonte: 'INDEC · 2024',
  },
  {
    id: 'det-idn-chn', tier: 'detail', type: 'commodities', from: 'idn', to: 'china', bend: 0.18, dur: 6, peso: 1.5,
    titulo: 'Níquel indonésio para as baterias chinesas',
    totalAnual: '≈ US$ 7 bi / ano',
    did: 'A Indonésia proibiu exportar níquel "bruto" para forçar o processamento local — e as empresas chinesas construíram siderúrgicas lá. O valor agregado subiu, mas os custos ambientais e humanos também.',
    adv: 'Downstream policy (2020 ban): fundições RKEF chinesas em Sulawesi — industrialização com enclaves de carvão, danos ambientais e dependência tecnológica invertida (semi-periferia negociando com o centro chinês).',
    itens: [
      { rotulo: 'Níquel processado (NPI/matte)', valor: '≈ US$ 7 bi/ano', nota: 'Harita/Tsingshan em Sulawesi' },
      { rotulo: 'Custo', valor: 'desmatamento e poluição marinha', nota: 'Sulawesi Central' },
    ],
    fonte: 'BPS Indonesia · 2024',
  },
  {
    id: 'det-col-usa', tier: 'detail', type: 'commodities', from: [-74, 4.5], to: 'usa', fromLabel: 'COL', iso: '170', bend: 0.12, dur: 6, peso: 1.5,
    titulo: 'Petróleo colombiano e flores para os EUA',
    totalAnual: '≈ US$ 12 bi / ano',
    did: 'A Colômbia exporta petróleo e FLORES para os EUA — rosas colombianas no Dia dos Namorados americano, colhidas por trabalhadoras com jornadas exaustivas.',
    adv: 'Petróleo (Ecopetrol+ocidentais) ≈ 40% das exportações; flores de Bogotá/Medellín: cadeia feminizada de baixo salário para o consumo sazonal norte-americano.',
    itens: [
      { rotulo: 'Petróleo', valor: '≈ US$ 8 bi/ano' },
      { rotulo: 'Flores', valor: '≈ US$ 1,5 bi/ano', nota: '2º maior exportador mundial' },
    ],
    fonte: 'DANE · 2024',
  },
  {
    id: 'det-egy-eu', tier: 'detail', type: 'commodities', from: [30.5, 26.5], to: 'eu', fromLabel: 'EGY', iso: '818', bend: 0.14, dur: 6, peso: 1.5,
    titulo: 'Gás, algodão e o pedágio de Suez',
    totalAnual: '≈ US$ 8 bi / ano (+ pedágio do canal)',
    did: 'O Egito exporta gás, algodão e frutas para a Europa — e cobra o PEDÁGIO do Canal de Suez, por onde passa 12% do comércio mundial. Mas os ataques no Mar Vermelho derrubaram essa receita em 60% em 2024, e o país mergulhou na crise.',
    adv: 'Suez: ~12% do comércio global, receita de trânsito US$9-10 bi/ano pré-2024, -60% com ataques Houthis — renda de passagem como variável crítica do BOP egípcio (BRICS+ partner, 2024).',
    itens: [
      { rotulo: 'Gás natural (LNG)', valor: '≈ US$ 4 bi/ano', nota: 'Zohr field, mediterrâneo' },
      { rotulo: 'Algodão e frutas', valor: '≈ US$ 2 bi/ano', nota: 'o algodão egípcio vestiu a Europa desde o séc. XIX' },
      { rotulo: 'Canal de Suez (pedágio)', valor: '≈ US$ 9-10 bi/ano (pré-2024)', nota: '-60% em 2024 com a crise do Mar Vermelho' },
    ],
    fonte: 'Suez Canal Authority · IMF · 2024',
  },

  /* ═══ VAZA DE MAIS-VALIA ═══ */
  {
    id: 'drn-bra-usa', type: 'drain', from: 'brasil', to: 'usa', bend: -0.2, dur: 6.5, peso: 2.5,
    titulo: 'A fatura: como o capital americano tira do Brasil',
    totalAnual: '≈ US$ 40–55 bi/ano (conta de rendas BCB)',
    did: 'Empresas americanas no Brasil mandam lucro para casa, cobram royalties por marca e tecnologia, e ficam com a taxa de cada cartão passado. É dinheiro que o Brasil gera todos os anos e que não volta.',
    adv: 'Remessa de rendas de propriedade (TMD, canal 3): royalties de marca/tecnologia + dividendos de filiais + taxas de infraestrutura de pagamento — dreno anual dentro dos R$ 195–294 bi (ILAESE).',
    itens: [
      { rotulo: 'Remessas de lucros e dividendos (todas as matrizes)', valor: '≈ US$ 40–55 bi/ano', nota: 'conta de rendas do BCB · ILAESE: R$ 195–294 bi' },
      { rotulo: 'Royalties e serviços de Big Techs (Microsoft, Google, IBM)', valor: '≈ US$ 12 bi/ano (est.)', nota: 'licenças de software, cloud e patentes' },
      { rotulo: 'Taxas de cartão (Visa/Mastercard)', valor: '≈ US$ 5 bi/ano (est.)', nota: 'cada passagem de cartão paga taxa fixada em dólar' },
      { rotulo: 'Netflix, McDonald\u2019s, farmacêuticas', valor: '≈ US$ 8 bi/ano (est.)', nota: 'dividendos e juros sobre capital próprio' },
      { rotulo: 'Royalties de sementes e agroquímicos (Bayer/Monsanto)', valor: '≈ US$ 1–2 bi/ano (est.)', nota: 'tecnologia Intacta embutida em cada saca de soja' },
    ],
    fonte: 'ILAESE · Banco Central do Brasil · estimativas didáticas',
  },
  {
    id: 'drn-bra-eu', type: 'drain', from: 'brasil', to: 'eu', bend: 0.14, dur: 7, peso: 2,
    titulo: 'Dividendos que atravessam o Atlântico',
    totalAnual: '≈ US$ 10 bi+/ano',
    did: 'A Ambev manda lucro para a dona belga AB InBev; metade das ações da Vale está em mãos estrangeiras; a Vivo remete para a Telefônica espanhola; o Santander para a Espanha; a TIM para a Itália. Lucro gerado aqui, dividido lá.',
    adv: 'Descentralização de sede × centralização de propriedade: AB InBev (BE), Vale (free float ~50% exterior), Telefônica (ES), TIM (IT), Nestlé (CH), Unilever (UK) — cadeia de dividendos que drena o excedente nacional.',
    itens: [
      { rotulo: 'Ambev → AB InBev (Bélgica)', valor: '≈ US$ 2,5–3 bi/ano', nota: 'dividendos para a maior cervejaria do mundo' },
      { rotulo: 'Vale → acionistas estrangeiros', valor: '≈ US$ 4 bi/ano', nota: '~50% do free float é de fora' },
      { rotulo: 'Vivo → Telefônica (Espanha)', valor: '≈ US$ 1,5 bi/ano (est.)', nota: 'dividendos da maior telefônica do país' },
      { rotulo: 'Santander Brasil → Espanha', valor: '≈ US$ 1 bi/ano' },
      { rotulo: 'TIM → Itália · royalties Nestlé (CH) e Unilever (UK)', valor: 'incluído' },
    ],
    fonte: 'relatórios anuais · CVM · estimativas',
  },
  {
    id: 'drn-mex-usa', type: 'drain', from: 'mex', to: 'usa', bend: -0.12, dur: 6, peso: 2,
    titulo: 'Nearshoring: o lucro fica do outro lado da fronteira',
    totalAnual: '≈ US$ 45 bi+/ano (conta de rendas)',
    did: 'As fábricas "mexicanas" da GM, Ford, Audi e Samsung montam carros e TVs para os EUA — e o lucro atravessa a fronteira de volta. Enquanto isso, os mexicanos que trabalham nos EUA mandam para casa US$ 63 bi de remessas: o suor volta, mas em gotas.',
    adv: 'Maquiladora/nearshoring: lucros de montagem remetidos às matrizes (conta de rendas ≈US$45 bi) vs remessas de trabalhadores (≈US$63 bi) — o Sul fornece trabalho DUAS vezes (na fábrica e via diáspora) e o Norte devolve o preço do trabalho, não o valor gerado.',
    itens: [
      { rotulo: 'Lucros de montadoras/maquiladoras (GM, Ford, Audi, Samsung)', valor: '≈ US$ 30 bi+/ano (est.)', nota: 'conta de rendas do IDE' },
      { rotulo: 'Royalties e serviços corporativos', valor: '≈ US$ 8 bi/ano (est.)' },
      { rotulo: 'Contraponto — remessas de migrantes ENTRAM', valor: '≈ US$ 63 bi/ano', nota: 'o trabalho da diáspora voltando em gotas (Banco de México)' },
    ],
    fonte: 'Banco de México · BEA (US) · 2024 aprox.',
  },
  {
    id: 'drn-afr-eu', type: 'drain', from: [17, 2], to: 'eu', fromLabel: 'ÁFRICA', bend: 0.18, dur: 7.5, peso: 2,
    titulo: 'Do continente drenado para as sedes europeias',
    totalAnual: '≈ US$ 80 bi+/ano (est. agregada)',
    did: 'Nigéria (Shell, Eni), RD Congo (Glencore, suíça), África do Sul (Anglo American listada em LONDRES), cacau da Costa do Marfim (Nestlé, Cargill): a África exporta riqueza bruta e importa o produto acabado — com o lucro ficando na Europa.',
    adv: 'Agregado de extração + renda de propriedade: petróleo (Shell/Eni), minerais (Glencore–Suíça; Anglo American–LSE), cacau (traders suíços/europeus) — o processamento e a marca ficam no Norte (Rodney: subdesenvolvimento como produção ativa).',
    itens: [
      { rotulo: 'Petróleo da Nigéria (Shell/Eni/Exxon)', valor: '≈ US$ 10–15 bi/ano lucros (hist.)', nota: 'Delta do Níger: derramamentos ≈ 1 Exxon Valdez/ano' },
      { rotulo: 'Mineração (Glencore–Suíça · Anglo American–LSE)', valor: 'dividendos → Suíça/Londres', nota: 'cobalto/cobre do Congo · platina da África do Sul' },
      { rotulo: 'Cacau (Nestlé, Cargill, Barry Callebaut)', valor: '~70% do cacau mundial', nota: 'processamento e marca ficam na Europa' },
      { rotulo: 'Franco CFA — 14 países', valor: 'política monetária em Paris', nota: 'reservas depositadas no Tesouro francês até 2020' },
    ],
    fonte: 'estimativas agregadas · UNCTAD · Amnesty/UNEPA · 2024',
  },
  {
    id: 'drn-idn-usa', type: 'drain', from: 'idn', to: 'usa', bend: 0.3, dur: 9, peso: 1.5,
    titulo: 'A montanha de ouro de Papuá',
    totalAnual: '≈ US$ 2–4 bi/ano (Grasberg)',
    did: 'A Freeport-McMoRan (EUA) explora a maior mina de ouro e cobre do PLANETA em West Papua, Indonésia — desde 1967, três anos depois do massacre que abriu o país (EP05). Os lucros atravessam o Pacífico para o Arizona.',
    adv: 'Freeport-McMoRan/Grasberg (contrato de 1967, pós-massacre — EP05): uma das maiores reservas de Au/Cu do mundo; dividendos + royalties mínimos — externalização socioambiental sobre os povos Amungme/Kamoro (tailings no rio Aikwa).',
    itens: [
      { rotulo: 'Freeport-McMoRan (Grasberg)', valor: '≈ US$ 2–4 bi/ano', nota: 'ouro + cobre; contrato assinado 3 anos após o massacre' },
      { rotulo: 'Dividendos ao Estado indonésio (MIND ID)', valor: 'parcela minoritária (51%)', nota: 'pós-renegociação de 2018' },
      { rotulo: 'Custos socioambientais', valor: 'Papua', nota: 'rejeitos despejados no sistema fluvial Aikwa' },
    ],
    fonte: 'Freeport-McMoRan filings · 2024 aprox.',
  },
  {
    id: 'drn-chl-usa', type: 'drain', from: [-70.6, -33.5], to: 'usa', fromLabel: 'CHL', iso: '152', bend: -0.28, dur: 8.5, peso: 1.5,
    titulo: 'Lítio e cobre para a transição alheia',
    totalAnual: '≈ US$ 10 bi+/ano (est.)',
    did: 'O Chile tem parte do LÍTIO do planeta — o metal das baterias "verdes" — e um dos maiores cobres. Quem embolsa boa parte: Albemarle (EUA), BHP e Rio Tinto (Austrália/Reino Unido). A transição energética do Norte é financiada pelo subsolo do Sul.',
    adv: 'Salar de Atacama (Albemarle/SQM): lítio para as baterias do Norte; Escondida (BHP/Rio Tinto): ~25% do cobre mundial — renda da transição energética capturada por matrizes do centro (acumulação verde-dependente).',
    itens: [
      { rotulo: 'Albemarle (EUA) — lítio do Atacama', valor: '≈ US$ 3–5 bi/ano (ciclo 2022–24)', nota: 'matéria-prima das baterias "verdes"' },
      { rotulo: 'Escondida (BHP/Rio Tinto) — cobre', valor: '≈ US$ 8–12 bi/ano (operação)', nota: 'a maior mina de cobre do mundo' },
      { rotulo: 'SQM', valor: '~30% capital estrangeiro', nota: 'Tianqi (China) como sócia estratégica' },
    ],
    fonte: 'filings · COCHILCO · 2024 aprox.',
  },
  {
    id: 'drn-arg-usa', type: 'drain', from: [-64, -34.5], to: 'usa', fromLabel: 'ARG', iso: '032', bend: -0.34, dur: 8, peso: 1.5,
    titulo: 'A dívida que nunca termina',
    totalAnual: '≈ US$ 15–20 bi/ano (juros + serviço)',
    did: 'A Argentina já deu calote várias vezes — mas quem perde não são os fundos: eles voltam a emprestar com juros maiores. Chevron e Shell exploram o gás de Vaca Muerta; o FMI cobra austeridade. O ajuste é sempre pago em salários.',
    adv: 'Ciclo dívida → default → reestruturação: serviço ≈US$15–20 bi/ano; programa FMI (US$44 bi) + Vaca Muerta (Chevron/Exxon/Total) — disciplinamento via crise (TMD + Pilar 3: restrição cambial real).',
    itens: [
      { rotulo: 'Serviço da dívida (juros + principal rolado)', valor: '≈ US$ 15–20 bi/ano', nota: 'programa do FMI: US$ 44 bi' },
      { rotulo: 'Vaca Muerta — Chevron/Exxon/Total', valor: '≈ US$ 5 bi+/ano invest.', nota: 'shale gas e shale oil' },
      { rotulo: 'Remessas de lucros estrangeiros', valor: '≈ US$ 5 bi/ano (est.)' },
    ],
    fonte: 'BCRA · FMI · 2024 aprox.',
  },
  {
    id: 'drn-ind-usa', type: 'drain', from: 'india', to: 'usa', bend: 0.16, dur: 9, peso: 2.5,
    titulo: 'A conta que a Índia paga às Big Techs',
    totalAnual: '≈ US$ 25 bi+/ano (est.)',
    did: 'Cada anúncio do Google visto na Índia, cada assinatura de Amazon Prime, cada taxa de cartão: uma parte vira lucro remetido para a Califórnia. E a conta histórica do colonialismo já somou US$ 45 trilhões (EP03).',
    adv: 'Canal 3 da TMD em versão digital: renda de publicidade/cloud/taxas remetida às matrizes — continuidade do drain of wealth (Patnaik: US$45 tri, 1765–1938).',
    itens: [
      { rotulo: 'Publicidade Google/Meta na Índia', valor: '≈ US$ 10 bi/ano (est.)', nota: 'anunciantes pagam em rúpias, lucro sai em dólar' },
      { rotulo: 'Cloud e software (Microsoft, Amazon, IBM)', valor: '≈ US$ 6 bi/ano (est.)', nota: '1.600+ "Global Capability Centers" gerando lucro p/ matrizes' },
      { rotulo: 'Taxas de cartão (Visa/Mastercard)', valor: '≈ US$ 4 bi/ano (est.)' },
      { rotulo: 'Hindustan Unilever → Unilever (UK)', valor: '≈ US$ 1 bi/ano', nota: 'dividendos da maior FMCG do país' },
      { rotulo: 'Royalties (Vodafone Idea, Starbucks, Coca-Cola)', valor: 'incluído' },
    ],
    fonte: 'estimativas didáticas · EP03 para o histórico',
  },

  /* ═══ LUCRO FANTASMA (paraísos fiscais) — Zucman/Tørsløv-Wier/TJN ═══ */
  {
    id: 'fant-usa-irl', type: 'fantasma', from: 'usa', to: [-5.3, 53.2], fromLabel: 'EUA', toLabel: 'IRL', iso: '372',
    bend: -0.15, dur: 7, peso: 2,
    titulo: 'Irlanda: a contabilidade que inflou um país',
    totalAnual: '≈ US$ 140 bi/ano deslocados (est.)',
    did: 'Grandes empresas americanas "sediaram" seus lucros na Irlanda por causa dos impostos baixos. Em 2015, a contabilidade ficou tão absurda que o PIB irlandês "cresceu" 26% NUM ANO — apelidado de "economia dos leprechauns". O dinheiro nunca esteve lá: só o papel.',
    adv: 'Missing Profits (Tørsløv–Wier–Zucman): a Irlanda captura lucros deslocados equivalentes a ~20% do PIB; "leprechaun economics" (2015, +26% PIB) via transferência de ativos intangíveis; Double Irish Dutch Sandwich vigente até 2020.',
    itens: [
      { rotulo: 'Lucros deslocados para a Irlanda', valor: '≈ US$ 140 bi/ano (est.)', nota: '~20% do PIB irlandês é papel contábil' },
      { rotulo: 'Caixa offshore da Apple (pré-2018)', valor: '≈ US$ 250 bi', nota: 'o maior estoque corporativo offshore da história' },
      { rotulo: 'Perda de arrecadação dos outros países', valor: 'dezenas de bi/ano', nota: 'TJN: US$ 480 bi/ano perdidos no mundo' },
    ],
    fonte: 'Tørsløv–Wier–Zucman (Missing Profits) · TJN · 2024',
  },
  {
    id: 'fant-eu-lux', type: 'fantasma', from: 'eu', to: [6.1, 49.6] as [number, number], fromLabel: 'UE', toLabel: 'LUX', iso: '442',
    bend: 0.2, dur: 6.5, peso: 1.5,
    titulo: 'Luxemburgo: o país-gaveta da Europa',
    totalAnual: '≈ US$ 130 bi/ano de lucros capturados',
    did: 'O Luxemburgo tem 600 mil habitantes e captura mais de US$ 130 bilhões de lucros de empresas que operam EM OUTROS países. Os LuxLeaks (2014) mostraram 340 empresas com acordos secretos de imposto — algumas pagando menos de 1%.',
    adv: 'LuxLeaks (2014, ICIJ): 340+ rulings fiscais secretos; Zucman: Luxemburgo captura ~US$130 bi/ano de lucros estrangeiros — fundo de investimento + estruturas de royalties como máquinas de deslocamento.',
    itens: [
      { rotulo: 'Lucros estrangeiros capturados', valor: '≈ US$ 130 bi/ano', nota: 'Zucman (Missing Profits)' },
      { rotulo: 'LuxLeaks (2014)', valor: '340+ acordos secretos expostos', nota: 'Amazon, Pepsi, IKEA entre os beneficiados' },
      { rotulo: 'PIB per capita do Luxemburgo', valor: '3× a média da UE', nota: 'inflado pela contabilidade' },
    ],
    fonte: 'Zucman (Missing Profits) · ICIJ LuxLeaks · 2024',
  },
  {
    id: 'fant-usa-cym', type: 'fantasma', from: 'usa', to: [-81.2, 19.3] as [number, number], fromLabel: 'EUA', toLabel: 'CYM',
    bend: 0.18, dur: 7, peso: 1.5,
    titulo: 'Ilhas Cayman: 100 mil pessoas, trilhões em fundos',
    totalAnual: '≈ US$ 70 bi/ano de lucros deslocados',
    did: 'As Ilhas Cayman têm 100 mil habitantes — e guardam TRILHÕES de dólares em fundos de investimento. Um prédio em Cayman já foi "sede" de 18 mil empresas ao mesmo tempo. Bermuda captura mais lucro deslocado PER CAPITA que qualquer lugar do mundo.',
    adv: 'Cayman: ~US$1 tri+ em fundos; Bermuda lidera per capita o deslocamento de lucros (Zucman); hedge funds e seguros como veículos — o endereço como produto financeiro.',
    itens: [
      { rotulo: 'Lucros deslocados (Cayman)', valor: '≈ US$ 70 bi/ano (est.)' },
      { rotulo: 'Bermuda', valor: '#1 mundial per capita', nota: 'seguros e reseguros' },
      { rotulo: 'Riqueza offshore global', valor: '≈ US$ 10–12 tri', nota: 'Zucman (Hidden Wealth)' },
    ],
    fonte: 'Zucman (Hidden Wealth) · FSB · 2024',
  },
  {
    id: 'fant-asia-sgp', type: 'fantasma', from: 'china', to: [103.8, 1.35] as [number, number], fromLabel: 'ÁSIA', toLabel: 'SGP',
    bend: 0.15, dur: 6.5, peso: 1.5,
    titulo: 'Cingapura e Hong Kong: os cofres da Ásia',
    totalAnual: '≈ US$ 150 bi+ em fluxos de capital (est.)',
    did: 'Na Ásia, o papel-moeda do esquema tem endereço: Cingapura e Hong Kong concentram os lucros deslocados das multinacionais e a riqueza das elites da região — inclusive de bilionários chineses protegendo dinheiro do próprio governo.',
    adv: 'Hubs asiáticos: SGP/HK como centros de wealth management e holding — deslocamento de lucros intra-asiático + fuga de capitais chinesa; a geografia do fantasma tem três polos (Atlântico, Europa continental, Ásia).',
    itens: [
      { rotulo: 'Riqueza privada gerida em SGP/HK', valor: '≈ US$ 4–5 tri', nota: 'wealth management asiático' },
      { rotulo: 'Papel no esquema China', valor: 'holdings de bilionários', nota: 'proteção contra o próprio centro político' },
    ],
    fonte: 'Zucman · BIS · 2024 aprox.',
  },

  /* ═══ DÓLAR ═══ */
  {
    id: 'fin-usa-eu', type: 'dollar', from: 'usa', to: 'eu', bend: -0.2, dur: 7.5, peso: 2,
    titulo: 'A aliança atlântica é financeira antes de ser militar',
    totalAnual: '≈ US$ 1,6 tri em Treasuries europeus',
    did: 'A Europa guarda mais de US$ 1,5 TRILHÃO em títulos do governo americano. O dinheiro do Velho Mundo financia o déficit do Novo — e é por isso que sanções em dólar machucam os dois lados juntos.',
    adv: 'Treasuries na Europa (Bélgica+Irlanda como hubs de clearing ≈ US$1,6 tri): a aliança OTAN tem copropriedade financeira; clearing USD integra sistemas bancários — e expõe às mesmas sanções.',
    itens: [
      { rotulo: 'Treasuries na Europa (incl. hubs de clearing)', valor: '≈ US$ 1,6 tri', nota: 'Bélgica e Irlanda como intermediários' },
      { rotulo: 'Clearing em dólar', valor: '~todos os grandes bancos', nota: 'acesso SWIFT/CHIPS como instrumento de poder' },
      { rotulo: 'Gasto militar OTAN', valor: 'US$ 1,5 tri/ano', nota: '55% do mundo (SIPRI 2024)' },
    ],
    fonte: 'US Treasury TIC · SIPRI 2024',
  },
  {
    id: 'fin-usa-bra', type: 'dollar', from: 'usa', to: 'brasil', bend: -0.16, dur: 6, peso: 2,
    titulo: 'O dólar dentro da economia brasileira',
    totalAnual: '≈ US$ 240 bi em Treasuries nas reservas',
    did: 'O Brasil guarda ~US$ 240 bilhões em títulos do governo americano. E a soja, o petróleo e o minério brasileiros são cotados EM DÓLAR: quando o Fed sobe juros, o real cai — e o preço do feijão sobe. O dólar americano decide o custo de vida brasileiro.',
    adv: 'Reservas em Treasuries ≈ US$240 bi + precificação dolarizada de commodities + dívida corporativa externa: a política do Fed transmite-se ao custo de vida — hierarquia monetária (THEORY.md, Pilar 3).',
    itens: [
      { rotulo: 'Reservas brasileiras em Treasuries', valor: '≈ US$ 240 bi', nota: 'a "confiança" estatal ancorada no dólar' },
      { rotulo: 'Commodities cotadas em USD', valor: 'soja, ferro, petróleo', nota: 'câmbio vira política de renda' },
      { rotulo: 'Dívida corporativa em USD', valor: 'rolagem por ciclo do Fed' },
      { rotulo: 'Histórico FMI 1998/2002', valor: 'condicionalidades', nota: 'austeridade como preço do socorro' },
    ],
    fonte: 'US Treasury TIC · BCB · 2024',
  },

  /* ═══ BRICS ═══ */
  {
    id: 'brics-chn-rus', type: 'brics', from: 'china', to: 'russia', bend: -0.3, dur: 5, peso: 2,
    titulo: 'Comércio que pulou o dólar',
    totalAnual: '>90% liquidado em yuan/rublo',
    did: 'Rússia e China fazem hoje mais de 90% do comércio entre elas SEM usar dólar — em yuan e rublos. É o maior caso real de desdolarização do planeta, nascido das sanções.',
    adv: 'Pós-2022: >90% do comércio RUS–CHN em moedas locais; CIPS como clearing alternativo; yuan como reserva emergente dos sancionados.',
    itens: [
      { rotulo: 'Comércio total RUS–CHN', valor: '≈ US$ 245 bi/ano', nota: 'recorde histórico' },
      { rotulo: 'Liquidação em moedas locais', valor: '>90%', nota: 'yuan + rublo' },
      { rotulo: 'CIPS (clearing chinês)', valor: 'crescimento de 2 dígitos/ano', nota: 'alternativa ao SWIFT' },
    ],
    fonte: 'GACC · PBoC · 2024',
  },
  {
    id: 'brics-chn-bra', type: 'brics', from: 'china', to: 'brasil', bend: 0.26, dur: 10, peso: 1.5,
    titulo: 'O real e o yuan apertando as mãos',
    totalAnual: 'swap de R$ 190 bi BCB–PBoC',
    did: 'Brasil e China já fecharam acordo para comércio em YUAN (via banco ICBC), e os bancos centrais têm um swap de R$ 190 bilhões. Ainda é pequeno perto do dólar — mas é a primeira rachadura oficial na América do Sul.',
    adv: 'Swap BCB–PBoC (2013) + liquidação em yuan via ICBC (2023): infraestrutura embrionária de desdolarização bilateral; escala ainda marginal vs. stock USD.',
    itens: [
      { rotulo: 'Swap BCB–PBoC', valor: 'R$ 190 bi', nota: 'linha de defesa cambial sem dólar' },
      { rotulo: 'Comércio BR–CHN em yuan', valor: 'piloto via ICBC', nota: '2023+' },
      { rotulo: 'mBridge (CBDC)', valor: 'piloto BIS', nota: 'moeda digital cross-border do BRICS+' },
    ],
    fonte: 'BCB · PBoC · 2023/24',
  },
  {
    id: 'brics-ind-rus', type: 'brics', from: 'india', to: 'russia', bend: -0.24, dur: 5.5, peso: 1.5,
    titulo: 'Óleo russo pago em rúpias (e o problema delas)',
    totalAnual: '≈ US$ 50 bi/ano de óleo',
    did: 'A Índia virou a maior compradora de petróleo russo COM DESCONTO — pagando em rúpias e dirhams. O problema: a Rússia acumula rúpias que não consegue gastar e passa a exigir YUAN. O dólar está sendo contornado, mas o substituto ainda não existe.',
    adv: 'Desconto Urals → Índia (≈US$50 bi/ano): rupee-ruble trap força migração parcial a CNY/AED — fragmentação monetária sem substituto hegemônico pronto (multipolaridade assimétrica).',
    itens: [
      { rotulo: 'Óleo russo para a Índia', valor: '≈ US$ 50 bi/ano', nota: 'desconto Urals de US$ 10–20 por barril' },
      { rotulo: 'Pagamentos', valor: 'rúpias · dirhams · yuan', nota: 'a "armadilha da rúpia"' },
      { rotulo: 'Refino e reexportação', valor: 'diesel para a UE', nota: 'a arbitragem indiana' },
    ],
    fonte: 'Kpler · Reuters · 2024 aprox.',
  },

  /* ═══ DETALHE EXTRA — mais rotas por país no zoom ═══ */
  {
    id: 'det-chl-chn', tier: 'detail', type: 'commodities', from: [-70.6, -33.5], to: 'china', fromLabel: 'CHL', iso: '152', bend: -0.28, dur: 7, peso: 1.5,
    titulo: 'O cobre do deserto mais seco do mundo',
    totalAnual: '≈ US$ 14 bi/ano',
    did: 'Do deserto do Atacama sai 1 em cada 4 quilos de cobre do planeta — quase tudo para a China. A mina Escondida, a maior do mundo, é controlada por Austrália e Reino Unido: o Chile entra com o subsolo, os outros ficam com o lucro.',
    adv: 'Escondida (BHP/Rio Tinto) + Codelco estatal: cobre como 50%+ da pauta exportadora; renda mineira privatizada via DL-600 e royalty tardio — extrativismo de enclave com Estado subsidiário.',
    itens: [
      { rotulo: 'Cobre refinado e concentrado', valor: '≈ US$ 14 bi/ano', nota: '~25% da produção mundial' },
      { rotulo: 'Lítio do Salar de Atacama', valor: '≈ US$ 3 bi/ano', nota: 'SQM + Albemarle (EUA)' },
    ],
    fonte: 'Cochilco · 2024 aprox.',
  },
  {
    id: 'det-nga-eu', tier: 'detail', type: 'commodities', from: [8, 9.5], to: 'eu', fromLabel: 'NGA', iso: '566', bend: 0.16, dur: 6.5, peso: 1.5,
    titulo: 'O petróleo do Delta do Níger',
    totalAnual: '≈ US$ 15 bi/ano',
    did: 'A Nigéria é o maior produtor de petróleo da África — e quase todo o lucro passa por Shell, Eni e Total. No Delta, vazamentos constantes destroem a pesca e a lavoura de quem vive lá: a conta ambiental fica, o dinheiro viaja.',
    adv: 'Joint-ventures NNPC/Shell-Eni-Total com fiscal terms regressivos; bunkering + gas flaring como externalização; refine-import paradox: exporta cru, importa gasolina.',
    itens: [
      { rotulo: 'Petróleo bruto', valor: '≈ US$ 15 bi/ano', nota: 'Shell, Eni, Total, Exxon' },
      { rotulo: 'Gás (NLNG)', valor: '≈ US$ 5 bi/ano', nota: 'ilha de Bonny' },
    ],
    fonte: 'NNPC · OPEC · 2024 aprox.',
  },
  {
    id: 'det-bra-usa', tier: 'detail', type: 'commodities', from: 'brasil', to: 'usa', bend: -0.18, dur: 6.5, peso: 1.5,
    titulo: 'Petróleo, café e aço rumo ao norte',
    totalAnual: '≈ US$ 40 bi/ano',
    did: 'Os EUA são o segundo maior destino do Brasil: petróleo do pré-sal, café, suco, carne e aço semiacabado. Sai matéria-prima e semimanufaturado — volta iPhone, remédio e máquina com a margem embutida.',
    adv: 'Pauta assimétrica Norte-Sul clássica: primários + semimanufaturados vs. bens de capital e IP; déficit tecnológico bilateral persistente mesmo com superávit pontual em volume.',
    itens: [
      { rotulo: 'Petróleo cru', valor: '≈ US$ 10 bi/ano', nota: 'pré-sal' },
      { rotulo: 'Café, carne, suco e celulose', valor: '≈ US$ 12 bi/ano' },
      { rotulo: 'Aço semiacabado', valor: '≈ US$ 4 bi/ano', nota: 'placas para relaminação nos EUA' },
    ],
    fonte: 'Comex Stat · US Census · 2024 aprox.',
  },
  {
    id: 'det-aus-jpn', tier: 'detail', type: 'commodities', from: 'aus', to: 'jpn', bend: 0.22, dur: 6.5, peso: 1.5,
    titulo: 'O gás que acende o Japão',
    totalAnual: '≈ US$ 40 bi/ano',
    did: 'Sem petróleo próprio, o Japão depende do gás liquefeito da Austrália para gerar eletricidade. Depois de Fukushima, essa dependência só cresceu: cada apagão evitado em Tóquio passa por um navio-tanque australiano.',
    adv: 'LNG de longo prazo (Woodside, Santos, Inpex-Ichthys) + carvão metalúrgico: segurança energética japonesa ancorada no extrativismo australiano; contratos oil-linked de décadas.',
    itens: [
      { rotulo: 'Gás natural liquefeito (LNG)', valor: '≈ US$ 25 bi/ano' },
      { rotulo: 'Carvão (térmico e metalúrgico)', valor: '≈ US$ 12 bi/ano' },
    ],
    fonte: 'DFAT · METI Japão · 2024 aprox.',
  },
  {
    id: 'det-mys-chn', tier: 'detail', type: 'manufatura', from: [102, 4], to: 'china', fromLabel: 'MYS', iso: '458', bend: 0.16, dur: 6, peso: 1.5,
    titulo: 'Os chips da Malásia antes da China',
    totalAnual: '≈ US$ 35 bi/ano',
    did: 'Antes de virar produto chinês, muito eletrônico passa pela Malásia: o país testa e encapsula 1 em cada 8 chips do mundo, em Penang. Salários de fábrica contidos, isenções generosas — e a margem final fica com a marca.',
    adv: 'OSAT (ASE, Infineon, Intel-Penang) como degrau intermediário da GVC: upgrading funcional bloqueado; E&E ≈ 40% das exportações com baixo conteúdo doméstico de P&D.',
    itens: [
      { rotulo: 'Semicondutores (teste e encapsulamento)', valor: '≈ US$ 25 bi/ano', nota: '~13% do OSAT global' },
      { rotulo: 'Eletrônicos e componentes', valor: '≈ US$ 10 bi/ano' },
    ],
    fonte: 'MITI Malásia · 2024 aprox.',
  },
  {
    id: 'det-tur-eu', tier: 'detail', type: 'manufatura', from: 'tur', to: 'eu', bend: -0.12, dur: 6, peso: 1.5,
    titulo: 'A oficina da Europa na porta ao lado',
    totalAnual: '≈ US$ 100 bi/ano',
    did: 'Carros, autopeças, geladeiras e roupas: a Turquia é a oficina de quintal da União Europeia, com união aduaneira desde 1995. Fábricas europeias, salários turcos — a conta da competitividade paga em lira desvalorizada.',
    adv: 'União aduaneira UE–Turquia sem co-decisão: integração subordinada; âncoras Ford, Fiat-Tofaş, Renault-Oyak; compressão salarial via inflação + câmbio como vantagem exportadora.',
    itens: [
      { rotulo: 'Automóveis e autopeças', valor: '≈ US$ 35 bi/ano', nota: 'Ford, Fiat, Renault, Toyota' },
      { rotulo: 'Têxteis e vestuário', valor: '≈ US$ 20 bi/ano' },
      { rotulo: 'Eletrodomésticos', valor: '≈ US$ 10 bi/ano', nota: 'Arçelik/Beko' },
    ],
    fonte: 'TurkStat · Eurostat · 2024 aprox.',
  },
  {
    id: 'det-are-ind', tier: 'detail', type: 'commodities', from: 'are', to: 'india', bend: -0.18, dur: 6, peso: 1.5,
    titulo: 'O óleo do Golfo para a Índia',
    totalAnual: '≈ US$ 18 bi/ano',
    did: 'Os Emirados estão entre os maiores fornecedores de petróleo da Índia — e os dois já liquidam parte em rúpias e dirhams, fora do dólar. Energia em troca de comida e gente: 3,5 milhões de indianos trabalham no Golfo e mandam bilhões para casa.',
    adv: 'Petróleo ADNOC + acordo de liquidação em moedas locais (2023); contrapartida: remessas da diáspora indiana ≈ US$ 15 bi/ano só dos EAU — troca desigual temperada por fluxo reverso de trabalho.',
    itens: [
      { rotulo: 'Petróleo bruto (ADNOC)', valor: '≈ US$ 18 bi/ano' },
      { rotulo: 'Ouro e diamantes (reexportação)', valor: '≈ US$ 8 bi/ano', nota: 'Dubai como entreposto' },
    ],
    fonte: 'MCX Índia · OEC · 2024 aprox.',
  },
  {
    id: 'det-zaf-gbr', tier: 'detail', type: 'drain', from: 'zaf', to: 'gbr', bend: 0.16, dur: 7, peso: 1.5,
    titulo: 'Dividendos da platina para Londres',
    totalAnual: '≈ US$ 5 bi/ano (est.)',
    did: 'Anglo American, o gigante da platina e do minério sul-africano, tem sede e ações em LONDRES. O minério sai do subsolo africano; o dividendo é anunciado na Bolsa de Londres. A geografia do lucro não mudou muito desde o império.',
    adv: 'Listagem primária na LSE + estrutura de holding offshore: renda mineira capturada por acionistas do centro; royalties domésticos residuais — continuidade institucional do Mineral-Energy Complex.',
    itens: [
      { rotulo: 'Dividendos (Anglo American, Sibanye, Exxaro)', valor: '≈ US$ 5 bi/ano (est.)' },
      { rotulo: 'Serviços financeiros e seguros', valor: 'ligados à JSE/LSE', nota: 'corretagem e listagem dupla' },
    ],
    fonte: 'Relatórios anuais · JSE · estimativa didática',
  },
  {
    id: 'det-jpn-tsy', tier: 'detail', type: 'dollar', from: 'jpn', to: 'usa', bend: -0.4, dur: 6.5, peso: 1.5,
    titulo: 'O Japão financia o déficit americano',
    totalAnual: '≈ US$ 1,1 tri em estoque',
    did: 'O Japão é o maior credor estrangeiro dos EUA: guarda mais de US$ 1 TRILHÃO em títulos do Tesouro americano. O superávit comercial de décadas com carros e eletrônicos voltou para os EUA — como empréstimo barato ao governo.',
    adv: 'Reciclagem de superávits via GPIF e bancos: demanda estrutural por duration USD ancora os juros longos americanos; aliança de segurança e finança como um só circuito.',
    itens: [
      { rotulo: 'Treasuries em Tóquio', valor: '≈ US$ 1,1 tri', nota: 'maior detentor estrangeiro' },
      { rotulo: 'Contrapartida', valor: 'superávits com autos e eletrônicos', nota: 'décadas de Toyota e Sony' },
    ],
    fonte: 'US Treasury TIC · 2024',
  },
]
