/**
 * Testes do adaptador BRAPI.
 *
 * O comportamento foi MEDIDO contra a API real em 2026-09-29, e a medição
 * contradiz a documentação oficial: sem token, respondem APENAS 4 tickers
 * (PETR4, VALE3, ITUB4, MGLU3). Qualquer outro — inclusive USD-BRL — devolve
 * MISSING_TOKEN, mesmo em requisição isolada. O código antigo enviava ~128
 * tickers de uma vez e falhava com 401 para todo visitante sem token.
 *
 * Estes testes travam exatamente esse comportamento medido.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockFetch = vi.fn()

const ISENTOS = ['PETR4', 'VALE3', 'ITUB4', 'MGLU3']

/** Resposta bem-sucedida da BRAPI. */
function ok(symbols: string[], fx = 5.4) {
  return {
    ok: true,
    json: async () => ({
      results: [
        ...symbols
          .filter((s) => s !== 'USD-BRL')
          .map((s) => ({
            symbol: s,
            longName: s,
            regularMarketPrice: 10,
            marketCap: 1_000_000_000_000,
            priceEarnings: 10,
          })),
        ...(symbols.includes('USD-BRL') ? [{ symbol: 'USD-BRL', regularMarketPrice: fx }] : []),
      ],
    }),
  }
}

/** Resposta de erro da BRAPI. */
function err(message = 'Token de autenticação não fornecido') {
  return { ok: false, status: 401, json: async () => ({ error: true, message, code: 'MISSING_TOKEN' }) }
}

/** Emula a API real: sem token, só os 4 isentos respondem. */
function mockApiReal() {
  mockFetch.mockImplementation((url: string) => {
    const path = String(url).split('/quote/')[1].split('?')[0]
    const temToken = String(url).includes('token=')
    const syms = path.split(',').filter(Boolean)
    if (!temToken && syms.some((s) => s !== 'USD-BRL' && !ISENTOS.includes(s))) {
      return Promise.resolve(err())
    }
    if (!temToken && syms.includes('USD-BRL')) {
      /* o câmbio exige token no plano gratuito */
      const semCambio = syms.filter((s) => s !== 'USD-BRL')
      return semCambio.length ? Promise.resolve(ok(semCambio)) : Promise.resolve(err())
    }
    return Promise.resolve(ok(syms))
  })
}

beforeEach(() => {
  vi.resetModules()
  mockFetch.mockReset()
  vi.stubGlobal('fetch', mockFetch)
})
afterEach(() => vi.unstubAllGlobals())

describe('BRAPI sem token — só os 4 isentos (comportamento medido)', () => {
  it('sincroniza exclusivamente os 4 isentos, mesmo tendo 128 no universo', async () => {
    mockApiReal()
    const { fetchBrapiQuotes } = await import('../lib/marketApi/brapi')
    const { quotes } = await fetchBrapiQuotes(undefined)

    expect(mockFetch).toHaveBeenCalled()
    expect(quotes.length).toBeGreaterThan(0)
    for (const q of quotes) {
      expect(ISENTOS, `${q.ticker} não deveria vir sem token`).toContain(q.ticker)
    }
  })

  it('nenhuma requisição envia ticker não-isento sem token', async () => {
    mockApiReal()
    const { fetchBrapiQuotes } = await import('../lib/marketApi/brapi')
    await fetchBrapiQuotes(undefined)
    for (const [url] of mockFetch.mock.calls) {
      const u = String(url)
      expect(u, 'token não deveria ser enviado quando não há').not.toContain('token=')
      const path = u.split('/quote/')[1].split('?')[0]
      for (const s of path.split(',').filter(Boolean)) {
        if (s === 'USD-BRL') continue // tentativa de câmbio, tolerada
        expect(ISENTOS, `${s} enviado sem token`).toContain(s)
      }
    }
  })

  it('avisa que o câmbio exige token e que o universo está parcial', async () => {
    mockApiReal()
    const { fetchBrapiQuotes } = await import('../lib/marketApi/brapi')
    const { quotes, errors } = await fetchBrapiQuotes(undefined)
    const texto = errors.join(' ')

    expect(quotes.length).toBeGreaterThan(0)
    /* sem câmbio, capTri não pode ser inventado */
    expect(texto).toMatch(/câmbio|USD-BRL|token/i)
    for (const q of quotes) expect(q.capTri).toBeUndefined()
  })
})

describe('BRAPI com token — universo completo e fatiado', () => {
  it('cobre os 4 isentos e converte cap para US$ usando o câmbio', async () => {
    mockApiReal()
    const { fetchBrapiQuotes } = await import('../lib/marketApi/brapi')
    const { quotes, errors } = await fetchBrapiQuotes('token-de-teste')

    expect(quotes.length).toBeGreaterThanOrEqual(4)
    /* com token o câmbio vem → capTri convertido (R$ 1 tri / 5,4) */
    const comCap = quotes.find((q) => q.capTri !== undefined)
    expect(comCap, 'nenhuma cotação convertida para US$').toBeDefined()
    expect(comCap!.capTri!).toBeCloseTo(1 / 5.4, 4)
    expect(errors.join(' ')).not.toMatch(/nenhuma cotação/i)
  })

  it('respeita o teto de 20 tickers por requisição', async () => {
    mockApiReal()
    const { fetchBrapiQuotes, LOTE_COM_TOKEN } = await import('../lib/marketApi/brapi')
    const { B3_UNIVERSE } = await import('../lib/marketApi/universe')

    await fetchBrapiQuotes('token-de-teste')
    for (const [url] of mockFetch.mock.calls) {
      const path = String(url).split('/quote/')[1].split('?')[0]
      /* +1 porque a 1ª leva o USD-BRL junto */
      expect(path.split(',').filter(Boolean).length).toBeLessThanOrEqual(LOTE_COM_TOKEN + 1)
    }
    /* universo maior que um lote → múltiplas requisições */
    expect(B3_UNIVERSE.length).toBeGreaterThan(LOTE_COM_TOKEN)
  })
})

describe('BRAPI — resiliência', () => {
  it('token inválido: informa o erro sem quebrar a aplicação', async () => {
    mockFetch.mockResolvedValue(err('Token inválido'))
    const { fetchBrapiQuotes } = await import('../lib/marketApi/brapi')
    const { quotes, errors } = await fetchBrapiQuotes('token-errado')
    expect(quotes.length).toBe(0)
    expect(errors.join(' ')).toMatch(/token/i)
  })

  it('falha de rede vira aviso, não exceção (o app não pode quebrar)', async () => {
    mockFetch.mockRejectedValue(new Error('rede caiu'))
    const { fetchBrapiQuotes } = await import('../lib/marketApi/brapi')
    const { quotes, errors } = await fetchBrapiQuotes('token-de-teste')
    expect(quotes.length).toBe(0)
    expect(errors.length).toBeGreaterThan(0)
  })
})
