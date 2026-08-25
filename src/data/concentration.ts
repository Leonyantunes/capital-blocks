/**
 * MÓDULO 08 — TRABALHO × CONCENTRAÇÃO
 * Fontes: UBS Global Wealth Report 2024 (bandas, fim-2023),
 * World Inequality Database (Top 1% EUA, série aproximada),
 * Oxfam International (2024), Forbes Billionaires List (2024/25).
 */

/* ── Espelho população × riqueza (adultos mundiais, UBS GWR 2024) ── */
export interface WealthBand {
  banda: string
  adultosPct: number
  riquezaPct: number
  color: string
}

export const WEALTH_BANDS: WealthBand[] = [
  { banda: '> US$ 1 milhão', adultosPct: 1.1, riquezaPct: 43.4, color: '#ba68c8' },
  { banda: 'US$ 100 mil – 1 mi', adultosPct: 8.6, riquezaPct: 23.8, color: '#7986cb' },
  { banda: 'US$ 10 mil – 100 mil', adultosPct: 42.0, riquezaPct: 31.5, color: '#42a5f5' },
  { banda: '< US$ 10 mil', adultosPct: 49.5, riquezaPct: 1.3, color: '#f44336' },
]

/* ── Top 1% EUA: parcela da riqueza nacional (WID.world, aprox.) ── */
export const TOP1_SERIES: { ano: number; pct: number }[] = [
  { ano: 1913, pct: 44 },
  { ano: 1929, pct: 46 },
  { ano: 1939, pct: 34 },
  { ano: 1950, pct: 29 },
  { ano: 1962, pct: 26 },
  { ano: 1975, pct: 22 },
  { ano: 1982, pct: 26 },
  { ano: 1990, pct: 29 },
  { ano: 2000, pct: 32 },
  { ano: 2007, pct: 34 },
  { ano: 2012, pct: 34 },
  { ano: 2019, pct: 35 },
  { ano: 2024, pct: 36 },
]

export const TOP1_ERAS = [
  { from: 1936, to: 1979, label: 'Compressão: imposto progressivo + sindicatos + Estado de bem-estar', color: '#4caf5022' },
  { from: 1980, to: 2024, label: 'Financeirização: Reagan/Thatcher, desregulamentação, enfraquecimento sindical', color: '#f4433618' },
] as const

export const CONCENTRATION_STATS = [
  {
    label: 'Novas riquezas capturadas pelo Top 1% desde 2020',
    value: '~2/3',
    sub: '≈ US$ 42 tri dos US$ 63 tri criados',
    source: 'Oxfam, jan/2024',
    tipDidatico: 'De cada R$3 de riqueza NOVA criada no mundo pós-pandemia, R$2 foram direto para o topo. Não foi “todo mundo ganhar um pouquinho”.',
    tipAvancado: 'Sobreacumulação canalizada ao topo via valorização de ativos (equities/imobiliário) — efeito Cantillon da expansão monetária pós-2020.',
  },
  {
    label: 'Bilionários no planeta',
    value: '≈ 2,8 mil',
    sub: 'patrimônio somado ≈ US$ 14–16 tri',
    source: 'Forbes 2024/25',
    tipDidatico: 'Menos gente do que cabe num bairro grande detém mais riqueza do que a produção anual da Alemanha.',
    tipAvancado: 'Concentração patrimonial como condição do regime: bilionários são vetores de alocação política do excedente (lobby, mídia, filantropia estratégica).',
  },
  {
    label: 'Adultos com < US$ 10 mil',
    value: '2,8 bilhões',
    sub: 'metade da humanidade · 1,3% da riqueza',
    source: 'UBS GWR 2024',
    tipDidatico: 'Metade das pessoas do planeta divide entre si pouco mais de 1% da riqueza mundial. A base da pirâmide segura o sistema sem receber quase nada dele.',
    tipAvancado: 'Exército industrial de reserva globalizado: a compressão permanente da base sustenta margens do centro (TMD aplicada à escala planetária).',
  },
]

