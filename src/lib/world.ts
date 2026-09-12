/**
 * INFRA DE GEOGRAFIA REAL — TopoJSON mundial (Natural Earth 110m, world-atlas)
 * projetado com d3-geo. Todos os ~177 países são renderizados e clicáveis;
 * dados de blocos são plugados via ISO numérico em BLOC_MEMBERS.
 */
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
// eslint-disable-next-line
import topology from 'world-atlas/countries-110m.json'

export const MAP_W = 980
export const MAP_H = 540

const topo = topology as unknown as any
const fc: any = feature(topo, topo.objects.countries)

/* eslint-disable @typescript-eslint/no-explicit-any */
export const projection = geoNaturalEarth1().fitExtent(
  [
    [4, 4],
    [MAP_W - 4, MAP_H - 4],
  ],
  { type: 'Sphere' } as any,
)
export const pathGen = geoPath(projection)

export const GRATICULE_D = pathGen(geoGraticule10()) ?? ''
export const SPHERE_D = pathGen({ type: 'Sphere' } as any) ?? ''

export interface CountryFeature {
  /** ISO 3166-1 numeric (string) */
  id: string
  name: string
  d: string
  cx: number
  cy: number
}

export const COUNTRY_FEATURES: CountryFeature[] = fc.features
  .filter((f: any) => f.properties?.name !== 'Antarctica')
  .map((f: any) => {
    const d = pathGen(f) ?? ''
    const [cx = 0, cy = 0] = pathGen.centroid(f) as [number, number]
    return { id: String(f.id), name: f.properties?.name ?? String(f.id), d, cx, cy }
  })

/** Blocos com drawer de dados → ISO numérico dos países-membros. */
export const BLOC_MEMBERS: Record<string, string[]> = {
  usa: ['840'],
  brasil: ['076'],
  eu: [
    '276', '250', '380', '724', '528', '056', '620', '040', '372', '246', '300',
    '703', '705', '191', '440', '428', '233', '203', '348', '616', '752', '208',
    '442', '470', '196', '100', '642',
  ],
  russia: ['643'],
  china: ['156'],
  india: ['356'],
  jpn: ['392'],
  gbr: ['826'],
  kor: ['410'],
  can: ['124'],
  aus: ['036'],
  mex: ['484'],
  sau: ['682'],
  idn: ['360'],
  twn: ['158'],
  tur: ['792'],
  zaf: ['710'],
  are: ['784'],
  irn: ['364'],
}

export const ISO_TO_BLOC: Record<string, string> = Object.entries(BLOC_MEMBERS).reduce(
  (acc, [bloc, isos]) => {
    isos.forEach((iso) => (acc[iso] = bloc))
    return acc
  },
  {} as Record<string, string>,
)

/** Membros plenos do BRICS+ (2025): BRA RUS IND CHN ZAF EGY ETH IRN ARE IDN */
export const BRICS_ISO = new Set(['076', '643', '356', '156', '710', '818', '231', '364', '784', '360'])

type FlowLike = {
  from: string | [number, number]
  to: string | [number, number]
  iso?: string
} | null | undefined

/** ISOs dos países de ponta a ponta de um fluxo (p/ destacar países no tour). */
export function flowIsos(f: FlowLike): string[] {
  if (!f) return []
  const s = new Set<string>()
  if (f.iso) s.add(f.iso)
  for (const side of ['from', 'to'] as const) {
    const v = f[side]
    if (typeof v === 'string') BLOC_MEMBERS[v]?.forEach((iso) => s.add(iso))
  }
  return [...s]
}

export interface BlocVisual {
  id: string
  code: string
  color: string
  /** ponto âncora geográfico [lng, lat] para fluxos/rotulagem */
  anchor: [number, number]
  /** primary = pill grande · secondary = marcador compacto */
  tier?: 'primary' | 'secondary'
}

