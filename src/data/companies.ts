/**
 * MÓDULO 05 — Raio-X de Empresas (modelo UNIFICADO, formato Anuário ILAESE).
 *
 * Toda empresa — brasileira ou global — vive no mesmo schema e passa pelo
 * MESMO motor analítico (lib/companyMetrics.ts): W = c + v + m com
 *   v ≈ folha estimada (funcionários × remuneração média anual)
 *   m ≈ lucro líquido · c = receita − v − m · e = m/v.
 *
 * Moeda: cada registro declara `moeda`; as razões (e, horas não pagas,
 * produtividade) são invariantes à moeda porque v e m compartilham-a.
 * Campos `salarioMedioK` são ESTIMATIVAS por país/setor (flag estimate).
 */

import { modRef } from './modules'

import { decomposeFromParts, decomposeValue, sectorEstimate } from '../lib/companyMetrics'
import { WORLD_EQUITIES_TRI, WORLD_GDP_TRI } from './worldWealth'

export type Market = 'BR' | 'GLOBAL'

export interface CompanyRecord {
  id: string
  nome: string
  pais: string
  setor: string
  mercado: Market
  moeda: 'BRL' | 'USD'
  ticker?: string
  /** receita anual, bilhões na moeda local */
  receitaBi: number
  /** lucro líquido anual, bilhões na moeda local */
  lucroBi: number
  /** funcionários, milhares */
  funcionariosMil: number
  /** remuneração média anual por funcionário, MIL na moeda local — estimativa país/setor */
  salarioMedioK: number
  /** valor de mercado, US$ trilhões (quando aplicável) */
  capTri?: number
  /** dividendos pagos/declarados no exercício, bilhões na moeda local */
  dividendosBi?: number
  fonte?: string
  nota?: string
  estimate?: boolean
  /** origem do registro: base curada estática ou sincronização via API */
  origem?: 'base' | 'api'
}

/* ═══════════════════════════ BRASIL (FY2024) ═══════════════════════════
   Receita/lucro/funcionários: demonstrações financeiras FY2024 (DFs) e
   relatórios de resultados; salário médio = estimativa setor/porte.
   Formato inspirado no Anuário ILAESE. Valores aproximados em R$ bi.       */

