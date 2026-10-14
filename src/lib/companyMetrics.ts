/**
 * MOTOR ANALÍTICO — decomposição do valor anual das empresas na trinômia marxista
 * W = c + v + m  (aproximação contábil documentada em DATA-GUIDELINES.md §9)
 *
 *   v  ≈ folha estimada        = funcionários × remuneração média anual
 *   m  ≈ lucro líquido         (massa de mais-valia apropriada como lucro;
 *                               juros/impostos ficam no resíduo — nota §9)
 *   c  = receita − v − m       (consumo intermediário + depreciação transferidos)
 *   e  = m/v                   → horas não pagas = 8·e/(e+1)
 */

export interface ValueDecomposition {
  /** folha de salários anual, bi (moeda local) */
  v: number
  /** lucro líquido (mais-valia apropriada), bi */
  m: number
  /** consumo intermediário + depreciação, bi */
  c: number
  /** taxa de exploração m/v (%), pode ser ∞ se v≈0 */
  e: number
  /** minutos não pagos numa jornada de 8h */
  minutesUnpaid: number
}

export function minutesFromE(ePercent: number): number {
  return Number.isFinite(ePercent) ? (480 * (ePercent / 100)) / (1 + ePercent / 100) : 480
}

/** Decomposição a partir das partes já conhecidas (usado por registros de API). */
export function decomposeFromParts(receitaBi: number | undefined, vBi: number, mBi: number): ValueDecomposition {
  const m = Math.max(mBi, 0)
  const v = Math.max(vBi, 0)
  const c = Math.max((receitaBi ?? v + m) - v - m, 0)
  const e = v > 0 ? (m / v) * 100 : Infinity
  return { v, m, c, e, minutesUnpaid: minutesFromE(e) }
}

export function decomposeValue(
  receitaBi: number,
  funcionariosMil: number,
  lucroBi: number,
  salarioMedioK: number,
): ValueDecomposition {
  const v = (funcionariosMil * 1000 * salarioMedioK * 1000) / 1e9 // bi (moeda local)
  return decomposeFromParts(receitaBi, v, lucroBi)
}

/* ═══════════════════ ESTIMATIVAS SETORIAIS (registros dinâmicos/API) ════════
   Quando a API não fornece demonstrações completas, estimamos:
   • margem líquida típica do setor → receita ≈ lucro / margem
   • parcela da receita que vira folha → v ≈ receita × shareFolha
   Valores de referência macro (OCDE/BLS/relatórios setoriais) — flag estimate.
   Chaves normalizadas em minúsculas; `match` faz busca por substring.        */

export interface SectorEstimate {
  /** margem líquida típica (lucro/receita) */
  margem: number
  /** parcela da receita destinada à folha de salários */
  folha: number
}

