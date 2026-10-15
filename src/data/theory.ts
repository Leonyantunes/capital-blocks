/**
 * DADOS TEÓRICOS — MMT (moeda×dívida soberana), TMD (dependência) e o
 * comparativo Ortodoxa × Heterodoxa. Base: THEORY.md na raiz.
 */

/* ── MMT · Brasil: soberania MONETÁRIA PARCIAL/INTERMEDIÁRIA ── */
export const MMT_BR = {
  soberania: 'Parcial / Intermediária',
  dividaInternaReaisPct: 95, // ≈95–97% da DPF em moeda própria (Tesouro Nacional)
  estrangeirosPctMax: 10,
  mecanismoImpostos:
    'Anulação de moeda: dão valor à moeda, redistribuem renda e liberam capacidade — não “financiam” tecnicamente o gasto',
  restricaoReal:
    'Capacidade produtiva oculta + gargalo cambial (divisas para importações essenciais) + inflação por conflito distributivo',
  armadilhaRentista:
    'Grande parte da dívida interna é remunerada a Selic (+): juro alto infla o estoque SEM gasto novo — captura estrutural pelo capital portador de juros',
} as const

export const SOVEREIGN_STEPS = [
  {
    t: '1 · O Estado gasta CRIANDO reais',
    didatico: 'Quando o governo paga um hospital ou um aposentado, ele credita reais nas contas dos bancos. O dinheiro não vem "de algum lugar": ele passa a existir naquele momento.',
    avancado: 'Gasto líquido credora contas de reserva no BCB (consolidação Tesouro-BCB): moeda fiduciária é passivo estatal emitido pelo próprio gasto.',
  },
  {
    t: '2 · Impostos ANULAM reais',
    didatico: 'O imposto apaga dinheiro da economia. Para que serve então? Para dar valor ao real (todo mundo precisa dele para pagar o leão), redistribuir e liberar espaço na economia.',
    avancado: 'Débito resgata passivos estatais: tributo cria demanda inelástica pela moeda e libera capacidade real, administrando pressão inflacionária.',
  },
  {
    t: '3 · Títulos = poupança remunerada do privado',
    didatico: 'O "rombo" do governo é exatamente o que sobra guardado no setor privado. A dívida pública em reais é a poupança segura de bancos e fundos — com juros pagos por você.',
    avancado: 'Título público é ativo líquido do setor não-governo: sua emissão satisfaz demanda de ativos seguros; seu serviço canaliza mais-valia socializada aos portadores (ponte p/ Pilar 1).',
  },
] as const

/* ── TMD — canais de vazamento de valor Sul → Norte ── */
export interface TmdChannel {
  tipo: string
  textoDidatico: string
  textoAvancado: string
}

export const TMD_CHANNELS: TmdChannel[] = [
  {
    tipo: 'Troca desigual',
    textoDidatico:
      'O Sul exporta sacas e minério (baratos) e importa máquinas, remédios e software (caríssimos). Cada ano, troca-se mais trabalho do Sul por menos valor do Norte.',
    textoAvancado:
      'Termos de troca historicamente declinantes para primários (Prebisch–Singer): produtividade cresce no centro via salários/valorização técnica, não via preço das commodities — transferência implícita de trabalho incorporado.',
  },
  {
    tipo: 'Superexploração do trabalho (Marini)',
    textoDidatico:
      'Para continuar "competitivo", o Sul paga salário que não cobre a vida inteira do trabalhador e estica a jornada. É isso que barateia a soja e o minério — e engorda o lucro de quem vende lá fora.',
    textoAvancado:
      'Marini: compensação da troca desigual via remuneração da força de trabalho abaixo do valor de reprodução + intensificação/jornada. Ver clocks ILAESE (ex.: Salobo 07h39 não pagas/8h) como mensuração empírica.',
  },
  {
    tipo: 'Vaza de rendas de propriedade + dívida',
    textoDidatico:
      'Lucros de multinacionais voltam para as matrizes nos EUA/Europa, royalties saem do país, e a dívida em dólar cobra seu pedágio anual — divisas que nunca viram escola nem vacina.',
    textoAvancado:
      'Repatriação de lucros/dividendos/royalties (BR: R$195–294 bi/ano) + serviço da dívida externa drenam divisas: o excedente gerado internamente sustenta a acumulação do centro (dos Santos: dependência como reprodução ampliada do subdesenvolvimento).',
  },
]

