/**
 * ENGINE CONCEITUAL — tradução das categorias de O Capital em métricas.
 *
 * Circuito do capital produtivo:  M — C(L/MP) … P … C′ — M′
 *   M  = capital-dinheiro adiantado          → M = c + v
 *   c  = capital constante (meios de produção)
 *   v  = capital variável (força de trabalho)
 *   m  = mais-valia extraída em P
 *   C′ = valor da mercadoria                 → C′ = c + v + m
 *   M′ = dinheiro realizado                  → M′ = (c + v) + m, ΔM = m
 */

/** Capital variável de referência (100 unidades de trabalho). */
export const BASE_V = 100

export interface CircuitParams {
  /** Composição orgânica do capital: k = c/v */
  k: number
  /** Taxa de mais-valia (exploração): e = m/v */
  e: number
}

export interface CircuitResult {
  c: number
  v: number
  m: number
  /** capital total adiantado */
  M: number
  /** valor da mercadoria C′ = c + v + m */
  W: number
  /** dinheiro realizado M′ = M + ΔM */
  MPrime: number
  /** mais-valia ΔM = m */
  deltaM: number
  /** composição orgânica k = c/v */
  k: number
  /** taxa de mais-valia e = m/v (%) */
  e: number
  /** TAXA DE LUCRO g = m / (c + v) (%) */
  profitRate: number
}

export function computeCircuit(k: number, e: number, v: number = BASE_V): CircuitResult {
  const c = k * v
  const m = (e * v)
  const M = c + v
  const W = c + v + m
  return {
    c,
    v,
    m,
    M,
    W,
    MPrime: W,
    deltaM: m,
    k,
    e,
    // FÓRMULA-CORE: g = m / (c + v) = e·v / ((k+1)·v) = e / (k + 1)
    profitRate: (m / M) * 100,
  }
}

/**
 * Tendência da taxa de lucro: para e fixa, g(k) = e/(k+1) decresce
 * conforme a composição orgânica sobe (automação substitui trabalho vivo).
 */
export function profitCurve(e: number, kMin: number, kMax: number, steps = 120): { k: number; g: number }[] {
  const pts: { k: number; g: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const k = kMin + ((kMax - kMin) * i) / steps
    pts.push({ k, g: computeCircuit(k, e).profitRate })
  }
  return pts
}

export const PRESETS = [
  { id: 'manufatura', label: 'Manufatura séc. XIX', k: 1, e: 1 },
  { id: 'fordismo', label: 'Indústria fordista', k: 4, e: 1.5 },
  { id: 'automacao', label: 'Automação / IA', k: 8, e: 2.5 },
  { id: 'uberizacao', label: 'Uberização & Plataformas', k: 12, e: 4 },
] as const

/**
 * TRADUTOR DIDÁTICO — Horas de trabalho não pago na jornada:
 *   H = J · m/(m+v) = J · e/(e+1)
 * Em uma jornada J de 8h, a fração m/(m+v) do dia é trabalho gratuito.
 */
export function unpaidHours(e: number, jornada = 8): number {
  return jornada * (e / (e + 1))
}

/** Formata horas decimais como "07h 39min". */
export function fmtHours(hours: number): string {
  const totalMin = Math.round(hours * 60)
  const h = Math.floor(totalMin / 60)
  const min = totalMin % 60
  return `${String(h).padStart(2, '0')}h ${String(min).padStart(2, '0')}min`
}

export function pct(n: number, digits = 1): string {
  return `${n.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`
}

export function units(n: number): string {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
}
