/**
 * DATASETS CURADOS PARA O LABORATÓRIO ANALÍTICO SQL (DuckDB-Wasm).
 * Metodologia: Comex Stat (MDIC), Penn World Table 10.0, SEC 13F / B3 e BIS/IIF.
 */

export interface ComexRow {
  origem: string
  destino: string
  bloco_origem: string
  bloco_destino: string
  categoria: 'Commodities' | 'Manufaturas' | 'Alta Tecnologia' | 'Energia/Petróleo' | 'Serviços Financeiros'
  usd_bi: number
  ano: number
  drenagem_bi: number
}

export interface PwtRow {
  pais: string
  codigo_iso: string
  ano: number
  pib_nominal_bi: number
  pib_ppp_bi: number
  estoque_capital_c_bi: number
  massa_salarial_v_bi: number
  mais_valia_m_bi: number
  composicao_organica_k: number // c / v
  taxa_exploracao_e: number // m / v
  taxa_lucro_r: number // m / (c + v)
}

export interface OwnershipRow {
  empresa: string
  ticker: string
  pais: string
  setor: string
  fracao_capital: 'Produtivo' | 'Financeiro' | 'Comercial' | 'Fictício / Big Tech' | 'Estatal'
  market_cap_bi: number
  pct_blackrock: number
  pct_vanguard: number
  pct_statestreet: number
  pct_insiders: number
}

export interface DebtRow {
  pais: string
  regiao: 'Centro' | 'Semiperiferia' | 'Periferia'
  divida_pib_pct: number
  divida_dolar_pct: number
  juros_orcamento_pct: number
  reservas_bi: number
  ano: number
}