/* ── SIGA O SALÁRIO — presets de orçamento doméstico (ilustrativos, BR) ── */
export interface SalaryStream {
  /** chave do nó destino */
  dest: 'renda' | 'corporacoes' | 'bancos' | 'estado'
  rotulo: string
  pct: number
}

export interface SalaryPreset {
  id: string
  label: string
  faixa: string
  streams: SalaryStream[]
}

/** sobra = 100 − Σ streams */
export const SALARY_PRESETS: SalaryPreset[] = [
  {
    id: 'minimo', label: 'Salário mínimo', faixa: '≈ R$ 1.518/mês',
    streams: [
      { dest: 'renda', rotulo: 'Aluguel / moradia', pct: 34 },
      { dest: 'corporacoes', rotulo: 'Comida & básicos', pct: 30 },
      { dest: 'estado', rotulo: 'Impostos embutidos no consumo', pct: 14 },
      { dest: 'bancos', rotulo: 'Juros de dívidas (cartão, crediário)', pct: 12 },
    ],
  },
  {
    id: 'medio', label: 'Salário médio', faixa: '≈ R$ 3.100/mês',
    streams: [
      { dest: 'renda', rotulo: 'Aluguel / financiamento', pct: 32 },
      { dest: 'corporacoes', rotulo: 'Consumo familiar', pct: 27 },
      { dest: 'estado', rotulo: 'Impostos embutidos', pct: 15 },
      { dest: 'bancos', rotulo: 'Juros (cartão, carro, cheque especial)', pct: 14 },
    ],
  },
  {
    id: 'alto', label: 'Classe média alta', faixa: '≈ R$ 8.000/mês',
    streams: [
      { dest: 'renda', rotulo: 'Moradia melhor / condomínio', pct: 26 },
      { dest: 'corporacoes', rotulo: 'Consumo & serviços', pct: 18 },
      { dest: 'estado', rotulo: 'Impostos embutidos', pct: 13 },
      { dest: 'bancos', rotulo: 'Juros & seguros', pct: 11 },
    ],
  },
]

/* ── A ERA DOS BILIONÁRIOS (1987→2025) — Forbes Billionaires List, aprox. ── */
export interface BillionaireEntry {
  nome: string
  pais: string
  /** fortuna, US$ bilhões */
  bi: number
}

export interface BillionaireYear {
  ano: number
  nBilionarios: number
  top: BillionaireEntry[]
}

