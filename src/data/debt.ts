/**
 * MÓDULO 05 — Morte e Ressurreição do Capital (dívida pública / capital fictício)
 * Dados orçamentários aproximados (Orçamento da União, valores didáticos).
 */

export interface BudgetItem {
  key: string
  label: string
  pct: number
  color: string
  desc: string
}

export const BUDGET_BR: BudgetItem[] = [
  {
    key: 'divida', label: 'Juros + amortizações da dívida pública', pct: 50, color: '#9c27b0',
    desc: 'Cerca de metade do orçamento devora o pagamento ao capital portador de juros.',
  },
  {
    key: 'social', label: 'Transferências e assistência social', pct: 15, color: '#ffc107',
    desc: 'Bolsa Família, BNDES? Não: benefícios previdenciários e sociais em sentido amplo.',
  },
  {
    key: 'saude', label: 'Saúde (SUS)', pct: 11.5, color: '#f44336',
    desc: 'Vínculo constitucional — pressionado a cada ciclo de aperto fiscal.',
  },
  {
    key: 'educacao', label: 'Educação', pct: 6.5, color: '#2196f3',
    desc: 'Da creche à pós-graduação; gasta menos que o pago de juros.',
  },
  {
    key: 'infra', label: 'Infraestrutura e investimento', pct: 2, color: '#4caf50',
    desc: 'Condições gerais de produção: o Estado como empreendedor mínimo.',
  },
  {
    key: 'outros', label: 'Demais pastas e poderes', pct: 15, color: '#6b7280',
    desc: 'Segurança, defesa, judiciário, gestão administrativa.',
  },
]

export interface FlowStep {
  n: number
  title: string
  didatico: string
  avancado: string
  accent: string
}

export const DEATH_STEPS: FlowStep[] = [
  {
    n: 1, title: 'A morte do capital', accent: '#f44336',
    didatico: 'Na crise, as fábricas param: não há lucro suficiente para valer a pena investir. O dinheiro fica parado, "morto".',
    avancado: 'Sobreacumulação: a massa de capitais não encontra campo de investimento rentável (g′ < g esperado). O dinheiro-capital estagna na forma de reserva ociosa.',
  },
  {
    n: 2, title: 'O Estado vende papéis', accent: '#9c27b0',
    didatico: 'O governo oferece títulos públicos: "empreste seu dinheiro parado a mim que eu pago juros". O capital sobrante encontra refúgio.',
    avancado: 'O Tesouro emite dívida e absorve o capital excedente via título público — promessa de rendimento futura, sem contrapartida produtiva imediata.',
  },
  {
    n: 3, title: 'Impostos sobre o trabalho', accent: '#ffc107',
    didatico: 'De onde vem o dinheiro dos juros? Dos impostos que incidem sobre consumo e salários — ou seja, sobre quem trabalha.',
    avancado: 'Arrecadação regressiva (sobre consumo/trabalho) financa o serviço da dívida: transferência de valor do trabalho vivo para o capital portador de juros.',
  },
  {
    n: 4, title: 'Os bancos ressuscitam', accent: '#4caf50',
    didatico: 'Bancos e fundos recebem juros certinhos todo mês. O dinheiro que estava "morto" volta a render — sem produzir nada novo.',
    avancado: 'O fluxo regular de juros capitaliza-se num preço do título (capitalização da renda): nasce capital fictício — direito descontado sobre mais-valia futura.',
  },
  {
    n: 5, title: 'O ciclo se fecha', accent: '#ba68c8',
    didatico: 'Resultado: metade do orçamento vai para a dívida, sobra pouco para saúde, educação e infraestrutura — até a próxima crise repetir tudo.',
    avancado: 'Reprodução ampliada do circuito M—M′ estatal-dependente: a austeridade torna-se condição permanente de solvência percebida pelo rentista.',
  },
]