export const COMEX_DATA: ComexRow[] = [
  // Brasil -> China
  { origem: 'Brasil', destino: 'China', bloco_origem: 'Sul Global / Brics', bloco_destino: 'Fábrica Asiática', categoria: 'Commodities', usd_bi: 58.4, ano: 2024, drenagem_bi: 14.2 },
  { origem: 'Brasil', destino: 'China', bloco_origem: 'Sul Global / Brics', bloco_destino: 'Fábrica Asiática', categoria: 'Energia/Petróleo', usd_bi: 18.2, ano: 2024, drenagem_bi: 3.8 },
  { origem: 'China', destino: 'Brasil', bloco_origem: 'Fábrica Asiática', bloco_destino: 'Sul Global / Brics', categoria: 'Manufaturas', usd_bi: 42.1, ano: 2024, drenagem_bi: -8.5 },
  { origem: 'China', destino: 'Brasil', bloco_origem: 'Fábrica Asiática', bloco_destino: 'Sul Global / Brics', categoria: 'Alta Tecnologia', usd_bi: 16.5, ano: 2024, drenagem_bi: -4.2 },

  // Brasil -> EUA / UE
  { origem: 'Brasil', destino: 'Estados Unidos', bloco_origem: 'Sul Global / Brics', bloco_destino: 'Centro Imperialista', categoria: 'Commodities', usd_bi: 12.8, ano: 2024, drenagem_bi: 3.1 },
  { origem: 'Brasil', destino: 'Estados Unidos', bloco_origem: 'Sul Global / Brics', bloco_destino: 'Centro Imperialista', categoria: 'Serviços Financeiros', usd_bi: 2.1, ano: 2024, drenagem_bi: -18.7 }, // Remessa líquida de lucros e dividendos
  { origem: 'Estados Unidos', destino: 'Brasil', bloco_origem: 'Centro Imperialista', bloco_destino: 'Sul Global / Brics', categoria: 'Alta Tecnologia', usd_bi: 24.3, ano: 2024, drenagem_bi: -9.8 },
  { origem: 'Brasil', destino: 'União Europeia', bloco_origem: 'Sul Global / Brics', bloco_destino: 'Centro Imperialista', categoria: 'Commodities', usd_bi: 28.5, ano: 2024, drenagem_bi: 7.9 },
  { origem: 'União Europeia', destino: 'Brasil', bloco_origem: 'Centro Imperialista', bloco_destino: 'Sul Global / Brics', categoria: 'Manufaturas', usd_bi: 34.2, ano: 2024, drenagem_bi: -11.4 },

  // África -> Europa / China
  { origem: 'Rep. Dem. do Congo', destino: 'China', bloco_origem: 'Periferia Extrativa', bloco_destino: 'Fábrica Asiática', categoria: 'Commodities', usd_bi: 14.6, ano: 2024, drenagem_bi: 6.8 }, // Cobalto e cobre
  { origem: 'Nigéria', destino: 'União Europeia', bloco_origem: 'Periferia Extrativa', bloco_destino: 'Centro Imperialista', categoria: 'Energia/Petróleo', usd_bi: 22.1, ano: 2024, drenagem_bi: 8.4 },
  { origem: 'África do Sul', destino: 'Estados Unidos', bloco_origem: 'Semiperiferia', bloco_destino: 'Centro Imperialista', categoria: 'Commodities', usd_bi: 11.2, ano: 2024, drenagem_bi: 3.5 },

  // Ásia -> EUA / UE
  { origem: 'Taiwan', destino: 'Estados Unidos', bloco_origem: 'Semiperiferia Tecnológica', bloco_destino: 'Centro Imperialista', categoria: 'Alta Tecnologia', usd_bi: 82.4, ano: 2024, drenagem_bi: -12.1 },
  { origem: 'Coreia do Sul', destino: 'Estados Unidos', bloco_origem: 'Semiperiferia Tecnológica', bloco_destino: 'Centro Imperialista', categoria: 'Alta Tecnologia', usd_bi: 64.7, ano: 2024, drenagem_bi: -8.9 },
  { origem: 'China', destino: 'Estados Unidos', bloco_origem: 'Fábrica Asiática', bloco_destino: 'Centro Imperialista', categoria: 'Manufaturas', usd_bi: 427.3, ano: 2024, drenagem_bi: -38.2 },
  { origem: 'China', destino: 'União Europeia', bloco_origem: 'Fábrica Asiática', bloco_destino: 'Centro Imperialista', categoria: 'Manufaturas', usd_bi: 385.1, ano: 2024, drenagem_bi: -31.6 },

  // Petromonarquias -> Ocidente
  { origem: 'Arábia Saudita', destino: 'Estados Unidos', bloco_origem: 'Golfo / Petrodólar', bloco_destino: 'Centro Imperialista', categoria: 'Energia/Petróleo', usd_bi: 18.9, ano: 2024, drenagem_bi: 4.2 },
  { origem: 'Arábia Saudita', destino: 'Estados Unidos', bloco_origem: 'Golfo / Petrodólar', bloco_destino: 'Centro Imperialista', categoria: 'Serviços Financeiros', usd_bi: 45.0, ano: 2024, drenagem_bi: -35.0 }, // Reciclagem de petrodólares em títulos do Tesouro
]

