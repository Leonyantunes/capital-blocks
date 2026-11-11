import { sectorEstimate } from '../companyMetrics'
import type { CompanyRecord } from '../../data/companies'
import type { ApiProvider, MarketSyncSettings, QuoteRecord, SyncResult } from './types'
import { fetchBrapiQuotes } from './brapi'
import { fetchAvQuotes } from './alphavantage'

/**
 * ORQUESTRADOR DA SINCRONIZAÇÃO DINÂMICA (Raio-X).
 *
 * • Desligada por padrão; settings persistidos em localStorage.
 * • Cotações em cache por 24 h — recarregar a página NÃO refaz chamadas.
 * • Registros de API viram CompanyRecord com `origem: 'api'` + estimate,
 *   completando fundamentais ausentes com estimativas setoriais
 *   (margem líquida e parcela da folha — ver lib/companyMetrics.ts).
 */

export const SETTINGS_KEY = 'cb.marketSync.v1'
export const CACHE_KEY = 'cb.marketQuotes.v1'
export const SESSION_TOKEN_KEY = 'cb.marketSync.sessionToken.v1'
export const TTL_MS = 24 * 60 * 60 * 1000

/** P/S assumido quando só há cap disponível (receita ≈ cap ÷ PS). */
export const PS_DEFAULT = 2.5

export function loadSyncSettings(): MarketSyncSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    let sessionToken = ''
    try {
      sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY) ?? ''
    } catch {
      /* sessionStorage indisponível */
    }

    if (!raw) {
      return {
        enabled: false,
        provider: 'brapi',
        token: sessionToken,
        sessionOnly: Boolean(sessionToken),
      }
    }
    const p = JSON.parse(raw) as Partial<MarketSyncSettings>
    const sessionOnly = !!p.sessionOnly
    const token = sessionOnly
      ? sessionToken
      : (typeof p.token === 'string' ? p.token : '')

    return {
      enabled: !!p.enabled,
      provider: p.provider === 'alphavantage' ? 'alphavantage' : 'brapi',
      token,
      sessionOnly,
    }
  } catch {
    return { enabled: false, provider: 'brapi', token: '', sessionOnly: false }
  }
}

export function saveSyncSettings(s: MarketSyncSettings): void {
  try {
    const sessionOnly = !!s.sessionOnly
    // Quando sessionOnly for true, o token NUNCA é salvo no localStorage (AUD-009)
    const toStore = {
      enabled: !!s.enabled,
      provider: s.provider === 'alphavantage' ? 'alphavantage' : 'brapi',
      sessionOnly,
      token: sessionOnly ? '' : (typeof s.token === 'string' ? s.token : ''),
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(toStore))

    try {
      if (sessionOnly && s.token) {
        sessionStorage.setItem(SESSION_TOKEN_KEY, s.token)
      } else {
        sessionStorage.removeItem(SESSION_TOKEN_KEY)
      }
    } catch {
      /* ignore */
    }
  } catch {
    /* storage cheio/bloqueado: segue sem persistir */
  }
}

/** Validador de schema para um registro de cotação individual (AUD-008). */
export function isValidQuoteRecord(q: unknown): q is QuoteRecord {
  if (!q || typeof q !== 'object' || Array.isArray(q)) return false
  const rec = q as Record<string, unknown>
  if (typeof rec.ticker !== 'string' || !rec.ticker.trim()) return false
  if (typeof rec.nome !== 'string' || !rec.nome.trim()) return false
  if (typeof rec.pais !== 'string' || !rec.pais.trim()) return false
  if (typeof rec.setor !== 'string' || !rec.setor.trim()) return false
  if (rec.moeda !== 'BRL' && rec.moeda !== 'USD') return false
  if (rec.provider !== 'brapi' && rec.provider !== 'alphavantage') return false

  if (rec.capTri !== undefined && (typeof rec.capTri !== 'number' || !Number.isFinite(rec.capTri) || rec.capTri < 0)) {
    return false
  }
  if (rec.receitaBi !== undefined && (typeof rec.receitaBi !== 'number' || !Number.isFinite(rec.receitaBi) || rec.receitaBi < 0)) {
    return false
  }
  if (rec.lucroBi !== undefined && (typeof rec.lucroBi !== 'number' || !Number.isFinite(rec.lucroBi))) {
    return false
  }
  if (rec.funcionariosMil !== undefined && (typeof rec.funcionariosMil !== 'number' || !Number.isFinite(rec.funcionariosMil) || rec.funcionariosMil < 0)) {
    return false
  }
  return true
}

