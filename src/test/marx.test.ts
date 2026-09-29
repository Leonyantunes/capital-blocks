/**
 * TESTES DO MOTOR CONCEITUAL (`lib/marx.ts`).
 *
 * Estas funções são o coração teórico do app (THEORY.md, Pilar 1) e são puras:
 * não tocam em DOM, rede ou store. Testá-las é barato e protege as fórmulas de
 * uma refatoração silenciosamente errada — um `g = e/(k+1)` trocado por
 * `e/(k+1)` * 100 quebraria a tela sem quebrar o typecheck.
 *
 * Rodar: `npm test`
 */
import { describe, it, expect } from 'vitest'
import {
  BASE_V,
  PRESETS,
  computeCircuit,
  fmtHours,
  pct,
  profitCurve,
  unpaidHours,
  units,
} from '../lib/marx'

describe('computeCircuit — decomposição W = c + v + m', () => {
  it('usa v = 100 por padrão e deriva c = k·v, m = e·v', () => {
    const r = computeCircuit(4, 1.5)
    expect(r.v).toBe(BASE_V)
    expect(r.c).toBe(400) // 4 × 100
    expect(r.m).toBe(150) // 1.5 × 100
  })

  it('respeita a identidade contábil W = c + v + m e M = c + v', () => {
    const r = computeCircuit(4, 1.5)
    expect(r.M).toBe(r.c + r.v)
    expect(r.W).toBe(r.c + r.v + r.m)
    /* M′ = M + ΔM: o dinheiro realizado cresce exatamente pela mais-valia */
    expect(r.MPrime).toBe(r.M + r.deltaM)
    expect(r.deltaM).toBe(r.m)
  })

  it('aplica a fórmula-core g = m/(c+v) = e/(k+1)', () => {
    /* g = 1.5/(4+1) = 0.3 → 30% */
    expect(computeCircuit(4, 1.5).profitRate).toBeCloseTo(30, 10)
  })

  it('a taxa de lucro é invariante à escala de v', () => {
    /* dobrar v dobra tudo (c, m, W) mas g é razão — não pode mudar */
    const a = computeCircuit(4, 1.5, 100)
    const b = computeCircuit(4, 1.5, 200)
    expect(b.c).toBe(2 * a.c)
    expect(b.m).toBe(2 * a.m)
    expect(b.profitRate).toBeCloseTo(a.profitRate, 12)
  })

  it('e = 0 (excesso de capital sem mais-valia) zera o lucro', () => {
    const r = computeCircuit(4, 0)
    expect(r.m).toBe(0)
    expect(r.profitRate).toBe(0)
  })
})

describe('tendência decrescente da taxa de lucro', () => {
  it('g decresce estritamente quando k sobe com e fixo', () => {
    const curva = profitCurve(1.5, 1, 10, 50)
    for (let i = 1; i < curva.length; i++) {
      expect(curva[i].g).toBeLessThan(curva[i - 1].g)
    }
  })

  it('valoriza corretamente as pontas de um intervalo', () => {
    const curva = profitCurve(1.5, 2, 6, 4)
    expect(curva[0].k).toBe(2)
    expect(curva[curva.length - 1].k).toBe(6)
    expect(curva[0].g).toBeCloseTo((1.5 / 3) * 100, 10) // e/(k+1) em k=2
  })
})

describe('tradutor didático — horas não pagas na jornada', () => {
  it('H = J · e/(e+1) para a jornada padrão de 8h', () => {
    /* e = 1.5 → 8 × 1.5/2.5 = 4.8h */
    expect(unpaidHours(1.5)).toBeCloseTo(4.8, 10)
  })

  it('e = 0 não deixa tempo livre; e → ∞ aproxima a jornada inteira', () => {
    expect(unpaidHours(0)).toBe(0)
    expect(unpaidHours(1e9)).toBeCloseTo(8, 5)
  })

  it('nunca excede a jornada (monotonicamente crescente em e)', () => {
    let anterior = -1
    for (const e of [0.5, 1, 1.5, 2, 4, 12]) {
      const h = unpaidHours(e)
      expect(h).toBeGreaterThan(anterior)
      expect(h).toBeLessThanOrEqual(8)
      anterior = h
    }
  })

  it('escala linearmente com a jornada (J=6 dá 3/4 do que J=8 dá)', () => {
    expect(unpaidHours(1.5, 6)).toBeCloseTo(unpaidHours(1.5, 8) * 0.75, 10)
  })
})

describe('coerência entre o motor e os presets', () => {
  it('cada preset mantém g = e/(k+1) e devolve as próprias k/e', () => {
    for (const p of PRESETS) {
      const r = computeCircuit(p.k, p.e)
      expect(r.k).toBe(p.k)
      expect(r.e).toBe(p.e)
      expect(r.profitRate).toBeCloseTo((p.e / (p.k + 1)) * 100, 10)
    }
  })

  it('uberização é o preset mais explorado e mais automatizado', () => {
    const uber = PRESETS.find((p) => p.id === 'uberizacao')!
    const manuf = PRESETS.find((p) => p.id === 'manufatura')!
    expect(uber.k).toBeGreaterThan(manuf.k)
    expect(uber.e).toBeGreaterThan(manuf.e)
    /* mais automação com e fixa derrubaria g — o preset compensa com e maior */
    expect(computeCircuit(uber.k, uber.e).profitRate).toBeGreaterThan(0)
  })

  it('mão de obra mais barata (k menor) tem mais horas não pagas', () => {
    const manuf = PRESETS.find((p) => p.id === 'manufatura')!
    const uber = PRESETS.find((p) => p.id === 'uberizacao')!
    expect(unpaidHours(uber.e)).toBeGreaterThan(unpaidHours(manuf.e))
  })
})

describe('formatadores pt-BR', () => {
  it('fmtHours quebra decimais em horas e minutos', () => {
    expect(fmtHours(4.8)).toBe('04h 48min')
    expect(fmtHours(8)).toBe('08h 00min')
    expect(fmtHours(0)).toBe('00h 00min')
  })

  it('pct/units usam a convenção pt-BR', () => {
    expect(pct(30)).toBe('30,0%')
    expect(pct(12, 2)).toBe('12,00%')
    expect(units(1234)).toBe('1.234')
  })
})