export const PWT_DATA: PwtRow[] = [
  // Brasil (1980 - 2024)
  { pais: 'Brasil', codigo_iso: 'BRA', ano: 1980, pib_nominal_bi: 235, pib_ppp_bi: 580, estoque_capital_c_bi: 590, massa_salarial_v_bi: 110, mais_valia_m_bi: 125, composicao_organica_k: 5.36, taxa_exploracao_e: 1.14, taxa_lucro_r: 0.178 },
  { pais: 'Brasil', codigo_iso: 'BRA', ano: 1990, pib_nominal_bi: 462, pib_ppp_bi: 790, estoque_capital_c_bi: 980, massa_salarial_v_bi: 195, mais_valia_m_bi: 267, composicao_organica_k: 5.03, taxa_exploracao_e: 1.37, taxa_lucro_r: 0.227 },
  { pais: 'Brasil', codigo_iso: 'BRA', ano: 2000, pib_nominal_bi: 655, pib_ppp_bi: 1230, estoque_capital_c_bi: 1820, massa_salarial_v_bi: 275, mais_valia_m_bi: 380, composicao_organica_k: 6.62, taxa_exploracao_e: 1.38, taxa_lucro_r: 0.181 },
  { pais: 'Brasil', codigo_iso: 'BRA', ano: 2010, pib_nominal_bi: 2209, pib_ppp_bi: 2800, estoque_capital_c_bi: 4200, massa_salarial_v_bi: 980, mais_valia_m_bi: 1229, composicao_organica_k: 4.29, taxa_exploracao_e: 1.25, taxa_lucro_r: 0.237 },
  { pais: 'Brasil', codigo_iso: 'BRA', ano: 2020, pib_nominal_bi: 1449, pib_ppp_bi: 3150, estoque_capital_c_bi: 4950, massa_salarial_v_bi: 620, mais_valia_m_bi: 829, composicao_organica_k: 7.98, taxa_exploracao_e: 1.34, taxa_lucro_r: 0.149 },
  { pais: 'Brasil', codigo_iso: 'BRA', ano: 2024, pib_nominal_bi: 2174, pib_ppp_bi: 4270, estoque_capital_c_bi: 6100, massa_salarial_v_bi: 890, mais_valia_m_bi: 1284, composicao_organica_k: 6.85, taxa_exploracao_e: 1.44, taxa_lucro_r: 0.184 },

  // Estados Unidos (1980 - 2024)
  { pais: 'Estados Unidos', codigo_iso: 'USA', ano: 1980, pib_nominal_bi: 2857, pib_ppp_bi: 2857, estoque_capital_c_bi: 9800, massa_salarial_v_bi: 1680, mais_valia_m_bi: 1177, composicao_organica_k: 5.83, taxa_exploracao_e: 0.70, taxa_lucro_r: 0.103 },
  { pais: 'Estados Unidos', codigo_iso: 'USA', ano: 1990, pib_nominal_bi: 5963, pib_ppp_bi: 5963, estoque_capital_c_bi: 21500, massa_salarial_v_bi: 3450, mais_valia_m_bi: 2513, composicao_organica_k: 6.23, taxa_exploracao_e: 0.73, taxa_lucro_r: 0.101 },
  { pais: 'Estados Unidos', codigo_iso: 'USA', ano: 2000, pib_nominal_bi: 10252, pib_ppp_bi: 10252, estoque_capital_c_bi: 38900, massa_salarial_v_bi: 5820, mais_valia_m_bi: 4432, composicao_organica_k: 6.68, taxa_exploracao_e: 0.76, taxa_lucro_r: 0.099 },
  { pais: 'Estados Unidos', codigo_iso: 'USA', ano: 2010, pib_nominal_bi: 15049, pib_ppp_bi: 15049, estoque_capital_c_bi: 54100, massa_salarial_v_bi: 8120, mais_valia_m_bi: 6929, composicao_organica_k: 6.66, taxa_exploracao_e: 0.85, taxa_lucro_r: 0.111 },
  { pais: 'Estados Unidos', codigo_iso: 'USA', ano: 2020, pib_nominal_bi: 21060, pib_ppp_bi: 21060, estoque_capital_c_bi: 73500, massa_salarial_v_bi: 11500, mais_valia_m_bi: 9560, composicao_organica_k: 6.39, taxa_exploracao_e: 0.83, taxa_lucro_r: 0.112 },
  { pais: 'Estados Unidos', codigo_iso: 'USA', ano: 2024, pib_nominal_bi: 28781, pib_ppp_bi: 28781, estoque_capital_c_bi: 88500, massa_salarial_v_bi: 14200, mais_valia_m_bi: 14581, composicao_organica_k: 6.23, taxa_exploracao_e: 1.03, taxa_lucro_r: 0.142 },

  // China (1990 - 2024)
  { pais: 'China', codigo_iso: 'CHN', ano: 1990, pib_nominal_bi: 395, pib_ppp_bi: 1115, estoque_capital_c_bi: 1200, massa_salarial_v_bi: 180, mais_valia_m_bi: 215, composicao_organica_k: 6.67, taxa_exploracao_e: 1.19, taxa_lucro_r: 0.156 },
  { pais: 'China', codigo_iso: 'CHN', ano: 2000, pib_nominal_bi: 1211, pib_ppp_bi: 3670, estoque_capital_c_bi: 4500, massa_salarial_v_bi: 510, mais_valia_m_bi: 701, composicao_organica_k: 8.82, taxa_exploracao_e: 1.37, taxa_lucro_r: 0.140 },
  { pais: 'China', codigo_iso: 'CHN', ano: 2010, pib_nominal_bi: 6087, pib_ppp_bi: 12380, estoque_capital_c_bi: 21000, massa_salarial_v_bi: 2400, mais_valia_m_bi: 3687, composicao_organica_k: 8.75, taxa_exploracao_e: 1.54, taxa_lucro_r: 0.158 },
  { pais: 'China', codigo_iso: 'CHN', ano: 2020, pib_nominal_bi: 14688, pib_ppp_bi: 24280, estoque_capital_c_bi: 62000, massa_salarial_v_bi: 5800, mais_valia_m_bi: 8888, composicao_organica_k: 10.69, taxa_exploracao_e: 1.53, taxa_lucro_r: 0.131 },
  { pais: 'China', codigo_iso: 'CHN', ano: 2024, pib_nominal_bi: 18532, pib_ppp_bi: 35290, estoque_capital_c_bi: 79000, massa_salarial_v_bi: 7400, mais_valia_m_bi: 11132, composicao_organica_k: 10.68, taxa_exploracao_e: 1.50, taxa_lucro_r: 0.129 },

  // Alemanha (1990 - 2024)
  { pais: 'Alemanha', codigo_iso: 'DEU', ano: 1990, pib_nominal_bi: 1770, pib_ppp_bi: 1610, estoque_capital_c_bi: 6800, massa_salarial_v_bi: 980, mais_valia_m_bi: 790, composicao_organica_k: 6.94, taxa_exploracao_e: 0.81, taxa_lucro_r: 0.102 },
  { pais: 'Alemanha', codigo_iso: 'DEU', ano: 2010, pib_nominal_bi: 3416, pib_ppp_bi: 3390, estoque_capital_c_bi: 13200, massa_salarial_v_bi: 1820, mais_valia_m_bi: 1596, composicao_organica_k: 7.25, taxa_exploracao_e: 0.88, taxa_lucro_r: 0.106 },
  { pais: 'Alemanha', codigo_iso: 'DEU', ano: 2024, pib_nominal_bi: 4590, pib_ppp_bi: 5680, estoque_capital_c_bi: 18400, massa_salarial_v_bi: 2410, mais_valia_m_bi: 2180, composicao_organica_k: 7.63, taxa_exploracao_e: 0.90, taxa_lucro_r: 0.105 },
]