/* ── Comparativo teórico (card/modal) ── */
export interface TheoryTopic {
  id: string
  titulo: string
  ortodoxa: { tese: string; contra: string }
  heterodoxa: { tese: string; autores: string }
}

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: 'divida',
    titulo: 'Dívida pública',
    ortodoxa: {
      tese:
        '“O Estado deve gastar como uma família: primeiro arrecadar, depois gastar. Dívida alta é fardo para os netos e acima de certo % do PIB vira calote iminente — cortar gastos demonstra responsabilidade.”',
      contra:
        'Premissa contestada: trata o emissor da moeda como usuário dela. Japão (~230–250% do PIB) refuta o “teto”; austeridade encolhe o PIB (denominador) e piora a própria razão.',
    },
    heterodoxa: {
      tese:
        'Emissor soberano paga sempre seus títulos na própria moeda: a dívida é o ativo financeiro líquido do setor privado, e seu limite é inflação/recursos reais — nunca “falta de dinheiro”. Quem detém os títulos (rentistas) captura os juros: leitura marxista do MESMO fato.',
      autores: 'MMT: Mosler, Wray, Kelton · Marx: capital fictício/portador de juros · Kalecki: déficit sustenta lucros',
    },
  },
  {
    id: 'cambio',
    titulo: 'Câmbio do Sul Global',
    ortodoxa: {
      tese:
        '“Câmbio flutuante se ajusta sozinho às forças de mercado e equilibra o comércio; intervenção só gera distorção.”',
      contra:
        'Premissa contestada: fluxos financeiros dominam o comércio — ciclos de juros do centro e fuga de capitais produzem sobrevalorizações/colapsos, nada de “ajuste suave”.',
    },
    heterodoxa: {
      tese:
        'Câmbio periférico é estruturalmente volátil e tende ao rebaixamento: desvalorização barateia exportações E salários (superexploração via câmbio), facilita aquisições estrangeiras e encarece tecnologia — mecanismo de dependência, não acidente.',
      autores: 'Marini (superexploração) · Tavares/Serra (ciclos) · Keynes (controle de capitais)',
    },
  },
  {
    id: 'comercio',
    titulo: 'Comércio exterior',
    ortodoxa: {
      tese:
        '“Livre comércio beneficia todos: cada país explora suas vantagens comparativas e todos ganham.”',
      contra:
        'Premissa contestada: vantagem comparativa é fotografia estática; especialização primária trava trajetória tecnológica e perpetua a hierarquia (evidência: desindustrialização brasileira 27%→11%).',
    },
    heterodoxa: {
      tese:
        'Troca desigual: o intercâmbio Centro–Sul transfere trabalho incorporado do Sul ao Norte; a superexploração local compensa a perda e financia o consumo/financeirização imperialistas.',
      autores: 'Prebisch–Singer · Marini · dos Santos · Emmanuel (troca desigual)',
    },
  },
]

/* ── Comparativo das 4 Escolas Heterodoxas (Marx × Kalecki × MMT × TMD) ── */
export interface SchoolDefinition {
  id: 'marx' | 'kalecki' | 'mmt' | 'tmd'
  nome: string
  enfase: string
  categoriaChave: string
  equacaoChave: string
  teseCentral: [pt: string, en: string, es: string]
  papelDoEstado: [pt: string, en: string, es: string]
  visaoDaMoeda: [pt: string, en: string, es: string]
  pontoForte: [pt: string, en: string, es: string]
}

