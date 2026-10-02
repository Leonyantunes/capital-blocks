/**
 * Índice reverso leve das referências usadas nos cards estatísticos dos tours.
 * Mantido separado de `tours.ts` para a página de fontes não puxar o dataset
 * completo dos tours/desastres para o seu chunk.
 */
export const TOUR_SOURCE_USAGE: Readonly<Record<string, number>> = {
  'alfandegas-estatisticas-nacionais': 48,
  'banco-mundial': 4,
  'bcb-brics': 2,
  'bcb-portal': 8,
  'bis-doc-export-controls': 2,
  'comex-mdic': 6,
  'desastres-corporativos': 27,
  'fluxos-tiers': 3,
  'gallup-statista-salarios': 2,
  'ibge': 6,
  'ica-wcm': 2,
  'ilaese-anuario': 4,
  'imf-cofer': 2,
  'imf-fiscal-monitor': 2,
  'imf-weo': 8,
  'mondragon-casos': 2,
  'nist-chips': 10,
  'oit-trabalho': 19,
  'ostrom-commons': 2,
  'pboc-cips': 10,
  'relatorios-anuais-empresas': 20,
  'sipri-milex': 14,
  'tmd-literatura': 2,
  'un-habitat-orcamento': 2,
  'unctad': 8,
  'us-treasury-tic': 6,
  'vitimas-pesquisa-historica': 2,
  'zucman-tjn-paraísos': 7,
}
