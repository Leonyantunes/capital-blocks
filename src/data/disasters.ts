/** MARCADORES DE MORTES CORPORATIVAS — desastres industriais e violência
 *  corporativa documentados, com custo humano. Coordenadas reais. */

import { modRef } from './modules'

export interface Disaster {
  id: string
  local: string
  lngLat: [number, number]
  ano: string
  empresa: string
  mortos: string
  mortosNum: number // para ordenação/escala
  did: string
  adv: string
}

export const DISASTERS: Disaster[] = [
  { id: 'bhopal', local: 'Bhopal, Índia', lngLat: [77.4, 23.2], ano: '1984', empresa: 'Union Carbide → Dow Chemical', mortos: '3.800 imediatos · 570 mil intoxicados', mortosNum: 570000,
    did: `A maior catástrofe industrial da história: gás venenoso sobre uma cidade dormindo porque a matriz cortou custos de segurança. Ver EP06 do ${modRef('consequences')}.`,
    adv: 'Duplo padrão de segurança + acordo de US$465 mi (≈US$500/vítima) + violência lenta (Nixon): resíduos de MIC contaminam gerações.' },
  { id: 'vila-soco', local: 'Vila Socó, Cubatão (Brasil)', lngLat: [-46.4, -23.9], ano: '1984', empresa: 'Petrobras', mortos: '508 mortos (est. oficial; moradores falam em 700+)', mortosNum: 508,
    did: 'A "Vila do Gás": uma favela inteira explodiu sobre um vazamento de gasolina em plena ditadura. O Brasil se lembrava de Bhopal no mesmo mês — e esqueceu a sua.',
    adv: 'Vila Socó (24/25 nov 1984): vazamento de gasolina em favela sobre dutos; número oficial subestimado (CPT fala em 700+); símbolo da negligência com territórios pobres.' },
  { id: 'mariana', local: 'Mariana, MG (Brasil)', lngLat: [-43.1, -20.2], ano: '2015', empresa: 'Samarco (Vale + BHP)', mortos: '19 mortos · rio Doce inteiro destruído · 600 km de lama', mortosNum: 19,
    did: 'A barragem de rejeitos da Samarco rompeu e enterrou o distrito de Bento Rodrigues. O rio Doce — 600 km de lama tóxica até o mar. O maior desastre ambiental do Brasil.',
    adv: 'Fundão (2015): 50 mi m³ de rejeitos; dano intergeracional no rio Doce; acordo de R$170 bi (2024) ainda em execução — externalização clássica de custo (Vale/BHP).' },
  { id: 'brumadinho', local: 'Brumadinho, MG (Brasil)', lngLat: [-44.2, -20.1], ano: '2019', empresa: 'Vale', mortos: '270 mortos', mortosNum: 270,
    did: 'Quatro anos depois de Mariana, OUTRA barragem da Vale rompeu — desta vez sobre a própria sede administrativa, com funcionários almoçando. Laudos apontaram que a Vale sabia da instabilidade.',
    adv: 'Barragem B1 (2019): 270 mortos; auditorias internas alertavam (apostila "barragem à montante" sabidamente frágil) — crime ambiental com autoria corporativa documentada.' },
  { id: 'rana-plaza', local: 'Savar, Bangladesh', lngLat: [90.3, 23.7], ano: '2013', empresa: 'Marcas de fast fashion (H&M, Zara, Primark…)', mortos: '1.134 costureiras mortas', mortosNum: 1134,
    did: 'O prédio Rana Plaza desabou com 4 mil costureiras dentro — as marcas ocidentais sabiam das rachaduras no dia anterior. Roupa barata tem endereço.',
    adv: `Rana Plaza (2013): 1.134 mortos, 2.500+ feridos; Accord de segurança pós-desastre assinado sob pressão — compressão salarial global com endereço (ver ${modRef('wealth')}/fluxo BGD→UE).` },
  { id: 'deepwater', local: 'Golfo do México (Deepwater Horizon)', lngLat: [-88.4, 28.7], ano: '2010', empresa: 'BP · Transocean · Halliburton', mortos: '11 mortos · maior desastre marinho da história (4,9 mi barris)', mortosNum: 11,
    did: 'A plataforma da BP explodiu e vazou 4,9 milhões de barris de petróleo no Golfo do México por 87 dias seguidos. Decisões de corte de custo foram documentadas antes da explosão.',
    adv: 'Macondo (2010): 4,9 mi barris; decisões de custo documentadas (CSB); acordo de US$20,8 bi (2015) — externalização marinha em escala de ecossistema.' },
  { id: 'opioides', local: 'Stamford, EUA (Purdue Pharma)', lngLat: [-73.5, 41.05], ano: '1996 – hoje', empresa: 'Purdue Pharma (família Sackler)', mortos: '~500 mil mortos pela crise dos opioides nos EUA', mortosNum: 500000,
    did: 'A Purdue mentiu sobre o vício do OxyContin por décadas ("menos de 1% vicia" — falso), enquanto a família Sacklers embolsava bilhões. Mais de 500 mil americanos morreram. A multa foi paga — ninguém foi preso.',
    adv: 'Crise dos opioides: ~500 mil mortos (CDC 1999–2020); Purdue declarou falência para blindar os Sacklers (US$6 bi) — marketing médico + captura regulatória como modelo de violência corporativa legalizada.' },
  { id: 'piper-alpha', local: 'Mar do Norte (Piper Alpha)', lngLat: [-1.4, 58.1], ano: '1988', empresa: 'Occidental Petroleum', mortos: '167 mortos', mortosNum: 167,
    did: 'A plataforma Piper Alpha explodiu no Mar do Norte matando 167 homens — a manutenção de uma válvula de segurança tinha sido liberada SEM conferência, com a bomba ligada.',
    adv: 'Piper Alpha (1988): 167 mortos; Cullen Inquiry documentou falha de permit-to-work — protocolos de segurança sacrificados por uptime na plataforma mais lucrativa do Mar do Norte.' },
  { id: 'minamata', local: 'Baía de Minamata, Japão', lngLat: [130.6, 32.2], ano: '1956 – hoje', empresa: 'Chisso Corporation', mortos: '~2.000+ reconhecidos · dezenas de milhares intoxicados', mortosNum: 2000,
    did: 'A Chisso despejou mercúrio na baía por 36 anos sabendo do envenenamento. Bebês nasceram com malformações (doença de Minamata). A empresa jogou golpes nos manifestantes. O Japão só se desculpou oficialmente em... 2020.',
    adv: 'Doença de Minamata (1956–): metilmercúrio da Chisso; 64 anos até compensação integral (2020) — o caso fundador da violência corporativa lenta e da luta por reconhecimento (Yūjō Michiko).' },
  { id: 'kader', local: 'Kader, Tailândia', lngLat: [100.5, 14.0], ano: '1993', empresa: 'Kader Industrial (brinquedos p/ Ocidente)', mortos: '188 trabalhadoras mortas', mortosNum: 188,
    did: 'A fábrica de brinquedos que abastecia o Natal americano pegou fogo sem saídas de emergência e portas TRANCADAS. 188 trabalhadoras morreram — a maioria mulheres jovens migrantes.',
    adv: 'Kader (1993): 188 mortas, portas trancadas; maior incêndio industrial da história — cadeia de brinquedos do Ocidente com segurança inexistente (análogo a Triangle Shirtwaist 1911).' },
]