const BR: CompanyRecord[] = [
  {
    id: 'br-petrobras', nome: 'Petrobras', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'PETR4', receitaBi: 486, lucroBi: 36.6, funcionariosMil: 46, salarioMedioK: 550,
    capTri: 0.1, dividendosBi: 100, fonte: 'DFs FY2024', nota: 'Dividendos+compra de ações anunciados 2024 (~US$18 bi)',
  },
  {
    id: 'br-vale', nome: 'Vale S.A.', pais: 'Brasil', setor: 'Extrativa Mineral', mercado: 'BR', moeda: 'BRL',
    ticker: 'VALE3', receitaBi: 200, lucroBi: 19.8, funcionariosMil: 64, salarioMedioK: 260,
    capTri: 0.045, dividendosBi: 21, fonte: 'DFs FY2024',
  },
  {
    id: 'br-itau', nome: 'Itaú Unibanco', pais: 'Brasil', setor: 'Bancário / Portador de Juros', mercado: 'BR', moeda: 'BRL',
    ticker: 'ITUB4', receitaBi: 122, lucroBi: 41.4, funcionariosMil: 96, salarioMedioK: 190,
    capTri: 0.065, dividendosBi: 34, fonte: 'DFs FY2024', nota: 'Maior lucro da história do sistema bancário brasileiro',
  },
  {
    id: 'br-bradesco', nome: 'Bradesco', pais: 'Brasil', setor: 'Bancário / Portador de Juros', mercado: 'BR', moeda: 'BRL',
    ticker: 'BBDC4', receitaBi: 108, lucroBi: 19.6, funcionariosMil: 87, salarioMedioK: 160,
    dividendosBi: 12, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-bb', nome: 'Banco do Brasil', pais: 'Brasil', setor: 'Bancário / Portador de Juros', mercado: 'BR', moeda: 'BRL',
    ticker: 'BBAS3', receitaBi: 150, lucroBi: 34.1, funcionariosMil: 77, salarioMedioK: 150,
    dividendosBi: 20, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Estatal — lucro recorde histórico',
  },
  {
    id: 'br-ambev', nome: 'Ambev', pais: 'Brasil', setor: 'Alimentos e Bebidas', mercado: 'BR', moeda: 'BRL',
    ticker: 'ABEV3', receitaBi: 89.9, lucroBi: 13.0, funcionariosMil: 33, salarioMedioK: 130,
    dividendosBi: 11, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-jbs', nome: 'JBS', pais: 'Brasil', setor: 'Alimentos e Bebidas', mercado: 'BR', moeda: 'BRL',
    ticker: 'JBSS3', receitaBi: 416.9, lucroBi: 9.6, funcionariosMil: 280, salarioMedioK: 55,
    dividendosBi: 3.0, fonte: 'DFs FY2024', nota: 'Operação global: maior processadora de proteína animal do mundo',
  },
  {
    id: 'br-gerdau', nome: 'Gerdau', pais: 'Brasil', setor: 'Siderurgia', mercado: 'BR', moeda: 'BRL',
    ticker: 'GGBR4', receitaBi: 67, lucroBi: 5.2, funcionariosMil: 30, salarioMedioK: 120,
    dividendosBi: 2.8, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-suzano', nome: 'Suzano', pais: 'Brasil', setor: 'Celulose e Papel', mercado: 'BR', moeda: 'BRL',
    ticker: 'SUZB3', receitaBi: 47.4, lucroBi: 12.6, funcionariosMil: 13.7, salarioMedioK: 180,
    dividendosBi: 6.0, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Maior produtora mundial de celulose de eucalipto',
  },
  {
    id: 'br-weg', nome: 'WEG', pais: 'Brasil', setor: 'Bens de Capital', mercado: 'BR', moeda: 'BRL',
    ticker: 'WEGE3', receitaBi: 35.3, lucroBi: 4.7, funcionariosMil: 39, salarioMedioK: 90,
    dividendosBi: 1.9, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-embraer', nome: 'Embraer', pais: 'Brasil', setor: 'Aeroindústria', mercado: 'BR', moeda: 'BRL',
    ticker: 'EMBR3', receitaBi: 35, lucroBi: 2.7, funcionariosMil: 25, salarioMedioK: 170,
    dividendosBi: 0.4, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-magalu', nome: 'Magazine Luiza', pais: 'Brasil', setor: 'Varejo', mercado: 'BR', moeda: 'BRL',
    ticker: 'MGLU3', receitaBi: 31, lucroBi: 0.3, funcionariosMil: 38, salarioMedioK: 60,
    dividendosBi: 0.05, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-vivo', nome: 'Telefônica Brasil (Vivo)', pais: 'Brasil', setor: 'Telecomunicações', mercado: 'BR', moeda: 'BRL',
    ticker: 'VIVT3', receitaBi: 55.9, lucroBi: 5.6, funcionariosMil: 14, salarioMedioK: 160,
    dividendosBi: 4.0, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-santander', nome: 'Santander Brasil', pais: 'Brasil', setor: 'Bancário / Portador de Juros', mercado: 'BR', moeda: 'BRL',
    ticker: 'SANB11', receitaBi: 65, lucroBi: 12.4, funcionariosMil: 53, salarioMedioK: 140,
    dividendosBi: 7.0, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-btg', nome: 'BTG Pactual', pais: 'Brasil', setor: 'Bancário / Portador de Juros', mercado: 'BR', moeda: 'BRL',
    ticker: 'BPAC11', receitaBi: 30, lucroBi: 6.4, funcionariosMil: 7.4, salarioMedioK: 350,
    dividendosBi: 3.5, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Folha média mais alta do mercado bancário',
  },
  {
    id: 'br-csn', nome: 'CSN', pais: 'Brasil', setor: 'Siderurgia', mercado: 'BR', moeda: 'BRL',
    ticker: 'CSNA3', receitaBi: 40.8, lucroBi: 3.5, funcionariosMil: 18, salarioMedioK: 110,
    dividendosBi: 0.5, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-ultrapar', nome: 'Ultrapar (Ipiranga)', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'UGPA3', receitaBi: 132, lucroBi: 1.1, funcionariosMil: 10, salarioMedioK: 200,
    dividendosBi: 0.6, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Margem fina sobre volume gigante de combustíveis',
  },
  {
    id: 'br-raiadrogasil', nome: 'Raia Drogasil', pais: 'Brasil', setor: 'Varejo farmacêutico', mercado: 'BR', moeda: 'BRL',
    ticker: 'RADL3', receitaBi: 40, lucroBi: 1.9, funcionariosMil: 45, salarioMedioK: 45,
    dividendosBi: 0.9, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-klabin', nome: 'Klabin', pais: 'Brasil', setor: 'Celulose e Papel', mercado: 'BR', moeda: 'BRL',
    ticker: 'KLBN11', receitaBi: 22.5, lucroBi: 4.0, funcionariosMil: 22, salarioMedioK: 130,
    dividendosBi: 1.6, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-natura', nome: 'Natura &Co', pais: 'Brasil', setor: 'Cosméticos', mercado: 'BR', moeda: 'BRL',
    ticker: 'NTCO3', receitaBi: 26.7, lucroBi: -1.2, funcionariosMil: 24, salarioMedioK: 80,
    estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Prejuízo GAAP ligado aos problemas da Avon — até gigante queima capital',
  },
  {
    id: 'br-localiza', nome: 'Localiza', pais: 'Brasil', setor: 'Locação de veículos', mercado: 'BR', moeda: 'BRL',
    ticker: 'RENT3', receitaBi: 28, lucroBi: 1.9, funcionariosMil: 13, salarioMedioK: 70,
    dividendosBi: 0.8, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-b3', nome: 'B3 (bolsa)', pais: 'Brasil', setor: 'Infraestrutura de mercado', mercado: 'BR', moeda: 'BRL',
    ticker: 'B3SA3', receitaBi: 9.4, lucroBi: 3.4, funcionariosMil: 2.1, salarioMedioK: 250,
    dividendosBi: 2.3, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Margem líquida ~36%: aluguel sobre a infraestrutura de negociação',
  },
  {
    id: 'br-eletrobras', nome: 'Eletrobras', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'ELET3', receitaBi: 45, lucroBi: 10.9, funcionariosMil: 4.2, salarioMedioK: 300,
    dividendosBi: 5.5, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Renda hidrelétrica: ativo herdado gera lucro com folha mínima',
  },
  {
    id: 'br-ifood', nome: 'iFood (Movile)', pais: 'Brasil', setor: 'Plataformas', mercado: 'BR', moeda: 'BRL',
    ticker: undefined, receitaBi: 14, lucroBi: 0.5, funcionariosMil: 8, salarioMedioK: 220,
    estimate: true, fonte: 'estimativa (companhia fechada)', nota: `Milhões de entregadores PARCEIROS ficam fora da folha — ver ${modRef('platform')}`,
  },

  /* ── Ampliação 2026-09: varejo, serviços, saúde, construção, energia,
     saneamento, logística e as histórias de fraude (Americanas/Movida).
     Mesmo contrato: DFs FY2024 aproximadas + salário = estimativa setor.  */
  {
    id: 'br-renner', nome: 'Lojas Renner', pais: 'Brasil', setor: 'Varejo', mercado: 'BR', moeda: 'BRL',
    ticker: 'LREN3', receitaBi: 12.4, lucroBi: 0.9, funcionariosMil: 40, salarioMedioK: 40,
    dividendosBi: 0.4, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-assai', nome: 'Assaí Atacadista', pais: 'Brasil', setor: 'Varejo atacarejo', mercado: 'BR', moeda: 'BRL',
    ticker: 'ASAI3', receitaBi: 73.5, lucroBi: 1.0, funcionariosMil: 42, salarioMedioK: 35,
    dividendosBi: 0.6, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Margem fina sobre volume gigante: o atacarejo opera no limite da folha',
  },
  {
    id: 'br-carrefour', nome: 'Carrefour Brasil', pais: 'Brasil', setor: 'Varejo atacarejo', mercado: 'BR', moeda: 'BRL',
    ticker: 'CRFB3', receitaBi: 120.7, lucroBi: 1.2, funcionariosMil: 100, salarioMedioK: 30,
    dividendosBi: 0.5, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-americanas', nome: 'Americanas', pais: 'Brasil', setor: 'Varejo', mercado: 'BR', moeda: 'BRL',
    ticker: 'AMER3', receitaBi: 19.7, lucroBi: -1.2, funcionariosMil: 38, salarioMedioK: 40,
    estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Fraude contábil de ~R$ 25 bi (2023): a dívida escondida virou judicial recovery — o caso que virou livro',
  },
  {
    id: 'br-totvs', nome: 'TOTVS', pais: 'Brasil', setor: 'Software', mercado: 'BR', moeda: 'BRL',
    ticker: 'TOTS3', receitaBi: 4.4, lucroBi: 0.7, funcionariosMil: 11.5, salarioMedioK: 180,
    dividendosBi: 0.6, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-pagseguro', nome: 'PagBank (PagSeguro)', pais: 'Brasil', setor: 'Pagamentos', mercado: 'BR', moeda: 'BRL',
    ticker: 'PAGS34', receitaBi: 18.2, lucroBi: 2.7, funcionariosMil: 7.5, salarioMedioK: 220,
    dividendosBi: 0.3, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-stone', nome: 'StoneCo', pais: 'Brasil', setor: 'Pagamentos', mercado: 'BR', moeda: 'BRL',
    ticker: 'STOC34', receitaBi: 12.6, lucroBi: 0.5, funcionariosMil: 5.5, salarioMedioK: 200,
    estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'GAAP deprimido por provisões de crédito — a expansão custa capital',
  },
  {
    id: 'br-rededor', nome: 'Rede D\u2019Or São Luiz', pais: 'Brasil', setor: 'Saúde', mercado: 'BR', moeda: 'BRL',
    ticker: 'RDOR3', receitaBi: 34.7, lucroBi: 2.5, funcionariosMil: 70, salarioMedioK: 55,
    dividendosBi: 0.7, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Maior rede privada de hospitais do país',
  },
  {
    id: 'br-hapvida', nome: 'Hapvida', pais: 'Brasil', setor: 'Saúde', mercado: 'BR', moeda: 'BRL',
    ticker: 'HAPV3', receitaBi: 20.5, lucroBi: 0.4, funcionariosMil: 45, salarioMedioK: 35,
    estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-cyrela', nome: 'Cyrela', pais: 'Brasil', setor: 'Construção Civil', mercado: 'BR', moeda: 'BRL',
    ticker: 'CYRE3', receitaBi: 10.9, lucroBi: 0.9, funcionariosMil: 9.5, salarioMedioK: 90,
    dividendosBi: 0.4, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-mrv', nome: 'MRV&Co', pais: 'Brasil', setor: 'Construção Civil', mercado: 'BR', moeda: 'BRL',
    ticker: 'MRVE3', receitaBi: 9.4, lucroBi: 0.35, funcionariosMil: 14, salarioMedioK: 60,
    estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-engie', nome: 'Engie Brasil', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'EGIE3', receitaBi: 19.5, lucroBi: 3.2, funcionariosMil: 4.5, salarioMedioK: 250,
    dividendosBi: 2.0, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Maior geradora privada: renda hidrelétrica com folha mínima',
  },
  {
    id: 'br-equatorial', nome: 'Equatorial', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'EQTL3', receitaBi: 42.4, lucroBi: 2.4, funcionariosMil: 16, salarioMedioK: 90,
    dividendosBi: 1.4, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-sabesp', nome: 'Sabesp', pais: 'Brasil', setor: 'Saneamento', mercado: 'BR', moeda: 'BRL',
    ticker: 'SBSP3', receitaBi: 16.4, lucroBi: 3.2, funcionariosMil: 8, salarioMedioK: 110,
    dividendosBi: 1.6, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Desestatização 2024: lucro inflado por efeitos fiscais de uma vez',
  },
  {
    id: 'br-tim', nome: 'TIM S.A.', pais: 'Brasil', setor: 'Telecomunicações', mercado: 'BR', moeda: 'BRL',
    ticker: 'TIMS3', receitaBi: 25.5, lucroBi: 2.9, funcionariosMil: 6.5, salarioMedioK: 180,
    dividendosBi: 1.8, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-ccr', nome: 'CCR', pais: 'Brasil', setor: 'Logística', mercado: 'BR', moeda: 'BRL',
    ticker: 'CCRO3', receitaBi: 12.7, lucroBi: 2.3, funcionariosMil: 7, salarioMedioK: 130,
    dividendosBi: 1.3, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Pedágio: renda sobre a infraestrutura de rodovias e aeroportos',
  },
  {
    id: 'br-rumo', nome: 'Rumo', pais: 'Brasil', setor: 'Logística', mercado: 'BR', moeda: 'BRL',
    ticker: 'RAIL3', receitaBi: 9.0, lucroBi: 1.8, funcionariosMil: 8, salarioMedioK: 100,
    dividendosBi: 0.9, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-movida', nome: 'Movida', pais: 'Brasil', setor: 'Locação de veículos', mercado: 'BR', moeda: 'BRL',
    ticker: 'MOVV3', receitaBi: 6.4, lucroBi: 0.8, funcionariosMil: 9, salarioMedioK: 70,
    dividendosBi: 0.2, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Escândalo contábil 2023 (~R$ 5 bi): reformulada, segue na bolsa — até gigante queima capital',
  },
  {
    id: 'br-alpargatas', nome: 'Alpargatas (Havaianas)', pais: 'Brasil', setor: 'Calçados', mercado: 'BR', moeda: 'BRL',
    ticker: 'ALPA3', receitaBi: 8.5, lucroBi: 1.6, funcionariosMil: 13, salarioMedioK: 70,
    dividendosBi: 0.9, estimate: true, fonte: 'DFs FY2024 (aprox.)',
  },
  {
    id: 'br-mbrf', nome: 'MBRF Global Foods', pais: 'Brasil', setor: 'Alimentos e Bebidas', mercado: 'BR', moeda: 'BRL',
    ticker: 'MBRF3', receitaBi: 108, lucroBi: 2.0, funcionariosMil: 100, salarioMedioK: 50,
    dividendosBi: 1.0, estimate: true, fonte: 'DFs FY2024 (aprox.)', nota: 'Marfrig + BRF: a fusão da proteína animal',
  },

  /* ── Expansão 2026-10: energia, seguros, indústria, agro, saúde e serviços ── */
  {
    id: 'br-vibra', nome: 'Vibra Energia', pais: 'Brasil', setor: 'Energia / Distribuição', mercado: 'BR', moeda: 'BRL',
    ticker: 'VBBR3', receitaBi: 181.4, lucroBi: 4.2, funcionariosMil: 5.2, salarioMedioK: 190,
    dividendosBi: 2.2, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)', nota: 'Maior distribuidora de combustíveis do Brasil; antiga BR Distribuidora',
  },
  {
    id: 'br-cpfl', nome: 'CPFL Energia', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'CPFE3', receitaBi: 39.2, lucroBi: 5.0, funcionariosMil: 12.5, salarioMedioK: 125,
    dividendosBi: 4.0, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-neoenergia', nome: 'Neoenergia', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'NEOE3', receitaBi: 44.0, lucroBi: 4.7, funcionariosMil: 15.5, salarioMedioK: 120,
    dividendosBi: 2.0, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-cemig', nome: 'Cemig', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'CMIG4', receitaBi: 37.0, lucroBi: 7.0, funcionariosMil: 5.0, salarioMedioK: 180,
    dividendosBi: 4.5, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-copel', nome: 'Copel', pais: 'Brasil', setor: 'Energia', mercado: 'BR', moeda: 'BRL',
    ticker: 'CPLE6', receitaBi: 22.0, lucroBi: 3.2, funcionariosMil: 5.6, salarioMedioK: 165,
    dividendosBi: 2.0, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-braskem', nome: 'Braskem', pais: 'Brasil', setor: 'Petroquímica', mercado: 'BR', moeda: 'BRL',
    ticker: 'BRKM5', receitaBi: 77.4, lucroBi: -5.6, funcionariosMil: 8.0, salarioMedioK: 220,
    estimate: true, fonte: 'Relatório anual FY2024 (aprox.)', nota: 'Ciclo petroquímico e passivos de Alagoas pressionaram o resultado',
  },
  {
    id: 'br-usiminas', nome: 'Usiminas', pais: 'Brasil', setor: 'Siderurgia', mercado: 'BR', moeda: 'BRL',
    ticker: 'USIM5', receitaBi: 26.1, lucroBi: 0.6, funcionariosMil: 14.0, salarioMedioK: 115,
    dividendosBi: 0.5, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-csn-mineracao', nome: 'CSN Mineração', pais: 'Brasil', setor: 'Extrativa Mineral', mercado: 'BR', moeda: 'BRL',
    ticker: 'CMIN3', receitaBi: 14.0, lucroBi: 2.8, funcionariosMil: 8.5, salarioMedioK: 130,
    dividendosBi: 2.1, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-minerva', nome: 'Minerva Foods', pais: 'Brasil', setor: 'Alimentos e Bebidas', mercado: 'BR', moeda: 'BRL',
    ticker: 'BEEF3', receitaBi: 30.0, lucroBi: 0.9, funcionariosMil: 24.0, salarioMedioK: 48,
    dividendosBi: 0.3, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-slc', nome: 'SLC Agrícola', pais: 'Brasil', setor: 'Agronegócio', mercado: 'BR', moeda: 'BRL',
    ticker: 'SLCE3', receitaBi: 7.7, lucroBi: 1.0, funcionariosMil: 6.0, salarioMedioK: 65,
    dividendosBi: 0.5, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-porto', nome: 'Porto', pais: 'Brasil', setor: 'Seguros / Serviços financeiros', mercado: 'BR', moeda: 'BRL',
    ticker: 'PSSA3', receitaBi: 37.0, lucroBi: 2.7, funcionariosMil: 13.0, salarioMedioK: 110,
    dividendosBi: 1.5, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-marco', nome: 'Marcopolo', pais: 'Brasil', setor: 'Bens de Capital / Ônibus', mercado: 'BR', moeda: 'BRL',
    ticker: 'POMO4', receitaBi: 8.7, lucroBi: 1.0, funcionariosMil: 15.0, salarioMedioK: 72,
    dividendosBi: 0.5, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-iochpe', nome: 'Iochpe-Maxion', pais: 'Brasil', setor: 'Autopeças', mercado: 'BR', moeda: 'BRL',
    ticker: 'MYPK3', receitaBi: 16.0, lucroBi: 0.5, funcionariosMil: 17.0, salarioMedioK: 70,
    dividendosBi: 0.2, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-fleury', nome: 'Grupo Fleury', pais: 'Brasil', setor: 'Saúde / Diagnóstico', mercado: 'BR', moeda: 'BRL',
    ticker: 'FLRY3', receitaBi: 7.2, lucroBi: 0.8, funcionariosMil: 15.0, salarioMedioK: 62,
    dividendosBi: 0.5, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-hypera', nome: 'Hypera Pharma', pais: 'Brasil', setor: 'Farmacêutica', mercado: 'BR', moeda: 'BRL',
    ticker: 'HYPE3', receitaBi: 8.4, lucroBi: 1.8, funcionariosMil: 11.0, salarioMedioK: 95,
    dividendosBi: 0.8, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-smartfit', nome: 'Smart Fit', pais: 'Brasil', setor: 'Serviços / Academias', mercado: 'BR', moeda: 'BRL',
    ticker: 'SMFT3', receitaBi: 6.5, lucroBi: 1.0, funcionariosMil: 16.0, salarioMedioK: 45,
    dividendosBi: 0.2, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-grupo-mateus', nome: 'Grupo Mateus', pais: 'Brasil', setor: 'Varejo', mercado: 'BR', moeda: 'BRL',
    ticker: 'GMAT3', receitaBi: 36.0, lucroBi: 1.4, funcionariosMil: 44.0, salarioMedioK: 32,
    dividendosBi: 0.6, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-vivara', nome: 'Vivara', pais: 'Brasil', setor: 'Varejo / Joalheria', mercado: 'BR', moeda: 'BRL',
    ticker: 'VIVA3', receitaBi: 3.3, lucroBi: 0.5, funcionariosMil: 6.0, salarioMedioK: 42,
    dividendosBi: 0.2, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
  {
    id: 'br-multiplan', nome: 'Multiplan', pais: 'Brasil', setor: 'Shoppings / Renda imobiliária', mercado: 'BR', moeda: 'BRL',
    ticker: 'MULT3', receitaBi: 2.3, lucroBi: 1.1, funcionariosMil: 2.0, salarioMedioK: 120,
    dividendosBi: 0.8, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)', nota: 'Receita de locação e participação em shopping centers',
  },
  {
    id: 'br-iguatemi', nome: 'Iguatemi', pais: 'Brasil', setor: 'Shoppings / Renda imobiliária', mercado: 'BR', moeda: 'BRL',
    ticker: 'IGTI11', receitaBi: 1.6, lucroBi: 0.6, funcionariosMil: 2.2, salarioMedioK: 115,
    dividendosBi: 0.4, estimate: true, fonte: 'Relatório anual FY2024 (aprox.)',
  },
]

