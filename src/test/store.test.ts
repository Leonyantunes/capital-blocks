/**
 * TESTES DA PERSISTÊNCIA DO STORE (`store/useApp.ts`) e do REGISTRO DE MÓDULOS.
 *
 * O store guarda preferências (modo, sliders, base, idioma, apresentação) em
 * localStorage. O localStorage é do usuário: pode estar corrompido, editado à
 * mão ou vir de uma versão anterior com outro shape. Estes testes travam os
 * dois comportamentos que importam — preferência sobrevive ao reload, e dado
 * inválido NÃO quebra o app nem trava um slider fora do intervalo.
 *
 * Rodar: `npm test`
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

/* localStorage stub (o ambiente node não tem DOM) */
class MemStorage {
  private m = new Map<string, string>()
  get length() {
    return this.m.size
  }
  clear() {
    this.m.clear()
  }
  getItem(k: string) {
    return this.m.get(k) ?? null
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null
  }
  removeItem(k: string) {
    this.m.delete(k)
  }
  setItem(k: string, v: string) {
    this.m.set(k, v)
  }
}

const STORAGE_KEY = 'cb.app.v1'

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemStorage())
  /* o store é um singleton: cada teste importa um módulo limpo */
  vi.resetModules()
  window.history.replaceState(null, '', '/')
})

async function freshStore() {
  const mod = await import('../store/useApp')
  return mod.useApp
}

describe('persistência de preferências', () => {
  it('grava apenas preferências — nunca tab/país/glossário', async () => {
    const useApp = await freshStore()
    useApp.getState().setTab('debt')
    useApp.getState().openCountry('bra')
    useApp.getState().setGlossaryOpen(true)
    useApp.getState().setMode('avancado')
    useApp.getState().setK(9.5)
    useApp.getState().setLang('en')
    useApp.getState().setPresentation(true)

    const raw = localStorage.getItem(STORAGE_KEY)!
    expect(raw).toBeTruthy()
    const saved = JSON.parse(raw).state

    expect(saved.mode).toBe('avancado')
    expect(saved.k).toBe(9.5)
    expect(saved.lang).toBe('en')
    expect(saved.presentation).toBe(true)

    /* posição de sessão NÃO persiste */
    expect(saved.tab).toBeUndefined()
    expect(saved.countryId).toBeUndefined()
    expect(saved.glossaryOpen).toBeUndefined()
  })

  it('reidrata as preferências após reload', async () => {
    const useApp = await freshStore()
    useApp.getState().setMode('avancado')
    useApp.getState().setE(3.25)
    useApp.getState().setBasis('ppp')
    useApp.getState().setLang('es')
    useApp.getState().setPresentation(true)

    /* simula F5: módulo novo, mesmo localStorage */
    vi.resetModules()
    const useApp2 = (await import('../store/useApp')).useApp
    const s = useApp2.getState()
    expect(s.mode).toBe('avancado')
    expect(s.e).toBe(3.25)
    expect(s.basis).toBe('ppp')
    expect(s.lang).toBe('es')
    expect(s.presentation).toBe(true)
  })
})

describe('validação do rehydrate (localStorage corrompido)', () => {
  it('k/e fora do intervalo do slider são fixados, não quebram a UI', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { k: 9999, e: -50 }, version: 1 }),
    )
    vi.resetModules()
    const useApp = (await import('../store/useApp')).useApp
    const { k, e } = useApp.getState()
    expect(k).toBeLessThanOrEqual(14) // K_MAX
    expect(e).toBeGreaterThanOrEqual(0.5) // E_MIN
    expect(Number.isFinite(k) && Number.isFinite(e)).toBe(true)
  })

  it('enums inválidos caem no default em vez de virar estado corrompido', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { mode: 'sabado', basis: 'ouro', lang: 'fr' }, version: 1 }),
    )
    vi.resetModules()
    const s = (await import('../store/useApp')).useApp.getState()
    expect(s.mode).toBe('didatico')
    expect(s.basis).toBe('nominal')
    expect(s.lang).toBe('pt')
  })

  it('JSON inválido não impede o app de subir', async () => {
    localStorage.setItem(STORAGE_KEY, '{{{ nao é json')
    vi.resetModules()
    const s = (await import('../store/useApp')).useApp.getState()
    expect(s.mode).toBe('didatico')
    expect(s.k).toBe(4)
  })

  it('hiddenFractions descarta chaves desconhecidas', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { hiddenFractions: ['produtivo', 'inventado', 42] }, version: 1 }),
    )
    vi.resetModules()
    const s = (await import('../store/useApp')).useApp.getState()
    expect(s.hiddenFractions).toEqual(['produtivo'])
  })

  it('?t= na URL tem prioridade sobre a aba salva (link compartilhável)', async () => {
    window.history.replaceState(null, '', '/?t=wealth')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { mode: 'avancado' }, version: 1 }))
    vi.resetModules()
    const s = (await import('../store/useApp')).useApp.getState()
    expect(s.tab).toBe('wealth')
    expect(s.mode).toBe('avancado') // preferência ainda reidratada
  })

  it('?t= desconhecido cai na home em vez de quebrar', async () => {
    window.history.replaceState(null, '', '/?t=nao-existe')
    vi.resetModules()
    const s = (await import('../store/useApp')).useApp.getState()
    expect(s.tab).toBe('home')
  })
})

describe('registro canônico de módulos', () => {
  it('cobre todas as abas com número, chave i18n e título curto', async () => {
    const { MODULES, TABS } = await import('../data/modules')
    for (const id of TABS) {
      const m = MODULES[id]
      expect(m).toBeDefined()
      expect(m.shortTitle.length).toBeGreaterThan(0)
      expect(m.component.length).toBeGreaterThan(0)
    }
  })

  it('numeração 01–10 é única e sem buracos; globe3d não tem número', async () => {
    const { MODULES, TABS } = await import('../data/modules')
    const nums = TABS.map((id) => MODULES[id].num).filter(Boolean)
    expect(nums).toHaveLength(10)
    expect(new Set(nums).size).toBe(10) // sem repetição
    expect([...nums].sort()).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'])
    expect(MODULES.globe3d.num).toBe('')
  })

  it('modRef/modTitle derivam o número (nada escrito à mão)', async () => {
    const { modRef, modTitle, modNum } = await import('../data/modules')
    expect(modNum('debt')).toBe('04')
    expect(modRef('debt')).toBe('Módulo 04')
    expect(modRef('debt', 'en')).toBe('Module 04')
    expect(modTitle('companies')).toBe('Módulo 05 · Raio-X das Empresas')
    /* sem número (globe3d) devolve o título curto, nunca "Módulo " */
    expect(modRef('globe3d')).toBe('Mapa 3D')
  })
})
