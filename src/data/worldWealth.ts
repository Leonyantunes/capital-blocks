/**
 * RIQUEZA MUNDIAL — agregados patrimoniais com fonte primária.
 * Painel computa as razões (fictício × real) em runtime; nada aqui é inventado
 * sem flag. Vintage distintos são sinalizados por item (ver DATA-GUIDELINES §1).
 */

export interface WealthItem {
  key: string
  label: string
  /** US$ trilhões */
  tri: number
  year: string
  source: string
  sourceUrl?: string
  color: string
  didatico: string
  avancado: string
}

export const WORLD_GDP_TRI = 115 // IMF WEO, PIB nominal mundial aprox. 2025

/** Esfera de TÍTULOS (capital fictício — promessas sobre mais-valia futura) */
export const CLAIMS: WealthItem[] = [
  {
    key: 'equities', label: 'Ações (mercado acionário global)', tri: 124,
    year: 'fim-2024', source: 'WFE / SIFMA', color: '#ba68c8',
    sourceUrl: 'https://www.world-exchanges.org/',
    didatico: 'Todos os papéis de empresas listadas do planeta valem ~US$124 tri — pedidos de parte do lucro FUTURO das empresas.',
    avancado: 'Forma fictícia-privada por excelência: título de propriedade cujo preço capitaliza lucros esperados (∞ horizonte). Rally de IA concentrou ganho nos mega-caps tech.',
  },
  {
    key: 'pubdebt', label: 'Dívida pública mundial', tri: 102,
    year: '2025', source: 'IMF Fiscal Monitor', color: '#9c27b0',
    sourceUrl: 'https://www.imf.org/en/Publications/FM',
    didatico: 'Governos devem ~US$100 tri — promessas assinadas que os bancos descontam todo mês via juros.',
    avancado: '~93% do PIB global (pico pós-GFC/pandemia). Sob moeda própria = capital fictício estatal ancorado pelo banco central; sob moeda alheia = restrição externa real.',
  },
  {
    key: 'privdebt', label: 'Dívida privada não-financeira', tri: 95,
    year: '2024', source: 'BIS', color: '#c084fc',
    sourceUrl: 'https://data.bis.org/topics/TOTAL_CREDIT',
    didatico: 'Empresas e famílias devem ~US$95 tri a bancos e ao mercado de crédito.',
    avancado: 'Crédito bancário cria depósitos (dinheiro endógeno): o endividamento privado antecipa demanda e hipoteca mais-valia futura via serviço da dívida.',
  },
]

/** Base REAL (riqueza encarnada em coisas) */
export const REAL_ASSETS: WealthItem[] = [
  {
    key: 'realestate', label: 'Imobiliário mundial', tri: 380,
    year: '2023', source: 'Savills Global Real Estate', color: '#4caf50',
    didatico: 'Toda a construção do planeta (casas + comércios) vale ~US$380 tri: a maior "poupança" da humanidade está em tijolo.',
    avancado: 'Ativo real NÃO-produtivo no sentido estrito: renda fundiária/aluguel drenam mais-valia sem gerá-la. Principal colateral do sistema de crédito — elo imobiliário↔financeiro.',
  },
]

export const DERIV_NOTIONAL_TRI = 667 // BIS jun/2024, notional OTC (não é riqueza!)
export const PRIVATE_NET_WEALTH_TRI = 454 // UBS GWR 2024 (fim-2023); GWR 2025 segue em alta

export function claimsTotal(): number {
  return CLAIMS.reduce((s, x) => s + x.tri, 0)
}
