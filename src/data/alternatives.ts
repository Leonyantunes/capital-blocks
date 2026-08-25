/**
 * MÓDULO 09 — E PARA ONDE PODEMOS IR?
 * Sistemas que já funcionam: cooperativas, commons, autogestão,
 * planejamento democrático e Garantia de Emprego (MMT).
 * Fontes: ICA/World Cooperative Monitor 2025 · Mondragon Corp · ILO (2018,
 * cuidado) · Ostrom (2009) · Tcherneva/Wray (JG) · UN-Habitat (POA).
 */

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

/** Garantia de Emprego — parâmetros BR (estimativas didáticas). */
export const JG = {
  pibBrTri: 11.7, // PIB nominal BR 2024, R$ tri (IBGE)
  jurosAnoBi: 900, // serviço de juros ≈ R$ 900 bi (Tesouro, 2024, est.)
  salarioMinAno: 18216, // R$ 1.518 × 13,3
  reservaMilhoes: 30, // desempregados + subempregados (est. ampla)
}
