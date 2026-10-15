import { useState, useMemo, useCallback } from 'react'
import DeckGL from '@deck.gl/react'
import { ArcLayer, GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers'
import { COUNTRIES_GEOJSON, BLOCS } from '../../lib/world'
import { FLOWS, TYPE_STYLE, type FlowDef, type FlowType } from '../../data/flows'
import { useApp } from '../../store/useApp'
import { pick } from '../../i18n'
import FlowCard from '../FlowCard'

function hexToRgba(hex: string, alpha = 255): [number, number, number, number] {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  if (clean.length === 6) {
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, alpha]
  }
  return [255, 255, 255, alpha]
}

export default function GpuFlowMap() {
  const { sharedMap, setSharedMap, setMapRenderer, setTab, openCountry, lang } = useApp()
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(sharedMap.selFlow)

  const [viewState, setViewState] = useState({
    longitude: sharedMap.lng || 0,
    latitude: sharedMap.lat || 20,
    zoom: Math.max(1, Math.min(6, Math.log2(sharedMap.k || 1) + 1.2)),
    pitch: 38,
    bearing: 0,
    maxPitch: 60,
    minZoom: 0.8,
    maxZoom: 9,
  })

  const onViewStateChange = useCallback(
    ({ viewState: vs }: { viewState: any }) => {
      setViewState(vs)
      setSharedMap({
        lng: vs.longitude,
        lat: vs.latitude,
        k: Math.max(0.5, Math.pow(2, vs.zoom - 1.2)),
      })
    },
    [setSharedMap]
  )

  const blocMap = useMemo(() => {
    return new Map(BLOCS.map((b) => [b.id, b.anchor]))
  }, [])

  const layers = useMemo(() => {
    // 1. Países e continentes (GeoJSON na GPU)
    const countriesLayer = new GeoJsonLayer({
      id: 'gpu-countries-layer',
      data: COUNTRIES_GEOJSON,
      filled: true,
      stroked: true,
      getFillColor: [22, 27, 34, 230],
      getLineColor: [48, 54, 61, 255],
      lineWidthMinPixels: 1,
      pickable: true,
      autoHighlight: true,
      highlightColor: [16, 185, 129, 60],
      onClick: (info: any) => {
        if (info.object?.id) {
          openCountry(String(info.object.id))
        }
      },
    })

    // 2. Hubs e nós dos blocos
    const blocsLayer = new ScatterplotLayer({
      id: 'gpu-blocs-layer',
      data: BLOCS,
      getPosition: (b: any) => b.anchor,
      getFillColor: [255, 193, 7, 220],
      getLineColor: [255, 255, 255, 180],
      stroked: true,
      lineWidthMinPixels: 1.5,
      radiusMinPixels: 4,
      radiusMaxPixels: 9,
      pickable: true,
    })

    // 3. Arcos 3D de fluxos bilaterais de capital (ArcLayer acelerada por GPU)
    const arcsLayer = new ArcLayer<FlowDef>({
      id: 'gpu-arcs-layer',
      data: FLOWS,
      getSourcePosition: (f: FlowDef) => (typeof f.from === 'string' ? blocMap.get(f.from) ?? [0, 0] : f.from),
      getTargetPosition: (f: FlowDef) => (typeof f.to === 'string' ? blocMap.get(f.to) ?? [0, 0] : f.to),
      getSourceColor: (f: FlowDef) => hexToRgba(TYPE_STYLE[f.type as FlowType]?.color ?? '#ffc107', 220),
      getTargetColor: (f: FlowDef) => hexToRgba(TYPE_STYLE[f.type as FlowType]?.color ?? '#ffc107', 220),
      getWidth: (f: FlowDef) => {
        const isSelected = selectedFlowId === f.id
        return isSelected ? 6 : Math.max(2, Math.min(8, (f.peso || 1) * 2.2))
      },
      getHeight: 0.35,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 180],
      onClick: (info: any) => {
        const obj = info.object as FlowDef | undefined
        if (obj?.id) {
          setSelectedFlowId(obj.id)
          setSharedMap({ selFlow: obj.id })
        }
      },
    })

    return [countriesLayer, blocsLayer, arcsLayer]
  }, [blocMap, openCountry, selectedFlowId, setSharedMap])

  return (
    <div className="relative h-[620px] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d1117] shadow-2xl">
      {/* Canvas Deck.gl */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={{ dragRotate: true, scrollZoom: true, doubleClickZoom: true }}
        layers={layers}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      />

      {/* Barra de Ferramentas Superior do Modo GPU */}
      <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-zinc-950/85 px-3 py-1.5 font-mono text-xs shadow-md backdrop-blur">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-emerald-300">GPU Deck.gl 60 FPS</span>
          <span className="text-[10px] text-zinc-400">· WebGL2 Shaders</span>
        </div>

        <button
          onClick={() => setMapRenderer('svg')}
          className="rounded-lg border border-zinc-700 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-200 shadow-md backdrop-blur transition-colors hover:border-money hover:text-money"
          title={pick(lang, 'Alternar para o Mapa Vetorial SVG (Leve / Padrão)', 'Switch to SVG Vector Map (Lightweight / Default)', 'Cambiar al Mapa SVG (Ligero / Predeterminado)')}
        >
          🍃 {pick(lang, 'Modo SVG (Leve)', 'SVG Mode (Light)', 'Modo SVG (Ligero)')}
        </button>

        <button
          onClick={() => setTab('globe3d')}
          className="rounded-lg border border-zinc-700 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-200 shadow-md backdrop-blur transition-colors hover:border-sky-400 hover:text-sky-300"
        >
          🌐 {pick(lang, 'Globo 3D', '3D Globe', 'Globo 3D')}
        </button>
      </div>

      {/* Dica de navegação inferior */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded bg-zinc-950/80 px-2.5 py-1 font-mono text-[10px] text-zinc-400 backdrop-blur">
        {pick(
          lang,
          'Arrastar = navegar · Shift + Arrastar / Botão direito = inclinar câmera 3D · Clique nos arcos = raio-X do fluxo',
          'Drag = pan · Shift + Drag / Right Click = tilt 3D pitch · Click arcs = flow X-Ray',
          'Arrastrar = desplazar · Shift + Arrastrar / Clic derecho = inclinar 3D · Clic en arcos = radiografía'
        )}
      </div>

      {/* Card do Fluxo Selecionado */}
      {selectedFlowId && (
        <div className="absolute bottom-3 right-3 z-20 max-w-sm">
          <FlowCard
            flow={FLOWS.find((f) => f.id === selectedFlowId) ?? null}
            onClose={() => setSelectedFlowId(null)}
          />
        </div>
      )}
    </div>
  )
}
