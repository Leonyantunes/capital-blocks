import type { QuoteRecord } from './types'
import { B3_UNIVERSE } from './universe'

/**
 * Adaptador BRAPI (brapi.dev) — cotações da B3 em UMA chamada batched.
 * Campos usados do payload: marketCap, priceEarnings, shortName/longName.
 * O ticker USD-BRL na mesma chamada dá o câmbio p/ converter cap → US$.
 */

interface BrapiResult {
  symbol?: string
  shortName?: string
  longName?: string
  regularMarketPrice?: number
  marketCap?: number
  priceEarnings?: number
  sector?: string | null
}

export async function fetchBrapiQuotes(token: string | undefined): Promise<{
  quotes: QuoteRecord[]
  errors: string[]
}> {
  const errors: string[] = []
  const tickers = [...B3_UNIVERSE.map((t) => t.ticker), 'USD-BRL']
  const url =
    `https://brapi.dev/api/quote/${tickers.join(',')}?fund=false&dividends=false` +
    (token ? `&token=${encodeURIComponent(token)}` : '')

  const res = await fetch(url)
  if (!res.ok) {
    const detail = res.status === 401 ? 'token inválido ou limite diário atingido' : `HTTP ${res.status}`
    throw new Error(`BRAPI: ${detail}`)
  }
  const json = (await res.json()) as { results?: BrapiResult[] }
  const results = json.results ?? []

  const fx = results.find((r) => r.symbol === 'USD-BRL')?.regularMarketPrice
  if (!fx || fx <= 0) errors.push('BRAPI: câmbio USD-BRL ausente — caps não convertidos')

  const byTicker = new Map(B3_UNIVERSE.map((t) => [t.ticker, t]))
  const quotes: QuoteRecord[] = []
  for (const r of results) {
    const sym = r.symbol ?? ''
    if (!sym || sym === 'USD-BRL' || r.marketCap === undefined) continue
    const meta = byTicker.get(sym)
    quotes.push({
      provider: 'brapi',
      ticker: sym,
      nome: meta?.nome ?? r.shortName ?? r.longName ?? sym,
      pais: 'Brasil',
      setor: meta?.setor ?? r.sector ?? 'Outros',
      moeda: 'BRL',
      capTri: fx ? r.marketCap / fx / 1e12 : undefined,
      lucroBi: r.priceEarnings && r.priceEarnings > 0 ? r.marketCap / r.priceEarnings / 1e9 : undefined,
    })
  }
  if (!quotes.length) errors.push('BRAPI: nenhuma cotação recebida')
  return { quotes, errors }
}
