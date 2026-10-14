/**
 * MÓDULO 09 — E PARA ONDE PODEMOS IR?
 * Sistemas que já funcionam: cooperativas, commons, autogestão,
 * planejamento democrático e Garantia de Emprego (MMT).
 * Fontes: ICA/World Cooperative Monitor 2025 · Mondragon Corp · ILO (2018,
 * cuidado) · Ostrom (2009) · Tcherneva/Wray (JG) · UN-Habitat (POA).
 */

import { pick, type Lang } from '../i18n'

export interface AltStat {
  value: string
  label: string
  sub?: string
}

export const COOP_STATS: AltStat[] = [
  { value: '3 milhões', label: 'cooperativas no planeta', sub: 'setor mais antigo e difundido de empresa alternativa' },
  { value: '12%', label: 'da humanidade é cooperada', sub: '≈ 1 bilhão de pessoas associadas (ICA)' },
  { value: '280 milhões', label: 'postos de trabalho', sub: '10% da população ocupada mundial' },
  { value: 'US$ 2,79 tri', label: 'faturamento das 300 maiores', sub: 'superaria o PIB do Reino Unido (WCM 2025)' },
]

export interface AltCase {
  id: string
  titulo: string
  local: string
  color: string
  dado: string
  did: string
  adv: string
  pilares: string
}

