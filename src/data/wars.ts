/**
 * MÓDULO 03 — GUERRA DE CAPITAIS & CONFLITOS IMPERIALISTAS
 * Épocas (2026→1914), conflitos geolocalizados, complexo militar-industrial,
 * quem lucra e a cadeia Estado→contrato→acionista. Fontes: SIPRI, Costs of War
 * (Brown Univ.), CRS/Congresso EUA, relatórios anuais das contratadas.
 */

import { pick, type Lang } from '../i18n'

export type SupplierId =
  | 'lockheed' | 'rtx' | 'gd' | 'northrop' | 'bae' | 'rheinmetall' | 'thales' | 'rostec'
  | 'halliburton' | 'exxon' | 'chevron' | 'morgan' | 'krupp' | 'vickers'

export interface Supplier {
  id: SupplierId
  nome: string
  pais: string
  /** sede [lng, lat] para traçar a linha de suprimento */
  hq: [number, number]
  /** receita anual de DEFESA, US$ bi aprox. */
  defesaBi?: number
  setor: string
  destaque: string
}

export const SUPPLIERS: Record<SupplierId, Supplier> = {
  lockheed: { id: 'lockheed', nome: 'Lockheed Martin', pais: 'EUA', hq: [-77.1, 38.98], defesaBi: 67, setor: 'Caças F-35, mísseis HIMARS/Javelin', destaque: 'Backlog recorde ≈ US$ 176 bi (2024)' },
  rtx: { id: 'rtx', nome: 'RTX (Raytheon)', pais: 'EUA', hq: [-77.05, 38.87], defesaBi: 42, setor: 'Patriot, Tomahawk, munição', destaque: 'Pedidos disparados por defesa antiaérea' },
  gd: { id: 'gd', nome: 'General Dynamics', pais: 'EUA', hq: [-77.34, 38.95], defesaBi: 40, setor: 'Blindados Abrams, submarinos, munição 155mm', destaque: 'Expansão de linhas de artilharia pós-Ucrânia' },
  northrop: { id: 'northrop', nome: 'Northrop Grumman', pais: 'EUA', hq: [-77.17, 38.88], defesaBi: 39, setor: 'Bombers B-21, mísseis, espaço', destaque: 'Nuclear modernization multi-década' },
  bae: { id: 'bae', nome: 'BAE Systems', pais: 'Reino Unido', hq: [-0.13, 51.51], defesaBi: 28, setor: 'Blindados, eletrônica, componentes F-35', destaque: '+~150% na bolsa desde fev/2022 (est.)' },
  rheinmetall: { id: 'rheinmetall', nome: 'Rheinmetall', pais: 'Alemanha', hq: [6.77, 51.22], defesaBi: 9, setor: 'Leopard, munição 155mm, blindados', destaque: '>+250% na bolsa 2022→2025 · carteira ≈ €55 bi' },
  thales: { id: 'thales', nome: 'Thales', pais: 'França', hq: [2.35, 48.86], defesaBi: 12, setor: 'Eletrônica, radares, mísseis (MBDA)', destaque: 'Reordenações europeias aceleradas' },
  rostec: { id: 'rostec', nome: 'Rostec', pais: 'Rússia', hq: [37.62, 55.75], defesaBi: 18, setor: 'Su-57, S-400, blindados (estatal)', destaque: 'Economia russa reconvertida à guerra (7,1% PIB, SIPRI)' },
  halliburton: { id: 'halliburton', nome: 'Halliburton / KBR', pais: 'EUA', hq: [-95.37, 29.76], setor: 'Logística militar, reconstrução', destaque: 'Contratos sem licitação (LOGCAP/Iraque) bilionários' },
  exxon: { id: 'exxon', nome: 'ExxonMobil / Chevron', pais: 'EUA', hq: [-95.4, 30.0], setor: 'Capital fóssil / LGN', destaque: 'Lucros recordes substituindo gás russo na UE' },
  chevron: { id: 'chevron', nome: 'Chevron', pais: 'EUA', hq: [-95.4, 29.7], setor: 'Capital fóssil', destaque: 'Margens recordes 2022–24' },
  morgan: { id: 'morgan', nome: 'J.P. Morgan & Co.', pais: 'EUA', hq: [-74.01, 40.71], setor: 'Financiamento de guerra (1914–19)', destaque: 'Agente de compras/crediário aliado: ~US$ 3 bi da época' },
  krupp: { id: 'krupp', nome: 'Krupp', pais: 'Alemanha', hq: [7.0, 51.45], setor: 'Artilharia pesada (1914–45)', destaque: '"Canhoneira do Reich": lucros nas duas guerras' },
  vickers: { id: 'vickers', nome: 'Vickers / Armstrong', pais: 'Reino Unido', hq: [-1.6, 54.97], setor: 'Navios de guerra e munição (1914–18)', destaque: 'Lucros extraordinários com a Royal Navy' },
}

export interface WarCompany {
  ref?: SupplierId
  nome: string
  pais: string
  setor: string
  ganhoDidatico: string
  ganhoAvancado: string
  /** gráfico de surto opcional: índice normalizado antes→durante */
  surge?: { baseLabel: string; baseVal: number; nowLabel: string; nowVal: number; unidade?: string }
}

export interface WarStat {
  label: string
  valor: string
  fonte: string
}

export interface WarConflict {
  id: string
  nome: string
  periodo: string
  epoch: number // índice em WAR_EPOCHS
  lngLat: [number, number]
  curto: string
  mecanismoDidatico: string
  mecanismoAvancado: string
  empresas: WarCompany[]
  stats: WarStat[]
}

export interface WarEpoch {
  id: string
  rotuloCurto: string
  faixa: string
  from: number
  to: number
  color: string
  introDidatico: string
  introAvancado: string
}

/** Épocas ordenadas DO PRESENTE PARA O PASSADO (slider reverso). */
export const WAR_EPOCHS: WarEpoch[] = [
  {
    id: 'e2022',
    rotuloCurto: 'Ucrânia & Pacífico',
    faixa: '2022 – 2026',
    from: 2022, to: 2026, color: '#ef5350',
    introDidatico: 'A guerra na Ucrânia reacendeu a fábrica de armas ocidental (munição, blindados, defesa antiaérea) e trocou o gás russo por LGN americano na Europa — enquanto o Pacífico vira xadrez dos semicondutores.',
    introAvancado: 'Sobreacumulação do complexo belico-industrial encontra campo de realização: reposição intensiva de estoques (155mm, GBAD), reconfiguração energética europeia (LNG US→UE) e guerra tecnológica de export-controls no Pacífico.',
  },
  {
    id: 'e2001',
    rotuloCurto: 'Guerra ao Terror',
    faixa: '2001 – 2020',
    from: 2001, to: 2020, color: '#ffb300',
    introDidatico: 'Afeganistão e Iraque: mais de US$ 2 trilhões do contribuinte americano viraram contratos de logística, segurança privada e reconstrução — um mercado garantido pelo Estado para empreiteiras.',
    introAvancado: 'Captura fiscal do Estado pós-11/9: apropriação de renda petrolífera sob tutela militar, privatização da violência (contractors) e circuito dívida→contratos→dividendos sem risco de realização.',
  },
  {
    id: 'e1971',
    rotuloCurto: 'Guerra Fria & Petrodólar',
    faixa: '1971 – 1991',
    from: 1971, to: 1991, color: '#ba68c8',
    introDidatico: 'Sem o ouro, o dólar se sustenta no petróleo e nos exércitos. Choques do petróleo reciclam petrodólares pelos bancos do Norte — e conflitos regionais dividem zonas de influência.',
    introAvancado: 'Pós-Bretton Woods: hegemonia monetária ancorada em commodities estratégicas + militarismo. Petrodólares são reciclados como eurocrédito → dívida do Terceiro Mundo (subimperialismo financeiro).',
  },
  {
    id: 'e1939',
    rotuloCurto: 'Segunda Guerra',
    faixa: '1939 – 1945',
    from: 1939, to: 1945, color: '#42a5f5',
    introDidatico: 'A crise de 1929 só foi totalmente superada produzindo destruição em escala industrial. Os EUA saem como "arsenal dos aliados", donos de 2/3 do ouro do mundo — nascem Bretton Woods e o dólar-hegemon.',
    introAvancado: 'Solução keynesiana-belicosa da sobreacumulação: mobilização total absorve o excedente; Lend-Lease (US$ 50 bi da época) transfere reservas de ouro europeias para Fort Knox, fundando a ordem de 1944.',
  },
  {
    id: 'e1914',
    rotuloCurto: 'Primeira Guerra',
    faixa: '1914 – 1918',
    from: 1914, to: 1918, color: '#90a4ae',
    introDidatico: 'Impérios disputam o retalhamento do mundo — mercados, colônias e matérias-primas. A indústria pesada enriquece (Krupp, Vickers), os bancos financiam (J.P. Morgan) e os EUA saem de devedores a credores globais.',
    introAvancado: 'Lenin: fase monopolista → repartição territorial proporcional à força econômica; guerra = continuação da concorrência inter-capitalista por outros meios. Fluxo de ouro → Nova York inverte a hierarquia financeira mundial.',
  },
]

