/**
 * GLOBE MODULE — segunda versão do mapa: globo 3D interativo.
 * Reusa os MESMOS dados do mapa 2D (FLOWS, BLOCS, conflitos) com
 * direção de arte "Planet Matrix": temas, atmosfera, bloom, satélites,
 * HUD de telemetria, tour guiado e painel visual lateral.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Globe3DCanvas, { type GlobeFocus } from './Globe3DCanvas'
import { GLOBE_THEMES, GLOW_SWATCHES, REGION_SETS } from './globeThemes'
import { FLOWS, TYPE_STYLE, type FlowDef, type FlowType } from '../../data/flows'
import { TOURES, getTour, stopColor, stopIsos } from '../../data/tours'
import { BLOCS, flowIsos } from '../../lib/world'
import { useApp } from '../../store/useApp'

/** Chips de conflito locais (mesmos do mapa 2D, sem puxar o chunk do MapWorld). */
const GLOBE_CONFLICTS: { id: 'semis' | 'energia' | 'reprimaria'; chip: string; title: string; didatico: string; avancado: string; color: string }[] = [
  {
    id: 'semis', chip: 'Guerra dos Semicondutores', title: 'EUA × China — Guerra dos Semicondutores', color: '#ef5350',
    didatico: 'Os EUA bloqueiam a venda dos chips mais avançados para frear a indústria chinesa — quase 90% dos chips de ponta são feitos em Taiwan.',
    avancado: 'Export controls sobre o capital constante mais avançado: contenção tecnológica chinesa + renda de monopólio anglo-americana (TSMC ~90% dos nós <7nm).',
  },
  {
    id: 'energia', chip: 'Energia & Sanções (RUS × UE)', title: 'Rússia × OTAN/UE — Guerra de Energia e Sanções', color: '#ffb300',
    didatico: 'As sanções cortaram os dutos rumo à Europa: petróleo e gás russos mudaram de rota para a Ásia.',
    avancado: 'Redirecionamento do capital energético russo à Ásia e elevação dos custos do capital produtivo europeu.',
  },
  {
    id: 'reprimaria', chip: 'Reprimarização no Brasil', title: 'Brasil — Reprimarização & Exército de Reserva', color: '#66bb6a',
    didatico: 'O Brasil voltou a depender de grãos e minério enquanto ~92 milhões ficam fora ou na borda do mercado de trabalho.',
    avancado: 'Especialização regressiva + Exército Industrial de Reserva de 92,1 mi: superexploração estrutural.',
  },
]