export const ALT_CASES: AltCase[] = [
  {
    id: 'mondragon', titulo: 'Mondragon: a corporação sem patrões', local: 'País Basco, Espanha · desde 1956', color: '#4caf50',
    dado: '81 cooperativas · ~70.500 trabalhadores · € 11 bi/ano · teto salarial ~6–9:1',
    did: 'Uma corporação de 70 mil pessoas SEM patrão: os trabalhadores são os donos, elegem a direção em assembleia (1 pessoa = 1 voto) e o salário mais alto não passa de ~6 a 9 vezes o menor. Existe desde 1956 e fatura € 11 bilhões por ano — sobrevivendo a todas as crises que quebraram concorrentes "normais".',
    adv: 'Autogestão em escala corporativa: propriedade do trabalho (worker-owned), democracia de um-membro-um-voto, teto de dispersão salarial e fundos sociais coletivos — refutação empírica da tese de que eficiência exige hierarquia capitalista (Olin Wright, "enigmas reais de uma ilha utópica").',
    pilares: 'Pilar 1 · Pilar 2',
  },
  {
    id: 'emilia', titulo: 'Emilia-Romagna: a região das cooperativas', local: 'Itália · séc. XIX – hoje', color: '#42a5f5',
    dado: '~30% do PIB regional em cooperativas · região entre as mais ricas da Itália',
    did: 'Na região mais próspera da Itália, cerca de 1/3 da economia funciona em cooperativas — indústria, agricultura, construção, consumo. Autogestão não é vila alternativa: é a base de uma economia regional inteira que compete (e vence) no mercado europeu.',
    adv: 'O "modelo Emilia": densidade cooperativa associada a maior PIB per capita e menor desigualdade intra-regional (Becchetti/Zamagni) — rede de cooperativas de produção, crédito e consumo com encadeamento mútuo (mutualismo sistêmico).',
    pilares: 'Pilar 2 · Pilar 1',
  },
  {
    id: 'credito', titulo: 'O banco dos membros (não dos acionistas)', local: 'Mundo · Canadá, França, Brasil', color: '#ffc107',
    dado: 'Cooperativas de crédito servem ~1 bilhão de pessoas · Sicredi (BR): 8+ mi de cooperados',
    did: 'Crédit Agricole (França), Desjardins (Canadá), Sicredi (Brasil): bancos pertencentes aos próprios clientes, que decidem em assembleia para onde vai o crédito. Sem acionista exigindo lucro máximo, o juro é ferramenta — não armadilha.',
    adv: 'Banca cooperativa como prova de viabilidade do crédito endógeno sem rentismo: excedente redistribuído aos membros ou reinvestido regionalmente — antítese operacional do capital portador de juros (Pilar 3 aplicado).',
    pilares: 'Pilar 3 · Pilar 2',
  },
  {
    id: 'ostrom', titulo: 'Ostrom e os commons: a "tragédia" que não existia', local: 'Mundo · Nobel de Economia 2009', color: '#ba68c8',
    dado: 'Nobel 2009: comunidades gerem florestas, pesca e irrigação há séculos — sem Estado nem mercado',
    did: 'Por décadas repetiram que "recursos comuns acabam destruídos por todos" (a tragédia dos comuns). Elinor Ostrom estudou dezenas de casos reais — pesca, floresta, irrigação — e provou o contrário: comunidades organizam regras próprias e sustentam os recursos por séculos. Ganhou o NOBEL por isso.',
    adv: 'Ostrom (Governing the Commons, 1990): princípios de design institucional (limites claros, monitoramento par, sanções graduais) que refutam a tragédia dos comuns de Hardin — governança policêntrica como terceira via além Estado/mercado (fundamento teórico dos commons digitais e da economia solidária).',
    pilares: 'Pilar 2 · Pilar 1',
  },
  {
    id: 'wikipedia', titulo: 'A Wikipédia: o maior produto da história, sem lucro', local: 'Digital · 2001 – hoje', color: '#ce93d8',
    dado: '60+ milhões de artigos · ~300 línguas · orçamento ≈ US$ 180 mi/ano (doações)',
    did: 'O maior acervo de conhecimento já criado pela humanidade foi construído SEM patrão, SEM anúncio e SEM pagamento por peça — por voluntários, com doações. Se a Wikipédia fosse uma empresa, valeria bilhões. Ela não é: é de todos. E funciona.',
    adv: 'Produção entre pares baseada em commons (Benkler, "riqueza de rede"): prova de escala da colaboração não-mercantil — o maior projeto editorial da história opera fora das relações de propriedade e salário (digital commons como modo de produção emergente).',
    pilares: 'Pilar 2 · Pilar 1',
  },
  {
    id: 'poa', titulo: 'Orçamento participativo: o povo divide o bolo', local: 'Porto Alegre · 1989 – 2004', color: '#4dd0e1',
    dado: 'Modelo exportado para 1.500+ cidades do mundo (UN-Habitat)',
    did: 'Em Porto Alegre, os MORADORES decidiram em assembleias como gastar parte do orçamento da cidade. Resultado: água encanada e escolas foram para onde o povo priorizou — e o modelo virou referência mundial, adotado por 1.500+ cidades. Democracia não é só votar a cada 4 anos: é decidir o dinheiro.',
    adv: 'OP de Porto Alegre (1989–2004): redistribuição infraestrutural mensurável (acesso à água/esgoto elevou significativamente nos bairros pobres — Santos, 1998; UN-Habitat) — democracia fiscal direta como instituição compressora de desigualdade (Pilar 2 + Pilar 3).',
    pilares: 'Pilar 3 · Pilar 2',
  },
  {
    id: 'cybersyn', titulo: 'CyberSyn: a internet socialista de 1971', local: 'Chile · Allende', color: '#ef5350',
    dado: 'Rede de telex em tempo real conectando fábricas ao governo — destruída no golpe de 1973',
    did: 'Em 1971, o ciberneticista Stafford Beer criou para o Chile de Allende um sistema que conectava as fábricas ao governo por telex, em tempo real, para planejar a economia com dados do povo trabalhador. Em 1973, o golpe destruiu tudo. A ideia de planejamento democrático com tecnologia era possível — 50 anos antes dos smartphones.',
    adv: 'Project Cybersyn (Stafford Beer, VSM): protótipo de planejamento econômico cibernético com feedback em tempo real — antecedente direto do debate contemporâneo sobre planejamento democrático computacional (Cockshott/Cottrell; Morozov, "O novo silêncio de Mao").',
    pilares: 'Pilar 2 · Pilar 1',
  },
  {
    id: 'cuidado', titulo: 'A economia do cuidado: o trabalho que sustenta tudo (e não é pago)', local: 'Mundo', color: '#f87171',
    dado: '16,4 bilhões de horas/dia · ≈ 9% do PIB mundial (US$ 11 tri) · ~80% feito por mulheres (ILO)',
    did: 'Cuidar de crianças, idosos, doentes e da casa é trabalho que sustenta TODA a economia — e não aparece no PIB nem no salário de ninguém. A OIT calculou: são 16,4 bilhões de horas POR DIA, o equivalente a 9% da riqueza mundial, e 80% feito por mulheres de graça.',
    adv: 'Trabalho de cuidado não remunerado (ILO, 2018): 16,4 bi de horas/dia ≈ 9% do PIB global (US$ 11 tri PPP) — a base não-mercantil da reprodução da força de trabalho (Federici: "Calibã e a Bruxa") — sem ela, c e v não se realizam (Pilar 1 + feminismo socialista).',
    pilares: 'Pilar 1 · Pilar 2',
  },
]

