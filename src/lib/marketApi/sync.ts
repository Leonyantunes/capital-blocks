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

const SETTINGS_KEY = 'cb.marketSync.v1'
const CACHE_KEY = 'cb.marketQuotes.v1'
const TTL_MS = 24 * 60 * 60 * 1000

/** P/S assumido quando só há cap disponível (receita ≈ cap ÷ PS). */
export const PS_DEFAULT = 2.5

export function loadSyncSettings(): MarketSyncSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { enabled: false, provider: 'brapi', token: '' }
    const p = JSON.parse(raw) as Partial<MarketSyncSettings>
    return {
      enabled: !!p.enabled,
      provider: p.provider === 'alphavantage' ? 'alphavantage' : 'brapi',
      token: typeof p.token === 'string' ? p.token : '',
    }
  } catch {
    return { enabled: false, provider: 'brapi', token: '' }
  }
}

export function saveSyncSettings(s: MarketSyncSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
  } catch {
    /* storage cheio/bloqueado: segue sem persistir */
  }
}

export function loadCachedQuotes(): SyncResult | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SyncResult
    if (!parsed?.quotes || Date.now() - parsed.at > TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function saveCachedQuotes(res: SyncResult): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(res))
  } catch {
    /* idem */
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
