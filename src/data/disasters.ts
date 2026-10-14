/** MARCADORES DE MORTES CORPORATIVAS — desastres industriais e violência
 *  corporativa documentados, com custo humano. Coordenadas reais. */

import { modRef } from './modules'
import { pick, type Lang } from '../i18n'
import { useApp } from '../store/useApp'

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

const BASE_DISASTERS: Disaster[] = [
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

type BiText = readonly [en: string, es: string]
type DisasterTr = { local: BiText; ano: BiText; empresa: BiText; mortos: BiText; did: BiText; adv: BiText }

const DISASTER_TR: Record<string, DisasterTr> = {
  bhopal: {
    local: ['Bhopal, India', 'Bhopal, India'], ano: ['1984', '1984'],
    empresa: ['Union Carbide → Dow Chemical', 'Union Carbide → Dow Chemical'],
    mortos: ['3,800 immediate deaths · 570,000 poisoned', '3.800 muertes inmediatas · 570 mil intoxicados'],
    did: [`The largest industrial disaster in history: poisonous gas over a sleeping city after headquarters cut safety costs. See EP06 in ${modRef('consequences')}.`, `La mayor catástrofe industrial de la historia: gas venenoso sobre una ciudad dormida después de que la matriz recortara costos de seguridad. Ver EP06 en ${modRef('consequences')}.`],
    adv: ['Double safety standard + US$465m settlement (≈US$500/victim) + slow violence (Nixon): MIC residues contaminate generations.', 'Doble estándar de seguridad + acuerdo de US$465 M (≈US$500/víctima) + violencia lenta (Nixon): residuos de MIC contaminan generaciones.'],
  },
  'vila-soco': {
    local: ['Vila Socó, Cubatão (Brazil)', 'Vila Socó, Cubatão (Brasil)'], ano: ['1984', '1984'], empresa: ['Petrobras', 'Petrobras'],
    mortos: ['508 deaths (official est.; residents report 700+)', '508 muertos (est. oficial; vecinos hablan de 700+)'],
    did: ['The “Gas Village”: an entire favela exploded over a gasoline leak during the dictatorship. Brazil remembered Bhopal that same month — and forgot its own disaster.', 'La “Villa del Gas”: una favela entera explotó sobre una fuga de gasolina en plena dictadura. Brasil recordaba Bhopal ese mismo mes — y olvidó su propia tragedia.'],
    adv: ['Vila Socó (24/25 Nov 1984): gasoline leak in a favela built over pipelines; official death toll underestimated (CPT cites 700+); emblem of neglect in poor territories.', 'Vila Socó (24/25 nov 1984): fuga de gasolina en una favela sobre ductos; cifra oficial subestimada (CPT habla de 700+); símbolo de la negligencia con territorios pobres.'],
  },
  mariana: {
    local: ['Mariana, MG (Brazil)', 'Mariana, MG (Brasil)'], ano: ['2015', '2015'], empresa: ['Samarco (Vale + BHP)', 'Samarco (Vale + BHP)'],
    mortos: ['19 deaths · entire Doce River devastated · 600 km of mud', '19 muertos · río Doce entero devastado · 600 km de lodo'],
    did: ['Samarco’s tailings dam burst and buried the district of Bento Rodrigues. The Doce River carried toxic mud for 600 km to the sea. Brazil’s largest environmental disaster.', 'La represa de relaves de Samarco colapsó y sepultó el distrito de Bento Rodrigues. El río Doce llevó lodo tóxico durante 600 km hasta el mar. El mayor desastre ambiental de Brasil.'],
    adv: ['Fundão (2015): 50m m³ of tailings; intergenerational damage to the Doce River; R$170bn settlement (2024) still being implemented — classic cost externalization (Vale/BHP).', 'Fundão (2015): 50 millones de m³ de relaves; daño intergeneracional en el río Doce; acuerdo de R$170 mil M (2024) aún en ejecución — externalización clásica de costos (Vale/BHP).'],
  },
  brumadinho: {
    local: ['Brumadinho, MG (Brazil)', 'Brumadinho, MG (Brasil)'], ano: ['2019', '2019'], empresa: ['Vale', 'Vale'], mortos: ['270 deaths', '270 muertos'],
    did: ['Four years after Mariana, ANOTHER Vale dam burst — this time over its own administrative complex, while employees were having lunch. Reports indicated Vale knew about the instability.', 'Cuatro años después de Mariana, OTRA represa de Vale colapsó — esta vez sobre su propio complejo administrativo, mientras los empleados almorzaban. Informes indicaron que Vale conocía la inestabilidad.'],
    adv: ['B1 dam (2019): 270 deaths; internal audits had warned about instability (upstream dams were known to be fragile) — environmental crime with documented corporate responsibility.', 'Represa B1 (2019): 270 muertos; auditorías internas habían advertido sobre la inestabilidad (las represas aguas arriba eran conocidas como frágiles) — crimen ambiental con responsabilidad corporativa documentada.'],
  },
  'rana-plaza': {
    local: ['Savar, Bangladesh', 'Savar, Bangladesh'], ano: ['2013', '2013'],
    empresa: ['Fast-fashion brands (H&M, Zara, Primark…)', 'Marcas de fast fashion (H&M, Zara, Primark…)'], mortos: ['1,134 garment workers killed', '1.134 trabajadoras textiles muertas'],
    did: ['The Rana Plaza building collapsed with 4,000 garment workers inside — Western brands knew about the cracks the day before. Cheap clothing has an address.', 'El edificio Rana Plaza colapsó con 4.000 trabajadoras textiles dentro — las marcas occidentales conocían las grietas desde el día anterior. La ropa barata tiene dirección.'],
    adv: [`Rana Plaza (2013): 1,134 dead, 2,500+ injured; post-disaster safety Accord signed under pressure — global wage compression with an address (see ${modRef('wealth')}/flow BGD→EU).`, `Rana Plaza (2013): 1.134 muertos, 2.500+ heridos; Acuerdo de seguridad posterior al desastre firmado bajo presión — compresión salarial global con dirección (ver ${modRef('wealth')}/flujo BGD→UE).`],
  },
  deepwater: {
    local: ['Gulf of Mexico (Deepwater Horizon)', 'Golfo de México (Deepwater Horizon)'], ano: ['2010', '2010'], empresa: ['BP · Transocean · Halliburton', 'BP · Transocean · Halliburton'],
    mortos: ['11 deaths · largest marine oil disaster in history (4.9m barrels)', '11 muertos · mayor desastre petrolero marino de la historia (4,9 millones de barriles)'],
    did: ['BP’s platform exploded and leaked 4.9 million barrels of oil into the Gulf of Mexico for 87 straight days. Cost-cutting decisions were documented before the explosion.', 'La plataforma de BP explotó y derramó 4,9 millones de barriles de petróleo en el Golfo de México durante 87 días seguidos. Las decisiones de recorte de costos estaban documentadas antes de la explosión.'],
    adv: ['Macondo (2010): 4.9m barrels; documented cost decisions (CSB); US$20.8bn settlement (2015) — marine externalization at ecosystem scale.', 'Macondo (2010): 4,9 millones de barriles; decisiones de costos documentadas (CSB); acuerdo de US$20,8 mil M (2015) — externalización marina a escala de ecosistema.'],
  },
  opioides: {
    local: ['Stamford, US (Purdue Pharma)', 'Stamford, EE. UU. (Purdue Pharma)'], ano: ['1996 – today', '1996 – hoy'],
    empresa: ['Purdue Pharma (Sackler family)', 'Purdue Pharma (familia Sackler)'], mortos: ['~500,000 deaths in the US opioid crisis', '~500 mil muertos por la crisis de opioides en EE. UU.'],
    did: ['Purdue lied for decades about OxyContin addiction (“less than 1% become addicted” — false), while the Sackler family took in billions. More than 500,000 Americans died. The fine was paid — nobody went to prison.', 'Purdue mintió durante décadas sobre la adicción al OxyContin (“menos del 1% se vuelve adicto” — falso), mientras la familia Sackler embolsaba miles de millones. Más de 500 mil estadounidenses murieron. La multa se pagó — nadie fue a prisión.'],
    adv: ['Opioid crisis: ~500,000 deaths (CDC 1999–2020); Purdue filed for bankruptcy to shield the Sacklers (US$6bn) — medical marketing + regulatory capture as a model of legalized corporate violence.', 'Crisis de opioides: ~500 mil muertos (CDC 1999–2020); Purdue se declaró en quiebra para blindar a los Sackler (US$6 mil M) — marketing médico + captura regulatoria como modelo de violencia corporativa legalizada.'],
  },
  'piper-alpha': {
    local: ['North Sea (Piper Alpha)', 'Mar del Norte (Piper Alpha)'], ano: ['1988', '1988'], empresa: ['Occidental Petroleum', 'Occidental Petroleum'], mortos: ['167 deaths', '167 muertos'],
    did: ['The Piper Alpha platform exploded in the North Sea, killing 167 men — maintenance on a safety valve had been cleared WITHOUT verification while the pump was running.', 'La plataforma Piper Alpha explotó en el Mar del Norte y mató a 167 hombres — el mantenimiento de una válvula de seguridad había sido autorizado SIN verificación, con la bomba en marcha.'],
    adv: ['Piper Alpha (1988): 167 deaths; Cullen Inquiry documented permit-to-work failure — safety protocols sacrificed for uptime on the most profitable platform in the North Sea.', 'Piper Alpha (1988): 167 muertos; la Cullen Inquiry documentó una falla del sistema permit-to-work — protocolos de seguridad sacrificados por uptime en la plataforma más rentable del Mar del Norte.'],
  },
  minamata: {
    local: ['Minamata Bay, Japan', 'Bahía de Minamata, Japón'], ano: ['1956 – today', '1956 – hoy'], empresa: ['Chisso Corporation', 'Chisso Corporation'],
    mortos: ['~2,000+ recognized deaths · tens of thousands poisoned', '~2.000+ muertos reconocidos · decenas de miles intoxicados'],
    did: ['Chisso dumped mercury into the bay for 36 years while knowing about the poisoning. Babies were born with malformations (Minamata disease). The company assaulted protesters. Japan only issued an official apology in... 2020.', 'Chisso vertió mercurio en la bahía durante 36 años sabiendo del envenenamiento. Bebés nacieron con malformaciones (enfermedad de Minamata). La empresa agredió a manifestantes. Japón solo se disculpó oficialmente en... 2020.'],
    adv: ['Minamata disease (1956–): methylmercury from Chisso; 64 years to comprehensive compensation (2020) — foundational case of slow corporate violence and the struggle for recognition (Yūjō Michiko).', 'Enfermedad de Minamata (1956–): metilmercurio de Chisso; 64 años hasta una compensación integral (2020) — caso fundacional de violencia corporativa lenta y lucha por reconocimiento (Yūjō Michiko).'],
  },
  kader: {
    local: ['Kader, Thailand', 'Kader, Tailandia'], ano: ['1993', '1993'],
    empresa: ['Kader Industrial (toys for Western markets)', 'Kader Industrial (juguetes para Occidente)'], mortos: ['188 women workers killed', '188 trabajadoras muertas'],
    did: ['The toy factory supplying the American Christmas market caught fire with no emergency exits and LOCKED doors. 188 workers died — most of them young migrant women.', 'La fábrica de juguetes que abastecía la Navidad estadounidense se incendió sin salidas de emergencia y con puertas CERRADAS. Murieron 188 trabajadoras — la mayoría mujeres jóvenes migrantes.'],
    adv: ['Kader (1993): 188 dead, locked doors; the deadliest industrial fire in history — Western toy supply chain with nonexistent safety (analogous to Triangle Shirtwaist 1911).', 'Kader (1993): 188 muertas, puertas cerradas; el incendio industrial más mortal de la historia — cadena occidental de juguetes con seguridad inexistente (análogo a Triangle Shirtwaist 1911).'],
  },
}

const dtx = (lang: Lang, pt: string, tr: BiText) => pick(lang, pt, tr[0], tr[1])

export function disastersForLang(lang: Lang): Disaster[] {
  return BASE_DISASTERS.map((d) => {
    const tr = DISASTER_TR[d.id]
    return {
      ...d,
      local: dtx(lang, d.local, tr.local),
      ano: dtx(lang, d.ano, tr.ano),
      empresa: dtx(lang, d.empresa, tr.empresa),
      mortos: dtx(lang, d.mortos, tr.mortos),
      did: dtx(lang, d.did, tr.did),
      adv: dtx(lang, d.adv, tr.adv),
    }
  })
}

/**
 * Consumidores legados leem DISASTERS diretamente. Getters mantêm a API e
 * resolvem o idioma atual sem exigir alterações em MapWorld/Globe3DCanvas.
 */
export const DISASTERS: Disaster[] = BASE_DISASTERS.map((d) => {
  const tr = DISASTER_TR[d.id]
  const current = () => useApp.getState().lang
  return {
    id: d.id,
    lngLat: d.lngLat,
    mortosNum: d.mortosNum,
    get local() { return dtx(current(), d.local, tr.local) },
    get ano() { return dtx(current(), d.ano, tr.ano) },
    get empresa() { return dtx(current(), d.empresa, tr.empresa) },
    get mortos() { return dtx(current(), d.mortos, tr.mortos) },
    get did() { return dtx(current(), d.did, tr.did) },
    get adv() { return dtx(current(), d.adv, tr.adv) },
  }
})
