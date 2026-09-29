import type { QuoteRecord } from './types'
import { B3_UNIVERSE } from './universe'

type B3Entry = (typeof B3_UNIVERSE)[number]

/**
 * Adaptador BRAPI (brapi.dev) — cotações da B3.
 *
 * ── COMPORTAMENTO MEDIDO CONTRA A API REAL (2026-09-29) ──────────────────────
 * A documentação oficial diz "1 ação por requisição" no plano gratuito, mas a
 * prática é outra. A auditoria mediu chamando o endpoint diretamente:
 *
 *   • SEM TOKEN, apenas 4 tickers respondem: PETR4, VALE3, ITUB4 e MGLU3.
 *     Qualquer OUTRO ticker (inclusive USD-BRL) devolve
 *     `{"error":true,"code":"MISSING_TOKEN"}` — inclusive isolado.
 *   • Os 4 isentos podem ir juntos numa requisição (PETR4,VALE3 → HTTP 200).
 *   • COM TOKEN, o teto é o do plano: Startup 10 ações/requisição, Pro 20.
 *
 * O código anterior enviava ~128 tickers de uma vez e falhava com 401 para
 * qualquer visitante sem token. Aqui o caminho sem token é explícito: sincroniza
 * as 4 empresas isentas (ou as do universo que o token permitir).
 *
 * `marketCap` vem em BRL (moeda da cotação). O câmbio USD-BRL também exige
 * token no plano gratuito; sem ele, o app converte o que dá e sinaliza o resto.
 */

/** Tickers que a BRAPI isenta de token (medido: funcionam sem autenticação). */
export const ISENTOS = new Set(['PETR4', 'VALE3', 'ITUB4', 'MGLU3'])

/** Máximo de tickers por requisição com token (plano Pro = 20; Startup = 10). */
export const LOTE_COM_TOKEN = 20

/** Pausa entre lotes, para não estourar o teto de requisições por minuto. */
const PAUSA_MS = 350

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

function lotes<T>(arr: T[], tamanho: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += tamanho) out.push(arr.slice(i, i + tamanho))
  return out
}

interface BrapiResult {
  symbol?: string
  shortName?: string
  longName?: string
  regularMarketPrice?: number
  marketCap?: number
  priceEarnings?: number
  sector?: string | null
}

async function buscarLote(
  tickers: string[],
  token: string | undefined,
): Promise<{ results: BrapiResult[]; erro?: string }> {
  const url =
    `https://brapi.dev/api/quote/${tickers.join(',')}?fund=false&dividends=false` +
    (token ? `&token=${encodeURIComponent(token)}` : '')
  try {
    const res = await fetch(url)
    if (!res.ok) {
      const corpo = (await res.json().catch(() => null)) as { message?: string } | null
      return { results: [], erro: corpo?.message ?? `HTTP ${res.status}` }
    }
    const json = (await res.json()) as { results?: BrapiResult[] }
    return { results: json.results ?? [] }
  } catch (e) {
    /* erro de rede não pode derrubar o app: vira aviso */
    return { results: [], erro: e instanceof Error ? e.message : 'falha de rede' }
  }
}

const cambioDe = (rs: BrapiResult[]): number =>
  rs.find((r) => r.symbol === 'USD-BRL')?.regularMarketPrice ?? 0

function montarQuotes(
  resultados: BrapiResult[],
  byTicker: Map<string, B3Entry>,
): QuoteRecord[] {
  const fx = cambioDe(resultados)
  const quotes: QuoteRecord[] = []
  for (const r of resultados) {
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
      capTri: fx > 0 ? r.marketCap / fx / 1e12 : undefined,
      lucroBi:
        r.priceEarnings && r.priceEarnings > 0 ? r.marketCap / r.priceEarnings / 1e9 : undefined,
    })
  }
  return quotes
}

export async function fetchBrapiQuotes(token: string | undefined): Promise<{
  quotes: QuoteRecord[]
  errors: string[]
}> {
  const errors: string[] = []
  const byTicker = new Map(B3_UNIVERSE.map((t) => [t.ticker, t]))
  const universo = B3_UNIVERSE.map((t) => t.ticker)

  /* ── SEM TOKEN: só os 4 isentos respondem ─────────────────────────────── */
  if (!token) {
    const isentos = universo.filter((t) => ISENTOS.has(t))
    /* tenta os isentos + câmbio numa chamada; o câmbio exige token, então
       numa segunda chamada busca só os isentos */
    const primeira = await buscarLote([...isentos, 'USD-BRL'], undefined)
    const resultados = [...primeira.results]
    if (primeira.erro || !resultados.length) {
      const segunda = await buscarLote(isentos, undefined)
      resultados.length = 0
      resultados.push(...segunda.results)
    }
    if (!cambioDe(resultados)) {
      errors.push(
        'BRAPI: o câmbio USD-BRL exige token no plano gratuito — as cotações vieram em BRL e não foram convertidas para US$.',
      )
    }
    const quotes = montarQuotes(resultados, byTicker)
    if (!quotes.length) {
      errors.push('BRAPI: nenhuma cotação obtida. Cadastre um token para o universo completo.')
      return { quotes, errors }
    }
    return { quotes, errors }
  }

  /* ── COM TOKEN: universo completo, fatiado ────────────────────────────── */
  const grupos = lotes(universo, LOTE_COM_TOKEN)
  const resultados: BrapiResult[] = []
  let falhas = 0
  for (let i = 0; i < grupos.length; i++) {
    const lote = i === 0 ? [...grupos[i], 'USD-BRL'] : grupos[i]
    const { results, erro } = await buscarLote(lote, token)
    if (erro) {
      falhas++
      if (falhas === 1) errors.push(`BRAPI: ${erro} — verifique o token ou o limite do plano.`)
    }
    resultados.push(...results)
    if (i < grupos.length - 1) await esperar(PAUSA_MS)
  }
  if (falhas) errors.push(`BRAPI: ${falhas} de ${grupos.length} lotes falharam (cotações parciais).`)
  if (!cambioDe(resultados)) {
    errors.push('BRAPI: câmbio USD-BRL não veio no payload — caps não convertidas para US$.')
  }
  const quotes = montarQuotes(resultados, byTicker)
  if (!quotes.length) errors.push('BRAPI: nenhuma cotação recebida.')
  return { quotes, errors }
}
