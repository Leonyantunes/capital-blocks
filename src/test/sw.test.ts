import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

describe('Service Worker - Gerenciamento e Isolamento de Cache (AUD-001)', () => {
  const swPath = path.resolve(process.cwd(), 'public/sw.js')
  const swCode = fs.readFileSync(swPath, 'utf-8')

  it('o arquivo sw.js existe e define CACHE como cb-v3 com namespaces controlados', () => {
    expect(swCode).toContain("const CACHE = 'cb-v3'")
    expect(swCode).toMatch(/cb-|capital-blocks-/)
  })

  it('ao disparar activate, remove caches antigos da aplicação (cb-v2) e preserva a versão atual (cb-v3) e caches de terceiros (other-app-cache)', async () => {
    const existingCacheKeys = [
      'cb-v1',
      'cb-v2',
      'cb-v3',
      'capital-blocks-v0',
      'other-app-cache',
      'my-blog-cache',
      'workbox-precache-origin'
    ]

    const deletedKeys: string[] = []
    const mockCaches = {
      keys: vi.fn().mockResolvedValue([...existingCacheKeys]),
      delete: vi.fn().mockImplementation((key: string) => {
        deletedKeys.push(key)
        return Promise.resolve(true)
      }),
      open: vi.fn().mockResolvedValue({
        addAll: vi.fn().mockResolvedValue(undefined),
        put: vi.fn().mockResolvedValue(undefined)
      }),
      match: vi.fn().mockResolvedValue(undefined)
    }

    const listeners: Record<string, (event: any) => void> = {}
    const mockSelf = {
      location: new URL('https://capitalblocks.org/sw.js'),
      addEventListener: vi.fn().mockImplementation((event: string, callback: any) => {
        listeners[event] = callback
      }),
      skipWaiting: vi.fn(),
      clients: {
        claim: vi.fn().mockResolvedValue(undefined)
      }
    }

    // Executa sw.js em sandbox seguro com mock do ServiceWorkerGlobalScope
    const context = vm.createContext({
      self: mockSelf,
      caches: mockCaches,
      URL,
      Promise,
      fetch: vi.fn().mockResolvedValue(new Response())
    })

    vm.runInContext(swCode, context)

    expect(listeners['activate']).toBeDefined()

    // Simula evento 'activate'
    let waitUntilPromise: Promise<any> | null = null
    const activateEvent = {
      waitUntil: vi.fn().mockImplementation((promise: Promise<any>) => {
        waitUntilPromise = promise
      })
    }

    listeners['activate'](activateEvent)
    expect(activateEvent.waitUntil).toHaveBeenCalled()
    await waitUntilPromise

    // Verifica que clients.claim foi acionado
    expect(mockSelf.clients.claim).toHaveBeenCalled()

    // Validação estrita do AUD-001:
    // Caches da aplicação que não são a versão atual ('cb-v3') DEVEM ser removidos:
    expect(deletedKeys).toContain('cb-v2')
    expect(deletedKeys).toContain('cb-v1')
    expect(deletedKeys).toContain('capital-blocks-v0')

    // Caches da versão atual ('cb-v3') NUNCA devem ser removidos:
    expect(deletedKeys).not.toContain('cb-v3')

    // Caches de outras aplicações na mesma origem NUNCA devem ser deletados:
    expect(deletedKeys).not.toContain('other-app-cache')
    expect(deletedKeys).not.toContain('my-blog-cache')
    expect(deletedKeys).not.toContain('workbox-precache-origin')

    // Conjunto exato de remoções
    expect(deletedKeys.sort()).toEqual(['capital-blocks-v0', 'cb-v1', 'cb-v2'].sort())
  })

  it('não deleta nada se apenas a versão ativa e caches de terceiros existirem', async () => {
    const existingCacheKeys = ['cb-v3', 'other-app-cache']
    const deletedKeys: string[] = []

    const mockCaches = {
      keys: vi.fn().mockResolvedValue([...existingCacheKeys]),
      delete: vi.fn().mockImplementation((key: string) => {
        deletedKeys.push(key)
        return Promise.resolve(true)
      }),
      open: vi.fn(),
      match: vi.fn()
    }

    const listeners: Record<string, (event: any) => void> = {}
    const mockSelf = {
      location: new URL('https://capitalblocks.org/sw.js'),
      addEventListener: vi.fn().mockImplementation((event: string, callback: any) => {
        listeners[event] = callback
      }),
      skipWaiting: vi.fn(),
      clients: {
        claim: vi.fn().mockResolvedValue(undefined)
      }
    }

    const context = vm.createContext({
      self: mockSelf,
      caches: mockCaches,
      URL,
      Promise,
      fetch: vi.fn()
    })

    vm.runInContext(swCode, context)

    let waitUntilPromise: Promise<any> | null = null
    const activateEvent = {
      waitUntil: vi.fn().mockImplementation((promise: Promise<any>) => {
        waitUntilPromise = promise
      })
    }

    listeners['activate'](activateEvent)
    await waitUntilPromise

    expect(deletedKeys).toEqual([])
    expect(mockCaches.delete).not.toHaveBeenCalled()
  })
})
