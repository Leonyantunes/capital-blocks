/**
 * TESTES DO MOTOR EMPRESARIAL (`lib/companyMetrics.ts`).
 *
 * O Raio-X (Módulo 05) roda TODAS as ~140 empresas por estas funções puras.
 * Elas convertem DFs em razões (e, k, horas não pagas) — se a decomposição
 * quebrar, todo o módulo exibe números plausíveis e errados. Estes testes
 * travam as invariantes contábeis e as bordas (v≈0, receita ausente, e∞).
 *
 * Rodar: `npm test`
 */
import { describe, it, expect } from 'vitest'
import {
  decomposeFromParts,
  decomposeValue,
  minutesFromE,
  sectorEstimate,
} from '../lib/companyMetrics'

describe('decomposeFromParts — invariantes contábeis', () => {
  it('preserva a identidade c + v + m = receita', () => {
    const receita = 100
    const d = decomposeFromParts(receita, 40, 15)
    expect(d.c + d.v + d.m).toBeCloseTo(receita, 10)
  })

  it('e = m/v em porcentagem', () => {
    const d = decomposeFromParts(100, 40, 15)
    expect(d.e).toBeCloseTo((15 / 40) * 100, 10) // 37.5%
  })

  it('deduz c como resíduo quando a receita é informada', () => {
    const d = decomposeFromParts(100, 40, 15)
    expect(d.c).toBe(45) // 100 − 40 − 15
  })

  it('sem receita informada, c = 0 (não inventa consumo intermediário)', () => {
    const d = decomposeFromParts(undefined, 40, 15)
    expect(d.c).toBe(0)
    expect(d.v).toBe(40)
    expect(d.m).toBe(15)
  })
})

describe('bordas e entradas degeneradas', () => {
  it('v = 0 produz e = Infinity e 100% do tempo não pago (480 min)', () => {
    const d = decomposeFromParts(100, 0, 10)
    expect(d.e).toBe(Infinity)
    expect(d.minutesUnpaid).toBe(480)
  })

  it('m negativo (prejuízo) é truncado em 0 — não gera e negativa', () => {
    const d = decomposeFromParts(100, 40, -10)
    expect(d.m).toBe(0)
    expect(d.e).toBe(0)
    expect(d.minutesUnpaid).toBe(0)
  })

  it('c nunca fica negativo quando folha+lucro estouram a receita', () => {
    const d = decomposeFromParts(10, 40, 15) // v+m = 55 > receita
    expect(d.c).toBe(0)
  })

  it('receita negativa é neutralizada', () => {
    const d = decomposeFromParts(-100, 40, 15)
    expect(d.c).toBe(0)
    expect(d.v).toBe(40)
  })
})

describe('minutesFromE — coerência com o tradutor de marx.ts', () => {
  it('e = 0 → 0 min; e = 100% → 240 min (metade da jornada)', () => {
    expect(minutesFromE(0)).toBe(0)
    expect(minutesFromE(100)).toBe(240)
  })

  it('e → ∞ satura em 480 min sem explodir para NaN', () => {
    expect(minutesFromE(Infinity)).toBe(480)
    /* limite assintótico: 480·e/(100+e) → 480 (precisão de float) */
    expect(minutesFromE(1e9)).toBeGreaterThan(479.99)
    expect(minutesFromE(1e9)).toBeLessThanOrEqual(480)
  })

  it('e não finito cai em 480 (jornada inteira) em vez de NaN', () => {
    expect(minutesFromE(NaN)).toBe(480)
  })

  it('espelha 8·e/(e+1) de marx.ts: 37,5% → 130,9 min', () => {
    /* minutos = 60 × 8·(e/100)/((e/100)+1) — mesma curva do tradutor didático */
    expect(minutesFromE(37.5)).toBeCloseTo(130.909090909, 8)
    /* e = 100% dá exatamente metade da jornada */
    expect(minutesFromE(100)).toBe(240)
  })
})

