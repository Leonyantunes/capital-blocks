/**
 * MÓDULO 05 — Morte e Ressurreição do Capital (dívida pública / capital fictício)
 * Dados orçamentários aproximados (Orçamento da União, valores didáticos).
 */

export interface BudgetItem {
  key: string
  label: string
  labelEn: string
  labelEs: string
  pct: number
  color: string
  desc: string
  descEn: string
  descEs: string
}

export const BUDGET_BR: BudgetItem[] = [
  {
    key: 'divida', label: 'Juros + amortizações da dívida pública', labelEn: 'Interest + public debt amortization', labelEs: 'Intereses + amortizaciones de la deuda pública', pct: 50, color: '#9c27b0',
    desc: 'Cerca de metade do orçamento devora o pagamento ao capital portador de juros.',
    descEn: 'About half of the budget is absorbed by payments to interest-bearing capital.',
    descEs: 'Cerca de la mitad del presupuesto es absorbida por pagos al capital que devenga intereses.',
  },
  {
    key: 'social', label: 'Transferências e assistência social', labelEn: 'Transfers and social assistance', labelEs: 'Transferencias y asistencia social', pct: 15, color: '#ffc107',
    desc: 'Previdência e assistência em sentido amplo — aposentadorias, Bolsa Família, seguro-desemprego: o Estado amortecendo o mercado de trabalho.',
    descEn: 'Social security and assistance broadly defined — pensions, Bolsa Família and unemployment insurance: the state cushioning the labor market.',
    descEs: 'Previsión y asistencia en sentido amplio — pensiones, Bolsa Família y seguro de desempleo: el Estado amortiguando el mercado laboral.',
  },
  {
    key: 'saude', label: 'Saúde (SUS)', labelEn: 'Health (SUS)', labelEs: 'Salud (SUS)', pct: 11.5, color: '#f44336',
    desc: 'Vínculo constitucional — pressionado a cada ciclo de aperto fiscal.',
    descEn: 'Constitutionally mandated — pressured in every cycle of fiscal tightening.',
    descEs: 'Vinculación constitucional — presionada en cada ciclo de ajuste fiscal.',
  },
  {
    key: 'educacao', label: 'Educação', labelEn: 'Education', labelEs: 'Educación', pct: 6.5, color: '#2196f3',
    desc: 'Da creche à pós-graduação; gasta menos que o pago de juros.',
    descEn: 'From preschool to graduate education; it receives less than interest payments.',
    descEs: 'Desde preescolar hasta posgrado; recibe menos que lo pagado en intereses.',
  },
  {
    key: 'infra', label: 'Infraestrutura e investimento', labelEn: 'Infrastructure and investment', labelEs: 'Infraestructura e inversión', pct: 2, color: '#4caf50',
    desc: 'Condições gerais de produção: o Estado como empreendedor mínimo.',
    descEn: 'General conditions of production: the state as a minimal entrepreneur.',
    descEs: 'Condiciones generales de producción: el Estado como emprendedor mínimo.',
  },
  {
    key: 'outros', label: 'Demais pastas e poderes', labelEn: 'Other ministries and branches', labelEs: 'Otros ministerios y poderes', pct: 15, color: '#6b7280',
    desc: 'Segurança, defesa, judiciário, gestão administrativa.',
    descEn: 'Security, defense, judiciary and administrative management.',
    descEs: 'Seguridad, defensa, poder judicial y gestión administrativa.',
  },
]

export interface FlowStep {
  n: number
  title: string
  titleEn: string
  titleEs: string
  didatico: string
  didaticoEn: string
  didaticoEs: string
  avancado: string
  avancadoEn: string
  avancadoEs: string
  accent: string
}

