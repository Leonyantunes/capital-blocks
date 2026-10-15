/**
 * GLOBE MODULE — segunda versão do mapa: globo 3D interativo.
 * Reusa os MESMOS dados do mapa 2D (FLOWS, BLOCS, conflitos) com
 * direção de arte "Planet Matrix": temas, atmosfera, bloom, satélites,
 * HUD de telemetria, tour guiado e painel visual lateral.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Globe3DCanvas, { type GlobeFocus } from './Globe3DCanvas'
import { GLOBE_THEMES, GLOW_SWATCHES, REGION_SETS } from './globeThemes'
import { FLOWS, TYPE_STYLE, flowForLang, flowTypeStyleForLang, flowsForLang, type FlowDef, type FlowType } from '../../data/flows'
import { getTourForLang, stopColor, stopIsos, toursForLang } from '../../data/tours'
import { distFromK } from '../../data/tour'
import { NIVEIS, textoPorModo } from '../../lib/simples'
import { BLOCS, flowIsos } from '../../lib/world'
import { useApp } from '../../store/useApp'
import SourceLinks from '../ui/SourceLinks'
import TourQuizCard from '../ui/TourQuizCard'

/** Chips de conflito locais (mesmos do mapa 2D, sem puxar o chunk do MapWorld). */
const GLOBE_CONFLICTS: { id: 'semis' | 'energia' | 'reprimaria'; chip: string; title: string; didatico: string; avancado: string; color: string }[] = [
  {
    id: 'semis', chip: 'Guerra dos Semicondutores', title: 'EUA × China — Guerra dos Semicondutores', color: '#ef5350',
    didatico: 'Os EUA bloqueiam a venda dos chips mais avançados para frear a indústria chinesa — a TSMC faz mais de 90% dos chips lógicos de ponta do mundo.',
    avancado: 'Export controls sobre o capital constante mais avançado: contenção tecnológica chinesa + renda de monopólio anglo-americana (TSMC: mais de 90% da lógica de ponta, segundo o NIST).',
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

type Lang = 'pt' | 'en' | 'es'

function globeConflictsForLang(lang: Lang) {
  if (lang === 'pt') return GLOBE_CONFLICTS
  const locale = {
    semis: {
      en: { chip: 'Semiconductor War', title: 'U.S. × China — Semiconductor War', didatico: 'The United States restricts access to the most advanced chips and manufacturing equipment as part of its competition with China. TSMC produces more than 90% of the world’s leading-edge logic chips.', avancado: 'Export controls on the most advanced fixed capital in the semiconductor chain constrain Chinese technological upgrading while protecting strategic rents and production capacity.' },
      es: { chip: 'Guerra de semiconductores', title: 'EE. UU. × China — Guerra de semiconductores', didatico: 'Estados Unidos restringe el acceso a chips y equipos de fabricación avanzados como parte de su competencia con China. TSMC produce más del 90% de la lógica de vanguardia mundial.', avancado: 'Los controles de exportación sobre el capital fijo más avanzado de la cadena limitan la modernización tecnológica china mientras protegen rentas estratégicas y capacidad productiva.' },
    },
    energia: {
      en: { chip: 'Energy & Sanctions (RUS × EU)', title: 'Russia × NATO/EU — Energy and Sanctions', didatico: 'Sanctions and political rupture cut major pipeline links to Europe. Russian oil and gas shifted toward Asia while European industry faced more expensive alternative supplies.', avancado: 'Russian energy capital was redirected toward Asia while higher input costs affected European productive capital and reinforced relative deindustrialization pressure.' },
      es: { chip: 'Energía y sanciones (RUS × UE)', title: 'Rusia × OTAN/UE — Energía y sanciones', didatico: 'Las sanciones y la ruptura política cortaron importantes conexiones por ductos con Europa. Petróleo y gas rusos se desviaron hacia Asia mientras la industria europea enfrentó suministros alternativos más caros.', avancado: 'El capital energético ruso fue redirigido hacia Asia mientras mayores costos de insumos afectaron el capital productivo europeo y reforzaron la presión de desindustrialización relativa.' },
    },
    reprimaria: {
      en: { chip: 'Brazil’s Reprimarization', title: 'Brazil — Reprimarization & Reserve Army of Labor', didatico: 'Brazil became more dependent on grain and mineral exports while about 92 million people remain outside or at the edge of the labor market.', avancado: 'Regressive specialization plus a reserve workforce of 92.1 million reinforces structural labor super-exploitation and an extractive-export model.' },
      es: { chip: 'Reprimarización de Brasil', title: 'Brasil — Reprimarización y ejército de reserva', didatico: 'Brasil pasó a depender más de exportaciones de granos y minerales mientras unos 92 millones de personas permanecen fuera o en el borde del mercado laboral.', avancado: 'La especialización regresiva más una reserva laboral de 92,1 millones refuerza la superexplotación estructural del trabajo y un modelo extractivo-exportador.' },
    },
  } as const
  return GLOBE_CONFLICTS.map((conflict) => ({ ...conflict, ...locale[conflict.id][lang] }))
}

const GLOBE_UI = {
  pt: {
    details: 'Detalhes do fluxo', closeDetails: 'Fechar detalhes do fluxo', annualScale: 'escala anual do fluxo', sources: 'fontes',
    eyebrow: 'Mapa 3D · Segunda versão', title: 'O planeta do capital em 3D', intro: 'O mesmo tabuleiro do mapa 2D — fluxos, blocos e guerras de capitais — sobre um globo vivo.', guide: 'Arraste para orbitar, scroll/pinch para zoom, clique num arco para voar até a rota, clique num país para abrir o bloco. Base do futuro tour 3D.', back2d: '← Mapa 2D', tour3d: '▶ Tour 3D', fullscreen: 'Tela cheia', fullscreenTitle: 'Ver o mapa 3D em tela cheia', panel: 'Painel', visual: 'Visual', closePanel: 'Fechar painel', flows: 'fluxos', flowRoute: 'roteiro 3D · clique voa até a rota',
    radar: 'VARREDURA RADAR', active360: '360° ATIVO', shield: 'INTEGRIDADE DO ESCUDO', pointsMatrix: 'MATRIZ DE PONTOS', orbitHint: 'ARRASTE PARA ORBITAR · SCROLL PARA ZOOM · CLIQUE NUM ARCO = VOO + DETALHES · CLIQUE NUM PAÍS = BLOCO',
    capitalFlows: 'FLUXOS DE CAPITAL', mappedBlocs: 'BLOCOS MAPEADOS', globePoints: 'PONTOS DO GLOBO', fpsNow: 'FPS AGORA', activeRoute: 'ROTA ATIVA · GIRO PAUSADO', releaseRoute: '✕ soltar rota e retomar o giro', clickArc: 'Clique num arco', clickArcRest: 'para voar até a rota e abrir o card — o giro pausa sozinho.', flowLayers: 'Camadas de fluxo', flowRoadmap: '☰ Roteiro de fluxos', howExplore: 'como explorar', explore: ['Arraste para orbitar · scroll/pinch para zoom', 'Passe o mouse nos países para ver nomes e fronteiras', 'Clique num país para abrir a anatomia do bloco', 'Use as guerras de blocos abaixo para acender frentes'],
    globalTheme: '🌐 Tema Global', planetaryTheme: '(Tema Planetário)', customColor: 'Cor personalizada:', customColorAria: 'Cor personalizada do tema', regionalHighlight: '📍 Destaque Regional', bordersPoints: '(Fronteiras e Pontos)', selectedRegion: 'Região selecionada:', innerPointColor: 'Cor dos pontos internos:', bloom: '✨ Efeito Bloom', neonGlow: '(Brilho Neon)', intensity: 'Intensidade:', atmosphere: '🌫 Brilho da Atmosfera', glowColor: 'Cor do brilho:', glowAria: 'Brilho', automatic: 'auto', dynamics: '⚙ Dinâmica e Pontos', autoRotation: 'Rotação automática:', rotationSpeed: 'Velocidade de rotação:', flowSpeed: 'Velocidade dos fluxos:', pointSize: 'Tamanho dos pontos:', layers3d: '🛰 Camadas 3D', arcLayer: 'Arcos de fluxo', arrows: 'Setas de direção', borders: 'Fronteiras dos países', countryTip: 'Dica de país no hover', blocMarkers: 'Marcadores de blocos', labels: 'Rótulos', graticule: 'Grade (graticule)', stars: 'Estrelas', thematicLayer: '🌡 Camada temática do globo', theme: 'Tema', wages: 'Salários', deaths: 'Mortes', restore: '⟲ restaurar visual padrão', rotation: 'Giro',
    step: 'passo', chooseTour: 'Escolher tour', previousStep: 'Passo anterior', endTour: 'Encerrar tour', goStep: 'Ir ao passo', next: 'próximo →', finish: 'finalizar ✓', toggleLayer: 'Ligar/desligar camada', footerHint: 'clique num arco = zoom + detalhes do fluxo · clique num país = anatomia do bloco', warsAria: 'Guerras de blocos no 3D', warsTitle: 'Guerras de blocos & proxy wars — no globo 3D',
    levels: { simples: ['simples', 'Explicação direta'], didatico: ['didático', 'Leitura didática'], avancado: ['avançado', 'Leitura técnica'] } as const,
    themes: { cyber: ['Ciano Matrix', 'Cyan Matrix'], quantum: ['Azul Quântico', 'Quantum Blue'], emerald: ['Verde Esmeralda', 'Emerald Tech'], nebula: ['Violeta Nebulosa', 'Nebula Violet'], solar: ['Ouro Solar', 'Solar Gold'], crimson: ['Núcleo Carmesim', 'Crimson Core'], hyper: ['Branco Híper', 'Hyper White'] } as Record<string, [string, string]>,
    regions: { none: 'Nenhuma', brics: 'BRICS+ (10 membros)', china: 'China', usa: 'Estados Unidos', ue: 'União Europeia', sul: 'Sul Global (BRA+IND+ZAF)' } as Record<string, string>,
  },
  en: {
    details: 'Flow details', closeDetails: 'Close flow details', annualScale: 'annual flow scale', sources: 'sources',
    eyebrow: '3D Map · Second version', title: 'The planet of capital in 3D', intro: 'The same board as the 2D map — capital flows, blocs and capital conflicts — on a living globe.', guide: 'Drag to orbit, scroll/pinch to zoom, click an arc to fly to its route, and click a country to open its bloc. This is the base of the 3D guided tour.', back2d: '← 2D Map', tour3d: '▶ 3D Tour', fullscreen: 'Fullscreen', fullscreenTitle: 'View the 3D map fullscreen', panel: 'Panel', visual: 'Visual', closePanel: 'Close panel', flows: 'flows', flowRoute: '3D route guide · click to fly to a route',
    radar: 'RADAR SCAN', active360: '360° ACTIVE', shield: 'SHIELD INTEGRITY', pointsMatrix: 'POINT MATRIX', orbitHint: 'DRAG TO ORBIT · SCROLL TO ZOOM · CLICK AN ARC = FLY + DETAILS · CLICK A COUNTRY = BLOC',
    capitalFlows: 'CAPITAL FLOWS', mappedBlocs: 'MAPPED BLOCS', globePoints: 'GLOBE POINTS', fpsNow: 'FPS NOW', activeRoute: 'ACTIVE ROUTE · ROTATION PAUSED', releaseRoute: '✕ release route and resume rotation', clickArc: 'Click an arc', clickArcRest: 'to fly to the route and open its card — rotation pauses automatically.', flowLayers: 'Flow layers', flowRoadmap: '☰ Flow guide', howExplore: 'how to explore', explore: ['Drag to orbit · scroll/pinch to zoom', 'Hover countries to see names and borders', 'Click a country to open the bloc anatomy', 'Use the bloc conflicts below to light up fronts'],
    globalTheme: '🌐 Global Theme', planetaryTheme: '(Planet Theme)', customColor: 'Custom color:', customColorAria: 'Custom theme color', regionalHighlight: '📍 Regional Highlight', bordersPoints: '(Borders and Points)', selectedRegion: 'Selected region:', innerPointColor: 'Internal point color:', bloom: '✨ Bloom Effect', neonGlow: '(Neon Glow)', intensity: 'Intensity:', atmosphere: '🌫 Atmosphere Glow', glowColor: 'Glow color:', glowAria: 'Glow', automatic: 'auto', dynamics: '⚙ Motion and Points', autoRotation: 'Auto rotation:', rotationSpeed: 'Rotation speed:', flowSpeed: 'Flow speed:', pointSize: 'Point size:', layers3d: '🛰 3D Layers', arcLayer: 'Flow arcs', arrows: 'Direction arrows', borders: 'Country borders', countryTip: 'Country hover hint', blocMarkers: 'Bloc markers', labels: 'Labels', graticule: 'Grid (graticule)', stars: 'Stars', thematicLayer: '🌡 Globe thematic layer', theme: 'Theme', wages: 'Wages', deaths: 'Deaths', restore: '⟲ restore default visual', rotation: 'Rotation',
    step: 'step', chooseTour: 'Choose tour', previousStep: 'Previous step', endTour: 'End tour', goStep: 'Go to step', next: 'next →', finish: 'finish ✓', toggleLayer: 'Toggle layer', footerHint: 'click an arc = zoom + flow details · click a country = bloc anatomy', warsAria: 'Bloc conflicts in 3D', warsTitle: 'Bloc conflicts & proxy wars — on the 3D globe',
    levels: { simples: ['simple', 'Direct explanation'], didatico: ['guided', 'Guided reading'], avancado: ['advanced', 'Technical reading'] } as const,
    themes: { cyber: ['Cyan Matrix', 'Cyan Matrix'], quantum: ['Quantum Blue', 'Quantum Blue'], emerald: ['Emerald Green', 'Emerald Tech'], nebula: ['Nebula Violet', 'Nebula Violet'], solar: ['Solar Gold', 'Solar Gold'], crimson: ['Crimson Core', 'Crimson Core'], hyper: ['Hyper White', 'Hyper White'] } as Record<string, [string, string]>,
    regions: { none: 'None', brics: 'BRICS+ (10 members)', china: 'China', usa: 'United States', ue: 'European Union', sul: 'Global South (BRA+IND+ZAF)' } as Record<string, string>,
  },
  es: {
    details: 'Detalles del flujo', closeDetails: 'Cerrar detalles del flujo', annualScale: 'escala anual del flujo', sources: 'fuentes',
    eyebrow: 'Mapa 3D · Segunda versión', title: 'El planeta del capital en 3D', intro: 'El mismo tablero del mapa 2D — flujos, bloques y conflictos de capital — sobre un globo vivo.', guide: 'Arrastra para orbitar, usa scroll/pinch para hacer zoom, haz clic en un arco para volar a la ruta y en un país para abrir el bloque. Esta es la base del tour 3D.', back2d: '← Mapa 2D', tour3d: '▶ Tour 3D', fullscreen: 'Pantalla completa', fullscreenTitle: 'Ver el mapa 3D en pantalla completa', panel: 'Panel', visual: 'Visual', closePanel: 'Cerrar panel', flows: 'flujos', flowRoute: 'guía 3D · clic para volar a una ruta',
    radar: 'BARRIDO DE RADAR', active360: '360° ACTIVO', shield: 'INTEGRIDAD DEL ESCUDO', pointsMatrix: 'MATRIZ DE PUNTOS', orbitHint: 'ARRASTRA PARA ORBITAR · SCROLL PARA ZOOM · CLIC EN UN ARCO = VUELO + DETALLES · CLIC EN UN PAÍS = BLOQUE',
    capitalFlows: 'FLUJOS DE CAPITAL', mappedBlocs: 'BLOQUES MAPEADOS', globePoints: 'PUNTOS DEL GLOBO', fpsNow: 'FPS AHORA', activeRoute: 'RUTA ACTIVA · GIRO PAUSADO', releaseRoute: '✕ soltar ruta y reanudar el giro', clickArc: 'Haz clic en un arco', clickArcRest: 'para volar a la ruta y abrir su tarjeta — el giro se pausa automáticamente.', flowLayers: 'Capas de flujo', flowRoadmap: '☰ Guía de flujos', howExplore: 'cómo explorar', explore: ['Arrastra para orbitar · scroll/pinch para zoom', 'Pasa el cursor sobre los países para ver nombres y fronteras', 'Haz clic en un país para abrir la anatomía del bloque', 'Usa los conflictos de bloques abajo para iluminar frentes'],
    globalTheme: '🌐 Tema Global', planetaryTheme: '(Tema Planetario)', customColor: 'Color personalizado:', customColorAria: 'Color personalizado del tema', regionalHighlight: '📍 Resaltado regional', bordersPoints: '(Fronteras y Puntos)', selectedRegion: 'Región seleccionada:', innerPointColor: 'Color de los puntos internos:', bloom: '✨ Efecto Bloom', neonGlow: '(Brillo Neón)', intensity: 'Intensidad:', atmosphere: '🌫 Brillo de la Atmósfera', glowColor: 'Color del brillo:', glowAria: 'Brillo', automatic: 'auto', dynamics: '⚙ Dinámica y Puntos', autoRotation: 'Rotación automática:', rotationSpeed: 'Velocidad de rotación:', flowSpeed: 'Velocidad de los flujos:', pointSize: 'Tamaño de los puntos:', layers3d: '🛰 Capas 3D', arcLayer: 'Arcos de flujo', arrows: 'Flechas de dirección', borders: 'Fronteras de los países', countryTip: 'Información del país al pasar el cursor', blocMarkers: 'Marcadores de bloques', labels: 'Rótulos', graticule: 'Cuadrícula (graticule)', stars: 'Estrellas', thematicLayer: '🌡 Capa temática del globo', theme: 'Tema', wages: 'Salarios', deaths: 'Muertes', restore: '⟲ restaurar visual predeterminado', rotation: 'Giro',
    step: 'paso', chooseTour: 'Elegir tour', previousStep: 'Paso anterior', endTour: 'Cerrar tour', goStep: 'Ir al paso', next: 'siguiente →', finish: 'finalizar ✓', toggleLayer: 'Activar/desactivar capa', footerHint: 'clic en un arco = zoom + detalles del flujo · clic en un país = anatomía del bloque', warsAria: 'Conflictos de bloques en 3D', warsTitle: 'Conflictos de bloques y proxy wars — en el globo 3D',
    levels: { simples: ['simple', 'Explicación directa'], didatico: ['didáctico', 'Lectura didáctica'], avancado: ['avanzado', 'Lectura técnica'] } as const,
    themes: { cyber: ['Cian Matrix', 'Cyan Matrix'], quantum: ['Azul Cuántico', 'Quantum Blue'], emerald: ['Verde Esmeralda', 'Emerald Tech'], nebula: ['Violeta Nebulosa', 'Nebula Violet'], solar: ['Oro Solar', 'Solar Gold'], crimson: ['Núcleo Carmesí', 'Crimson Core'], hyper: ['Blanco Híper', 'Hyper White'] } as Record<string, [string, string]>,
    regions: { none: 'Ninguna', brics: 'BRICS+ (10 miembros)', china: 'China', usa: 'Estados Unidos', ue: 'Unión Europea', sul: 'Sur Global (BRA+IND+ZAF)' } as Record<string, string>,
  },
} as const

function GlobeConflictChips() {
  const conflict = useApp((s) => s.conflict)
  const setConflict = useApp((s) => s.setConflict)
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const conflicts = useMemo(() => globeConflictsForLang(lang), [lang])
  const active = conflicts.find((c) => c.id === conflict) ?? null
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {conflicts.map((c) => (
          <button key={c.id} onClick={() => setConflict(conflict === c.id ? null : c.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              conflict === c.id ? 'border-transparent text-onaccent' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            }`}
            style={conflict === c.id ? { background: c.color } : undefined}>
            {c.chip}
          </button>
        ))}
      </div>
      {active && (
        <div className="rounded-lg border p-3 text-xs leading-relaxed" style={{ borderColor: `${active.color}55`, background: `${active.color}0d` }}>
          <div className="font-semibold" style={{ color: active.color }}>{active.title}</div>
          <p className="mt-1 text-zinc-300">{textoPorModo(mode, active.didatico, active.avancado)}</p>
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
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const copy = GLOBE_UI[lang]
  const localizedFlow = flowForLang(flow, lang)
  const st = flowTypeStyleForLang(flow.type, lang)
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
      aria-label={copy.details}
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
          <div className="mt-1 text-sm font-bold text-zinc-100">{localizedFlow.titulo}</div>
        </div>
        <button
          onClick={onClose}
          aria-label={copy.closeDetails}
          className="shrink-0 rounded-md border border-zinc-700 px-2 py-1 text-[11px] text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-100"
        >
          ✕
        </button>
      </div>
      <div
        className="mt-2.5 rounded-lg border p-2.5"
        style={{ borderColor: `${st.color}55`, background: `${st.color}0d` }}
      >
        <div className="text-[9px] uppercase tracking-widest text-zinc-500">{copy.annualScale}</div>
        <div className="font-mono text-xl font-extrabold" style={{ color: st.color }}>{localizedFlow.totalAnual}</div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-300">{textoPorModo(mode, localizedFlow.did, localizedFlow.adv)}</p>
      <div className="mt-2.5 space-y-1.5">
        {localizedFlow.itens.map((it) => (
          <div key={it.rotulo} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold text-zinc-100">{it.rotulo}</span>
              <span className="shrink-0 font-mono text-[10.5px] font-bold" style={{ color: st.color }}>{it.valor}</span>
            </div>
            {it.nota && <div className="mt-0.5 text-[10px] leading-snug text-zinc-500">{it.nota}</div>}
          </div>
        ))}
      </div>
      {localizedFlow.fonte && <p className="mt-2 font-mono text-[9px] leading-relaxed text-zinc-600">{copy.sources}: {localizedFlow.fonte}</p>}
    </div>
  )
}

export default function GlobeModule() {
  const setTab = useApp((s) => s.setTab)
  const openCountry = useApp((s) => s.openCountry)
  const conflict = useApp((s) => s.conflict)
  const setConflict = useApp((s) => s.setConflict)
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const sharedMap = useApp((s) => s.sharedMap)
  const setSharedMap = useApp((s) => s.setSharedMap)
  const copy = GLOBE_UI[lang]

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

  /* ── dados (iguais ao 2D, sincronizados via sharedMap) ── */
  const [visibleLayers, setVisibleLayers] = useState<Record<FlowType, boolean>>({
    commodities: true, manufatura: true, drain: true, dollar: true, brics: true, fantasma: true,
  })
  const [selFlow, setSelFlow] = useState<string | null>(() => sharedMap.selFlow)
  const [tourStep, setTourStep] = useState<number | null>(() => sharedMap.tourStep)
  /** tour temático ativo (base comum ao 2D e ao 3D) */
  const [activeTourId, setActiveTourId] = useState(() => sharedMap.activeTourId ?? 'principal')
  const localizedFlows = useMemo(() => flowsForLang(lang), [lang])
  const localizedTours = useMemo(() => toursForLang(lang), [lang])
  const activeTour = getTourForLang(activeTourId, lang)
  const STOPS = activeTour.stops
  const TOUR_ACCENT = activeTour.accent
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

  const selFlowObj = useMemo(() => localizedFlows.find((f) => f.id === selFlow) ?? null, [localizedFlows, selFlow])

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
    /* parada com rota: enquadra as duas pontas; senão, o ponto da parada com
       distância derivada do k do 2D (paridade entre os mapas) */
    if (s.flowId) flyToFlow(s.flowId, 0.55)
    else flyTo(s.lng, s.lat, s.dist ?? distFromK(s.k), 0.55)
    setSelFlow(s.flowId ?? null)
    setConflict((s.conflict as typeof conflict) ?? null)
    setSharedMap({ tourStep: i, activeTourId, selFlow: s.flowId ?? null })
  }
  const gotoTour = (i: number) => {
    setTourStep(i)
    applyTourStep(i)
  }
  const endTour = () => {
    setTourStep(null)
    setSelFlow(null)
    setConflict(null)
    setSharedMap({ tourStep: null, selFlow: null })
    try {
      if (document.fullscreenElement) {
        const p = document.exitFullscreen() as Promise<void> | undefined
        p?.catch(() => {})
      }
    } catch {
      /* nada */
    }
  }

  /* Sincronização inicial com o 2D via sharedMap */
  const initialSynced = useRef(false)
  useEffect(() => {
    if (initialSynced.current) return
    initialSynced.current = true
    if (sharedMap.tourStep !== null) {
      applyTourStep(sharedMap.tourStep)
    } else if (sharedMap.selFlow) {
      flyToFlow(sharedMap.selFlow, 0.5)
    } else if (sharedMap.lng !== -15 || sharedMap.lat !== 15 || sharedMap.k !== 1) {
      flyTo(sharedMap.lng, sharedMap.lat, distFromK(sharedMap.k), 0.5)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Sincronização contínua de saída (2D ⇄ 3D) */
  const hudRef = useRef(hud)
  useEffect(() => { hudRef.current = hud }, [hud])
  const selFlowRef = useRef(selFlow)
  useEffect(() => { selFlowRef.current = selFlow }, [selFlow])
  const tourStepRef = useRef(tourStep)
  useEffect(() => { tourStepRef.current = tourStep }, [tourStep])
  const activeTourIdRef = useRef(activeTourId)
  useEffect(() => { activeTourIdRef.current = activeTourId }, [activeTourId])

  const syncToShared = useCallback(() => {
    setSharedMap({
      lng: hudRef.current.lng,
      lat: hudRef.current.lat,
      selFlow: selFlowRef.current,
      activeTourId: activeTourIdRef.current,
      tourStep: tourStepRef.current,
    })
  }, [setSharedMap])

  useEffect(() => {
    return () => {
      syncToShared()
    }
  }, [syncToShared])

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
    setSharedMap({ selFlow: id })
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
    n.toLocaleString(lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
  const latStr = `${Math.abs(hud.lat).toFixed(0)}°${hud.lat >= 0 ? 'N' : 'S'}`
  const lngStr = `${Math.abs(hud.lng).toFixed(0)}°${hud.lng >= 0 ? 'E' : 'W'}`

  return (
    <div className="flex flex-col gap-4">
      {/* ── cabeçalho ── */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
              {copy.eyebrow}
            </span>
            <span className="rounded border border-emerald-400/50 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
              ● BETA
            </span>
          </div>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">
            {copy.title}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
            {copy.intro} {copy.guide}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              syncToShared()
              setTab('home')
            }}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-sky-400/60 hover:text-sky-300"
          >
            {copy.back2d}
          </button>
          <button
            onClick={startTour}
            className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            {copy.tour3d}
          </button>
          <button
            onClick={toggleFullscreen}
            title={copy.fullscreenTitle}
            className="rounded-lg border border-sky-400/60 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-300 transition-colors hover:bg-sky-400/20"
          >
            ⛶ {copy.fullscreen}
          </button>
          <button
            onClick={() => { setPanelTab('info'); setPanelOpen((s) => !s) }}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 lg:hidden"
          >
            ⓘ {copy.panel}
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
            title={copy.fullscreenTitle}
            className="rounded-full border border-sky-400/70 bg-sky-400/15 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-sky-200 backdrop-blur transition-colors hover:bg-sky-400/25"
          >
            ⛶ {copy.fullscreen.toUpperCase()}
          </button>
          <button
            onClick={() => setAutoRotate((s) => !s)}
            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider backdrop-blur transition-colors ${
              autoRotate ? 'border-zinc-600 bg-zinc-900/80 text-zinc-200' : 'border-zinc-700 bg-zinc-900/80 text-zinc-500'
            }`}
          >
            {autoRotate ? `❚❚ ${copy.rotation.toUpperCase()}` : `▶ ${copy.rotation.toUpperCase()}`}
          </button>
          <button
            onClick={() => setPanelOpen((s) => !s)}
            className="rounded-full border border-zinc-600 bg-zinc-900/80 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-zinc-200 backdrop-blur transition-colors hover:border-sky-400/60 hover:text-sky-200"
          >
            ⓘ {copy.panel.toUpperCase()}
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
              <span className="truncate text-zinc-300">{flowTypeStyleForLang(t, lang).label}</span>
            </button>
          ))}
          <div className="my-1 h-px bg-zinc-800" />
          <button
            onClick={() => setShowFlowList((s) => !s)}
            className="rounded-md border border-zinc-700 px-1.5 py-1 text-left text-[10px] font-semibold text-zinc-300 hover:border-sky-400/60 hover:text-sky-300"
          >
            ☰ {copy.flows} ({localizedFlows.length})
          </button>
          <button
            onClick={toggleFullscreen}
            className="rounded-md border border-zinc-700 px-1.5 py-1 text-left text-[10px] font-semibold text-zinc-300 hover:border-sky-400/60 hover:text-sky-300"
          >
            ⛶ {copy.fullscreen.toLowerCase()}
          </button>
        </div>

        {/* lista de fluxos */}
        {showFlowList && (
          <div className="thin-scroll absolute left-3 top-28 z-30 max-h-[62%] w-72 overflow-y-auto rounded-xl border border-zinc-800 bg-[#060b16]/95 p-2 shadow-2xl backdrop-blur md:left-52">
            <div className="flex items-center justify-between px-1 pb-1.5">
              <span className="text-[9.5px] uppercase tracking-widest text-zinc-500">{copy.flowRoute}</span>
              <button onClick={() => setShowFlowList(false)} className="rounded border border-zinc-700 px-1.5 text-[10px] text-zinc-400">✕</button>
            </div>
            {(Object.keys(TYPE_STYLE) as FlowType[]).map((t) => (
              <div key={t} className="mb-2">
                <div className="px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: TYPE_STYLE[t].color }}>
                  {flowTypeStyleForLang(t, lang).label}
                </div>
                {localizedFlows.filter((f) => f.type === t).map((f) => (
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
              <div>◉ {copy.radar}: <b className="text-sky-300">{copy.active360}</b></div>
              <div>○ {copy.shield}: <b className="text-emerald-300">100%</b></div>
              <div>▦ {copy.pointsMatrix}: <b className="text-zinc-100">{dotCount ? fmt(dotCount) : '…'} PTS</b></div>
            </div>
          </div>
        </div>

        {/* dica de controle */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[9.5px] tracking-widest text-zinc-600 lg:block">
          {copy.orbitHint}
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
              ⓘ {copy.panel.toUpperCase()}
            </button>
            <button
              onClick={() => setPanelTab('visual')}
              className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-extrabold tracking-widest transition-colors ${
                panelTab === 'visual' ? 'bg-sky-400/20 text-sky-200' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ⚙ {copy.visual.toUpperCase()}
            </button>
            <button onClick={() => setPanelOpen(false)} aria-label={copy.closePanel} className="ml-auto rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-100">✕</button>
          </div>

          {panelTab === 'info' ? (
            <>
              {/* sistema em números */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { k: copy.capitalFlows, v: String(localizedFlows.length), c: '#22d3ee' },
                  { k: copy.mappedBlocs, v: String(BLOCS.length), c: '#66bb6a' },
                  { k: copy.globePoints, v: dotCount ? fmt(dotCount) : '…', c: '#a855f7' },
                  { k: copy.fpsNow, v: String(hud.fps), c: '#34d399' },
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
                  <div className="font-mono text-[8.5px] tracking-widest text-zinc-500">{copy.activeRoute}</div>
                  <div className="mt-0.5 text-[11.5px] font-bold leading-snug text-zinc-100">{selFlowObj.titulo}</div>
                  <div className="mt-0.5 font-mono text-[11px] font-bold" style={{ color: TYPE_STYLE[selFlowObj.type].color }}>
                    {selFlowObj.totalAnual}
                  </div>
                  <button
                    onClick={() => setSelFlow(null)}
                    className="mt-1.5 w-full rounded-md border border-zinc-700 px-2 py-1 text-[10.5px] font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                  >
                    {copy.releaseRoute}
                  </button>
                </div>
              ) : (
                <p className="mt-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-950/40 p-2 text-[10.5px] leading-snug text-zinc-500">
                  👆 <b className="text-zinc-300">{copy.clickArc}</b> {copy.clickArcRest}
                </p>
              )}

              {/* camadas */}
              <div className="mt-2 text-[11px] font-semibold text-zinc-300">◈ {copy.flowLayers}</div>
              <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                {(Object.keys(TYPE_STYLE) as FlowType[]).map((t) => (
                  <Row key={t} label={flowTypeStyleForLang(t, lang).label}>
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
                  {copy.flowRoadmap}
                </button>
                <button
                  onClick={() => { setPanelOpen(false); startTour() }}
                  className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20"
                >
                  {copy.tour3d}
                </button>
              </div>

              <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{copy.howExplore}</div>
                <ul className="space-y-1 text-[10.5px] leading-snug text-zinc-400">
                  {copy.explore.map((line, index) => <li key={line}>{['🌍', '🖱️', '📍', '⚔️'][index]} {line}</li>)}
                </ul>
              </div>
            </>
          ) : (
            <>

          {/* tema */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300">{copy.globalTheme} <span className="text-zinc-500">{copy.planetaryTheme}</span></span>
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
                  {(copy.themes[t.id] ?? [t.label, t.sub])[0]}
                </span>
                <span className="block pl-4 font-mono text-[9px] text-zinc-500">{(copy.themes[t.id] ?? [t.label, t.sub])[1]}</span>
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-1.5">
            <span className="text-[10.5px] text-zinc-400">{copy.customColor}</span>
            <span className="flex items-center gap-1.5">
              <input
                type="color"
                value={customHex}
                onChange={(e) => { setCustomHex(e.target.value); setUseCustom(true) }}
                className="h-6 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
                aria-label={copy.customColorAria}
              />
              <span className="font-mono text-[9px] text-zinc-400">{customHex.toUpperCase()}</span>
            </span>
          </div>

          {/* destaque regional */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300">{copy.regionalHighlight} <span className="text-zinc-500">{copy.bordersPoints}</span></span>
            <Toggle on={regionOn} onClick={() => setRegionOn((s) => !s)} />
          </div>
          {regionOn && (
            <div className="mt-1 space-y-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
              <Row label={copy.selectedRegion}>
                <select
                  value={regionKey}
                  onChange={(e) => setRegionKey(e.target.value)}
                  className="max-w-[150px] cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 px-1.5 py-1 text-[10.5px] text-zinc-200"
                >
                  {Object.entries(REGION_SETS).map(([k, v]) => (
                    <option key={k} value={k}>{copy.regions[k] ?? v.label}</option>
                  ))}
                </select>
              </Row>
              <Row label={copy.innerPointColor}>
                <input type="color" value={highlightFill} onChange={(e) => setHighlightFill(e.target.value)} className="h-6 w-8 cursor-pointer rounded border border-zinc-700 bg-transparent" aria-label={copy.innerPointColor} />
              </Row>
            </div>
          )}

          {/* bloom */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300">{copy.bloom} <span className="text-zinc-500">{copy.neonGlow}</span></span>
            <Toggle on={bloom} onClick={() => setBloom((s) => !s)} />
          </div>
          {bloom && (
            <Row label={copy.intensity}>
              <input type="range" min={0} max={2} step={0.1} value={bloomIntensity} onChange={(e) => setBloomIntensity(parseFloat(e.target.value))} className="w-28" />
              <span className="w-7 font-mono text-[10px] text-zinc-300">{bloomIntensity.toFixed(1)}</span>
            </Row>
          )}

          {/* atmosfera */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300">{copy.atmosphere}</span>
            <Toggle on={atmosphere} onClick={() => setAtmosphere((s) => !s)} />
          </div>
          {atmosphere && (
            <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
              <Row label={copy.glowColor}>
                <span className="flex gap-1">
                  {GLOW_SWATCHES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setGlowColor(c)}
                      aria-label={`${copy.glowAria} ${c}`}
                      className="h-4 w-4 rounded-full border"
                      style={{ background: c, borderColor: (glowColor || themeGlow) === c ? '#fff' : 'transparent', boxShadow: `0 0 6px ${c}` }}
                    />
                  ))}
                  <button onClick={() => setGlowColor('')} title={`${copy.automatic} (${copy.theme.toLowerCase()})`} className="ml-1 font-mono text-[9px] text-zinc-500 underline">{copy.automatic}</button>
                </span>
              </Row>
              <Row label={copy.intensity}>
                <input type="range" min={0.2} max={2.5} step={0.05} value={atmoIntensity} onChange={(e) => setAtmoIntensity(parseFloat(e.target.value))} className="w-28" />
                <span className="w-7 font-mono text-[10px] text-zinc-300">{atmoIntensity.toFixed(2)}</span>
              </Row>
            </div>
          )}

          {/* dinâmica */}
          <div className="mt-3 text-[11px] font-semibold text-zinc-300">{copy.dynamics}</div>
          <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
            <Row label={copy.autoRotation}>
              <Toggle on={autoRotate} onClick={() => setAutoRotate((s) => !s)} />
            </Row>
            <Row label={copy.rotationSpeed}>
              <input type="range" min={0.1} max={3} step={0.1} value={rotateSpeed} onChange={(e) => setRotateSpeed(parseFloat(e.target.value))} className="w-28" />
              <span className="w-7 font-mono text-[10px] text-zinc-300">{rotateSpeed.toFixed(1)}×</span>
            </Row>
            <Row label={copy.flowSpeed}>
              <input type="range" min={0.2} max={3} step={0.1} value={arcSpeed} onChange={(e) => setArcSpeed(parseFloat(e.target.value))} className="w-28" />
              <span className="w-7 font-mono text-[10px] text-zinc-300">{arcSpeed.toFixed(1)}×</span>
            </Row>
            <Row label={copy.pointSize}>
              <input type="range" min={0.006} max={0.022} step={0.001} value={dotSize} onChange={(e) => setDotSize(parseFloat(e.target.value))} className="w-28" />
              <span className="w-7 font-mono text-[10px] text-zinc-300">{dotSize.toFixed(3)}</span>
            </Row>
          </div>

          {/* camadas */}
          <div className="mt-3 text-[11px] font-semibold text-zinc-300">{copy.layers3d}</div>
          <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
            <Row label={copy.arcLayer}><Toggle on={showArcs} onClick={() => setShowArcs((s) => !s)} accent="#22d3ee" /></Row>
            <Row label={copy.arrows}><Toggle on={showArrows} onClick={() => setShowArrows((s) => !s)} accent="#22d3ee" /></Row>
            <Row label={copy.borders}><Toggle on={showBorders} onClick={() => setShowBorders((s) => !s)} accent="#22d3ee" /></Row>
            <Row label={copy.countryTip}><Toggle on={showCountryTip} onClick={() => setShowCountryTip((s) => !s)} accent="#22d3ee" /></Row>
            <Row label={copy.blocMarkers}><Toggle on={showMarkers} onClick={() => setShowMarkers((s) => !s)} accent="#22d3ee" /></Row>
            <Row label={copy.labels}><Toggle on={showLabels} onClick={() => setShowLabels((s) => !s)} accent="#22d3ee" /></Row>
            <Row label={copy.graticule}><Toggle on={showGraticule} onClick={() => setShowGraticule((s) => !s)} accent="#22d3ee" /></Row>
            <Row label={copy.stars}><Toggle on={showStars} onClick={() => setShowStars((s) => !s)} accent="#22d3ee" /></Row>
          </div>

          <div className="mt-3 text-[11px] font-semibold text-zinc-300">{copy.thematicLayer}</div>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {([
              { k: 'none' as const, label: copy.theme },
              { k: 'wages' as const, label: copy.wages },
              { k: 'deaths' as const, label: copy.deaths },
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
            {copy.restore}
          </button>
            </>
          )}
        </aside>

        {/* barra mobile */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex items-stretch gap-1 rounded-xl border border-zinc-800 bg-[#060b16]/90 p-1 backdrop-blur md:hidden">
          <button onClick={() => { setPanelTab('info'); setPanelOpen((s) => !s) }} className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold ${panelOpen ? 'bg-sky-400/15 text-sky-300' : 'text-zinc-300'}`}>
            <span className="text-base leading-none">ⓘ</span>{copy.panel}
          </button>
          <button onClick={() => setShowFlowList((s) => !s)} className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold text-zinc-300">
            <span className="text-base leading-none">☰</span>{copy.flows}
          </button>
          <button onClick={startTour} className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold text-emerald-300">
            <span className="text-base leading-none">▶</span>Tour
          </button>
          <button onClick={() => setAutoRotate((s) => !s)} className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold text-zinc-300">
            <span className="text-base leading-none">{autoRotate ? '❚❚' : '▶'}</span>{copy.rotation}
          </button>
          <button onClick={toggleFullscreen} className="flex flex-1 items-center justify-center rounded-lg text-base text-zinc-300">⛶</button>
        </div>

        {/* tour 3D — mesmo tour do 2D; o modo global alterna simples/completa */}
        {tourStep !== null && STOPS[tourStep] && (() => {
          const s = STOPS[tourStep]
          const tour = activeTour
          const A = tour.accent
          const setMode = useApp.getState().setMode
          return (
            <div className="absolute bottom-14 left-1/2 z-30 w-[min(94%,620px)] -translate-x-1/2 rounded-xl border bg-[#060b16]/95 p-4 shadow-2xl backdrop-blur max-md:bottom-16 max-md:p-3"
              style={{ borderColor: `${A}88`, boxShadow: `0 0 28px ${A}22, 0 18px 50px rgba(0,0,0,.6)` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[9.5px] uppercase tracking-widest" style={{ color: A }}>
                    <span>{s.chapter} · {copy.step} {tourStep + 1}/{STOPS.length}</span>
                    <span className="inline-flex overflow-hidden rounded border border-zinc-700">
                      {NIVEIS.map((n) => (
                        <button key={n.id} onClick={() => setMode(n.id)} title={copy.levels[n.id][1]}
                          className={`px-1.5 py-px text-[9px] font-bold normal-case tracking-normal transition-colors ${mode === n.id ? 'text-onaccent' : 'text-zinc-500 hover:text-zinc-200'}`}
                          style={mode === n.id ? { background: A } : undefined}>
                          {copy.levels[n.id][0]}
                        </button>
                      ))}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-zinc-100">{s.titulo}</div>
                  <select value={activeTourId} onChange={(e) => { setActiveTourId(e.target.value); setTourStep(0) }}
                    title={copy.chooseTour} aria-label={copy.chooseTour}
                    className="mt-1.5 max-w-full cursor-pointer truncate rounded-md border border-zinc-700 bg-zinc-950 px-1.5 py-1 text-[10.5px] font-semibold text-zinc-200 outline-none hover:border-zinc-500">
                    {localizedTours.map((td) => (
                      <option key={td.id} value={td.id}>{td.titulo}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => gotoTour(Math.max(0, tourStep - 1))} aria-label={copy.previousStep} className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2">←</button>
                  <button onClick={endTour} aria-label={copy.endTour} className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2">✕</button>
                </div>
              </div>
              {mode !== 'avancado' ? (
                <>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-200">{textoPorModo(mode, s.did, s.adv, s.simples)}</p>
                  <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                    {s.didStats.map((d) => (
                      <div key={d.k} className="rounded-lg border px-2 py-1.5 text-center" style={{ borderColor: `${A}44`, background: `${A}0d` }}>
                        <div className="font-mono text-sm font-extrabold leading-tight" style={{ color: A }}>{d.v}</div>
                        <div className="mt-0.5 text-[9px] leading-tight text-zinc-400">{textoPorModo(mode, d.k, d.k)}</div>
                        <SourceLinks sourceIds={d.sourceIds} />
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
              {s.quiz && <TourQuizCard quiz={s.quiz} accentColor={A} />}
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <div className="flex max-w-[55%] flex-wrap items-center gap-1 overflow-hidden">
                  {STOPS.map((st, i) => (
                    <button key={st.id} onClick={() => gotoTour(i)} title={st.titulo} aria-label={`${copy.goStep} ${i + 1}`}
                      className={`h-1.5 shrink-0 rounded-full transition-all ${i === tourStep ? 'w-5' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'}`}
                      style={i === tourStep ? { background: A } : undefined} />
                  ))}
                </div>
                <button
                  onClick={() => (tourStep < STOPS.length - 1 ? gotoTour(tourStep + 1) : endTour())}
                  className="rounded border px-3 py-1 text-[11px] font-bold hover:bg-white/5 max-md:px-4 max-md:py-2"
                  style={{ borderColor: `${A}99`, color: A }}
                >
                  {tourStep < STOPS.length - 1 ? copy.next : copy.finish}
                </button>
              </div>
              {tourStep === STOPS.length - 1 && (
                <button onClick={() => { endTour(); useApp.getState().setTab(tour.finalTab) }}
                  className="mt-2 w-full rounded-lg px-3 py-1.5 text-[11px] font-bold text-onaccent hover:brightness-110"
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
          <button key={t} onClick={() => toggleLayer(t)} title={copy.toggleLayer}
            className={`inline-flex items-center gap-1.5 text-[10.5px] ${visibleLayers[t] ? 'text-zinc-300' : 'text-zinc-600 line-through'}`}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: TYPE_STYLE[t].color }} />
            {flowTypeStyleForLang(t, lang).label}
          </button>
        ))}
        <span className="ml-auto hidden text-[10px] text-zinc-600 xl:inline">
          {copy.footerHint}
        </span>
      </div>

      <section aria-label={copy.warsAria}>
        <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          {copy.warsTitle}
        </h3>
        <GlobeConflictChips />
      </section>
    </div>
  )
}
