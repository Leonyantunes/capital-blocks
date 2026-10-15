import { describe, expect, it } from 'vitest'
import {
  OWNERSHIP_NODES,
  OWNERSHIP_EDGES,
  getBigThreeConcentration,
} from '../data/ownership'

describe('Rede de Propriedade Acionária (Ownership Web)', () => {
  it('contém nós com campos canônicos preenchidos e válidos', () => {
    expect(OWNERSHIP_NODES.length).toBeGreaterThan(10)
    for (const node of OWNERSHIP_NODES) {
      expect(node.id).toBeTruthy()
      expect(node.name).toBeTruthy()
      expect(node.country).toBeTruthy()
      expect(['fund', 'corporation', 'sovereign', 'bank']).toContain(node.kind)
      expect(['produtivo', 'financeiro', 'comercial', 'ficticio', 'estatal']).toContain(node.fraction)
      expect(node.sizeBi).toBeGreaterThan(0)
      expect(node.description).toHaveLength(3) // pt, en, es
    }
  })

  it('todas as arestas conectam nós que existem no dataset', () => {
    const nodeIds = new Set(OWNERSHIP_NODES.map((n) => n.id))
    expect(OWNERSHIP_EDGES.length).toBeGreaterThan(15)

    for (const edge of OWNERSHIP_EDGES) {
      expect(nodeIds.has(edge.source)).toBe(true)
      expect(nodeIds.has(edge.target)).toBe(true)
      expect(edge.sharePct).toBeGreaterThan(0)
      expect(edge.sharePct).toBeLessThanOrEqual(100)
      expect(edge.valueBi).toBeGreaterThan(0)
    }
  })

  it('calcula corretamente a concentração de Big Three em empresas como Apple e Vale', () => {
    const appleConc = getBigThreeConcentration('apple')
    expect(appleConc.investors.length).toBeGreaterThanOrEqual(3)
    expect(appleConc.totalPct).toBeGreaterThan(15) // Vanguard + BlackRock + State Street > 15%
    expect(appleConc.totalValueBi).toBeGreaterThan(500) // Mais de $500B nas Big Three

    const valeConc = getBigThreeConcentration('vale')
    expect(valeConc.investors.length).toBeGreaterThanOrEqual(2)
    expect(valeConc.totalPct).toBeGreaterThan(10)
  })

  it('detecta a propriedade circular entre os próprios gestores financeiros', () => {
    const blkOwners = OWNERSHIP_EDGES.filter((e) => e.target === 'blackrock')
    expect(blkOwners.some((e) => e.source === 'vanguard')).toBe(true)

    const sttOwners = OWNERSHIP_EDGES.filter((e) => e.target === 'state-street')
    expect(sttOwners.some((e) => e.source === 'blackrock')).toBe(true)
  })
})
