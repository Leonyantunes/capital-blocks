/**
 * REGISTRO DE TOURS TEMÁTICOS — base para vários tours no 2D e no 3D.
 * Cada tour: mesmas paradas (TourStop), acento visual próprio e saída final.
 *
 * CONTRATO DE PARADA (tours novos NÃO precisam mexer no código dos mapas):
 * - flowId → a rota é enquadrada de ponta a ponta (2D e 3D) e aparece em
 *   qualquer zoom, mesmo sendo tier 'detail' (seleção ignora o gate);
 * - lng/lat + k → ponto único; o 3D deriva a distância via distFromK(k)
 *   (ou usa s.dist como override);
 * - isos → países destacados, SOMADOS às pontas do fluxo do flowId;
 * - conflict/layer → acendem guerras de blocos e camadas temáticas;
 * - toda parada com assunto específico deve destacar ALGO — por flowId, por
 *   isos OU por layer (a camada temática pinta o mapa inteiro: 'wages' acende
 *   o termômetro salarial, 'deaths' os marcadores de disaster). Só
 *   aberturas/fechamentos em visão mundial podem ficar sem destaque.
 */
import type { TabId } from '../store/useApp'
import { FLOWS, TYPE_STYLE } from './flows'
import { flowIsos } from '../lib/world'
import { TOUR_STOPS, type TourStop } from './tour'
import { modRef, modTitle } from './modules'

export interface TourDef {
  id: string
  titulo: string
  descricao: string
  /** cor de destaque (cards + tema do globo em tours de guerra) */
  accent: string
  finalTab: TabId
  finalLabel: string
  stops: TourStop[]
}

const byId = (id: string): TourStop => {
  const s = TOUR_STOPS.find((x) => x.id === id)
  if (!s) throw new Error(`parada do tour não encontrada: ${id}`)
  return s
}

/** ISOs destacados numa parada: pontas do fluxo + lista manual da parada. */
export function stopIsos(s: TourStop): string[] {
  const out = new Set<string>()
  if (s.flowId) {
    const f = FLOWS.find((x) => x.id === s.flowId)
    flowIsos(f).forEach((iso) => out.add(iso))
  }
  ;(s.isos ?? []).forEach((iso) => out.add(iso))
  return [...out]
}

/** Cor do fluxo da parada (p/ pintar os países com cor que faz sentido). */
export function stopColor(s: TourStop): string | null {
  if (!s.flowId) return null
  const f = FLOWS.find((x) => x.id === s.flowId)
  return f ? TYPE_STYLE[f.type].color : null
}

const RED = '#ef4444'
const ROSE = '#fb7185'
const WAR_FINAL = { finalTab: 'war' as TabId, finalLabel: `ir ao ${modTitle('war')} →` }

