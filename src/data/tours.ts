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
import { TOUR_STOPS, tourStopForLang, type TourStop } from './tour'
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

  /* ═══ AULA DE GEOGRAFIA — Divisão Internacional do Trabalho (DIT) e Cadeias Globais ═══ */
  {
    id: 'aula-geografia',
    titulo: 'Aula de Geografia · DIT e Cadeias Globais',
    descricao: 'Centro, Semiperiferia e Periferia: recursos naturais, manufatura asiática e gargalos logísticos.',
    accent: '#38bdf8',
    finalTab: 'home',
    finalLabel: `explorar ${modTitle('home')} →`,
    stops: [
      {
        id: 'geo-intro',
        chapter: 'Geografia · Abertura',
        titulo: 'A Divisão Internacional do Trabalho no século XXI',
        lng: 10, lat: 20, k: 1.4,
        isos: ['840', '156', '076'],
        did: 'A Geografia Econômica explica por que o espaço mundial é desigual: países do Centro concentram comando financeiro, patentes e sedes, enquanto a Periferia fornece matérias-primas, energia e montagem barata.',
        simples: 'No mapa do mundo, cada grupo de países cumpre um papel diferente: alguns vendem tecnologia e controlam bancos, enquanto outros fornecem matérias-primas e trabalho barato.',
        didStats: [
          { v: '3 polos', k: 'Centro, Semiperiferia e Periferia', sourceIds: ['unctad', 'comex-mdic'] },
          { v: 'DIT', k: 'Divisão Internacional do Trabalho', sourceIds: ['oit-trabalho', 'ibge'] },
        ],
        adv: 'Divisão Internacional do Trabalho (DIT) sob o capitalismo informacional-financeirizado: hierarquia espacial entre nós de comando (tríade EUA-UE-Japão e polo chinês), semiperiferia industrial e periferia primário-exportadora.',
        dica: 'BNCC: EF08GE05 / EF09GE11 / EM13CHS201 — observe a direção das partículas entre Sul e Norte',
      },
      byId('origem'),
      byId('mina'),
      byId('fabrica'),
      byId('fabrica-muda'),
      byId('chip'),
      byId('canal'),
      byId('salario'),
      {
        id: 'geo-fim',
        chapter: 'Geografia · Fechamento',
        titulo: 'O território como rede desigual',
        lng: -45, lat: -10, k: 2.0,
        isos: ['076', '156', '840'],
        did: 'Fechando a leitura geográfica: o território mundial funciona como uma rede hierárquica onde matérias-primas e trabalho barato fluem da periferia e o comando tecnológico e financeiro permanece concentrado no centro.',
        simples: 'O mapa mostra que os países estão conectados por redes de comércio, mas os ganhos dessas trocas ainda ficam concentrados nos países que dominam a tecnologia e as finanças.',
        didStats: [
          { v: 'Sul → Norte', k: 'sentido líquido da transferência de valor', sourceIds: ['unctad', 'tmd-literatura'] },
          { v: 'BNCC', k: 'Ciências Humanas · Geografia Econômica', sourceIds: ['oit-trabalho', 'ibge'] },
        ],
        adv: 'Síntese geoeconômica (Milton Santos / Harvey): o espaço global combina fluidez para o capital financeiro e seletividade produtiva, reproduzindo o desenvolvimento geograficamente desigual entre Norte e Sul.',
        dica: 'experimente clicar no botão BR para ver a divisão regional dentro do Brasil',
      },
    ],
  },

  /* ═══ AULA DE HISTÓRIA — Hegemonias, Bretton Woods, Choque de 1971 e Multipolaridade ═══ */
  {
    id: 'aula-historia',
    titulo: 'Aula de História · Hegemonias e Dólar',
    descricao: 'Da partilha colonial e Bretton Woods (1944) ao fim do padrão-ouro (1971) e à disputa EUA × China.',
    accent: '#fb7185',
    finalTab: 'war',
    finalLabel: `ir ao ${modTitle('war')} →`,
    stops: [
      {
        id: 'hist-intro',
        chapter: 'História · Abertura',
        titulo: 'Ciclos hegemônicos da economia-mundo',
        lng: -10, lat: 35, k: 1.5,
        isos: ['826', '840', '156'],
        did: 'A história do capitalismo é uma sucessão de potências que lideraram o comércio, a indústria e a moeda: do Império Britânico no século XIX aos Estados Unidos pós-1945 e à disputa atual com a China.',
        simples: 'Ao longo da história, diferentes países lideraram a economia mundial: primeiro o Reino Unido, depois os Estados Unidos e, hoje, há uma forte disputa com a China.',
        didStats: [
          { v: '1944', k: 'Acordo de Bretton Woods (dólar-ouro)', sourceIds: ['vitimas-pesquisa-historica', 'imf-weo'] },
          { v: '56,8%', k: 'peso atual do dólar nas reservas', sourceIds: ['imf-cofer', 'sipri-milex'] },
        ],
        adv: 'Ciclos sistêmicos de acumulação (Arrighi / Braudel): cada hegemonia articula expansão material (comercial-industrial) seguida de hipertrofia financeira na fase de maturidade e transição geopolítica.',
        dica: 'BNCC: EF09HI10 / EF09HI32 / EM13CHS102 — acompanhe a mudança do centro do mundo',
      },
      byId('tecnologia'),
      {
        id: 'hist-1971',
        chapter: 'História · 1971–1979',
        titulo: 'O Choque de 1971 e o nascimento do dólar flexível',
        lng: -40, lat: 35, k: 2.0,
        flowId: 'fin-usa-eu',
        isos: ['840', '276'],
        did: 'Em 1971, os Estados Unidos encerraram a conversão do dólar em ouro. O dólar passou a valer pelo poder político, militar e pelo comércio de petróleo, abrindo a era das finanças desreguladas e da dívida global.',
        simples: 'Em 1971, o dólar deixou de ser trocado por ouro. Mesmo assim, continuou sendo a principal moeda usada no comércio de petróleo e nas reservas dos países.',
        didStats: [
          { v: 'ago/1971', k: 'fim da conversibilidade dólar-ouro', sourceIds: ['imf-cofer', 'us-treasury-tic'] },
          { v: '> US$ 1 tri', k: 'juros anuais da dívida dos EUA hoje', sourceIds: ['imf-fiscal-monitor', 'tesouro-eua-cbo'] },
        ],
        adv: 'Choque Nixon (1971) e Choque Volcker (1979): ruptura do padrão dólar-ouro de Bretton Woods e transição para o padrão dólar-flexível ancorado em Treasuries, petrodólar e livre mobilidade de capitais.',
        dica: 'clique na linha amarela para ver o papel dos títulos do Tesouro dos EUA',
      },
      byId('credor'),
      byId('divida'),
      byId('fantasma'),
      byId('saida'),
      {
        id: 'hist-fim',
        chapter: 'História · Fechamento',
        titulo: 'Transição hegemônica no século XXI',
        lng: 60, lat: 30, k: 1.6,
        isos: ['840', '156', '643'],
        did: 'Olhando o século inteiro, vemos que as regras da economia mundial mudam após grandes crises e guerras. Hoje, a ascensão asiática e os acordos fora do dólar abrem uma nova transição histórica.',
        simples: 'A história mostra que a liderança econômica muda com o tempo. Hoje, novos blocos como o BRICS+ tentam criar alternativas ao domínio exclusivo do dólar.',
        didStats: [
          { v: '~40% PIB', k: 'peso do BRICS+ em paridade de compra', sourceIds: ['imf-cofer', 'pboc-cips'] },
          { v: '1914 a 2026', k: 'linha do tempo completa no Módulo 03', sourceIds: ['bcb-brics', 'imf-weo'] },
        ],
        adv: 'Balanço histórico-estrutural: da Pax Britannica à crise da globalização neoliberal, a transição hegemônica contemporânea opõe o rentismo financeiro dolarizado à capacidade industrial-estatal sino-asiática.',
        dica: `finalize para abrir o ${modRef('war')} e explorar a linha do tempo de 1914 a 2026`,
      },
    ],
  },

  /* ═══ AULA DE ECONOMIA POLÍTICA — Marx, Kalecki, MMT e TMD ═══ */
  {
    id: 'aula-economia',
    titulo: 'Economia Política · Marx, Kalecki, MMT e TMD',
    descricao: 'Roteiro universitário: extração de valor, demanda efetiva, moeda soberana e transferência Sul→Norte.',
    accent: '#a855f7',
    finalTab: 'debt',
    finalLabel: `ir ao ${modTitle('debt')} →`,
    stops: [
      {
        id: 'eco-intro',
        chapter: 'Economia Política · Abertura',
        titulo: 'Quatro lentes para a mesma anatomia',
        lng: 0, lat: 20, k: 1.4,
        isos: ['840', '156', '076', '276'],
        did: 'Quatro lentes explicam este mapa: Marx mostra como o trabalho gera o lucro; Kalecki explica como o gasto sustenta as vendas; a MMT revela o poder de quem emite a moeda; e a TMD mostra como o Sul transfere riqueza ao Norte.',
        simples: 'Este tour junta quatro ideias econômicas para mostrar como o trabalho cria riqueza, como o governo usa a moeda e por que alguns países acumulam mais que outros.',
        didStats: [
          { v: 'W = c+v+m', k: 'decomposição marxista do valor', sourceIds: ['marx-capital', 'heterodox-macro'] },
          { v: '4 pilares', k: 'Marx · Kalecki · MMT · TMD', sourceIds: ['mmt-literatura', 'tmd-literatura'] },
        ],
        adv: 'Integração analítica dos 4 pilares: lei do valor e composição orgânica (Marx), princípio da demanda efetiva (Kalecki), hierarquia e soberania monetária (MMT) e superexploração com transferência de valor (TMD).',
        dica: 'ative o nível Avançado no topo do card para ler as identidades macroeconômicas completas',
      },
      byId('fabrica'),
      byId('vaza'),
      byId('dolar'),
      byId('fantasma'),
      byId('salario'),
      byId('agora'),
      {
        id: 'eco-fim',
        chapter: 'Economia Política · Fechamento',
        titulo: 'A síntese macroeconômica crítica',
        lng: -53, lat: -10, k: 2.2,
        isos: ['076', '840', '392'],
        did: 'Unindo as quatro escolas, fica claro que produção, moeda, orçamento público e comércio internacional formam uma única engrenagem. Mudar o resultado exige atuar sobre a propriedade, o trabalho e a soberania.',
        simples: 'Juntando todas as partes, vemos que produção, salários, impostos e comércio mundial estão conectados e dependem de escolhas políticas e econômicas.',
        didStats: [
          { v: 'g = e/(k+1)', k: 'taxa de lucro sobre o capital adiantado', sourceIds: ['marx-capital', 'tmd-literatura'] },
          { v: '(S−I)≡(G−T)+NX', k: 'identidade dos balanços setoriais', sourceIds: ['mmt-literatura', 'heterodox-macro'] },
        ],
        adv: 'Síntese de economia política: a reprodução ampliada em escala mundial articula extração de mais-valia (Pilar 1), realização kaleckiana (Pilar 2), moeda estatal/fictícia (Pilar 3) e drenagem centro-periferia (Pilar 4).',
        dica: `finalize para abrir o ${modRef('debt')} com o simulador de Kalecki e os balanços da MMT`,
      },
    ],
  },
]

