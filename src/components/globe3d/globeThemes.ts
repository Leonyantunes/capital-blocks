/** Temas planetários do Mapa 3D — paletas inspiradas na referência (Planet Matrix). */

export interface GlobeTheme {
  id: string
  label: string
  sub: string
  /** cor dos pontos terrestres */
  dot: string
  /** cor da atmosfera / glow */
  glow: string
  hex: string
}

export const GLOBE_THEMES: GlobeTheme[] = [
  { id: 'cyber', label: 'Ciano Matrix', sub: 'Cyan Matrix', dot: '#22d3ee', glow: '#22d3ee', hex: '#22D3EE' },
  { id: 'quantum', label: 'Azul Quântico', sub: 'Quantum Blue', dot: '#5aa2ff', glow: '#3b82f6', hex: '#3B82F6' },
  { id: 'emerald', label: 'Verde Esmeralda', sub: 'Emerald Tech', dot: '#34d399', glow: '#10b981', hex: '#10B981' },
  { id: 'nebula', label: 'Violeta Nebulosa', sub: 'Nebula Violet', dot: '#c084fc', glow: '#a855f7', hex: '#A855F7' },
  { id: 'solar', label: 'Ouro Solar', sub: 'Solar Gold', dot: '#fbbf24', glow: '#f59e0b', hex: '#F59E0B' },
  { id: 'crimson', label: 'Núcleo Carmesim', sub: 'Crimson Core', dot: '#f87171', glow: '#ef4444', hex: '#EF4444' },
  { id: 'hyper', label: 'Branco Híper', sub: 'Hyper White', dot: '#e8edf5', glow: '#93c5fd', hex: '#E5E7EB' },
]

export const GLOW_SWATCHES = ['#22d3ee', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444']

/** Conjuntos regionais para destaque separado (borda + pontos internos). */
export const REGION_SETS: Record<string, { label: string; isos: string[] }> = {
  none: { label: 'Nenhuma', isos: [] },
  brics: { label: 'BRICS+ (10 membros)', isos: ['076', '643', '356', '156', '710', '818', '231', '364', '784', '360'] },
  china: { label: 'China', isos: ['156'] },
  usa: { label: 'Estados Unidos', isos: ['840'] },
  ue: {
    label: 'União Europeia',
    isos: [
      '276', '250', '380', '724', '528', '056', '620', '040', '372', '246', '300',
      '703', '705', '191', '440', '428', '233', '203', '348', '616', '752', '208',
      '442', '470', '196', '100', '642',
    ],
  },
  sul: { label: 'Sul Global (BRA+IND+ZAF)', isos: ['076', '356', '710'] },
}