export const TOURES: TourDef[] = [
  {
    id: 'principal',
    titulo: 'Como o capitalismo funciona',
    descricao: 'O tour completo: da terra à moeda, do lucro ao custo.',
    accent: '#34d399',
    finalTab: 'alternatives',
    finalLabel: `ir ao ${modTitle('alternatives')} →`,
    stops: TOUR_STOPS,
  },

  /* ═══ GUERRA — geral ═══ */
  {
    id: 'guerra',
    titulo: 'Guerras e o fluxo do capital',
    descricao: 'Como guerras redesenham rotas, enriquecem uns e roubam outros.',
    accent: RED,
    ...WAR_FINAL,
    stops: [
      {
        id: 'w-intro', chapter: 'Guerra · Abertura', titulo: 'Quando a guerra redesenha o mapa',
        lng: 20, lat: 30, k: 1.6, isos: ['840', '156', '643'],
        did: 'Guerras não destroem só cidades: elas redesenham o mapa do dinheiro. Dutos mudam de direção, sanções desviam petroleiros inteiros, orçamentos militares incham — e sempre há quem fature com isso. Este tour segue o dinheiro das guerras.',
        simples: 'Guerras mudam rotas, gastos públicos e preços. Neste tour, você vai ver como conflitos também mudam o caminho do dinheiro.',
        didStats: [
          { v: 'US$ 1,5 tri', k: 'gasto militar da OTAN/ano', sourceIds: ['sipri-milex'] },
          { v: '55%', k: 'do gasto militar mundial', sourceIds: ['sipri-milex'] },
        ],
        adv: 'Guerra como reordenador de fluxos: sanções, chokepoints e orçamentos militares realocam excedente entre blocos — o complexo militar-industrial como fração lucrativa permanente.',

        dica: 'observe os países destacados e compare esta parada com a anterior',},
      byId('chip'),
      byId('energia'),
      {
        id: 'w-suez', chapter: 'Guerra · Gargalos', titulo: 'O canal na mira',
        lng: 32, lat: 28, k: 2.4, flowId: 'det-egy-eu',
        did: 'Doze por cento do comércio do mundo passa por um canal no Egito — e guerras na região viram esse pedágio em arma. Com os ataques no Mar Vermelho, navios deram a volta na África e o Egito perdeu 60% da receita. Um tiro num estreito ecoa no preço de tudo.',
        simples: 'O Canal de Suez é um atalho importante para navios. Quando conflitos reduzem o tráfego, o Egito perde receita e transportar mercadorias pode ficar mais caro.',
        didStats: [
          { v: '12%', k: 'do comércio passa em Suez', sourceIds: ['alfandegas-estatisticas-nacionais', 'imf-weo'] },
          { v: '-60%', k: 'de receita do Egito', sourceIds: ['alfandegas-estatisticas-nacionais', 'imf-weo'] },
        ],
        adv: 'Suez/Bab el-Mandeb como chokepoint: conflito regional → rerouting pelo Cabo → frete e seguros disparam; renda de passagem como refém geopolítico.',

        dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
      {
        id: 'w-dolar', chapter: 'Guerra · Armas', titulo: 'O dólar como arma',
        lng: -40, lat: 32, k: 2.2, flowId: 'fin-usa-eu',
        did: 'Existe uma arma que não explode: o dólar. Sanções congelam reservas, expulsam bancos do sistema e afundam moedas — e a Europa, que guarda US$ 1,6 trilhão em títulos americanos, sente junto. Na guerra financeira, até aliado paga a conta.',
        simples: 'Sanções podem bloquear reservas e pagamentos internacionais. Como o dólar é muito usado no mundo, decisões dos EUA também afetam outros países.',
        didStats: [
          { v: 'US$ 1,6 tri', k: 'europeus em títulos dos EUA', sourceIds: ['us-treasury-tic', 'imf-cofer'] },
          { v: 'congeladas', k: 'as reservas dos sancionados', sourceIds: ['us-treasury-tic', 'imf-cofer'] },
        ],
        adv: 'Dólar-arma: extraterritorialidade do clearing + congelamento de reservas; aliados arcam com o custo (energia cara, desindustrialização) — hierarquia monetária como teatro de guerra.',

        dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
      byId('saida'),
      {
        id: 'w-fim', chapter: 'Guerra · Fechamento', titulo: 'Quem enriqueceu?',
        lng: 30, lat: 35, k: 1.8, isos: ['840', '643'],
        did: 'Faça as contas do tour: fabricantes de chips e armas, petroleiras com desconto, traders de rotas novas. E do outro lado: salários corroídos, energia cara, países inteiros pagando pedágio. Guerra move fronteiras no mapa — e dinheiro no bolso de poucos.',
        simples: 'Conflitos criam ganhadores e perdedores econômicos. Empresas de armas e energia podem aumentar receitas enquanto famílias e governos enfrentam custos maiores.',
        didStats: [
          { v: 'armas + energia', k: 'quem fatura', sourceIds: ['sipri-milex', 'relatorios-anuais-empresas'] },
          { v: 'salários', k: 'quem paga', sourceIds: ['sipri-milex', 'relatorios-anuais-empresas'] },
        ],
        adv: 'Balanço de classe dos conflitos: complexo militar-energético captura rendas extraordinárias; periferia e trabalho assalariado absorvem o choque via preços e austeridade.',
        dica: `finalize para abrir o ${modRef('war')} com cada frente detalhada`,
      },
    ],
  },

  /* ═══ GUERRA — por conflito ═══ */
  {
    id: 'guerra-semis',
    titulo: 'Guerra dos Semicondutores',
    descricao: 'EUA × China pelo cérebro da produção.',
    accent: RED,
    ...WAR_FINAL,
    stops: [
      {
        id: 'ws-intro', chapter: 'Semicondutores', titulo: 'A guerra pelo cérebro',
        lng: 122, lat: 30, k: 2.2, conflict: 'semis', isos: ['840', '158', '156'],
        did: 'Celular, carro, míssil, inteligência artificial: tudo precisa do chip mais avançado — e quase todos saem de Taiwan. Os EUA tentam travar a China bloqueando máquinas e programas; a China corre para fazer os seus. É uma guerra sem tiros, pelo objeto mais estratégico do século.',
        simples: 'Chips avançados são essenciais para celulares, carros, inteligência artificial e armas. EUA e China disputam quem consegue fabricar e comprar essas tecnologias.',
        didStats: [
          { v: '~90%', k: 'da lógica de ponta: TSMC', sourceIds: ['nist-chips', 'bis-doc-export-controls'] },
          { v: 'bloqueio', k: 'a arma americana', sourceIds: ['nist-chips', 'bis-doc-export-controls'] },
        ],
        adv: 'Contenção tecnológica opera sobre o capital constante mais avançado: export controls, restrições a equipamentos de fabricação e CHIPS Act tentam limitar a fronteira produtiva chinesa enquanto subsidiam capacidade doméstica dos EUA. A disputa combina renda de monopólio, propriedade intelectual, economias de escala e controle de gargalos da cadeia de semicondutores.',

        dica: 'observe os países destacados e avance para ver como a disputa muda os fluxos',},
      byId('chip'),
      byId('fabrica-muda'),
      {
        id: 'ws-fim', chapter: 'Semicondutores', titulo: 'E o Brasil nisso?',
        lng: -53, lat: -10, k: 2.4, isos: ['076'],
        did: 'O Brasil assiste de fora: importa os chips prontos dentro de celulares e máquinas, sem fabricar nenhum. Na guerra do século, quem não produz tecnologia assiste ao jogo — e paga ingresso caro em cada aparelho.',
        simples: 'O Brasil ainda depende de chips avançados produzidos fora do país. Isso deixa o país mais dependente de decisões e preços externos.',
        didStats: [
          { v: 'zero', k: 'fábricas de chips avançados', sourceIds: ['nist-chips', 'ibge'] },
          { v: 'tudo', k: 'importado dentro de aparelhos', sourceIds: ['nist-chips', 'ibge'] },
        ],
        adv: 'Dependência tecnológica periférica: sem foundry, sem IP, sem bargaining power — o Brasil entra na guerra dos chips como mercado, não como jogador.',
        dica: `finalize para abrir o ${modRef('war')}`,
      },
    ],
  },
  {
    id: 'guerra-energia',
    titulo: 'Guerra da Energia e Sanções',
    descricao: 'Rússia × OTAN/UE pelo gás e pelo petróleo.',
    accent: RED,
    ...WAR_FINAL,
    stops: [
      {
        id: 'we-intro', chapter: 'Energia', titulo: 'A guerra dos dutos',
        lng: 60, lat: 50, k: 2.0, conflict: 'energia', isos: ['643', '276'],
        did: 'Antes da guerra, o gás russo aquecia a Europa por dutos gigantes. Com as sanções, os dutos viraram para a Ásia — e a Europa passou a comprar energia bem mais cara de outros. O mapa da energia foi redesenhado em dois anos.',
        simples: 'Antes da guerra, a Europa comprava muito gás russo por dutos. Depois das sanções, a Rússia vendeu mais para a Ásia e a Europa buscou energia em outros lugares.',
        didStats: [
          { v: 'leste', k: 'o novo rumo do gás russo', sourceIds: ['alfandegas-estatisticas-nacionais', 'sipri-milex'] },
          { v: '2 anos', k: 'para redesenhar o mapa', sourceIds: ['alfandegas-estatisticas-nacionais', 'sipri-milex'] },
        ],
        adv: 'Desacoplamento energético forçado: Power of Siberia + LNG global vs. desindustrialização europeia parcial — energia como alavanca e como custo.',

        dica: 'observe os países destacados e avance para ver como a disputa muda os fluxos',},
      byId('energia'),
      byId('saida'),
      byId('canal'),
      {
        id: 'we-fim', chapter: 'Energia', titulo: 'Quem ficou com a conta?',
        lng: 10, lat: 48, k: 2.2, isos: ['643', '276'],
        did: 'A Rússia vende com desconto, a China e a Índia compram barato, as petroleiras ocidentais lucram com preço alto — e a indústria europeia paga a conta em energia cara. Sanção também é transferência de renda: a pergunta é sempre de quem para quem.',
        simples: 'A Rússia vende parte da energia com desconto, enquanto outros fornecedores vendem mais caro para a Europa. O custo muda de lugar conforme as rotas mudam.',
        didStats: [
          { v: 'desconto', k: 'para quem compra da Rússia', sourceIds: ['alfandegas-estatisticas-nacionais', 'sipri-milex', 'relatorios-anuais-empresas'] },
          { v: 'conta cheia', k: 'para a indústria europeia', sourceIds: ['alfandegas-estatisticas-nacionais', 'sipri-milex', 'relatorios-anuais-empresas'] },
        ],
        adv: 'Balanço das sanções: Urals com desconto vs. TTF elevado — traders e produtores capturam o spread; o custo recai sobre salários e indústria do centro europeu.',
        dica: `finalize para abrir o ${modRef('war')}`,
      },
    ],
  },
  {
    id: 'guerra-reprimaria',
    titulo: 'Reprimarização do Brasil',
    descricao: 'A guerra lenta: grãos e minério no lugar de indústria.',
    accent: RED,
    ...WAR_FINAL,
    stops: [
      {
        id: 'wr-intro', chapter: 'Reprimarização', titulo: 'A guerra lenta',
        lng: -53, lat: -10, k: 2.2, isos: ['076'],
        did: 'Nem toda guerra tem bomba: há a guerra lenta de um país que desmonta a própria indústria e volta a viver de grãos e minério. O Brasil tinha 27% da economia na indústria em 1985; hoje tem 11%. Este tour mostra como se perde uma guerra sem nenhum tiro.',
        simples: 'A indústria perdeu espaço na economia brasileira desde os anos 1980. Ao mesmo tempo, grãos e minérios ganharam mais importância nas exportações.',
        didStats: [
          { v: '27% → 11%', k: 'indústria no PIB desde 1985', sourceIds: ['ibge', 'oit-trabalho'] },
          { v: '92 mi', k: 'fora ou na borda do emprego', sourceIds: ['ibge', 'oit-trabalho'] },
        ],
        adv: 'Especialização regressiva + exército de reserva de 92,1 mi: a reprimarização como derrota histórica — TMD com desindustrialização precoce.',

        dica: 'observe os países destacados e compare esta parada com a anterior',},
      byId('origem'),
      byId('vaza'),
      byId('remessas'),
      {
        id: 'wr-fim', chapter: 'Reprimarização', titulo: 'Dá para reverter?',
        lng: -53, lat: -10, k: 2.8, isos: ['076'],
        did: `Reverter exige o que foi desmontado: indústria, tecnologia, emprego formal — e segurar aqui parte do excedente que hoje viaja para fora. O ${modRef('war')} mostra as frentes; o ${modRef('alternatives')}, os caminhos.`,
        simples: 'Para aumentar a produção industrial, o país precisaria investir em tecnologia, empregos, infraestrutura e empresas capazes de produzir mais aqui.',
        didStats: [
          { v: 'indústria', k: 'o que foi desmontado', sourceIds: ['ibge', 'tmd-literatura'] },
          { v: 'reter', k: 'o excedente que viaja', sourceIds: ['ibge', 'tmd-literatura'] },
        ],
        adv: 'Reversão da reprimarização exige política industrial orientada por complexidade produtiva, encadeamentos locais e aprendizagem tecnológica, além de crédito de longo prazo e gestão da restrição externa. Controle de capitais, câmbio e reforma tributária mudam a disputa pelo excedente; sem coordenação macroeconômica, investimento industrial pode esbarrar em importações, inflação e fuga financeira.',
        dica: `finalize para abrir o ${modRef('war')}`,
      },
    ],
  },

  /* ═══ MORTES DO CAPITALISMO ═══ */
  {
    id: 'mortes',
    titulo: 'Mortes do Capitalismo',
    descricao: `Os massacres do ${modRef('consequences')}, país por país.`,
    accent: ROSE,
    finalTab: 'consequences',
    finalLabel: `ir ao ${modTitle('consequences')} →`,
    stops: [
      {
        id: 'm-intro', chapter: 'Mortes · Abertura', titulo: 'O preço em vidas',
        lng: 20, lat: 20, k: 1.4, layer: 'deaths',
        did: `O ${modRef('consequences')} cataloga os massacres da história do capitalismo — e o padrão se repete: o lucro fica com poucos, a conta em vidas fica com os países pobres. Este tour visita cada lugar e mostra como cada tragédia atrasou o país onde aconteceu.`,
        simples: 'Este tour mostra acidentes e problemas ligados a empresas que causaram mortes e doenças. Vamos comparar o que aconteceu e quais regras falharam.',
        didStats: [
          { v: '10', k: 'casos documentados', sourceIds: ['desastres-corporativos', 'oit-trabalho'] },
          { v: '2,9 mi', k: 'mortes do trabalho/ano', sourceIds: ['desastres-corporativos', 'oit-trabalho'] },
        ],
        adv: 'Violência corporativa pode ser analisada como externalização de custos sob assimetria regulatória e jurídica: empresas internalizam receita e transferem risco ambiental, sanitário e laboral para trabalhadores, comunidades e Estado. A noção de slow violence ajuda a ligar acidentes súbitos a danos cumulativos, enquanto seguros, multas e acordos mostram como parte do risco é precificada como custo de operação.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-bhopal', chapter: 'Mortes · Índia', titulo: 'Bhopal: a noite do gás',
        lng: 77.4, lat: 23.2, k: 3.0, layer: 'deaths', isos: ['356'],
        did: 'Em 1984, gás venenoso vazou sobre uma cidade dormindo na Índia — porque a matriz tinha cortado custos de segurança. Mais de meio milhão de intoxicados. O acordo pagou cerca de US$ 500 por vítima, e a contaminação atravessa gerações. A mensagem para investidores foi clara: vida indiana sai barato.',
        simples: 'Em 1984, um vazamento de gás tóxico em Bhopal, na Índia, atingiu centenas de milhares de pessoas. A contaminação e as disputas por reparação continuaram por décadas.',
        didStats: [
          { v: '570 mil', k: 'intoxicados', sourceIds: ['desastres-corporativos'] },
          { v: 'US$ 470 mi', k: 'o acordo com a Union Carbide', sourceIds: ['desastres-corporativos'] },
        ],
        adv: 'Bhopal combina duplo padrão de segurança, redução de custos, falhas de manutenção e enorme assimetria jurídica entre matriz e população atingida. O acordo de aproximadamente US$470 milhões limitou responsabilidade financeira frente a centenas de milhares de expostos; a persistência de contaminação ilustra externalização intergeracional e slow violence associada ao passivo químico.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-vilasoco', chapter: 'Mortes · Brasil', titulo: 'Cubatão: a vila que explodiu',
        lng: -46.4, lat: -23.9, k: 3.2, layer: 'deaths', isos: ['076'],
        did: 'No mesmo mês de Bhopal, uma favela inteira explodiu no Brasil sobre um vazamento de gasolina — em plena ditadura. O número oficial fala em 508 mortos; moradores falam em mais de 700. Território pobre virou zona de sacrifício do polo industrial.',
        simples: 'Em 1984, um vazamento de combustível provocou um grande incêndio na Vila Socó, em Cubatão. O número de mortos ainda é discutido por fontes diferentes.',
        didStats: [
          { v: '508 (700+)', k: 'mortos em 1984', sourceIds: ['desastres-corporativos'] },
          { v: 'ditadura', k: 'sem direito a reclamar', sourceIds: ['desastres-corporativos'] },
        ],
        adv: 'Vila Socó mostra como infraestrutura de alto risco atravessando assentamento precário transforma desigualdade territorial em risco industrial. Vazamento em duto, urbanização sem proteção e repressão política limitaram prevenção e responsabilização; a divergência entre contagem oficial e estimativas comunitárias também revela disputa sobre mensuração do dano e reconhecimento das vítimas.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-vale', chapter: 'Mortes · Brasil', titulo: 'A Vale e os dois rios de lama',
        lng: -43.8, lat: -20.15, k: 3.0, layer: 'deaths', isos: ['076'],
        did: 'Mariana em 2015, Brumadinho em 2019: duas barragens da mesma Vale, 289 mortos, um rio de 600 km destruído. Laudos dizem que a empresa sabia do risco. O minério que enriquece acionistas no mundo todo deixou lama e luto em Minas — e um acordo bilionário que ainda não recuperou o rio.',
        simples: 'As barragens de Mariana e Brumadinho romperam em 2015 e 2019. Centenas de pessoas morreram e rios e cidades foram atingidos pela lama.',
        didStats: [
          { v: '19 + 270', k: 'mortos nas duas barragens', sourceIds: ['desastres-corporativos'] },
          { v: '600 km', k: 'de lama no rio Doce', sourceIds: ['desastres-corporativos'] },
        ],
        adv: 'Fundão e B1 expõem governança de barragens a montante, incentivos de custo e falhas de monitoramento em uma cadeia mineral de alta rentabilidade. O resultado combina mortes, passivo ambiental de longa duração e acordos bilionários: receita e dividendos são privados durante a operação, enquanto reparação, fiscalização e recuperação ecológica distribuem custos por décadas.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-rana', chapter: 'Mortes · Bangladesh', titulo: 'As costureiras do desabamento',
        lng: 90.3, lat: 23.7, k: 3.0, layer: 'deaths', flowId: 'det-bgd-eu', isos: ['050'],
        did: 'Em 2013, o Rana Plaza desabou com 4 mil costureiras dentro — as marcas sabiam das rachaduras desde o dia anterior. Morreram 1.134 mulheres que costuravam por US$ 113 ao mês. Bangladesh ficou preso ao papel de chão de fábrica barato do mundo.',
        simples: 'Em 2013, o prédio Rana Plaza desabou em Bangladesh. Mais de mil trabalhadores da indústria de roupas morreram.',
        didStats: [
          { v: '1.134', k: 'costureiras mortas', sourceIds: ['desastres-corporativos', 'oit-trabalho'] },
          { v: 'US$ 113', k: 'o salário mensal', sourceIds: ['desastres-corporativos', 'oit-trabalho'] },
        ],
        adv: 'Rana Plaza tornou visível a governança fragmentada da cadeia global de vestuário: marcas controlam pedidos e preços, fornecedores locais comprimem prazo e custo e trabalhadores enfrentam poder de barganha reduzido. O Accord pós-desastre introduziu inspeção e obrigações mais fortes, mostrando que segurança depende de regras transnacionais capazes de alcançar quem captura margem no topo da cadeia.',

        dica: 'clique ou toque na rota destacada para abrir os detalhes do fluxo',},
      {
        id: 'm-deepwater', chapter: 'Mortes · EUA', titulo: 'O mar que pegou fogo',
        lng: -88.4, lat: 28.7, k: 2.6, layer: 'deaths', isos: ['840'],
        did: 'Até no centro a conta chega: a plataforma da BP explodiu e vazou quase 5 milhões de barris por 87 dias no Golfo do México — com cortes de custo documentados antes. Pescadores do Golfo perderam o mar por anos. Multa bilionária paga, ninguém preso.',
        simples: 'Em 2010, a plataforma Deepwater Horizon explodiu no Golfo do México. O vazamento de petróleo durou 87 dias e causou grandes danos.',
        didStats: [
          { v: '4,9 mi', k: 'barris vazados', sourceIds: ['desastres-corporativos'] },
          { v: '87 dias', k: 'vazando sem parar', sourceIds: ['desastres-corporativos'] },
        ],
        adv: 'Macondo: decisões de custo documentadas (CSB) + acordo de US$20,8 bi — no centro, a externalização vira multa administrável; na periferia, nem isso.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-opioides', chapter: 'Mortes · EUA', titulo: 'A epidemia receitada',
        lng: -73.5, lat: 41, k: 2.8, layer: 'deaths', isos: ['840'],
        did: 'Uma empresa mentiu por décadas dizendo que seu remédio "quase não viciava" — e vendeu uma epidemia: 500 mil mortos. A família dona embolsou bilhões e blindou a fortuna na falência. A dor de um país desindustrializado virou mercado.',
        simples: 'Nos EUA, medicamentos opioides foram vendidos por anos com riscos de dependência minimizados. A crise provocou centenas de milhares de mortes.',
        didStats: [
          { v: '500 mil', k: 'mortos', sourceIds: ['desastres-corporativos'] },
          { v: '0', k: 'presos da família dona', sourceIds: ['desastres-corporativos'] },
        ],
        adv: 'A crise dos opioides combina marketing farmacêutico agressivo, incentivos de prescrição, assimetria de informação e falhas regulatórias. A financeirização da empresa e a proteção patrimonial dos controladores durante a falência mostram separação entre responsabilidade corporativa e riqueza familiar; custos de saúde, mortalidade e perda de trabalho foram socializados em larga escala.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-piper', chapter: 'Mortes · Reino Unido', titulo: 'A plataforma mais lucrativa',
        lng: -1.4, lat: 58.1, k: 2.6, layer: 'deaths', isos: ['826'],
        did: 'No Mar do Norte, 167 homens morreram na Piper Alpha — a plataforma mais lucrativa da região. Uma válvula liberada sem conferência, com a bomba ligada: produzir sem parar valia mais que conferir. O petróleo britânico tem essas vidas no preço.',
        simples: 'Em 1988, um incêndio destruiu a plataforma Piper Alpha no Mar do Norte. Morreram 167 trabalhadores.',
        didStats: [
          { v: '167', k: 'mortos em 1988', sourceIds: ['desastres-corporativos'] },
          { v: 'uptime', k: 'valia mais que a checagem', sourceIds: ['desastres-corporativos'] },
        ],
        adv: 'O Cullen Inquiry sobre Piper Alpha mostrou falhas de permit-to-work, comunicação entre turnos e gestão de manutenção em uma plataforma submetida a pressão por continuidade operacional. É um caso clássico em que organização do trabalho e metas de produção transformam risco técnico em risco sistêmico, com 167 mortes e posterior reforma regulatória no Mar do Norte.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-minamata', chapter: 'Mortes · Japão', titulo: '36 anos de mercúrio',
        lng: 130.6, lat: 32.2, k: 2.8, layer: 'deaths', isos: ['392'],
        did: 'Uma empresa despejou mercúrio na baía por 36 anos sabendo do envenenamento: bebês nasceram com malformações, pescadores perderam tudo — e a empresa ainda agrediu manifestantes. O Japão só pediu desculpas oficiais em 2020. Crescer primeiro, reconhecer depois.',
        simples: 'Uma fábrica despejou mercúrio na baía de Minamata, no Japão, por muitos anos. O veneno contaminou peixes e causou doenças graves em moradores.',
        didStats: [
          { v: '36 anos', k: 'despejando veneno', sourceIds: ['desastres-corporativos'] },
          { v: '2020', k: 'o pedido oficial de desculpas', sourceIds: ['desastres-corporativos'] },
        ],
        adv: 'Minamata evidencia externalização química cumulativa: despejo de metilmercúrio, bioacumulação na cadeia alimentar, atraso no reconhecimento causal e longa disputa por compensação. A assimetria entre empresa, governo e pescadores converteu dano ambiental em doença crônica e conflito por reconhecimento, tornando o caso referência para justiça ambiental e responsabilidade corporativa.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-kader', chapter: 'Mortes · Tailândia', titulo: 'As portas trancadas',
        lng: 100.5, lat: 14, k: 3.0, layer: 'deaths', isos: ['764'],
        did: 'A fábrica que fazia os brinquedos do Natal americano pegou fogo sem saídas de emergência — com as portas trancadas. Morreram 188 jovens migrantes. A Tailândia entrou na cadeia global como chão de fábrica descartável: barato, rápido e sem direitos.',
        simples: 'Em 1993, um incêndio na fábrica Kader, na Tailândia, matou 188 trabalhadores. O caso mostrou falhas graves de segurança e saída de emergência.',
        didStats: [
          { v: '188', k: 'trabalhadoras mortas', sourceIds: ['desastres-corporativos', 'oit-trabalho'] },
          { v: 'trancadas', k: 'as portas de saída', sourceIds: ['desastres-corporativos', 'oit-trabalho'] },
        ],
        adv: 'Kader (1993) combinou construção inadequada, carga inflamável, saídas insuficientes e organização precária do trabalho numa cadeia exportadora de brinquedos. A tragédia conecta arbitragem de custos e fragmentação da responsabilidade entre contratantes globais e fábrica local, mostrando como padrões de segurança podem ficar abaixo dos exigidos nos mercados compradores.',

        dica: 'observe os casos destacados no mapa e avance para comparar os lugares',},
      {
        id: 'm-fim', chapter: 'Mortes · Fechamento', titulo: 'O padrão',
        lng: 20, lat: 10, k: 1.6,
        did: `Repare o padrão em todos os casos: o lucro foi privatizado na hora, a conta chegou depois — em vidas, rios e baías — e quase ninguém foi preso. Países que aceitam esse preço ficam presos nele: mão de obra barata e natureza barata para sempre. O ${modRef('consequences')} conta cada caso até o fim.`,
        simples: 'Os casos são diferentes, mas têm algo em comum: decisões de empresas e falhas de fiscalização podem deixar custos enormes para trabalhadores, famílias e cidades.',
        didStats: [
          { v: 'lucro agora', k: 'conta em vidas depois', sourceIds: ['desastres-corporativos', 'oit-trabalho'] },
          { v: 'impunidade', k: 'o subsídio invisível', sourceIds: ['desastres-corporativos', 'oit-trabalho'] },
        ],
        adv: 'O padrão transversal é a separação entre apropriação privada do excedente e distribuição social do risco: trabalhadores e territórios absorvem mortalidade, doença e passivos ambientais enquanto a responsabilidade é limitada por contratos, seguros, personalidade jurídica e acordos. Regulação, sindicatos, transparência e capacidade de reparação determinam quanto desse custo permanece externalizado.',
        dica: `finalize para abrir o ${modRef('consequences')} com todos os casos`,
      },
    ],
  },
]

export const getTour = (id: string): TourDef =>
  TOURES.find((t) => t.id === id) ?? TOURES[0]
