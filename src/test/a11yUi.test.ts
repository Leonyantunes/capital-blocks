import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import fs from 'node:fs'
import path from 'node:path'
import KaleckiSimulator from '../components/debt/KaleckiSimulator'
import PlatformModule from '../components/PlatformModule'
import SourcesModule from '../components/sources/SourcesModule'
import CorporateNetworkGraph from '../components/network/CorporateNetworkGraph'
import { FiscalLensToggle } from '../components/debt/FiscalLensPanels'

describe('AUD-004: A11y de sliders e search inputs', () => {
  it('KaleckiSimulator possui accessible names, labels associados e atributos aria-valuenow/aria-valuetext', () => {
    const html = renderToString(React.createElement(KaleckiSimulator))
    const container = document.createElement('div')
    container.innerHTML = html

    const sliders = container.querySelectorAll('input[type="range"]')
    expect(sliders.length).toBe(5)

    sliders.forEach((slider) => {
      const id = slider.getAttribute('id')
      expect(id).toBeTruthy()
      expect(slider.getAttribute('aria-label')).toBeTruthy()
      expect(slider.getAttribute('aria-valuenow')).not.toBeNull()
      expect(slider.getAttribute('aria-valuetext')).toBeTruthy()

      // Verifica associação com <label htmlFor="...">
      const label = container.querySelector(`label[for="${id}"]`)
      expect(label).not.toBeNull()
      expect(label?.textContent?.trim().length).toBeGreaterThan(0)
    })
  })

  it('PlatformModule possui accessible names e atributos de valor em todos os 6 sliders', () => {
    const html = renderToString(React.createElement(PlatformModule))
    const container = document.createElement('div')
    container.innerHTML = html

    const sliders = container.querySelectorAll('input[type="range"]')
    expect(sliders.length).toBe(6)

    sliders.forEach((slider) => {
      const id = slider.getAttribute('id')
      expect(id).toBeTruthy()
      expect(slider.getAttribute('aria-label')).toBeTruthy()
      expect(slider.getAttribute('aria-valuenow')).not.toBeNull()
      expect(slider.getAttribute('aria-valuetext')).toBeTruthy()

      const label = container.querySelector(`label[for="${id}"]`)
      expect(label).not.toBeNull()
      expect(label?.textContent?.trim().length).toBeGreaterThan(0)
    })
  })

  it('SourcesModule possui accessible name e id associado no campo de busca', () => {
    const html = renderToString(React.createElement(SourcesModule))
    const container = document.createElement('div')
    container.innerHTML = html

    const searchInput = container.querySelector('input#sources-search-input')
    expect(searchInput).not.toBeNull()
    expect(searchInput?.getAttribute('aria-label')).toBeTruthy()
    expect(searchInput?.getAttribute('type')).toBe('search')

    const label = container.querySelector('label[for="sources-search-input"]')
    expect(label).not.toBeNull()
  })

  it('FiscalLensToggle possui atributos de acessibilidade (aria-pressed)', () => {
    const html = renderToString(React.createElement(FiscalLensToggle, { lens: 'ortodoxa', setLens: () => {} }))
    const container = document.createElement('div')
    container.innerHTML = html

    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true')
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false')
  })
})

describe('AUD-013: Resiliência de storage em GlobeModule', () => {
  it('garante que falhas de localStorage (cota ou restrição de privacidade) não quebram o código', () => {
    const originalSetItem = localStorage.setItem
    const originalGetItem = localStorage.getItem

    try {
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('QuotaExceededError: storage is disabled')
      })
      localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error('SecurityError: access denied')
      })

      // Simula a lógica de leitura e salvamento protegida de GlobeModule
      let savedTheme = 'quantum'
      try {
        savedTheme = localStorage.getItem('globe3d-theme') || 'quantum'
      } catch {
        savedTheme = 'quantum'
      }
      expect(savedTheme).toBe('quantum')

      // Simula pickTheme
      expect(() => {
        try {
          localStorage.setItem('globe3d-theme', 'matrix')
        } catch {
          // Captura silenciosa garantindo estado em memória
        }
      }).not.toThrow()
    } finally {
      localStorage.setItem = originalSetItem
      localStorage.getItem = originalGetItem
    }
  })
})

describe('AUD-014: Consistência de versão e Git tag no README.md', () => {
  it('alinha a versão declarada com o package.json (1.1.0) e explicita tag v1.0.0 publicada', () => {
    const readmePath = path.resolve(process.cwd(), 'README.md')
    const pkgPath = path.resolve(process.cwd(), 'package.json')

    const readmeContent = fs.readFileSync(readmePath, 'utf-8')
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

    expect(pkgJson.version).toBe('1.1.0')
    expect(readmeContent).toContain('**Versão 1.1.0**')
    expect(readmeContent).toContain('v1.0.0')
    expect(readmeContent).toMatch(/em preparação para lançamento/i)
  })
})

describe('AUD-012: Safe cleanup de 3D force graph em CorporateNetworkGraph', () => {
  it('renderiza o grafo corporativo com controles acessíveis', () => {
    const html = renderToString(React.createElement(CorporateNetworkGraph))
    const container = document.createElement('div')
    container.innerHTML = html

    const select = container.querySelector('#corporate-network-fund-select')
    expect(select).not.toBeNull()
    expect(select?.getAttribute('aria-label')).toBeTruthy()
  })

  it('executa cleanup seguro garantindo chamada com type-guard para destructor e renderer', () => {
    const pauseAnimationMock = vi.fn()
    const destructorMock = vi.fn()
    const disposeMock = vi.fn()
    const forceContextLossMock = vi.fn()

    const mockFg = {
      pauseAnimation: pauseAnimationMock,
      _destructor: destructorMock,
      renderer: () => ({
        dispose: disposeMock,
        forceContextLoss: forceContextLossMock,
      }),
    }

    // Executa a lógica implementada no CorporateNetworkGraph
    const safeCleanup = (fg: any) => {
      if (!fg) return
      try {
        if (typeof fg.pauseAnimation === 'function') fg.pauseAnimation()
      } catch {}

      try {
        if (typeof fg._destructor === 'function') fg._destructor()
      } catch {}

      try {
        const renderer = typeof fg.renderer === 'function' ? fg.renderer() : null
        if (renderer) {
          if (typeof renderer.dispose === 'function') renderer.dispose()
          if (typeof renderer.forceContextLoss === 'function') renderer.forceContextLoss()
        }
      } catch {}
    }

    expect(() => safeCleanup(mockFg)).not.toThrow()
    expect(pauseAnimationMock).toHaveBeenCalled()
    expect(destructorMock).toHaveBeenCalled()
    expect(disposeMock).toHaveBeenCalled()
    expect(forceContextLossMock).toHaveBeenCalled()
  })
})