describe('decomposeValue — folha estimada a partir de headcount × salário', () => {
  it('converte (funcionáriosMil, salarioMedioK) em bilhões de moeda local', () => {
    /* 10.000 funcionários × R$ 120.000/ano = R$ 1,2 bi */
    const d = decomposeValue(10, 10, 1.2, 120)
    expect(d.v).toBeCloseTo(1.2, 10)
    expect(d.e).toBeCloseTo(100, 10) // 1.2 / 1.2
  })

  it('é invariante à moeda: a razão e não depende da unidade', () => {
    const brl = decomposeValue(50, 20, 5, 100)
    const usd = decomposeValue(50, 20, 5, 100)
    expect(brl.e).toBe(usd.e)
  })

  it('headcount zero ⇒ e = Infinity, sem NaN na tela', () => {
    const d = decomposeValue(10, 0, 1, 100)
    expect(d.v).toBe(0)
    expect(d.e).toBe(Infinity)
    expect(d.minutesUnpaid).toBe(480)
  })
})

describe('sectorEstimate — tabela setorial', () => {
  it('encontra setores PT-BR por substring', () => {
    expect(sectorEstimate('Bancos').margem).toBe(0.28)
    expect(sectorEstimate('Petróleo e Gás').margem).toBe(0.09)
  })

  it('encontra setores EN (Alpha Vantage) e prefere a tabela EN', () => {
    expect(sectorEstimate('Semiconductors').margem).toBe(0.25)
    expect(sectorEstimate('Information Technology').margem).toBe(0.15)
  })

  it('resolve pela PRIMEIRA entrada que casa (substring, ordem da tabela)', () => {
    /* a varredura é sequencial e a PRIMEIRA chave que casa vence: em
       'Aeroindústria' o match é 'indústri' (0.09), não 'aeroespac' (0.06) —
       'indústri' aparece antes na tabela. Ver também a nota de gaps abaixo. */
    expect(sectorEstimate('Aeroindústria').margem).toBe(0.09)
    expect(sectorEstimate('Varejo farmacêutico').margem).toBe(0.04) // 'varejo' (0.04) vence 'farmac' (0.15)
    expect(sectorEstimate('Bancário / Portador de Juros').margem).toBe(0.28)
  })

  it('cobre os setores PT-BR realmente usados no dataset', () => {
    expect(sectorEstimate('Alimentos e Bebidas').margem).toBe(0.09) // 'aliment'
    expect(sectorEstimate('Siderurgia').margem).toBe(0.05) // 'siderurg'
    expect(sectorEstimate('Celulose e Papel').margem).toBe(0.14) // 'celulose'
    expect(sectorEstimate('Cosméticos').margem).toBe(0.12) // 'cosmét'
    expect(sectorEstimate('Telecomunicações').margem).toBe(0.12) // 'telecom'
    expect(sectorEstimate('Extrativa Mineral').margem).toBe(0.16) // 'minera'
    expect(sectorEstimate('Plataformas').margem).toBe(0.15) // 'plataforma'
  })

  /* GAPS CONHECIDOS (medidos, não supostos): três setores do dataset BR caem
   * no default 0.10/0.15 e um cuarto é classificado pela chave errada. São
   * premissas de estimations (flag estimate no registro), não dados de fonte,
   * então ficam registrados aqui em vez de "corrigidos" às cegas.
   * TODO(auditoria): inserir 'aeroind' e 'locadora' antes de 'indústri'/
   * 'transport', e decidir entre 'varejo' e 'farmac' para varejo farmacêutico. */
  it('GAPS: setores do dataset sem entrada própria caem no default', () => {
    for (const s of ['Infraestrutura de mercado', 'Locação de veículos', 'Bens de Capital']) {
      const est = sectorEstimate(s)
      expect(est.margem).toBe(0.1)
      expect(est.folha).toBe(0.15)
    }
  })

  it('setor desconhecido ou ausente cai no default, nunca em undefined', () => {
    const d = sectorEstimate('Setor Inventado')
    expect(d.margem).toBe(0.1)
    expect(d.folha).toBe(0.15)
    expect(sectorEstimate(undefined).margem).toBe(0.1)
    expect(sectorEstimate('').margem).toBe(0.1)
  })

  it('toda estimativa setorial tem margem e folha em faixas plausíveis (0–1)', () => {
    for (const s of ['Bancos', 'Varejo', 'Saúde', 'Aeroespacial', 'Technology', 'Oil & Gas']) {
      const est = sectorEstimate(s)
      expect(est.margem).toBeGreaterThan(0)
      expect(est.margem).toBeLessThanOrEqual(1)
      expect(est.folha).toBeGreaterThan(0)
      expect(est.folha).toBeLessThanOrEqual(1)
    }
  })
})
