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
        didStats: [
          { v: 'US$ 1,5 tri', k: 'gasto militar da OTAN/ano' },
          { v: '55%', k: 'do gasto militar mundial' },
        ],
        adv: 'Guerra como reordenador de fluxos: sanções, chokepoints e orçamentos militares realocam excedente entre blocos — o complexo militar-industrial como fração lucrativa permanente.',
      },
      byId('chip'),
      byId('energia'),
      {
        id: 'w-suez', chapter: 'Guerra · Gargalos', titulo: 'O canal na mira',
        lng: 32, lat: 28, k: 2.4, flowId: 'det-egy-eu',
        did: 'Doze por cento do comércio do mundo passa por um canal no Egito — e guerras na região viram esse pedágio em arma. Com os ataques no Mar Vermelho, navios deram a volta na África e o Egito perdeu 60% da receita. Um tiro num estreito ecoa no preço de tudo.',
        didStats: [
          { v: '12%', k: 'do comércio passa em Suez' },
          { v: '-60%', k: 'de receita do Egito' },
        ],
        adv: 'Suez/Bab el-Mandeb como chokepoint: conflito regional → rerouting pelo Cabo → frete e seguros disparam; renda de passagem como refém geopolítico.',
      },
      {
        id: 'w-dolar', chapter: 'Guerra · Armas', titulo: 'O dólar como arma',
        lng: -40, lat: 32, k: 2.2, flowId: 'fin-usa-eu',
        did: 'Existe uma arma que não explode: o dólar. Sanções congelam reservas, expulsam bancos do sistema e afundam moedas — e a Europa, que guarda US$ 1,6 trilhão em títulos americanos, sente junto. Na guerra financeira, até aliado paga a conta.',
        didStats: [
          { v: 'US$ 1,6 tri', k: 'europeus em títulos dos EUA' },
          { v: 'congeladas', k: 'as reservas dos sancionados' },
        ],
        adv: 'Dólar-arma: extraterritorialidade do clearing + congelamento de reservas; aliados arcam com o custo (energia cara, desindustrialização) — hierarquia monetária como teatro de guerra.',
      },
      byId('saida'),
      {
        id: 'w-fim', chapter: 'Guerra · Fechamento', titulo: 'Quem enriqueceu?',
        lng: 30, lat: 35, k: 1.8, isos: ['840', '643'],
        did: 'Faça as contas do tour: fabricantes de chips e armas, petroleiras com desconto, traders de rotas novas. E do outro lado: salários corroídos, energia cara, países inteiros pagando pedágio. Guerra move fronteiras no mapa — e dinheiro no bolso de poucos.',
        didStats: [
          { v: 'armas + energia', k: 'quem fatura' },
          { v: 'salários', k: 'quem paga' },
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
        didStats: [
          { v: '~90%', k: 'da lógica de ponta: TSMC' },
          { v: 'bloqueio', k: 'a arma americana' },
        ],
        adv: 'Contenção tecnológica como disputa pela composição orgânica futura do rival: export controls + CHIPS Act vs. autossuficiência chinesa (Mate 60, SMIC 7nm).',
      },
      byId('chip'),
      byId('fabrica-muda'),
      {
        id: 'ws-fim', chapter: 'Semicondutores', titulo: 'E o Brasil nisso?',
        lng: -53, lat: -10, k: 2.4, isos: ['076'],
        did: 'O Brasil assiste de fora: importa os chips prontos dentro de celulares e máquinas, sem fabricar nenhum. Na guerra do século, quem não produz tecnologia assiste ao jogo — e paga ingresso caro em cada aparelho.',
        didStats: [
          { v: 'zero', k: 'fábricas de chips avançados' },
          { v: 'tudo', k: 'importado dentro de aparelhos' },
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
        didStats: [
          { v: 'leste', k: 'o novo rumo do gás russo' },
          { v: '2 anos', k: 'para redesenhar o mapa' },
        ],
        adv: 'Desacoplamento energético forçado: Power of Siberia + LNG global vs. desindustrialização europeia parcial — energia como alavanca e como custo.',
      },
      byId('energia'),
      byId('saida'),
      byId('canal'),
      {
        id: 'we-fim', chapter: 'Energia', titulo: 'Quem ficou com a conta?',
        lng: 10, lat: 48, k: 2.2, isos: ['643', '276'],
        did: 'A Rússia vende com desconto, a China e a Índia compram barato, as petroleiras ocidentais lucram com preço alto — e a indústria europeia paga a conta em energia cara. Sanção também é transferência de renda: a pergunta é sempre de quem para quem.',
        didStats: [
          { v: 'desconto', k: 'para quem compra da Rússia' },
          { v: 'conta cheia', k: 'para a indústria europeia' },
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
        didStats: [
          { v: '27% → 11%', k: 'indústria no PIB desde 1985' },
          { v: '92 mi', k: 'fora ou na borda do emprego' },
        ],
        adv: 'Especialização regressiva + exército de reserva de 92,1 mi: a reprimarização como derrota histórica — TMD com desindustrialização precoce.',
      },
      byId('origem'),
      byId('vaza'),
      byId('remessas'),
      {
        id: 'wr-fim', chapter: 'Reprimarização', titulo: 'Dá para reverter?',
        lng: -53, lat: -10, k: 2.8, isos: ['076'],
        did: `Reverter exige o que foi desmontado: indústria, tecnologia, emprego formal — e segurar aqui parte do excedente que hoje viaja para fora. O ${modRef('war')} mostra as frentes; o ${modRef('alternatives')}, os caminhos.`,
        didStats: [
          { v: 'indústria', k: 'o que foi desmontado' },
          { v: 'reter', k: 'o excedente que viaja' },
        ],
        adv: 'Reversão = política industrial + controle de capitais + reforma tributária progressiva — disputa pelo excedente contra as frações agro-financeiras.',
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
        didStats: [
          { v: '10', k: 'casos documentados' },
          { v: '2,9 mi', k: 'mortes do trabalho/ano' },
        ],
        adv: 'Violência corporativa como externalização estrutural e lenta (Nixon): impunidade + acordos irrisórios barateiam sistematicamente a vida periférica.',
      },
      {
        id: 'm-bhopal', chapter: 'Mortes · Índia', titulo: 'Bhopal: a noite do gás',
        lng: 77.4, lat: 23.2, k: 3.0, layer: 'deaths', isos: ['356'],
        did: 'Em 1984, gás venenoso vazou sobre uma cidade dormindo na Índia — porque a matriz tinha cortado custos de segurança. Mais de meio milhão de intoxicados. O acordo pagou cerca de US$ 500 por vítima, e a contaminação atravessa gerações. A mensagem para investidores foi clara: vida indiana sai barato.',
        didStats: [
          { v: '570 mil', k: 'intoxicados' },
          { v: 'US$ 470 mi', k: 'o acordo com a Union Carbide' },
        ],
        adv: 'Union Carbide/Dow: duplo padrão de segurança + acordo de US$465 mi + slow violence do MIC no solo e na água — impunidade como subsídio à acumulação.',
      },
      {
        id: 'm-vilasoco', chapter: 'Mortes · Brasil', titulo: 'Cubatão: a vila que explodiu',
        lng: -46.4, lat: -23.9, k: 3.2, layer: 'deaths', isos: ['076'],
        did: 'No mesmo mês de Bhopal, uma favela inteira explodiu no Brasil sobre um vazamento de gasolina — em plena ditadura. O número oficial fala em 508 mortos; moradores falam em mais de 700. Território pobre virou zona de sacrifício do polo industrial.',
        didStats: [
          { v: '508 (700+)', k: 'mortos em 1984' },
          { v: 'ditadura', k: 'sem direito a reclamar' },
        ],
        adv: 'Vila Socó (1984): dutos sobre favela + subnotificação oficial (CPT: 700+) — racismo ambiental e repressão como condição da industrialização autoritária.',
      },
      {
        id: 'm-vale', chapter: 'Mortes · Brasil', titulo: 'A Vale e os dois rios de lama',
        lng: -43.8, lat: -20.15, k: 3.0, layer: 'deaths', isos: ['076'],
        did: 'Mariana em 2015, Brumadinho em 2019: duas barragens da mesma Vale, 289 mortos, um rio de 600 km destruído. Laudos dizem que a empresa sabia do risco. O minério que enriquece acionistas no mundo todo deixou lama e luto em Minas — e um acordo bilionário que ainda não recuperou o rio.',
        didStats: [
          { v: '19 + 270', k: 'mortos nas duas barragens' },
          { v: '600 km', k: 'de lama no rio Doce' },
        ],
        adv: 'Fundão/B1: barragens a montante sabidamente frágeis + acordo de R$170 bi em execução — privatização do lucro mineral, socialização do desastre (Vale/BHP).',
      },
      {
        id: 'm-rana', chapter: 'Mortes · Bangladesh', titulo: 'As costureiras do desabamento',
        lng: 90.3, lat: 23.7, k: 3.0, layer: 'deaths', flowId: 'det-bgd-eu', isos: ['050'],
        did: 'Em 2013, o Rana Plaza desabou com 4 mil costureiras dentro — as marcas sabiam das rachaduras desde o dia anterior. Morreram 1.134 mulheres que costuravam por US$ 113 ao mês. Bangladesh ficou preso ao papel de chão de fábrica barato do mundo.',
        didStats: [
          { v: '1.134', k: 'costureiras mortas' },
          { v: 'US$ 113', k: 'o salário mensal' },
        ],
        adv: 'Rana Plaza: compressão salarial como "vantagem comparativa" institucionalizada; Accord pós-desastre arrancado sob pressão — o país retido na base da cadeia têxtil.',
      },
      {
        id: 'm-deepwater', chapter: 'Mortes · EUA', titulo: 'O mar que pegou fogo',
        lng: -88.4, lat: 28.7, k: 2.6, layer: 'deaths', isos: ['840'],
        did: 'Até no centro a conta chega: a plataforma da BP explodiu e vazou quase 5 milhões de barris por 87 dias no Golfo do México — com cortes de custo documentados antes. Pescadores do Golfo perderam o mar por anos. Multa bilionária paga, ninguém preso.',
        didStats: [
          { v: '4,9 mi', k: 'barris vazados' },
          { v: '87 dias', k: 'vazando sem parar' },
        ],
        adv: 'Macondo: decisões de custo documentadas (CSB) + acordo de US$20,8 bi — no centro, a externalização vira multa administrável; na periferia, nem isso.',
      },
      {
        id: 'm-opioides', chapter: 'Mortes · EUA', titulo: 'A epidemia receitada',
        lng: -73.5, lat: 41, k: 2.8, layer: 'deaths', isos: ['840'],
        did: 'Uma empresa mentiu por décadas dizendo que seu remédio "quase não viciava" — e vendeu uma epidemia: 500 mil mortos. A família dona embolsou bilhões e blindou a fortuna na falência. A dor de um país desindustrializado virou mercado.',
        didStats: [
          { v: '500 mil', k: 'mortos' },
          { v: '0', k: 'presos da família dona' },
        ],
        adv: 'Purdue/Sacklers: marketing médico + captura regulatória + falência estratégica (US$6 bi blindados) — violência corporativa legalizada sobre a classe trabalhadora americana.',
      },
      {
        id: 'm-piper', chapter: 'Mortes · Reino Unido', titulo: 'A plataforma mais lucrativa',
        lng: -1.4, lat: 58.1, k: 2.6, layer: 'deaths', isos: ['826'],
        did: 'No Mar do Norte, 167 homens morreram na Piper Alpha — a plataforma mais lucrativa da região. Uma válvula liberada sem conferência, com a bomba ligada: produzir sem parar valia mais que conferir. O petróleo britânico tem essas vidas no preço.',
        didStats: [
          { v: '167', k: 'mortos em 1988' },
          { v: 'uptime', k: 'valia mais que a checagem' },
        ],
        adv: 'Cullen Inquiry: permit-to-work sacrificado pelo uptime — o petróleo do Mar do Norte financiando o thatcherismo com disciplina de plataforma.',
      },
      {
        id: 'm-minamata', chapter: 'Mortes · Japão', titulo: '36 anos de mercúrio',
        lng: 130.6, lat: 32.2, k: 2.8, layer: 'deaths', isos: ['392'],
        did: 'Uma empresa despejou mercúrio na baía por 36 anos sabendo do envenenamento: bebês nasceram com malformações, pescadores perderam tudo — e a empresa ainda agrediu manifestantes. O Japão só pediu desculpas oficiais em 2020. Crescer primeiro, reconhecer depois.',
        didStats: [
          { v: '36 anos', k: 'despejando veneno' },
          { v: '2020', k: 'o pedido oficial de desculpas' },
        ],
        adv: 'Minamata/Chisso: metilmercúrio + 64 anos até compensação integral — o caso fundador da slow violence e da luta por reconhecimento (luta de Michiko Ishimure).',
      },
      {
        id: 'm-kader', chapter: 'Mortes · Tailândia', titulo: 'As portas trancadas',
        lng: 100.5, lat: 14, k: 3.0, layer: 'deaths', isos: ['764'],
        did: 'A fábrica que fazia os brinquedos do Natal americano pegou fogo sem saídas de emergência — com as portas trancadas. Morreram 188 jovens migrantes. A Tailândia entrou na cadeia global como chão de fábrica descartável: barato, rápido e sem direitos.',
        didStats: [
          { v: '188', k: 'trabalhadoras mortas' },
          { v: 'trancadas', k: 'as portas de saída' },
        ],
        adv: 'Kader (1993): maior incêndio industrial da história; cadeia de brinquedos ocidental com segurança inexistente — análogo a Triangle Shirtwaist (1911), um século depois.',
      },
      {
        id: 'm-fim', chapter: 'Mortes · Fechamento', titulo: 'O padrão',
        lng: 20, lat: 10, k: 1.6,
        did: `Repare o padrão em todos os casos: o lucro foi privatizado na hora, a conta chegou depois — em vidas, rios e baías — e quase ninguém foi preso. Países que aceitam esse preço ficam presos nele: mão de obra barata e natureza barata para sempre. O ${modRef('consequences')} conta cada caso até o fim.`,
        didStats: [
          { v: 'lucro agora', k: 'conta em vidas depois' },
          { v: 'impunidade', k: 'o subsídio invisível' },
        ],
        adv: 'Padrão estrutural: privatização do excedente + socialização do desastre + blindagem jurídica — a periferia retida como zona de sacrifício permanente do sistema.',
        dica: `finalize para abrir o ${modRef('consequences')} com todos os casos`,
      },
    ],
  },
]

export const getTour = (id: string): TourDef =>
  TOURES.find((t) => t.id === id) ?? TOURES[0]