export const OWNERSHIP_DATA: OwnershipRow[] = [
  { empresa: 'Apple Inc.', ticker: 'AAPL', pais: 'EUA', setor: 'Hardware & Big Tech', fracao_capital: 'Fictício / Big Tech', market_cap_bi: 3510, pct_blackrock: 7.2, pct_vanguard: 8.8, pct_statestreet: 3.9, pct_insiders: 0.1 },
  { empresa: 'Microsoft Corp.', ticker: 'MSFT', pais: 'EUA', setor: 'Software & Nuvem', fracao_capital: 'Fictício / Big Tech', market_cap_bi: 3120, pct_blackrock: 7.4, pct_vanguard: 9.1, pct_statestreet: 4.1, pct_insiders: 0.2 },
  { empresa: 'NVIDIA Corp.', ticker: 'NVDA', pais: 'EUA', setor: 'Semicondutores & IA', fracao_capital: 'Produtivo', market_cap_bi: 3010, pct_blackrock: 7.6, pct_vanguard: 8.5, pct_statestreet: 3.8, pct_insiders: 4.1 },
  { empresa: 'Amazon.com Inc.', ticker: 'AMZN', pais: 'EUA', setor: 'Comércio Eletrônico & Nuvem', fracao_capital: 'Comercial', market_cap_bi: 2140, pct_blackrock: 6.3, pct_vanguard: 7.5, pct_statestreet: 3.4, pct_insiders: 9.2 },
  { empresa: 'JPMorgan Chase & Co.', ticker: 'JPM', pais: 'EUA', setor: 'Banca Global', fracao_capital: 'Financeiro', market_cap_bi: 640, pct_blackrock: 7.1, pct_vanguard: 9.5, pct_statestreet: 4.6, pct_insiders: 0.5 },
  { empresa: 'Petrobras', ticker: 'PETR4', pais: 'Brasil', setor: 'Óleo & Gás', fracao_capital: 'Estatal', market_cap_bi: 94, pct_blackrock: 2.8, pct_vanguard: 2.1, pct_statestreet: 1.1, pct_insiders: 50.3 }, // Governo Federal 50.3%
  { empresa: 'Vale S.A.', ticker: 'VALE3', pais: 'Brasil', setor: 'Mineração & Minério', fracao_capital: 'Produtivo', market_cap_bi: 52, pct_blackrock: 6.4, pct_vanguard: 5.2, pct_statestreet: 2.4, pct_insiders: 8.6 }, // Previ 8.6%
  { empresa: 'Itaú Unibanco', ticker: 'ITUB4', pais: 'Brasil', setor: 'Banca Privada', fracao_capital: 'Financeiro', market_cap_bi: 58, pct_blackrock: 4.2, pct_vanguard: 3.8, pct_statestreet: 1.9, pct_insiders: 51.2 }, // Itaúsa 51.2%
  { empresa: 'Embraer S.A.', ticker: 'EMBR3', pais: 'Brasil', setor: 'Aeroespacial & Defesa', fracao_capital: 'Produtivo', market_cap_bi: 8, pct_blackrock: 5.1, pct_vanguard: 4.3, pct_statestreet: 2.0, pct_insiders: 5.4 },
  { empresa: 'TSMC', ticker: '2330.TW', pais: 'Taiwan', setor: 'Semicondutores Foundry', fracao_capital: 'Produtivo', market_cap_bi: 840, pct_blackrock: 5.4, pct_vanguard: 4.8, pct_statestreet: 2.1, pct_insiders: 6.4 },
  { empresa: 'ASML Holding', ticker: 'ASML', pais: 'Holanda', setor: 'Litografia EUV', fracao_capital: 'Produtivo', market_cap_bi: 340, pct_blackrock: 6.9, pct_vanguard: 5.7, pct_statestreet: 2.8, pct_insiders: 0.1 },
]

