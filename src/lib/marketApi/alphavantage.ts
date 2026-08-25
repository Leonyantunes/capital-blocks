import type { QuoteRecord } from './types'
import { GLOBAL_EXTRA_UNIVERSE } from './universe'

/**
 * Adaptador Alpha Vantage — OVERVIEW traz fundamentais completos por ticker:
 * MarketCapitalization, RevenueTTM, ProfitMargin, FullTimeEmployees…
 * Cota gratuita ≈25 req/dia: sincronizamos em lote com parada amigável
 * quando a chave estoura o limite (retomando no dia seguinte).
 */

const BASE = 'https://www.alphavantage.co/query'

interface AvOverview {
  Name?: string
  Country?: string
  Sector?: string
  MarketCapitalization?: string
  RevenueTTM?: string
  ProfitMargin?: string
  FullTimeEmployees?: string
  EBITDA?: string
  Note?: string
  Information?: string
  'Error Message'?: string
}

/** Busca até `maxTickers` OVERVIEWs; para no primeiro sinal de rate-limit. */
export async function fetchAvQuotes(
  apiKey: string,
  maxTickers = 20,
): Promise<{ quotes: QuoteRecord[]; errors: string[] }> {
  const errors: string[] = []
  const quotes: QuoteRecord[] = []

  for (const { ticker, setor } of GLOBAL_EXTRA_UNIVERSE.slice(0, maxTickers)) {
    let data: AvOverview
    try {
      const res = await fetch(`${BASE}?function=OVERVIEW&symbol=${ticker}&apikey=${encodeURIComponent(apiKey)}`)
      if (!res.ok) {
        errors.push(`AV ${ticker}: HTTP ${res.status}`)
        continue
      }
      data = (await res.json()) as AvOverview
    } catch {
      errors.push(`AV ${ticker}: falha de rede`)
      continue
    }
    if (data.Note || data.Information) {
      errors.push('Alpha Vantage: limite diário da chave atingido — sincronize o restante amanhã')
      break
    }
    if (data['Error Message']) {
      errors.push(`AV ${ticker}: símbolo rejeitado`)
      continue
    }
    const cap = Number(data.MarketCapitalization)
    if (!Number.isFinite(cap) || cap <= 0) continue // sem overview útil
    const receitaBi = Number(data.RevenueTTM) / 1e9
    const margem = Number(data.ProfitMargin)
    const ebitdaBi = Number(data.EBITDA) / 1e9
    const lucroBi = Number.isFinite(receitaBi) && Number.isFinite(margem)
      ? receitaBi * margem
      : Number.isFinite(ebitdaBi)
        ? ebitdaBi * 0.6 // aproximação EBITDA→líquido (juros/impostos/deprec. residuais)
        : undefined
    const empMil = Number(data.FullTimeEmployees) / 1000
    quotes.push({
      provider: 'alphavantage',
      ticker,
      nome: data.Name ?? ticker,
      pais: data.Country ?? '—',
      setor: data.Sector || setor,
      moeda: 'USD',
      capTri: cap / 1e12,
      receitaBi: Number.isFinite(receitaBi) && receitaBi > 0 ? receitaBi : undefined,
      lucroBi: lucroBi !== undefined && lucroBi > -1e9 ? lucroBi : undefined,
      funcionariosMil: Number.isFinite(empMil) && empMil > 0 ? empMil : undefined,
    })
  }
  return { quotes, errors }
}
