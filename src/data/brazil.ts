/**
 * ATUALIZAÇÃO BRASIL — estados exportadores + fluxo financeiro interno.
 * Fontes: Comex Stat/MDIC (jan–jul 2025, valores US$) · BCB · estudos de
 * transferência inter-regional (IBPT/Instituto Millenium, estimativas).
 */

import type { FlowDef } from './flows'

/** centro/zoom do modo Brasil */
export const BRAZIL_VIEW = { lng: -53, lat: -10.5, k: 3.2 }

export type StateCat = 'minerio' | 'petroleo' | 'agro' | 'industria' | 'diversos'

export const STATE_CAT_META: Record<StateCat, { color: string; label: string }> = {
  minerio: { color: '#42a5f5', label: 'Mineração' },
  petroleo: { color: '#ffc107', label: 'Petróleo & gás' },
  agro: { color: '#4caf50', label: 'Agronegócio' },
  industria: { color: '#f472b6', label: 'Indústria' },
  diversos: { color: '#8b949e', label: 'Diversos' },
}

export interface BrState {
  code: string
  nome: string
  lng: number
  lat: number
  /** exportações jan–jul 2025, US$ bi (Comex Stat) */
  expBi: number
  cat: StateCat
  produtos: string
  /** destino principal */
  dest: 'CHN' | 'EUA' | 'UE' | 'mundo'
  empresa?: string
  did: string
  adv: string
}