/* ═══════════════ GLOBAL — mega-corporações (FY2024/25, US$) ═══════════════
   Relatórios anuais (10-K/20-F) + market caps dez/2025. salário médio =
   estimativa país/setor. Complexo militar-industrial marcado em nota.        */

type W = [
  nome: string, pais: string, setor: string,
  capTri: number, receitaBi: number, lucroBi: number, funcionariosMil: number, salarioMedioUsdK: number,
]
/** Fonte comum a TODOS os registros globais (citação do bloco acima, tornada
 *  explícita por registro em runtime — as razões globais ficam com fonte na
 *  linha expandida, como as BR já têm). */
const GLOBAL_FONTE = '10-K/20-F FY2024/25 · market cap dez/2025'
const WORLD_RAW: W[] = [
  // ── Topo do topo ──
  ['NVIDIA', 'EUA', 'Semicondutores / IA', 4.4, 130.5, 72.9, 36, 210],
  ['Apple', 'EUA', 'Tech / Ecossistema', 4.0, 391.0, 93.7, 164, 135],
  ['Microsoft', 'EUA', 'Cloud / Software', 3.6, 245.1, 88.1, 228, 165],
  ['Alphabet', 'EUA', 'Plataformas / Ads', 3.5, 350.0, 100.1, 183, 190],
  ['Amazon', 'EUA', 'E-commerce / Cloud', 2.45, 638.0, 59.2, 1556, 55],
  ['Broadcom', 'EUA', 'Semicondutores', 1.7, 51.6, 5.9, 37, 170],
  ['Saudi Aramco', 'Arábia Saudita', 'Petróleo / Energia', 1.59, 480, 106.1, 73, 70],  ['Meta Platforms', 'EUA', 'Plataformas / Social', 1.55, 164.5, 62.4, 74, 220],
  ['TSMC', 'Taiwan', 'Semicondutores (foundry)', 1.5, 90.0, 37.0, 77, 80],
  ['Tesla', 'EUA', 'Automotivo / EV', 1.42, 97.7, 7.1, 125, 65],
  ['Berkshire Hathaway', 'EUA', 'Conglomerado / Seguros', 1.0, 371.4, 89.0, 392, 85],
  ['JPMorgan Chase', 'EUA', 'Bancário portador de juros', 0.82, 177.6, 58.5, 317, 110],
  ['Walmart', 'EUA', 'Varejo global', 0.75, 681.0, 19.4, 2100, 32],
  ['Eli Lilly', 'EUA', 'Farmacêutica', 0.73, 53.0, 10.6, 43, 120],
  ['Visa', 'EUA', 'Pagamentos (rede de cartões)', 0.63, 39.6, 19.7, 31, 140],
  ['Oracle', 'EUA', 'Cloud / Banco de dados', 0.62, 57.4, 10.5, 162, 130],
  ['Tencent', 'China', 'Plataformas / Games', 0.55, 92.8, 25.5, 108, 70],
  ['Mastercard', 'EUA', 'Pagamentos (rede de cartões)', 0.47, 30.4, 14.7, 34, 135],
  ['ExxonMobil', 'EUA', 'Petróleo / Energia', 0.47, 349.6, 33.7, 62, 105],
  ['Netflix', 'EUA', 'Streaming / Cultura', 0.44, 39.0, 8.7, 14, 220],
  ['Costco', 'EUA', 'Varejo atacarejo', 0.42, 254.5, 7.4, 333, 45],
  ['Johnson & Johnson', 'EUA', 'Farmacêutica / Saúde', 0.42, 88.8, 14.1, 138, 110],
  ['Procter & Gamble', 'EUA', 'Consumo básico', 0.37, 84.0, 14.9, 108, 95],
  ['Home Depot', 'EUA', 'Varejo', 0.37, 159.5, 14.8, 470, 42],
  ['Novo Nordisk', 'Dinamarca', 'Farmacêutica (Ozempic)', 0.35, 42.0, 14.6, 68, 110],
  ['ICBC', 'China', 'Bancário estatal', 0.32, 112, 52.6, 406, 40],
  ['Coca-Cola', 'EUA', 'Bebidas', 0.3, 47.1, 10.6, 69, 100],
  ['Toyota Motor', 'Japão', 'Autoindústria', 0.29, 310.0, 33.0, 380, 85],
  ['Alibaba', 'China', 'E-commerce / Cloud', 0.28, 137.0, 17.0, 198, 60],
  ['UnitedHealth', 'EUA', 'Planos de saúde', 0.28, 400.3, 14.4, 440, 85],
  ['Hermès', 'França', 'Luxo', 0.28, 16.0, 5.0, 19, 90],
  ['ASML', 'Países Baixos (UE)', 'Litografia EUV (monopólio)', 0.3, 30.0, 8.6, 44, 150],
  ['LVMH', 'França', 'Luxo', 0.3, 96.4, 14.6, 213, 80],
  ['Samsung Electronics', 'Coreia do Sul', 'Semicondutores / Eletrônicos', 0.35, 219.0, 23.8, 267, 75],
  ['AbbVie', 'EUA', 'Farmacêutica', 0.34, 56.3, 4.3, 50, 125],
  ['PetroChina', 'China', 'Petróleo / Energia estatal', 0.25, 420.0, 25.0, 420, 35],
  ['Merck & Co', 'EUA', 'Farmacêutica', 0.25, 64.2, 17.1, 71, 110],
  ['Roche', 'Suíça', 'Farmacêutica', 0.25, 63.0, 9.2, 103, 120],
  ['AMD', 'EUA', 'Semicondutores / IA', 0.25, 25.8, 1.6, 26, 140],
  ['Salesforce', 'EUA', 'SaaS / CRM', 0.26, 37.9, 6.2, 76, 160],
  ['Chevron', 'EUA', 'Petróleo / Energia', 0.27, 193.4, 17.7, 45, 105],
  ['IBM', 'EUA', 'TI / Consultoria', 0.25, 62.8, 6.0, 282, 95],
  // ── Software, semis, plataformas ──
  ['Cisco Systems', 'EUA', 'Redes / Infraestrutura de rede', 0.24, 53.8, 10.3, 90.4, 140],
  ['Adobe', 'EUA', 'Software criativo', 0.24, 21.5, 5.6, 30, 170],
  ['Palantir Technologies', 'EUA', 'Software / Análise de dados', 0.29, 2.9, 0.46, 3.9, 230],
  ['Intuit', 'EUA', 'Software financeiro', 0.19, 16.3, 3.0, 18, 130],
  ['ServiceNow', 'EUA', 'SaaS empresarial', 0.2, 11.0, 1.4, 22, 150],
  ['Texas Instruments', 'EUA', 'Semicondutores (analógico)', 0.19, 15.6, 4.8, 34, 120],
  ['Qualcomm', 'EUA', 'Semicondutores (móvel)', 0.18, 39.0, 10.1, 50, 130],
  ['Booking Holdings', 'EUA', 'Plataforma de viagens', 0.17, 23.7, 5.9, 24, 140],
  ['Micron Technology', 'EUA', 'Semicondutores (memória)', 0.13, 25.1, 0.85, 48, 95],
  ['Shopify', 'Canadá', 'E-commerce (plataforma)', 0.16, 8.9, 2.0, 8.3, 130],
  ['Spotify', 'Suécia', 'Streaming / Cultura', 0.13, 16.3, 1.14, 9.6, 110],
  ['Uber', 'EUA', 'Plataforma de mobilidade', 0.17, 44.0, 9.9, 31, 150],
  ['PayPal', 'EUA', 'Pagamentos', 0.075, 31.8, 4.1, 27.2, 120],
  ['Intel', 'EUA', 'Semicondutores', 0.1, 53.1, -18.8, 109, 115],
  ['American Express', 'EUA', 'Cartões / Bancário', 0.2, 74.2, 10.1, 74, 110],
  ['Accenture', 'Irlanda', 'TI / Terceirização global', 0.19, 64.9, 7.3, 774, 55],
  ['Tata Consultancy Services', 'Índia', 'TI / Terceirização global', 0.17, 30.0, 6.1, 591, 25],
  ['Sony', 'Japão', 'Eletrônicos / Entretenimento', 0.14, 87.0, 6.9, 113, 90],
  ['Foxconn (Hon Hai)', 'Taiwan', 'Montagem eletrônica', 0.1, 222.0, 5.4, 830, 30],
  ['Xiaomi', 'China', 'Eletrônicos / EV', 0.15, 51.0, 3.7, 70, 45],
  ['JD.com', 'China', 'E-commerce', 0.045, 159.0, 4.1, 360, 40],
  ['PDD Holdings', 'China', 'E-commerce (Temu)', 0.17, 54.0, 15.5, 17, 80],
  ['Meituan', 'China', 'Delivery / Plataforma', 0.09, 47.0, 5.0, 116, 55],
  ['MercadoLibre', 'Argentina/Uruguai', 'E-commerce LatAm', 0.12, 21.0, 1.9, 82, 40],
  // ── Indústria, autos, aviação ──
  ['Volkswagen Group', 'Alemanha', 'Autoindústria', 0.06, 352, 13.4, 680, 78],
  ['BYD', 'China', 'EV / Baterias', 0.14, 107.0, 5.5, 900, 30],
  ['Honda Motor', 'Japão', 'Autoindústria', 0.06, 125.0, 6.4, 200, 70],
  ['Hyundai Motor', 'Coreia do Sul', 'Autoindústria', 0.048, 125.0, 6.6, 120, 55],
  ['Mercedes-Benz Group', 'Alemanha', 'Autoindústria premium', 0.065, 150.0, 7.5, 166, 95],
  ['Stellantis', 'Países Baixos/UE', 'Autoindústria', 0.038, 170.0, 6.2, 248, 80],
  ['Ferrari', 'Itália', 'Automotivo de luxo', 0.08, 7.2, 1.6, 5.0, 90],
  ['CATL', 'China', 'Baterias (dominante)', 0.16, 50.0, 7.0, 116, 50],
  ['Boeing', 'EUA', 'Aeroespacial', 0.11, 66.5, -11.8, 172, 105],
  ['Airbus', 'França/UE', 'Aeroespacial', 0.13, 75.0, 4.6, 155, 95],
  ['GE Aerospace', 'EUA', 'Turbinas / Aeroespacial', 0.19, 38.7, 6.6, 53, 100],
  ['Caterpillar', 'EUA', 'Máquinas pesadas', 0.19, 64.8, 10.8, 113, 95],
  ['Deere & Co', 'EUA', 'Maquinário agrícola', 0.11, 51.7, 7.1, 83, 85],
  ['Siemens', 'Alemanha', 'Indústria / Infraestrutura', 0.17, 82.0, 9.3, 312, 90],
  ['SAP', 'Alemanha', 'Software empresarial', 0.3, 38.0, 5.4, 108, 120],
  // ── Mineração, energia, commodities ──
  ['Shell', 'Reino Unido', 'Petróleo / Energia', 0.22, 284.0, 16.1, 103, 95],
  ['TotalEnergies', 'França', 'Petróleo / Energia', 0.15, 195.0, 15.8, 102, 95],
  ['BP', 'Reino Unido', 'Petróleo / Energia', 0.085, 194.0, 0.4, 87, 90],
  ['ConocoPhillips', 'EUA', 'Petróleo upstream', 0.13, 56.9, 9.2, 11.8, 130],
  ['SLB (Schlumberger)', 'EUA', 'Serviços petrolíferos', 0.055, 36.3, 4.5, 111, 60],
  ['Halliburton', 'EUA', 'Serviços de guerra / energia', 0.024, 22.9, 2.5, 48, 85],
  ['BHP Group', 'Austrália', 'Mineração', 0.14, 55.7, 8.0, 80, 90],
  ['Rio Tinto', 'Austrália/UK', 'Mineração', 0.115, 53.7, 11.6, 57, 85],
  ['Glencore', 'Suíça', 'Commodities / Trading', 0.055, 217.0, 3.4, 140, 70],
  ['ArcelorMittal', 'Luxemburgo', 'Siderurgia global', 0.03, 62.4, 1.3, 126, 50],
  ['Maersk', 'Dinamarca', 'Logística / Shipping', 0.028, 55.5, 6.2, 100, 60],
  ['UPS', 'EUA', 'Logística', 0.13, 91.1, 5.8, 490, 55],
  // ── Farmacêutica e saúde ──
  ['Novartis', 'Suíça', 'Farmacêutica', 0.21, 50.3, 10.3, 76, 110],
  ['AstraZeneca', 'Reino Unido', 'Farmacêutica', 0.21, 54.1, 0.87, 90, 90],
  ['Pfizer', 'EUA', 'Farmacêutica', 0.15, 63.6, 8.0, 88, 100],
  ['Thermo Fisher Scientific', 'EUA', 'Ciências da vida', 0.2, 42.9, 6.3, 125, 75],
  ['CVS Health', 'EUA', 'Saúde / Farmácias', 0.07, 372.8, 4.6, 300, 55],
  // ── Consumo e varejo ──
  ['Philip Morris International', 'EUA', 'Tabaco', 0.19, 37.9, 7.1, 69, 60],
  ['PepsiCo', 'EUA', 'Bebidas / Snacks', 0.21, 91.9, 9.6, 318, 60],
  ['Nestlé', 'Suíça', 'Alimentos globalizados', 0.24, 103.0, 10.9, 270, 80],
  ['McDonald\u2019s', 'EUA', 'Franquias alimentares', 0.21, 25.9, 8.2, 150, 60],
  ['Starbucks', 'EUA', 'Café / Varejo', 0.11, 36.2, 3.8, 361, 30],
  ['Nike', 'EUA', 'Calçados / Vestuário', 0.11, 51.4, 3.2, 79, 50],
  ['Inditex (Zara)', 'Espanha', 'Fast fashion', 0.16, 42.0, 5.9, 158, 40],
  ['L\u2019Oréal', 'França', 'Cosméticos', 0.21, 47.0, 6.6, 90, 70],
  ['Target', 'EUA', 'Varejo', 0.075, 106.6, 4.1, 440, 35],
  ['Lowe\u2019s', 'EUA', 'Varejo (construção)', 0.14, 83.7, 6.9, 235, 40],
  // ── Bancos globais adicionais ──
  ['HSBC', 'Reino Unido', 'Bancário global', 0.17, 65.9, 22.9, 211, 80],
  ['Mitsubishi UFJ', 'Japão', 'Bancário', 0.14, 50.0, 14.9, 140, 80],
  ['HDFC Bank', 'Índia', 'Bancário', 0.16, 46.0, 7.5, 214, 30],
  // ── Complexo militar-industrial ──
  ['Lockheed Martin', 'EUA', 'Defesa · militar-industrial', 0.11, 71.0, 10.3, 121, 110],
  ['RTX (Raytheon)', 'EUA', 'Defesa · militar-industrial', 0.2, 80.7, 4.8, 185, 105],
  ['General Dynamics', 'EUA', 'Defesa · militar-industrial', 0.075, 47.7, 3.8, 106, 100],
  ['Northrop Grumman', 'EUA', 'Defesa · militar-industrial', 0.073, 41.0, 4.2, 95, 115],
  ['BAE Systems', 'Reino Unido', 'Defesa · militar-industrial', 0.045, 36.0, 2.4, 107, 70],
  ['Rheinmetall', 'Alemanha', 'Defesa · militar-industrial', 0.03, 10.5, 0.53, 34, 65],
  // ── Periferia do Sul Global ──
  ['Reliance Industries', 'Índia', 'Conglomerado / Energia', 0.2, 110.0, 8.4, 389, 20],
  ['Saudi Arabian Mining (Maaden)', 'Arábia Saudita', 'Mineração estatal', 0.04, 9.5, 0.6, 8, 45],
  ['Nubank', 'Brasil', 'Bancário digital', 0.06, 9.5, 1.1, 9, 30],
  ['América Móvil', 'México', 'Telecom', 0.055, 44.0, 5.3, 155, 25],
  // ── Defesa europeia/asiática, indústria pesada, mineração, química e logística ──
  ['Thales', 'França', 'Defesa · militar-industrial', 0.062, 23.4, 1.6, 83, 100],
  ['Leonardo S.p.A.', 'Itália', 'Defesa · militar-industrial', 0.033, 23.4, 1.3, 67, 95],
  ['Saab AB', 'Suécia', 'Defesa · militar-industrial', 0.034, 8.1, 0.7, 25, 100],
  ['Mitsubishi Heavy Industries', 'Japão', 'Defesa · militar-industrial', 0.084, 32.0, 1.6, 79, 85],
  ['Hitachi', 'Japão', 'Indústria / Infraestrutura', 0.158, 70.4, 5.1, 288, 90],
  ['Kubota', 'Japão', 'Maquinário agrícola', 0.020, 20.7, 1.7, 53, 80],
  ['Nucor', 'EUA', 'Siderurgia', 0.061, 32.5, 1.7, 33, 95],
  ['Freeport-McMoRan', 'EUA', 'Mineração', 0.104, 25.9, 2.2, 29, 110],
  ['Anglo American', 'Reino Unido', 'Mineração', 0.057, 20.0, -2.8, 26, 100],
  ['BASF', 'Alemanha', 'Produtos químicos', 0.051, 68.0, 1.8, 95, 105],
  ['LyondellBasell Industries', 'EUA', 'Petroquímica', 0.019, 31.2, -0.4, 19, 100],
  ['Celanese', 'EUA', 'Produtos químicos', 0.005, 9.7, -1.2, 11, 100],
  ['FedEx', 'EUA', 'Logística / Shipping', 0.074, 87.7, 4.3, 530, 65],
  ['DHL Group', 'Alemanha', 'Logística / Shipping', 0.072, 95.0, 4.0, 577, 60],
  ['Enel', 'Itália', 'Energia', 0.100, 90.5, 4.8, 62, 80],
  ['Heineken', 'Países Baixos (UE)', 'Cervejaria', 0.044, 32.7, 2.2, 85, 75],
  ['Mondelez International', 'EUA', 'Alimentos globalizados', 0.078, 39.7, 3.5, 91, 80],
  ['The Kraft Heinz Company', 'EUA', 'Alimentos globalizados', 0.030, 24.9, -3.4, 35, 75],
  // ── Ampliação 2026-09: consumo global, autos EUA, mídia, finanças e farmácia ──
  ['Unilever', 'Reino Unido', 'Consumo básico', 0.16, 65.0, 7.0, 128, 55],
  ['AB InBev', 'Bélgica', 'Bebidas', 0.13, 59.8, 6.0, 150, 50],
  ['General Motors', 'EUA', 'Autoindústria', 0.065, 187.4, 6.0, 163, 85],
  ['Ford Motor', 'EUA', 'Autoindústria', 0.05, 185.0, 5.9, 175, 80],
  ['Verizon', 'EUA', 'Telecom', 0.18, 134.8, 17.5, 100, 120],
  ['Comcast', 'EUA', 'Mídia / Streaming', 0.16, 123.7, 16.2, 186, 95],
  ['Walt Disney', 'EUA', 'Mídia / Cultura', 0.18, 91.4, 5.0, 225, 75],
  ['BlackRock', 'EUA', 'Gestora de ativos', 0.16, 20.4, 6.4, 19.8, 250],
  ['Bayer', 'Alemanha', 'Farmacêutica / Agroquímica', 0.03, 51.5, -2.9, 93, 95],
  ['Moderna', 'EUA', 'Biotecnologia (vacinas)', 0.008, 3.2, -3.6, 5.8, 180],
  ['Applied Materials', 'EUA', 'Semicondutores (equipamentos)', 0.14, 27.2, 7.2, 35, 160],

  // ── Expansão 2026-10: finanças, Ásia, Europa, Índia, LatAm e defesa ──
  ['Bank of America', 'EUA', 'Bancário global', 0.34, 101.9, 27.1, 213, 105],
  ['Wells Fargo', 'EUA', 'Bancário global', 0.23, 82.3, 19.7, 217, 95],
  ['Goldman Sachs', 'EUA', 'Banco de investimento', 0.20, 53.5, 14.3, 46.5, 240],
  ['Morgan Stanley', 'EUA', 'Banco de investimento', 0.21, 61.8, 13.4, 80, 180],
  ['Citigroup', 'EUA', 'Bancário global', 0.16, 81.1, 12.7, 229, 100],
  ['China Construction Bank', 'China', 'Bancário estatal', 0.25, 100.0, 46.0, 376, 40],
  ['Agricultural Bank of China', 'China', 'Bancário estatal', 0.22, 97.0, 39.0, 451, 35],
  ['Bank of China', 'China', 'Bancário estatal', 0.19, 90.0, 33.0, 306, 40],
  ['China Mobile', 'China', 'Telecom', 0.20, 140.0, 19.0, 451, 35],
  ['SK Hynix', 'Coreia do Sul', 'Semicondutores (memória)', 0.15, 48.0, 14.0, 41, 85],
  ['MediaTek', 'Taiwan', 'Semicondutores (móvel)', 0.06, 16.0, 3.4, 19, 100],
  ['Arm Holdings', 'Reino Unido', 'Semicondutores / IP', 0.14, 4.0, 0.7, 8, 180],
  ['Schneider Electric', 'França', 'Energia / Automação industrial', 0.14, 42.0, 4.3, 160, 85],
  ['Deutsche Telekom', 'Alemanha', 'Telecom', 0.17, 126.0, 12.0, 200, 80],
  ['Allianz', 'Alemanha', 'Seguros / Gestão de ativos', 0.15, 183.0, 10.0, 156, 90],
  ['UBS Group', 'Suíça', 'Bancário / Gestão de patrimônio', 0.11, 49.0, 5.1, 108, 130],
  ['Equinor', 'Noruega', 'Petróleo / Energia', 0.08, 104.0, 8.6, 25, 120],
  ['Infosys', 'Índia', 'TI / Terceirização global', 0.08, 19.3, 3.2, 324, 25],
  ['ICICI Bank', 'Índia', 'Bancário', 0.11, 32.0, 5.4, 141, 30],
  ['State Bank of India', 'Índia', 'Bancário estatal', 0.09, 57.0, 8.0, 236, 20],
  ['Bharti Airtel', 'Índia', 'Telecom', 0.11, 20.0, 2.4, 20, 30],
  ['FEMSA', 'México', 'Varejo / Bebidas / Logística', 0.07, 42.0, 1.9, 392, 18],
  ['L3Harris Technologies', 'EUA', 'Defesa · militar-industrial', 0.04, 21.3, 1.5, 47, 100],
  ['Rolls-Royce Holdings', 'Reino Unido', 'Aeroespacial / Defesa', 0.08, 22.4, 3.0, 42, 75],
  ['Hanwha Aerospace', 'Coreia do Sul', 'Defesa · militar-industrial', 0.05, 8.0, 0.7, 8, 70],
]