export const WAR_CONFLICTS: WarConflict[] = [
  {
    id: 'ucrania',
    nome: 'Guerra da Ucrânia / Reconfiguração Energética da Europa',
    periodo: '2022 – presente',
    epoch: 0,
    lngLat: [31.17, 48.38],
    curto: 'Ucrânia',
    mecanismoDidatico:
      'A guerra destruiu fábricas, pontes e cidades (capital constante físico) e obrigou a Europa a trocar gás russo por gás americano. Enquanto isso, os exércitos ocidentais queimaram estoques de munição — e precisaram recomprar tudo, com juros de lucro embutidos.',
    mecanismoAvancado:
      'Destruição de c + substituição da matriz energética europeia (pipeline→LNG US): dupla valorização — complexo belico-industrial realiza sobreacumulação via reposição (155mm, GBAD) e capital fóssil anglo-americano captura renda energética europeia com prêmio geopolítico.',
    empresas: [
      { ref: 'rheinmetall', nome: 'Rheinmetall', pais: 'Alemanha', setor: 'Blindados e munição de artilharia', ganhoDidatico: 'A ação subiu mais de 250% desde o início da guerra — a fábrica alemã de munição virou queridinha da bolsa.', ganhoAvancado: 'Realização plena da carteira: pedidos de 155mm/blindados elevam backlog a ≈€55 bi; margens em expansão com capacidade oculta ativada.', surge: { baseLabel: 'fev/2022 (=100)', baseVal: 100, nowLabel: 'dez/2025', nowVal: 560 } },
      { ref: 'lockheed', nome: 'Lockheed Martin', pais: 'EUA', setor: 'HIMARS, Javelin, F-35', ganhoDidatico: 'Os lançadores HIMARS viraram celebridade de guerra; contratos do Pentágono e da OTAN renovados em dezenas de bilhões.', ganhoAvancado: 'Demonstração em campo real = marketing estatal subsidiado; backlog recorde ≈US$176 bi garante fluxo de m por anos.', surge: { baseLabel: 'fev/2022 (=100)', baseVal: 100, nowLabel: 'dez/2025', nowVal: 128 } },
      { ref: 'rtx', nome: 'RTX / Raytheon', pais: 'EUA', setor: 'Defesa antiaérea Patriot', ganhoDidatico: 'Cada míssil interceptador usado precisa ser recomprado — o escudo antiaéreo virou assinatura mensal.', ganhoAvancado: 'Consumo de interceptores cria demanda recorrente (razão munição/stockpile): conversão do conflito em receita annuity.', surge: { baseLabel: 'fev/2022 (=100)', baseVal: 100, nowLabel: 'dez/2025', nowVal: 135 } },
      { ref: 'exxon', nome: 'ExxonMobil / Chevron', pais: 'EUA', setor: 'Capital fóssil / LGN', ganhoDidatico: 'Com o gás russo cortado, a Europa passou a comprar gás navio americano bem mais caro: lucros históricos das petroleiras.', ganhoAvancado: 'Renda de escassez geopolítica: spread TTF-JKM capturado pelas majors + terminais LNG subsididados fiscalmente.', surge: { baseLabel: 'lucro 2021 (=100)', baseVal: 100, nowLabel: 'pico 2022', nowVal: 245 } },
      { ref: 'rostec', nome: 'Rostec', pais: 'Rússia', setor: 'Complexo militar estatal', ganhoDidatico: 'Do outro lado da trincheira, a estatal russa também lucra: a economia inteira foi virada para a guerra.', ganhoAvancado: 'Gasto militar russo a 7,1% do PIB (SIPRI 2024): reconversão produtiva estatal absorve excedente e sustenta demanda agregada bélica.' },
    ],
    stats: [
      { label: 'Ajuda militar EUA apropriada', valor: '≈ US$ 175 bi', fonte: 'CRS/Congresso, abr/2024' },
      { label: 'Europa: crescimento gasto militar', valor: '+17% em 2024', fonte: 'SIPRI' },
      { label: 'Meta de projéteis 155mm (UE)', valor: '1 milhão/ano', fonte: 'EDIS/Comissão Europeia' },
    ],
  },
  {
    id: 'taiwan',
    nome: 'Crise dos Semicondutores no Pacífico (bloqueio tecnológico)',
    periodo: '2022 – presente',
    epoch: 0,
    lngLat: [120.96, 23.7],
    curto: 'Taiwan/Chips',
    mecanismoDidatico:
      'Não há tiros (ainda): a guerra aqui é de licenças de exportação. Quem controla as fábricas de chips mais avançados controla o cérebro da economia — e ambos os lados gastam bilhões em armas "por precaução".',
    mecanismoAvancado:
      'Conflito de acumulação por controle do capital constante avançado (foundry <7nm, EUV): export-controls tentam conter k chinês; militarização paralela do Pacífico monetiza dissuasão (contratos US-Japão-Austrália).',
    empresas: [
      { nome: 'TSMC', pais: 'Taiwan', setor: 'Foundry dominante', ganhoDidatico: '~90% dos chips lógicos de ponta do mundo saem da TSMC — o "escudo de silício" que todos precisam proteger.', ganhoAvancado: 'Posição monopolista = renda tecnológica extraordinária; geografia da produção vira arma estratégica.' },
      { ref: 'lockheed', nome: 'Lockheed Martin / contratadas EUA', pais: 'EUA', setor: 'Deterrence no Pacífico', ganhoDidatico: 'A possibilidade da guerra já vende: mísseis anti-navio, caças e baterias para Japão, Austrália e EUA mesmos.', ganhoAvancado: 'Valorização da opção bélica: incerteza estrutural sustenta trajetória ascendente de contratos de dissuasão.' },
    ],
    stats: [
      { label: 'Chips de lógica de ponta feitos pela TSMC', valor: '~90% mundial', fonte: 'NIST/Dept. de Comércio dos EUA, 2024' },
      { label: 'Export controls EUA→CHN (chips/EUV)', valor: 'regime desde out/2022', fonte: 'BIS/DOC' },
    ],
  },
  {
    id: 'gaza',
    nome: 'Guerra Israel–Palestina / Escalada regional',
    periodo: '2023 – presente',
    epoch: 0,
    lngLat: [34.36, 31.4],
    curto: 'Gaza',
    mecanismoDidatico:
      'Bombas fabricadas nos EUA, aviões com peças britânicas e escudos antiaéreos pagos com auxílio americano: o conflito é abastecido em tempo real pela indústria de defesa — e os estoques esvaziados geram novos pedidos.',
    mecanismoAvancado:
      'Transferência direta de mais-valia fiscal norte-americana (auxílios legislados) para margens de contratadas; consumo de munição/interceptores reabastece pipeline de ordens domésticas+aliadas.',
    empresas: [
      { ref: 'lockheed', nome: 'Lockheed Martin / Boeing (munições)', pais: 'EUA', setor: 'Bombas guiadas, caças', ganhoDidatico: 'As bombas usadas em Gaza têm fabricante — e reposição garantida por pacotes aprovados no Congresso.', ganhoAvancado: 'Cadeia supridora integrada OTAN-Israel: ordens aceleradas de JDAM/Mk-84 pós-out/2023.' },
      { ref: 'rtx', nome: 'RTX', pais: 'EUA', setor: 'Interceptadores Iron Dome/David’s Sling', ganhoDidatico: 'Cada salva de interceptores consumida é futura fatura para o contribuinte americano.', ganhoAvancado: 'Co-produção/co-financiamento (MOU US$3,8 bi/ano) institucionaliza demanda cativa.' },
    ],
    stats: [
      { label: 'Auxílio militar anual base EUA→Israel', valor: 'US$ 3,8 bi', fonte: 'MOU 2016–2028' },
      { label: 'Pacote suplementar aprovado 2024', valor: '≈ US$ 26 bi (Israel)', fonte: 'Congresso EUA, abr/2024' },
    ],
  },
  {
    id: 'afeganistao_us',
    nome: 'Guerra do Afeganistão (EUA/NATO × Talibã)',
    periodo: '2001 – 2021',
    epoch: 1,
    lngLat: [69.17, 34.53],
    curto: 'Afeganistão',
    mecanismoDidatico:
      'Vinte anos de guerra pagos com cartão de crédito público: logística, comida, combustível e segurança tercerizados. Empresas cobravam por cada galão de gasolina atravessando o deserto — e o país terminou de volta nas mãos do Talibã.',
    mecanismoAvancado:
      'Rentabilidade sem risco de realização: LOGCAP e contratos cost-plus transferem tesouro público a empreiteiras; privatização da violência (contractors ≥ tropas regulares em vários anos) externaliza custo político interno.',
    empresas: [
      { ref: 'halliburton', nome: 'Halliburton / KBR', pais: 'EUA', setor: 'Logística militar', ganhoDidatico: 'Fez a comida, o alojamento e a gasolina das tropas — com lucro embutido em cada prato de arroz.', ganhoAvancado: 'Contratos exclusivos sem licitação competitiva: captura direta de renda fiscal via preço administrado.' },
      { nome: 'Blackwater / DynCorp', pais: 'EUA', setor: 'Segurança privada', ganhoDidatico: 'Mercenários corporativos ganharam mais por cabeça que soldados do próprio exército.', ganhoAvancado: 'Comodificação da força de trabalho violenta: arbitragem salarial entre soldo público e tarifa privada.' },
    ],
    stats: [
      { label: 'Custo direto EUA (guerra + reconstrução)', valor: '≈ US$ 2,3 tri', fonte: 'Costs of War / Brown Univ.' },
      { label: 'Custo total projetado (c/ veteranos até 2050)', valor: '≈ US$ 8 tri', fonte: 'Costs of War, 2021' },
    ],
  },
  {
    id: 'iraque',
    nome: 'Invasão do Iraque e Guerra do Golfo',
    periodo: '2003 – 2011',
    epoch: 1,
    lngLat: [44.37, 33.32],
    curto: 'Iraque',
    mecanismoDidatico:
      'Sob a alegação de armas de destruição em massa, abriram-se o petróleo iraquiano às grandes companhias e um mercado gigante de reconstrução pago pelo próprio país invadido (e pelo invasor).',
    mecanismoAvancado:
      'Apropriação de campos petrolíferos sob ocupação + ciclo reconstrução: destruição de c alheio abre demanda de infraestrutura paga por apropriações públicas; petro-renda reprivatizada via PSAs/contratos de serviço.',
    empresas: [
      { ref: 'halliburton', nome: 'Halliburton / KBR', pais: 'EUA', setor: 'Reconstrução e poços de petróleo', ganhoDidatico: 'Contratos bilionários sem concorrência para apagar incêndios de poços e reconstruir o que as bombas destruíram.', ganhoAvancado: 'Integração vertical conflito→reconstrução: mesma firma destrói (logística) e reconstitui (infra), duplicando captura.' },
      { nome: 'Bechtel / grandes engenharias', pais: 'EUA', setor: 'Infraestrutura', ganhoDidatico: 'Escolas, usinas e portos reconstruídos com dinheiro público americano e iraquiano — margem privada garantida.', ganhoAvancado: 'Keynesianismo de guerra externo: investimento público que vira ativo privado sem risco de mercado.' },
      { ref: 'chevron', nome: 'Majors petrolíferas', pais: 'EUA/UK', setor: 'Petróleo', ganhoDidatico: 'As segundas maiores reservas de óleo do mundo voltaram a ficar "abertas para negócios".', ganhoAvancado: 'Controle difuso via contratos técnicos-serviço: renda diferencial petrolífera reancorada à órbita dólar.' },
    ],
    stats: [
      { label: 'Apropriações diretas EUA (Iraque)', valor: '≈ US$ 1,8–2 tri', fonte: 'Costs of War / CRS' },
      { label: 'Contrato RIO Halliburton (sem licitação)', valor: 'até US$ 7 bi', fonte: 'GAO/CorpWatch' },
    ],
  },
  {
    id: 'golfo91',
    nome: 'Guerra do Golfo (Coalizão × Iraque)',
    periodo: '1990 – 1991',
    epoch: 2,
    lngLat: [47.6, 29.0],
    curto: 'Kuwait/Golfo',
    mecanismoDidatico:
      'A estreia televisionada do complexo militar-industrial: armas caríssimas testadas em combate real (Patriot!, Stealth) — e a conta da coalizão majoritariamente paga pelos aliados ricos do Golfo.',
    mecanismoAvancado:
      'Externalização do custo (financiamento saudita/alemão/japonês ≈ US$ 54 bi dos US$ 61 bi) + vitrine tecnológica: cada conflito valida gerações de sistemas e trava clientes por décadas (ciclo de plataforma).',
    empresas: [
      { ref: 'rtx', nome: 'RTX (Patriot)', pais: 'EUA', setor: 'Defesa antiaérea', ganhoDidatico: 'Os interceptores Patriot viraram manchete global — e o produto mais desejado do catálogo militar.', ganhoAvancado: 'Marketing bélico gratuito: desempenho percebido (mesmo contestado tecnicamente) converte-se em exportações.' },
      { ref: 'gd', nome: 'General Dynamics (Abrams)', pais: 'EUA', setor: 'Blindados', ganhoDidatico: 'Tanques americanos varreram o deserto na TV ao vivo — o melhor comercial possível.', ganhoAvancado: 'Demonstração de força = barreira competitiva tecnológica; lock-in de frota por 30 anos.' },
      { ref: 'halliburton', nome: 'Halliburton (LOGCAP)', pais: 'EUA', setor: 'Logística', ganhoDidatico: 'Nasceu aqui o modelo: a cozinha, a lavanderia e o combustível do exército terceirizados com lucro.', ganhoAvancado: 'Gênese da terceirização integral de suporte vital: transformação de função estatal em franquia rentável.' },
    ],
    stats: [
      { label: 'Custo operacional da coalizão', valor: '≈ US$ 61 bi', fonte: 'GAO' },
      { label: 'Reembolsado por aliados (SAU/KWT/JPN/DEU)', valor: '≈ US$ 54 bi', fonte: 'GAO/DoD' },
    ],
  },
  {
    id: 'petrodolar73',
    nome: 'Choque do Petróleo & Nascimento do Petrodólar',
    periodo: '1973 – 1974',
    epoch: 2,
    lngLat: [46.7, 24.7],
    curto: 'Petrodólar',
    mecanismoDidatico:
      'Embargo árabe quadruplicou o preço do óleo. O dinheiro dos petróleo-fluxos voltou para os bancos de Nova York e Londres — que emprestaram aos países pobres com juros altos. Nascia a dívida do Terceiro Mundo, toda em dólares.',
    mecanismoAvancado:
      'Pós-Nixon shock (1971): âncora monetária reconstruída sobre commodity estratégica + reciclagem de petrodólares (euromarkets) → endividamento periférico dolarizado → disciplinamento via crises de balanço (1982).',
    empresas: [
      { ref: 'chevron', nome: 'Sete Irmãs (legado) / majors', pais: 'EUA/UE', setor: 'Petróleo', ganhoDidatico: 'Preço quadruplicado, mesma barra de óleo: lucro por barril multiplicado sem furar um metro a mais de terra.', ganhoAvancado: 'Renda de cartel politicamente sancionada (OPEP conservadora contra URSS) — alinhamento petróleo×dólar.' },
      { nome: 'Grandes bancos credores (Citibank, Chase)', pais: 'EUA', setor: 'Eurodólar / syndicated loans', ganhoDidatico: 'Reciclaram os petrodólares como empréstimos caros para América Latina e África — a conta chegaria em 1982.', ganhoAvancado: 'Intermediação do excedente petrolífero em dívida soberana periférica: financeirização da hegemonia monetária.' },
    ],
    stats: [
      { label: 'Queda do dólar × ouro (Nixon shock)', valor: 'ago/1971', fonte: 'Fed history' },
      { label: 'Óleo (Arabian Light)', valor: 'US$ 3 → ~US$ 12/bbl', fonte: 'BP Statistical Review' },
    ],
  },
  {
    id: 'afeg_urss',
    nome: 'Guerra do Afeganistão (URSS × Mujahideen)',
    periodo: '1979 – 1989',
    epoch: 2,
    lngLat: [67.7, 34.5],
    curto: 'Afeganistão (URSS)',
    mecanismoDidatico:
      'A versão fria da guerra: os EUA armaram a resistência sem mandar tropas. Foguetes Stinger americanos derrubavam helicópteros soviéticos — uma guerra barata para uns, ruinosa para outros.',
    mecanismoAvancado:
      'Guerra por procuração como desgaste do competidor: sangrar acumulação soviética (custo militar distorcivo) com custo marginal ocidental; Stinger como exportação de assimetria tecnológica.',
    empresas: [
      { ref: 'rtx', nome: 'RTX (Stinger/GM)', pais: 'EUA', setor: 'MANPADS', ganhoDidatico: 'O míssil de ombro que nivelou o céu — encomendado às centenas pelo Congresso americano.', ganhoAvancado: 'Assimetria custo-alvo: US$ 80k neutralizando helicóptero multimilionário = eficiência contábil da contenção.' },
      { nome: 'Complexo militar pakistani-saudita (corredor)', pais: 'PAK/SAU', setor: 'Intermediação', ganhoDidatico: 'O dinheiro e as armas passavam por ali — e a região herdaria décadas de milícias armadas.', ganhoAvancado: 'Outsourcing geopolítico: delegação operacional com captura de renda intermediária (ISI/logística).' },
    ],
    stats: [
      { label: 'Operação Cyclone (apoio EUA)', valor: '≈ US$ 3 bi (decenal)', fonte: 'Congressional records' },
    ],
  },
  {
    id: 'wwii',
    nome: 'Segunda Guerra Mundial — a sobreacumulação resolvida a fogo',
    periodo: '1939 – 1945',
    epoch: 3,
    lngLat: [12.5, 52.3],
    curto: 'WWII Europa',
    mecanismoDidatico:
      'Depois de 10 anos de crise e desemprego, a produção de tanques, aviões e navios colocou todo mundo para trabalhar. Quando acabou, a Europa estava em ruínas — e os EUA eram donos de dois terços do OURO do planeta.',
    mecanismoAvancado:
      'Resolução bélica da Grande Depressão: mobilização total elimina excedente de capacidade e força de trabalho ociosa; Lend-Lease drena reservas auríferas europeias → Bretton Woods consagra o dólar (1944) e o ciclo de reconstrução (Marshall ≈ US$13,3 bi) abre novo campo de acumulação.',
    empresas: [
      { nome: 'GM / Ford / Chrysler', pais: 'EUA', setor: 'Indústria convertida a guerra', ganhoDidatico: 'Fábricas de carros viraram fábricas de tanques, bombardeiros e caminhões — com lucro garantido pelo Estado.', ganhoAvancado: 'Cost-plus contracts eliminam risco de realização: lucratividade estática com volume explosivo (aviões: ~300 mil produzidos).' },
      { nome: 'DuPont / químicas', pais: 'EUA', setor: 'Explosivos e materiais', ganhoDidatico: 'Da pólvora ao Projeto Manhattan: a química da guerra pagou dividendos por décadas.', ganhoAvancado: 'R&D subsidiado militarmente funda vantagens civis posteriores (plásticos, nylon) — spin-off bélico-produtivo.' },
      { nome: 'Boeing / aviation majors', pais: 'EUA', setor: 'Aeronáutica', ganhoDidatico: 'Bombardeiros B-17/B-29 de dia, jatos comerciais de noite: a guerra treinou a indústria que dominaria os céus.', ganhoAvancado: 'Aprendizado produtivo bélico transborda à aviação civil — base da hegemonia exportadora americana pós-45.' },
    ],
    stats: [
      { label: 'PIB dos EUA 1939→1945', valor: '≈ dobrou', fonte: 'BEA' },
      { label: 'Lend-Lease', valor: '≈ US$ 50 bi (época)', fonte: 'FRASER/St. Louis Fed' },
      { label: 'Ouro mundial em mãos dos EUA (fins dos 40s)', valor: '≈ 2/3', fonte: 'Treasury/IMF hist.' },
    ],
  },
  {
    id: 'wwi',
    nome: 'Primeira Guerra Mundial — a partilha imperialista',
    periodo: '1914 – 1918',
    epoch: 4,
    lngLat: [5.3, 49.7],
    curto: 'Verdun/Frente Ocidental',
    mecanismoDidatico:
      'Impérios brigando pelo mundo: colônias, mercados e rotas. A indústria pesada faturava (Krupp, Vickers, Schneider), os bancos financiavam tudo (J.P. Morgan), e ~20 milhões de pessoas morreram pelo rateio dos lucros.',
    mecanismoAvancado:
      'Estágio monopolista (Lenin): exportação de capitais exige proteção territorial de mercados; equilíbrio de forças rompe a partilha vigente. Financiamento Morgan converte os EUA de devedor líquido (−US$3,7 bi) a credor líquido (+US$12,5 bi, 1919) — o ouro migra para Nova York e prepara Wall Street.',
    empresas: [
      { ref: 'morgan', nome: 'J.P. Morgan & Co.', pais: 'EUA', setor: 'Banca de guerra', ganhoDidatico: 'Comprou lã e trigo para os aliados e emprestou o dinheiro para pagarem a si mesmo — comissão nas duas pontas.', ganhoAvancado: 'Agency + underwriting: captura dupla (fluxo comercial e juros); consolidação de NY como centro hegemônico.' },
      { ref: 'krupp', nome: 'Krupp', pais: 'Alemanha', setor: 'Artilharia pesada', ganhoDidatico: 'Os canhões "Grande Berta" que arrasaram cidades tinham o mesmo sobrenome da dinastia que os faturava.', ganhoAvancado: 'Cartel siderúrgico-militar: lucros extraordinários com demanda inelástica criada pelo Estado.' },
      { ref: 'vickers', nome: 'Vickers / Armstrong Whitworth', pais: 'Reino Unido', setor: 'Couraçados e munição', ganhoDidatico: 'Navios de guerra vendidos até para adversários antes de 1914 — negócio é negócio.', ganhoAvancado: 'Merchant of death paradigm: comércio de armas pré-guerra multilateral; base do debate de controle de armamentos (1930s).' },
    ],
    stats: [
      { label: 'Mortes (militares+civis)', valor: '≈ 20 milhões', fonte: 'est. historiográficas' },
      { label: 'Posição externa EUA 1914→1919', valor: '−US$3,7 bi → +US$12,5 bi', fonte: 'Historical Statistics of the US' },
    ],
  },
]

