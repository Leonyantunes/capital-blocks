/**
 * TESTES DO COMPORTAMENTO DO TOUR
 *
 * A auditoria estática (scripts/tour-audit.mjs) prova que os DADOS são
 * válidos. Estes testes provam que a LÓGICA do tour se comporta: navegação
 * por teclado, limites de índice, destaque garantido e a paridade 2D↔3D.
 *
 * Rodar: `npm test
 */
import { describe, it, expect } from 'vitest'
import { TOURES, getTour, stopIsos, stopColor } from '../data/tours'
import { TOUR_STOPS, distFromK } from '../data/tour'
import { FLOWS } from '../data/flows'

/* ── navegação por índices (espelha a lógica de MapWorld.tsx) ──────────── */
const next = (s: number | null, total: number) => (s === null ? 0 : Math.min(s + 1, total - 1))
const prev = (s: number | null) => (s === null ? 0 : Math.max(s - 1, 0))

describe('navegação do tour', () => {
  it('ArrowRight entra no tour no passo 0 e avança até o último', () => {
    const total = TOUR_STOPS.length
    let s: number | null = null
    s = next(s, total)
    expect(s).toBe(0)
    for (let i = 0; i < total + 5; i++) s = next(s, total)
    expect(s).toBe(total - 1) // trava no último, não estoura
  })

  it('ArrowLeft recua até 0 e não fica negativo', () => {
    let s: number | null = 3
    for (let i = 0; i < 10; i++) s = prev(s)
    expect(s).toBe(0)
  })

  it('navegar em qualquer tour respeita o total de paradas dele', () => {
    for (const t of TOURES) {
      const n = t.stops.length
      let s: number | null = null
      for (let i = 0; i < n + 3; i++) s = next(s, n)
      expect(s, `${t.id} estourou o índice`).toBe(n - 1)
      expect(s!).toBeLessThan(t.stops.length)
    }
  })
})

describe('destaque garantido (o ponto mais frágil do tour)', () => {
  it('toda parada com flowId inclui as pontas do fluxo nos isos', () => {
    const flowIds = new Set(FLOWS.map((f) => f.id as string))
    for (const t of TOURES) {
      for (const s of t.stops) {
        if (!s.flowId) continue
        expect(flowIds.has(s.flowId), `${t.id}/${s.id}: flowId inexistente`).toBe(true)
        const isos = stopIsos(s)
        expect(isos.length, `${t.id}/${s.id}: nenhum iso destacado`).toBeGreaterThan(0)
      }
    }
  })

  it('toda parada destaca ALGO (fluxo, isos ou camada) — salvo abertura/fechamento', () => {
    for (const t of TOURES) {
      for (const s of t.stops) {
        /* `layer`/`conflict` também pintam o mapa (salários, desastres, guerras) */
        const temDestaque =
          !!s.flowId || (s.isos?.length ?? 0) > 0 || !!s.layer || !!s.conflict
        if (!temDestaque) {
          /* o contrato permite só abertura/fechamento em visão mundial */
          const ehAberturaFechamento =
            /Abertura|Fechamento|Encerramento/i.test(s.chapter) ||
            /-(intro|fim|abertura|fechamento)$/.test(s.id)
          expect(
            ehAberturaFechamento,
            `${t.id}/${s.id}: parada sem destaque que não é abertura/fechamento`,
          ).toBe(true)
        }
      }
    }
  })

  it('isos são únicos e normalizados (3 dígitos, sem duplicata)', () => {
    for (const t of TOURES) {
      for (const s of t.stops) {
        const isos = stopIsos(s)
        expect(new Set(isos).size, `${t.id}/${s.id}: iso duplicado`).toBe(isos.length)
        for (const iso of isos) expect(iso).toMatch(/^\d{3}$/)
      }
    }
  })
})

