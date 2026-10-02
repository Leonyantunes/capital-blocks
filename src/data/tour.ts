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

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
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

    dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
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
