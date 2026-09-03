/**
 * Matriz de pontos terrestres do globo 3D.
 * Amostra uma grade lat/lng e mantém só os pontos sobre terra (geoContains),
 * com bbox por país para acelerar ~50x. Resultado em cache por sessão.
 */
import { geoContains } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — JSON do world-atlas sem tipagem
import topology from 'world-atlas/countries-110m.json'

export interface LandMatrix {
  /** xyz na esfera unitária (x,y,z por ponto) */
  positions: Float32Array
  /** ISO numérico do país de cada ponto (para destaque regional) */
  isos: string[]
  count: number
}

let cache: LandMatrix | null = null

interface BBoxFeat {
  iso: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geom: any
  minLng: number
  maxLng: number
  minLat: number
  maxLat: number
}

let featCache: BBoxFeat[] | null = null

function eachCoord(coords: unknown, cb: (lng: number, lat: number) => void) {
  const c = coords as { [k: number]: unknown } | null | undefined
  if (typeof c?.[0] === 'number') {
    cb(c[0] as number, c[1] as number)
    return
  }
  for (const sub of (coords as unknown[])) eachCoord(sub, cb)
}

function buildFeatures(): BBoxFeat[] {
  if (featCache) return featCache
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topo = topology as unknown as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fc = feature(topo, topo.objects.countries) as unknown as any
  const out: BBoxFeat[] = []
  for (const f of fc.features ?? []) {
    const iso = String(f.id ?? '')
    const name = f.properties?.name ?? ''
    if (name === 'Antarctica') continue
    let minLng = 180
    let maxLng = -180
    let minLat = 90
    let maxLat = -90
    try {
      eachCoord(f.geometry?.coordinates, (lng, lat) => {
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      })
    } catch {
      continue
    }
    out.push({ iso, name, geom: f.geometry, minLng, maxLng, minLat, maxLat })
  }
  featCache = out
  return out
}

/** País sob um ponto lng/lat (para hover e clique). Retorna null no oceano. */
export function findCountry(lng: number, lat: number): { iso: string; name: string } | null {
  const feats = buildFeatures()
  for (const f of feats) {
    if (lng < f.minLng || lng > f.maxLng || lat < f.minLat || lat > f.maxLat) continue
    try {
      if (geoContains(f.geom, [lng, lat])) return { iso: f.iso, name: f.name || f.iso }
    } catch {
      /* ignora */
    }
  }
  return null
}

let borderCache: Float32Array | null = null

/**
 * Fronteiras dos países como segmentos de linha (interiores + costa),
 * já convertidos para xyz na esfera. Quebras anti-meridiano removidas.
 */
export function getBorderPositions(radius = 1.0025): Float32Array {
  if (borderCache) return borderCache
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topo = topology as unknown as any
  const v: [number, number, number] = [0, 0, 0]
  const pts: number[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushLine = (line: any) => {
    let prev: [number, number] | null = null
    for (const p of line as [number, number][]) {
      if (prev) {
        const dlng = Math.abs(p[0] - prev[0])
        const dlat = Math.abs(p[1] - prev[1])
        /* salta costuras do antimeridiano e artefatos do 110m */
        if (dlng < 25 && dlat < 25) {
          latLngToVec3(prev[0], prev[1], radius, v)
          pts.push(v[0], v[1], v[2])
          latLngToVec3(p[0], p[1], radius, v)
          pts.push(v[0], v[1], v[2])
        }
      }
      prev = p
    }
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inner = mesh(topo, topo.objects.countries, (a: any, b: any) => a !== b) as unknown as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const outer = mesh(topo, topo.objects.countries, (a: any, b: any) => a === b) as unknown as any
    for (const geom of [inner, outer]) {
      const coords = geom?.coordinates as unknown
      if (!coords) continue
      if (geom.type === 'MultiLineString') {
        for (const line of coords as [number, number][][]) pushLine(line)
      } else if (geom.type === 'LineString') {
        pushLine(coords as [number, number][])
      }
    }
  } catch {
    /* sem fronteiras: o globo segue só com pontos */
  }
  borderCache = new Float32Array(pts)
  return borderCache
}

export function latLngToVec3(lng: number, lat: number, radius: number, out?: [number, number, number]): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + 180) * Math.PI) / 180
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  if (out) {
    out[0] = x
    out[1] = y
    out[2] = z
    return out
  }
  return [x, y, z]
}

/** Gera (ou devolve do cache) a matriz de pontos de forma NÃO-bloqueante (fatia por faixas de latitude). */
export function buildLandMatrixAsync(step = 0.85, onProgress?: (done: number, total: number) => void): Promise<LandMatrix> {
  if (cache) {
    onProgress?.(1, 1)
    return Promise.resolve(cache)
  }
  return new Promise((resolve) => {
    const feats = buildFeatures()
    const rows: number[] = []
    for (let lat = -60; lat <= 84; lat += step) rows.push(lat)
    const pts: number[] = []
    const isos: string[] = []
    const v: [number, number, number] = [0, 0, 0]
    let i = 0
    const chunk = () => {
      const end = Math.min(rows.length, i + 6)
      for (; i < end; i++) {
        const lat = rows[i]
        const cos = Math.max(0.22, Math.cos((lat * Math.PI) / 180))
        const lngStep = step / cos
        for (let lng = -180; lng < 180; lng += lngStep) {
          for (const f of feats) {
            if (lng < f.minLng || lng > f.maxLng || lat < f.minLat || lat > f.maxLat) continue
            try {
              if (geoContains(f.geom, [lng, lat])) {
                latLngToVec3(lng, lat, 1, v)
                pts.push(v[0], v[1], v[2])
                isos.push(f.iso)
                break
              }
            } catch {
              /* geometria degenerada: ignora */
            }
          }
        }
      }
      onProgress?.(i, rows.length)
      if (i < rows.length) {
        window.setTimeout(chunk, 0)
      } else {
        cache = { positions: new Float32Array(pts), isos, count: isos.length }
        resolve(cache)
      }
    }
    window.setTimeout(chunk, 0)
  })
}