export const DEATH_STEPS: FlowStep[] = [
  {
    n: 1, title: 'A morte do capital', titleEn: 'The death of capital', titleEs: 'La muerte del capital', accent: '#f44336',
    didatico: 'Na crise, as fábricas param: não há lucro suficiente para valer a pena investir. O dinheiro fica parado, "morto".',
    didaticoEn: 'In a crisis, factories stop: profit is too low to make investment worthwhile. Money sits idle, "dead".',
    didaticoEs: 'En una crisis, las fábricas se detienen: el beneficio es demasiado bajo para justificar la inversión. El dinero queda ocioso, "muerto".',
    avancado: 'Sobreacumulação: a massa de capitais não encontra campo de investimento rentável (g′ < g esperado). O dinheiro-capital estagna na forma de reserva ociosa.',
    avancadoEn: 'Overaccumulation: the mass of capital cannot find a sufficiently profitable field of investment (g′ < expected g). Money-capital stagnates as an idle reserve.',
    avancadoEs: 'Sobreacumulación: la masa de capital no encuentra un campo de inversión suficientemente rentable (g′ < g esperada). El capital-dinero se estanca como reserva ociosa.',
  },
  {
    n: 2, title: 'O Estado vende papéis', titleEn: 'The state sells bonds', titleEs: 'El Estado vende títulos', accent: '#9c27b0',
    didatico: 'O governo oferece títulos públicos: "empreste seu dinheiro parado a mim que eu pago juros". O capital sobrante encontra refúgio.',
    didaticoEn: 'The government offers public bonds: "lend me your idle money and I will pay interest." Surplus capital finds a refuge.',
    didaticoEs: 'El gobierno ofrece títulos públicos: "préstame tu dinero ocioso y pagaré intereses". El capital excedente encuentra refugio.',
    avancado: 'O Tesouro emite dívida e absorve o capital excedente via título público — promessa de rendimento futura, sem contrapartida produtiva imediata.',
    avancadoEn: 'The Treasury issues debt and absorbs surplus capital through public bonds — a promise of future income without an immediate productive counterpart.',
    avancadoEs: 'El Tesoro emite deuda y absorbe capital excedente mediante títulos públicos — una promesa de renta futura sin contrapartida productiva inmediata.',
  },
  {
    n: 3, title: 'Impostos sobre o trabalho', titleEn: 'Taxes on labor', titleEs: 'Impuestos sobre el trabajo', accent: '#ffc107',
    didatico: 'De onde vem o dinheiro dos juros? Dos impostos que incidem sobre consumo e salários — ou seja, sobre quem trabalha.',
    didaticoEn: 'Where does the money for interest come from? From taxes on consumption and wages — that is, from workers.',
    didaticoEs: '¿De dónde sale el dinero de los intereses? De impuestos sobre el consumo y los salarios — es decir, de quienes trabajan.',
    avancado: 'Arrecadação regressiva (sobre consumo/trabalho) financa o serviço da dívida: transferência de valor do trabalho vivo para o capital portador de juros.',
    avancadoEn: 'Regressive taxation (on consumption/labor) finances debt service: a transfer of value from living labor to interest-bearing capital.',
    avancadoEs: 'La recaudación regresiva (sobre consumo/trabajo) financia el servicio de la deuda: transferencia de valor del trabajo vivo al capital que devenga intereses.',
  },
  {
    n: 4, title: 'Os bancos ressuscitam', titleEn: 'The banks rise again', titleEs: 'Los bancos resucitan', accent: '#4caf50',
    didatico: 'Bancos e fundos recebem juros certinhos todo mês. O dinheiro que estava "morto" volta a render — sem produzir nada novo.',
    didaticoEn: 'Banks and funds receive regular interest payments every month. Money that was "dead" starts yielding again — without producing anything new.',
    didaticoEs: 'Bancos y fondos reciben intereses regulares cada mes. El dinero que estaba "muerto" vuelve a rendir — sin producir nada nuevo.',
    avancado: 'O fluxo regular de juros capitaliza-se num preço do título (capitalização da renda): nasce capital fictício — direito descontado sobre mais-valia futura.',
    avancadoEn: 'The regular interest flow is capitalized into the bond price: fictitious capital emerges — a discounted claim on future surplus value.',
    avancadoEs: 'El flujo regular de intereses se capitaliza en el precio del título: nace capital ficticio — un derecho descontado sobre plusvalía futura.',
  },
  {
    n: 5, title: 'O ciclo se fecha', titleEn: 'The cycle closes', titleEs: 'El ciclo se cierra', accent: '#ba68c8',
    didatico: 'Resultado: metade do orçamento vai para a dívida, sobra pouco para saúde, educação e infraestrutura — até a próxima crise repetir tudo.',
    didaticoEn: 'Result: half the budget goes to debt, leaving little for health, education and infrastructure — until the next crisis repeats the cycle.',
    didaticoEs: 'Resultado: la mitad del presupuesto va a la deuda, queda poco para salud, educación e infraestructura — hasta que la próxima crisis repita el ciclo.',
    avancado: 'Reprodução ampliada do circuito M—M′ estatal-dependente: a austeridade torna-se condição permanente de solvência percebida pelo rentista.',
    avancadoEn: 'Expanded reproduction of the state-dependent M—M′ circuit: austerity becomes a permanent condition of solvency as perceived by rentiers.',
    avancadoEs: 'Reproducción ampliada del circuito M—M′ dependiente del Estado: la austeridad se vuelve condición permanente de solvencia percibida por los rentistas.',
  },
]