export const DEBT_DATA: DebtRow[] = [
  { pais: 'Japão', regiao: 'Centro', divida_pib_pct: 260.1, divida_dolar_pct: 0.8, juros_orcamento_pct: 7.4, reservas_bi: 1240, ano: 2024 },
  { pais: 'Estados Unidos', regiao: 'Centro', divida_pib_pct: 122.3, divida_dolar_pct: 100.0, juros_orcamento_pct: 17.8, reservas_bi: 240, ano: 2024 },
  { pais: 'Reino Unido', regiao: 'Centro', divida_pib_pct: 101.4, divida_dolar_pct: 2.1, juros_orcamento_pct: 9.2, reservas_bi: 180, ano: 2024 },
  { pais: 'Brasil', regiao: 'Semiperiferia', divida_pib_pct: 77.8, divida_dolar_pct: 6.4, juros_orcamento_pct: 22.4, reservas_bi: 355, ano: 2024 },
  { pais: 'Argentina', regiao: 'Periferia', divida_pib_pct: 88.5, divida_dolar_pct: 68.2, juros_orcamento_pct: 19.5, reservas_bi: 28, ano: 2024 },
  { pais: 'Gana', regiao: 'Periferia', divida_pib_pct: 84.9, divida_dolar_pct: 54.0, juros_orcamento_pct: 38.6, reservas_bi: 6, ano: 2024 },
  { pais: 'Sri Lanka', regiao: 'Periferia', divida_pib_pct: 114.2, divida_dolar_pct: 51.5, juros_orcamento_pct: 42.1, reservas_bi: 4, ano: 2024 },
  { pais: 'China', regiao: 'Semiperiferia', divida_pib_pct: 83.6, divida_dolar_pct: 1.2, juros_orcamento_pct: 6.1, reservas_bi: 3250, ano: 2024 },
]