/** Simulador da pirâmide salarial: cooperativa × corporações. */
export const PAY_RATIOS = [
  { id: 'mondragon', label: 'Mondragon (cooperativa)', ratio: 9, color: '#4caf50', nota: 'teto aprovado em assembleia' },
  { id: 'sp500', label: 'Média das S&P 500', ratio: 272, color: '#ffc107', nota: 'AFL-CIO 2023' },
  { id: 'apple', label: 'Apple', ratio: 600, color: '#f472b6', nota: 'CEO/trabalhador mediano (est.)' },
  { id: 'extremo', label: 'Extremo da S&P 500', ratio: 1400, color: '#f44336', nota: 'maior razão reportada (est.)' },
]

/** Salário mínimo BR anual — ÚNICA fonte (EscalaCompare.tsx consome aqui).
 *  R$ 1.518 × 13,3 (12 meses + 13º + 1/3 de férias). */
export const SM_BR_ANO = 20189

/** Garantia de Emprego — parâmetros BR (estimativas didáticas). */
export const JG = {
  pibBrTri: 11.7, // PIB nominal BR 2024, R$ tri (IBGE)
  jurosAnoBi: 900, // serviço de juros ≈ R$ 900 bi (Tesouro, 2024, est.)
  salarioMinAno: SM_BR_ANO,
  reservaMilhoes: 30, // desempregados + subempregados (est. ampla)
}

type BiText = readonly [en: string, es: string]
const tx = (lang: Lang, pt: string, [en, es]: BiText) => pick(lang, pt, en, es)

const COOP_STATS_TR: { value: BiText; label: BiText; sub: BiText }[] = [
  { value: ['3 million', '3 millones'], label: ['cooperatives worldwide', 'cooperativas en el planeta'], sub: ['the oldest and most widespread alternative enterprise sector', 'el sector de empresa alternativa más antiguo y extendido'] },
  { value: ['12%', '12%'], label: ['of humanity belongs to a cooperative', 'de la humanidad forma parte de una cooperativa'], sub: ['≈ 1 billion members (ICA)', '≈ 1.000 millones de personas asociadas (ICA)'] },
  { value: ['280 million', '280 millones'], label: ['jobs', 'puestos de trabajo'], sub: ['10% of the world employed population', '10% de la población ocupada mundial'] },
  { value: ['US$ 2.79 tn', 'US$ 2,79 bill.'], label: ['revenue of the 300 largest', 'facturación de las 300 mayores'], sub: ['would exceed the UK GDP (WCM 2025)', 'superaría el PIB del Reino Unido (WCM 2025)'] },
]