/** Notas pedagógicas por nome (mantém o array de dados compacto). */
const WORLD_NOTES: Record<string, string> = {
  Broadcom: 'GAAP FY24 deprimido pela amortização VMware',
  Berkshire: 'lucro marcado-a-mercado (volátil)',
  Netflix: 'Receita/funcionário recorde: ~US$2,8 mi por cabeça',
  Visa: 'Renda de aluguel sobre infraestrutura de pagamento',
  ASML: 'Monopólio mundial de EUV — peça-chave da guerra dos chips',
  AbbVie: 'GAAP deprimido por aquisições (ImmunoGen/Cerevel)',
  UnitedHealth: 'Maior receita do sistema de saúde americano',
  Hermès: 'Margem líquida ~31%: o topo do rentismo de marca',
  Toyota: 'Lucro recorde histórico FY24',
  AMD: 'GAAP deprimido pela amortização da Xilinx',
  Intel: 'Prejuízo GAAP 2024 (reestruturação) — até gigante queima capital',
  Uber: `lucro 2024 c/ crédito fiscal único · ver ${modRef('platform')}`,
  Foxconn: 'Maior empregador privado da China; monta o iPhone',
  PDD: '~US$ 3 mi de receita por funcionário: recorde da lista',
  Meituan: 'milhões de entregadores terceirizados fora da folha',
  BYD: '~900 mil empregados: a maior força de trabalho montadora do mundo',
  Mitsubishi: 'Lucro recorde com o fim das taxas negativas',
  Accenture: '774 mil empregados — cadeia global de terceirização de TI',
  Tata: '591 mil empregados; salário médio ~1/6 do centro: superexploração como vantagem competitiva',
  Boeing: 'Prejuízo 2024 (greve UAW + crise de qualidade) — até gigante queima capital',
  Lockheed: 'F-35/HIMARS · backlog ≈US$176 bi (2024)',
  RTX: 'GAAP FY24 c/ encargos Powder Met; Patriot/Tomahawk',
  GDynamics: 'Abrams, submarinos, munição 155mm',
  Northrop: 'B-21, mísseis nucleares',
  BAE: '~+150% na bolsa desde fev/2022 (est.)',
  Rheinmetall: '>+250% na bolsa 2022→2025 · carteira ≈€55 bi',
  Halliburton: 'LOGCAP/Iraque: contratos sem licitação',
  BP: 'GAAP 2024 quase zerado por write-downs de transição energética',
  McDonald: 'Franquia: margem alta sobre receita baixa',
  Palantir: 'Contratos militares/policiais; margem alta com folha mínima',
  // ── Notas pedagógicas das adições de 2026-09 ──
  Thales: 'Raio-X e sistemas de defesa; a guerra como demanda estatal dirigida',
  Leonardo: 'Aeroespacial e defesa; dependência histórica do orçamento público',
  Saab: 'Aeronaves de combate suecas; identidade nacional sobre a base exportadora',
  'Mitsubishi Heavy': 'Defesa, aeroespacial e construção naval — a guerra como mercado doméstico do Japão',
  Hitachi: 'Conglomerado industrial: infraestrutura, energia e trens; a fração produtiva do capital',
  Nucor: 'Maior produtora de aço dos EUA; a junção do minério importado à posse',
  Freeport: 'Mineração de cobre nos EUA e Indonésia — a dependência mineral do Centro',
  'Anglo American': 'Prejuízo 2024; mineração pressionada pela transição energética',
  BASF: 'Maior química europeia: a base material da indústria pesada',
  LyondellBasell: 'Prejuízo 2024 (custo de energia e supercapacidade petroquímica)',
  FedEx: 'A nervura logística dos EUA; a marca do custo fixo sobre a entrega',
  'DHL Group': 'Logística global; a espinha que move o comércio mundial',
  Enel: 'Maior utility europeia; estatal italiana e o peso da transição energética',
  Mondelez: 'Transformadora de alimentos: a marca captura a margem do pequeno produtor',
  'Kraft Heinz': 'Prejuízo 2024 de US$ 3,4 bi: impairment contábil (write-down) — o preço da promessa corrigido',
  // ── Notas pedagógicas da ampliação de 2026-09 ──
  Nubank: '114 milhões de clientes com ~9 mil funcionários: a produtividade da plataforma · NYSE',
  'América Móvil': 'A maior telecom da América Latina: o Sul conectado (Carlos Slim)',
  Unilever: 'Maior consumo básico globalizado: a marca sobre a margem do produto',
  'AB InBev': 'A colosso belga-brasileira: matriz da Ambev (3G Capital)',
  'General Motors': 'A maior montadora dos EUA: lucro recuperado; o EV ainda queima capital',
  'Ford Motor': 'A prova de massa original (Ford T): hoje o lucro vem do crédito (Ford Credit)',
  Verizon: 'Renda de aluguel sobre a infraestrutura de telecom',
  Comcast: 'Cabos + streaming: a infraestrutura da cultura',
  Disney: 'O acervo cultural como ativo: parques, streaming e licenciamento',
  BlackRock: 'US$ 11,5 tri sob gestão: o maior dono de promessas (capital fictício) do planeta',
  Bayer: 'Litígios do glifosato (Monsanto herdada): a dívida judicial como custo permanente',
  Moderna: 'Pós-pandemia: a demanda do COVID evaporou — até gigante queima capital',
  'Applied Materials': 'Vende as pás da guerra dos chips: depósito e litografia de ponta',
}