export const BLOCS: BlocVisual[] = [
  { id: 'usa', code: 'USA', color: '#ffc107', anchor: [-99, 39], tier: 'primary' },
  { id: 'brasil', code: 'BRA', color: '#66bb6a', anchor: [-53, -11], tier: 'primary' },
  { id: 'eu', code: 'UE', color: '#42a5f5', anchor: [9, 50], tier: 'primary' },
  { id: 'russia', code: 'RUS', color: '#ba68c8', anchor: [95, 62], tier: 'primary' },
  { id: 'china', code: 'CHN', color: '#ef5350', anchor: [104, 35], tier: 'primary' },
  { id: 'india', code: 'IND', color: '#26c6da', anchor: [79, 21], tier: 'primary' },
  // grandes economias adicionais
  { id: 'jpn', code: 'JPN', color: '#ff7043', anchor: [138.5, 36.2], tier: 'secondary' },
  { id: 'gbr', code: 'GBR', color: '#7986cb', anchor: [-1.8, 52.6], tier: 'secondary' },
  { id: 'kor', code: 'KOR', color: '#5c6bc0', anchor: [127.9, 36.4], tier: 'secondary' },
  { id: 'can', code: 'CAN', color: '#8d6e63', anchor: [-105, 56], tier: 'secondary' },
  { id: 'aus', code: 'AUS', color: '#c0ca33', anchor: [134, -25.5], tier: 'secondary' },
  { id: 'mex', code: 'MEX', color: '#4db6ac', anchor: [-102.3, 23.6], tier: 'secondary' },
  { id: 'sau', code: 'SAU', color: '#9ccc65', anchor: [45.1, 24], tier: 'secondary' },
  { id: 'idn', code: 'IDN', color: '#f48fb1', anchor: [110.5, -3.5], tier: 'secondary' },
  { id: 'twn', code: 'TWN', color: '#4dd0e1', anchor: [121, 23.7], tier: 'secondary' },
  { id: 'tur', code: 'TUR', color: '#ffab91', anchor: [35.2, 39], tier: 'secondary' },
  { id: 'zaf', code: 'ZAF', color: '#81c784', anchor: [25.2, -29.2], tier: 'secondary' },
  { id: 'are', code: 'ARE', color: '#ffe082', anchor: [54.4, 24], tier: 'secondary' },
  { id: 'irn', code: 'IRN', color: '#b39ddb', anchor: [53.7, 32.4], tier: 'secondary' },
]

/**
 * Ponto médio de uma rota em [lng, lat], calculado em 3D (soma vetorial
 * normalizada). Diferente da média aritmética de longitude, funciona para
 * rotas que cruzam o antimeridiano (ex.: China→EUA pelo Pacífico).
 */
export function routeMidpoint(a: [number, number], b: [number, number]): [number, number] {
  const toVec = (lng: number, lat: number): [number, number, number] => {
    const phi = ((90 - lat) * Math.PI) / 180
    const theta = ((lng + 180) * Math.PI) / 180
    return [-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)]
  }
  const [ax, ay, az] = toVec(a[0], a[1])
  const [bx, by, bz] = toVec(b[0], b[1])
  let x = ax + bx
  let y = ay + by
  let z = az + bz
  const len = Math.hypot(x, y, z)
  if (len < 1e-6) return a // antípodas: mantém a origem
  x /= len
  y /= len
  z /= len
  const lat = 90 - (Math.acos(Math.max(-1, Math.min(1, y))) * 180) / Math.PI
  let lng = (Math.atan2(z, -x) * 180) / Math.PI - 180
  while (lng < -180) lng += 360
  while (lng > 180) lng -= 360
  return [lng, lat]
}

export function project(lngLat: [number, number]): [number, number] {
  const p = projection(lngLat)
  // guarda defensiva: coordenadas inválidas nunca derrubam o mapa
  if (!p || Number.isNaN(p[0]) || Number.isNaN(p[1])) return [0, 0]
  return p as [number, number]
}

/** Arco quadrático projetado entre dois pontos geográficos. bend>0 curva à esquerda da rota. */
export function arcPath(from: [number, number], to: [number, number], bend = 0.22): string {
  const [x1, y1] = project(from)
  const [x2, y2] = project(to)
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.hypot(dx, dy) || 1
  const cx = mx + (-dy / dist) * dist * bend
  const cy = my + (dx / dist) * dist * bend
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
}

/** Ponto no parâmetro t (0..1) de uma quadrática — usado p/ marcadores ✕ etc. */
export function quadPoint(d: string, t = 0.5): [number, number] {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  if (nums.length < 6) return [0, 0]
  const [x1, y1, cx, cy, x2, y2] = nums
  const u = 1 - t
  return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2]
}
