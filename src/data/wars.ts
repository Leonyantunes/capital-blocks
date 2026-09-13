/**
 * MÓDULO 03 — GUERRA DE CAPITAIS & CONFLITOS IMPERIALISTAS
 * Épocas (2026→1914), conflitos geolocalizados, complexo militar-industrial,
 * quem lucra e a cadeia Estado→contrato→acionista. Fontes: SIPRI, Costs of War
 * (Brown Univ.), CRS/Congresso EUA, relatórios anuais das contratadas.
 */

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