export const getTour = (id: string): TourDef =>
  TOURES.find((t) => t.id === id) ?? TOURES[0]

type TourLang = 'pt' | 'en' | 'es'
type CustomStopLocale = {
  chapter: string
  titulo: string
  did: string
  simples: string
  adv: string
  stats: string[]
  dica?: string
}

const TOUR_META_I18N: Record<string, Record<'en' | 'es', Pick<TourDef, 'titulo' | 'descricao'>>> = {
  principal: {
    en: { titulo: 'How capitalism works', descricao: 'The full tour: from the ground to money, from profit to social cost.' },
    es: { titulo: 'Cómo funciona el capitalismo', descricao: 'El tour completo: de la tierra a la moneda, de la ganancia al costo social.' },
  },
  guerra: {
    en: { titulo: 'Wars and capital flows', descricao: 'How wars redraw routes, redistribute income and change who pays.' },
    es: { titulo: 'Guerras y flujos de capital', descricao: 'Cómo las guerras redibujan rutas, redistribuyen renta y cambian quién paga.' },
  },
  'guerra-semis': {
    en: { titulo: 'The Semiconductor War', descricao: 'United States × China over the brain of modern production.' },
    es: { titulo: 'La guerra de los semiconductores', descricao: 'Estados Unidos × China por el cerebro de la producción moderna.' },
  },
  'guerra-energia': {
    en: { titulo: 'Energy War and Sanctions', descricao: 'Russia × NATO/EU over gas, oil and routes.' },
    es: { titulo: 'Guerra energética y sanciones', descricao: 'Rusia × OTAN/UE por gas, petróleo y rutas.' },
  },
  'guerra-reprimaria': {
    en: { titulo: 'Brazil’s Reprimarization', descricao: 'The slow conflict: grain and ore displacing industrial weight.' },
    es: { titulo: 'Reprimarización de Brasil', descricao: 'El conflicto lento: granos y mineral desplazando peso industrial.' },
  },
  mortes: {
    en: { titulo: 'Deaths of Capitalism', descricao: 'Corporate disasters and work-related deaths, country by country.' },
    es: { titulo: 'Muertes del capitalismo', descricao: 'Desastres corporativos y muertes laborales, país por país.' },
  },
  'aula-geografia': {
    en: { titulo: 'Geography Lesson · IDL & Global Chains', descricao: 'Core, Semiperiphery and Periphery: natural resources, Asian manufacturing and logistical bottlenecks.' },
    es: { titulo: 'Clase de Geografía · DIT y Cadenas Globales', descricao: 'Centro, Semiperiferia y Periferia: recursos naturales, manufactura asiática y cuellos de botella logísticos.' },
  },
  'aula-historia': {
    en: { titulo: 'History Lesson · Hegemonies & The Dollar', descricao: 'From colonial division and Bretton Woods (1944) to the end of the gold standard (1971) and US × China rivalry.' },
    es: { titulo: 'Clase de Historia · Hegemonías y el Dólar', descricao: 'Del reparto colonial y Bretton Woods (1944) al fin del patrón oro (1971) y la disputa EE. UU. × China.' },
  },
  'aula-economia': {
    en: { titulo: 'Political Economy · Marx, Kalecki, MMT & TMD', descricao: 'University itinerary: value extraction, effective demand, sovereign currency and South→North transfers.' },
    es: { titulo: 'Economía Política · Marx, Kalecki, MMT y TMD', descricao: 'Recorrido universitario: extracción de valor, demanda efectiva, moneda soberana y transferencia Sur→Norte.' },
  },
}