function slug(nome: string): string {
  return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 28)
}
const noteKey: Record<string, string> = {
  'General Dynamics': 'GDynamics', 'McDonald\u2019s': 'McDonald', 'Foxconn (Hon Hai)': 'Foxconn',
  'PDD Holdings': 'PDD', 'Lockheed Martin': 'Lockheed', 'RTX (Raytheon)': 'RTX',
  'Mitsubishi UFJ': 'Mitsubishi', 'Tata Consultancy Services': 'Tata',
}

export const COMPANIES_ALL: CompanyRecord[] = [
  ...BR,
  ...WORLD_RAW
    .map(([nome, pais, setor, capTri, receitaBi, lucroBi, emp, sal]): CompanyRecord => ({
      id: `gl-${slug(nome)}`,
      nome, pais, setor,
      mercado: 'GLOBAL', moeda: 'USD',
      receitaBi, lucroBi, funcionariosMil: emp, salarioMedioK: sal,
      capTri: capTri || undefined,
      fonte: GLOBAL_FONTE,
      nota: WORLD_NOTES[noteKey[nome] ?? nome] ?? WORLD_NOTES[nome.split(' ')[0]] ?? WORLD_NOTES[nome],
    })),
].map((c) => ({ ...c, origem: c.origem ?? ('base' as const) }))

