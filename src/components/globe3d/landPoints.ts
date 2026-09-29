/**
 * Matriz de pontos terrestres do globo 3D.
 * Amostra uma grade lat/lng e mantém só os pontos sobre terra (geoContains).
 * O cálculo roda num Web Worker (landWorker.ts) para não travar o render no
 * celular; sem worker disponível, cai no fatiamento por setTimeout (original).
 * Resultado em cache por sessão.
 */
import { geoContains } from 'd3-geo'
import { mesh } from 'topojson-client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — JSON do world-atlas sem tipagem
import topology from 'world-atlas/countries-110m.json'
import { collectFeats, latLngToVec3, type BBoxFeat, type Topology } from './landSample'

export { latLngToVec3 }

export interface LandMatrix {
  /** xyz na esfera unitária (x,y,z por ponto) */
  positions: Float32Array
  /** ISO numérico do país de cada ponto (para destaque regional) */
  isos: string[]
  count: number
}

let cache: LandMatrix | null = null
let pending: Promise<LandMatrix> | null = null

let featCache: BBoxFeat[] | null = null
function buildFeatures(): BBoxFeat[] {
  if (!featCache) featCache = collectFeats(topology as unknown as Topology)
  return featCache
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

/** Fallback original: fatia por faixas de latitude na thread principal. */
function viaChunks(step: number, onProgress?: (done: number, total: number) => void): Promise<LandMatrix> {
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
        resolve({ positions: new Float32Array(pts), isos, count: isos.length })
      }
    }
    window.setTimeout(chunk, 0)
  })
}

/** Matriz via Web Worker (transfere o Float32Array sem cópia). */
function viaWorker(step: number, onProgress?: (done: number, total: number) => void): Promise<LandMatrix> {
  return new Promise((resolve, reject) => {
    let w: Worker
    try {
      w = new Worker(new URL('./landWorker.ts', import.meta.url), { type: 'module' })
    } catch (err) {
      reject(err)
      return
    }
    w.onmessage = (e: MessageEvent) => {
      const d = e.data as { type: string; done?: number; total?: number; positions?: Float32Array; isos?: string[]; count?: number; message?: string }
      if (d?.type === 'progress') {
        onProgress?.(d.done ?? 0, d.total ?? 1)
      } else if (d?.type === 'done' && d.positions && d.isos) {
        w.terminate()
        resolve({ positions: d.positions, isos: d.isos, count: d.count ?? d.isos.length })
      } else if (d?.type === 'error') {
        /* o worker recebeu a topologia estruturada (postMessage a clona) —
           se algo falhar, cai no caminho fatiado em vez de travar o globe */
        w.terminate()
        reject(new Error(d.message ?? 'landWorker: erro interno'))
      }
    }
    w.onerror = () => {
      w.terminate()
      reject(new Error('landWorker falhou'))
    }
    w.postMessage({ step, topology })
  })
}

/** Gera (ou devolve do cache) a matriz de pontos de forma NÃO-bloqueante. */
export function buildLandMatrixAsync(step = 0.85, onProgress?: (done: number, total: number) => void): Promise<LandMatrix> {
  if (cache) {
    onProgress?.(1, 1)
    return Promise.resolve(cache)
  }
  if (!pending) {
    pending = viaWorker(step, onProgress)
      .catch(() => viaChunks(step, onProgress))
      .then((m) => {
        cache = m
        pending = null
        return m
      })
  }
  return pending
}
