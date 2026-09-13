/**
 * TOUR COMPARTILHADO 2D ⇄ 3D — "Como o capitalismo funciona".
 * As MESMAS paradas nos dois mapas; só a apresentação do card muda:
 * - modo didático: narrativa suave + 2–3 números grandes e diretos
 * - modo avançado: texto denso completo (o padrão anterior do tour)
 * Linguagem didática suave, ideologia pouco explícita; os dados demonstram.
 * Valores anuais aproximados (2024) — mesma base dos fluxos.
 */

export interface TourStat {
  v: string
  k: string
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
    didStats: [
      { v: '28', k: 'paradas neste tour' },
      { v: '6', k: 'tipos de fluxo' },
      { v: '49', k: 'rotas desenhadas' },
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
    didStats: [
      { v: 'US$ 95 bi', k: 'por ano, Brasil → China' },
      { v: '1 em 4', k: 'dólares do Brasil vêm da China' },
      { v: '70 mi t', k: 'de soja por ano' },
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
    didStats: [
      { v: '20%', k: 'dos genéricos do mundo' },
      { v: '≈ US$ 55 bi', k: 'por ano, Índia → Europa' },
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
    didStats: [
      { v: '~70%', k: 'do cobalto mundial é congolês' },
      { v: 'baterias', k: 'de celular e carro elétrico' },
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
    didStats: [
      { v: 'US$ 440 bi', k: 'por ano, China → EUA' },
      { v: '~60%', k: 'de cada iPhone fica com a marca' },
    ],
    adv: 'GVC (cadeias globais de valor): captura de margem pelo detentor da marca/IP; o déficit bilateral estrutura a guerra tecnológica — montar não é o mesmo que mandar.',
    dica: 'veja o Módulo 05 para o Raio-X das empresas da rota',
  },
  {
    id: 'fabrica-muda',
    chapter: 'Cap. 2 · Quem transforma',
    titulo: 'A fábrica muda de endereço',
    lng: 108, lat: 16, k: 2.4, flowId: 'det-vnm-usa',
    did: 'Quando a disputa comercial aperta, as fábricas não voltam para os salários altos — elas se mudam para salários ainda menores. Foi assim com o Vietnã: metade dos celulares Galaxy e dos tênis Nike hoje sai de lá. O modelo é o mesmo; só o endereço é novo.',
    didStats: [
      { v: '~50%', k: 'dos Galaxy e dos Nike vêm do Vietnã' },
      { v: 'nº 1', k: 'novo endereço das fábricas' },
    ],
    adv: 'China+1: realocação da montagem sem redistribuir o excedente — a compressão salarial viaja junto com a fábrica (TMD continental em nova sede).',
  },
  {
    id: 'seda',
    chapter: 'Cap. 2 · Quem transforma',
    titulo: 'A rota da seda sobre trilhos',
    lng: 60, lat: 52, k: 1.8, flowId: 'man-chn-eu',
    did: 'Não é só navio: trens de carga cruzam a Ásia Central levando produtos chineses até a Alemanha pela "Nova Rota da Seda". A Europa compra da China mais do que de qualquer outro país. Junto com a mercadoria viajam portos, ferrovias e empréstimos — infraestrutura também é influência.',
    didStats: [
      { v: '≈ US$ 550 bi', k: 'por ano, China → Europa' },
      { v: '15 mil', k: 'viagens de trem por ano' },
    ],
    adv: 'Belt & Road: corredores ferroviários (Chongqing–Duisburg) + portos (Piraeus) — logística como instrumento de projeção da acumulação e amarração de demanda.',
  },
  {
    id: 'quintal',
    chapter: 'Cap. 2 · Quem transforma',
    titulo: 'A fábrica do quintal',
    lng: -105, lat: 30, k: 2.2, flowId: 'det-mex-usa',
    did: 'Os EUA montaram sua fábrica no quintal: o México exporta quase meio trilhão por ano — carros e TVs montados por quem ganha cerca de 1/8 do salário americano. Perto no mapa, longe no salário: é assim que o produto chega barato às lojas.',
    didStats: [
      { v: '≈ US$ 500 bi', k: 'por ano, México → EUA' },
      { v: '1/8', k: 'do salário americano' },
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
    didStats: [
      { v: '1.134', k: 'mortas em Rana Plaza, 2013' },
      { v: 'US$ 120', k: 'o salário mensal' },
    ],
    adv: 'Rana Plaza como símbolo da compressão salarial global (mínimo ≈ US$113/mês); 4 mi de trabalhadores abastecendo H&M/Zara/Primark — fast fashion sobre TMD têxtil.',
  },
  {
    id: 'chip',
    chapter: 'Cap. 3 · O elo mais valioso',
    titulo: 'O ponto mais sensível do mapa',
    lng: 122, lat: 28, k: 2.4, flowId: 'det-twn-usa', conflict: 'semis',
    did: 'Existe um produto sem o qual nada moderno funciona: o chip avançado. Quase todos saem de uma ilha, Taiwan. Sem essa linha não há inteligência artificial, smartphone — nem míssil. Por isso dois blocos disputam esse pedacinho do mapa.',
    didStats: [
      { v: '~90%', k: 'dos chips avançados vêm de Taiwan' },
      { v: '1 ilha', k: 'no centro da disputa' },
    ],
    adv: 'TSMC→EUA (<7nm) como chokepoint estratégico: o "escudo de silício" estrutura a contenção à China — export controls (ASML/EUV, NVIDIA) sobre o capital constante mais avançado.',
  },
  {
    id: 'vaza',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'A linha mais invisível',
    lng: -45, lat: 3, k: 2.4, flowId: 'drn-bra-usa',
    did: 'Esta é a linha que ninguém mostra nos jornais. Todo ano, parte do que o Brasil produz sobe para os EUA como lucro, dividendo e taxa: cada assinatura de streaming, cada passagem de cartão, cada licença de programa deixa uma fatia lá fora. É riqueza feita aqui que não volta.',
    didStats: [
      { v: 'US$ 40–55 bi', k: 'saem do Brasil por ano' },
      { v: 'streaming + cartões', k: 'pingam lucro todo mês' },
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
    didStats: [
      { v: 'US$ 45 bi+', k: 'de lucro remetido/ano' },
      { v: 'US$ 63 bi', k: 'de remessas das famílias' },
    ],
    adv: 'Conta de rendas (≈US$45 bi) vs. remessas (≈US$63 bi): o Sul fornece trabalho duas vezes — na fábrica e na diáspora — e o Norte devolve o preço do trabalho, não o valor gerado.',
  },
  {
    id: 'vaza-africa',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'O mesmo desenho, na África',
    lng: 17, lat: 6, k: 2.0, flowId: 'drn-afr-eu',
    did: 'Na África o desenho se repete em escala maior: petróleo da Nigéria, minérios do Congo, cacau da Costa do Marfim saem brutos — e voltam como produto pronto, com a margem. O lucro das gigantes que operam lá é anunciado em Londres e na Suíça.',
    didStats: [
      { v: 'bruto sai', k: 'pronto volta, com margem' },
      { v: 'Londres · Suíça', k: 'onde o lucro é anunciado' },
    ],
    adv: 'Agregado de extração + renda de propriedade: petróleo (Shell/Eni), minerais (Glencore; Anglo American–LSE), cacau (traders europeus) — processamento e marca retidos no Norte (Rodney: subdesenvolvimento como produção ativa).',
  },
  {
    id: 'divida',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'A dívida que nunca termina',
    lng: -64, lat: -30, k: 2.4, flowId: 'drn-arg-usa',
    did: 'A Argentina já deixou de pagar várias vezes — e mesmo assim os credores voltam a emprestar, com juros maiores. Quem paga o ajuste, no fim, é sempre o salário: menos emprego, preços maiores, serviços cortados. A dívida vira uma torneira que nunca fecha.',
    didStats: [
      { v: 'US$ 44 bi', k: 'o programa com o FMI' },
      { v: 'salários', k: 'pagam o ajuste, sempre' },
    ],
    adv: 'Ciclo dívida → default → reestruturação: serviço ≈US$15–20 bi/ano; programa FMI + Vaca Muerta (Chevron/Exxon/Total) — disciplinamento via crise (TMD + restrição cambial real).',
  },
  {
    id: 'tecnologia',
    chapter: 'Cap. 4 · Para onde vai o lucro',
    titulo: 'A conta digital da Índia',
    lng: 80, lat: 15, k: 2.2, flowId: 'drn-ind-usa',
    did: 'O dreno também é digital: cada anúncio, cada assinatura, cada taxa de cartão na Índia pinga uma parte para a Califórnia — uns US$ 25 bilhões por ano. E há a conta antiga: historiadores calculam em US$ 45 trilhões o que o colonialismo tirou da Índia. O cano mudou; a direção, não.',
    didStats: [
      { v: 'US$ 25 bi+', k: 'para Big Techs, por ano' },
      { v: 'US$ 45 tri', k: 'a conta do colonialismo' },
    ],
    adv: 'Canal 3 em versão digital (publicidade/cloud/taxas) + drain histórico (Patnaik: US$45 tri, 1765–1938) — continuidade secular da transferência de excedente.',
  },
  {
    id: 'dolar',
    chapter: 'Cap. 5 · A moeda que manda',
    titulo: 'Quem decide o preço do feijão',
    lng: -40, lat: 28, k: 2.2, flowId: 'fin-usa-bra',
    did: 'A linha amarela não leva produto: leva poder. Como soja, petróleo e minério são cotados em dólar, quando os juros sobem nos EUA o real cai — e o feijão sobe no Brasil. A moeda americana participa de cada compra no mercado.',
    didStats: [
      { v: 'US$ 240 bi', k: 'do Brasil guardados em dólar' },
      { v: 'Fed sobe', k: 'feijão sobe aqui' },
    ],
    adv: 'Hierarquia monetária (Pilar 3): Treasuries + precificação dolarizada + dívida corporativa externa — a política do Fed transmite-se ao custo de vida periférico sem passar por nenhuma urna.',
  },
  {
    id: 'credor',
    chapter: 'Cap. 5 · A moeda que manda',
    titulo: 'Quem financia o patrão da moeda',
    lng: 160, lat: 40, k: 2.3, flowId: 'det-jpn-tsy',
    did: 'Plot twist: o maior financiador do governo americano é o Japão, com mais de US$ 1 trilhão em títulos. Décadas vendendo carros e eletrônicos geraram um cofre — que voltou para os EUA como empréstimo barato. Até o dono da moeda precisa de credor.',
    didStats: [
      { v: 'US$ 1,1 tri', k: 'em títulos americanos' },
      { v: 'nº 1', k: 'credor estrangeiro dos EUA' },
    ],
    adv: 'Reciclagem de superávits via GPIF e bancos: a demanda japonesa por duration ancora os juros longos dos EUA — segurança e finança num só circuito.',
  },
  {
    id: 'fantasma',
    chapter: 'Cap. 5 · O dinheiro invisível',
    titulo: 'O lucro que muda de endereço',
    lng: -25, lat: 48, k: 2.6, flowId: 'fant-usa-irl',
    did: 'E há o dinheiro que ninguém vê: todo ano, centenas de bilhões em lucros "mudam de endereço" para paraísos fiscais — no papel, sem sair do lugar. Um ano, a Irlanda "cresceu" 26% só com essa contabilidade. São US$ 480 bilhões em impostos que escolas e hospitais do mundo inteiro deixam de receber.',
    didStats: [
      { v: '+26%', k: 'o "crescimento" da Irlanda em 2015' },
      { v: 'US$ 480 bi', k: 'perdidos em impostos/ano' },
      { v: 'US$ 140 bi', k: 'deslocados p/ Irlanda/ano' },
    ],
    adv: 'Missing Profits (Zucman): 36–40% dos lucros multinacionais deslocados; TJN: US$480 bi/ano de arrecadação perdida; offshore: US$10–12 tri — o fictício administrativo.',
  },
  {
    id: 'tios',
    chapter: 'Cap. 5 · O dinheiro invisível',
    titulo: 'A ilha das 18 mil empresas',
    lng: -80, lat: 25, k: 2.2, flowId: 'fant-usa-cym',
    did: 'As Ilhas Cayman têm 100 mil habitantes — e guardam trilhões em fundos. Um único prédio já foi "sede" de 18 mil empresas ao mesmo tempo. Nenhuma delas fabrica nada lá: o endereço É o produto.',
    didStats: [
      { v: '18 mil', k: 'empresas num só prédio' },
      { v: 'US$ 70 bi', k: 'deslocados por ano' },
    ],
    adv: 'Cayman/Bermuda como jurisdições-produto: hedge funds e seguros; Bermuda lidera o deslocamento per capita (Zucman) — o endereço como ativo financeiro.',
  },
  {
    id: 'gaveta',
    chapter: 'Cap. 5 · O dinheiro invisível',
    titulo: 'O país-gaveta',
    lng: 6, lat: 50, k: 2.6, flowId: 'fant-eu-lux',
    did: 'Luxemburgo tem 600 mil habitantes e captura US$ 130 bilhões em lucros de empresas que operam em OUTROS países. Documentos vazados mostraram 340 acordos secretos de imposto — alguns abaixo de 1%. O paraíso fiscal também fala francês e fica na Europa.',
    didStats: [
      { v: 'US$ 130 bi', k: 'capturados por ano' },
      { v: '< 1%', k: 'de imposto em alguns acordos' },
    ],
    adv: 'LuxLeaks (2014, ICIJ): 340+ rulings secretos; fundos + royalties como máquinas de deslocamento intra-europeu — o paraíso não é exceção tropical, é peça do centro.',
  },
  {
    id: 'saida',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'Uma rachadura no muro',
    lng: 100, lat: 55, k: 2.0, flowId: 'brics-chn-rus',
    did: 'Rússia e China passaram a fazer quase todo o comércio entre elas sem dólar — em yuan e rublos. É o maior desvio já feito por fora da moeda americana, nascido das sanções. Ainda é uma rachadura, não uma porta: o substituto do dólar não existe.',
    didStats: [
      { v: '>90%', k: 'sem dólar, Rússia–China' },
      { v: 'US$ 245 bi', k: 'de comércio por ano' },
    ],
    adv: 'Pós-2022: >90% em moedas locais; CIPS como clearing alternativo — fragmentação monetária sem substituto hegemônico pronto (multipolaridade assimétrica).',
  },
  {
    id: 'ponte',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'O real aperta a mão do yuan',
    lng: -40, lat: -5, k: 2.0, flowId: 'brics-chn-bra',
    did: 'Brasil e China já testam vender e comprar em yuan, com um swap de R$ 190 bilhões entre os bancos centrais. Ainda é pequeno perto do dólar — mas é a primeira rachadura oficial desse lado do Atlântico.',
    didStats: [
      { v: 'R$ 190 bi', k: 'de swap BCB–PBoC' },
      { v: 'piloto', k: 'comércio em yuan via ICBC' },
    ],
    adv: 'Swap (2013) + liquidação em yuan via ICBC (2023) + mBridge (CBDC): infraestrutura embrionária de desdolarização bilateral, escala ainda marginal vs. stock USD.',
  },
  {
    id: 'desconto',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'O petróleo com desconto',
    lng: 60, lat: 45, k: 1.9, flowId: 'brics-ind-rus',
    did: 'A Índia virou a maior compradora do petróleo russo — com desconto, pago em rúpias. O detalhe curioso: a Rússia acumula rúpias que mal consegue gastar, e passa a pedir yuan. Fugir do dólar é fácil; achar um substituto, nem tanto.',
    didStats: [
      { v: '≈ US$ 50 bi', k: 'de óleo por ano' },
      { v: 'a rúpia', k: 'que sobra sem ter onde gastar' },
    ],
    adv: 'Desconto Urals + rupee-ruble trap: a fragmentação monetária avança sem substituto hegemônico pronto — multipolaridade assimétrica com yuan de reserva dos sancionados.',
  },
  {
    id: 'energia',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'Quando a energia vira arma',
    lng: 65, lat: 33, k: 2.0, conflict: 'energia', isos: ['643', '276'],
    did: 'Com as sanções, os dutos russos mudaram de direção: o gás e o petróleo que iam para a Europa agora vão para a Ásia — e a indústria europeia ficou com energia bem mais cara. Energia também é poder: quem controla o cano, participa da decisão.',
    didStats: [
      { v: 'leste', k: 'o novo rumo do gás russo' },
      { v: 'conta maior', k: 'para a indústria europeia' },
    ],
    adv: 'Redirecionamento do capital energético russo (Ásia no lugar da Europa) e elevação dos custos do capital produtivo europeu — desindustrialização relativa + militarização (Europa +17% gasto militar, SIPRI 2024).',
  },
  {
    id: 'canal',
    chapter: 'Cap. 6 · A tentativa de saída',
    titulo: 'O pedágio do mundo',
    lng: 32, lat: 28, k: 2.4, flowId: 'det-egy-eu',
    did: 'Por um canal no Egito passa 12% de todo o comércio do planeta — e o Egito cobra pedágio. Quando os ataques no Mar Vermelho derrubaram o tráfego em 2024, a receita afundou 60% e o país entrou em crise. Quem vive de passagem, vive de risco.',
    didStats: [
      { v: '12%', k: 'do comércio passa em Suez' },
      { v: '-60%', k: 'de receita em 2024' },
    ],
    adv: 'Renda de passagem como variável crítica do balanço egípcio (US$9–10 bi/ano pré-2024); Houthis como choque exógeno — chokepoints enquanto alavanca geopolítica.',
  },
  {
    id: 'salario',
    chapter: 'Cap. 7 · Quem paga a conta',
    titulo: 'O mapa dos salários',
    lng: 20, lat: 8, k: 1.3, layer: 'wages',
    did: 'Imagine um termômetro salarial sobre o mapa: o vermelho (menos de US$ 300 por mês) cobriria quase todo o Sul — é de lá que saem a matéria-prima e a montagem barata. O Norte compra barato, processa caro e revende. Essa diferença de cor não é acidente: ela é o sistema funcionando.',
    didStats: [
      { v: '< US$ 300', k: 'por mês em quase todo o Sul' },
      { v: 'a cor', k: 'é o sistema funcionando' },
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
    didStats: [
      { v: '2,9 mi', k: 'mortes ligadas ao trabalho/ano' },
      { v: '1.134', k: 'costureiras em Rana Plaza' },
      { v: '500 mil', k: 'vidas na crise dos opioides' },
    ],
    adv: 'Violência corporativa como externalização estrutural: Bhopal (duplo padrão), Rana Plaza (compressão salarial), Mariana/Brumadinho (custo mínimo) — o custo humano é variável de ajuste (Nixon: slow violence; ILO: 2,93 mi/ano).',
    dica: 'no mapa 2D, a camada vermelha conta cada caso',
  },
  {
    id: 'agora',
    chapter: 'Encerramento',
    titulo: 'E agora?',
    lng: -53, lat: -10, k: 2.8, isos: ['076'],
    did: 'O diagnóstico está completo: o trabalho produz, o Sul fornece barato, o lucro viaja para o Norte, a moeda comanda e a conta chega em vidas. Mas o Módulo 09 mostra que alternativas REAIS já funcionam — cooperativas gigantes, cidades com orçamento democrático, comunidades que cuidam do comum. O tabuleiro pode ser reorganizado.',
    didStats: [
      { v: '09', k: 'o módulo das alternativas' },
      { v: 'reais', k: 'casos que já funcionam' },
    ],
    adv: 'Do diagnóstico à transição: pluralismo institucional (cooperativas, commons, democracia fiscal — Ostrom, Albert) + soberania monetária funcional (P3) + fim da superexploração (P4). O mapa deixa de ser destino e vira campo de disputa.',
    dica: 'finalize o tour para ir ao Módulo 09',
  },
]