type WarTranslation = readonly [en: string, es: string]

/**
 * Traduções locais do domínio GUERRA. Os dados canônicos continuam em PT para
 * preservar números, fontes, IDs e a lógica; a interface seleciona EN/ES aqui.
 */
const WAR_TRANSLATIONS: Record<string, WarTranslation> = {
  'EUA': ['USA', 'EE. UU.'],
  'Reino Unido': ['United Kingdom', 'Reino Unido'],
  'Alemanha': ['Germany', 'Alemania'],
  'França': ['France', 'Francia'],
  'Rússia': ['Russia', 'Rusia'],
  'EUA/UE': ['USA/EU', 'EE. UU./UE'],
  'EUA/UK': ['USA/UK', 'EE. UU./Reino Unido'],
  'PAK/SAU': ['Pakistan/Saudi Arabia', 'Pakistán/Arabia Saudita'],
  'Taiwan': ['Taiwan', 'Taiwán'],

  'Caças F-35, mísseis HIMARS/Javelin': ['F-35 fighters, HIMARS/Javelin missiles', 'Cazas F-35, misiles HIMARS/Javelin'],
  'Backlog recorde ≈ US$ 176 bi (2024)': ['Record backlog ≈ US$176 bn (2024)', 'Cartera récord ≈ US$176 mil M (2024)'],
  'Patriot, Tomahawk, munição': ['Patriot, Tomahawk, ammunition', 'Patriot, Tomahawk, munición'],
  'Pedidos disparados por defesa antiaérea': ['Orders surged on air-defense demand', 'Pedidos disparados por la demanda de defensa antiaérea'],
  'Blindados Abrams, submarinos, munição 155mm': ['Abrams armored vehicles, submarines, 155mm ammunition', 'Blindados Abrams, submarinos, munición de 155 mm'],
  'Expansão de linhas de artilharia pós-Ucrânia': ['Expansion of artillery lines after Ukraine', 'Expansión de líneas de artillería tras Ucrania'],
  'Bombers B-21, mísseis, espaço': ['B-21 bombers, missiles, space', 'Bombarderos B-21, misiles, espacio'],
  'Nuclear modernization multi-década': ['Multi-decade nuclear modernization', 'Modernización nuclear de varias décadas'],
  'Blindados, eletrônica, componentes F-35': ['Armored vehicles, electronics, F-35 components', 'Blindados, electrónica, componentes del F-35'],
  '+~150% na bolsa desde fev/2022 (est.)': ['+~150% on the stock market since Feb/2022 (est.)', '+~150% en bolsa desde feb/2022 (est.)'],
  'Leopard, munição 155mm, blindados': ['Leopard, 155mm ammunition, armored vehicles', 'Leopard, munición de 155 mm, blindados'],
  '>+250% na bolsa 2022→2025 · carteira ≈ €55 bi': ['>+250% on the stock market 2022→2025 · backlog ≈ €55 bn', '>+250% en bolsa 2022→2025 · cartera ≈ €55 mil M'],
  'Eletrônica, radares, mísseis (MBDA)': ['Electronics, radars, missiles (MBDA)', 'Electrónica, radares, misiles (MBDA)'],
  'Reordenações europeias aceleradas': ['European reorders accelerated', 'Recompras europeas aceleradas'],
  'Su-57, S-400, blindados (estatal)': ['Su-57, S-400, armored vehicles (state-owned)', 'Su-57, S-400, blindados (estatal)'],
  'Economia russa reconvertida à guerra (7,1% PIB, SIPRI)': ['Russian economy converted to war production (7.1% GDP, SIPRI)', 'Economía rusa reconvertida a la guerra (7,1% del PIB, SIPRI)'],
  'Logística militar, reconstrução': ['Military logistics, reconstruction', 'Logística militar, reconstrucción'],
  'Contratos sem licitação (LOGCAP/Iraque) bilionários': ['Billion-dollar no-bid contracts (LOGCAP/Iraq)', 'Contratos multimillonarios sin licitación (LOGCAP/Irak)'],
  'Capital fóssil / LGN': ['Fossil capital / LNG', 'Capital fósil / GNL'],
  'Lucros recordes substituindo gás russo na UE': ['Record profits replacing Russian gas in the EU', 'Beneficios récord al sustituir el gas ruso en la UE'],
  'Capital fóssil': ['Fossil capital', 'Capital fósil'],
  'Margens recordes 2022–24': ['Record margins 2022–24', 'Márgenes récord 2022–24'],
  'Financiamento de guerra (1914–19)': ['War financing (1914–19)', 'Financiación de guerra (1914–19)'],
  'Agente de compras/crediário aliado: ~US$ 3 bi da época': ['Allied purchasing/credit agent: ~US$3 bn at the time', 'Agente de compras/crédito aliado: ~US$3 mil M de la época'],
  'Artilharia pesada (1914–45)': ['Heavy artillery (1914–45)', 'Artillería pesada (1914–45)'],
  '"Canhoneira do Reich": lucros nas duas guerras': ['"Reich gunmaker": profits in both wars', '"Armero del Reich": beneficios en ambas guerras'],
  'Navios de guerra e munição (1914–18)': ['Warships and ammunition (1914–18)', 'Buques de guerra y munición (1914–18)'],
  'Lucros extraordinários com a Royal Navy': ['Extraordinary profits from the Royal Navy', 'Beneficios extraordinarios con la Royal Navy'],

  'Ucrânia & Pacífico': ['Ukraine & Pacific', 'Ucrania y Pacífico'],
  'A guerra na Ucrânia reacendeu a fábrica de armas ocidental (munição, blindados, defesa antiaérea) e trocou o gás russo por LGN americano na Europa — enquanto o Pacífico vira xadrez dos semicondutores.': ['The war in Ukraine restarted the Western arms factory (ammunition, armored vehicles, air defense) and replaced Russian gas with US LNG in Europe — while the Pacific becomes a semiconductor chessboard.', 'La guerra en Ucrania reactivó la fábrica occidental de armas (munición, blindados, defensa antiaérea) y sustituyó el gas ruso por GNL estadounidense en Europa — mientras el Pacífico se convierte en un tablero de semiconductores.'],
  'Sobreacumulação do complexo belico-industrial encontra campo de realização: reposição intensiva de estoques (155mm, GBAD), reconfiguração energética europeia (LNG US→UE) e guerra tecnológica de export-controls no Pacífico.': ['Overaccumulation in the military-industrial complex finds an outlet: intensive stock replenishment (155mm, GBAD), European energy reconfiguration (US LNG→EU) and an export-control technology war in the Pacific.', 'La sobreacumulación del complejo militar-industrial encuentra salida: reposición intensiva de arsenales (155 mm, GBAD), reconfiguración energética europea (GNL EE. UU.→UE) y guerra tecnológica de controles de exportación en el Pacífico.'],
  'Guerra ao Terror': ['War on Terror', 'Guerra contra el Terror'],
  'Afeganistão e Iraque: mais de US$ 2 trilhões do contribuinte americano viraram contratos de logística, segurança privada e reconstrução — um mercado garantido pelo Estado para empreiteiras.': ['Afghanistan and Iraq: more than US$2 trillion from US taxpayers became logistics, private-security and reconstruction contracts — a state-guaranteed market for contractors.', 'Afganistán e Irak: más de US$2 billones de los contribuyentes estadounidenses se convirtieron en contratos de logística, seguridad privada y reconstrucción — un mercado garantizado por el Estado para contratistas.'],
  'Captura fiscal do Estado pós-11/9: apropriação de renda petrolífera sob tutela militar, privatização da violência (contractors) e circuito dívida→contratos→dividendos sem risco de realização.': ['Post-9/11 fiscal capture of the state: appropriation of oil rents under military control, privatization of violence (contractors) and a debt→contracts→dividends circuit without realization risk.', 'Captura fiscal del Estado tras el 11-S: apropiación de renta petrolera bajo tutela militar, privatización de la violencia (contratistas) y circuito deuda→contratos→dividendos sin riesgo de realización.'],
  'Guerra Fria & Petrodólar': ['Cold War & Petrodollar', 'Guerra Fría y Petrodólar'],
  'Sem o ouro, o dólar se sustenta no petróleo e nos exércitos. Choques do petróleo reciclam petrodólares pelos bancos do Norte — e conflitos regionais dividem zonas de influência.': ['Without gold, the dollar is sustained by oil and armies. Oil shocks recycle petrodollars through Northern banks — and regional conflicts divide spheres of influence.', 'Sin el oro, el dólar se sostiene en el petróleo y los ejércitos. Los choques petroleros reciclan petrodólares a través de los bancos del Norte — y los conflictos regionales dividen zonas de influencia.'],
  'Pós-Bretton Woods: hegemonia monetária ancorada em commodities estratégicas + militarismo. Petrodólares são reciclados como eurocrédito → dívida do Terceiro Mundo (subimperialismo financeiro).': ['Post-Bretton Woods: monetary hegemony anchored in strategic commodities + militarism. Petrodollars are recycled as Eurocredit → Third World debt (financial sub-imperialism).', 'Pos-Bretton Woods: hegemonía monetaria anclada en materias primas estratégicas + militarismo. Los petrodólares se reciclan como eurocrédito → deuda del Tercer Mundo (subimperialismo financiero).'],
  'Segunda Guerra': ['World War II', 'Segunda Guerra Mundial'],
  'A crise de 1929 só foi totalmente superada produzindo destruição em escala industrial. Os EUA saem como "arsenal dos aliados", donos de 2/3 do ouro do mundo — nascem Bretton Woods e o dólar-hegemon.': ['The 1929 crisis was only fully overcome through destruction on an industrial scale. The USA emerged as the "arsenal of the Allies," holding 2/3 of the world’s gold — Bretton Woods and dollar hegemony were born.', 'La crisis de 1929 solo se superó por completo produciendo destrucción a escala industrial. EE. UU. salió como el "arsenal de los Aliados", con 2/3 del oro mundial — nacieron Bretton Woods y la hegemonía del dólar.'],
  'Solução keynesiana-belicosa da sobreacumulação: mobilização total absorve o excedente; Lend-Lease (US$ 50 bi da época) transfere reservas de ouro europeias para Fort Knox, fundando a ordem de 1944.': ['Keynesian-war solution to overaccumulation: total mobilization absorbs the surplus; Lend-Lease (US$50 bn at the time) transfers European gold reserves to Fort Knox, founding the 1944 order.', 'Solución keynesiano-bélica de la sobreacumulación: la movilización total absorbe el excedente; Lend-Lease (US$50 mil M de la época) transfiere reservas europeas de oro a Fort Knox, fundando el orden de 1944.'],
  'Primeira Guerra': ['World War I', 'Primera Guerra Mundial'],
  'Impérios disputam o retalhamento do mundo — mercados, colônias e matérias-primas. A indústria pesada enriquece (Krupp, Vickers), os bancos financiam (J.P. Morgan) e os EUA saem de devedores a credores globais.': ['Empires compete to divide the world — markets, colonies and raw materials. Heavy industry gets richer (Krupp, Vickers), banks finance it (J.P. Morgan), and the USA moves from global debtor to global creditor.', 'Los imperios disputan el reparto del mundo — mercados, colonias y materias primas. La industria pesada se enriquece (Krupp, Vickers), los bancos financian (J.P. Morgan) y EE. UU. pasa de deudor a acreedor global.'],
  'Lenin: fase monopolista → repartição territorial proporcional à força econômica; guerra = continuação da concorrência inter-capitalista por outros meios. Fluxo de ouro → Nova York inverte a hierarquia financeira mundial.': ['Lenin: monopoly phase → territorial division proportional to economic power; war = continuation of inter-capitalist competition by other means. Gold flow → New York reverses the world financial hierarchy.', 'Lenin: fase monopolista → reparto territorial proporcional a la fuerza económica; guerra = continuación de la competencia intercapitalista por otros medios. Flujo de oro → Nueva York invierte la jerarquía financiera mundial.'],

  'Guerra da Ucrânia / Reconfiguração Energética da Europa': ['Ukraine War / Europe’s Energy Reconfiguration', 'Guerra de Ucrania / Reconfiguración Energética de Europa'],
  '2022 – presente': ['2022 – present', '2022 – presente'],
  'Ucrânia': ['Ukraine', 'Ucrania'],
  'A guerra destruiu fábricas, pontes e cidades (capital constante físico) e obrigou a Europa a trocar gás russo por gás americano. Enquanto isso, os exércitos ocidentais queimaram estoques de munição — e precisaram recomprar tudo, com juros de lucro embutidos.': ['The war destroyed factories, bridges and cities (physical constant capital) and forced Europe to replace Russian gas with US gas. Meanwhile, Western armies burned through ammunition stocks — and had to buy them all again, with profit margins built in.', 'La guerra destruyó fábricas, puentes y ciudades (capital constante físico) y obligó a Europa a sustituir el gas ruso por gas estadounidense. Mientras tanto, los ejércitos occidentales agotaron arsenales de munición — y tuvieron que recomprarlo todo, con márgenes de beneficio incluidos.'],
  'Destruição de c + substituição da matriz energética europeia (pipeline→LNG US): dupla valorização — complexo belico-industrial realiza sobreacumulação via reposição (155mm, GBAD) e capital fóssil anglo-americano captura renda energética europeia com prêmio geopolítico.': ['Destruction of c + replacement of Europe’s energy matrix (pipeline→US LNG): dual valorization — the military-industrial complex realizes overaccumulation through replenishment (155mm, GBAD), while Anglo-American fossil capital captures European energy rent with a geopolitical premium.', 'Destrucción de c + sustitución de la matriz energética europea (gasoducto→GNL EE. UU.): doble valorización — el complejo militar-industrial realiza sobreacumulación mediante reposición (155 mm, GBAD) y el capital fósil angloestadounidense captura renta energética europea con prima geopolítica.'],
  'Blindados e munição de artilharia': ['Armored vehicles and artillery ammunition', 'Blindados y munición de artillería'],
  'A ação subiu mais de 250% desde o início da guerra — a fábrica alemã de munição virou queridinha da bolsa.': ['The stock rose more than 250% since the war began — the German ammunition maker became a market favorite.', 'La acción subió más de 250% desde el inicio de la guerra — la fábrica alemana de munición se volvió favorita de la bolsa.'],
  'Realização plena da carteira: pedidos de 155mm/blindados elevam backlog a ≈€55 bi; margens em expansão com capacidade oculta ativada.': ['Full realization of the order book: 155mm/armored-vehicle orders lift backlog to ≈€55 bn; margins expand as idle capacity is activated.', 'Realización plena de la cartera: pedidos de 155 mm/blindados elevan el backlog a ≈€55 mil M; márgenes en expansión al activar capacidad ociosa.'],
  'fev/2022 (=100)': ['Feb/2022 (=100)', 'feb/2022 (=100)'],
  'dez/2025': ['Dec/2025', 'dic/2025'],
  'Os lançadores HIMARS viraram celebridade de guerra; contratos do Pentágono e da OTAN renovados em dezenas de bilhões.': ['HIMARS launchers became wartime celebrities; Pentagon and NATO contracts were renewed for tens of billions.', 'Los lanzadores HIMARS se volvieron celebridades de guerra; contratos del Pentágono y la OTAN se renovaron por decenas de miles de millones.'],
  'Demonstração em campo real = marketing estatal subsidiado; backlog recorde ≈US$176 bi garante fluxo de m por anos.': ['Real-world battlefield demonstration = state-subsidized marketing; record backlog ≈US$176 bn guarantees a flow of m for years.', 'Demostración en combate real = marketing estatal subsidiado; backlog récord ≈US$176 mil M garantiza flujo de m durante años.'],
  'Defesa antiaérea Patriot': ['Patriot air defense', 'Defensa antiaérea Patriot'],
  'Cada míssil interceptador usado precisa ser recomprado — o escudo antiaéreo virou assinatura mensal.': ['Every interceptor missile used has to be bought again — the air-defense shield became a monthly subscription.', 'Cada misil interceptor usado debe recomprarse — el escudo antiaéreo se volvió una suscripción mensual.'],
  'Consumo de interceptores cria demanda recorrente (razão munição/stockpile): conversão do conflito em receita annuity.': ['Interceptor consumption creates recurring demand (ammunition/stockpile ratio): conversion of conflict into annuity revenue.', 'El consumo de interceptores crea demanda recurrente (relación munición/arsenal): conversión del conflicto en ingresos tipo annuity.'],
  'Com o gás russo cortado, a Europa passou a comprar gás navio americano bem mais caro: lucros históricos das petroleiras.': ['With Russian gas cut off, Europe began buying much more expensive US seaborne gas: historic oil-company profits.', 'Con el gas ruso cortado, Europa pasó a comprar gas estadounidense por barco mucho más caro: beneficios históricos de las petroleras.'],
  'Renda de escassez geopolítica: spread TTF-JKM capturado pelas majors + terminais LNG subsididados fiscalmente.': ['Geopolitical scarcity rent: TTF-JKM spread captured by majors + fiscally subsidized LNG terminals.', 'Renta de escasez geopolítica: spread TTF-JKM capturado por las majors + terminales de GNL subsidiadas fiscalmente.'],
  'lucro 2021 (=100)': ['profit 2021 (=100)', 'beneficio 2021 (=100)'],
  'pico 2022': ['2022 peak', 'pico 2022'],
  'Complexo militar estatal': ['State military complex', 'Complejo militar estatal'],
  'Do outro lado da trincheira, a estatal russa também lucra: a economia inteira foi virada para a guerra.': ['On the other side of the trench, the Russian state company also profits: the entire economy was turned toward war.', 'Del otro lado de la trinchera, la empresa estatal rusa también gana: toda la economía fue orientada a la guerra.'],
  'Gasto militar russo a 7,1% do PIB (SIPRI 2024): reconversão produtiva estatal absorve excedente e sustenta demanda agregada bélica.': ['Russian military spending at 7.1% of GDP (SIPRI 2024): state-led productive conversion absorbs surplus and sustains aggregate wartime demand.', 'Gasto militar ruso en 7,1% del PIB (SIPRI 2024): la reconversión productiva estatal absorbe excedente y sostiene la demanda agregada bélica.'],
  'Ajuda militar EUA apropriada': ['US military aid appropriated', 'Ayuda militar de EE. UU. apropiada'],
  '≈ US$ 175 bi': ['≈ US$175 bn', '≈ US$175 mil M'],
  'CRS/Congresso, abr/2024': ['CRS/Congress, Apr/2024', 'CRS/Congreso, abr/2024'],
  'Europa: crescimento gasto militar': ['Europe: military spending growth', 'Europa: crecimiento del gasto militar'],
  '+17% em 2024': ['+17% in 2024', '+17% en 2024'],
  'Meta de projéteis 155mm (UE)': ['155mm shell target (EU)', 'Meta de proyectiles de 155 mm (UE)'],
  '1 milhão/ano': ['1 million/year', '1 millón/año'],
  'EDIS/Comissão Europeia': ['EDIS/European Commission', 'EDIS/Comisión Europea'],

  'Crise dos Semicondutores no Pacífico (bloqueio tecnológico)': ['Pacific Semiconductor Crisis (technology blockade)', 'Crisis de Semiconductores en el Pacífico (bloqueo tecnológico)'],
  'Taiwan/Chips': ['Taiwan/Chips', 'Taiwán/Chips'],
  'Não há tiros (ainda): a guerra aqui é de licenças de exportação. Quem controla as fábricas de chips mais avançados controla o cérebro da economia — e ambos os lados gastam bilhões em armas "por precaução".': ['There are no shots fired (yet): the war here is fought through export licenses. Whoever controls the most advanced chip factories controls the brain of the economy — and both sides spend billions on weapons "just in case."', 'No hay disparos (todavía): aquí la guerra es de licencias de exportación. Quien controla las fábricas de chips más avanzados controla el cerebro de la economía — y ambos lados gastan miles de millones en armas "por precaución".'],
  'Conflito de acumulação por controle do capital constante avançado (foundry <7nm, EUV): export-controls tentam conter k chinês; militarização paralela do Pacífico monetiza dissuasão (contratos US-Japão-Austrália).': ['Accumulation conflict over control of advanced constant capital (foundry <7nm, EUV): export controls try to contain Chinese k; parallel militarization of the Pacific monetizes deterrence (US-Japan-Australia contracts).', 'Conflicto de acumulación por el control del capital constante avanzado (foundry <7 nm, EUV): los controles de exportación intentan contener el k chino; la militarización paralela del Pacífico monetiza la disuasión (contratos EE. UU.-Japón-Australia).'],
  'Foundry dominante': ['Dominant foundry', 'Foundry dominante'],
  '~90% dos chips lógicos de ponta do mundo saem da TSMC — o "escudo de silício" que todos precisam proteger.': ['~90% of the world’s leading-edge logic chips come from TSMC — the "silicon shield" everyone needs to protect.', '~90% de los chips lógicos de vanguardia del mundo salen de TSMC — el "escudo de silicio" que todos necesitan proteger.'],
  'Posição monopolista = renda tecnológica extraordinária; geografia da produção vira arma estratégica.': ['Monopoly position = extraordinary technology rent; production geography becomes a strategic weapon.', 'Posición monopolista = renta tecnológica extraordinaria; la geografía de la producción se vuelve arma estratégica.'],
  'Deterrence no Pacífico': ['Deterrence in the Pacific', 'Disuasión en el Pacífico'],
  'A possibilidade da guerra já vende: mísseis anti-navio, caças e baterias para Japão, Austrália e EUA mesmos.': ['The possibility of war already sells: anti-ship missiles, fighters and batteries for Japan, Australia and the USA itself.', 'La posibilidad de guerra ya vende: misiles antibuque, cazas y baterías para Japón, Australia y los propios EE. UU.'],
  'Valorização da opção bélica: incerteza estrutural sustenta trajetória ascendente de contratos de dissuasão.': ['Valorization of the war option: structural uncertainty sustains a rising path of deterrence contracts.', 'Valorización de la opción bélica: la incertidumbre estructural sostiene una trayectoria ascendente de contratos de disuasión.'],
  'Chips de lógica de ponta feitos pela TSMC': ['Leading-edge logic chips made by TSMC', 'Chips lógicos de vanguardia fabricados por TSMC'],
  '~90% mundial': ['~90% worldwide', '~90% mundial'],
  'NIST/Dept. de Comércio dos EUA, 2024': ['NIST/US Dept. of Commerce, 2024', 'NIST/Depto. de Comercio de EE. UU., 2024'],
  'Export controls EUA→CHN (chips/EUV)': ['US→CHN export controls (chips/EUV)', 'Controles de exportación EE. UU.→CHN (chips/EUV)'],
  'regime desde out/2022': ['regime since Oct/2022', 'régimen desde oct/2022'],

  'Guerra Israel–Palestina / Escalada regional': ['Israel–Palestine War / Regional escalation', 'Guerra Israel–Palestina / Escalada regional'],
  '2023 – presente': ['2023 – present', '2023 – presente'],
  'Bombas fabricadas nos EUA, aviões com peças britânicas e escudos antiaéreos pagos com auxílio americano: o conflito é abastecido em tempo real pela indústria de defesa — e os estoques esvaziados geram novos pedidos.': ['US-made bombs, aircraft with British parts and air-defense shields paid for with US aid: the conflict is supplied in real time by the defense industry — and depleted stocks generate new orders.', 'Bombas fabricadas en EE. UU., aviones con piezas británicas y escudos antiaéreos pagados con ayuda estadounidense: la industria de defensa abastece el conflicto en tiempo real — y los arsenales vaciados generan nuevos pedidos.'],
  'Transferência direta de mais-valia fiscal norte-americana (auxílios legislados) para margens de contratadas; consumo de munição/interceptores reabastece pipeline de ordens domésticas+aliadas.': ['Direct transfer of US fiscal surplus value (legislated aid) into contractor margins; ammunition/interceptor consumption replenishes the pipeline of domestic+allied orders.', 'Transferencia directa de plusvalía fiscal estadounidense (ayudas legisladas) a márgenes de contratistas; el consumo de munición/interceptores repone el pipeline de pedidos domésticos+aliados.'],
  'Lockheed Martin / Boeing (munições)': ['Lockheed Martin / Boeing (ammunition)', 'Lockheed Martin / Boeing (munición)'],
  'Bombas guiadas, caças': ['Guided bombs, fighters', 'Bombas guiadas, cazas'],
  'As bombas usadas em Gaza têm fabricante — e reposição garantida por pacotes aprovados no Congresso.': ['The bombs used in Gaza have a manufacturer — and guaranteed replenishment through packages approved by Congress.', 'Las bombas usadas en Gaza tienen fabricante — y reposición garantizada por paquetes aprobados en el Congreso.'],
  'Cadeia supridora integrada OTAN-Israel: ordens aceleradas de JDAM/Mk-84 pós-out/2023.': ['Integrated NATO-Israel supply chain: accelerated JDAM/Mk-84 orders after Oct/2023.', 'Cadena de suministro integrada OTAN-Israel: pedidos acelerados de JDAM/Mk-84 tras oct/2023.'],
  'Interceptadores Iron Dome/David’s Sling': ['Iron Dome/David’s Sling interceptors', 'Interceptores Iron Dome/David’s Sling'],
  'Cada salva de interceptores consumida é futura fatura para o contribuinte americano.': ['Every interceptor salvo consumed is a future bill for the US taxpayer.', 'Cada salva de interceptores consumida es una factura futura para el contribuyente estadounidense.'],
  'Co-produção/co-financiamento (MOU US$3,8 bi/ano) institucionaliza demanda cativa.': ['Co-production/co-financing (MOU US$3.8 bn/year) institutionalizes captive demand.', 'Coproducción/cofinanciación (MOU US$3,8 mil M/año) institucionaliza demanda cautiva.'],
  'Auxílio militar anual base EUA→Israel': ['Baseline annual US→Israel military aid', 'Ayuda militar anual base EE. UU.→Israel'],
  'US$ 3,8 bi': ['US$3.8 bn', 'US$3,8 mil M'],
  'Pacote suplementar aprovado 2024': ['Supplemental package approved in 2024', 'Paquete suplementario aprobado en 2024'],
  '≈ US$ 26 bi (Israel)': ['≈ US$26 bn (Israel)', '≈ US$26 mil M (Israel)'],
  'Congresso EUA, abr/2024': ['US Congress, Apr/2024', 'Congreso de EE. UU., abr/2024'],

  'Guerra do Afeganistão (EUA/NATO × Talibã)': ['Afghanistan War (USA/NATO × Taliban)', 'Guerra de Afganistán (EE. UU./OTAN × Talibán)'],
  'Afeganistão': ['Afghanistan', 'Afganistán'],
  'Vinte anos de guerra pagos com cartão de crédito público: logística, comida, combustível e segurança tercerizados. Empresas cobravam por cada galão de gasolina atravessando o deserto — e o país terminou de volta nas mãos do Talibã.': ['Twenty years of war paid with the public credit card: outsourced logistics, food, fuel and security. Companies charged for every gallon of gasoline crossing the desert — and the country ended up back in Taliban hands.', 'Veinte años de guerra pagados con tarjeta de crédito pública: logística, comida, combustible y seguridad tercerizados. Las empresas cobraban por cada galón de gasolina que cruzaba el desierto — y el país terminó de nuevo en manos del Talibán.'],
  'Rentabilidade sem risco de realização: LOGCAP e contratos cost-plus transferem tesouro público a empreiteiras; privatização da violência (contractors ≥ tropas regulares em vários anos) externaliza custo político interno.': ['Profitability without realization risk: LOGCAP and cost-plus contracts transfer public treasury to contractors; privatization of violence (contractors ≥ regular troops in several years) externalizes domestic political cost.', 'Rentabilidad sin riesgo de realización: LOGCAP y contratos cost-plus transfieren tesoro público a contratistas; la privatización de la violencia (contratistas ≥ tropas regulares en varios años) externaliza el costo político interno.'],
  'Logística militar': ['Military logistics', 'Logística militar'],
  'Fez a comida, o alojamento e a gasolina das tropas — com lucro embutido em cada prato de arroz.': ['It provided troops’ food, lodging and gasoline — with profit built into every plate of rice.', 'Proveyó comida, alojamiento y gasolina a las tropas — con beneficio incluido en cada plato de arroz.'],
  'Contratos exclusivos sem licitação competitiva: captura direta de renda fiscal via preço administrado.': ['Exclusive contracts without competitive bidding: direct capture of fiscal rent through administered pricing.', 'Contratos exclusivos sin licitación competitiva: captura directa de renta fiscal mediante precio administrado.'],
  'Segurança privada': ['Private security', 'Seguridad privada'],
  'Mercenários corporativos ganharam mais por cabeça que soldados do próprio exército.': ['Corporate mercenaries earned more per person than soldiers in the regular army.', 'Mercenarios corporativos ganaron más por persona que soldados del propio ejército.'],
  'Comodificação da força de trabalho violenta: arbitragem salarial entre soldo público e tarifa privada.': ['Commodification of violent labor power: wage arbitrage between public military pay and private rates.', 'Mercantilización de la fuerza de trabajo violenta: arbitraje salarial entre sueldo público y tarifa privada.'],
  'Custo direto EUA (guerra + reconstrução)': ['Direct US cost (war + reconstruction)', 'Costo directo de EE. UU. (guerra + reconstrucción)'],
  '≈ US$ 2,3 tri': ['≈ US$2.3 tn', '≈ US$2,3 billones'],
  'Custo total projetado (c/ veteranos até 2050)': ['Projected total cost (incl. veterans through 2050)', 'Costo total proyectado (con veteranos hasta 2050)'],
  '≈ US$ 8 tri': ['≈ US$8 tn', '≈ US$8 billones'],

  'Invasão do Iraque e Guerra do Golfo': ['Invasion of Iraq and Gulf War', 'Invasión de Irak y Guerra del Golfo'],
  'Iraque': ['Iraq', 'Irak'],
  'Sob a alegação de armas de destruição em massa, abriram-se o petróleo iraquiano às grandes companhias e um mercado gigante de reconstrução pago pelo próprio país invadido (e pelo invasor).': ['Under the claim of weapons of mass destruction, Iraqi oil was opened to major companies along with a giant reconstruction market paid for by the invaded country itself (and by the invader).', 'Bajo la acusación de armas de destrucción masiva, se abrió el petróleo iraquí a las grandes compañías y un gigantesco mercado de reconstrucción pagado por el propio país invadido (y por el invasor).'],
  'Apropriação de campos petrolíferos sob ocupação + ciclo reconstrução: destruição de c alheio abre demanda de infraestrutura paga por apropriações públicas; petro-renda reprivatizada via PSAs/contratos de serviço.': ['Appropriation of oil fields under occupation + reconstruction cycle: destruction of others’ c opens infrastructure demand paid by public appropriations; oil rent is reprivatized through PSAs/service contracts.', 'Apropiación de campos petroleros bajo ocupación + ciclo de reconstrucción: la destrucción de c ajeno abre demanda de infraestructura pagada por asignaciones públicas; la renta petrolera se reprivatiza mediante PSA/contratos de servicio.'],
  'Reconstrução e poços de petróleo': ['Reconstruction and oil wells', 'Reconstrucción y pozos de petróleo'],
  'Contratos bilionários sem concorrência para apagar incêndios de poços e reconstruir o que as bombas destruíram.': ['Billion-dollar no-bid contracts to extinguish well fires and rebuild what the bombs destroyed.', 'Contratos multimillonarios sin competencia para apagar incendios de pozos y reconstruir lo que destruyeron las bombas.'],
  'Integração vertical conflito→reconstrução: mesma firma destrói (logística) e reconstitui (infra), duplicando captura.': ['Vertical conflict→reconstruction integration: the same firm destroys (logistics) and rebuilds (infrastructure), doubling capture.', 'Integración vertical conflicto→reconstrucción: la misma firma destruye (logística) y reconstruye (infraestructura), duplicando la captura.'],
  'Bechtel / grandes engenharias': ['Bechtel / major engineering firms', 'Bechtel / grandes ingenierías'],
  'Infraestrutura': ['Infrastructure', 'Infraestructura'],
  'Escolas, usinas e portos reconstruídos com dinheiro público americano e iraquiano — margem privada garantida.': ['Schools, power plants and ports rebuilt with US and Iraqi public money — guaranteed private margin.', 'Escuelas, centrales y puertos reconstruidos con dinero público estadounidense e iraquí — margen privado garantizado.'],
  'Keynesianismo de guerra externo: investimento público que vira ativo privado sem risco de mercado.': ['External war Keynesianism: public investment becomes a private asset without market risk.', 'Keynesianismo bélico externo: inversión pública que se convierte en activo privado sin riesgo de mercado.'],
  'Majors petrolíferas': ['Oil majors', 'Grandes petroleras'],
  'Petróleo': ['Oil', 'Petróleo'],
  'As segundas maiores reservas de óleo do mundo voltaram a ficar "abertas para negócios".': ['The world’s second-largest oil reserves became "open for business" again.', 'Las segundas mayores reservas de petróleo del mundo volvieron a quedar "abiertas a los negocios".'],
  'Controle difuso via contratos técnicos-serviço: renda diferencial petrolífera reancorada à órbita dólar.': ['Diffuse control through technical-service contracts: differential oil rent re-anchored to the dollar orbit.', 'Control difuso mediante contratos técnico-servicio: renta diferencial petrolera reanclada a la órbita del dólar.'],
  'Apropriações diretas EUA (Iraque)': ['Direct US appropriations (Iraq)', 'Asignaciones directas de EE. UU. (Irak)'],
  '≈ US$ 1,8–2 tri': ['≈ US$1.8–2 tn', '≈ US$1,8–2 billones'],
  'Contrato RIO Halliburton (sem licitação)': ['Halliburton RIO contract (no bid)', 'Contrato RIO de Halliburton (sin licitación)'],
  'até US$ 7 bi': ['up to US$7 bn', 'hasta US$7 mil M'],

  'Guerra do Golfo (Coalizão × Iraque)': ['Gulf War (Coalition × Iraq)', 'Guerra del Golfo (Coalición × Irak)'],
  'Kuwait/Golfo': ['Kuwait/Gulf', 'Kuwait/Golfo'],
  'A estreia televisionada do complexo militar-industrial: armas caríssimas testadas em combate real (Patriot!, Stealth) — e a conta da coalizão majoritariamente paga pelos aliados ricos do Golfo.': ['The televised debut of the military-industrial complex: very expensive weapons tested in real combat (Patriot!, Stealth) — with most of the coalition’s bill paid by wealthy Gulf allies.', 'El debut televisado del complejo militar-industrial: armas carísimas probadas en combate real (Patriot!, Stealth) — y la factura de la coalición pagada en su mayoría por aliados ricos del Golfo.'],
  'Externalização do custo (financiamento saudita/alemão/japonês ≈ US$ 54 bi dos US$ 61 bi) + vitrine tecnológica: cada conflito valida gerações de sistemas e trava clientes por décadas (ciclo de plataforma).': ['Cost externalization (Saudi/German/Japanese financing ≈ US$54 bn of US$61 bn) + technology showcase: each conflict validates generations of systems and locks customers in for decades (platform cycle).', 'Externalización del costo (financiación saudí/alemana/japonesa ≈ US$54 mil M de US$61 mil M) + vitrina tecnológica: cada conflicto valida generaciones de sistemas y ata clientes durante décadas (ciclo de plataforma).'],
  'Defesa antiaérea': ['Air defense', 'Defensa antiaérea'],
  'Os interceptores Patriot viraram manchete global — e o produto mais desejado do catálogo militar.': ['Patriot interceptors became global headlines — and the most desired product in the military catalog.', 'Los interceptores Patriot se convirtieron en titulares globales — y en el producto más deseado del catálogo militar.'],
  'Marketing bélico gratuito: desempenho percebido (mesmo contestado tecnicamente) converte-se em exportações.': ['Free wartime marketing: perceived performance (even when technically disputed) converts into exports.', 'Marketing bélico gratuito: el rendimiento percibido (aunque sea cuestionado técnicamente) se convierte en exportaciones.'],
  'Blindados': ['Armored vehicles', 'Blindados'],
  'Tanques americanos varreram o deserto na TV ao vivo — o melhor comercial possível.': ['US tanks swept across the desert on live TV — the best possible commercial.', 'Tanques estadounidenses barrieron el desierto en televisión en vivo — el mejor anuncio posible.'],
  'Demonstração de força = barreira competitiva tecnológica; lock-in de frota por 30 anos.': ['Show of force = technological competitive barrier; fleet lock-in for 30 years.', 'Demostración de fuerza = barrera competitiva tecnológica; lock-in de flota durante 30 años.'],
  'Logística': ['Logistics', 'Logística'],
  'Nasceu aqui o modelo: a cozinha, a lavanderia e o combustível do exército terceirizados com lucro.': ['The model was born here: the army’s cooking, laundry and fuel outsourced for profit.', 'Aquí nació el modelo: cocina, lavandería y combustible del ejército tercerizados con beneficio.'],
  'Gênese da terceirização integral de suporte vital: transformação de função estatal em franquia rentável.': ['Genesis of full life-support outsourcing: transformation of a state function into a profitable franchise.', 'Génesis de la tercerización integral del soporte vital: transformación de una función estatal en franquicia rentable.'],
  'Custo operacional da coalizão': ['Coalition operating cost', 'Costo operativo de la coalición'],
  '≈ US$ 61 bi': ['≈ US$61 bn', '≈ US$61 mil M'],
  'Reembolsado por aliados (SAU/KWT/JPN/DEU)': ['Reimbursed by allies (SAU/KWT/JPN/DEU)', 'Reembolsado por aliados (SAU/KWT/JPN/DEU)'],
  '≈ US$ 54 bi': ['≈ US$54 bn', '≈ US$54 mil M'],

  'Choque do Petróleo & Nascimento do Petrodólar': ['Oil Shock & Birth of the Petrodollar', 'Choque del Petróleo y Nacimiento del Petrodólar'],
  'Petrodólar': ['Petrodollar', 'Petrodólar'],
  'Embargo árabe quadruplicou o preço do óleo. O dinheiro dos petróleo-fluxos voltou para os bancos de Nova York e Londres — que emprestaram aos países pobres com juros altos. Nascia a dívida do Terceiro Mundo, toda em dólares.': ['The Arab embargo quadrupled the price of oil. Oil-flow money returned to banks in New York and London — which lent to poorer countries at high interest rates. Third World debt was born, all denominated in dollars.', 'El embargo árabe cuadruplicó el precio del petróleo. El dinero de los flujos petroleros volvió a los bancos de Nueva York y Londres — que prestaron a países pobres con intereses altos. Nacía la deuda del Tercer Mundo, toda en dólares.'],
  'Pós-Nixon shock (1971): âncora monetária reconstruída sobre commodity estratégica + reciclagem de petrodólares (euromarkets) → endividamento periférico dolarizado → disciplinamento via crises de balanço (1982).': ['Post-Nixon shock (1971): monetary anchor rebuilt on a strategic commodity + petrodollar recycling (euromarkets) → dollarized peripheral debt → discipline through balance-of-payments crises (1982).', 'Pos-Nixon shock (1971): ancla monetaria reconstruida sobre una materia prima estratégica + reciclaje de petrodólares (euromercados) → endeudamiento periférico dolarizado → disciplinamiento mediante crisis de balanza de pagos (1982).'],
  'Sete Irmãs (legado) / majors': ['Seven Sisters (legacy) / majors', 'Siete Hermanas (legado) / majors'],
  'Preço quadruplicado, mesma barra de óleo: lucro por barril multiplicado sem furar um metro a mais de terra.': ['Quadrupled price, same barrel of oil: profit per barrel multiplied without drilling an extra meter.', 'Precio cuadruplicado, mismo barril de petróleo: beneficio por barril multiplicado sin perforar un metro más.'],
  'Renda de cartel politicamente sancionada (OPEP conservadora contra URSS) — alinhamento petróleo×dólar.': ['Politically sanctioned cartel rent (conservative OPEC against USSR) — oil×dollar alignment.', 'Renta de cartel sancionada políticamente (OPEP conservadora contra URSS) — alineamiento petróleo×dólar.'],
  'Grandes bancos credores (Citibank, Chase)': ['Major creditor banks (Citibank, Chase)', 'Grandes bancos acreedores (Citibank, Chase)'],
  'Eurodólar / syndicated loans': ['Eurodollar / syndicated loans', 'Eurodólar / préstamos sindicados'],
  'Reciclaram os petrodólares como empréstimos caros para América Latina e África — a conta chegaria em 1982.': ['They recycled petrodollars as expensive loans to Latin America and Africa — the bill would come due in 1982.', 'Reciclaron los petrodólares como préstamos caros para América Latina y África — la factura llegaría en 1982.'],
  'Intermediação do excedente petrolífero em dívida soberana periférica: financeirização da hegemonia monetária.': ['Intermediation of oil surplus into peripheral sovereign debt: financialization of monetary hegemony.', 'Intermediación del excedente petrolero en deuda soberana periférica: financiarización de la hegemonía monetaria.'],
  'Queda do dólar × ouro (Nixon shock)': ['Dollar fall × gold (Nixon shock)', 'Caída del dólar × oro (Nixon shock)'],
  'ago/1971': ['Aug/1971', 'ago/1971'],
  'Óleo (Arabian Light)': ['Oil (Arabian Light)', 'Petróleo (Arabian Light)'],

  'Guerra do Afeganistão (URSS × Mujahideen)': ['Afghanistan War (USSR × Mujahideen)', 'Guerra de Afganistán (URSS × Muyahidines)'],
  'Afeganistão (URSS)': ['Afghanistan (USSR)', 'Afganistán (URSS)'],
  'A versão fria da guerra: os EUA armaram a resistência sem mandar tropas. Foguetes Stinger americanos derrubavam helicópteros soviéticos — uma guerra barata para uns, ruinosa para outros.': ['The cold version of war: the USA armed the resistance without sending troops. US Stinger missiles brought down Soviet helicopters — a cheap war for some, ruinous for others.', 'La versión fría de la guerra: EE. UU. armó a la resistencia sin enviar tropas. Misiles Stinger estadounidenses derribaban helicópteros soviéticos — una guerra barata para unos, ruinosa para otros.'],
  'Guerra por procuração como desgaste do competidor: sangrar acumulação soviética (custo militar distorcivo) com custo marginal ocidental; Stinger como exportação de assimetria tecnológica.': ['Proxy war as competitor attrition: bleed Soviet accumulation (distortive military cost) at marginal Western cost; Stinger as export of technological asymmetry.', 'Guerra por procuración como desgaste del competidor: sangrar la acumulación soviética (costo militar distorsivo) con costo marginal occidental; Stinger como exportación de asimetría tecnológica.'],
  'O míssil de ombro que nivelou o céu — encomendado às centenas pelo Congresso americano.': ['The shoulder-fired missile that leveled the sky — ordered by the hundreds by the US Congress.', 'El misil de hombro que niveló el cielo — encargado por cientos por el Congreso estadounidense.'],
  'Assimetria custo-alvo: US$ 80k neutralizando helicóptero multimilionário = eficiência contábil da contenção.': ['Cost-target asymmetry: US$80k neutralizing a multimillion-dollar helicopter = accounting efficiency of containment.', 'Asimetría costo-objetivo: US$80k neutralizando un helicóptero multimillonario = eficiencia contable de la contención.'],
  'Complexo militar pakistani-saudita (corredor)': ['Pakistani-Saudi military complex (corridor)', 'Complejo militar pakistaní-saudí (corredor)'],
  'Intermediação': ['Intermediation', 'Intermediación'],
  'O dinheiro e as armas passavam por ali — e a região herdaria décadas de milícias armadas.': ['The money and weapons passed through there — and the region would inherit decades of armed militias.', 'El dinero y las armas pasaban por allí — y la región heredaría décadas de milicias armadas.'],
  'Outsourcing geopolítico: delegação operacional com captura de renda intermediária (ISI/logística).': ['Geopolitical outsourcing: operational delegation with capture of intermediary rent (ISI/logistics).', 'Outsourcing geopolítico: delegación operativa con captura de renta intermediaria (ISI/logística).'],
  'Operação Cyclone (apoio EUA)': ['Operation Cyclone (US support)', 'Operación Cyclone (apoyo de EE. UU.)'],
  '≈ US$ 3 bi (decenal)': ['≈ US$3 bn (over a decade)', '≈ US$3 mil M (en una década)'],

  'Segunda Guerra Mundial — a sobreacumulação resolvida a fogo': ['World War II — overaccumulation resolved by fire', 'Segunda Guerra Mundial — la sobreacumulación resuelta a fuego'],
  'WWII Europa': ['WWII Europe', 'Segunda Guerra Mundial · Europa'],
  'Depois de 10 anos de crise e desemprego, a produção de tanques, aviões e navios colocou todo mundo para trabalhar. Quando acabou, a Europa estava em ruínas — e os EUA eram donos de dois terços do OURO do planeta.': ['After 10 years of crisis and unemployment, production of tanks, aircraft and ships put everyone to work. When it ended, Europe was in ruins — and the USA held two-thirds of the planet’s GOLD.', 'Después de 10 años de crisis y desempleo, la producción de tanques, aviones y barcos puso a todos a trabajar. Al terminar, Europa estaba en ruinas — y EE. UU. poseía dos tercios del ORO del planeta.'],
  'Resolução bélica da Grande Depressão: mobilização total elimina excedente de capacidade e força de trabalho ociosa; Lend-Lease drena reservas auríferas europeias → Bretton Woods consagra o dólar (1944) e o ciclo de reconstrução (Marshall ≈ US$13,3 bi) abre novo campo de acumulação.': ['Wartime resolution of the Great Depression: total mobilization eliminates excess capacity and idle labor; Lend-Lease drains European gold reserves → Bretton Woods consecrates the dollar (1944), and the reconstruction cycle (Marshall ≈ US$13.3 bn) opens a new field of accumulation.', 'Resolución bélica de la Gran Depresión: la movilización total elimina capacidad excedente y fuerza de trabajo ociosa; Lend-Lease drena reservas europeas de oro → Bretton Woods consagra el dólar (1944) y el ciclo de reconstrucción (Marshall ≈ US$13,3 mil M) abre un nuevo campo de acumulación.'],
  'Indústria convertida a guerra': ['Industry converted to war', 'Industria reconvertida a la guerra'],
  'Fábricas de carros viraram fábricas de tanques, bombardeiros e caminhões — com lucro garantido pelo Estado.': ['Car factories became tank, bomber and truck factories — with profit guaranteed by the state.', 'Fábricas de autos se convirtieron en fábricas de tanques, bombarderos y camiones — con beneficio garantizado por el Estado.'],
  'Cost-plus contracts eliminam risco de realização: lucratividade estática com volume explosivo (aviões: ~300 mil produzidos).': ['Cost-plus contracts eliminate realization risk: stable profitability with explosive volume (aircraft: ~300,000 produced).', 'Los contratos cost-plus eliminan el riesgo de realización: rentabilidad estable con volumen explosivo (aviones: ~300 mil producidos).'],
  'DuPont / químicas': ['DuPont / chemical companies', 'DuPont / químicas'],
  'Explosivos e materiais': ['Explosives and materials', 'Explosivos y materiales'],
  'Da pólvora ao Projeto Manhattan: a química da guerra pagou dividendos por décadas.': ['From gunpowder to the Manhattan Project: wartime chemistry paid dividends for decades.', 'De la pólvora al Proyecto Manhattan: la química de guerra pagó dividendos durante décadas.'],
  'R&D subsidiado militarmente funda vantagens civis posteriores (plásticos, nylon) — spin-off bélico-produtivo.': ['Military-subsidized R&D creates later civilian advantages (plastics, nylon) — wartime productive spin-off.', 'La I+D subsidiada militarmente crea ventajas civiles posteriores (plásticos, nailon) — spin-off bélico-productivo.'],
  'Boeing / aviation majors': ['Boeing / aviation majors', 'Boeing / grandes aeronáuticas'],
  'Aeronáutica': ['Aerospace', 'Aeronáutica'],
  'Bombardeiros B-17/B-29 de dia, jatos comerciais de noite: a guerra treinou a indústria que dominaria os céus.': ['B-17/B-29 bombers by day, commercial jets by night: the war trained the industry that would dominate the skies.', 'Bombarderos B-17/B-29 de día, reactores comerciales de noche: la guerra entrenó a la industria que dominaría los cielos.'],
  'Aprendizado produtivo bélico transborda à aviação civil — base da hegemonia exportadora americana pós-45.': ['Wartime productive learning spills over into civil aviation — the basis of post-1945 US export hegemony.', 'El aprendizaje productivo bélico se derrama hacia la aviación civil — base de la hegemonía exportadora estadounidense tras 1945.'],
  'PIB dos EUA 1939→1945': ['US GDP 1939→1945', 'PIB de EE. UU. 1939→1945'],
  '≈ dobrou': ['≈ doubled', '≈ se duplicó'],
  '≈ US$ 50 bi (época)': ['≈ US$50 bn (at the time)', '≈ US$50 mil M (de la época)'],
  'Ouro mundial em mãos dos EUA (fins dos 40s)': ['World gold held by the USA (late 1940s)', 'Oro mundial en manos de EE. UU. (fines de los años 40)'],

  'Primeira Guerra Mundial — a partilha imperialista': ['World War I — imperialist partition', 'Primera Guerra Mundial — el reparto imperialista'],
  'Verdun/Frente Ocidental': ['Verdun/Western Front', 'Verdún/Frente Occidental'],
  'Impérios brigando pelo mundo: colônias, mercados e rotas. A indústria pesada faturava (Krupp, Vickers, Schneider), os bancos financiavam tudo (J.P. Morgan), e ~20 milhões de pessoas morreram pelo rateio dos lucros.': ['Empires fighting over the world: colonies, markets and routes. Heavy industry profited (Krupp, Vickers, Schneider), banks financed it all (J.P. Morgan), and ~20 million people died in the division of profits.', 'Imperios peleando por el mundo: colonias, mercados y rutas. La industria pesada ganaba (Krupp, Vickers, Schneider), los bancos financiaban todo (J.P. Morgan) y ~20 millones de personas murieron por el reparto de beneficios.'],
  'Estágio monopolista (Lenin): exportação de capitais exige proteção territorial de mercados; equilíbrio de forças rompe a partilha vigente. Financiamento Morgan converte os EUA de devedor líquido (−US$3,7 bi) a credor líquido (+US$12,5 bi, 1919) — o ouro migra para Nova York e prepara Wall Street.': ['Monopoly stage (Lenin): capital exports require territorial protection of markets; the balance of power breaks the existing partition. Morgan financing turns the USA from a net debtor (−US$3.7 bn) into a net creditor (+US$12.5 bn, 1919) — gold moves to New York and prepares Wall Street.', 'Etapa monopolista (Lenin): la exportación de capitales exige protección territorial de mercados; el equilibrio de fuerzas rompe el reparto vigente. La financiación Morgan convierte a EE. UU. de deudor neto (−US$3,7 mil M) en acreedor neto (+US$12,5 mil M, 1919) — el oro migra a Nueva York y prepara Wall Street.'],
  'Banca de guerra': ['War banking', 'Banca de guerra'],
  'Comprou lã e trigo para os aliados e emprestou o dinheiro para pagarem a si mesmo — comissão nas duas pontas.': ['It bought wool and wheat for the Allies and lent them the money to pay for it — collecting fees on both ends.', 'Compró lana y trigo para los Aliados y les prestó el dinero para pagarlo — comisión en ambos extremos.'],
  'Agency + underwriting: captura dupla (fluxo comercial e juros); consolidação de NY como centro hegemônico.': ['Agency + underwriting: double capture (trade flow and interest); consolidation of NY as a hegemonic center.', 'Agency + underwriting: doble captura (flujo comercial e intereses); consolidación de NY como centro hegemónico.'],
  'Artilharia pesada': ['Heavy artillery', 'Artillería pesada'],
  'Os canhões "Grande Berta" que arrasaram cidades tinham o mesmo sobrenome da dinastia que os faturava.': ['The "Big Bertha" guns that devastated cities bore the same family name as the dynasty profiting from them.', 'Los cañones "Gran Berta" que arrasaron ciudades llevaban el mismo apellido de la dinastía que ganaba con ellos.'],
  'Cartel siderúrgico-militar: lucros extraordinários com demanda inelástica criada pelo Estado.': ['Steel-military cartel: extraordinary profits from inelastic demand created by the state.', 'Cártel siderúrgico-militar: beneficios extraordinarios con demanda inelástica creada por el Estado.'],
  'Couraçados e munição': ['Battleships and ammunition', 'Acorazados y munición'],
  'Navios de guerra vendidos até para adversários antes de 1914 — negócio é negócio.': ['Warships were sold even to adversaries before 1914 — business is business.', 'Buques de guerra vendidos incluso a adversarios antes de 1914 — los negocios son los negocios.'],
  'Merchant of death paradigm: comércio de armas pré-guerra multilateral; base do debate de controle de armamentos (1930s).': ['Merchant of death paradigm: multilateral prewar arms trade; basis of the arms-control debate (1930s).', 'Paradigma del merchant of death: comercio multilateral de armas antes de la guerra; base del debate sobre control de armamentos (años 1930).'],
  'Mortes (militares+civis)': ['Deaths (military+civilian)', 'Muertes (militares+civiles)'],
  '≈ 20 milhões': ['≈ 20 million', '≈ 20 millones'],
  'est. historiográficas': ['historical estimates', 'estimaciones historiográficas'],
  'Posição externa EUA 1914→1919': ['US external position 1914→1919', 'Posición externa de EE. UU. 1914→1919'],
  '−US$3,7 bi → +US$12,5 bi': ['−US$3.7 bn → +US$12.5 bn', '−US$3,7 mil M → +US$12,5 mil M'],
}

/** Seleciona uma tradução sem alterar o dado-base nem duplicar a lógica do i18n global. */
export function warText(lang: Lang, value: string): string {
  const tr = WAR_TRANSLATIONS[value]
  return tr ? pick(lang, value, tr[0], tr[1]) : value
}