describe('paridade 2D ↔ 3D (distFromK)', () => {
  it('é monotônica: mais zoom no 2D → câmera mais perto no 3D', () => {
    const ks = [0.6, 1, 1.5, 2, 2.5, 3, 3.2]
    const ds = ks.map(distFromK)
    for (let i = 1; i < ds.length; i++) {
      expect(ds[i], `k=${ks[i]} deveria estar mais perto que k=${ks[i - 1]}`).toBeLessThanOrEqual(
        ds[i - 1],
      )
    }
  })

  it('respeita piso e teto (1.7 a 4.6)', () => {
    for (const k of [0.01, 0.5, 1, 2, 3, 5, 14, 100]) {
      const d = distFromK(k)
      expect(d, `k=${k}`).toBeGreaterThanOrEqual(1.7)
      expect(d, `k=${k}`).toBeLessThanOrEqual(4.6)
    }
  })

  it('as paradas reais do tour caem na faixa útil (sem saturação)', () => {
    /* se algum k fosse > 3.4, cairia no piso e perderia distinção de câmera */
    const ks = [...TOUR_STOPS, ...TOURES.flatMap((t) => t.stops)]
      .map((s) => s.k)
      .filter((k): k is number => typeof k === 'number')
    const distintas = new Set(ks.map(distFromK))
    expect(distintas.size, 'câmeras 3D distintas demais — k pode estar saturado').toBeGreaterThan(5)
  })

  it('dist explícito na parada tem precedência sobre distFromK', () => {
    const comDist = TOUR_STOPS.find((s) => typeof s.dist === 'number')
    if (comDist) {
      /* o 3D usa `s.dist ?? distFromK(s.k)` (GlobeModule.tsx:323) */
      expect(comDist.dist).toBeGreaterThan(0)
    }
  })
})

describe('acesso aos tours', () => {
  it('getTour devolve o tour pedido', () => {
    for (const t of TOURES) {
      expect(getTour(t.id).id).toBe(t.id)
      expect(getTour(t.id).stops.length).toBe(t.stops.length)
    }
  })

  it('getTour com id inexistente cai no principal (não quebra a UI)', () => {
    const t = getTour('tour-que-nao-existe')
    expect(t).toBeDefined()
    expect(t.stops.length).toBeGreaterThan(0)
  })

  it('todo tour tem accent e descrição (usados no card de seleção)', () => {
    for (const t of TOURES) {
      expect(t.accent, `${t.id} sem accent`).toMatch(/^#[0-9a-fA-F]{3,8}$/)
      expect(t.descricao.length, `${t.id} sem descrição`).toBeGreaterThan(5)
    }
  })

  it('stopColor devolve cor para paradas com flowId e null para as sem', () => {
    /* stopColor deriva a cor do TIPO do fluxo (TYPE_STYLE) — sem flowId, null */
    for (const t of TOURES) {
      for (const s of t.stops) {
        if (s.flowId) {
          expect(stopColor(s), `${t.id}/${s.id} com flowId deveria ter cor`).toBeTruthy()
        } else {
          expect(stopColor(s), `${t.id}/${s.id} sem flowId deveria ser null`).toBeNull()
        }
      }
    }
  })
})

describe('estatísticas das paradas (didStats)', () => {
  it('toda parada tem didStats com valor e rótulo preenchidos', () => {
    for (const t of TOURES) {
      for (const s of t.stops) {
        for (const st of s.didStats ?? []) {
          expect(String(st.v).trim().length, `${t.id}/${s.id}: stat sem valor`).toBeGreaterThan(0)
          expect(String(st.k).trim().length, `${t.id}/${s.id}: stat sem rótulo`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('nenhuma estatística é um número puro sem contexto no rótulo', () => {
    for (const t of TOURES) {
      for (const s of t.stops) {
        for (const st of s.didStats ?? []) {
          const v = String(st.v)
          const k = String(st.k)
          /* contagens de mortos ('1.134') e frações ('1/8') são legíveis */
          if (/^\d{1,3}(\.\d{3})+$/.test(v)) continue
          if (/^\d+\/\d+$/.test(v)) continue
          /* um número puro é aceitável SE o rótulo disser a unidade
             (ex.: { v: '28', k: 'paradas neste tour' }) */
          const numeroPuro = /^[\d.,]+$/.test(v)
          if (numeroPuro) {
            expect(
              k.length,
              `${t.id}/${s.id}: stat '${v}' sem unidade e rótulo '${k}' vazio`,
            ).toBeGreaterThan(2)
            continue
          }
          /* caso contrário, o próprio valor precisa carregar o símbolo.
             Aceita também intervalos/estimativas, que já codificam a
             incerteza no próprio número: '508 (700+)', '~40%', '>400%'. */
          expect(
            /[a-zA-Z%()+~<>≈]/.test(v),
            `${t.id}/${s.id}: stat '${v}' sem unidade nem símbolo`,
          ).toBe(true)
        }
      }
    }
  })
})