type AltCaseTr = {
  titulo: BiText
  local: BiText
  dado: BiText
  did: BiText
  adv: BiText
  pilares: BiText
}

const ALT_CASES_TR: Record<string, AltCaseTr> = {
  mondragon: {
    titulo: ['Mondragon: the corporation without bosses', 'Mondragon: la corporación sin patrones'],
    local: ['Basque Country, Spain · since 1956', 'País Vasco, España · desde 1956'],
    dado: ['81 cooperatives · ~70,500 workers · €11 bn/year · pay cap ~6–9:1', '81 cooperativas · ~70.500 trabajadores · €11 mil M/año · techo salarial ~6–9:1'],
    did: ['A corporation of 70,000 people with NO boss: workers are the owners, elect management in an assembly (1 person = 1 vote), and the highest pay is no more than ~6 to 9 times the lowest. It has existed since 1956 and bills €11 billion a year — surviving every crisis that broke “normal” competitors.', 'Una corporación de 70 mil personas SIN patrón: los trabajadores son los dueños, eligen la dirección en asamblea (1 persona = 1 voto) y el salario más alto no supera ~6 a 9 veces el menor. Existe desde 1956 y factura €11 mil millones al año — sobreviviendo a todas las crisis que quebraron competidores “normales”.'],
    adv: ['Self-management at corporate scale: worker ownership, one-member-one-vote democracy, a cap on pay dispersion and collective social funds — empirical refutation of the claim that efficiency requires capitalist hierarchy (Olin Wright, “real utopias on an island”).', 'Autogestión a escala corporativa: propiedad de los trabajadores, democracia de un miembro-un voto, techo a la dispersión salarial y fondos sociales colectivos — refutación empírica de la tesis de que la eficiencia exige jerarquía capitalista (Olin Wright, “enigmas reales de una isla utópica”).'],
    pilares: ['Pillar 1 · Pillar 2', 'Pilar 1 · Pilar 2'],
  },
  emilia: {
    titulo: ['Emilia-Romagna: the cooperative region', 'Emilia-Romaña: la región de las cooperativas'],
    local: ['Italy · 19th century – today', 'Italia · s. XIX – hoy'],
    dado: ['~30% of regional GDP in cooperatives · among Italy’s wealthiest regions', '~30% del PIB regional en cooperativas · entre las regiones más ricas de Italia'],
    did: ['In one of Italy’s most prosperous regions, about one third of the economy operates through cooperatives — industry, agriculture, construction and retail. Self-management is not an alternative village: it is the foundation of an entire regional economy that competes (and wins) in the European market.', 'En una de las regiones más prósperas de Italia, cerca de un tercio de la economía funciona mediante cooperativas — industria, agricultura, construcción y consumo. La autogestión no es una aldea alternativa: es la base de toda una economía regional que compite (y gana) en el mercado europeo.'],
    adv: ['The “Emilia model”: cooperative density associated with higher GDP per capita and lower intra-regional inequality (Becchetti/Zamagni) — a network of production, credit and consumer cooperatives with mutual linkages (systemic mutualism).', 'El “modelo Emilia”: densidad cooperativa asociada a mayor PIB per cápita y menor desigualdad intrarregional (Becchetti/Zamagni) — red de cooperativas de producción, crédito y consumo con encadenamiento mutuo (mutualismo sistémico).'],
    pilares: ['Pillar 2 · Pillar 1', 'Pilar 2 · Pilar 1'],
  },
  credito: {
    titulo: ['The members’ bank (not the shareholders’)', 'El banco de los socios (no de los accionistas)'],
    local: ['World · Canada, France, Brazil', 'Mundo · Canadá, Francia, Brasil'],
    dado: ['Credit cooperatives serve ~1 billion people · Sicredi (BR): 8+ million members', 'Las cooperativas de crédito atienden a ~1.000 millones de personas · Sicredi (BR): 8+ millones de socios'],
    did: ['Crédit Agricole (France), Desjardins (Canada), Sicredi (Brazil): banks owned by their own customers, who decide in assemblies where credit goes. Without shareholders demanding maximum profit, interest is a tool — not a trap.', 'Crédit Agricole (Francia), Desjardins (Canadá), Sicredi (Brasil): bancos pertenecientes a sus propios clientes, que deciden en asamblea adónde va el crédito. Sin accionistas exigiendo beneficio máximo, el interés es una herramienta — no una trampa.'],
    adv: ['Cooperative banking as evidence that endogenous credit is viable without rentier extraction: surplus is redistributed to members or reinvested regionally — an operational antithesis to interest-bearing capital (Pillar 3 applied).', 'La banca cooperativa como prueba de viabilidad del crédito endógeno sin rentismo: el excedente se redistribuye a los socios o se reinvierte regionalmente — antítesis operativa del capital portador de interés (Pilar 3 aplicado).'],
    pilares: ['Pillar 3 · Pillar 2', 'Pilar 3 · Pilar 2'],
  },
  ostrom: {
    titulo: ['Ostrom and the commons: the “tragedy” that was not inevitable', 'Ostrom y los comunes: la “tragedia” que no era inevitable'],
    local: ['World · 2009 Nobel Prize in Economics', 'Mundo · Nobel de Economía 2009'],
    dado: ['2009 Nobel: communities have managed forests, fisheries and irrigation for centuries — without either state or market control', 'Nobel 2009: comunidades gestionan bosques, pesca y riego desde hace siglos — sin control estatal ni de mercado'],
    did: ['For decades people repeated that “common resources are destroyed by everyone” (the tragedy of the commons). Elinor Ostrom studied dozens of real cases — fisheries, forests, irrigation — and showed the opposite: communities create their own rules and sustain resources for centuries. She won the NOBEL for it.', 'Durante décadas se repitió que “los recursos comunes terminan destruidos por todos” (la tragedia de los comunes). Elinor Ostrom estudió decenas de casos reales — pesca, bosques, riego — y mostró lo contrario: las comunidades organizan sus propias reglas y sostienen los recursos durante siglos. Ganó el NOBEL por ello.'],
    adv: ['Ostrom (Governing the Commons, 1990): institutional design principles (clear boundaries, peer monitoring, graduated sanctions) that refute Hardin’s tragedy as a universal rule — polycentric governance as a third route beyond state/market (theoretical basis for digital commons and solidarity economy).', 'Ostrom (Governing the Commons, 1990): principios de diseño institucional (límites claros, monitoreo entre pares, sanciones graduales) que refutan la tragedia de Hardin como regla universal — gobernanza policéntrica como tercera vía más allá de Estado/mercado (base teórica de los comunes digitales y la economía solidaria).'],
    pilares: ['Pillar 2 · Pillar 1', 'Pilar 2 · Pilar 1'],
  },
  wikipedia: {
    titulo: ['Wikipedia: the largest knowledge project in history, without profit', 'Wikipedia: el mayor proyecto de conocimiento de la historia, sin lucro'],
    local: ['Digital · 2001 – today', 'Digital · 2001 – hoy'],
    dado: ['60+ million articles · ~300 languages · budget ≈ US$180m/year (donations)', '60+ millones de artículos · ~300 idiomas · presupuesto ≈ US$180 M/año (donaciones)'],
    did: ['The largest body of knowledge ever created by humanity was built WITHOUT a boss, WITHOUT ads and WITHOUT piece-rate pay — by volunteers, funded by donations. If Wikipedia were a company, it would be worth billions. It is not: it belongs to everyone. And it works.', 'El mayor acervo de conocimiento creado por la humanidad fue construido SIN patrón, SIN anuncios y SIN pago por pieza — por voluntarios, con donaciones. Si Wikipedia fuera una empresa, valdría miles de millones. No lo es: es de todos. Y funciona.'],
    adv: ['Commons-based peer production (Benkler, “network wealth”): proof of non-market collaboration at scale — the largest editorial project in history operates outside property and wage relations (digital commons as an emerging mode of production).', 'Producción entre pares basada en comunes (Benkler, “riqueza de red”): prueba a escala de la colaboración no mercantil — el mayor proyecto editorial de la historia opera fuera de las relaciones de propiedad y salario (comunes digitales como modo de producción emergente).'],
    pilares: ['Pillar 2 · Pillar 1', 'Pilar 2 · Pilar 1'],
  },
  poa: {
    titulo: ['Participatory budgeting: people divide the pie', 'Presupuesto participativo: la gente reparte el pastel'],
    local: ['Porto Alegre · 1989 – 2004', 'Porto Alegre · 1989 – 2004'],
    dado: ['Model exported to 1,500+ cities worldwide (UN-Habitat)', 'Modelo exportado a 1.500+ ciudades del mundo (UN-Habitat)'],
    did: ['In Porto Alegre, RESIDENTS decided in assemblies how to spend part of the city budget. The result: piped water and schools went where people prioritized them — and the model became a global reference, adopted by 1,500+ cities. Democracy is not only voting every four years: it is deciding how money is spent.', 'En Porto Alegre, los HABITANTES decidieron en asambleas cómo gastar parte del presupuesto municipal. Resultado: el agua corriente y las escuelas fueron adonde la población las priorizó — y el modelo se volvió referencia mundial, adoptado por 1.500+ ciudades. La democracia no es solo votar cada 4 años: es decidir el dinero.'],
    adv: ['Porto Alegre participatory budgeting (1989–2004): measurable infrastructure redistribution (water/sewer access rose significantly in poorer neighborhoods — Santos, 1998; UN-Habitat) — direct fiscal democracy as an inequality-compressing institution (Pillar 2 + Pillar 3).', 'Presupuesto participativo de Porto Alegre (1989–2004): redistribución infraestructural medible (el acceso a agua/saneamiento aumentó significativamente en barrios pobres — Santos, 1998; UN-Habitat) — democracia fiscal directa como institución reductora de desigualdad (Pilar 2 + Pilar 3).'],
    pilares: ['Pillar 3 · Pillar 2', 'Pilar 3 · Pilar 2'],
  },
  cybersyn: {
    titulo: ['Cybersyn: the socialist internet of 1971', 'Cybersyn: la internet socialista de 1971'],
    local: ['Chile · Allende', 'Chile · Allende'],
    dado: ['Real-time telex network linking factories to government — destroyed in the 1973 coup', 'Red de télex en tiempo real conectando fábricas con el gobierno — destruida en el golpe de 1973'],
    did: ['In 1971, cybernetician Stafford Beer created a system for Allende’s Chile that linked factories to the government by telex in real time, to plan the economy with data from working people. In 1973, the coup destroyed it all. Democratic planning with technology was possible — 50 years before smartphones.', 'En 1971, el cibernético Stafford Beer creó para el Chile de Allende un sistema que conectaba las fábricas con el gobierno por télex, en tiempo real, para planificar la economía con datos de la población trabajadora. En 1973, el golpe destruyó todo. La idea de planificación democrática con tecnología era posible — 50 años antes de los smartphones.'],
    adv: ['Project Cybersyn (Stafford Beer, VSM): prototype of cybernetic economic planning with real-time feedback — direct antecedent of today’s debate on computational democratic planning (Cockshott/Cottrell; Morozov, “Mao’s new silence”).', 'Proyecto Cybersyn (Stafford Beer, VSM): prototipo de planificación económica cibernética con retroalimentación en tiempo real — antecedente directo del debate contemporáneo sobre planificación democrática computacional (Cockshott/Cottrell; Morozov, “El nuevo silencio de Mao”).'],
    pilares: ['Pillar 2 · Pillar 1', 'Pilar 2 · Pilar 1'],
  },
  cuidado: {
    titulo: ['The care economy: the work that sustains everything (and goes unpaid)', 'La economía del cuidado: el trabajo que sostiene todo (y no se paga)'],
    local: ['World', 'Mundo'],
    dado: ['16.4 billion hours/day · ≈ 9% of world GDP (US$11 tn) · ~80% done by women (ILO)', '16,4 mil millones de horas/día · ≈ 9% del PIB mundial (US$11 bill.) · ~80% realizado por mujeres (OIT)'],
    did: ['Caring for children, older people, sick people and the home is work that sustains the ENTIRE economy — and it appears neither in GDP nor in anyone’s wage. The ILO calculated 16.4 billion hours PER DAY, equivalent to 9% of world wealth, with 80% done by women for free.', 'Cuidar a niños, mayores, enfermos y del hogar es trabajo que sostiene TODA la economía — y no aparece ni en el PIB ni en el salario de nadie. La OIT calculó 16,4 mil millones de horas POR DÍA, equivalentes al 9% de la riqueza mundial, y 80% realizado gratis por mujeres.'],
    adv: ['Unpaid care work (ILO, 2018): 16.4 bn hours/day ≈ 9% of global GDP (US$11 tn PPP) — the non-market basis for reproducing labor power (Federici: “Caliban and the Witch”) — without it, c and v cannot be realized (Pillar 1 + socialist feminism).', 'Trabajo de cuidado no remunerado (OIT, 2018): 16,4 mil M de horas/día ≈ 9% del PIB global (US$11 bill. PPA) — base no mercantil de la reproducción de la fuerza de trabajo (Federici: “Calibán y la bruja”) — sin ella, c y v no se realizan (Pilar 1 + feminismo socialista).'],
    pilares: ['Pillar 1 · Pillar 2', 'Pilar 1 · Pilar 2'],
  },
}

