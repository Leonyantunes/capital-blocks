import { describe, it, expect } from 'vitest'
import { COMEX_DATA, PWT_DATA, OWNERSHIP_DATA, DEBT_DATA, PRESET_QUERIES } from '../data/analyticsDatasets'
import { runSqlQuery } from '../lib/duckdb/duckdbClient'

describe('Motor Analítico SQL e Datasets (DuckDB-Wasm)', () => {
  it('garante que o dataset Comex possui fluxos válidos e consistência contábil', () => {
    expect(COMEX_DATA.length).toBeGreaterThanOrEqual(15)
    for (const row of COMEX_DATA) {
      expect(row.origem).toBeTruthy()
      expect(row.destino).toBeTruthy()
      expect(row.usd_bi).toBeGreaterThan(0)
      expect(typeof row.drenagem_bi).toBe('number')
    }
  })

  it('valida identidades marxistas no dataset Penn World Table (PWT 10.0)', () => {
    expect(PWT_DATA.length).toBeGreaterThanOrEqual(15)
    for (const row of PWT_DATA) {
      expect(row.estoque_capital_c_bi).toBeGreaterThan(0)
      expect(row.massa_salarial_v_bi).toBeGreaterThan(0)
      expect(row.mais_valia_m_bi).toBeGreaterThan(0)

      // Identidade da composição orgânica: k = c / v
      const kCalculado = row.estoque_capital_c_bi / row.massa_salarial_v_bi
      expect(Math.abs(row.composicao_organica_k - kCalculado)).toBeLessThan(0.05)

      // Identidade da taxa de mais-valia / exploração: e = m / v
      const eCalculado = row.mais_valia_m_bi / row.massa_salarial_v_bi
      expect(Math.abs(row.taxa_exploracao_e - eCalculado)).toBeLessThan(0.05)

      // Identidade da taxa geral de lucro: r = m / (c + v)
      const rCalculado = row.mais_valia_m_bi / (row.estoque_capital_c_bi + row.massa_salarial_v_bi)
      expect(Math.abs(row.taxa_lucro_r - rCalculado)).toBeLessThan(0.05)
    }
  })

  it('verifica integridade do dataset de custódia acionária e monopólio', () => {
    expect(OWNERSHIP_DATA.length).toBeGreaterThanOrEqual(10)
    for (const row of OWNERSHIP_DATA) {
      expect(row.empresa).toBeTruthy()
      expect(row.ticker).toBeTruthy()
      expect(row.market_cap_bi).toBeGreaterThan(0)

      const somaBigThree = row.pct_blackrock + row.pct_vanguard + row.pct_statestreet
      expect(somaBigThree).toBeGreaterThan(0)
      expect(somaBigThree).toBeLessThan(100)
    }
  })

  it('executa todas as consultas didáticas SQL pré-programadas com sucesso', async () => {
    for (const preset of PRESET_QUERIES) {
      const res = await runSqlQuery(preset.sql)
      expect(res.columns.length).toBeGreaterThan(0)
      expect(res.rows.length).toBeGreaterThan(0)
      expect(res.rowCount).toBeGreaterThan(0)
      expect(typeof res.durationMs).toBe('number')
    }
  })
})