export const HETERODOX_SCHOOLS: SchoolDefinition[] = [
  {
    id: 'marx',
    nome: 'Karl Marx (Crítica da Economia Política)',
    enfase: 'Produção, Exploração e Leis de Movimento',
    categoriaChave: 'Mais-Valia (m), Composição Orgânica (c/v), Capital Fictício',
    equacaoChave: 'W = c + v + m; \\quad g = \\frac{m}{c + v} = \\frac{e}{k + 1}',
    teseCentral: [
      'Todo o valor novo tem origem exclusiva no trabalho vivo socialmente necessário. O lucro é a apropriação privada do trabalho não pago (mais-valia). A substituição técnica de homens por máquinas eleva a composição orgânica e gera a tendência decrescente da taxa de lucro.',
      'All new value originates exclusively from socially necessary living labor. Profit is the private appropriation of unpaid surplus-labor. Automation raises the organic composition of capital and drives the tendency of the rate of profit to fall.',
      'Todo el valor nuevo tiene origen exclusivo en el trabajo vivo. La ganancia es la apropiación privada del trabajo no remunerado (plusvalía). La tecnificación eleva la composición orgánica y provoca la tendencia decreciente de la tasa de ganancia.',
    ],
    papelDoEstado: [
      'Garante coercitivo da propriedade privada e das condições gerais de acumulação; atua como comitê gestor dos negócios comuns da burguesia e mediador de crises.',
      'Coercive guarantor of private property and general conditions of accumulation; executive committee managing the common affairs of the bourgeoisie.',
      'Garante coercitivo de la propiedad privada y de las condiciones generales de acumulación; gestiona los intereses comunes de la clase dominante.',
    ],
    visaoDaMoeda: [
      'Equivalente geral mercadoria que expressa o tempo de trabalho social; sob o crédito moderno, desdobra-se em capital fictício portador de juros.',
      'General commodity equivalent expressing social labor-time; under modern credit, expands into interest-bearing fictitious capital.',
      'Equivalente general que expresa el tiempo de trabajo social; bajo el crédito moderno, se expande como capital ficticio con interés.',
    ],
    pontoForte: [
      'Explica a origem do lucro no chão de fábrica e a contradição insolúvel entre capital e trabalho.',
      'Explains the origin of profit in production and the structural contradiction between capital and labor.',
      'Explica el origen de la ganancia en la producción y la contradicción entre capital y trabajo.',
    ],
  },
  {
    id: 'kalecki',
    nome: 'Michał Kalecki (Macroeconomia Pós-Keynesiana)',
    enfase: 'Demanda Efetiva, Realização e Monopólio',
    categoriaChave: 'Grau de Monopólio, Balanço de Lucros, Distribuição',
    equacaoChave: 'P = I + C_k + (G - T) + (X - M)',
    teseCentral: [
      'Os trabalhadores gastam o que ganham; os capitalistas ganham o que gastam. O lucro total da classe capitalista depende do seu próprio investimento, do consumo luxuoso e dos déficits do governo que sustentam a demanda agregada.',
      'Workers spend what they earn; capitalists earn what they spend. Total capitalist profits are determined by their own investment, luxury consumption, and government deficits sustaining aggregate demand.',
      'Los trabajadores gastan lo que ganan; los capitalistas ganan lo que gastan. Las ganancias agregadas dependen de la inversión, consumo capitalista y déficits públicos.',
    ],
    papelDoEstado: [
      'O déficit público é indispensável para evitar depressões e sustentar lucros corporativos, mas o pleno emprego gera resistência patronal (Kalecki, 1943).',
      'Fiscal deficits are indispensable to prevent depressions and sustain profits, yet full employment sparks political opposition from business elites (Kalecki, 1943).',
      'El déficit público es indispensable para evitar depresiones, pero el pleno empleo permanente genera resistencia política de las élites empresariales.',
    ],
    visaoDaMoeda: [
      'Moeda endógena: nasce da concessão de crédito pelo sistema bancário para financiar a produção e o investimento antes da poupança.',
      'Endogenous money: created by commercial bank credit to finance production and investment prior to saving.',
      'Moneda endógena: nace de la concesión de crédito bancario para financiar producción e inversión antes del ahorro.',
    ],
    pontoForte: [
      'Conecta a contabilidade macroeconômica dos lucros agregados à luta de classes pelo salário real.',
      'Connects aggregate macroeconomic profit accounting to class struggle over real wages.',
      'Conecta la contabilidad macroeconómica de los beneficios a la lucha distributiva por el salario.',
    ],
  },
  {
    id: 'mmt',
    nome: 'MMT (Teoria Monetária Moderna)',
    enfase: 'Soberania Monetária e Espaço Fiscal',
    categoriaChave: 'Moeda Soberana, Finanças Funcionais, Balanços Setoriais',
    equacaoChave: '(S - I) \\equiv (G - T) + (X - M)',
    teseCentral: [
      'O governo soberano é o monopolista da sua própria moeda fiduciária. Ele nunca fica sem dinheiro e não precisa de impostos para se financiar: ele gasta criando moeda e recolhe impostos para ancorar o valor do dinheiro e liberar recursos reais.',
      'A sovereign government monopolizes its own fiat currency. It cannot involuntarily go bankrupt in its own unit of account and taxes serve to anchor currency demand and regulate inflation.',
      'El gobierno soberano monopoliza su propia moneda fiduciaria. Nunca puede quebrar en su propia unidad y los impuestos sirven para regular la demanda y la inflación.',
    ],
    papelDoEstado: [
      'Emissor soberano com capacidade ilimitada de gastos nominais até o limite inflacionário dos recursos reais disponíveis (Job Guarantee permanente).',
      'Sovereign issuer with unconstrained nominal spending capacity up to the real resource inflation barrier (permanent Job Guarantee).',
      'Emisor soberano con capacidad ilimitada de gasto nominal hasta el límite inflacionario de los recursos reales.',
    ],
    visaoDaMoeda: [
      'Criatura da lei e passivo estatal (Chartalismo): o dinheiro circula porque o Estado exige seu pagamento para extinção de dívidas tributárias.',
      'Creature of the state (Chartalism): money circulates because the sovereign demands it for tax obligations.',
      'Criatura del Estado (Cartalismo): el dinero circula porque el Estado lo exige para cancelar obligaciones tributarias.',
    ],
    pontoForte: [
      'Desmistifica o mito da austeridade fiscal e da analogia entre o orçamento do Estado e o orçamento de uma dona de casa.',
      'Demystifies austerity myths and the false analogy between sovereign state budgets and household finances.',
      'Desmitifica la austeridad fiscal y la falsa analogía entre el presupuesto estatal y el de una familia.',
    ],
  },
  {
    id: 'tmd',
    nome: 'TMD (Teoria Marxista da Dependência)',
    enfase: 'Imperialismo, Troca Desigual e Superexploração',
    categoriaChave: 'Superexploração, Troca Desigual, Ciclo do Capital Dependente',
    equacaoChave: '\\text{Remessas} + \\text{Troca Desigual} + \\text{Juros} \\implies \\text{Compensação via } v < \\text{Valor}',
    teseCentral: [
      'O subdesenvolvimento não é uma etapa prévia, mas a consequência estrutural do desenvolvimento do centro. A periferia sofre transferência líquida de valor (troca desigual e dreno financeiro), compensando a perda com a superexploração do trabalho local.',
      'Underdevelopment is not a backward pre-stage, but the structural consequence of core capitalist development. The periphery suffers net value drainage, compensated through super-exploitation of local labor.',
      'El subdesarrollo no es una etapa previa, sino la consecuencia del desarrollo del centro. La periferia transfiere valor al centro y lo compensa superexplotando el trabajo.',
    ],
    papelDoEstado: [
      'Estado dependente com dupla submissão: repressor da classe trabalhadora interna para garantir taxas de exploração extremas e subordinado geopoliticamente ao imperialismo.',
      'Dependent state with dual submission: repressing domestic labor to ensure high exploitation rates while subordinated geopolitically to imperialist powers.',
      'Estado dependiente: reprime a la clase trabajadora interna para garantizar altas tasas de ganancia y se subordina al imperialismo.',
    ],
    visaoDaMoeda: [
      'Hierarquia monetária internacional: moedas periféricas são subordinadas ao dólar, sofrem fuga de capitais crônica e impõem restrição externa à autonomia nacional.',
      'International currency hierarchy: peripheral monies are subordinated to the dollar, facing structural capital flight and balance-of-payments constraints.',
      'Jerarquía monetaria internacional: las monedas periféricas están subordinadas al dólar, sufriendo fuga de capitales y restricción externa.',
    ],
    pontoForte: [
      'Articula o Livro I e III de O Capital à realidade concreta da América Latina e do Sul Global contemporâneo.',
      'Connects Marx’s Capital to the historical reality of Latin America and the contemporary Global South.',
      'Conecta El Capital de Marx a la realidad concreta de América Latina y del Sur Global contemporáneo.',
    ],
  },
]