const SECTOR_TABLE: [string, SectorEstimate][] = [
  ['banc', { margem: 0.28, folha: 0.22 }],
  ['seguro', { margem: 0.1, folha: 0.18 }],
  ['softw', { margem: 0.2, folha: 0.26 }],
  ['semicondutor', { margem: 0.25, folha: 0.12 }],
  ['tecnolog', { margem: 0.18, folha: 0.24 }],
  ['informát', { margem: 0.15, folha: 0.24 }],
  ['plataforma', { margem: 0.15, folha: 0.2 }],
  ['internet', { margem: 0.15, folha: 0.2 }],
  ['varejo', { margem: 0.04, folha: 0.13 }],
  ['consum', { margem: 0.11, folha: 0.14 }],
  ['aliment', { margem: 0.09, folha: 0.12 }],
  ['bebida', { margem: 0.16, folha: 0.08 }],
  ['farmac', { margem: 0.15, folha: 0.16 }],
  ['saúde', { margem: 0.04, folha: 0.16 }],
  ['petróleo', { margem: 0.09, folha: 0.05 }],
  ['energia', { margem: 0.12, folha: 0.07 }],
  ['minera', { margem: 0.16, folha: 0.11 }],
  ['siderurg', { margem: 0.05, folha: 0.14 }],
  ['metalurg', { margem: 0.05, folha: 0.14 }],
  ['automotiv', { margem: 0.06, folha: 0.1 }],
  ['autoind', { margem: 0.06, folha: 0.1 }],
  ['aeroespac', { margem: 0.06, folha: 0.17 }],
  ['defesa', { margem: 0.08, folha: 0.19 }],
  /* 'aeroind' e 'locaç' entram ANTES de 'indústri'/'transport': a varredura é
   * sequencial e a primeira substring que casa vence — sem isso, Aeroindústria
   * casaria 'indústri' e Locação casaria 'transport'. Valores medidos nos
   * registros do próprio dataset (margem = lucro/receita, folha = v/receita). */
  ['aeroind', { margem: 0.08, folha: 0.12 }], // Embraer FY2024 (dataset BR)
  ['locaç', { margem: 0.07, folha: 0.03 }], // Localiza FY2024: locação tem folha mínima
  ['infraestrutura de mercado', { margem: 0.36, folha: 0.05 }], // B3: aluguel da infraestrutura
  ['bens de capital', { margem: 0.13, folha: 0.1 }], // WEG FY2024 (dataset BR)
  ['indústri', { margem: 0.09, folha: 0.16 }],
  ['telecom', { margem: 0.12, folha: 0.09 }],
  ['elétric', { margem: 0.14, folha: 0.06 }],
  ['transport', { margem: 0.07, folha: 0.28 }],
  ['logíst', { margem: 0.07, folha: 0.28 }],
  ['luxo', { margem: 0.15, folha: 0.17 }],
  ['tabaco', { margem: 0.25, folha: 0.05 }],
  ['cosmét', { margem: 0.12, folha: 0.14 }],
  ['celulose', { margem: 0.14, folha: 0.1 }],
  ['papel', { margem: 0.14, folha: 0.1 }],
  ['constru', { margem: 0.06, folha: 0.18 }],
  ['imobiliár', { margem: 0.25, folha: 0.1 }],
  /* Setores do universo de API + ampliação 2026-09. Chaves específicas antes
   * das genéricas; 'agro' entra NO FIM de propósito — 'Farmacêutica /
   * Agroquímica' (Bayer) tem que casar 'farmac' (antes na tabela), não 'agro'. */
  ['rede de cartões', { margem: 0.5, folha: 0.15 }], // Visa/MC: aluguel da rede
  ['folha de pagamento', { margem: 0.24, folha: 0.25 }], // ADP-like: serviços de folha
  ['gestora', { margem: 0.3, folha: 0.24 }], // asset managers (BlackRock)
  ['private', { margem: 0.25, folha: 0.2 }], // private equity
  ['índice', { margem: 0.4, folha: 0.2 }], // índices/ratings (SPGI/MSCI)
  ['mídia', { margem: 0.12, folha: 0.14 }],
  ['streaming', { margem: 0.13, folha: 0.16 }],
  ['biotecnolog', { margem: 0.08, folha: 0.18 }],
  ['saneament', { margem: 0.15, folha: 0.08 }],
  ['educaç', { margem: 0.08, folha: 0.25 }],
  ['turis', { margem: 0.08, folha: 0.15 }],
  ['autopeç', { margem: 0.06, folha: 0.1 }],
  ['calçad', { margem: 0.09, folha: 0.13 }],
  ['agro', { margem: 0.09, folha: 0.1 }],
  ['financeiro', { margem: 0.25, folha: 0.22 }],
]

const DEFAULT_ESTIMATE: SectorEstimate = { margem: 0.1, folha: 0.15 }

