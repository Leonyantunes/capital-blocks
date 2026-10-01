/**
 * AUDITORIA DIDÁTICO × AVANÇADO (TODO P1-16) — os dois modos têm que ser
 * CLARAMENTE diferentes em todo o app. O didático explica com conta e
 * metáfora; o avançado usa categorias marxistas, fórmulas e referências.
 *
 * Este teste importa os datasets REAIS (não parsing de texto) e mede a
 * sobreposição de vocabulário (Jaccard sobre palavras normalizadas) de cada
 * par did/adv: par quase idêntico falha — um "avançado" que só repete o
 * didático é conteúdo desperdiçado. A asserção lista os ids exatos.
 *
 * O LIMIAR é generoso (0,78): pares legítimos compartilham o assunto;
 * o que se pune é repetição quase integral, não vocabulário em comum.
 *
 * Rodar: `npm test`
 */
import { describe, it, expect } from 'vitest'
import { FLOWS } from '../data/flows'
import { EPISODES } from '../data/consequences'
import { ALT_CASES } from '../data/alternatives'
import { TOUR_STOPS } from '../data/tour'
import { TOURES } from '../data/tours'
import { INDICATORS } from '../data/indicators'

/** Jaccard sobre palavras normalizadas (>4 chars — ignora stopwords curtas). */
function jaccard(a: string, b: string): number {
  const tok = (s: string): Set<string> =>
    new Set(
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3),
    )
  const ta = tok(a)
  const tb = tok(b)
  if (ta.size === 0 && tb.size === 0) return 1
  let inter = 0
  for (const w of ta) if (tb.has(w)) inter++
  return inter / (ta.size + tb.size - inter)
}

interface Par {
  id: string
  did: string
  adv: string
}

/** Pares did/adv de uma lista de registros (quando os dois campos existem). */
function paresDe(
  list: { id?: string; titulo?: string; did?: string; adv?: string }[],
  origem: string,
): Par[] {
  return list
    .filter(
      (o): o is { id?: string; titulo?: string; did: string; adv: string } =>
        typeof o.did === 'string' && typeof o.adv === 'string',
    )
    .map((o) => ({ id: `${origem} · ${o.id ?? o.titulo ?? '?'}`, did: o.did, adv: o.adv }))
}

const LIMIAR = 0.78

describe('auditoria didático × avançado (TODO P1-16)', () => {
  const SUITES: { nome: string; pares: Par[] }[] = [
    { nome: 'flows (rotas geopolíticas)', pares: paresDe(FLOWS, 'flow') },
    {
      nome: 'consequences (episódios: vítimas, mecanismos, aprofundamento)',
      pares: EPISODES.flatMap((e) => [
        { id: `episodio · ${e.id} · vitimas`, did: e.vitimas.did, adv: e.vitimas.adv },
        { id: `episodio · ${e.id} · aprof`, did: e.aprof.did, adv: e.aprof.adv },
        ...e.mecanismos.map((m, i) => ({
          id: `episodio · ${e.id} · mecanismo ${i + 1}`,
          did: m.did,
          adv: m.adv,
        })),
      ]),
    },
    { nome: 'alternatives (casos)', pares: paresDe(ALT_CASES, 'caso') },
    { nome: 'tour stops (base)', pares: paresDe(TOUR_STOPS, 'parada') },
    {
      nome: 'tour stops (overrides por tour)',
      pares: TOURES.flatMap((t) => paresDe(t.stops, `tour ${t.id}`)),
    },
    {
      nome: 'indicadores globais',
      pares: INDICATORS.map((i) => ({ id: `indicador · ${i.id}`, did: i.didatico, adv: i.avancado })),
    },
  ]

  it('cobertura: todas as suítes chegam com pares did/adv', () => {
    for (const suite of SUITES) {
      expect(suite.pares.length, suite.nome).toBeGreaterThan(0)
    }
    const total = SUITES.reduce((s, x) => s + x.pares.length, 0)
    expect(total, 'pares did/adv auditados em todo o app').toBeGreaterThan(180)
  })

  it('nenhum par quase idêntico (Jaccard ≤ limiar)', () => {
    const falhas: string[] = []
    for (const suite of SUITES) {
      for (const p of suite.pares) {
        const j = jaccard(p.did, p.adv)
        if (j > LIMIAR) falhas.push(`${p.id} (Jaccard ${j.toFixed(2)})`)
      }
    }
    expect(
      falhas,
      `pares quase idênticos — reescrever o avançado com categorias/fórmulas:\n${falhas.join('\n')}`,
    ).toEqual([])
  })

  it('o avançado NUNCA é substring integral do didático (e vice-versa)', () => {
    const falhas: string[] = []
    for (const suite of SUITES) {
      for (const p of suite.pares) {
        const d = p.did.trim().toLowerCase()
        const a = p.adv.trim().toLowerCase()
        if (d.length > 0 && a.length > 0 && (d.includes(a) || a.includes(d))) {
          falhas.push(p.id)
        }
      }
    }
    expect(falhas, `um lado repete o outro integralmente:\n${falhas.join('\n')}`).toEqual([])
  })
})