export const BR_STATES: BrState[] = [
  { code: 'SP', nome: 'São Paulo', lng: -48.6, lat: -22.2, expBi: 40.1, cat: 'industria', produtos: 'Açúcar, etanol, suco de laranja, celulose, manufaturados', dest: 'CHN', empresa: 'Cosan · Copersucar · Embraer', did: 'Líder absoluto: 1 em cada 5 dólares exportados sai daqui — do açúcar de Ribeirão ao avião da Embraer. Mas SP também IMPORTA o que as fábricas do interior produzem.', adv: '20,25% das exportações; 61% dos bens de capital do país — o estado que mais retém valor agregado e o maior contribuinte líquido do pacto federativo.' },
  { code: 'MG', nome: 'Minas Gerais', lng: -44.5, lat: -18.5, expBi: 25.4, cat: 'minerio', produtos: 'Minério de ferro, café, ouro, ferro-ligas', dest: 'CHN', empresa: 'Vale', did: 'O minério de ferro das montanhas de MG atravessa o oceano para virar aço chinês. O mesmo estado do ouro colonial exportando pedra — 300 anos depois.', adv: '12,85% das exportações: minério (Vale) domina; a economia mineira reprimarizou de manufatura para extrativa na década 2010-20.' },
  { code: 'RJ', nome: 'Rio de Janeiro', lng: -42.7, lat: -22.3, expBi: 25.2, cat: 'petroleo', produtos: 'Petróleo do pré-sal, ferro e aço semiacabados', dest: 'CHN', empresa: 'Petrobras · CSN', did: 'O pré-sal transformou o RJ no 3º maior exportador do país: um em cada 8 dólares brasileiros vem do óleo que sobe da Bacia de Santos.', adv: '12,75%: petróleo (Bacia de Santos) + semiacabados (CSN/Tubarão) — rentismo extrativo com dividendos distribuídos nacionalmente.' },
  { code: 'MT', nome: 'Mato Grosso', lng: -55.9, lat: -12.6, expBi: 17.6, cat: 'agro', produtos: 'Carne, soja, milho', dest: 'CHN', empresa: 'Amaggi · Bom Futuro', did: 'O campeão do agronegócio: soja e boi plantados no antigo cerrado, escoados por ferrovias e rodovias até o Pacífico e o Atlântico. A fronteira agrícola que andou 2.000 km para oeste.', adv: '8,86%: o estado que mais cresceu na pauta (3%→9% desde 1997) — fronteira agrícola sobre o Cerrado/Pantanal com ferrovia Ferronorte como artéria.' },
  { code: 'PR', nome: 'Paraná', lng: -51.6, lat: -24.6, expBi: 13.2, cat: 'agro', produtos: 'Soja, frango, açúcar, papel, automóveis', dest: 'CHN', empresa: 'BRF · Klabin', did: 'Paranaguá é o porto do frango brasileiro: o Paraná exporta proteína animal e soja para a China — e o complexo agroindustrial foi construído sobre cooperativas.', adv: '6,68%: agroindustrialização cooperativista (Coamo/FRISIA) + porto de Paranaguá (38% da saída do MS).' },
  { code: 'PA', nome: 'Pará', lng: -52.9, lat: -5.5, expBi: 13.2, cat: 'minerio', produtos: 'Minério de ferro (Carajás), alumina, cobre', dest: 'CHN', empresa: 'Vale (Carajás) · Hydro', did: 'Carajás: a maior mina a céu aberto do mundo, dentro da floresta amazônica. O trem do minério atravessa 900 km de mata até São Luís — a Amazônia exportando pedra desde os anos 80.', adv: '6,66%: Carajás (EFC da Vale) + Belo Monte — a Amazônia como fronteira mineral-energética; hidrelétrica abastece o SE enquanto o estado tem bolhas de exclusão energética.' },
  { code: 'RS', nome: 'Rio Grande do Sul', lng: -53.3, lat: -29.7, expBi: 11.2, cat: 'agro', produtos: 'Fumo, soja, cereais, carne de frango, calçados', dest: 'CHN', empresa: 'Souza Cruz (BAT) · calçados do Vale dos Sinos', did: 'O RS exporta fumo (para a China!), soja e frango — e importa carvão e eletrônicos. O estado que perdeu participação na indústria de calçados para o Vietnã e Bangladesh.', adv: '5,64%: fumo para a China (Souza Cruz/BAT) + perda industrial de calçados para o Sudeste Asiático (deslocamento de cadeia do vale do Sinos).' },
  { code: 'GO', nome: 'Goiás', lng: -49.6, lat: -15.9, expBi: 8.0, cat: 'agro', produtos: 'Soja, carne, cobre, açúcar', dest: 'CHN', empresa: 'Slaughterhouses do Cerrado', did: 'O Cerrado goiano virou o celeiro do mundo: soja, boi e agora até COBRE (minas em Cavalcante). A fronteira agrícola que não para.', adv: '4,02%: soja/carne do Cerrado + novo cobre (Serra Grande/Bacaba) — expansão sobre o bioma mais degradado do Brasil.' },
  { code: 'SC', nome: 'Santa Catarina', lng: -50.5, lat: -27.3, expBi: 7.0, cat: 'agro', produtos: 'Frango, suínos, geradores, madeira', dest: 'CHN', empresa: 'BRF · Seara', did: 'O frango catarinense viaja congelado para a China e o Japão — o estado que transformou pequenos produtores em complexos agroindustriais integrados.', adv: '3,51%: complexo BRF/Seara (integração produtor-indústria) + polo eletrometalmecânico de Jaraguá.' },
  { code: 'MS', nome: 'Mato Grosso do Sul', lng: -54.8, lat: -20.4, expBi: 6.3, cat: 'agro', produtos: 'Celulose, soja, carne', dest: 'CHN', empresa: 'Suzano (Ribas do Rio Pardo)', did: 'A nova fronteira da CELULOSE: a Suzano plantou uma cidade-fábrica (Ribas do Rio Pardo) para alimentar as prateleiras de papel do mundo — sobre o bioma do Pantanal vizinho.', adv: '3,2%: nova fábrica de celulose (Ribas do Rio Pardo, 2024) — eucalipto sobre cerrado; 49% das exportações vão para a China.' },
  { code: 'BA', nome: 'Bahia', lng: -41.7, lat: -12.4, expBi: 6.3, cat: 'agro', produtos: 'Soja, óleo combustível, celulose, ouro, algodão', dest: 'CHN', empresa: 'Veracel (celulose)', did: 'A Bahia lidera o Nordeste: soja do oeste (o "matopiba baiano"), celulose do extremo sul e petróleo do Recôncavo — o NE exportador que ainda tem a pior renda per capita do país.', adv: '3,17%: oeste baiano (MATOPIBA do algodão/soja) + Veracel (celulose) — enclave exportador com baixo encadeamento regional.' },
  { code: 'ES', nome: 'Espírito Santo', lng: -40.3, lat: -19.6, expBi: 5.7, cat: 'minerio', produtos: 'Minério de ferro (portos), café conilon, celulose, rochas', dest: 'CHN', empresa: 'Vale (Tubarão) · Suzano', did: 'O ES não mina quase nada — mas é o porto do minério: tubos que atravessam MG despejam ferro nos navios de Tubarão. O estado é a boca do funil exportador.', adv: '2,86%: complexo portuário (Tubarão/Ponta Ubu) — valor de trânsito: o minério mineiro sai pelo ES gerando pouca renda local (economia de logística).' },
  { code: 'MA', nome: 'Maranhão', lng: -45.3, lat: -5.4, expBi: 3.1, cat: 'industria', produtos: 'Alumínio, alumina, soja, celulose', dest: 'mundo', empresa: 'Alumar · Porto do Itaqui', did: 'O Itaqui exporta alumínio e soja do MATOPIBA — e importa combustível. São Luís: a ilha industrial do NE com a maior desigualdade do país ao redor.', adv: '1,55%: Alumar (Alcoa/South32) + Itaqui (grãos do MATOPIBA) — enclave alumínio-soja com energia de Tucuruí.' },
  { code: 'RO', nome: 'Rondônia', lng: -63.0, lat: -10.8, expBi: 2.0, cat: 'agro', produtos: 'Soja, carne, milho, café', dest: 'CHN', did: 'Rondônia: o estado da BR-364 — a estrada que abriu a Amazônia ao agro nos anos 80. Hoje, soja e boi onde havia floresta.', adv: '1,02%: fronteira agrícola da BR-364 — desmatamento proporcional à soja/pecuária (INPE).' },
  { code: 'TO', nome: 'Tocantins', lng: -48.3, lat: -10.2, expBi: 1.9, cat: 'agro', produtos: 'Soja, carne, ouro', dest: 'CHN', did: 'O estado mais novo do Brasil virou tapete de soja da Ferrovia Norte-Sul — o MATOPIBA avançando sobre o cerrado tocantinense.', adv: '0,97%: Norte-Sul (ferrovia) + Balsas-TO: fronteira MATOPIBA em expansão plena.' },
  { code: 'PE', nome: 'Pernambuco', lng: -37.9, lat: -8.4, expBi: 1.5, cat: 'diversos', produtos: 'Combustíveis, máquinas, soja', dest: 'mundo', empresa: 'Refinaria Abreu e Lima · Suape', did: 'O complexo de SUAPE foi construído para refinar e exportar — o porto-indústria do NE que prometeu (e ainda luta para) industrializar o Nordeste.', adv: '0,74%: Suape (refino/petroquímica) — porto-indústria do NE com desempenho abaixo do planejado (Abreu e Lima).' },
  { code: 'CE', nome: 'Ceará', lng: -39.3, lat: -5.2, expBi: 1.4, cat: 'diversos', produtos: 'Ferro e aço, frutas, calçados, pescados', dest: 'EUA', did: 'Do Pecém (aço e agora H2 verde prometido) às frutas do Vale do Jaguaribe: o CE exporta sol, aço e manga para o mundo.', adv: '0,68%: Pecém (aço CSP + hub prometido de hidrogênio verde) + fruticultura irrigada do Jaguaribe (água do Castanhão).' },
  { code: 'PI', nome: 'Piauí', lng: -42.9, lat: -8.3, expBi: 0.66, cat: 'agro', produtos: 'Soja, algodão', dest: 'CHN', did: 'O Piauí entrou no mapa do agro pelo MATOPIBA — soja e algodão no cerrado de Gilbués, a última fronteira.', adv: '0,33%: MATOPIBA piauiense (Gilbués/Uruçuí) — fronteira mais recente do cerrado.' },
  { code: 'RN', nome: 'Rio Grande do Norte', lng: -36.6, lat: -5.8, expBi: 0.55, cat: 'petroleo', produtos: 'Óleo combustível, ouro, açúcar', dest: 'mundo', did: 'Petróleo em terra (o mais antigo do Brasil, Lobato 1939), sal marinho e melão exportado — o pequeno RN com três vocações.', adv: '0,28%: petróleo onshore (Guamaré, desde 1939) + sal de Macau + fruticultura irrigada (Mossoró).' },
  { code: 'AL', nome: 'Alagoas', lng: -36.6, lat: -9.6, expBi: 0.54, cat: 'agro', produtos: 'Açúcar, melaço, minério de cobre, tabaco', dest: 'mundo', did: 'O estado dos canaviais: do açúcar colonial ao melaço e agora ao cobre de Serrote — a usina virou mina.', adv: '0,27%: cana (herança usineira) + cobre de Serrote da Laje (Aura Minerals, ex-Yara) — transição açúcar→mineração.' },
  { code: 'AM', nome: 'Amazonas', lng: -64.7, lat: -4.2, expBi: 0.5, cat: 'industria', produtos: 'Motocicletas, ouro semimanufaturado', dest: 'mundo', empresa: 'Zona Franca de Manaus (Honda)', did: 'A Zona Franca de Manaus monta motos para a América do Sul com incentivo fiscal de TODO o país — e a floresta ao redor exporta ouro garimpado.', adv: '0,25%: ZFM (motocicletas Honda p/ LatAm) sustentada por renúncia fiscal nacional; ouro garimpeiro semimanufaturado (itinerante/ilegal em parte).' },
  { code: 'SE', nome: 'Sergipe', lng: -37.4, lat: -10.6, expBi: 0.22, cat: 'petroleo', produtos: 'Petróleo, suco de laranja, açúcar', dest: 'mundo', did: 'O menor estado exportador do NE: petróleo terrestre de Carmópolis (o mais velho campo em produção do Brasil) e laranja do Vale do São Francisco.', adv: '0,11%: Carmópolis (Petrobras, 1963–) + laranja do Baixo São Francisco — escala mínima, vocação energética antiga.' },
  { code: 'DF', nome: 'Distrito Federal', lng: -47.8, lat: -15.8, expBi: 0.19, cat: 'diversos', produtos: 'Querosene de aviação, sorgo', dest: 'mundo', did: 'O estado que administra o país exporta... querosene de aviação e sorgo. A capital não foi desenhada para o comércio exterior.', adv: '0,09%: QAV (distribuição) + agronegócio de precisão do entorno — função administrativa, não produtiva.' },
  { code: 'PB', nome: 'Paraíba', lng: -36.8, lat: -7.2, expBi: 0.09, cat: 'diversos', produtos: 'Açúcar, melaço, calçados, sucos', dest: 'mundo', did: 'A menor pauta do Nordeste: açúcar da zona da mata e calçados — a Paraíba espera a transposição e o porto de águas profundas mudarem esse quadro.', adv: '0,05%: açúcar/melaço da Zona da Mata + calçados de Bayeux — menor pauta do NE, aguardando transposição do São Francisco.' },
  { code: 'AP', nome: 'Amapá', lng: -51.9, lat: 1.4, expBi: 0.072, cat: 'minerio', produtos: 'Madeira, manganês, minério de ferro', dest: 'mundo', did: 'O Amapá tem 90% de floresta preservada e exporta manganês e madeira — o estado que guarda a porta da Guianas e do maior parque nacional tropical.', adv: '0,04%: manganês (Icomi/Sardoal, legacy) + floresta estadual — conservação vs. pressão de garimpo na fronteira guianense.' },
  { code: 'RR', nome: 'Roraima', lng: -61.4, lat: 2.1, expBi: 0.082, cat: 'agro', produtos: 'Milho, carne bovina', dest: 'mundo', did: 'O único estado ligado ao resto do Brasil POR ESTRADA que atravessa outro país (a BR-174 passa pela Amazônia e chega via Manaus). Arroz e boi na savana do lavrado.', adv: '0,04%: lavrado de Roraima (arroz/boi) + isolamento energético (ligado à Venezuela até 2019) — fronteira agrícola e geopolítica.' },
  { code: 'AC', nome: 'Acre', lng: -70.5, lat: -9.2, expBi: 0.064, cat: 'agro', produtos: 'Carne bovina, soja', dest: 'mundo', did: 'O estado da borracha (a Hevea brasiliensis que abasteceu os carros do mundo no ciclo 1879–1912) agora exporta carne e soja — a floresta de Chico Mendes sob pressão de estradas para o Pacífico.', adv: 'Ciclo da borracha (1879–1912) → pecuária/soja: a rota do Pacífico (Iñapari) como projeto de integração que pressiona a floresta de Chico Mendes.' },
]