/** Validador de schema para o payload completo em cache (AUD-008). */
export function isValidSyncResult(data: unknown): data is SyncResult {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  const res = data as Record<string, unknown>
  if (res.provider !== 'brapi' && res.provider !== 'alphavantage') return false
  if (typeof res.at !== 'number' || !Number.isFinite(res.at) || Number.isNaN(res.at)) return false

  const now = Date.now()
  // Não pode ser no futuro (tolerância máxima de 60s para clock skew)
  if (res.at > now + 60_000) return false
  // Não pode estar fora da janela TTL de 24h
  if (now - res.at > TTL_MS) return false
  if (res.at <= 0) return false

  if (!Array.isArray(res.quotes)) return false
  for (const q of res.quotes) {
    if (!isValidQuoteRecord(q)) return false
  }
  return true
}

export function loadCachedQuotes(): SyncResult | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!isValidSyncResult(parsed)) {
      // Rejeita cache corrompido/inválido com segurança e limpa localStorage
      try {
        localStorage.removeItem(CACHE_KEY)
      } catch {
        /* ignore */
      }
      return null
    }
    return {
      provider: parsed.provider,
      at: parsed.at,
      quotes: parsed.quotes,
      errors: Array.isArray(parsed.errors)
        ? parsed.errors.filter((e): e is string => typeof e === 'string')
        : [],
    }
  } catch {
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch {
      /* ignore */
    }
    return null
  }
}

export function saveCachedQuotes(res: SyncResult): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(res))
  } catch {
    /* idem */
  }
}

/** Limpa exclusivamente o cache de cotações em localStorage (AUD-009). */
export function clearMarketCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    /* ignore */
  }
}

/** Limpa tanto o cache de cotações quanto o token armazenado (AUD-009). */
export function clearMarketCacheAndToken(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY)
  } catch {
    /* ignore */
  }
  try {
    const current = loadSyncSettings()
    saveSyncSettings({ ...current, token: '', sessionOnly: false })
  } catch {
    /* ignore */
  }
}

export async function runSync(provider: ApiProvider, token: string): Promise<SyncResult> {
  const { quotes, errors } =
    provider === 'brapi'
      ? await fetchBrapiQuotes(token || undefined)
      : await fetchAvQuotes(token, 20)

  const res: SyncResult = { provider, at: Date.now(), quotes, errors }
  if (quotes.length) saveCachedQuotes(res)
  return res
}

/** Converte cotações normalizadas em registros do Raio-X (estimativas sinalizadas). */
export function quotesToRecords(res: SyncResult): CompanyRecord[] {
  return res.quotes.map((q) => recordFromQuote(q, res.at))
}

export function recordFromQuote(q: QuoteRecord, at: number): CompanyRecord {
  const est = sectorEstimate(q.setor)
  const fonteData = new Date(at).toLocaleDateString('pt-BR')
  const fonte = `${q.provider === 'brapi' ? 'BRAPI/B3' : 'Alpha Vantage'} · ${fonteData}`

  // receita: direto da API → senão deriva do cap via P/S assumido
  const receitaBi = q.receitaBi ?? (q.capTri !== undefined ? q.capTri * 1000 / PS_DEFAULT : 0)
  // lucro: direto → senão margem setorial sobre a receita estimada
  const lucroBi = q.lucroBi ?? (receitaBi > 0 ? receitaBi * est.margem : 0)
  // folha: share setorial da receita; salário médio só quando há headcount
  const vFolhaBi = receitaBi * est.folha
  const emp = q.funcionariosMil ?? 0
  const salarioMedioK = emp > 0 ? (vFolhaBi * 1e6) / emp / 1000 : 0

  return {
    id: `api-${q.provider}-${q.ticker}`,
    nome: q.nome,
    pais: q.pais,
    setor: q.setor,
    mercado: q.provider === 'brapi' ? 'BR' : 'GLOBAL',
    moeda: q.moeda,
    ticker: q.ticker,
    receitaBi,
    lucroBi,
    funcionariosMil: emp,
    salarioMedioK,
    capTri: q.capTri,
    fonte,
    nota: 'Fundamentais ausentes estimados por margem/folha setoriais (P/S ≈ 2,5)',
    estimate: true,
    origem: 'api',
  }
}