function GlobeConflictChips() {
  const conflict = useApp((s) => s.conflict)
  const setConflict = useApp((s) => s.setConflict)
  const mode = useApp((s) => s.mode)
  const active = GLOBE_CONFLICTS.find((c) => c.id === conflict) ?? null
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {GLOBE_CONFLICTS.map((c) => (
          <button key={c.id} onClick={() => setConflict(conflict === c.id ? null : c.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              conflict === c.id ? 'border-transparent text-zinc-950' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            }`}
            style={conflict === c.id ? { background: c.color } : undefined}>
            {c.chip}
          </button>
        ))}
      </div>
      {active && (
        <div className="rounded-lg border p-3 text-xs leading-relaxed" style={{ borderColor: `${active.color}55`, background: `${active.color}0d` }}>
          <div className="font-semibold" style={{ color: active.color }}>{active.title}</div>
          <p className="mt-1 text-zinc-300">{mode === 'didatico' ? active.didatico : active.avancado}</p>
        </div>
      )}
    </div>
  )
}

/* ── tour 3D (voa o globo + acende fluxo/conflito) ─────────── */
/* ── tour COMPARTILHADO com o 2D (src/data/tour.ts): mesmas paradas, mesma narrativa ── */

function Toggle({ on, onClick, accent = '#3b82f6' }: { on: boolean; onClick: () => void; accent?: string }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className="relative h-5 w-9 shrink-0 rounded-full border transition-colors"
      style={{ background: on ? accent : '#27272a', borderColor: on ? accent : '#3f3f46' }}
    >
      <span
        className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-all"
        style={{ left: on ? '18px' : '3px' }}
      />
    </button>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-[11px] text-zinc-400">{label}</span>
      <span className="flex items-center gap-2">{children}</span>
    </div>
  )
}

/** Card do fluxo selecionado — mesma estética do globo (sem drawer lateral). */
function FlowCard({ flow, onClose }: { flow: FlowDef; onClose: () => void }) {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const st = TYPE_STYLE[flow.type]
  const codeOf = (id: string | [number, number], label?: string) => {
    if (typeof id === 'string') {
      const b = BLOCS.find((x) => x.id === id)
      if (b) return { code: b.code, color: b.color }
    }
    return { code: label ?? '—', color: '#8b949e' }
  }
  const from = codeOf(flow.from, flow.fromLabel)
  const to = codeOf(flow.to, flow.toLabel)
  return (
    <div
      role="dialog"
      aria-label="Detalhes do fluxo"
      className="thin-scroll absolute bottom-14 left-1/2 z-30 max-h-[52%] w-[min(94%,580px)] -translate-x-1/2 overflow-y-auto rounded-xl border bg-[#060b16]/95 p-4 shadow-2xl backdrop-blur max-md:bottom-16 max-md:p-3"
      style={{ borderColor: `${st.color}88`, boxShadow: `0 0 36px ${st.color}33, 0 18px 50px rgba(0,0,0,.6)` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider">
            <span style={{ color: from.color }}>{from.code}</span>
            <span className="text-zinc-600">──▶</span>
            <span style={{ color: to.color }}>{to.code}</span>
            <span className="ml-1 rounded px-1.5 py-0.5" style={{ background: `${st.color}22`, color: st.color }}>
              {st.label.split('(')[0].trim()}
            </span>
          </div>
          <div className="mt-1 text-sm font-bold text-zinc-100">{flow.titulo}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Fechar detalhes do fluxo"
          className="shrink-0 rounded-md border border-zinc-700 px-2 py-1 text-[11px] text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-100"
        >
          ✕
        </button>
      </div>
      <div
        className="mt-2.5 rounded-lg border p-2.5"
        style={{ borderColor: `${st.color}55`, background: `${st.color}0d` }}
      >
        <div className="text-[9px] uppercase tracking-widest text-zinc-500">escala anual do fluxo</div>
        <div className="font-mono text-xl font-extrabold" style={{ color: st.color }}>{flow.totalAnual}</div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-300">{didatico ? flow.did : flow.adv}</p>
      <div className="mt-2.5 space-y-1.5">
        {flow.itens.map((it) => (
          <div key={it.rotulo} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold text-zinc-100">{it.rotulo}</span>
              <span className="shrink-0 font-mono text-[10.5px] font-bold" style={{ color: st.color }}>{it.valor}</span>
            </div>
            {it.nota && <div className="mt-0.5 text-[10px] leading-snug text-zinc-500">{it.nota}</div>}
          </div>
        ))}
      </div>
      {flow.fonte && <p className="mt-2 font-mono text-[9px] leading-relaxed text-zinc-600">fontes: {flow.fonte}</p>}
    </div>
  )
}

export default function GlobeModule() {
  const setTab = useApp((s) => s.setTab)
  const openCountry = useApp((s) => s.openCountry)
  const conflict = useApp((s) => s.conflict)
  const setConflict = useApp((s) => s.setConflict)
  const mode = useApp((s) => s.mode)

  /* ── visual ── */
  const [themeId, setThemeId] = useState(() => localStorage.getItem('globe3d-theme') || 'quantum')
  const [customHex, setCustomHex] = useState('#3b82f6')
  const [useCustom, setUseCustom] = useState(false)
  const theme = useMemo(
    () => GLOBE_THEMES.find((t) => t.id === themeId) ?? GLOBE_THEMES[1],
    [themeId],
  )
  const themeDotBase = useCustom ? customHex : theme.dot
  const themeGlowBase = useCustom ? customHex : theme.glow

  const [atmosphere, setAtmosphere] = useState(true)
  const [atmoIntensity, setAtmoIntensity] = useState(1.15)
  const [glowColor, setGlowColor] = useState('')
  const [bloom, setBloom] = useState(true)
  const [bloomIntensity, setBloomIntensity] = useState(1.2)
  const [autoRotate, setAutoRotate] = useState(true)
  const [rotateSpeed, setRotateSpeed] = useState(1)
  const [arcSpeed, setArcSpeed] = useState(1.2)
  const [dotSize, setDotSize] = useState(
    () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.014 : 0.0115),
  )
  const [showArcs, setShowArcs] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showGraticule, setShowGraticule] = useState(true)
  const [showBorders, setShowBorders] = useState(true)
  const [showCountryTip, setShowCountryTip] = useState(true)
  const [showStars, setShowStars] = useState(true)
  const [showArrows, setShowArrows] = useState(true)
  /** camada temática dos pontos quando NÃO há tour (o tour tem a sua) */
  const [baseLayer, setBaseLayer] = useState<'none' | 'wages' | 'deaths'>('none')
  const [regionKey, setRegionKey] = useState('brics')
  const [regionOn, setRegionOn] = useState(true)
  const [highlightFill, setHighlightFill] = useState('#facc15')

  /* ── dados (iguais ao 2D) ── */
  const [visibleLayers, setVisibleLayers] = useState<Record<FlowType, boolean>>({
    commodities: true, manufatura: true, drain: true, dollar: true, brics: true, fantasma: true,
  })
  const [selFlow, setSelFlow] = useState<string | null>(null)
  const [tourStep, setTourStep] = useState<number | null>(null)
  /** tour temático ativo (base comum ao 2D e ao 3D) */
  const [activeTourId, setActiveTourId] = useState('principal')
  const STOPS = getTour(activeTourId).stops
  const TOUR_ACCENT = getTour(activeTourId).accent
  /* tours de guerra tingem o globo de vermelho (só enquanto o tour roda) */
  const warTheme = activeTourId.startsWith('guerra') && tourStep !== null
  const themeDot = warTheme ? '#f87171' : themeDotBase
  const themeGlow = warTheme ? '#ef4444' : themeGlowBase
  const [focus, setFocus] = useState<GlobeFocus | null>(null)
  const [hud, setHud] = useState({ fps: 60, lat: 14, lng: -30, alt: 44693 })
  const [dotCount, setDotCount] = useState(0)
  /* painel lateral: fechado por padrão; abre na aba de infos */
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelTab, setPanelTab] = useState<'info' | 'visual'>('info')
  const [showFlowList, setShowFlowList] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const [isFs, setIsFs] = useState(false)

  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  const toggleLayer = (t: FlowType) => setVisibleLayers((s) => ({ ...s, [t]: !s[t] }))

  const highlightFlowIds = useMemo(() => {
    if (conflict === 'energia') return ['com-rus-chn']
    if (conflict === 'reprimaria') return ['com-bra-chn', 'com-bra-eu', 'drn-bra-usa']
    return []
  }, [conflict])

  const selFlowObj = useMemo(() => FLOWS.find((f) => f.id === selFlow) ?? null, [selFlow])

  /* países em destaque no globo: parada do tour (fluxo ou ISOs manuais) ou seleção manual */
  const spot = useMemo(() => {
    if (tourStep !== null) {
      const s = STOPS[tourStep]
      if (!s) return null
      const isos = stopIsos(s)
      if (!isos.length) return null
      return { isos, color: stopColor(s) ?? TOUR_ACCENT }
    }
    if (selFlowObj) {
      return { isos: flowIsos(selFlowObj), color: TYPE_STYLE[selFlowObj.type].color }
    }
    return null
  }, [tourStep, selFlowObj, activeTourId]) // eslint-disable-line react-hooks/exhaustive-deps

  const opts = useMemo(
    () => ({
      themeDot,
      themeGlow,
      dotSize,
      atmosphere,
      atmosphereIntensity: atmoIntensity,
      glowColor: glowColor || themeGlow,
      bloom,
      bloomIntensity,
      /* com rota ativa ou tour, o giro pausa sozinho */
      autoRotate: tourStep !== null || selFlow !== null ? false : autoRotate,
      rotateSpeed,
      arcSpeed,
      showArcs,
      showMarkers,
      showLabels,
      showGraticule,
      showBorders,
      showCountryTip,
      showStars,
      highlightIsos: regionOn ? REGION_SETS[regionKey]?.isos ?? [] : [],
      highlightFill,
      /* o tour define a própria camada temática; fora dele, vale a escolha base */
      layer: tourStep !== null && STOPS[tourStep]?.layer
        ? (STOPS[tourStep]!.layer as 'wages' | 'deaths')
        : baseLayer,
      showArrows,
    }),
    [themeDot, themeGlow, dotSize, atmosphere, atmoIntensity, glowColor, bloom, bloomIntensity, autoRotate, tourStep, selFlow, rotateSpeed, arcSpeed, showArcs, showMarkers, showLabels, showGraticule, showBorders, showCountryTip, showStars, regionOn, regionKey, highlightFill, baseLayer, showArrows],
  )

  const onStats = useCallback((s: { fps: number; lat: number; lng: number; alt: number }) => setHud(s), [])
  const onReady = useCallback((n: number) => setDotCount(n), [])

  const flyNonce = useRef(1)
  const flyTo = (lng: number, lat: number, dist?: number, lift?: number) =>
    setFocus({ lng, lat, nonce: flyNonce.current++, dist, lift })
  /** voa enquadrando a rota inteira (ponta a ponta), sem média de longitude */
  const flyToFlow = (id: string, lift?: number) =>
    setFocus({ lng: 0, lat: 0, nonce: flyNonce.current++, flowId: id, lift })

  /* clique em marcador/rótulo/país: abre o bloco E voa até ele */
  const handleBloc = (id: string) => {
    const b = BLOCS.find((x) => x.id === id)
    if (b) flyTo(b.anchor[0], b.anchor[1], 2.0)
    openCountry(id)
  }

  /* tour (abre em tela cheia; o país aparece acima do card) */
  const startTour = () => {
    try {
      if (!document.fullscreenElement) {
        const p = boxRef.current?.requestFullscreen?.() as Promise<void> | undefined
        p?.catch(() => {})
      }
    } catch {
      /* sem fullscreen: o tour segue normal */
    }
    setPanelOpen(false)
    setShowFlowList(false)
    gotoTour(0)
  }
  const applyTourStep = (i: number) => {
    const s = STOPS[i]
    if (!s) return
    /* parada com rota: enquadra as duas pontas; senão, o ponto da parada */
    if (s.flowId) flyToFlow(s.flowId, 0.55)
    else flyTo(s.lng, s.lat, undefined, 0.55)
    setSelFlow(s.flowId ?? null)
    setConflict((s.conflict as typeof conflict) ?? null)
  }
  const gotoTour = (i: number) => {
    setTourStep(i)
    applyTourStep(i)
  }
  const endTour = () => {
    setTourStep(null)
    setSelFlow(null)
    setConflict(null)
    try {
      if (document.fullscreenElement) {
        const p = document.exitFullscreen() as Promise<void> | undefined
        p?.catch(() => {})
      }
    } catch {
      /* nada */
    }
  }
  /* troca de tour temático com o tour aberto */
  useEffect(() => {
    if (tourStep !== null) applyTourStep(tourStep)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTourId])

  /* clique num arco (globo ou lista): seleciona E dá zoom na rota */
  const handleFlow = (id: string | null) => {
    /* no tour, clique no vazio restaura o destaque da parada (sem revoar) */
    if (tourStep !== null && !id) {
      const s = STOPS[tourStep]
      if (s?.flowId) setSelFlow(s.flowId)
      return
    }
    setSelFlow(id)
    if (!id) return
    /* enquadra a rota inteira (robusto p/ rotas que cruzam o Pacífico) */
    flyToFlow(id, 0.5)
  }
  const focusFlow = handleFlow

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => setIsFs(false))
    else boxRef.current?.requestFullscreen?.().catch(() => {})
  }
  const pickTheme = (id: string) => {
    setThemeId(id)
    setUseCustom(false)
    localStorage.setItem('globe3d-theme', id)
  }

  const fmt = (n: number, d = 0) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })
  const latStr = `${Math.abs(hud.lat).toFixed(0)}°${hud.lat >= 0 ? 'N' : 'S'}`
  const lngStr = `${Math.abs(hud.lng).toFixed(0)}°${hud.lng >= 0 ? 'E' : 'W'}`

  return (
    <div className="flex flex-col gap-4">
      {/* ── cabeçalho ── */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
              Mapa 3D · Segunda versão
            </span>
            <span className="rounded border border-emerald-400/50 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
              ● BETA
            </span>
          </div>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">
            O planeta do capital em 3D
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
            O mesmo tabuleiro do mapa 2D — fluxos, blocos e guerras de capitais — sobre um globo vivo.
            Arraste para orbitar, scroll/pinch para zoom, clique num arco para voar até a rota, clique num país para abrir o bloco. Base do futuro tour 3D.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTab('home')}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-sky-400/60 hover:text-sky-300"
          >
            ← Mapa 2D
          </button>
          <button
            onClick={startTour}
            className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            ▶ Tour 3D
          </button>
          <button
            onClick={toggleFullscreen}
            title="Ver o mapa 3D em tela cheia"
            className="rounded-lg border border-sky-400/60 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-300 transition-colors hover:bg-sky-400/20"
          >
            ⛶ Tela cheia
          </button>
          <button
            onClick={() => { setPanelTab('info'); setPanelOpen((s) => !s) }}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 lg:hidden"
          >
            ⓘ Painel
          </button>
        </div>
      </header>

      {/* ── palco 3D ── */}
      <div
        ref={boxRef}
        className={`relative overflow-hidden border border-zinc-800 bg-black ${
          isFs || document.fullscreenElement ? '' : 'rounded-xl'
        }`}
        style={isFs
          ? { height: '100vh', minHeight: 0 }
          : {
            height: 'min(78vh, 760px)',
            minHeight: 480,
            background: 'radial-gradient(ellipse 90% 80% at 50% 42%, #0a1428 0%, #04070f 55%, #000000 100%)',
          }}
      >
        <div className="absolute inset-0">
          <Globe3DCanvas
            opts={opts}
            visibleLayers={visibleLayers}
            selectedFlowId={selFlow}
            highlightFlowIds={highlightFlowIds}
            spot={spot}
            onSelectFlow={handleFlow}
            onSelectBloc={handleBloc}
            onStats={onStats}
            onReady={onReady}
            focus={focus}
          />
        </div>

        {/* HUD superior-esquerdo */}
        <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-lg border border-sky-400/30 bg-[#060b16]/85 px-3 py-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-extrabold tracking-wider text-zinc-100">
              ◉ PLANET MATRIX // v1.0
            </span>
            <span className="rounded border border-emerald-400/60 bg-emerald-400/15 px-1.5 py-px font-mono text-[9px] font-bold text-emerald-300">
              ● ONLINE
            </span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 font-mono text-[10px] text-zinc-400">
            <span>LAT: <b className="text-zinc-100">{latStr}</b></span>
            <span>LNG: <b className="text-zinc-100">{lngStr}</b></span>
            <span>ALTITUDE: <b className="text-zinc-100">{fmt(hud.alt)} KM</b></span>
            <span>FPS: <b className="text-emerald-300">{hud.fps}</b></span>
          </div>
        </div>

        {/* atalhos superiores-direitos */}
        <div className="absolute right-3 top-3 z-20 hidden gap-1.5 md:flex">
          <button
            onClick={toggleFullscreen}
            title="Ver o mapa 3D em tela cheia"
            className="rounded-full border border-sky-400/70 bg-sky-400/15 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-sky-200 backdrop-blur transition-colors hover:bg-sky-400/25"
          >
            ⛶ TELA CHEIA
          </button>
          <button
            onClick={() => setAutoRotate((s) => !s)}
            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider backdrop-blur transition-colors ${
              autoRotate ? 'border-zinc-600 bg-zinc-900/80 text-zinc-200' : 'border-zinc-700 bg-zinc-900/80 text-zinc-500'
            }`}
          >
            {autoRotate ? '❚❚ GIRO' : '▶ GIRO'}
          </button>
          <button
            onClick={() => setPanelOpen((s) => !s)}
            className="rounded-full border border-zinc-600 bg-zinc-900/80 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-zinc-200 backdrop-blur transition-colors hover:border-sky-400/60 hover:text-sky-200"
          >
            ⓘ PAINEL
          </button>
        </div>

        {/* camadas rápidas (esquerda, desktop) */}
        <div className="absolute left-3 top-28 z-20 hidden w-48 flex-col gap-0.5 rounded-lg border border-zinc-800 bg-[#060b16]/85 p-1.5 backdrop-blur md:flex">
          {(Object.keys(TYPE_STYLE) as FlowType[]).map((t) => (
            <button
              key={t}
              onClick={() => toggleLayer(t)}
              className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] transition-opacity ${
                visibleLayers[t] ? 'opacity-100' : 'opacity-40'
              } hover:bg-zinc-800/80`}
            >
              <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: TYPE_STYLE[t].color }} />
              <span className="truncate text-zinc-300">{TYPE_STYLE[t].label}</span>
            </button>
          ))}
          <div className="my-1 h-px bg-zinc-800" />
          <button
            onClick={() => setShowFlowList((s) => !s)}
            className="rounded-md border border-zinc-700 px-1.5 py-1 text-left text-[10px] font-semibold text-zinc-300 hover:border-sky-400/60 hover:text-sky-300"
          >
            ☰ fluxos ({FLOWS.length})
          </button>
          <button
            onClick={toggleFullscreen}
            className="rounded-md border border-zinc-700 px-1.5 py-1 text-left text-[10px] font-semibold text-zinc-300 hover:border-sky-400/60 hover:text-sky-300"
          >
            ⛶ tela inteira
          </button>
        </div>

        {/* lista de fluxos */}
        {showFlowList && (
          <div className="thin-scroll absolute left-3 top-28 z-30 max-h-[62%] w-72 overflow-y-auto rounded-xl border border-zinc-800 bg-[#060b16]/95 p-2 shadow-2xl backdrop-blur md:left-52">
            <div className="flex items-center justify-between px-1 pb-1.5">
              <span className="text-[9.5px] uppercase tracking-widest text-zinc-500">roteiro 3D · clique voa até a rota</span>
              <button onClick={() => setShowFlowList(false)} className="rounded border border-zinc-700 px-1.5 text-[10px] text-zinc-400">✕</button>
            </div>
            {(Object.keys(TYPE_STYLE) as FlowType[]).map((t) => (
              <div key={t} className="mb-2">
                <div className="px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: TYPE_STYLE[t].color }}>
                  {TYPE_STYLE[t].label}
                </div>
                {FLOWS.filter((f) => f.type === t).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => focusFlow(f.id)}
                    className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left hover:bg-zinc-800/80 ${selFlow === f.id ? 'bg-zinc-800' : ''}`}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TYPE_STYLE[f.type].color }} />
                    <span className="min-w-0 flex-1 truncate text-[11px] text-zinc-200">{f.titulo}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* status inferior-esquerdo */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-20 hidden gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#060b16]/85 px-2.5 py-1.5 backdrop-blur">
            <span className="inline-block h-8 w-8 rounded-full border border-sky-400/40" style={{ background: 'conic-gradient(from 0deg, rgba(56,189,248,.5), transparent 30%)' }} />
            <div className="font-mono text-[9px] leading-tight text-zinc-400">
              <div>◉ VARREDURA RADAR: <b className="text-sky-300">360° ATIVO</b></div>
              <div>○ INTEGRIDADE DO ESCUDO: <b className="text-emerald-300">100%</b></div>
              <div>▦ MATRIZ DE PONTOS: <b className="text-zinc-100">{dotCount ? fmt(dotCount) : '…'} PTS</b></div>
            </div>
          </div>
        </div>

        {/* dica de controle */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[9.5px] tracking-widest text-zinc-600 lg:block">
          ARRASTE PARA ORBITAR · SCROLL PARA ZOOM · CLIQUE NUM ARCO = VOO + DETALHES · CLIQUE NUM PAÍS = BLOCO
        </div>

        {/* ── painel visual (direita) ── */}
        <aside
          className={`thin-scroll absolute bottom-3 right-3 top-14 z-30 w-[300px] max-w-[86vw] overflow-y-auto rounded-xl border bg-[#080d18]/95 p-3 shadow-2xl backdrop-blur transition-all ${
            panelOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-4 opacity-0'
          } max-lg:bottom-16`}
          style={{ borderColor: `${themeGlow}44` }}
          aria-hidden={!panelOpen}
        >
          <div className="mb-2 flex items-center gap-1">
            <button
              onClick={() => setPanelTab('info')}
              className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-extrabold tracking-widest transition-colors ${
                panelTab === 'info' ? 'bg-sky-400/20 text-sky-200' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ⓘ PAINEL
            </button>
            <button
              onClick={() => setPanelTab('visual')}
              className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-extrabold tracking-widest transition-colors ${
                panelTab === 'visual' ? 'bg-sky-400/20 text-sky-200' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ⚙ VISUAL
            </button>
            <button onClick={() => setPanelOpen(false)} aria-label="Fechar painel" className="ml-auto rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-100">✕</button>
          </div>

          {panelTab === 'info' ? (
            <>
              {/* sistema em números */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { k: 'FLUXOS DE CAPITAL', v: String(FLOWS.length), c: '#22d3ee' },
                  { k: 'BLOCOS MAPEADOS', v: String(BLOCS.length), c: '#66bb6a' },
                  { k: 'PONTOS DO GLOBO', v: dotCount ? fmt(dotCount) : '…', c: '#a855f7' },
                  { k: 'FPS AGORA', v: String(hud.fps), c: '#34d399' },
                ].map((s) => (
                  <div key={s.k} className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-1.5">
                    <div className="font-mono text-[8.5px] tracking-widest text-zinc-500">{s.k}</div>
                    <div className="font-mono text-base font-extrabold" style={{ color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* rota ativa */}
              {selFlowObj ? (
                <div
                  className="mt-2 rounded-lg border p-2"
                  style={{ borderColor: `${TYPE_STYLE[selFlowObj.type].color}66`, background: `${TYPE_STYLE[selFlowObj.type].color}0d` }}
                >
                  <div className="font-mono text-[8.5px] tracking-widest text-zinc-500">ROTA ATIVA · GIRO PAUSADO</div>
                  <div className="mt-0.5 text-[11.5px] font-bold leading-snug text-zinc-100">{selFlowObj.titulo}</div>
                  <div className="mt-0.5 font-mono text-[11px] font-bold" style={{ color: TYPE_STYLE[selFlowObj.type].color }}>
                    {selFlowObj.totalAnual}
                  </div>
                  <button
                    onClick={() => setSelFlow(null)}
                    className="mt-1.5 w-full rounded-md border border-zinc-700 px-2 py-1 text-[10.5px] font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                  >
                    ✕ soltar rota e retomar o giro
                  </button>
                </div>
              ) : (
                <p className="mt-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-950/40 p-2 text-[10.5px] leading-snug text-zinc-500">
                  👆 <b className="text-zinc-300">Clique num arco</b> para voar até a rota e abrir o card — o giro pausa sozinho.
                </p>
              )}

              {/* camadas */}
              <div className="mt-2 text-[11px] font-semibold text-zinc-300">◈ Camadas de fluxo</div>
              <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                {(Object.keys(TYPE_STYLE) as FlowType[]).map((t) => (
                  <Row key={t} label={TYPE_STYLE[t].label}>
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: TYPE_STYLE[t].color }} />
                    <Toggle on={visibleLayers[t]} onClick={() => toggleLayer(t)} accent={TYPE_STYLE[t].color} />
                  </Row>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => { setPanelOpen(false); setShowFlowList(true) }}
                  className="rounded-lg border border-zinc-700 px-2 py-1.5 text-[11px] font-semibold text-zinc-200 hover:border-sky-400/60 hover:text-sky-300"
                >
                  ☰ Roteiro de fluxos
                </button>
                <button
                  onClick={() => { setPanelOpen(false); startTour() }}
                  className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20"
                >
                  ▶ Tour 3D
                </button>
              </div>

              <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">como explorar</div>
                <ul className="space-y-1 text-[10.5px] leading-snug text-zinc-400">
                  <li>🌍 <b className="text-zinc-200">Arraste</b> para orbitar · <b className="text-zinc-200">scroll/pinch</b> para zoom</li>
                  <li>🖱️ <b className="text-zinc-200">Passe o mouse</b> nos países para ver nomes e fronteiras</li>
                  <li>📍 <b className="text-zinc-200">Clique num país</b> para abrir a anatomia do bloco</li>
                  <li>⚔️ Use as <b className="text-zinc-200">guerras de blocos</b> abaixo para acender frentes</li>
                </ul>
              </div>
            </>
          ) : (
            <>

          {/* tema */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300">🌐 Tema Global <span className="text-zinc-500">(Tema Planetário)</span></span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-sky-300">{useCustom ? customHex.toUpperCase() : theme.hex}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {GLOBE_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => pickTheme(t.id)}
                className={`rounded-lg border px-2 py-1.5 text-left transition-all ${
                  !useCustom && themeId === t.id ? 'border-sky-400/80 bg-sky-400/10' : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
                }`}
              >
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-100">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: t.dot, boxShadow: `0 0 8px ${t.dot}` }} />
                  {t.label}
                </span>
                <span className="block pl-4 font-mono text-[9px] text-zinc-500">{t.sub}</span>
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-1.5">
            <span className="text-[10.5px] text-zinc-400">Cor personalizada:</span>
            <span className="flex items-center gap-1.5">
              <input
                type="color"
                value={customHex}
                onChange={(e) => { setCustomHex(e.target.value); setUseCustom(true) }}
                className="h-6 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
                aria-label="Cor personalizada do tema"
              />
              <span className="font-mono text-[9px] text-zinc-400">{customHex.toUpperCase()}</span>
            </span>
          </div>

          {/* destaque regional */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300">📍 Destaque Regional <span className="text-zinc-500">(Fronteiras e Pontos)</span></span>
            <Toggle on={regionOn} onClick={() => setRegionOn((s) => !s)} />
          </div>
          {regionOn && (
            <div className="mt-1 space-y-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
              <Row label="Região selecionada:">
                <select
                  value={regionKey}
                  onChange={(e) => setRegionKey(e.target.value)}
                  className="max-w-[150px] cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 px-1.5 py-1 text-[10.5px] text-zinc-200"
                >
                  {Object.entries(REGION_SETS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </Row>
              <Row label="Cor dos pontos internos:">
                <input type="color" value={highlightFill} onChange={(e) => setHighlightFill(e.target.value)} className="h-6 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent" aria-label="Cor dos pontos internos" />
              </Row>
            </div>
          )}

          {/* bloom */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300">✨ Efeito Bloom <span className="text-zinc-500">(Brilho Neon)</span></span>
            <Toggle on={bloom} onClick={() => setBloom((s) => !s)} />
          </div>
          {bloom && (
            <Row label="Intensidade:">
              <input type="range" min={0} max={2} step={0.1} value={bloomIntensity} onChange={(e) => setBloomIntensity(parseFloat(e.target.value))} className="w-28" />
              <span className="w-7 font-mono text-[10px] text-zinc-300">{bloomIntensity.toFixed(1)}</span>
            </Row>
          )}

          {/* atmosfera */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300">🌫 Brilho da Atmosfera</span>
            <Toggle on={atmosphere} onClick={() => setAtmosphere((s) => !s)} />
          </div>
          {atmosphere && (
            <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
              <Row label="Cor do brilho:">
                <span className="flex gap-1">
                  {GLOW_SWATCHES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setGlowColor(c)}
                      aria-label={`Brilho ${c}`}
                      className="h-4 w-4 rounded-full border"
                      style={{ background: c, borderColor: (glowColor || themeGlow) === c ? '#fff' : 'transparent', boxShadow: `0 0 6px ${c}` }}
                    />
                  ))}
                  <button onClick={() => setGlowColor('')} title="Automático (tema)" className="ml-1 font-mono text-[9px] text-zinc-500 underline">auto</button>
                </span>
              </Row>
              <Row label="Intensidade:">
                <input type="range" min={0.2} max={2.5} step={0.05} value={atmoIntensity} onChange={(e) => setAtmoIntensity(parseFloat(e.target.value))} className="w-28" />
                <span className="w-7 font-mono text-[10px] text-zinc-300">{atmoIntensity.toFixed(2)}</span>
              </Row>
            </div>
          )}

          {/* dinâmica */}
          <div className="mt-3 text-[11px] font-semibold text-zinc-300">⚙ Dinâmica e Pontos</div>
          <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
            <Row label="Rotação automática:">
              <Toggle on={autoRotate} onClick={() => setAutoRotate((s) => !s)} />
            </Row>
            <Row label="Velocidade de rotação:">
              <input type="range" min={0.1} max={3} step={0.1} value={rotateSpeed} onChange={(e) => setRotateSpeed(parseFloat(e.target.value))} className="w-28" />
              <span className="w-7 font-mono text-[10px] text-zinc-300">{rotateSpeed.toFixed(1)}×</span>
            </Row>
            <Row label="Velocidade dos fluxos:">
              <input type="range" min={0.2} max={3} step={0.1} value={arcSpeed} onChange={(e) => setArcSpeed(parseFloat(e.target.value))} className="w-28" />
              <span className="w-7 font-mono text-[10px] text-zinc-300">{arcSpeed.toFixed(1)}×</span>
            </Row>
            <Row label="Tamanho dos pontos:">
              <input type="range" min={0.006} max={0.022} step={0.001} value={dotSize} onChange={(e) => setDotSize(parseFloat(e.target.value))} className="w-28" />
              <span className="w-7 font-mono text-[10px] text-zinc-300">{dotSize.toFixed(3)}</span>
            </Row>
          </div>

          {/* camadas */}
          <div className="mt-3 text-[11px] font-semibold text-zinc-300">🛰 Camadas 3D</div>
          <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
            <Row label="Arcos de fluxo"><Toggle on={showArcs} onClick={() => setShowArcs((s) => !s)} accent="#22d3ee" /></Row>
            <Row label="Setas de direção"><Toggle on={showArrows} onClick={() => setShowArrows((s) => !s)} accent="#22d3ee" /></Row>
            <Row label="Fronteiras dos países"><Toggle on={showBorders} onClick={() => setShowBorders((s) => !s)} accent="#22d3ee" /></Row>
            <Row label="Dica de país no hover"><Toggle on={showCountryTip} onClick={() => setShowCountryTip((s) => !s)} accent="#22d3ee" /></Row>
            <Row label="Marcadores de blocos"><Toggle on={showMarkers} onClick={() => setShowMarkers((s) => !s)} accent="#22d3ee" /></Row>
            <Row label="Rótulos"><Toggle on={showLabels} onClick={() => setShowLabels((s) => !s)} accent="#22d3ee" /></Row>
            <Row label="Grade (graticule)"><Toggle on={showGraticule} onClick={() => setShowGraticule((s) => !s)} accent="#22d3ee" /></Row>
            <Row label="Estrelas"><Toggle on={showStars} onClick={() => setShowStars((s) => !s)} accent="#22d3ee" /></Row>
          </div>

          <div className="mt-3 text-[11px] font-semibold text-zinc-300">🌡 Camada temática do globo</div>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {([
              { k: 'none' as const, label: 'Tema' },
              { k: 'wages' as const, label: 'Salários' },
              { k: 'deaths' as const, label: 'Mortes' },
            ]).map((opt) => (
              <button
                key={opt.k}
                onClick={() => setBaseLayer(opt.k)}
                className={`rounded-lg border px-2 py-1.5 text-[10.5px] font-semibold transition-colors ${
                  baseLayer === opt.k ? 'border-sky-400/80 bg-sky-400/10 text-sky-200' : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {baseLayer === 'wages' && (
            <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-1.5">
              <div className="h-3 w-full rounded-full" style={{ background: 'linear-gradient(to right, #f44336, #ff8a65, #ffc107, #42a5f5, #26a69a)' }} />
              <div className="mt-0.5 flex justify-between font-mono text-[8.5px] text-zinc-500"><span>&lt;300</span><span>700</span><span>1,5k</span><span>3k+</span></div>
            </div>
          )}

          <button
            onClick={() => { pickTheme('quantum'); setGlowColor(''); setBloom(true); setBloomIntensity(1.2); setAtmoIntensity(1.15); setRotateSpeed(1); setArcSpeed(1.2); setDotSize(window.innerWidth < 768 ? 0.014 : 0.0115); setRegionKey('brics'); setRegionOn(true); setHighlightFill('#facc15'); setShowBorders(true); setShowCountryTip(true); setShowArrows(true); setBaseLayer('none') }}
            className="mt-3 w-full rounded-lg border border-zinc-700 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 hover:border-sky-400/60 hover:text-sky-300"
          >
            ⟲ restaurar visual padrão
          </button>
            </>
          )}
        </aside>

        {/* barra mobile */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex items-stretch gap-1 rounded-xl border border-zinc-800 bg-[#060b16]/90 p-1 backdrop-blur md:hidden">
          <button onClick={() => { setPanelTab('info'); setPanelOpen((s) => !s) }} className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold ${panelOpen ? 'bg-sky-400/15 text-sky-300' : 'text-zinc-300'}`}>
            <span className="text-base leading-none">ⓘ</span>Painel
          </button>
          <button onClick={() => setShowFlowList((s) => !s)} className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold text-zinc-300">
            <span className="text-base leading-none">☰</span>Fluxos
          </button>
          <button onClick={startTour} className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold text-emerald-300">
            <span className="text-base leading-none">▶</span>Tour
          </button>
          <button onClick={() => setAutoRotate((s) => !s)} className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold text-zinc-300">
            <span className="text-base leading-none">{autoRotate ? '❚❚' : '▶'}</span>Giro
          </button>
          <button onClick={toggleFullscreen} className="flex flex-1 items-center justify-center rounded-lg text-base text-zinc-300">⛶</button>
        </div>

        {/* tour 3D — mesmo tour do 2D; o modo global alterna simples/completa */}
        {tourStep !== null && STOPS[tourStep] && (() => {
          const s = STOPS[tourStep]
          const tour = getTour(activeTourId)
          const A = tour.accent
          const setMode = useApp.getState().setMode
          return (
            <div className="absolute bottom-14 left-1/2 z-30 w-[min(94%,620px)] -translate-x-1/2 rounded-xl border bg-[#060b16]/95 p-4 shadow-2xl backdrop-blur max-md:bottom-16 max-md:p-3"
              style={{ borderColor: `${A}88`, boxShadow: `0 0 28px ${A}22, 0 18px 50px rgba(0,0,0,.6)` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[9.5px] uppercase tracking-widest" style={{ color: A }}>
                    <span>{s.chapter} · passo {tourStep + 1}/{STOPS.length}</span>
                    <span className="inline-flex overflow-hidden rounded border border-zinc-700">
                      {(['didatico', 'avancado'] as const).map((m) => (
                        <button key={m} onClick={() => setMode(m)} title={m === 'didatico' ? 'Simples' : 'Completa'}
                          className={`px-1.5 py-px text-[9px] font-bold normal-case tracking-normal transition-colors ${mode === m ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-200'}`}
                          style={mode === m ? { background: A } : undefined}>
                          {m === 'didatico' ? 'simples' : 'completa'}
                        </button>
                      ))}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-zinc-100">{s.titulo}</div>
                  <select value={activeTourId} onChange={(e) => { setActiveTourId(e.target.value); setTourStep(0) }}
                    title="Escolher tour" aria-label="Escolher tour"
                    className="mt-1.5 max-w-full cursor-pointer truncate rounded-md border border-zinc-700 bg-zinc-950 px-1.5 py-1 text-[10.5px] font-semibold text-zinc-200 outline-none hover:border-zinc-500">
                    {TOURES.map((td) => (
                      <option key={td.id} value={td.id}>{td.titulo}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => gotoTour(Math.max(0, tourStep - 1))} aria-label="Passo anterior" className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2">←</button>
                  <button onClick={endTour} aria-label="Encerrar tour" className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2">✕</button>
                </div>
              </div>
              {mode === 'didatico' ? (
                <>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-200">{s.did}</p>
                  <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                    {s.didStats.map((d) => (
                      <div key={d.k} className="rounded-lg border px-2 py-1.5 text-center" style={{ borderColor: `${A}44`, background: `${A}0d` }}>
                        <div className="font-mono text-sm font-extrabold leading-tight" style={{ color: A }}>{d.v}</div>
                        <div className="mt-0.5 text-[9px] leading-tight text-zinc-400">{d.k}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">{s.adv}</p>
              )}
              {s.dica && (
                <p className="mt-2 font-mono text-[10px] leading-snug text-zinc-500">💡 {s.dica}</p>
              )}
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <div className="flex max-w-[55%] flex-wrap items-center gap-1 overflow-hidden">
                  {STOPS.map((st, i) => (
                    <button key={st.id} onClick={() => gotoTour(i)} title={st.titulo} aria-label={`Ir ao passo ${i + 1}`}
                      className={`h-1.5 shrink-0 rounded-full transition-all ${i === tourStep ? 'w-5' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'}`}
                      style={i === tourStep ? { background: A } : undefined} />
                  ))}
                </div>
                <button
                  onClick={() => (tourStep < STOPS.length - 1 ? gotoTour(tourStep + 1) : endTour())}
                  className="rounded border px-3 py-1 text-[11px] font-bold hover:bg-white/5 max-md:px-4 max-md:py-2"
                  style={{ borderColor: `${A}99`, color: A }}
                >
                  {tourStep < STOPS.length - 1 ? 'próximo →' : 'finalizar ✓'}
                </button>
              </div>
              {tourStep === STOPS.length - 1 && (
                <button onClick={() => { endTour(); useApp.getState().setTab(tour.finalTab) }}
                  className="mt-2 w-full rounded-lg px-3 py-1.5 text-[11px] font-bold text-zinc-950 hover:brightness-110"
                  style={{ background: A }}>
                  {tour.finalLabel}
                </button>
              )}
            </div>
          )
        })()}

        {/* card do fluxo ativo (estética do globo; o giro pausa sozinho) */}
        {selFlowObj && tourStep === null && (
          <FlowCard flow={selFlowObj} onClose={() => setSelFlow(null)} />
        )}
      </div>

      {/* legenda + conflitos */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5">
        {(Object.keys(TYPE_STYLE) as FlowType[]).map((t) => (
          <button key={t} onClick={() => toggleLayer(t)} title="Ligar/desligar camada"
            className={`inline-flex items-center gap-1.5 text-[10.5px] ${visibleLayers[t] ? 'text-zinc-300' : 'text-zinc-600 line-through'}`}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: TYPE_STYLE[t].color }} />
            {TYPE_STYLE[t].label}
          </button>
        ))}
        <span className="ml-auto hidden text-[10px] text-zinc-600 xl:inline">
          clique num arco = zoom + detalhes do fluxo · clique num país = anatomia do bloco
        </span>
      </div>

      <section aria-label="Guerras de blocos no 3D">
        <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Guerras de blocos & proxy wars — no globo 3D
        </h3>
        <GlobeConflictChips />
      </section>
    </div>
  )
}