/** Fluxos estaduais no formato FlowDef (reaproveita o painel de detalhes). */
export const BR_STATE_FLOWS: FlowDef[] = BR_STATES.map((s) => ({
  id: `st-${s.code}`,
  type: 'commodities' as const,
  from: [s.lng, s.lat] as [number, number],
  to: 'china' as const,
  fromLabel: s.code,
  bend: 0,
  dur: 5,
  peso: 1,
  titulo: `${s.nome}: ${s.produtos.split(',')[0].toLowerCase()} e mais`,
  totalAnual: `US$ ${s.expBi.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi (jan–jul 2025)`,
  did: s.did,
  adv: s.adv,
  itens: [
    { rotulo: 'Produtos principais', valor: s.produtos },
    { rotulo: 'Destino principal', valor: s.dest === 'CHN' ? 'China' : s.dest === 'EUA' ? 'Estados Unidos' : s.dest === 'UE' ? 'União Europeia' : 'diversos' },
    ...(s.empresa ? [{ rotulo: 'Quem move', valor: s.empresa }] : []),
  ],
  fonte: 'Comex Stat/MDIC · jan–jul 2025',
}))

/* ── FLUXO FINANCEIRO INTERNO — quem sustenta quem dentro do país ── */
export interface InternalFlow {
  id: string
  de: string
  para: string
  deLL: [number, number]
  paraLL: [number, number]
  color: string
  rotulo: string
  valor: string
  did: string
  adv: string
}

