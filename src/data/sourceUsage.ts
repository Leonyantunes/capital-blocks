/**
 * Índice reverso leve das referências usadas nos cards estatísticos dos tours.
 * Mantido separado de `tours.ts` para a página de fontes não puxar o dataset
 * completo dos tours/desastres para o seu chunk.
 */
export const TOUR_SOURCE_USAGE: Readonly<Record<string, number>> = {
  'alfandegas-estatisticas-nacionais': 63,
  'banco-mundial': 4,
  'bcb-brics': 3,
  'bcb-portal': 12,
  'bis-doc-export-controls': 2,
  'comex-mdic': 10,
  'desastres-corporativos': 27,
  'fluxos-tiers': 3,
  'gallup-statista-salarios': 6,
  'heterodox-macro': 2,
  'ibge': 8,
  'ica-wcm': 4,
  'ilaese-anuario': 6,
  'imf-cofer': 5,
  'imf-fiscal-monitor': 5,
  'imf-weo': 14,
  'marx-capital': 2,
  'mmt-literatura': 2,
  'mondragon-casos': 4,
  'nist-chips': 12,
  'oit-trabalho': 25,
  'ostrom-commons': 4,
  'pboc-cips': 13,
  'relatorios-anuais-empresas': 30,
  'sipri-milex': 15,
  'tesouro-eua-cbo': 1,
  'tmd-literatura': 5,
  'un-habitat-orcamento': 4,
  'unctad': 12,
  'us-treasury-tic': 11,
  'vitimas-pesquisa-historica': 5,
  'zucman-tjn-paraísos': 13,
}
