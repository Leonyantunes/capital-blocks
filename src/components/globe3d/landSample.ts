/**
 * AMOSTRADOR PURO de pontos terrestres — sem DOM nem cache, usado pela
 * thread principal (fallback) e dentro do Web Worker (landWorker.ts).
 * Grade lat/lng filtrada por bbox por país + geoContains; os dois caminhos
 * produzem exatamente a mesma matriz.
 */
import { geoContains } from 'd3-geo'
import { feature } from 'topojson-client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — JSON do world-atlas sem tipagem
import topology from 'world-atlas/countries-110m.json'

export interface SampledLand {
  positions: Float32Array
  isos: string[]
  count: number
}

export interface BBoxFeat {
  iso: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geom: any
  minLng: number
  maxLng: number
  minLat: number
  maxLat: number
}

function eachCoord(coords: unknown, cb: (lng: number, lat: number) => void) {
  const c = coords as { [k: number]: unknown } | null | undefined
  if (typeof c?.[0] === 'number') {
    cb(c[0] as number, c[1] as number)
    return
  }
  for (const sub of (coords as unknown[])) eachCoord(sub, cb)
}

/** Países (sem Antártida) com bbox pré-calculada p/ acelerar o teste de ponto. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function collectFeats(): BBoxFeat[] {
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
  return out
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

/** Amostra a grade inteira (síncrono — chamado no worker ou fatiado fora). */
export function sampleLand(step = 0.85, onProgress?: (done: number, total: number) => void): SampledLand {
  const feats = collectFeats()
  const rows: number[] = []
  for (let lat = -60; lat <= 84; lat += step) rows.push(lat)
  const pts: number[] = []
  const isos: string[] = []
  const v: [number, number, number] = [0, 0, 0]
  for (let r = 0; r < rows.length; r++) {
    const lat = rows[r]
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
    onProgress?.(r + 1, rows.length)
  }
  return { positions: new Float32Array(pts), isos, count: isos.length }
}
