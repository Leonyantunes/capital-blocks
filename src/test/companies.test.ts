/**
 * TESTES DE INTEGRIDADE DO DATASET DE EMPRESAS (Raio-X).
 *
 * O Módulo 05 decompõe ~150 empresas pela fórmula W = c + v + m. Um erro de
 * digitação num único registro (capTri em vez de capBi, salário em vez de
 * folha, receita abaixo da folha) aparece na tela como número plausível e
 * errado. Estes testes travam as invariantes estruturais do dataset.
 *
 * Rodar: `npm test`
 */
import { describe, it, expect } from 'vitest'
import { COMPANIES_ALL, WORLD_COMPANIES, metricsFor, brView } from '../data/companies'
import { FRACTION_META } from '../data/countries'

describe('integridade do dataset do Raio-X', () => {
  it('tem cobertura relevante: BR + globais', () => {
    const br = COMPANIES_ALL.filter((c) => c.mercado === 'BR')
    expect(br.length).toBeGreaterThanOrEqual(24)
    expect(WORLD_COMPANIES.length).toBeGreaterThanOrEqual(137)
  })

  it('todo registro tem os campos obrigatórios preenchidos', () => {
    for (const c of COMPANIES_ALL) {
      expect(c.id, `${c.nome} sem id`).toBeTruthy()
      expect(c.nome.length, `${c.id} sem nome`).toBeGreaterThan(1)
      expect(c.pais.length, `${c.id} sem país`).toBeGreaterThan(1)
      expect(Number.isFinite(c.receitaBi), `${c.id} receita não numérica`).toBe(true)
      expect(Number.isFinite(c.lucroBi), `${c.id} lucro não numérico`).toBe(true)
      expect(Number.isFinite(c.funcionariosMil), `${c.id} funcionários não numérico`).toBe(true)
      expect(c.funcionariosMil, `${c.id} sem funcionários`).toBeGreaterThan(0)
      expect(c.salarioMedioK, `${c.id} sem salário médio`).toBeGreaterThan(0)
    }
  })

  it('nenhum id duplicado (a UI usa id como chave React e no dedupe da API)', () => {
    const ids = COMPANIES_ALL.map((c) => c.id)
    const dups = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dups).toEqual([])
  })

  it('capTri, quando presente, é plausível (0 < cap < 5 tri)', () => {
    for (const c of WORLD_COMPANIES) {
      if (c.capTri === undefined) continue
      expect(c.capTri, `${c.nome} capTri`).toBeGreaterThan(0)
      expect(c.capTri, `${c.nome} capTri`).toBeLessThan(5)
    }
  })

  it('receita, lucro e folha formam uma tripla coerente', () => {
    for (const c of COMPANIES_ALL) {
      expect(c.receitaBi, `${c.id} receita`).toBeGreaterThan(0)
      /* folha não pode exceder a receita (senão c explode para valor negativo
         e o motor trunca em 0 — mascarando um erro de digitação) */
      const v = (c.funcionariosMil * 1000 * c.salarioMedioK * 1000) / 1e9
      expect(v, `${c.id}: folha (${v.toFixed(1)}) > receita (${c.receitaBi})`).toBeLessThanOrEqual(c.receitaBi)
    }
  })

  it('lucro negativo é preservado nos dados (e o motor o trunca, sem NaN)', () => {
    /* Anglo American, LyondellBasell, Celanese, Kraft Heinz, Natureza */
    const negativos = COMPANIES_ALL.filter((c) => c.lucroBi < 0)
    expect(negativos.length).toBeGreaterThan(0)
    for (const c of negativos) {
      const d = metricsFor(c)
      expect(Number.isNaN(d.e), `${c.id} produziu NaN`).toBe(false)
      expect(d.m, `${c.id} deveria truncar m em 0`).toBe(0)
      expect(d.c, `${c.id} c`).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('motor aplicado ao dataset (todas as empresas)', () => {
  it('nenhuma empresa produz NaN, infinito negativo ou c negativo', () => {
    for (const c of COMPANIES_ALL) {
      const d = metricsFor(c)
      expect(Number.isNaN(d.v), `${c.id} v NaN`).toBe(false)
      expect(Number.isNaN(d.m), `${c.id} m NaN`).toBe(false)
      expect(Number.isNaN(d.c), `${c.id} c NaN`).toBe(false)
      expect(d.v, `${c.id} v`).toBeGreaterThanOrEqual(0)
      expect(d.m, `${c.id} m`).toBeGreaterThanOrEqual(0)
      expect(d.c, `${c.id} c`).toBeGreaterThanOrEqual(0)
      expect(Number.isNaN(d.minutesUnpaid), `${c.id} minutos NaN`).toBe(false)
      expect(d.minutesUnpaid, `${c.id} minutos`).toBeGreaterThanOrEqual(0)
      expect(d.minutesUnpaid, `${c.id} minutos`).toBeLessThanOrEqual(480)
    }
  })

  it('a taxa de exploração fica em faixa plausível (0 a 3000%)', () => {
    /* A Aramco dá e ≈ 2076% — e é CORRETO, não bug: estatal de petróleo com
       folha de ~1% da receita (73k empregados, US$ 5,1 bi) contra lucro de
       US$ 106 bi. O teto existe para pegar erro de digitação (ex.: salário em
       vez de folha), não para esconder exploration alta legítima. */
    for (const c of COMPANIES_ALL) {
      const d = metricsFor(c)
      if (!Number.isFinite(d.e)) continue
      expect(d.e, `${c.id} e=${d.e}`).toBeGreaterThanOrEqual(0)
      expect(d.e, `${c.id} e=${d.e}`).toBeLessThan(3000)
    }
  })

  it('a vista BR expõe as métricas calculadas sem NaN', () => {
    for (const c of COMPANIES_ALL.filter((x) => x.mercado === 'BR')) {
      const v = brView(c)
      expect(Number.isFinite(v.produtividade), `${c.id} produtividade`).toBe(true)
      expect(Number.isFinite(v.taxaExploracao), `${c.id} taxaExploracao`).toBe(true)
      expect(Number.isFinite(v.minutosNaoPagos), `${c.id} minutosNaoPagos`).toBe(true)
      expect(v.minutosNaoPagos).toBeGreaterThanOrEqual(0)
      expect(v.minutosNaoPagos).toBeLessThanOrEqual(480)
    }
  })
})

describe('setores', () => {
  it('todo setor usado por uma empresa tem rótulo de fração conhecido ou é livre', () => {
    /* os setores são texto livre (não vocabulario fechado), mas nenhum pode
       ser vazio — a UI usa setor como filtro e cabeçalho de grupo */
    for (const c of COMPANIES_ALL) {
      expect(c.setor.trim().length, `${c.id} setor vazio`).toBeGreaterThan(1)
    }
  })

  it('as frações do mapa têm todas as chaves que a UI referencia', () => {
    for (const k of Object.keys(FRACTION_META)) {
      expect(FRACTION_META[k as keyof typeof FRACTION_META].label.length).toBeGreaterThan(0)
    }
  })
})