export interface PresetQuery {
  id: string
  titulo: string
  descricao: string
  categoria: 'Comex' | 'Marx / PWT' | 'Acionistas' | 'Dívida'
  sql: string
}

export const PRESET_QUERIES: PresetQuery[] = [
  {
    id: 'drenagem-blocos',
    titulo: 'Troca Desigual: Drenagem Líquida por Bloco',
    categoria: 'Comex',
    descricao: 'Soma os fluxos anuais e calcula a drenagem líquida transferida entre blocos hegemônicos e a periferia.',
    sql: `SELECT 
  bloco_origem, 
  bloco_destino, 
  categoria, 
  ROUND(SUM(usd_bi), 1) AS total_usd_bi,
  ROUND(SUM(drenagem_bi), 1) AS drenagem_liquida_bi
FROM comex_fluxos
GROUP BY bloco_origem, bloco_destino, categoria
ORDER BY drenagem_liquida_bi DESC;`,
  },
  {
    id: 'pwt-taxa-lucro',
    titulo: 'Composição Orgânica vs Taxa Geral de Lucro (PWT 10.0)',
    categoria: 'Marx / PWT',
    descricao: 'Demonstra a tendência histórica da taxa geral de lucro r = m / (c + v) à medida que o capital constante c cresce.',
    sql: `SELECT 
  pais, 
  ano, 
  ROUND(composicao_organica_k, 2) AS composicao_k,
  ROUND(taxa_exploracao_e * 100, 1) || '%' AS taxa_mais_valia,
  ROUND(taxa_lucro_r * 100, 1) || '%' AS taxa_lucro_r
FROM penn_world_table
WHERE pais IN ('Brasil', 'Estados Unidos', 'China')
ORDER BY pais ASC, ano DESC;`,
  },
  {
    id: 'big-three-monopolio',
    titulo: 'Propriedade Comum: Participação dos "Big Three"',
    categoria: 'Acionistas',
    descricao: 'Mede a soma das participações societárias de BlackRock, Vanguard e State Street em corporações estratégicas.',
    sql: `SELECT 
  empresa, 
  pais, 
  setor, 
  fracao_capital, 
  ROUND(pct_blackrock + pct_vanguard + pct_statestreet, 2) || '%' AS total_big_three,
  market_cap_bi
FROM corporate_ownership
ORDER BY (pct_blackrock + pct_vanguard + pct_statestreet) DESC;`,
  },
  {
    id: 'vulnerabilidade-divida',
    titulo: 'Dependência do Dólar e Custo da Dívida Externa',
    categoria: 'Dívida',
    descricao: 'Cruza a proporção da dívida pública denominada em dólar com o percentual do orçamento consumido por juros.',
    sql: `SELECT 
  pais, 
  regiao, 
  divida_pib_pct || '%' AS divida_pib, 
  divida_dolar_pct || '%' AS divida_em_dolar, 
  juros_orcamento_pct || '%' AS juros_orcamento,
  reservas_bi AS reservas_usd_bi
FROM divida_soberana
ORDER BY divida_dolar_pct DESC;`,
  },
]
