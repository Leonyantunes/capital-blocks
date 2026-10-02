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
  simplificarTexto,
  textoPorModo,
  termoSimples,
} from '../lib/simples'

describe('resolve — cadeia de escolha do texto', () => {
  it('cada modo respeita o seu nível quando os três textos existem', () => {
    const t = { simples: 'facinho', did: 'conta', adv: 'fórmula' }
    expect(resolve(t, 'simples')).toBe('facinho')
    expect(resolve(t, 'didatico')).toBe('conta')
    expect(resolve(t, 'avancado')).toBe('fórmula')
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

  it('em modo avançado, `adv` vence o texto simples', () => {
    expect(resolve({ simples: 'facinho', adv: 'fórmula' }, 'avancado')).toBe('fórmula')
  })

  it('modo simples simplifica o didático quando não há string simples explícita', () => {
    expect(resolve({ did: 'A primarização aumenta a financeirização.' }, 'simples'))
      .toBe('A dependência maior de produtos primários aumenta a importância das finanças.')
  })

  it('textoPorModo é um atalho coerente para componentes', () => {
    expect(textoPorModo('didatico', 'did', 'adv', 'sim')).toBe('did')
    expect(textoPorModo('avancado', 'did', 'adv', 'sim')).toBe('adv')
    expect(textoPorModo('simples', 'did', 'adv', 'sim')).toBe('sim')
  })
})

describe('simplificarTexto — cobertura transversal sem mexer nos números', () => {
  it('troca vocabulário técnico e preserva números/moedas', () => {
    const src = 'US$ 95 bi em primarização e mais-valia; 27% em 1985.'
    const out = simplificarTexto(src)
    expect(out).toContain('US$ 95 bi')
    expect(out).toContain('27%')
    expect(out).toContain('1985')
    expect(out).toContain('dependência maior de produtos primários')
    expect(out).toContain('valor criado pelo trabalho e não pago em salário')
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
