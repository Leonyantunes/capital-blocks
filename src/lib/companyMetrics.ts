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