/* Aliases em inglês (Alpha Vantage retorna Sector em EN) — específicos primeiro. */
const SECTOR_TABLE_EN: [string, SectorEstimate][] = [
  ['semiconductor', { margem: 0.25, folha: 0.12 }],
  ['pharmaceutical', { margem: 0.15, folha: 0.16 }],
  ['biotechnology', { margem: 0.08, folha: 0.18 }],
  ['health care', { margem: 0.04, folha: 0.16 }],
  ['medical', { margem: 0.14, folha: 0.17 }],
  ['software', { margem: 0.2, folha: 0.26 }],
  ['information technology', { margem: 0.15, folha: 0.24 }],
  ['technology', { margem: 0.18, folha: 0.24 }],
  ['banks', { margem: 0.28, folha: 0.22 }],
  ['financial services', { margem: 0.25, folha: 0.22 }],
  ['capital markets', { margem: 0.3, folha: 0.24 }],
  ['insurance', { margem: 0.1, folha: 0.18 }],
  ['oil & gas', { margem: 0.09, folha: 0.05 }],
  ['energy', { margem: 0.12, folha: 0.07 }],
  ['utilities', { margem: 0.14, folha: 0.06 }],
  ['mining', { margem: 0.16, folha: 0.11 }],
  ['steel', { margem: 0.05, folha: 0.14 }],
  ['automobile', { margem: 0.06, folha: 0.1 }],
  ['aerospace & defense', { margem: 0.07, folha: 0.18 }],
  ['industrials', { margem: 0.09, folha: 0.16 }],
  ['consumer cyclical', { margem: 0.07, folha: 0.13 }],
  ['consumer defensive', { margem: 0.11, folha: 0.14 }],
  ['specialty retail', { margem: 0.05, folha: 0.13 }],
  ['discount stores', { margem: 0.03, folha: 0.12 }],
  ['food', { margem: 0.09, folha: 0.12 }],
  ['beverages', { margem: 0.16, folha: 0.08 }],
  ['telecom', { margem: 0.12, folha: 0.09 }],
  ['transportation', { margem: 0.07, folha: 0.28 }],
  ['integration', { margem: 0.11, folha: 0.3 }],
  ['luxury', { margem: 0.15, folha: 0.17 }],
  ['apparel', { margem: 0.09, folha: 0.13 }],
  ['tobacco', { margem: 0.25, folha: 0.05 }],
  ['cosmetics', { margem: 0.12, folha: 0.14 }],
  ['paper', { margem: 0.14, folha: 0.1 }],
  ['construction', { margem: 0.06, folha: 0.18 }],
  ['real estate', { margem: 0.25, folha: 0.1 }],
  ['waste', { margem: 0.11, folha: 0.18 }],
  ['staffing', { margem: 0.05, folha: 0.32 }],
]

export function sectorEstimate(setor?: string): SectorEstimate {
  if (!setor) return DEFAULT_ESTIMATE
  const s = setor.toLowerCase()
  for (const [key, est] of SECTOR_TABLE) if (s.includes(key)) return est
  for (const [key, est] of SECTOR_TABLE_EN) if (s.includes(key)) return est
  return DEFAULT_ESTIMATE
}

export function sectorPriceSalesEstimate(setor?: string): number {
  const s = (setor ?? '').toLowerCase()
  const table: [string, number][] = [
    ['software', 3.5], ['tecnolog', 3.0], ['informát', 3.0],
    ['banc', 2.8], ['finance', 2.8], ['seguro', 2.2],
    ['farmac', 2.2], ['saúde', 1.8], ['saneament', 1.6],
    ['elétric', 1.5], ['energia', 1.0], ['petróleo', 0.9],
    ['minera', 1.2], ['agro', 1.1], ['varejo', 0.8], ['atacarejo', 0.55],
    ['telecom', 1.2], ['logíst', 1.0], ['transport', 0.9],
    ['imobili', 1.5], ['constru', 1.0], ['siderurg', 0.8], ['autopeç', 0.9],
    ['indústri', 1.1], ['bens de capital', 1.2],
  ]
  for (const [key, value] of table) if (s.includes(key)) return value
  return 1.2
}

export function sectorSalaryEstimateBRLK(setor?: string): number {
  const s = (setor ?? '').toLowerCase()
  const table: [string, number][] = [
    ['banc', 180], ['finance', 170], ['seguro', 135],
    ['software', 165], ['tecnolog', 150], ['informát', 145],
    ['petróleo', 165], ['minera', 135], ['energia', 125], ['elétric', 120],
    ['telecom', 115], ['farmac', 115], ['saúde', 70],
    ['bens de capital', 105], ['indústri', 90], ['siderurg', 90],
    ['automotiv', 85], ['autopeç', 75], ['logíst', 80], ['transport', 75],
    ['imobili', 95], ['constru', 70], ['saneament', 95],
    ['varejo', 48], ['atacarejo', 42], ['aliment', 58], ['bebida', 70],
    ['educaç', 62], ['agro', 68], ['celulose', 85], ['papel', 75],
  ]
  for (const [key, value] of table) if (s.includes(key)) return value
  return 80
}