export const INTERNAL_FLOWS: InternalFlow[] = [
  {
    id: 'fiscal', de: 'Sudeste & Sul', para: 'Norte & Nordeste',
    deLL: [-46.5, -20.5], paraLL: [-39.5, -8.5], color: '#ffc107',
    rotulo: 'Transferência fiscal',
    valor: '≈ R$ 150–250 bi/ano líquidos (est.)',
    did: 'São Paulo, Rio e o Sul pagam muito mais impostos do que recebem de volta. Esse dinheiro vira aposentadoria, bolsa e obra no Norte e Nordeste. Em troca, essas regiões COMPRAM a indústria e o serviço do Sudeste: o mercado interno é uma corrente — ninguém se sustenta sozinho.',
    adv: 'Transferência líquida inter-regional via orçamento (estimativas IBPT/Instituto Millenium; números disputados metodologicamente): o SE/Sul financiam previdência e investimentos do N/NE — cujo mercado consumidor, por sua vez, absorve a produção industrial do Sudeste (integração kaleckiana interestadual).',
  },
  {
    id: 'energia', de: 'Norte (Amazônia)', para: 'Nordeste & Sudeste',
    deLL: [-55.5, -3.5], paraLL: [-44, -12], color: '#4dd0e1',
    rotulo: 'Energia das hidrelétricas',
    valor: 'Tucuruí + Belo Monte → ~50 mi de pessoas',
    did: 'As maiores hidrelétricas do Brasil estão na Amazônia (Tucuruí, Belo Monte). A energia sai da floresta e acende as luzes do Nordeste e Sudeste — enquanto comunidades ribeirinhas e indígenas foram inundadas.',
    adv: 'Tucuruí (8,4 GW) abastece alumínio do MA/PA + sistema interligado; Belo Monte (11,2 GW) direciona o NE — fratura metabólica intra-nacional: energia da floresta para a indústria distante (Aluminum smelters como carga cativa).',
  },
  {
    id: 'zfm', de: 'Todo o país', para: 'Manaus (AM)',
    deLL: [-47.8, -15.8], paraLL: [-60, -3.2], color: '#ce93d8',
    rotulo: 'Renúncia fiscal da Zona Franca',
    valor: '≈ R$ 25 bi+/ano (est.)',
    did: 'Para manter a indústria de eletrônicos em Manaus (no meio da floresta), todos os contribuintes brasileiros "doam" bilhões por ano em impostos que deixam de ser cobrados. É o preço da presença do Estado na Amazônia — disputado há 50 anos.',
    adv: 'ZFM: renúncia fiscal nacional (≈R$25 bi+/ano) para viabilizar polo eletrônico isolado — debate clássico desenvolvimento×soberania amazônica; empregos diretos ~20 mil vs custo fiscal distribuído federativamente.',
  },
  {
    id: 'commodities-co', de: 'Centro-Oeste & MATOPIBA', para: 'Mundo (via portos do NE/SE)',
    deLL: [-55.5, -14], paraLL: [-44, -3], color: '#4caf50',
    rotulo: 'Superávit do agro',
    valor: 'saldo comercial do agro ≈ US$ 150 bi/ano',
    did: 'O superávit comercial brasileiro é quase TODO do agronegócio (Centro-Oeste, MATOPIBA e Sul). É esse saldo que fecha as contas externas do país inteiro — inclusive das importações de celular e remédio que o Sudeste consome.',
    adv: 'Saldo agro ≈ US$150 bi compensa o déficit industrial: a divisão inter-regional do trabalho espelha a divisão internacional — CO/NE geram divisas primárias; SE importa bens de capital/consumo (integração vertical do mercado interno).',
  },
  {
    id: 'agua-sf', de: 'Rio São Francisco', para: 'Semiárido (transposição)',
    deLL: [-42.5, -9.5], paraLL: [-36.5, -7.5], color: '#42a5f5',
    rotulo: 'Água transposta',
    valor: 'projeto de R$ 10+ bi · 1,3 mi de pessoas atendidas',
    did: 'A transposição do São Francisco leva água do rio para o semiárido seco — obra polêmica, caríssima e vital para milhões de sertanejos. O "mar de Gil Eanes" virou cano.',
    adv: 'Transposição (eixos Norte/Leste): R$10+ bi, capacidade de 127 m³/s — infraestrutura hídrica como política de reprodução social do semiárido (contraponto à lógica de drenagem dos canais coloniais).',
  },
]
