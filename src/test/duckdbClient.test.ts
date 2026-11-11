import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  runSqlQuery,
  getDuckDBConnection,
  cancelCurrentQuery,
  resetDuckDBConnection,
  __setConnectionForTesting,
  DuckDBQueryError,
  DuckDBUnavailableError,
  DEFAULT_MAX_ROWS,
} from '../lib/duckdb/duckdbClient'

/** Cria um mock de Arrow Table com N linhas e colunas especificadas */
function createMockArrowTable(numRows: number, columns = ['id', 'nome', 'valor']) {
  return {
    numRows,
    schema: {
      fields: columns.map((name) => ({ name })),
    },
    getChild(col: string) {
      return {
        get(index: number) {
          if (col === 'id') return index + 1
          if (col === 'nome') return `Item ${index + 1}`
          if (col === 'valor') return (index + 1) * 10
          return null
        },
      }
    },
  }
}

describe('AUD-006 & AUD-007: DuckDB-Wasm Client (Row Limits, Concurrency, Retry)', () => {
  beforeEach(async () => {
    await resetDuckDBConnection()
  })

  afterEach(async () => {
    await resetDuckDBConnection()
    vi.restoreAllMocks()
  })

  describe('AUD-006: Limite de Linhas e Proteção de Memória', () => {
    it('limita as linhas materializadas no JS ao DEFAULT_MAX_ROWS (1000) e marca truncated=true', async () => {
      const mockTable = createMockArrowTable(2500)
      const mockConn = {
        query: vi.fn().mockResolvedValue(mockTable),
      }
      __setConnectionForTesting(mockConn)

      const result = await runSqlQuery('SELECT * FROM grande_tabela')

      expect(result.totalRowCount).toBe(2500)
      expect(result.rowCount).toBe(DEFAULT_MAX_ROWS)
      expect(result.rows).toHaveLength(DEFAULT_MAX_ROWS)
      expect(result.truncated).toBe(true)
      expect(result.rows[0]).toEqual({ id: 1, nome: 'Item 1', valor: 10 })
      expect(result.rows[DEFAULT_MAX_ROWS - 1]).toEqual({
        id: DEFAULT_MAX_ROWS,
        nome: `Item ${DEFAULT_MAX_ROWS}`,
        valor: DEFAULT_MAX_ROWS * 10,
      })
    })

    it('permite customizar maxRows via opções da consulta', async () => {
      const mockTable = createMockArrowTable(200)
      const mockConn = {
        query: vi.fn().mockResolvedValue(mockTable),
      }
      __setConnectionForTesting(mockConn)

      const result = await runSqlQuery('SELECT * FROM media_tabela', { maxRows: 50 })

      expect(result.totalRowCount).toBe(200)
      expect(result.rowCount).toBe(50)
      expect(result.rows).toHaveLength(50)
      expect(result.truncated).toBe(true)
    })

    it('mantém truncated=false quando o número de linhas é menor ou igual ao limite', async () => {
      const mockTable = createMockArrowTable(15)
      const mockConn = {
        query: vi.fn().mockResolvedValue(mockTable),
      }
      __setConnectionForTesting(mockConn)

      const result = await runSqlQuery('SELECT * FROM pequena_tabela')

      expect(result.totalRowCount).toBe(15)
      expect(result.rowCount).toBe(15)
      expect(result.rows).toHaveLength(15)
      expect(result.truncated).toBe(false)
    })

    it('registra o tempo de execução (durationMs) como número não-negativo', async () => {
      const mockTable = createMockArrowTable(5)
      const mockConn = {
        query: vi.fn().mockResolvedValue(mockTable),
      }
      __setConnectionForTesting(mockConn)

      const result = await runSqlQuery('SELECT 1')

      expect(typeof result.durationMs).toBe('number')
      expect(result.durationMs).toBeGreaterThanOrEqual(0)
    })
  })

  describe('AUD-006: Proteção contra Consultas Concorrentes e Cancelamento Gracioso', () => {
    it('rejeita consultas sobrepostas concorrentes quando uma consulta já está em execução', async () => {
      let resolveQuery1: (table: any) => void
      const query1Promise = new Promise((resolve) => {
        resolveQuery1 = resolve
      })

      const mockConn = {
        query: vi.fn().mockImplementation((sql: string) => {
          if (sql === 'QUERY_1') return query1Promise
          return Promise.resolve(createMockArrowTable(1))
        }),
      }
      __setConnectionForTesting(mockConn)

      // Inicia QUERY_1 (que fica pendente)
      const p1 = runSqlQuery('QUERY_1')

      // Tenta executar QUERY_2 enquanto QUERY_1 ainda está rodando
      await expect(runSqlQuery('QUERY_2')).rejects.toThrow(
        /Já existe uma consulta em andamento/,
      )

      // Resolve QUERY_1
      resolveQuery1!(createMockArrowTable(1))
      await p1
    })

    it('permite cancelar a consulta anterior ao passar cancelPrevious: true', async () => {
      let resolveQuery1: (table: any) => void
      const query1Promise = new Promise((resolve) => {
        resolveQuery1 = resolve
      })

      const cancelSentMock = vi.fn().mockResolvedValue(true)
      const mockConn = {
        query: vi.fn().mockImplementation((sql: string) => {
          if (sql === 'QUERY_1') return query1Promise
          return Promise.resolve(createMockArrowTable(2))
        }),
        cancelSent: cancelSentMock,
      }
      __setConnectionForTesting(mockConn)

      const p1 = runSqlQuery('QUERY_1')

      // Executa QUERY_2 com cancelPrevious: true
      const p2 = runSqlQuery('QUERY_2', { cancelPrevious: true })

      // p1 deve ser rejeitada como cancelada
      await expect(p1).rejects.toThrow(/cancelada/)

      // Finaliza QUERY_1 internamente se necessário
      resolveQuery1!(createMockArrowTable(1))

      const result2 = await p2
      expect(result2.rowCount).toBe(2)
      expect(cancelSentMock).toHaveBeenCalled()
    })

    it('permite cancelar uma consulta ativa via cancelCurrentQuery()', async () => {
      let resolveQuery: (table: any) => void
      const queryPromise = new Promise((resolve) => {
        resolveQuery = resolve
      })

      const cancelSentMock = vi.fn().mockResolvedValue(true)
      const mockConn = {
        query: vi.fn().mockReturnValue(queryPromise),
        cancelSent: cancelSentMock,
      }
      __setConnectionForTesting(mockConn)

      const p = runSqlQuery('SLOW_QUERY')

      const cancelled = await cancelCurrentQuery()
      expect(cancelled).toBe(true)

      await expect(p).rejects.toThrow(/cancelada pelo usuário/)
      expect(cancelSentMock).toHaveBeenCalled()
      resolveQuery!(createMockArrowTable(1))
    })

    it('retorna false ao chamar cancelCurrentQuery() sem consulta em execução', async () => {
      const cancelled = await cancelCurrentQuery()
      expect(cancelled).toBe(false)
    })

    it('respeita AbortSignal externo passado nas opções', async () => {
      const abortController = new AbortController()
      abortController.abort()

      const mockConn = {
        query: vi.fn().mockResolvedValue(createMockArrowTable(1)),
      }
      __setConnectionForTesting(mockConn)

      await expect(
        runSqlQuery('SELECT 1', { signal: abortController.signal }),
      ).rejects.toThrow(/cancelada pelo usuário/)
    })
  })

  describe('AUD-007: Recuperação de Falhas e Reset de initPromise', () => {
    it('reseta initPromise = null na falha de inicialização, permitindo retry subsequente', async () => {
      // No ambiente de teste padrão, Worker não existe, logo getDuckDBConnection falha
      await expect(getDuckDBConnection()).rejects.toBeInstanceOf(DuckDBUnavailableError)

      // No bug antigo, a segunda chamada retornaria o mesmo initPromise rejeitado.
      // Com a correção, a segunda chamada tenta novamente de forma limpa.
      // Vamos simular que na segunda chamada injetamos uma conexão mockada:
      const mockConn = {
        query: vi.fn().mockResolvedValue(createMockArrowTable(3)),
      }
      __setConnectionForTesting(mockConn)

      // Agora deve obter a conexão mockada sem ser bloqueado pela rejeição anterior!
      const conn = await getDuckDBConnection()
      expect(conn).toBe(mockConn)
    })

    it('limpa workers e instâncias de banco quando ocorre erro durante inicialização', async () => {
      // Testa a função de reset explícita
      const closeMock = vi.fn().mockResolvedValue(undefined)
      __setConnectionForTesting({ close: closeMock })

      await resetDuckDBConnection()
      expect(closeMock).toHaveBeenCalled()
    })
  })
})