const PAY_RATIOS_TR: Record<string, { label: BiText; nota: BiText }> = {
  mondragon: { label: ['Mondragon (cooperative)', 'Mondragon (cooperativa)'], nota: ['cap approved by the assembly', 'techo aprobado en asamblea'] },
  sp500: { label: ['S&P 500 average', 'Promedio del S&P 500'], nota: ['AFL-CIO 2023', 'AFL-CIO 2023'] },
  apple: { label: ['Apple', 'Apple'], nota: ['CEO/median worker (est.)', 'CEO/trabajador mediano (est.)'] },
  extremo: { label: ['S&P 500 extreme', 'Extremo del S&P 500'], nota: ['highest reported ratio (est.)', 'mayor razón reportada (est.)'] },
}

export function coopStatsForLang(lang: Lang): AltStat[] {
  return COOP_STATS.map((s, i) => ({
    value: tx(lang, s.value, COOP_STATS_TR[i].value),
    label: tx(lang, s.label, COOP_STATS_TR[i].label),
    sub: s.sub ? tx(lang, s.sub, COOP_STATS_TR[i].sub) : undefined,
  }))
}

export function altCasesForLang(lang: Lang): AltCase[] {
  return ALT_CASES.map((c) => {
    const tr = ALT_CASES_TR[c.id]
    return {
      ...c,
      titulo: tx(lang, c.titulo, tr.titulo),
      local: tx(lang, c.local, tr.local),
      dado: tx(lang, c.dado, tr.dado),
      did: tx(lang, c.did, tr.did),
      adv: tx(lang, c.adv, tr.adv),
      pilares: tx(lang, c.pilares, tr.pilares),
    }
  })
}

export function payRatiosForLang(lang: Lang) {
  return PAY_RATIOS.map((p) => ({
    ...p,
    label: tx(lang, p.label, PAY_RATIOS_TR[p.id].label),
    nota: tx(lang, p.nota, PAY_RATIOS_TR[p.id].nota),
  }))
}