export const BILLIONAIRES: BillionaireYear[] = [
  { ano: 1987, nBilionarios: 140, top: [
    { nome: 'Yoshiaki Tsutsumi', pais: 'JPN', bi: 20 },
    { nome: 'Taikichiro Mori', pais: 'JPN', bi: 15 },
    { nome: 'Sam Walton', pais: 'EUA', bi: 4.8 },
  ] },
  { ano: 1990, nBilionarios: 269, top: [
    { nome: 'Yoshiaki Tsutsumi', pais: 'JPN', bi: 16 },
    { nome: 'Taikichiro Mori', pais: 'JPN', bi: 12 },
    { nome: 'Sam Walton', pais: 'EUA', bi: 9.5 },
    { nome: 'Bill Gates', pais: 'EUA', bi: 2.5 },
  ] },
  { ano: 1995, nBilionarios: 360, top: [
    { nome: 'Bill Gates', pais: 'EUA', bi: 12.9 },
    { nome: 'Yoshiaki Tsutsumi', pais: 'JPN', bi: 10 },
    { nome: 'Warren Buffett', pais: 'EUA', bi: 8.7 },
  ] },
  { ano: 1999, nBilionarios: 298, top: [
    { nome: 'Bill Gates', pais: 'EUA', bi: 90 },
    { nome: 'Paul Allen', pais: 'EUA', bi: 40 },
    { nome: 'Warren Buffett', pais: 'EUA', bi: 36 },
    { nome: 'Steve Ballmer', pais: 'EUA', bi: 23 },
    { nome: 'Michael Dell', pais: 'EUA', bi: 16.5 },
  ] },
  { ano: 2005, nBilionarios: 691, top: [
    { nome: 'Bill Gates', pais: 'EUA', bi: 46.5 },
    { nome: 'Warren Buffett', pais: 'EUA', bi: 44 },
    { nome: 'Lakshmi Mittal', pais: 'IND', bi: 25 },
    { nome: 'Carlos Slim', pais: 'MEX', bi: 23.8 },
    { nome: 'Larry Ellison', pais: 'EUA', bi: 18.4 },
  ] },
  { ano: 2010, nBilionarios: 1011, top: [
    { nome: 'Carlos Slim', pais: 'MEX', bi: 53.5 },
    { nome: 'Bill Gates', pais: 'EUA', bi: 53 },
    { nome: 'Warren Buffett', pais: 'EUA', bi: 47 },
    { nome: 'Mukesh Ambani', pais: 'IND', bi: 29 },
    { nome: 'Lakshmi Mittal', pais: 'IND', bi: 28.7 },
  ] },
  { ano: 2015, nBilionarios: 1826, top: [
    { nome: 'Bill Gates', pais: 'EUA', bi: 79.2 },
    { nome: 'Carlos Slim', pais: 'MEX', bi: 77.1 },
    { nome: 'Warren Buffett', pais: 'EUA', bi: 72.7 },
    { nome: 'Amancio Ortega', pais: 'ESP', bi: 64.5 },
    { nome: 'Jeff Bezos', pais: 'EUA', bi: 34.8 },
  ] },
  { ano: 2020, nBilionarios: 2095, top: [
    { nome: 'Jeff Bezos', pais: 'EUA', bi: 113 },
    { nome: 'Bill Gates', pais: 'EUA', bi: 98 },
    { nome: 'Bernard Arnault', pais: 'FRA', bi: 76 },
    { nome: 'Warren Buffett', pais: 'EUA', bi: 67.5 },
    { nome: 'Larry Ellison', pais: 'EUA', bi: 59 },
  ] },
  { ano: 2024, nBilionarios: 2781, top: [
    { nome: 'Elon Musk', pais: 'EUA', bi: 244 },
    { nome: 'Jeff Bezos', pais: 'EUA', bi: 197 },
    { nome: 'Mark Zuckerberg', pais: 'EUA', bi: 181 },
    { nome: 'Larry Ellison', pais: 'EUA', bi: 175 },
    { nome: 'Bernard Arnault', pais: 'FRA', bi: 154 },
  ] },
  { ano: 2025, nBilionarios: 3028, top: [
    { nome: 'Elon Musk', pais: 'EUA', bi: 440 },
    { nome: 'Larry Ellison', pais: 'EUA', bi: 250 },
    { nome: 'Mark Zuckerberg', pais: 'EUA', bi: 235 },
    { nome: 'Jeff Bezos', pais: 'EUA', bi: 230 },
    { nome: 'Bernard Arnault', pais: 'FRA', bi: 180 },
  ] },
]

/** PIBs de referência (FMI aprox.) p/ dimensionar a soma das fortunas. */
export const REF_GDPS: { nome: string; tri: number }[] = [
  { nome: 'Alemanha', tri: 4.9 }, { nome: 'Japão', tri: 4.2 }, { nome: 'Reino Unido', tri: 3.6 },
  { nome: 'França', tri: 3.2 }, { nome: 'Itália', tri: 2.5 }, { nome: 'Canadá', tri: 2.3 },
  { nome: 'Brasil', tri: 2.3 }, { nome: 'Rússia', tri: 2.2 }, { nome: 'Coreia do Sul', tri: 1.95 },
  { nome: 'Austrália', tri: 1.9 }, { nome: 'México', tri: 1.9 }, { nome: 'Espanha', tri: 1.6 },
  { nome: 'Indonésia', tri: 1.4 }, { nome: 'Turquia', tri: 1.3 }, { nome: 'Arábia Saudita', tri: 1.1 },
  { nome: 'Suíça', tri: 0.95 },
]