/* ═══════════════════ VISTAS DERIVADAS (compatibilidade) ═══════════════════ */

/** Vista Brasil — campos derivados do motor unificado W=c+v+m. */
export interface Company {
  id: string
  nome: string
  setor: string
  ticker?: string
  /** riqueza nova gerada por trabalhador/ano (v+m)/n, R$ */
  produtividade: number
  /** taxa de exploração m/v em % (motor unificado) */
  taxaExploracao: number
  /** minutos de trabalho não pago numa jornada de 8h */
  minutosNaoPagos: number
  dividendosBi: number
  receitaBi: number
  lucroBi: number
  funcionariosMil: number
  salarioMedioK: number
  fonte?: string
  nota?: string
  estimate?: boolean
  origem?: 'base' | 'api'
}

/** Vista Global — mesma forma pública anterior. */
export interface WorldCompany {
  id: string
  nome: string
  pais: string
  setor: string
  capTri?: number
  receitaBi: number
  lucroBi: number
  funcionariosMil: number
  salarioMedioUsdK: number
  fonte?: string
  nota?: string
  estimate?: boolean
  origem?: 'base' | 'api'
}

export function brView(rec: CompanyRecord): Company {
  const d = decomposeValue(rec.receitaBi, rec.funcionariosMil, rec.lucroBi, rec.salarioMedioK)
  return {
    id: rec.id, nome: rec.nome, setor: rec.setor, ticker: rec.ticker,
    produtividade: Math.round(((d.v + d.m) * 1e6) / rec.funcionariosMil),
    taxaExploracao: Math.round(d.e),
    minutosNaoPagos: d.minutesUnpaid,
    dividendosBi: rec.dividendosBi ?? 0,
    receitaBi: rec.receitaBi, lucroBi: rec.lucroBi,
    funcionariosMil: rec.funcionariosMil, salarioMedioK: rec.salarioMedioK,
    fonte: rec.fonte, nota: rec.nota, estimate: rec.estimate, origem: rec.origem,
  }
}

