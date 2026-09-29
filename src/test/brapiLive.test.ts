/**
 * Validação do adaptador BRAPI contra a API REAL (não mock).
 * Executa o módulo TS compilado via esbuild-less: importa direto do fonte
 * usando o runtime do Vite não é possível em node puro, então este script
 * roda através de vitest como teste de integração marcado.
 */
import { describe, it, expect } from 'vitest'

/* Teste de integração real — só roda quando BRAPI_LIVE=1 para não
   gastar cota da API a cada npm test. */
const LIVE = process.env.BRAPI_LIVE === '1'

describe.skipIf(!LIVE)('BRAPI — integração real', () => {
  it('obtém cotações reais dos 4 isentos no plano gratuito', async () => {
    const { fetchBrapiQuotes } = await import('../lib/marketApi/brapi')
    const t0 = Date.now()
    const { quotes, errors } = await fetchBrapiQuotes(undefined)
    const ms = Date.now() - t0

    console.log(`[live] ${ms}ms · ${quotes.length} cotações · avisos: ${errors.length}`)
    for (const q of quotes) {
      console.log(`[live]   ${q.ticker} ${q.nome} capTri=${q.capTri ?? '—'}`)
    }

    expect(quotes.length).toBeGreaterThan(0)
    /* sem token não pode haver capTri convertido (câmbio exige token) */
    for (const q of quotes) expect(q.capTri).toBeUndefined()
    expect(ms).toBeLessThan(15_000)
  })
})
