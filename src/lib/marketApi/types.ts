/** Tipos compartilhados das fontes dinâmicas de mercado (Raio-X — ver `data/modules.ts`). */

export type ApiProvider = 'brapi' | 'alphavantage'

/** Registro normalizado vindo de uma API de mercado. */
export interface QuoteRecord {
  provider: ApiProvider
  ticker: string
  nome: string
  pais: string
  setor: string
  moeda: 'BRL' | 'USD'
  /** valor de mercado convertido em US$ trilhões */
  capTri?: number
  /** fundamentais quando a fonte fornece */
  receitaBi?: number
  lucroBi?: number
  funcionariosMil?: number
}

export interface SyncResult {
  provider: ApiProvider
  /** epoch ms da sincronização */
  at: number
  quotes: QuoteRecord[]
  errors: string[]
}

export interface MarketSyncSettings {
  /** DESLIGADO por padrão — o usuário liga explicitamente na página do Raio-X */
  enabled: boolean
  provider: ApiProvider
  token: string
}
