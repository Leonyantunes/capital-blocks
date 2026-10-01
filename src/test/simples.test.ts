/**
 * TESTES DO MODO SIMPLES (3º nível de leitura) — `lib/simples.ts`.
 *
 * A estratégia: simplificar a LINGUAGEM nunca simplifica o NÚMERO. Estes
 * testes travam a cadeia de `resolve()` (simples → didático → avançado,
 * total — nunca `undefined`) e as traduções curadas de `termoSimples`
 * (normalização de caixa/acento; termo desconhecido passa intacto).
 *
 * Rodar: `npm test`
 */
import { describe, it, expect } from 'vitest'
import {
  NIVEIS,
  isSimples,
  rotuloDoModo,
  descricaoDoModo,
  resolve,
  termoSimples,
} from '../lib/simples'

describe('resolve — cadeia de escolha do texto', () => {
  it('o campo `simples` vence SEMPRE (qualquer modo)', () => {
    const t = { simples: 'facinho', did: 'conta', adv: 'fórmula' }
    expect(resolve(t, 'simples')).toBe('facinho')
    expect(resolve(t, 'didatico')).toBe('facinho')
    expect(resolve(t, 'avancado')).toBe('facinho')
  })

  it('sem `simples`: didático vence avançado nos modos simples e didático', () => {
    const t = { did: 'conta', adv: 'fórmula' }
    expect(resolve(t, 'simples')).toBe('conta')
    expect(resolve(t, 'didatico')).toBe('conta')
    expect(resolve(t, 'avancado')).toBe('fórmula')
  })

  it('em modo avançado, objeto sem `adv` ainda devolve o didático (total)', () => {
    expect(resolve({ did: 'conta' }, 'avancado')).toBe('conta')
  })

  it('nunca devolve `undefined` — string vazia no pior caso', () => {
    const r = resolve({}, 'simples')
    expect(r).toBe('')
    expect(typeof r).toBe('string')
  })

  it('em modo avançado, `simples` presente ainda vence (dado explícito)', () => {
    /* decisão: se o dado TEM campo simples, ele é a versão certa em qualquer
       nível — o modo não força o avançado sobre uma tradução curada */
    expect(resolve({ simples: 'facinho', adv: 'fórmula' }, 'avancado')).toBe('facinho')
  })
})

describe('termoSimples — traduções curadas', () => {
  it('traduz os termos do dia a dia (frações, circuito, geopolítica)', () => {
    expect(termoSimples('mais-valia')).toBe('Trabalho de graça')
    expect(termoSimples('capital constante')).toBe('Máquinas e matéria-prima')
    expect(termoSimples('capital variável')).toBe('Salários dos trabalhadores')
    expect(termoSimples('hegemonia')).toBe('O país que dita as regras para os outros')
  })

  it('normaliza caixa e espaços: "Mais-Valia " também casa', () => {
    expect(termoSimples('Mais-Valia ')).toBe('Trabalho de graça')
  })

  it('termo desconhecido passa INTACTO (nunca inventa)', () => {
    expect(termoSimples('composição orgânica')).toBe('composição orgânica')
    expect(termoSimples('COFER')).toBe('COFER')
  })
})

describe('NIVEIS — o registro dos três níveis', () => {
  it('os três níveis existem, na ordem simples → didático → avançado', () => {
    expect(NIVEIS.map((n) => n.id)).toEqual(['simples', 'didatico', 'avancado'])
  })

  it('cada nível tem rótulo e descrição (badge nunca fica vazio)', () => {
    for (const n of NIVEIS) {
      expect(n.rotulo.length).toBeGreaterThan(0)
      expect(n.descricao.length).toBeGreaterThan(0)
    }
  })

  it('isSimples/rotuloDoModo/descricaoDoModo coerentes', () => {
    expect(isSimples('simples')).toBe(true)
    expect(isSimples('didatico')).toBe(false)
    expect(rotuloDoModo('simples')).toBe('Simples')
    expect(rotuloDoModo('didatico')).toBe('Didático')
    expect(rotuloDoModo('avancado')).toBe('Avançado')
    /* modo inválido cai no didático (padrão do app), nunca em undefined */
    expect(rotuloDoModo('inventado' as never)).toBe('Didático')
    expect(descricaoDoModo('simples')).toContain('palavras do dia a dia')
  })
})
