import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  CACHE_KEY,
  SETTINGS_KEY,
  SESSION_TOKEN_KEY,
  TTL_MS,
  loadCachedQuotes,
  loadSyncSettings,
  saveSyncSettings,
  clearMarketCache,
  clearMarketCacheAndToken,
  isValidQuoteRecord,
  isValidSyncResult,
  quotesToRecords,
} from '../lib/marketApi/sync'
import type { QuoteRecord, SyncResult } from '../lib/marketApi/types'
import { COMPANIES_ALL } from '../data/companies'
import { mergeApiRecords } from '../components/CompaniesModule'

describe('AUD-008: Validação robusta de schema do cache (loadCachedQuotes)', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  const validQuote: QuoteRecord = {
    provider: 'brapi',
    ticker: 'PETR4',
    nome: 'Petrobras',
    pais: 'Brasil',
    setor: 'Petróleo e Gás',
    moeda: 'BRL',
    capTri: 0.45,
    receitaBi: 500,
    lucroBi: 120,
    funcionariosMil: 45,
  }

  const validPayload: SyncResult = {
    provider: 'brapi',
    at: Date.now() - 5000,
    quotes: [validQuote],
    errors: [],
  }

  it('carrega com sucesso payload válido dentro da janela TTL', () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(validPayload))
    const loaded = loadCachedQuotes()
    expect(loaded).not.toBeNull()
    expect(loaded?.provider).toBe('brapi')
    expect(loaded?.quotes).toHaveLength(1)
    expect(loaded?.quotes[0].ticker).toBe('PETR4')
  })

  it('rejeita JSON corrompido ou truncado e limpa o cache', () => {
    localStorage.setItem(CACHE_KEY, '{invalid-json: "trunc')
    const loaded = loadCachedQuotes()
    expect(loaded).toBeNull()
    expect(localStorage.getItem(CACHE_KEY)).toBeNull()
  })

  it('rejeita tipos primitivos ou inválidos na raiz do cache', () => {
    const invalidPrimitives = ['"string-pura"', '12345', 'true', 'false', 'null', '[]']
    for (const raw of invalidPrimitives) {
      localStorage.setItem(CACHE_KEY, raw)
      expect(loadCachedQuotes(), `Deveria rejeitar raiz: ${raw}`).toBeNull()
    }
  })

  it('rejeita provedor desconhecido ou inválido', () => {
    const payload = { ...validPayload, provider: 'yahoo_finance' }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
    expect(loadCachedQuotes()).toBeNull()

    const payloadNum = { ...validPayload, provider: 123 }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payloadNum))
    expect(loadCachedQuotes()).toBeNull()
  })

  it('rejeita timestamps não numéricos, NaN ou infinitos', () => {
    const invalidAts = [NaN, Infinity, -Infinity, '2026-10-01', null, undefined]
    for (const at of invalidAts) {
      const payload = { ...validPayload, at }
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
      expect(loadCachedQuotes(), `Deveria rejeitar timestamp: ${at}`).toBeNull()
    }
  })

  it('rejeita timestamps no futuro (tolerância máxima de 60s)', () => {
    const farFuture = Date.now() + 10 * 60 * 1000 // 10 minutos no futuro
    const payload = { ...validPayload, at: farFuture }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
    expect(loadCachedQuotes()).toBeNull()
  })

  it('rejeita timestamps expirados fora da janela TTL (24h)', () => {
    const expired = Date.now() - (TTL_MS + 5000)
    const payload = { ...validPayload, at: expired }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
    expect(loadCachedQuotes()).toBeNull()
  })

  it('rejeita timestamp negativo ou zero', () => {
    const payloadZero = { ...validPayload, at: 0 }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payloadZero))
    expect(loadCachedQuotes()).toBeNull()

    const payloadNeg = { ...validPayload, at: -5000 }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payloadNeg))
    expect(loadCachedQuotes()).toBeNull()
  })

  it('rejeita quando quotes não for array', () => {
    const invalidQuotes = [null, undefined, {}, 'lista', 123]
    for (const quotes of invalidQuotes) {
      const payload = { ...validPayload, quotes }
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
      expect(loadCachedQuotes(), `Deveria rejeitar quotes: ${typeof quotes}`).toBeNull()
    }
  })

  it('rejeita quotes contendo registros com schema inválido', () => {
    const invalidRecords = [
      null,
      {},
      { ...validQuote, ticker: '' }, // ticker vazio
      { ...validQuote, ticker: 123 }, // ticker não string
      { ...validQuote, nome: '   ' }, // nome em branco
      { ...validQuote, pais: '' }, // país vazio
      { ...validQuote, setor: '' }, // setor vazio
      { ...validQuote, moeda: 'EUR' }, // moeda não suportada
      { ...validQuote, provider: 'other' }, // provedor inválido
      { ...validQuote, capTri: -0.5 }, // capTri negativo
      { ...validQuote, capTri: NaN }, // capTri NaN
      { ...validQuote, receitaBi: -10 }, // receita negativa
      { ...validQuote, lucroBi: NaN }, // lucroBi NaN
      { ...validQuote, funcionariosMil: -5 }, // headcount negativo
    ]

    for (const badRecord of invalidRecords) {
      const payload = { ...validPayload, quotes: [badRecord] }
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
      expect(loadCachedQuotes(), `Deveria rejeitar registro inválido: ${JSON.stringify(badRecord)}`).toBeNull()
    }
  })

  it('fallback para base estática quando o cache é rejeitado ou ausente', () => {
    // 1. Sem cache
    localStorage.removeItem(CACHE_KEY)
    const cachedNone = loadCachedQuotes()
    expect(cachedNone).toBeNull()
    const recordsFromNone = cachedNone ? quotesToRecords(cachedNone) : []
    const mergedFromNone = mergeApiRecords(recordsFromNone)
    expect(mergedFromNone).toEqual(COMPANIES_ALL)

    // 2. Com cache corrompido
    localStorage.setItem(CACHE_KEY, '{corrompido')
    const cachedCorrupt = loadCachedQuotes()
    expect(cachedCorrupt).toBeNull()
    const recordsFromCorrupt = cachedCorrupt ? quotesToRecords(cachedCorrupt) : []
    const mergedFromCorrupt = mergeApiRecords(recordsFromCorrupt)
    expect(mergedFromCorrupt).toEqual(COMPANIES_ALL)
  })
})