const CUSTOM_STOP_I18N: Record<string, Record<'en' | 'es', CustomStopLocale>> = {
  'w-intro': {
    en: { chapter: 'War · Opening', titulo: 'When war redraws the map', did: 'Wars do more than destroy cities: they reroute pipelines, shipping, public budgets and trade. This tour follows the money through those changes.', simples: 'Wars change routes, public spending and prices. This tour shows how conflict also changes where money goes.', adv: 'War reallocates surplus through sanctions, chokepoints, military budgets and strategic procurement. The military-industrial complex becomes a durable destination for public and private income.', stats: ['NATO military spending per year', 'of global military spending'], dica: 'watch the highlighted countries and compare this stop with the previous one' },
    es: { chapter: 'Guerra · Apertura', titulo: 'Cuando la guerra redibuja el mapa', did: 'Las guerras hacen más que destruir ciudades: redirigen ductos, transporte, presupuestos públicos y comercio. Este tour sigue el dinero a través de esos cambios.', simples: 'Las guerras cambian rutas, gasto público y precios. Este tour muestra cómo el conflicto también cambia el camino del dinero.', adv: 'La guerra reasigna excedente mediante sanciones, cuellos de botella, presupuestos militares y compras estratégicas. El complejo militar-industrial se vuelve un destino permanente de renta pública y privada.', stats: ['gasto militar de la OTAN por año', 'del gasto militar mundial'], dica: 'observa los países destacados y compara esta parada con la anterior' },
  },
  'w-suez': {
    en: { chapter: 'War · Chokepoints', titulo: 'The canal in the crosshairs', did: 'Around 12% of world trade normally passes through Suez. Red Sea conflict reduced traffic, pushed ships around Africa and sharply cut Egypt’s toll revenue.', simples: 'Suez is an important shortcut for ships. When conflict reduces traffic, Egypt loses revenue and transport can become more expensive.', adv: 'Suez and Bab el-Mandeb are strategic chokepoints: rerouting through the Cape raises freight and insurance costs while turning transit income into a geopolitical vulnerability.', stats: ['of world trade passes through Suez', 'decline in Egypt’s canal revenue'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Guerra · Cuellos de botella', titulo: 'El canal bajo fuego', did: 'Cerca del 12% del comercio mundial suele pasar por Suez. El conflicto del Mar Rojo redujo el tráfico, desvió barcos por África y recortó fuertemente los ingresos de peaje de Egipto.', simples: 'Suez es un atajo importante para barcos. Cuando el conflicto reduce el tráfico, Egipto pierde ingresos y el transporte puede encarecerse.', adv: 'Suez y Bab el-Mandeb son cuellos de botella estratégicos: desviar barcos por el Cabo eleva fletes y seguros y convierte la renta de tránsito en vulnerabilidad geopolítica.', stats: ['del comercio mundial pasa por Suez', 'caída de los ingresos del canal de Egipto'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  'w-dolar': {
    en: { chapter: 'War · Weapons', titulo: 'The dollar as a weapon', did: 'Financial sanctions can freeze reserves and cut banks off from payment networks. Because dollar finance is global, the effects also reach allies and third countries.', simples: 'Sanctions can block reserves and international payments. Because the dollar is widely used, U.S. decisions also affect other countries.', adv: 'Extraterritorial dollar clearing, reserve freezes and financial-network access turn monetary hierarchy into a geopolitical instrument with costs that spread through exchange rates, energy and trade.', stats: ['European holdings of U.S. securities', 'reserves of sanctioned states'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Guerra · Armas', titulo: 'El dólar como arma', did: 'Las sanciones financieras pueden congelar reservas y excluir bancos de redes de pago. Como las finanzas en dólares son globales, sus efectos también alcanzan a aliados y terceros países.', simples: 'Las sanciones pueden bloquear reservas y pagos internacionales. Como el dólar se usa mucho, decisiones de EE. UU. también afectan a otros países.', adv: 'El clearing extraterritorial en dólares, el congelamiento de reservas y el acceso a redes financieras convierten la jerarquía monetaria en instrumento geopolítico con costos que se transmiten por tipo de cambio, energía y comercio.', stats: ['tenencias europeas de títulos de EE. UU.', 'reservas de Estados sancionados'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  'w-fim': {
    en: { chapter: 'War · Closing', titulo: 'Who gained?', did: 'Conflict creates winners and losers: arms makers, energy firms and traders can gain revenue while households, workers and governments absorb higher energy, transport and fiscal costs.', simples: 'Conflicts create economic winners and losers. Arms and energy companies can earn more while families and governments face higher costs.', adv: 'The class balance of conflict shifts extraordinary rents toward military and energy capital while wage earners and import-dependent economies absorb shocks through prices and fiscal adjustment.', stats: ['arms + energy', 'who pays'], dica: 'finish to open the war module with each front in detail' },
    es: { chapter: 'Guerra · Cierre', titulo: '¿Quién ganó?', did: 'El conflicto crea ganadores y perdedores: fabricantes de armas, empresas energéticas y traders pueden aumentar ingresos mientras hogares, trabajadores y gobiernos absorben mayores costos de energía, transporte y presupuesto.', simples: 'Los conflictos crean ganadores y perdedores económicos. Empresas de armas y energía pueden ganar más mientras familias y gobiernos enfrentan costos mayores.', adv: 'El balance de clase del conflicto desplaza rentas extraordinarias hacia capital militar y energético mientras asalariados y economías dependientes de importaciones absorben shocks mediante precios y ajuste fiscal.', stats: ['armas + energía', 'quién paga'], dica: 'termina para abrir el módulo de guerra con cada frente en detalle' },
  },
  'ws-intro': {
    en: { chapter: 'Semiconductors', titulo: 'The war over the brain', did: 'Phones, vehicles, missiles and AI all depend on advanced chips. The United States restricts some technology exports to China while China invests heavily in domestic capacity.', simples: 'Advanced chips are essential to phones, cars, AI and weapons. The United States and China dispute who can make and buy these technologies.', adv: 'Export controls on lithography, advanced accelerators and manufacturing equipment target the most advanced fixed capital in the semiconductor chain while industrial subsidies seek to relocate strategic capacity.', stats: ['of leading-edge logic: TSMC, approx.', 'the U.S. tool'], dica: 'watch the highlighted countries and continue to see how the dispute changes flows' },
    es: { chapter: 'Semiconductores', titulo: 'La guerra por el cerebro', did: 'Teléfonos, vehículos, misiles e IA dependen de chips avanzados. Estados Unidos restringe ciertas exportaciones tecnológicas a China mientras China invierte fuertemente en capacidad doméstica.', simples: 'Los chips avanzados son esenciales para teléfonos, autos, IA y armas. Estados Unidos y China disputan quién puede fabricar y comprar esas tecnologías.', adv: 'Controles de exportación sobre litografía, aceleradores avanzados y equipos de fabricación apuntan al capital fijo más avanzado de la cadena, mientras subsidios industriales intentan relocalizar capacidad estratégica.', stats: ['de la lógica de vanguardia: TSMC, aprox.', 'la herramienta estadounidense'], dica: 'observa los países destacados y continúa para ver cómo cambia los flujos la disputa' },
  },
  'ws-fim': {
    en: { chapter: 'Semiconductors', titulo: 'Where does Brazil fit?', did: 'Brazil remains dependent on imported leading-edge chips embedded in phones, machines and industrial systems. That limits bargaining power in a technology conflict centered elsewhere.', simples: 'Brazil still depends on advanced chips made abroad. That leaves the country more exposed to external prices and decisions.', adv: 'Peripheral technology dependence means limited foundry capacity, intellectual property and bargaining power; Brazil enters the chip conflict mainly as a market and importer.', stats: ['leading-edge chip fabs', 'imported inside devices'], dica: 'finish to open the war module' },
    es: { chapter: 'Semiconductores', titulo: '¿Y Brasil dónde queda?', did: 'Brasil sigue dependiendo de chips de vanguardia importados dentro de teléfonos, máquinas y sistemas industriales. Eso limita su poder de negociación en una disputa tecnológica cuyo centro está fuera.', simples: 'Brasil todavía depende de chips avanzados fabricados en el exterior. Eso lo deja más expuesto a precios y decisiones externas.', adv: 'La dependencia tecnológica periférica implica capacidad de foundry, propiedad intelectual y poder de negociación limitados; Brasil entra en la guerra de chips principalmente como mercado e importador.', stats: ['fábricas de chips de vanguardia', 'importados dentro de dispositivos'], dica: 'termina para abrir el módulo de guerra' },
  },
  'we-intro': {
    en: { chapter: 'Energy', titulo: 'The pipeline war', did: 'Before the war, large pipelines carried Russian gas toward Europe. Sanctions and political rupture redirected more Russian energy toward Asia while Europe sought other, often more expensive, suppliers.', simples: 'Before the war, Europe bought a lot of Russian pipeline gas. After sanctions, Russia sold more to Asia and Europe found other suppliers.', adv: 'Forced energy decoupling combines new Asian pipeline and shipping routes with higher European input costs and investment in alternative LNG infrastructure.', stats: ['new direction of Russian gas', 'to redraw the map'], dica: 'watch the highlighted countries and continue to see how the dispute changes flows' },
    es: { chapter: 'Energía', titulo: 'La guerra de los ductos', did: 'Antes de la guerra, grandes ductos llevaban gas ruso hacia Europa. Las sanciones y la ruptura política redirigieron más energía rusa hacia Asia mientras Europa buscó otros proveedores, a menudo más caros.', simples: 'Antes de la guerra, Europa compraba mucho gas ruso por ductos. Después de las sanciones, Rusia vendió más a Asia y Europa buscó otros proveedores.', adv: 'El desacople energético forzado combina nuevas rutas asiáticas por ductos y mar con mayores costos de insumos europeos e inversión en infraestructura alternativa de GNL.', stats: ['nuevo rumbo del gas ruso', 'para redibujar el mapa'], dica: 'observa los países destacados y continúa para ver cómo cambia los flujos la disputa' },
  },
  'we-fim': {
    en: { chapter: 'Energy', titulo: 'Who got the bill?', did: 'Russia sells some energy at a discount, China and India buy cheaper barrels, and Europe pays more for alternative supply. Sanctions redistribute income as well as trade routes.', simples: 'Russia sells some energy at a discount while other suppliers charge Europe more. Costs move as routes change.', adv: 'The sanctions balance combines discounted Urals crude, elevated European energy prices and trading spreads. Producers and intermediaries can capture rents while industry and wage earners absorb higher costs.', stats: ['for buyers of Russian energy', 'for European industry'], dica: 'finish to open the war module' },
    es: { chapter: 'Energía', titulo: '¿Quién recibió la factura?', did: 'Rusia vende parte de su energía con descuento, China e India compran barriles más baratos y Europa paga más por proveedores alternativos. Las sanciones redistribuyen renta además de rutas comerciales.', simples: 'Rusia vende parte de la energía con descuento mientras otros proveedores cobran más a Europa. Los costos cambian de lugar junto con las rutas.', adv: 'El balance de sanciones combina crudo Urals con descuento, precios energéticos europeos elevados y márgenes de intermediación. Productores y traders pueden capturar rentas mientras industria y asalariados absorben mayores costos.', stats: ['para compradores de energía rusa', 'para la industria europea'], dica: 'termina para abrir el módulo de guerra' },
  },
  'wr-intro': {
    en: { chapter: 'Reprimarization', titulo: 'The slow conflict', did: 'Brazil’s industrial share fell sharply from the 1980s while grain, mining and other primary exports gained importance. This tour treats that structural change as a slow economic conflict.', simples: 'Industry lost weight in Brazil’s economy from the 1980s onward while grain and minerals became more important in exports.', adv: 'Early deindustrialization and a large reserve workforce combine with commodity specialization to create a dependency pattern in which productive complexity and bargaining power weaken.', stats: ['industry share of GDP since 1985', 'outside or on the edge of employment'], dica: 'watch the highlighted countries and compare this stop with the previous one' },
    es: { chapter: 'Reprimarización', titulo: 'El conflicto lento', did: 'La participación industrial de Brasil cayó fuertemente desde los años 1980 mientras granos, minería y otras exportaciones primarias ganaron importancia. Este tour trata ese cambio estructural como un conflicto económico lento.', simples: 'La industria perdió peso en la economía brasileña desde los años 1980 mientras granos y minerales ganaron importancia en las exportaciones.', adv: 'La desindustrialización temprana y una gran reserva laboral se combinan con especialización en commodities para crear un patrón de dependencia donde complejidad productiva y poder de negociación se debilitan.', stats: ['participación industrial en el PIB desde 1985', 'fuera o en el borde del empleo'], dica: 'observa los países destacados y compara esta parada con la anterior' },
  },
  'wr-fim': {
    en: { chapter: 'Reprimarization', titulo: 'Can it be reversed?', did: 'Reversal would require industrial capability, technology, infrastructure, formal employment and mechanisms that retain more value inside the country.', simples: 'Increasing industrial production would require investment in technology, jobs, infrastructure and firms capable of producing more domestically.', adv: 'Reindustrialization requires productive-complexity policy, local linkages, technological learning, long-term credit and management of the external constraint. Exchange-rate, capital-flow and tax policy affect how much surplus can finance that transition.', stats: ['what lost weight', 'more surplus at home'], dica: 'finish to open the war module' },
    es: { chapter: 'Reprimarización', titulo: '¿Se puede revertir?', did: 'Revertirla exigiría capacidad industrial, tecnología, infraestructura, empleo formal y mecanismos que retengan más valor dentro del país.', simples: 'Aumentar la producción industrial exigiría inversión en tecnología, empleos, infraestructura y empresas capaces de producir más dentro del país.', adv: 'La reindustrialización exige política de complejidad productiva, encadenamientos locales, aprendizaje tecnológico, crédito de largo plazo y gestión de la restricción externa. Tipo de cambio, flujos de capital y política tributaria influyen en cuánto excedente puede financiar la transición.', stats: ['lo que perdió peso', 'más excedente dentro del país'], dica: 'termina para abrir el módulo de guerra' },
  },
  'm-intro': {
    en: { chapter: 'Deaths · Opening', titulo: 'The price in lives', did: 'This tour visits major corporate and industrial disasters and compares how costs were distributed between companies, workers, communities and states.', simples: 'This tour shows accidents and corporate failures that caused deaths and illness. We compare what happened and which protections failed.', adv: 'Corporate harm can be analyzed as externalization under regulatory and legal asymmetry: firms capture revenue while environmental, health and labor risk is transferred to workers, communities and the public sector.', stats: ['documented cases', 'work-related deaths per year'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · Apertura', titulo: 'El precio en vidas', did: 'Este tour visita grandes desastres corporativos e industriales y compara cómo se distribuyeron los costos entre empresas, trabajadores, comunidades y Estados.', simples: 'Este tour muestra accidentes y fallas empresariales que causaron muertes y enfermedades. Comparamos qué ocurrió y qué protecciones fallaron.', adv: 'El daño corporativo puede analizarse como externalización bajo asimetría regulatoria y jurídica: empresas capturan ingresos mientras riesgo ambiental, sanitario y laboral se transfiere a trabajadores, comunidades y sector público.', stats: ['casos documentados', 'muertes relacionadas con el trabajo por año'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-bhopal': {
    en: { chapter: 'Deaths · India', titulo: 'Bhopal: the night of gas', did: 'In 1984, toxic gas leaked over Bhopal and exposed hundreds of thousands of people. Health effects, contamination and compensation disputes continued for decades.', simples: 'In 1984, a toxic-gas leak in Bhopal, India, affected hundreds of thousands of people. Contamination and compensation disputes continued for decades.', adv: 'Bhopal combined maintenance failures, cost reduction, weak safeguards and enormous legal asymmetry between a multinational parent and the exposed population. Long-term contamination illustrates intergenerational externalization.', stats: ['people exposed or poisoned', 'Union Carbide settlement'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · India', titulo: 'Bhopal: la noche del gas', did: 'En 1984, gas tóxico escapó sobre Bhopal y expuso a cientos de miles de personas. Efectos de salud, contaminación y disputas por reparación continuaron durante décadas.', simples: 'En 1984, una fuga de gas tóxico en Bhopal, India, afectó a cientos de miles de personas. La contaminación y las disputas por reparación continuaron por décadas.', adv: 'Bhopal combinó fallas de mantenimiento, reducción de costos, protecciones débiles y enorme asimetría jurídica entre una matriz multinacional y la población expuesta. La contaminación persistente ilustra externalización intergeneracional.', stats: ['personas expuestas o intoxicadas', 'acuerdo con Union Carbide'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-vilasoco': {
    en: { chapter: 'Deaths · Brazil', titulo: 'Cubatão: the neighborhood that exploded', did: 'In 1984, a fuel leak caused a huge fire in Vila Socó, Cubatão. Official and community death counts differ, illustrating how industrial risk and vulnerable urban territory can overlap.', simples: 'In 1984, a fuel leak caused a major fire in Vila Socó, Cubatão. Different sources still disagree on the death toll.', adv: 'Vila Socó shows how hazardous infrastructure crossing precarious settlements turns territorial inequality into industrial risk. Political repression and weak protection also limited prevention and accountability.', stats: ['deaths in 1984', 'political context'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · Brasil', titulo: 'Cubatão: el barrio que explotó', did: 'En 1984, una fuga de combustible provocó un enorme incendio en Vila Socó, Cubatão. Las cifras oficiales y comunitarias difieren, mostrando cómo riesgo industrial y territorio urbano vulnerable pueden superponerse.', simples: 'En 1984, una fuga de combustible provocó un gran incendio en Vila Socó, Cubatão. Distintas fuentes todavía discrepan sobre el número de muertos.', adv: 'Vila Socó muestra cómo infraestructura peligrosa atravesando asentamientos precarios convierte desigualdad territorial en riesgo industrial. Represión política y protección débil también limitaron prevención y responsabilización.', stats: ['muertos en 1984', 'contexto político'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-vale': {
    en: { chapter: 'Deaths · Brazil', titulo: 'Vale and two rivers of mud', did: 'The Mariana and Brumadinho dam failures killed 289 people and caused long-lasting river and community damage. Both disasters came from the same mining system within a few years.', simples: 'The Mariana and Brumadinho dams failed in 2015 and 2019. Hundreds died and rivers and towns were hit by mining waste.', adv: 'The disasters exposed tailings-dam governance, monitoring failures and cost incentives in a highly profitable mineral chain. Private operating revenue coexisted with decades of public and community repair costs.', stats: ['deaths in the two dam failures', 'of the Doce River affected'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · Brasil', titulo: 'Vale y dos ríos de lodo', did: 'Los colapsos de Mariana y Brumadinho mataron a 289 personas y causaron daños de larga duración en ríos y comunidades. Ambos desastres provinieron del mismo sistema minero en pocos años.', simples: 'Las represas de Mariana y Brumadinho colapsaron en 2015 y 2019. Cientos murieron y ríos y ciudades fueron alcanzados por residuos mineros.', adv: 'Los desastres expusieron gobernanza de relaves, fallas de monitoreo e incentivos de costos en una cadena mineral muy rentable. Ingresos privados de operación coexistieron con décadas de costos públicos y comunitarios de reparación.', stats: ['muertos en los dos colapsos', 'del río Doce afectados'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-rana': {
    en: { chapter: 'Deaths · Bangladesh', titulo: 'The garment workers in the collapse', did: 'Rana Plaza collapsed in 2013 with thousands of garment workers inside, killing 1,134 people. The disaster exposed how global brand pressure and weak local safety can interact.', simples: 'Rana Plaza collapsed in Bangladesh in 2013. More than a thousand garment workers died.', adv: 'Rana Plaza made fragmented supply-chain governance visible: brands control price and deadlines, suppliers face cost pressure, and workers often have limited bargaining power. The post-disaster Accord showed how transnational rules can improve safety.', stats: ['garment workers killed', 'monthly wage'], dica: 'click or tap the highlighted route to open flow details' },
    es: { chapter: 'Muertes · Bangladesh', titulo: 'Las trabajadoras del derrumbe', did: 'Rana Plaza colapsó en 2013 con miles de trabajadores textiles dentro y mató a 1.134 personas. El desastre expuso cómo presión de marcas globales y seguridad local débil pueden interactuar.', simples: 'Rana Plaza colapsó en Bangladesh en 2013. Murieron más de mil trabajadores de la industria textil.', adv: 'Rana Plaza hizo visible la gobernanza fragmentada de la cadena: marcas controlan precios y plazos, proveedores enfrentan presión de costos y trabajadores suelen tener poco poder de negociación. El Accord posterior mostró cómo reglas transnacionales pueden mejorar seguridad.', stats: ['trabajadores textiles muertos', 'salario mensual'], dica: 'haz clic o toca la ruta destacada para abrir los detalles del flujo' },
  },
  'm-deepwater': {
    en: { chapter: 'Deaths · U.S.', titulo: 'The sea that caught fire', did: 'Deepwater Horizon exploded in 2010 and released nearly 5 million barrels of oil over 87 days in the Gulf of Mexico. The spill caused enormous ecological and economic damage.', simples: 'In 2010, Deepwater Horizon exploded in the Gulf of Mexico. The oil spill lasted 87 days and caused major damage.', adv: 'Macondo linked documented cost and process decisions to a catastrophic offshore failure. The multibillion-dollar settlement shows how severe externalized harm can later return as a corporate liability.', stats: ['barrels spilled', 'days of uncontrolled flow'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · EE. UU.', titulo: 'El mar que se incendió', did: 'Deepwater Horizon explotó en 2010 y liberó casi 5 millones de barriles de petróleo durante 87 días en el Golfo de México. El derrame causó enormes daños ecológicos y económicos.', simples: 'En 2010, Deepwater Horizon explotó en el Golfo de México. El derrame duró 87 días y causó grandes daños.', adv: 'Macondo vinculó decisiones documentadas de costos y procesos con una falla offshore catastrófica. El acuerdo multimillonario muestra cómo daño externalizado grave puede volver después como pasivo corporativo.', stats: ['barriles derramados', 'días de flujo sin control'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-opioides': {
    en: { chapter: 'Deaths · U.S.', titulo: 'The prescribed epidemic', did: 'For years, opioid risks were aggressively minimized in marketing and prescribing systems. The resulting crisis contributed to hundreds of thousands of deaths and enormous public-health costs.', simples: 'In the U.S., opioid medicines were sold for years while addiction risks were minimized. The crisis caused hundreds of thousands of deaths.', adv: 'The opioid crisis combined aggressive pharmaceutical marketing, prescribing incentives, information asymmetry and regulatory failure. Bankruptcy and asset protection exposed the gap between corporate liability and private wealth.', stats: ['deaths associated with the crisis', 'family owners imprisoned'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · EE. UU.', titulo: 'La epidemia recetada', did: 'Durante años, riesgos de opioides fueron minimizados agresivamente en marketing y sistemas de prescripción. La crisis resultante contribuyó a cientos de miles de muertes y enormes costos de salud pública.', simples: 'En EE. UU., medicamentos opioides se vendieron durante años mientras se minimizaban riesgos de adicción. La crisis causó cientos de miles de muertes.', adv: 'La crisis de opioides combinó marketing farmacéutico agresivo, incentivos de prescripción, asimetría de información y fallas regulatorias. Quiebra y protección patrimonial expusieron la brecha entre responsabilidad corporativa y riqueza privada.', stats: ['muertes asociadas a la crisis', 'miembros de la familia propietaria presos'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-piper': {
    en: { chapter: 'Deaths · United Kingdom', titulo: 'The most profitable platform', did: 'Piper Alpha burned in the North Sea in 1988 and killed 167 workers. The inquiry found failures in maintenance, permit-to-work systems and shift communication.', simples: 'In 1988, a fire destroyed Piper Alpha in the North Sea. 167 workers died.', adv: 'The Cullen Inquiry showed how maintenance organization, communication and pressure for continuity can turn technical risk into systemic risk, leading to major regulatory reform.', stats: ['deaths in 1988', 'operational continuity pressure'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · Reino Unido', titulo: 'La plataforma más rentable', did: 'Piper Alpha ardió en el Mar del Norte en 1988 y mató a 167 trabajadores. La investigación encontró fallas de mantenimiento, permisos de trabajo y comunicación entre turnos.', simples: 'En 1988, un incendio destruyó Piper Alpha en el Mar del Norte. Murieron 167 trabajadores.', adv: 'La investigación Cullen mostró cómo organización del mantenimiento, comunicación y presión por continuidad pueden convertir riesgo técnico en riesgo sistémico, llevando a importantes reformas regulatorias.', stats: ['muertos en 1988', 'presión por continuidad operativa'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-minamata': {
    en: { chapter: 'Deaths · Japan', titulo: '36 years of mercury', did: 'Industrial mercury pollution in Minamata contaminated fish and caused severe neurological illness over many years. Recognition and compensation took decades.', simples: 'A factory discharged mercury into Minamata Bay for many years. The poison contaminated fish and caused severe disease among residents.', adv: 'Minamata is a classic case of cumulative chemical externalization: methylmercury bioaccumulated through the food chain while causal recognition and compensation lagged far behind the damage.', stats: ['years of mercury discharge', 'official apology milestone'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · Japón', titulo: '36 años de mercurio', did: 'La contaminación industrial por mercurio en Minamata contaminó peces y causó graves enfermedades neurológicas durante muchos años. El reconocimiento y la reparación tardaron décadas.', simples: 'Una fábrica descargó mercurio en la bahía de Minamata durante muchos años. El veneno contaminó peces y causó enfermedades graves entre residentes.', adv: 'Minamata es un caso clásico de externalización química acumulativa: metilmercurio se bioacumuló en la cadena alimentaria mientras reconocimiento causal y compensación quedaron muy por detrás del daño.', stats: ['años de vertido de mercurio', 'hito de disculpa oficial'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-kader': {
    en: { chapter: 'Deaths · Thailand', titulo: 'The locked exits', did: 'The Kader toy-factory fire in Thailand killed 188 workers in 1993. The disaster exposed severe problems with construction, fire load and emergency exits in an export supply chain.', simples: 'In 1993, a fire at the Kader factory in Thailand killed 188 workers. The case exposed major safety and emergency-exit failures.', adv: 'Kader linked cost arbitrage and fragmented responsibility between global buyers and a local factory. Safety standards in export production can fall below those expected in buyer markets without enforceable rules.', stats: ['workers killed', 'exit doors'], dica: 'watch the highlighted cases and continue to compare places' },
    es: { chapter: 'Muertes · Tailandia', titulo: 'Las salidas cerradas', did: 'El incendio de la fábrica de juguetes Kader en Tailandia mató a 188 trabajadores en 1993. El desastre expuso graves problemas de construcción, carga inflamable y salidas de emergencia en una cadena exportadora.', simples: 'En 1993, un incendio en la fábrica Kader en Tailandia mató a 188 trabajadores. El caso mostró graves fallas de seguridad y salidas de emergencia.', adv: 'Kader conectó arbitraje de costos y responsabilidad fragmentada entre compradores globales y una fábrica local. Sin reglas exigibles, estándares de seguridad en producción exportadora pueden quedar por debajo de los esperados en mercados compradores.', stats: ['trabajadores muertos', 'puertas de salida'], dica: 'observa los casos destacados y continúa para comparar lugares' },
  },
  'm-fim': {
    en: { chapter: 'Deaths · Closing', titulo: 'The pattern', did: 'The cases differ, but a common pattern appears: firms can capture returns quickly while workers, communities and ecosystems absorb costs that emerge over years or decades.', simples: 'The cases are different, but they share something: corporate decisions and weak oversight can leave enormous costs for workers, families and cities.', adv: 'Across the cases, private appropriation of surplus is separated from the social distribution of risk. Regulation, unions, transparency and repair capacity determine how much mortality, illness and environmental damage remains externalized.', stats: ['returns now', 'weak accountability'], dica: 'finish to open the consequences module with all cases' },
    es: { chapter: 'Muertes · Cierre', titulo: 'El patrón', did: 'Los casos son distintos, pero aparece un patrón común: empresas pueden capturar retornos rápidamente mientras trabajadores, comunidades y ecosistemas absorben costos que aparecen durante años o décadas.', simples: 'Los casos son diferentes, pero comparten algo: decisiones empresariales y fiscalización débil pueden dejar costos enormes para trabajadores, familias y ciudades.', adv: 'En todos los casos, apropiación privada del excedente se separa de distribución social del riesgo. Regulación, sindicatos, transparencia y capacidad de reparación determinan cuánto de mortalidad, enfermedad y daño ambiental permanece externalizado.', stats: ['retornos ahora', 'responsabilización débil'], dica: 'termina para abrir el módulo de consecuencias con todos los casos' },
  },
  'geo-intro': {
    en: { chapter: 'Geography · Opening', titulo: 'The International Division of Labor in the 21st Century', did: 'Economic Geography explains why world space is unequal: Core countries concentrate financial command, patents and headquarters, while Periphery supplies raw materials, energy and cheap assembly.', simples: 'On the world map, each group of countries plays a different role: some sell technology and control banks, while others supply raw materials and cheap labor.', adv: 'International Division of Labor under informational-financialized capitalism: spatial hierarchy among command nodes (US-EU-Japan triad and Chinese pole), industrial semi-periphery and primary-export periphery.', stats: ['Core, Semiperiphery and Periphery', 'International Division of Labor'], dica: 'observe the direction of particles between South and North' },
    es: { chapter: 'Geografía · Apertura', titulo: 'La División Internacional del Trabajo en el siglo XXI', did: 'La Geografía Económica explica por qué el espacio mundial es desigual: los países del Centro concentran comando financiero, patentes e sedes, mientras la Periferia aporta materias primas, energía y ensamblaje barato.', simples: 'En el mapa mundial, cada grupo de países cumple un papel distinto: algunos venden tecnología y controlan bancos, mientras otros aportan materias primas y trabajo barato.', adv: 'División Internacional del Trabajo bajo el capitalismo informacional-financiarizado: jerarquía espacial entre nodos de comando (tríada EE. UU.-UE-Japón y polo chino), semiperiferia industrial y periferia primario-exportadora.', stats: ['Centro, Semiperiferia y Periferia', 'División Internacional del Trabajo'], dica: 'observa la dirección de las partículas entre Sur y Norte' },
  },
  'geo-fim': {
    en: { chapter: 'Geography · Closing', titulo: 'Territory as an unequal network', did: 'Closing the geographic reading: world territory functions as a hierarchical network where raw materials and cheap labor flow from the periphery while technological and financial command remains concentrated in the core.', simples: 'The map shows that countries are connected through trade networks, but gains from these exchanges remain concentrated in countries dominating technology and finance.', adv: 'Geoeconomic synthesis: global space combines fluidity for financial capital and productive selectivity, reproducing geographically uneven development between North and South.', stats: ['net direction of value transfer', 'Human Sciences · Economic Geography'], dica: 'try clicking the BR button to see regional division within Brazil' },
    es: { chapter: 'Geografía · Cierre', titulo: 'El territorio como red desigual', did: 'Cerrando la lectura geográfica: el territorio mundial funciona como una red jerárquica donde materias primas y trabajo barato fluyen de la periferia y el comando tecnológico y financiero permanece concentrado en el centro.', simples: 'El mapa muestra que los países están conectados por redes comerciales, pero las ganancias de estos intercambios siguen concentradas en los países que dominan tecnología y finanzas.', adv: 'Síntesis geoeconómica: el espacio global combina fluidez para el capital financiero y selectividad productiva, reproduciendo el desarrollo geográficamente desigual entre Norte y Sur.', stats: ['sentido neto de transferencia de valor', 'Ciencias Humanas · Geografía Económica'], dica: 'prueba hacer clic en el botón BR para ver la división regional dentro de Brasil' },
  },
  'hist-intro': {
    en: { chapter: 'History · Opening', titulo: 'Hegemonic cycles of the world-economy', did: 'The history of capitalism is a succession of powers leading trade, industry and currency: from the 19th-century British Empire to the post-1945 United States and today’s rivalry with China.', simples: 'Throughout history, different countries led the world economy: first the United Kingdom, then the United States, and today there is strong competition with China.', adv: 'Systemic cycles of accumulation: each hegemony articulates material expansion followed by financial expansion during maturity and geopolitical transition.', stats: ['Bretton Woods Agreement (dollar-gold)', 'current dollar share in reserves'], dica: 'follow the shift in the center of the world' },
    es: { chapter: 'Historia · Apertura', titulo: 'Ciclos hegemónicos de la economía-mundo', did: 'La historia del capitalismo es una sucesión de potencias que lideraron comercio, industria y moneda: del Imperio Británico en el siglo XIX a los Estados Unidos pos-1945 y la disputa actual con China.', simples: 'A lo largo de la historia, distintos países lideraron la economía mundial: primero el Reino Unido, luego Estados Unidos y hoy existe una fuerte disputa con China.', adv: 'Ciclos sistémicos de acumulación: cada hegemonía articula expansión material seguida de hipertrofia financiera en la madurez y transición geopolítica.', stats: ['Acuerdo de Bretton Woods (dólar-oro)', 'peso actual del dólar en reservas'], dica: 'sigue el cambio del centro del mundo' },
  },
  'hist-1971': {
    en: { chapter: 'History · 1971–1979', titulo: 'The 1971 Shock and the birth of the flexible dollar', did: 'In 1971, the United States ended the conversion of dollars into gold. The dollar continued to derive value from political, military power and oil trade, opening an era of deregulated finance and global debt.', simples: 'In 1971, the dollar stopped being exchanged for gold. Even so, it continued being the main currency in oil trade and foreign reserves.', adv: 'Nixon Shock (1971) and Volcker Shock (1979): rupture of the Bretton Woods dollar-gold standard and transition to the flexible dollar anchored in Treasuries, petrodollars and free capital mobility.', stats: ['end of dollar-gold convertibility', 'annual interest on US debt today'], dica: 'click the yellow line to see the role of US Treasury bonds' },
    es: { chapter: 'Historia · 1971–1979', titulo: 'El Shock de 1971 y el nacimiento del dólar flexible', did: 'En 1971, Estados Unidos puso fin a la conversión del dólar en oro. El dólar pasó a valer por poder político, militar y comercio de petróleo, abriendo la era de finanzas desreguladas y deuda global.', simples: 'En 1971, el dólar dejó de canjearse por oro. Aun así, continuó siendo la principal moneda en el comercio de petróleo y reservas.', adv: 'Shock de Nixon (1971) y Shock de Volcker (1979): ruptura del patrón dólar-oro de Bretton Woods y transición al patrón dólar flexible anclado en Treasuries, petrodólares y libre movilidad de capitales.', stats: ['fin de convertibilidad dólar-oro', 'intereses anuales de la deuda de EE. UU. hoy'], dica: 'haz clic en la línea amarilla para ver el papel de los bonos del Tesoro de EE. UU.' },
  },
  'hist-fim': {
    en: { chapter: 'History · Closing', titulo: 'Hegemonic transition in the 21st century', did: 'Looking across the century, the rules of the world economy change after major crises and wars. Today, Asian rise and non-dollar settlements open a new historic transition.', simples: 'History shows economic leadership changes over time. Today, new blocs like BRICS+ try to build alternatives to exclusive dollar dominance.', adv: 'Historical-structural balance: from Pax Britannica to the crisis of neoliberal globalization, contemporary hegemonic transition opposes financialized dollar rentierism to Sino-Asian industrial-state capacity.', stats: ['BRICS+ share in purchasing power parity', 'complete timeline in Module 03'], dica: 'finish to open the war module and explore the timeline from 1914 to 2026' },
    es: { chapter: 'Historia · Cierre', titulo: 'Transición hegemónica en el siglo XXI', did: 'Mirando el siglo entero, las reglas de la economía mundial cambian tras grandes crisis y guerras. Hoy, el ascenso asiático y acuerdos fuera del dólar abren una nueva transición histórica.', simples: 'La historia muestra que el liderazgo económico cambia con el tiempo. Hoy, nuevos bloques como BRICS+ intentan crear alternativas al dominio exclusivo del dólar.', adv: 'Balance histórico-estructural: de la Pax Britannica a la crisis de la globalización neoliberal, la transición hegemónica contemporánea opone el rentismo financiero dolarizado a la capacidad industrial-estatal sinoasiática.', stats: ['peso de BRICS+ en paridad de compra', 'línea de tiempo completa en el Módulo 03'], dica: 'termina para abrir el módulo de guerra y explorar la línea de tiempo de 1914 a 2026' },
  },
  'eco-intro': {
    en: { chapter: 'Political Economy · Opening', titulo: 'Four lenses for the same anatomy', did: 'Four lenses explain this map: Marx shows how labor generates profit; Kalecki explains how spending sustains sales; MMT reveals sovereign money power; and TMD shows how the South transfers wealth to the North.', simples: 'This tour brings together four economic ideas to show how work creates wealth, how government uses currency and why some countries accumulate more than others.', adv: 'Analytical integration of 4 pillars: law of value and organic composition (Marx), effective demand (Kalecki), monetary hierarchy and sovereignty (MMT), and super-exploitation with value transfer (TMD).', stats: ['Marxian decomposition of value', 'Marx · Kalecki · MMT · TMD'], dica: 'activate Advanced level at the top of the card to read complete macroeconomic identities' },
    es: { chapter: 'Economía Política · Apertura', titulo: 'Cuatro lentes para la misma anatomía', did: 'Cuatro lentes explican este mapa: Marx muestra cómo el trabajo genera ganancia; Kalecki explica cómo el gasto sostiene ventas; MMT revela el poder de emitir moneda; y TMD muestra cómo el Sur transfiere riqueza al Norte.', simples: 'Este tour une cuatro ideas económicas para mostrar cómo el trabajo crea riqueza, cómo el gobierno usa la moneda y por qué algunos países acumulan más que otros.', adv: 'Integración analítica de los 4 pilares: ley del valor y composición orgánica (Marx), demanda efectiva (Kalecki), jerarquía y soberanía monetaria (MMT) y superexplotación con transferencia de valor (TMD).', stats: ['descomposición marxista del valor', 'Marx · Kalecki · MMT · TMD'], dica: 'activa el nivel Avanzado arriba en la tarjeta para leer identidades macroeconómicas completas' },
  },
  'eco-fim': {
    en: { chapter: 'Political Economy · Closing', titulo: 'The critical macroeconomic synthesis', did: 'Uniting all four schools, production, currency, public budgets and international trade form a single system. Changing outcomes requires acting on property, labor and sovereignty.', simples: 'Putting all parts together, production, wages, taxes and world trade are connected and depend on political and economic choices.', adv: 'Political economy synthesis: expanded reproduction globally articulates surplus-value extraction (Pillar 1), Kaleckian realization (Pillar 2), state/fictitious money (Pillar 3) and core-periphery drain (Pillar 4).', stats: ['profit rate on advanced capital', 'sectoral balances identity'], dica: 'finish to open the debt module with Kalecki simulator and MMT balances' },
    es: { chapter: 'Economía Política · Cierre', titulo: 'La síntesis macroeconómica crítica', did: 'Uniendo las cuatro escuelas, producción, moneda, presupuesto público y comercio internacional forman un único engranaje. Cambiar el resultado exige actuar sobre propiedad, trabajo y soberanía.', simples: 'Juntando todas las partes, vemos que producción, salarios, impuestos y comercio mundial están conectados y dependen de decisiones políticas y económicas.', adv: 'Síntesis de economía política: la reproducción ampliada a escala mundial articula extracción de plusvalía (Pilar 1), realización kaleckiana (Pilar 2), moneda estatal/ficticia (Pilar 3) y drenaje centro-periferia (Pilar 4).', stats: ['tasa de ganancia sobre capital adelantado', 'identidad de balances sectoriales'], dica: 'termina para abrir el módulo de deuda con el simulador de Kalecki y balances MMT' },
  },
}

function customStopForLang(stop: TourStop, lang: Exclude<TourLang, 'pt'>): TourStop {
  const shared = tourStopForLang(stop, lang)
  if (shared !== stop) return shared
  const locale = CUSTOM_STOP_I18N[stop.id]?.[lang]
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

export function toursForLang(lang: TourLang): TourDef[] {
  if (lang === 'pt') return TOURES
  return TOURES.map((tour) => {
    const meta = TOUR_META_I18N[tour.id]?.[lang] ?? { titulo: tour.titulo, descricao: tour.descricao }
    const finalLabel = tour.finalTab === 'war'
      ? (lang === 'en' ? `go to ${modTitle('war', lang)} →` : `ir a ${modTitle('war', lang)} →`)
      : tour.finalTab === 'alternatives'
        ? (lang === 'en' ? `go to ${modTitle('alternatives', lang)} →` : `ir a ${modTitle('alternatives', lang)} →`)
        : tour.finalTab === 'home'
          ? (lang === 'en' ? `explore ${modTitle('home', lang)} →` : `explorar ${modTitle('home', lang)} →`)
          : tour.finalTab === 'debt'
            ? (lang === 'en' ? `go to ${modTitle('debt', lang)} →` : `ir a ${modTitle('debt', lang)} →`)
            : (lang === 'en' ? `go to ${modTitle('consequences', lang)} →` : `ir a ${modTitle('consequences', lang)} →`)
    return {
      ...tour,
      ...meta,
      finalLabel,
      stops: tour.stops.map((stop) => customStopForLang(stop, lang)),
    }
  })
}

export const getTourForLang = (id: string, lang: TourLang): TourDef => {
  const tours = toursForLang(lang)
  return tours.find((tour) => tour.id === id) ?? tours[0]
}