export function worldView(rec: CompanyRecord): WorldCompany {  return {
    id: rec.id, nome: rec.nome, pais: rec.pais, setor: rec.setor,
    capTri: rec.capTri, receitaBi: rec.receitaBi, lucroBi: rec.lucroBi,
    funcionariosMil: rec.funcionariosMil, salarioMedioUsdK: rec.salarioMedioK,
    fonte: rec.fonte, nota: rec.nota, estimate: rec.estimate, origem: rec.origem,
  }
}

export const COMPANIES: Company[] = COMPANIES_ALL.filter((c) => c.mercado === 'BR').map(brView)

/**
 * Métricas tolerantes: base curada usa o caminho completo (funcionários × salário);
 * registros de API sem headcount caem na estimativa por share setorial de folha.
 */
export function metricsFor(rec: CompanyRecord) {
  if (rec.funcionariosMil > 0 && rec.salarioMedioK > 0) {
    return decomposeValue(rec.receitaBi || (rec.capTri ?? 0), rec.funcionariosMil, rec.lucroBi, rec.salarioMedioK)
  }
  const est = sectorEstimate(rec.setor)
  const receita = rec.receitaBi > 0 ? rec.receitaBi : (rec.capTri ?? 0)
  const m = rec.lucroBi !== undefined ? Math.max(rec.lucroBi, 0) : receita * est.margem
  const v = receita * est.folha
  return decomposeFromParts(receita, v, m)
}