describe('AUD-009: Mecanismo de limpeza e token em sessão', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('clearMarketCache remove apenas o cache de cotações', () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ provider: 'brapi', at: Date.now(), quotes: [] }))
    saveSyncSettings({ enabled: true, provider: 'brapi', token: 'token-teste' })

    clearMarketCache()
    expect(localStorage.getItem(CACHE_KEY)).toBeNull()
    expect(loadSyncSettings().token).toBe('token-teste')
  })

  it('clearMarketCacheAndToken remove cache e apaga o token armazenado', () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ provider: 'brapi', at: Date.now(), quotes: [] }))
    saveSyncSettings({ enabled: true, provider: 'brapi', token: 'token-secreto-123' })

    expect(loadSyncSettings().token).toBe('token-secreto-123')
    clearMarketCacheAndToken()

    expect(localStorage.getItem(CACHE_KEY)).toBeNull()
    expect(loadCachedQuotes()).toBeNull()
    expect(loadSyncSettings().token).toBe('')
    expect(sessionStorage.getItem(SESSION_TOKEN_KEY)).toBeNull()
  })

  it('quando sessionOnly=true, o token NUNCA é salvo no localStorage', () => {
    saveSyncSettings({
      enabled: true,
      provider: 'brapi',
      token: 'meu-token-sensivel',
      sessionOnly: true,
    })

    // No localStorage, o token deve estar vazio
    const rawLocal = localStorage.getItem(SETTINGS_KEY)
    expect(rawLocal).not.toBeNull()
    const parsedLocal = JSON.parse(rawLocal!)
    expect(parsedLocal.token).toBe('')
    expect(parsedLocal.sessionOnly).toBe(true)

    // Na sessão atual (sessionStorage), o token está disponível
    expect(sessionStorage.getItem(SESSION_TOKEN_KEY)).toBe('meu-token-sensivel')

    // loadSyncSettings() restaura o token da sessão
    const settings = loadSyncSettings()
    expect(settings.token).toBe('meu-token-sensivel')
    expect(settings.sessionOnly).toBe(true)
  })

  it('quando sessionOnly=false, o token é persistido em localStorage e limpo de sessionStorage', () => {
    // Primeiro salva em sessão
    saveSyncSettings({
      enabled: true,
      provider: 'brapi',
      token: 'token-sessao',
      sessionOnly: true,
    })
    expect(sessionStorage.getItem(SESSION_TOKEN_KEY)).toBe('token-sessao')

    // Agora salva persistente
    saveSyncSettings({
      enabled: true,
      provider: 'brapi',
      token: 'token-persistido',
      sessionOnly: false,
    })

    const rawLocal = localStorage.getItem(SETTINGS_KEY)
    const parsedLocal = JSON.parse(rawLocal!)
    expect(parsedLocal.token).toBe('token-persistido')
    expect(parsedLocal.sessionOnly).toBe(false)
    expect(sessionStorage.getItem(SESSION_TOKEN_KEY)).toBeNull()
  })

  it('tokens nunca são expostos em logs de erro ou payloads de cotação', () => {
    const sampleRecord: QuoteRecord = {
      provider: 'brapi',
      ticker: 'VALE3',
      nome: 'Vale',
      pais: 'Brasil',
      setor: 'Mineração',
      moeda: 'BRL',
      capTri: 0.3,
    }
    const rec = quotesToRecords({
      provider: 'brapi',
      at: Date.now(),
      quotes: [sampleRecord],
      errors: ['Erro simulado sem dados sensíveis'],
    })

    const serialized = JSON.stringify(rec)
    expect(serialized).not.toContain('token')
    expect(serialized).not.toContain('chave')
  })
})