export const SECTORS_BR = Array.from(new Set(BR.map((c) => c.setor)))

/** Compat: setores antigos (tabela Brasil legada). */
export const SECTORS = SECTORS_BR

export const WORLD_COMPANIES: WorldCompany[] = COMPANIES_ALL.filter((c) => c.mercado === 'GLOBAL').map(worldView)

/** Agregados das mega-caps rastreadas × agregados mundiais (constantes vivem
 *  em worldWealth.ts — ÚNICA fonte, para os dois módulos nunca divergirem). */
export const WORLD_AGGREGATES = {
  marketCapMundialTri: WORLD_EQUITIES_TRI, // WFE fim-2024
  pibMundialTri: WORLD_GDP_TRI, // IMF WEO 2025 aprox.
}

export function worldSummary(list: WorldCompany[] = WORLD_COMPANIES) {
  const cap = list.reduce((s, c) => s + (c.capTri ?? 0), 0)
  const rec = list.reduce((s, c) => s + c.receitaBi, 0)
  const luc = list.reduce((s, c) => s + c.lucroBi, 0)
  const emp = list.reduce((s, c) => s + c.funcionariosMil, 0)
  return {
    capTri: cap,
    pctMarketCapMundial: (cap / WORLD_AGGREGATES.marketCapMundialTri) * 100,
    receitaBi: rec,
    pctPibMundial: (rec / (WORLD_AGGREGATES.pibMundialTri * 1000)) * 100,
    lucroBi: luc,
    funcionariosMil: emp,
  }
}

export function fmtBRL(n: number): string {
  return `R$ ${n.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}