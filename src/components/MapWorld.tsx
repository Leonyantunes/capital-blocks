import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  MAP_W, MAP_H, COUNTRY_FEATURES, GRATICULE_D, SPHERE_D,
  ISO_TO_BLOC, BRICS_ISO, BLOCS, BLOC_MEMBERS, arcPath, quadPoint, project, projection, flowIsos,
  DIT_META, getDitRole, GLOBAL_CHOKEPOINTS,
} from '../lib/world'
import { FLOWS, TYPE_STYLE, flowForLang, flowTypeStyleForLang, flowsForLang, type FlowDef, type FlowType } from '../data/flows'
import { TOURES, getTourForLang, stopColor, stopIsos, toursForLang } from '../data/tours'
import { NIVEIS, textoPorModo } from '../lib/simples'
import { t } from '../i18n'
import FlowCard from './FlowCard'
import SourceLinks from './ui/SourceLinks'
import TourQuizCard from './ui/TourQuizCard'
import { useTourDriver } from '../hooks/useTourDriver'
import { BR_STATES, BR_STATE_FLOWS, INTERNAL_FLOWS, STATE_CAT_META, BRAZIL_VIEW } from '../data/brazil'
import { WAGES, wageColor, wageBucketLabelForLang, WAGE_BUCKETS } from '../data/wages'
import { DISASTERS } from '../data/disasters'
import { useApp, type ConflictId } from '../store/useApp'

/* ════════════════════════════════════════════════════════════════
   MAPA GEOPOLÍTICO REAL (Natural Earth 110m via world-atlas/d3-geo)
   • todos os países clicáveis (drawer p/ blocos com dados)
   • fluxos CLICÁVEIS com painel detalhado (itens, valores, empresas)
   • hover destaca o fluxo + badge de valor no ponto médio
   • zoom (scroll/botões) + pan (arrastar)
   • camadas comutáveis + guerras de blocos destacadas
   ════════════════════════════════════════════════════════════════ */

const A = Object.fromEntries(BLOCS.map((b) => [b.id, b.anchor])) as Record<string, [number, number]>

/** Dispositivo de toque: orçamento menor de partículas e sem tooltips de hover. */
const COARSE = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/**
 * GEOMETRIA DOS FLUXOS — calculada UMA vez (projeção fixa).
 * Evita recomputar arcPath/quadPoint/projeções a cada rebuild de camada.
 */
interface FlowGeo {
  from: [number, number]
  to: [number, number]
  d: string
  mid: [number, number]
  fromCode: string
  toCode: string
}
const FLOW_GEO: Record<string, FlowGeo> = {}
for (const f of FLOWS) {
  const from = typeof f.from === 'string' ? A[f.from] : f.from
  const to = typeof f.to === 'string' ? A[f.to] : f.to
  const d = arcPath(from, to, f.bend)
  const codeOf = (side: 'from' | 'to', v: string | [number, number], label?: string) =>
    typeof v === 'string'
      ? (BLOCS.find((b) => b.id === v)?.code ?? label ?? v)
      : (label ?? '—')
  FLOW_GEO[f.id] = {
    from, to, d,
    mid: quadPoint(d, 0.5),
    fromCode: codeOf('from', f.from, f.fromLabel),
    toCode: codeOf('to', f.to, f.toLabel),
  }
}

/** cache do fetch dos contornos estaduais (IBGE) por sessão */
let brGeoCache: { code: string; d: string }[] | null = null

interface ConflictDef {
  id: Exclude<ConflictId, null>
  chip: string
  title: string
  didatico: string
  avancado: string
  color: string
  /** ids de FLOWS que continuam acesos */
  highlight: string[]
  /** arcos próprios do conflito */
  arcs: { from: [number, number]; to: [number, number]; bend: number; reverse?: boolean; blocked?: boolean }[]
}

export const CONFLICTS: ConflictDef[] = [
  {
    id: 'semis',
    chip: 'Guerra dos Semicondutores',
    title: 'EUA × China — Guerra dos Semicondutores',
    didatico:
      'Os EUA bloqueiam a venda dos chips mais avançados para frear a indústria chinesa — a TSMC faz mais de 90% dos chips lógicos de ponta do mundo. Quem controla o "cérebro" da produção controla o século.',
    avancado:
      'Export controls (ASML/EUV, NVIDIA) sobre o capital constante mais avançado: contenção da composição orgânica tecnológica chinesa + defesa da renda de monopólio anglo-americana (TSMC: mais de 90% da lógica de ponta, segundo o NIST).',
    color: '#ef5350',
    highlight: [],
    arcs: [
      { from: A.usa, to: A.china, bend: 0.16 },
      { from: A.china, to: A.usa, bend: 0.16 },
    ],
  },
  {
    id: 'energia',
    chip: 'Energia & Sanções (RUS × UE)',
    title: 'Rússia × OTAN/UE — Guerra de Energia e Sanções',
    didatico:
      'As sanções cortaram os dutos rumo à Europa: petróleo e gás russos mudaram de rota para a Ásia, e a indústria europeia ficou com energia muito mais cara.',
    avancado:
      'Redirecionamento do capital energético russo (Ásia no lugar da Europa) e elevação dos custos operacionais do capital produtivo europeu — desindustrialização relativa + militarização (Europa +17% gasto militar, SIPRI 2024).',
    color: '#ffb300',
    highlight: ['com-rus-chn'],
    arcs: [{ from: A.russia, to: A.eu, bend: 0.12, blocked: true }],
  },
  {
    id: 'reprimaria',
    chip: 'Reprimarização no Brasil',
    title: 'Brasil — Reprimarização & Exército de Reserva',
    didatico:
      'O Brasil voltou a depender de grãos e minério enquanto ~92 milhões de pessoas ficam fora ou na borda do mercado de trabalho — salário baixo, poder das empresas alto.',
    avancado:
      'Especialização regressiva + Exército Industrial de Reserva de 92,1 mi (43,65%): superábito estrutural de força de trabalho comprime v e sustenta taxas de exploração extremas (Salobo 2.232%, formato ILAESE).',
    color: '#66bb6a',
    highlight: ['com-bra-chn', 'com-bra-eu', 'drn-bra-usa'],
    arcs: [],
  },
]

function conflictsForLang(lang: 'pt' | 'en' | 'es'): ConflictDef[] {
  if (lang === 'pt') return CONFLICTS
  const text: Record<ConflictDef['id'], Record<'en' | 'es', Pick<ConflictDef, 'chip' | 'title' | 'didatico' | 'avancado'>>> = {
    semis: {
      en: { chip: 'Semiconductor War', title: 'U.S. × China — Semiconductor War', didatico: 'The United States restricts access to the most advanced chips and manufacturing equipment as part of its competition with China. TSMC produces more than 90% of the world’s leading-edge logic chips.', avancado: 'Export controls on advanced lithography, accelerators and fabrication equipment target the most sophisticated fixed capital in the semiconductor chain while protecting strategic rents and domestic capacity.' },
      es: { chip: 'Guerra de semiconductores', title: 'EE. UU. × China — Guerra de semiconductores', didatico: 'Estados Unidos restringe el acceso a chips y equipos de fabricación avanzados como parte de su competencia con China. TSMC produce más del 90% de la lógica de vanguardia mundial.', avancado: 'Los controles de exportación sobre litografía avanzada, aceleradores y equipos de fabricación apuntan al capital fijo más sofisticado de la cadena mientras protegen rentas estratégicas y capacidad doméstica.' },
    },
    energia: {
      en: { chip: 'Energy & Sanctions (RUS × EU)', title: 'Russia × NATO/EU — Energy and Sanctions', didatico: 'Sanctions and political rupture cut major pipeline links to Europe. Russian oil and gas shifted toward Asia while European industry faced more expensive alternative energy supplies.', avancado: 'Russian energy capital was redirected toward Asia while higher input costs affected parts of European productive capital, combining relative deindustrialization pressure with accelerated military spending.' },
      es: { chip: 'Energía y sanciones (RUS × UE)', title: 'Rusia × OTAN/UE — Energía y sanciones', didatico: 'Las sanciones y la ruptura política cortaron importantes conexiones por ductos con Europa. Petróleo y gas rusos se desviaron hacia Asia mientras la industria europea enfrentó proveedores alternativos más caros.', avancado: 'El capital energético ruso fue redirigido hacia Asia mientras mayores costos de insumos afectaron partes del capital productivo europeo, combinando presión de desindustrialización relativa con gasto militar acelerado.' },
    },
    reprimaria: {
      en: { chip: 'Brazil’s Reprimarization', title: 'Brazil — Reprimarization & Reserve Army of Labor', didatico: 'Brazil became more dependent on grain and mineral exports while a very large population remains outside formal employment or underemployed, weakening wage bargaining power.', avancado: 'Regressive specialization plus a reserve workforce of 92.1 million (43.65% in the dataset used here) compresses labor bargaining power and reinforces an extractive-export structure.' },
      es: { chip: 'Reprimarización de Brasil', title: 'Brasil — Reprimarización y ejército de reserva', didatico: 'Brasil pasó a depender más de exportaciones de granos y minerales mientras una población muy grande permanece fuera del empleo formal o subempleada, debilitando el poder salarial.', avancado: 'La especialización regresiva más una reserva laboral de 92,1 millones (43,65% en el conjunto de datos usado aquí) comprime el poder de negociación del trabajo y refuerza una estructura extractivo-exportadora.' },
    },
  }
  return CONFLICTS.map((conflict) => ({ ...conflict, ...text[conflict.id][lang] }))
}

const MAP_UI = {
  pt: {
    zoomIn: 'Aproximar', zoomOut: 'Afastar', reset: 'Resetar zoom', brazil: 'Zoom no Brasil — estados e fluxos estaduais', brazilTitle: 'Zoom no Brasil: estados, exportações por estado e fluxo interno', fullscreen: 'Tela inteira', exitFullscreen: 'Sair da tela inteira',
    mapAria: 'Mapa-múndi geopolítico interativo com fluxos de capital', layers: 'Camadas', layersPanel: 'camadas · legenda · ferramentas', closeLayers: 'Fechar painel de camadas', legend: 'legenda', clickBloc: 'clique → bloco', clickDetails: 'clique p/ detalhes →', routePath: 'no caminho da rota', regionalRoute: 'rota regional ativa', blocAnatomy: 'clique para anatomia do bloco', wageAvg: 'salário médio', month: 'mês',
    copyTitle: 'Copiar link do estado atual do mapa (zoom, fluxo, país)', flowList: 'roteiro de análise · clique voa até a rota', detailMode: 'modo detalhado', regionalVisible: 'rotas regionais visíveis', noData: 'País renderizado no globo, aguardando dados. Para conectá-lo a um bloco, adicione o ISO', noDataJoin: 'em', noDataEntry: 'e crie sua entrada em', wageLegend: 'salário médio mensal (USD, aprox.)', step: 'passo', chooseTour: 'Escolher tour temático', endTour: 'Encerrar tour', goStep: 'Ir ao passo', next: 'próximo →', finish: 'finalizar ✓', footerHint: 'clique numa linha = detalhes do fluxo · scroll = zoom · contorno verde-água = BRICS+', internalOff: '⇄ fluxo financeiro interno (N/NE ⇄ SE)', internalOn: '✕ fluxo interno', loadingStates: 'carregando contornos dos estados (IBGE)…', click: 'clique', startTour: 'Iniciar tour guiado', levels: { simples: ['simples', 'Explicação direta'], didatico: ['didático', 'Leitura didática'], avancado: ['avançado', 'Leitura técnica'] } as const,
  },
  en: {
    zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset zoom', brazil: 'Zoom to Brazil — states and state flows', brazilTitle: 'Zoom to Brazil: states, state exports and internal flow', fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen',
    mapAria: 'Interactive geopolitical world map with capital flows', layers: 'Layers', layersPanel: 'layers · legend · tools', closeLayers: 'Close layers panel', legend: 'legend', clickBloc: 'click → bloc', clickDetails: 'click for details →', routePath: 'on the route', regionalRoute: 'regional route active', blocAnatomy: 'click for bloc anatomy', wageAvg: 'average wage', month: 'month',
    copyTitle: 'Copy link to the current map state (zoom, flow, country)', flowList: 'analysis routes · click to fly to a route', detailMode: 'detail mode', regionalVisible: 'regional routes visible', noData: 'Country is rendered on the globe but has no detailed data yet. To connect it to a bloc, add ISO', noDataJoin: 'to', noDataEntry: 'and create its entry in', wageLegend: 'average monthly wage (USD, approx.)', step: 'step', chooseTour: 'Choose thematic tour', endTour: 'End tour', goStep: 'Go to step', next: 'next →', finish: 'finish ✓', footerHint: 'click a line = flow details · scroll = zoom · cyan outline = BRICS+', internalOff: '⇄ internal financial flow (N/NE ⇄ SE)', internalOn: '✕ internal flow', loadingStates: 'loading state boundaries (IBGE)…', click: 'click', startTour: 'Start guided tour', levels: { simples: ['simple', 'Direct explanation'], didatico: ['guided', 'Guided reading'], avancado: ['advanced', 'Technical reading'] } as const,
  },
  es: {
    zoomIn: 'Acercar', zoomOut: 'Alejar', reset: 'Restablecer zoom', brazil: 'Zoom a Brasil — estados y flujos estatales', brazilTitle: 'Zoom a Brasil: estados, exportaciones estatales y flujo interno', fullscreen: 'Pantalla completa', exitFullscreen: 'Salir de pantalla completa',
    mapAria: 'Mapa mundial geopolítico interactivo con flujos de capital', layers: 'Capas', layersPanel: 'capas · leyenda · herramientas', closeLayers: 'Cerrar panel de capas', legend: 'leyenda', clickBloc: 'clic → bloque', clickDetails: 'clic para detalles →', routePath: 'en la ruta', regionalRoute: 'ruta regional activa', blocAnatomy: 'clic para anatomía del bloque', wageAvg: 'salario medio', month: 'mes',
    copyTitle: 'Copiar enlace del estado actual del mapa (zoom, flujo, país)', flowList: 'rutas de análisis · clic para volar a la ruta', detailMode: 'modo detallado', regionalVisible: 'rutas regionales visibles', noData: 'El país está renderizado en el globo pero todavía no tiene datos detallados. Para conectarlo a un bloque, añade el ISO', noDataJoin: 'en', noDataEntry: 'y crea su entrada en', wageLegend: 'salario medio mensual (USD, aprox.)', step: 'paso', chooseTour: 'Elegir tour temático', endTour: 'Cerrar tour', goStep: 'Ir al paso', next: 'siguiente →', finish: 'finalizar ✓', footerHint: 'clic en una línea = detalles del flujo · rueda = zoom · contorno cian = BRICS+', internalOff: '⇄ flujo financiero interno (N/NE ⇄ SE)', internalOn: '✕ flujo interno', loadingStates: 'cargando límites estatales (IBGE)…', click: 'clic', startTour: 'Iniciar tour guiado', levels: { simples: ['simple', 'Explicación directa'], didatico: ['didáctico', 'Lectura didáctica'], avancado: ['avanzado', 'Lectura técnica'] } as const,
  },
} as const

const BR_MAP_I18N = {
  en: {
    andMore: 'and more', mainProducts: 'Main products', mainDestination: 'Main destination', whoMoves: 'Who moves it',
    source: 'Comex Stat/MDIC · Jan–Jul 2025', billion: 'bn', various: 'diverse markets',
    category: { minerio: 'Mining', petroleo: 'Oil & gas', agro: 'Agribusiness', industria: 'Industry', diversos: 'Mixed' } as Record<string, string>,
    internal: {
      fiscal: ['Fiscal transfer', '≈ R$ 150–250 bn/year net (est.)'], energia: ['Hydroelectric power', 'Tucuruí + Belo Monte → ~50 million people'],
      zfm: ['Manaus Free Trade Zone tax expenditure', '≈ R$ 25 bn+/year (est.)'], 'commodities-co': ['Agribusiness surplus', 'agribusiness trade balance ≈ US$ 150 bn/year'],
      'agua-sf': ['Transferred water', 'R$ 10+ bn project · 1.3 million people served'],
    } as Record<string, [string, string]>,
  },
  es: {
    andMore: 'y más', mainProducts: 'Productos principales', mainDestination: 'Destino principal', whoMoves: 'Quién lo mueve',
    source: 'Comex Stat/MDIC · ene–jul 2025', billion: 'mil M', various: 'mercados diversos',
    category: { minerio: 'Minería', petroleo: 'Petróleo y gas', agro: 'Agronegocio', industria: 'Industria', diversos: 'Diversos' } as Record<string, string>,
    internal: {
      fiscal: ['Transferencia fiscal', '≈ R$ 150–250 mil M/año netos (est.)'], energia: ['Energía hidroeléctrica', 'Tucuruí + Belo Monte → ~50 millones de personas'],
      zfm: ['Renuncia fiscal de la Zona Franca de Manaos', '≈ R$ 25 mil M+/año (est.)'], 'commodities-co': ['Superávit agropecuario', 'saldo comercial agropecuario ≈ US$ 150 mil M/año'],
      'agua-sf': ['Agua trasvasada', 'proyecto de R$ 10+ mil M · 1,3 millones de personas atendidas'],
    } as Record<string, [string, string]>,
  },
} as const

const BR_PRODUCT_TERMS: Array<[RegExp, string, string]> = [
  [/Petróleo do pré-sal/g, 'Pre-salt oil', 'Petróleo del presal'], [/Minério de ferro/g, 'Iron ore', 'Mineral de hierro'],
  [/ferro e aço semiacabados/gi, 'semi-finished iron and steel', 'hierro y acero semiacabados'], [/Ferro e aço/g, 'Iron and steel', 'Hierro y acero'],
  [/Óleo combustível/g, 'Fuel oil', 'Fuel oil'], [/Querosene de aviação/g, 'Jet fuel', 'Queroseno de aviación'],
  [/ouro semimanufaturado/gi, 'semi-manufactured gold', 'oro semimanufacturado'], [/carne bovina/gi, 'beef', 'carne bovina'],
  [/carne de frango/gi, 'poultry', 'carne de pollo'], [/suco de laranja/gi, 'orange juice', 'jugo de naranja'],
  [/Açúcar/g, 'Sugar', 'Azúcar'], [/açúcar/g, 'sugar', 'azúcar'], [/etanol/gi, 'ethanol', 'etanol'], [/celulose/gi, 'pulp', 'celulosa'],
  [/manufaturados/gi, 'manufactured goods', 'manufacturas'], [/café conilon/gi, 'conilon coffee', 'café conilon'], [/café/gi, 'coffee', 'café'],
  [/ouro/gi, 'gold', 'oro'], [/ferro-ligas/gi, 'ferroalloys', 'ferroaleaciones'], [/Carne/g, 'Meat', 'Carne'], [/carne/g, 'meat', 'carne'],
  [/soja/gi, 'soybeans', 'soja'], [/milho/gi, 'corn', 'maíz'], [/frango/gi, 'chicken', 'pollo'], [/papel/gi, 'paper', 'papel'],
  [/automóveis/gi, 'automobiles', 'automóviles'], [/alumina/gi, 'alumina', 'alúmina'], [/cobre/gi, 'copper', 'cobre'], [/Fumo/g, 'Tobacco', 'Tabaco'],
  [/cereais/gi, 'cereals', 'cereales'], [/calçados/gi, 'footwear', 'calzado'], [/suínos/gi, 'pork', 'porcinos'], [/geradores/gi, 'generators', 'generadores'],
  [/madeira/gi, 'wood', 'madera'], [/algodão/gi, 'cotton', 'algodón'], [/rochas/gi, 'stone', 'rocas'], [/Alumínio/g, 'Aluminum', 'Aluminio'],
  [/Combustíveis/g, 'Fuels', 'Combustibles'], [/máquinas/gi, 'machinery', 'maquinaria'], [/frutas/gi, 'fruit', 'frutas'], [/pescados/gi, 'seafood', 'pescados'],
  [/Motocicletas/g, 'Motorcycles', 'Motocicletas'], [/Petróleo/g, 'Oil', 'Petróleo'], [/melaço/gi, 'molasses', 'melaza'], [/sucos/gi, 'juices', 'jugos'],
  [/manganês/gi, 'manganese', 'manganeso'], [/sorgo/gi, 'sorghum', 'sorgo'], [/tabaco/gi, 'tobacco', 'tabaco'],
]

function brFragmentForLang(text: string, lang: 'pt' | 'en' | 'es') {
  if (lang === 'pt') return text
  let out = text
  for (const [pattern, en, es] of BR_PRODUCT_TERMS) out = out.replace(pattern, lang === 'en' ? en : es)
  return out
}

function brStateFlowForLang(flow: FlowDef, lang: 'pt' | 'en' | 'es'): FlowDef {
  if (lang === 'pt' || !flow.id.startsWith('st-')) return flow
  const state = BR_STATES.find((item) => item.code === flow.id.slice(3))
  if (!state) return flow
  const ui = BR_MAP_I18N[lang]
  const products = brFragmentForLang(state.produtos, lang)
  const destination = state.dest === 'CHN' ? 'China' : state.dest === 'EUA' ? (lang === 'en' ? 'United States' : 'Estados Unidos') : state.dest === 'UE' ? (lang === 'en' ? 'European Union' : 'Unión Europea') : ui.various
  const amount = state.expBi.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES', { maximumFractionDigits: 1 })
  const category = ui.category[state.cat]
  return {
    ...flow,
    titulo: `${state.nome}: ${products.split(',')[0].toLowerCase()} ${ui.andMore}`,
    totalAnual: `US$ ${amount} ${ui.billion} (${lang === 'en' ? 'Jan–Jul' : 'ene–jul'} 2025)`,
    did: lang === 'en'
      ? `From January to July 2025, ${state.nome} exported about US$ ${amount} billion, led by ${products}. Main destination: ${destination}.`
      : `Entre enero y julio de 2025, ${state.nome} exportó cerca de US$ ${amount} mil millones, principalmente ${products}. Destino principal: ${destination}.`,
    adv: lang === 'en'
      ? `Export profile: ${category}. Main destination: ${destination}. Comex Stat/MDIC data for Jan–Jul 2025; values and category are preserved from the Portuguese dataset.`
      : `Perfil exportador: ${category}. Destino principal: ${destination}. Datos Comex Stat/MDIC de ene–jul 2025; se preservan los valores y la categoría del conjunto portugués.`,
    itens: [
      { rotulo: ui.mainProducts, valor: products },
      { rotulo: ui.mainDestination, valor: destination },
      ...(state.empresa ? [{ rotulo: ui.whoMoves, valor: state.empresa }] : []),
    ],
    fonte: ui.source,
  }
}

function ZoomButtons({ onZoom, onReset, onBrazil, onFullscreen, isFs, lang }: {
  onZoom: (f: number) => void
  onReset: () => void
  onBrazil: () => void
  onFullscreen: () => void
  isFs: boolean
  lang: 'pt' | 'en' | 'es'
}) {
  const copy = MAP_UI[lang]
  return (
    <div className="absolute right-2.5 top-2.5 z-20 hidden flex-col gap-1 md:flex">
      <button aria-label={copy.zoomIn} onClick={() => onZoom(1.5)}
        className="h-7 w-7 rounded-md border border-zinc-700 bg-zinc-900/90 font-mono text-sm text-zinc-300 hover:border-money hover:text-money max-md:h-9 max-md:w-9">+</button>
      <button aria-label={copy.zoomOut} onClick={() => onZoom(1 / 1.5)}
        className="h-7 w-7 rounded-md border border-zinc-700 bg-zinc-900/90 font-mono text-sm text-zinc-300 hover:border-money hover:text-money max-md:h-9 max-md:w-9">−</button>
      <button aria-label={copy.reset} onClick={onReset}
        className="h-7 w-7 rounded-md border border-zinc-700 bg-zinc-900/90 text-[10px] text-zinc-400 hover:border-money hover:text-money max-md:h-9 max-md:w-9">⟲</button>
      <button aria-label={copy.brazil} onClick={onBrazil} title={copy.brazilTitle}
        className="h-7 w-7 rounded-md border border-emerald-500/60 bg-emerald-500/10 font-mono text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/25 max-md:h-9 max-md:w-9">BR</button>
      <button aria-label={isFs ? copy.exitFullscreen : copy.fullscreen} onClick={onFullscreen} title={isFs ? copy.exitFullscreen : copy.fullscreen}
        className="h-7 w-7 rounded-md border border-zinc-700 bg-zinc-900/90 text-[11px] text-zinc-300 hover:border-money hover:text-money max-md:h-9 max-md:w-9">{isFs ? '⤡' : '⛶'}</button>
    </div>
  )
}

export default function MapWorld() {
  /* selectors individuais: sliders k/e e mudanças alheias não re-renderizam o mapa */
  const openCountry = useApp((s) => s.openCountry)
  const conflict = useApp((s) => s.conflict)
  const setConflict = useApp((s) => s.setConflict)
  const tab = useApp((s) => s.tab)
  const setTab = useApp((s) => s.setTab)
  const mode = useApp((s) => s.mode)
  const lens = useApp((s) => s.lens)
  const lang = useApp((s) => s.lang)
  const countryId = useApp((s) => s.countryId)
  const overlayMode = useApp((s) => s.sharedMap.overlayMode)
  const setSharedMap = useApp((s) => s.setSharedMap)
  const copy = MAP_UI[lang]
  const localizedConflicts = useMemo(() => conflictsForLang(lang), [lang])
  const active = localizedConflicts.find((c) => c.id === conflict) ?? null
  const localizedFlows = useMemo(() => flowsForLang(lang), [lang])
  const localizedTours = useMemo(() => toursForLang(lang), [lang])

  /* ── URL COMPARTILHÁVEL: restaura estado do mapa a partir de ?v=&f=&w=&c= ── */
  const initialShared = useMemo(() => useApp.getState().sharedMap, [])
  const INIT = useMemo(() => {
    const p = new URLSearchParams(window.location.search)
    const v = p.get('v')?.split(',').map(Number) ?? []
    const hasUrlView = v.length === 3 && v.every((n) => !isNaN(n))
    let initView = hasUrlView ? { k: v[0], x: v[1], y: v[2] } : { k: 1, x: 0, y: 0 }
    if (!hasUrlView && (initialShared.k !== 1 || initialShared.lng !== -15 || initialShared.lat !== 15)) {
      const [px, py] = project([initialShared.lng, initialShared.lat])
      initView = { k: initialShared.k, x: MAP_W / 2 - px * initialShared.k, y: MAP_H / 2 - py * initialShared.k }
    }
    return {
      view: initView,
      flow: p.get('f') ?? initialShared.selFlow,
      conflict: (p.get('w') as ConflictId) ?? null,
      country: p.get('c'),
    }
  }, [initialShared])

  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const viewportRef = useRef<SVGGElement>(null)
  const [view, setView] = useState(INIT.view)

  /* ── Interação ativa: suprime filtros caros e pausa pulsos contínuos durante pan/zoom ── */
  const [isInteracting, setIsInteracting] = useState(false)
  const interactTimeoutRef = useRef<number | null>(null)
  const markInteracting = useCallback(() => {
    setIsInteracting(true)
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current)
    interactTimeoutRef.current = window.setTimeout(() => {
      setIsInteracting(false)
    }, 180)
  }, [])
  useEffect(() => () => {
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current)
  }, [])

  /* ── Cache de getBoundingClientRect para eliminar layout thrashing durante gestos ── */
  const cachedRectRef = useRef<{ rect: DOMRect; time: number } | null>(null)
  const getSvgRect = useCallback(() => {
    const now = performance.now()
    if (cachedRectRef.current && now - cachedRectRef.current.time < 300) {
      return cachedRectRef.current.rect
    }
    const el = svgRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    cachedRectRef.current = { rect: r, time: now }
    return r
  }, [])

  /*
   * Coalesce pan/pinch/trackpad updates to at most one React commit per frame.
   * Direct DOM transform is applied immediately for instantaneous 60-120 FPS response.
   */
  const viewRef = useRef(view)
  const queuedViewRef = useRef<typeof view | null>(null)
  const viewRafRef = useRef<number | null>(null)
  useEffect(() => { viewRef.current = view }, [view])
  const queueViewUpdate = useCallback((update: (v: typeof view) => typeof view) => {
    const base = queuedViewRef.current ?? viewRef.current
    const next = update(base)
    queuedViewRef.current = next
    viewRef.current = next

    // Atualização direta do DOM (transform) sem esperar a reconciliação do React
    if (viewportRef.current) {
      viewportRef.current.style.transform = `translate(${next.x}px, ${next.y}px) scale(${next.k})`
    }

    if (viewRafRef.current !== null) return
    viewRafRef.current = requestAnimationFrame(() => {
      viewRafRef.current = null
      const pending = queuedViewRef.current
      queuedViewRef.current = null
      if (pending) setView(pending)
    })
  }, [])
  useEffect(() => () => {
    if (viewRafRef.current !== null) cancelAnimationFrame(viewRafRef.current)
  }, [])

  /**
   * PATAMARES ESTÁVEIS DE ZOOM (zoomTier):
   * Em vez de quebrar e reconstruir camadas a cada 0.25x (o que destruía e recriava
   * dezenas de animações SMIL <animateMotion>), o zoomTier opera em 3 degraus estáveis:
   * tier 1 (visão mundial k < 2), tier 2 (continental 2 <= k < 3.8), tier 4 (países/estados k >= 3.8).
   * Do zoom 1.0 ao 1.99, ZERO elementos SVG são destruídos ou recriados!
   */
  const zoomTier = view.k >= 3.8 ? 4 : view.k >= 2 ? 2 : 1
  const detailOn = view.k >= 2
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const [visibleLayers, setVisibleLayers] = useState<Record<FlowType, boolean>>({
    commodities: true, manufatura: true, drain: true, dollar: true, brics: true, fantasma: true,
  })
  const toggleLayer = (t: FlowType) => setVisibleLayers((s) => ({ ...s, [t]: !s[t] }))

  /* fluxo selecionado / em hover */
  const [selFlow, setSelFlow] = useState<string | null>(INIT.flow)
  const [hoverFlow, setHoverFlow] = useState<string | null>(null)
  const [flowTip, setFlowTip] = useState<{ x: number; y: number; id: string } | null>(null)
  const movedRef = useRef(false)
  const [showFlowList, setShowFlowList] = useState(false)
  const [showInternal, setShowInternal] = useState(false)
  /** bottom sheet de camadas (apenas mobile) */
  const [sheetOpen, setSheetOpen] = useState(false)

  /* restaura conflito/país da URL (uma vez) */
  useEffect(() => {
    if (INIT.conflict) setConflict(INIT.conflict)
    if (INIT.country) openCountry(INIT.country)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── URL COMPARTILHÁVEL: escreve estado (debounce 500 ms) ── */
  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams()
      if (view.k !== 1) p.set('v', `${view.k.toFixed(2)},${view.x.toFixed(0)},${view.y.toFixed(0)}`)
      if (selFlow) p.set('f', selFlow)
      if (conflict) p.set('w', conflict)
      if (countryId) p.set('c', countryId)
      if (tab !== 'home') p.set('t', tab)
      if (mode !== 'didatico') p.set('m', mode)
      const qs = p.toString()
      history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
    }, 500)
    return () => clearTimeout(t)
  }, [view, selFlow, conflict, countryId, tab, mode])
  const [showWages, setShowWages] = useState(false)
  const [showDeaths, setShowDeaths] = useState(false)
  const [selDisaster, setSelDisaster] = useState<string | null>(null)
  const [tourStep, setTourStep] = useState<number | null>(() => initialShared.tourStep ?? null)
  /** tour temático ativo (base comum ao 2D e ao 3D) */
  const [activeTourId, setActiveTourId] = useState(() => initialShared.activeTourId ?? 'principal')
  const activeTour = getTourForLang(activeTourId, lang)
  const STOPS = activeTour.stops
  const TOUR_ACCENT = activeTour.accent

  const { startDriverTour, destroyDriver, isDriverActive } = useTourDriver({
    stops: STOPS,
    activeStep: tourStep,
    onStepChange: (idx) => setTourStep(idx),
    onEndTour: () => endTour(),
    accent: TOUR_ACCENT,
    mode,
    lang,
    targetElementSelector: '#tour-spotlight-target',
  })

  /** inicia o tour em tela cheia (com fallback silencioso) */
  const startTour = () => {
    try {
      const p = containerRef.current?.requestFullscreen?.() as Promise<void> | undefined
      p?.catch(() => {})
    } catch {
      /* sem fullscreen: o tour segue normal */
    }
    setSheetOpen(false)
    setShowWages(false)
    setShowDeaths(false)
    setTourStep(0)
  }
  /** encerra o tour e sai da tela cheia */
  const endTour = () => {
    destroyDriver()
    setTourStep(null)
    try {
      if (document.fullscreenElement) {
        const p = document.exitFullscreen() as Promise<void> | undefined
        p?.catch(() => {})
      }
    } catch {
      /* nada */
    }
  }

  /** voa em 3 fases (sobe → cruza → desce), como as linhas de fluxo — rAF suave */
  const rafRef = useRef<number | null>(null)
  const stopFlight = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }
  const flyTo = (mx: number, my: number, k2 = 2.6, fy = 0.5, kLift?: number) => {
    stopFlight()
    const v = queuedViewRef.current ?? viewRef.current
    const k1 = v.k
    const c1x = (MAP_W / 2 - v.x) / k1
    const c1y = (MAP_H / 2 - v.y) / k1
    /* viagem de verdade: sobe (zoom out) → cruza → desce; durações generosas
       p/ o olho acompanhar o trajeto (o gesto do usuário cancela o voo) */
    const kMid = kLift ?? Math.max(1, Math.min(k1, k2, 1.25))
    const t0 = performance.now()
    const D1 = 800, D2 = 1300, D3 = 900
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const CY = MAP_H * fy // altura focal: 0.5 = centro; tour usa ~0.36 p/ não tapar o país
    const frame = (now: number) => {
      const e = now - t0
      let nextV: { k: number; x: number; y: number }
      if (e <= D1) {
        const t = ease(e / D1)
        const k = k1 + (kMid - k1) * t
        nextV = { k, x: MAP_W / 2 - c1x * k, y: CY - c1y * k }
      } else if (e <= D1 + D2) {
        const t = ease((e - D1) / D2)
        const cx = c1x + (mx - c1x) * t
        const cy = c1y + (my - c1y) * t
        nextV = { k: kMid, x: MAP_W / 2 - cx * kMid, y: CY - cy * kMid }
      } else if (e <= D1 + D2 + D3) {
        const t = ease((e - D1 - D2) / D3)
        const k = kMid + (k2 - kMid) * t
        nextV = { k, x: MAP_W / 2 - mx * k, y: CY - my * k }
      } else {
        nextV = { k: k2, x: MAP_W / 2 - mx * k2, y: CY - my * k2 }
        viewRef.current = nextV
        if (viewportRef.current) {
          viewportRef.current.style.transform = `translate(${nextV.x}px, ${nextV.y}px) scale(${nextV.k})`
        }
        setView(nextV)
        rafRef.current = null
        return
      }
      viewRef.current = nextV
      if (viewportRef.current) {
        viewportRef.current.style.transform = `translate(${nextV.x}px, ${nextV.y}px) scale(${nextV.k})`
      }
      setView(nextV)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
  }

  /** variante geográfica: aceita lng/lat e projeta antes de voar */
  const flyToLL = (lng: number, lat: number, k = 2.6, fy = 0.5, kLift?: number) => {
    const [px, py] = project([lng, lat])
    flyTo(px, py, k, fy, kLift)
  }

  /** tela inteira do mapa (o tour e os overlays acompanham) */
  const [isFs, setIsFs] = useState(false)
  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else containerRef.current?.requestFullscreen?.().catch(() => {})
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelFlow(null)
        setTourStep(null)
        useApp.getState().setGlossaryOpen(false)
      }
      if (tourStep !== null && e.key === 'ArrowRight')
        setTourStep((s) => (s === null ? 0 : Math.min(s + 1, STOPS.length - 1)))
      if (tourStep !== null && e.key === 'ArrowLeft')
        setTourStep((s) => (s === null ? 0 : Math.max(s - 1, 0)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tourStep])

  /* tour guiado: voa até cada parada (ponto acima do card), acende fluxo/conflito/camada */
  useEffect(() => {
    if (tourStep === null) return
    const s = STOPS[tourStep]
    if (!s) return
    flyToLL(s.lng, s.lat, s.k, 0.36, 1)
    if (s.flowId) setSelFlow(s.flowId)
    else setSelFlow(null)
    if (s.conflict) setConflict(s.conflict)
    else setConflict(null)
    setShowDeaths(s.layer === 'deaths')
    setShowWages(s.layer === 'wages')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStep, activeTourId])

  /* ── MODO BRASIL: detecta centro do viewport dentro do território + zoom alto ── */
  const viewCenter = useMemo(() => {
    const mx = (MAP_W / 2 - view.x) / view.k
    const my = (MAP_H / 2 - view.y) / view.k
    const inv = (projection as unknown as { invert?: (p: [number, number]) => [number, number] | null }).invert
    return inv ? inv([mx, my]) : null
  }, [view])

  /* Sincronização de seleção e tour para 2D ⇄ 3D via sharedMap (imediata) */
  useEffect(() => {
    setSharedMap({ selFlow, activeTourId, tourStep })
  }, [selFlow, activeTourId, tourStep, setSharedMap])

  /* Sincronização de coordenadas de câmera debounced (250ms) para não inundar o store no pan/zoom */
  useEffect(() => {
    const t = setTimeout(() => {
      const lng = viewCenter ? viewCenter[0] : -15
      const lat = viewCenter ? viewCenter[1] : 15
      setSharedMap({ lng, lat, k: view.k })
    }, 250)
    return () => clearTimeout(t)
  }, [viewCenter, view.k, setSharedMap])

  /* Transição atômica e precisa ao alternar 2D → Globo 3D */
  const handleGoTo3D = useCallback(() => {
    const v = queuedViewRef.current ?? viewRef.current
    const mx = (MAP_W / 2 - v.x) / v.k
    const my = (MAP_H / 2 - v.y) / v.k
    const inv = (projection as unknown as { invert?: (p: [number, number]) => [number, number] | null }).invert
    const center = inv ? inv([mx, my]) : null
    setSharedMap({
      selFlow,
      activeTourId,
      tourStep,
      lng: center ? center[0] : -15,
      lat: center ? center[1] : 15,
      k: v.k,
    })
    setTab('globe3d')
  }, [selFlow, activeTourId, tourStep, setSharedMap, setTab])

  const inBrazil =
    !!viewCenter && viewCenter[0] > -76 && viewCenter[0] < -31 && viewCenter[1] > -36 && viewCenter[1] < 7
  const statesOn = inBrazil && view.k >= 2.8
  const goBrazil = () => {
    flyTo(project([BRAZIL_VIEW.lng, BRAZIL_VIEW.lat])[0], project([BRAZIL_VIEW.lng, BRAZIL_VIEW.lat])[1], BRAZIL_VIEW.k)
  }

  const selFlowObj: FlowDef | null = useMemo(() => {
    const globalFlow = FLOWS.find((f) => f.id === selFlow)
    if (globalFlow) return globalFlow
    const stateFlow = BR_STATE_FLOWS.find((f) => f.id === selFlow)
    return stateFlow ? brStateFlowForLang(stateFlow, lang) : null
  }, [selFlow, lang])

  /* ── países envolvidos em rotas de DETALHE → glow quando o zoom os revela ── */
  const detailIsoSet = useMemo(() => {
    const s = new Set<string>()
    FLOWS.forEach((f) => {
      if (f.tier !== 'detail') return
      if (f.iso) s.add(f.iso)
      ;(['from', 'to'] as const).forEach((side) => {
        const v = f[side]
        if (typeof v === 'string' && BLOC_MEMBERS[v]) BLOC_MEMBERS[v].forEach((iso) => s.add(iso))
      })
    })
    return s
  }, [])

  /* auto-fechar painel de rota regional se o usuário afastar o zoom
     (exceto no tour, que seleciona rotas regionais de propósito) */
  useEffect(() => {
    if (tourStep === null && selFlow?.startsWith('det-') && view.k < 2) setSelFlow(null)
  }, [view.k, selFlow, tourStep])

  /* ── contornos oficiais dos estados (IBGE) — carregados sob demanda ── */
  const [brGeo, setBrGeo] = useState<{ code: string; d: string }[] | null>(brGeoCache)
  useEffect(() => {
    if (!statesOn || brGeo) return
    if (brGeoCache) { setBrGeo(brGeoCache); return }
    let cancelled = false
    const UF: Record<string, string> = {
      '12': 'AC', '27': 'AL', '16': 'AP', '13': 'AM', '29': 'BA', '23': 'CE', '53': 'DF',
      '32': 'ES', '52': 'GO', '21': 'MA', '51': 'MT', '50': 'MS', '31': 'MG', '15': 'PA',
      '25': 'PB', '41': 'PR', '26': 'PE', '22': 'PI', '33': 'RJ', '24': 'RN', '43': 'RS',
      '11': 'RO', '14': 'RR', '42': 'SC', '28': 'SE', '35': 'SP', '17': 'TO',
    }
    fetch('https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&intrarregiao=UF&qualidade=minima')
      .then((r) => r.json())
      .then((gj: { features?: { properties?: Record<string, unknown>; geometry?: { type: string; coordinates: number[][][] | number[][][][] } }[] }) => {
        if (cancelled) return
        const out: { code: string; d: string }[] = []
        for (const [fi, ft] of (gj.features ?? []).entries()) {
          if (!ft.geometry) continue
          const props = ft.properties ?? {}
          const codarea = String(props.codarea ?? props.CD_UF ?? props.uf ?? '').padStart(2, '0')
          const code = UF[codarea] ?? UF[String(parseInt(codarea, 10) || 0)] ?? `uf-${fi}`
          const geom = ft.geometry
          const rings: number[][][] =
            geom.type === 'Polygon' ? [geom.coordinates[0] as number[][]] : (geom.coordinates as number[][][][]).flatMap((p) => p[0] ? [p[0]] : [])
          const d = rings
            .map((ring) => ring
              .map((pt, i) => {
                const p = project([pt[0], pt[1]])
                return p ? `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}` : ''
              })
              .join(' ') + ' Z')
            .join(' ')
          out.push({ code, d })
        }
        if (out.length) { brGeoCache = out; setBrGeo(out) }
      })
      .catch(() => { /* offline: mantém círculos */ })
    return () => { cancelled = true }
  }, [statesOn, brGeo])

  const [hover, setHover] = useState<{ name: string; x: number; y: number; iso: string; wageUsd?: number } | null>(null)
  const [selectedInfo, setSelectedInfo] = useState<{ name: string; iso: string } | null>(null)

  /* zoom pelo scroll (non-passive p/ preventDefault) */
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      stopFlight()
      markInteracting()
      const rect = getSvgRect()
      if (!rect) return
      const vx = ((e.clientX - rect.left) / rect.width) * MAP_W
      const vy = ((e.clientY - rect.top) / rect.height) * MAP_H
      queueViewUpdate((v) => {
        const nk = Math.min(10, Math.max(1, v.k * Math.exp(-e.deltaY * 0.0016)))
        const wx = (vx - v.x) / v.k
        const wy = (vy - v.y) / v.k
        return { k: nk, x: vx - wx * nk, y: vy - wy * nk }
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [queueViewUpdate, markInteracting, getSvgRect])

  const zoomAroundCenter = (factor: number) => {
    markInteracting()
    queueViewUpdate((v) => {
      const nk = Math.min(10, Math.max(1, v.k * factor))
      const cxp = MAP_W / 2
      const cyp = MAP_H / 2
      const wx = (cxp - v.x) / v.k
      const wy = (cyp - v.y) / v.k
      return { k: nk, x: cxp - wx * nk, y: cyp - wy * nk }
    })
  }

  /* ── ponteiros ativos: 1 = pan · 2 = pinch-zoom (celular) ── */
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const pinchRef = useRef<{ dist: number; k: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId)
    stopFlight()
    markInteracting()
    setSheetOpen(false) // toque no mapa fecha o sheet (comportamento de apps de mapa)
    setHoverFlow(null)
    setFlowTip(null)
    if (svgRef.current) {
      cachedRectRef.current = { rect: svgRef.current.getBoundingClientRect(), time: performance.now() }
    }
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 1) {
      const v = queuedViewRef.current ?? viewRef.current
      dragRef.current = { sx: e.clientX, sy: e.clientY, ox: v.x, oy: v.y }
      movedRef.current = false
      setDragging(true)
    } else if (pointersRef.current.size === 2) {
      dragRef.current = null // dois dedos = pinch, não pan
      const [p1, p2] = [...pointersRef.current.values()]
      const v = queuedViewRef.current ?? viewRef.current
      pinchRef.current = { dist: Math.hypot(p2.x - p1.x, p2.y - p1.y), k: v.k }
    }
  }
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return
    markInteracting()
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointersRef.current.values()]

    /* PINCH: escala em torno do ponto médio dos dois dedos */
    if (pts.length >= 2 && pinchRef.current) {
      const [p1, p2] = pts
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1
      const rect = getSvgRect()
      if (!rect) return
      const mx = ((p1.x + p2.x) / 2 - rect.left) / rect.width * MAP_W
      const my = ((p1.y + p2.y) / 2 - rect.top) / rect.height * MAP_H
      const base = pinchRef.current
      movedRef.current = true
      queueViewUpdate((v) => {
        const nk = Math.min(10, Math.max(1, base.k * (dist / base.dist)))
        const wx = (mx - v.x) / v.k
        const wy = (my - v.y) / v.k
        return { k: nk, x: mx - wx * nk, y: my - wy * nk }
      })
      return
    }

    /* PAN com um ponteiro */
    const d = dragRef.current
    if (!d) return
    const rect = getSvgRect()
    if (!rect) return
    const dx = ((e.clientX - d.sx) / rect.width) * MAP_W
    const dy = ((e.clientY - d.sy) / rect.height) * MAP_H
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true
    queueViewUpdate((v) => ({ ...v, x: d.ox + dx, y: d.oy + dy }))
  }
  /** solta um ponteiro; se sobrar um, retoma o pan a partir dele */
  const releasePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) pinchRef.current = null
    if (pointersRef.current.size === 1) {
      const [p] = [...pointersRef.current.values()]
      const v = queuedViewRef.current ?? viewRef.current
      dragRef.current = { sx: p.x, sy: p.y, ox: v.x, oy: v.y }
      movedRef.current = false
    } else if (pointersRef.current.size === 0) {
      endDrag()
    }
  }
  const endDrag = () => { dragRef.current = null; setDragging(false) }

  const handleCountryClick = (iso: string, name: string) => {
    if (dragRef.current || movedRef.current) return
    const bloc = ISO_TO_BLOC[iso]
    if (bloc) openCountry(bloc)
    else setSelectedInfo({ iso, name })
  }

  const showHoverLabel = (e: React.PointerEvent, iso: string, name: string, wageUsd?: number) => {
    if (e.pointerType === 'touch' || isInteracting) return // rótulo suprimido no toque ou durante gestos
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setHover({ name, iso, x: e.clientX - rect.left, y: e.clientY - rect.top, wageUsd })
  }

  /* países da rota em destaque (tour ou clique manual): contorno na cor do fluxo */
  const tourHi = useMemo(() => {
    if (tourStep !== null) {
      const s = STOPS[tourStep]
      if (s) {
        const isos = new Set(stopIsos(s))
        if (isos.size) return { isos, color: stopColor(s) ?? TOUR_ACCENT }
      }
    }
    if (selFlow) {
      const f = FLOWS.find((x) => x.id === selFlow)
      if (f) {
        const isos = new Set(flowIsos(f))
        if (isos.size) return { isos, color: TYPE_STYLE[f.type].color }
      }
    }
    return null
  }, [tourStep, activeTourId, selFlow]) // eslint-disable-line react-hooks/exhaustive-deps

  /* glow do destaque: UMA passada de filtro sobre o grupo dos poucos países
     acesos (em vez de um drop-shadow por path — que re-rasteriza cada filtro
     nos degraus de zoom/pinch do celular com o mesmo resultado visual). */
  const tourGlowLayer = useMemo(() => {
    if (!tourHi) return null
    return (
      <g pointerEvents="none" style={{ filter: isInteracting ? undefined : `drop-shadow(0 0 5px ${tourHi.color})` }}>
        {COUNTRY_FEATURES.filter((f) => tourHi.isos.has(f.id)).map((f) => (
          <path key={f.id} d={f.d} fill={`${tourHi.color}3d`} stroke={tourHi.color} strokeWidth={1.4} strokeLinejoin="round" />
        ))}
      </g>
    )
  }, [tourHi, isInteracting])

  const ditActive = lens === 'geografia' || overlayMode === 'dit'

  /* camada de países é ESTÁTICA — memoizada p/ não reconciliar ~177 paths
     a cada interação do mouse (tooltip atualiza isoladamente). Eventos
     delegados no <g> (2 closures em vez de 354); hover/tooltip só em
     ponteiro fino (toque usa clique → drawer).
     Modos: bloco (padrão) · DIT (Divisão Internacional do Trabalho) · heatmap salarial · glow de rotas regionais no zoom · destaque do tour. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const countriesLayer = useMemo(
    () => (
      <g
        strokeLinejoin="round"
        onPointerOver={(e) => {
          const el = e.target as SVGPathElement
          const iso = el.getAttribute('data-iso')
          if (!iso) return
          const wageAttr = el.getAttribute('data-wage')
          showHoverLabel(e, iso, el.getAttribute('data-name') ?? iso, wageAttr !== null ? Number(wageAttr) : undefined)
        }}
        onClick={(e) => {
          const el = e.target as SVGPathElement
          const iso = el.getAttribute('data-iso')
          if (iso) handleCountryClick(iso, el.getAttribute('data-name') ?? iso)
        }}
      >
        {COUNTRY_FEATURES.map((f) => {
          const bloc = ISO_TO_BLOC[f.id]
          const isBrics = BRICS_ISO.has(f.id)
          const blocColor = BLOCS.find((b) => b.id === bloc)?.color
          const bricsOn = visibleLayers.brics && isBrics
          const glow = detailOn && detailIsoSet.has(f.id)
          const wage = WAGES[f.id]
          const wageOn = showWages && wage !== undefined
          const thi = tourHi !== null && tourHi.isos.has(f.id)
          const ditRole = getDitRole(f.id)
          const ditMeta = DIT_META[ditRole]
          /* país destacado: tourGlowLayer pinta o destaque + glow acima;
             aqui fica o fundo neutro (a composição final é idêntica) */
          const fill = thi
            ? '#10151d'
            : wageOn
              ? wageColor(wage)
              : ditActive
                ? `${ditMeta.color}28`
                : glow
                  ? '#2a3547'
                  : blocColor
                    ? `${blocColor}26`
                    : '#151b23'
          const stroke = thi ? 'none' : ditActive ? `${ditMeta.color}77` : glow ? '#8ab4f8' : wageOn ? '#0d1117' : bricsOn ? '#26c6da' : '#262f3b'
          return (
            <path
              key={f.id}
              d={f.d}
              data-iso={f.id}
              data-name={f.name}
              data-wage={wageOn && wage !== undefined ? wage : undefined}
              className="country-path transition-[stroke] duration-150"
              style={{
                fill,
                stroke,
                strokeWidth: glow ? 1.1 : bricsOn ? 0.9 : wageOn ? 0.4 : ditActive ? 0.8 : 0.5,
              }}
            >
              <title>{`${f.name}${ditActive ? ` · ${ditMeta.label[lang === 'en' ? 1 : lang === 'es' ? 2 : 0]}` : ''}${wageOn && wage !== undefined ? ` · ${copy.wageAvg} ≈ US$ ${wage}/${copy.month} (${wageBucketLabelForLang(wage, lang)})` : ''}${thi ? ` · ${copy.routePath}` : glow ? ` · ${copy.regionalRoute}` : bloc ? ` · ${copy.blocAnatomy}` : ''}`}</title>
            </path>
          )
        })}
      </g>
    ),
    [visibleLayers.brics, detailOn, showWages, tourHi, lang, ditActive],
  )

  /* ── fluxos: camada BASE memoizada (NÃO depende de hover — passar o mouse
     não reconcilia os ~49 fluxos; o hover vira um overlay por cima) ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const flowsLayer = useMemo(
    () => (
      <g>
        {FLOWS.map((fl) => {
          if (!visibleLayers[fl.type]) return null
          /* rotas regionais (detail) ficam ocultas sem zoom — EXCETO quando
             selecionadas ou acesas por um conflito/tour: o destaque sempre
             aparece (o tour pode selecioná-las em visão mundial) */
          const isEmph = selFlow === fl.id || active?.highlight.includes(fl.id) === true
          if (fl.tier === 'detail' && !detailOn && !isEmph) return null
          const st = TYPE_STYLE[fl.type]
          const geo = FLOW_GEO[fl.id]
          const { from, to, d } = geo
          const isSel = selFlow === fl.id
          const conflictBoost = active?.highlight.includes(fl.id) ?? false
          const opacity = selFlow ? (isSel ? 1 : 0.05) : active ? (conflictBoost ? 1 : 0.08) : 1
          const emphasized = isSel || conflictBoost
          /* vectorEffect=non-scaling-stroke: largura em px de tela, sem /zoomTier */
          const baseW = 1 + (fl.peso - 1) * 1.5
          return (
            <g key={fl.id} style={{ transition: 'opacity .35s' }} opacity={opacity}>
              {isSel && (
                <g pointerEvents="none" style={{ filter: isInteracting ? undefined : `drop-shadow(0 0 10px ${st.color})` }}>
                  <path d={d} fill="none" stroke={st.color} strokeWidth={baseW * 5.5}
                    opacity="0.42" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path d={d} fill="none" stroke="#ffffff" strokeWidth={baseW * 1.1}
                    opacity="0.65" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </g>
              )}
              <path d={d} fill="none" stroke={st.color}
                strokeWidth={isSel ? baseW * 4.2 : emphasized ? baseW * 1.9 : baseW}
                strokeDasharray={st.dash || undefined}
                opacity={emphasized ? 1 : 0.62}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pointerEvents: 'none' }} />
              {/* partículas: toque ganha 1 por rota (selecionada 3); desktop inalterado */}
              {(isSel ? [0, 1, 2] : COARSE ? [0] : fl.peso >= 2.5 ? [0, 1, 2] : [0, 1]).map((i) => (
                <circle key={i} r={(isSel ? 5 : emphasized ? 3.2 : 2.2) / zoomTier} fill={st.color} style={{ pointerEvents: 'none' }}>
                  <animateMotion dur={`${fl.dur / (isSel ? 3.2 : 1)}s`} repeatCount="indefinite"
                    begin={`-${(fl.dur * i) / 3}s`} path={d} />
                </circle>
              ))}
              {/* hit-area invisível p/ clique/hover (card ancora no enter — sem re-render por movimento) */}
              <path d={d} fill="none" stroke="transparent" strokeWidth="18" vectorEffect="non-scaling-stroke"
                style={{ cursor: 'pointer' }}
                onClick={() => { if (!movedRef.current) setSelFlow(isSel ? null : fl.id) }}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'touch') return // no toque, o clique abre os detalhes
                  setHoverFlow(fl.id)
                  const r = containerRef.current?.getBoundingClientRect()
                  if (r) setFlowTip({ x: e.clientX - r.left, y: e.clientY - r.top, id: fl.id })
                }}
                onPointerLeave={() => {
                  setHoverFlow((h) => (h === fl.id ? null : h))
                  setFlowTip((t) => (t?.id === fl.id ? null : t))
                }}
              />
              {/* endpoints destacados no fluxo selecionado */}
              {isSel && (
                <g pointerEvents="none">
                  <circle cx={from[0]} cy={from[1]} r={7.5 / zoomTier} fill={st.color} stroke="#0d1117" strokeWidth={1.4 / zoomTier} />
                  <circle cx={to[0]} cy={to[1]} r={6 / zoomTier} fill="none" stroke={st.color} strokeWidth={1.6 / zoomTier}>
                    <animate attributeName="r" values={`${5 / zoomTier};${10 / zoomTier};${5 / zoomTier}`} dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </g>
          )
        })}
      </g>
    ),
    [visibleLayers, selFlow, active, zoomTier, detailOn, isInteracting],
  )

  /* ── overlay de destaque do fluxo em hover (só 1 caminho; não toca na base) ── */
  const flowHoverLayer = useMemo(() => {
    if (!hoverFlow || selFlow === hoverFlow) return null
    const fl = FLOWS.find((f) => f.id === hoverFlow)
    if (!fl || !visibleLayers[fl.type]) return null
    if (fl.tier === 'detail' && !detailOn) return null
    const st = TYPE_STYLE[fl.type]
    const { d } = FLOW_GEO[fl.id]
    const baseW = 1 + (fl.peso - 1) * 1.5
    return (
      <g pointerEvents="none" style={{ filter: isInteracting ? undefined : `drop-shadow(0 0 8px ${st.color})` }}>
        <path d={d} fill="none" stroke="#ffffff" strokeWidth={baseW * 1.1} opacity="0.5"
          strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke={st.color} strokeWidth={baseW * 1.9} opacity="1"
          strokeDasharray={st.dash || undefined} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </g>
    )
  }, [hoverFlow, selFlow, visibleLayers, detailOn, isInteracting])

  /* ── arcos de conflito: memoizados ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const conflictLayer = useMemo(
    () => (
      <g>
        {active && active.arcs.map((arc, i) => {
          const d = arcPath(arc.from, arc.to, arc.bend)
          const mid = quadPoint(d, 0.5)
          return (
            <g key={active.id + i}>
              <path d={d} fill="none" stroke={active.color} strokeWidth="2.4" vectorEffect="non-scaling-stroke"
                strokeDasharray={arc.blocked ? '2 7' : '6 5'} strokeLinecap="round"
                className={arc.blocked ? '' : 'flow-line'} markerEnd={arc.blocked ? undefined : 'url(#arrRed)'} />
              {!arc.blocked &&
                [...Array(3)].map((_, j) => (
                  <circle key={j} r={3 / zoomTier} fill={active.color}>
                    <animateMotion dur="4.5s" repeatCount="indefinite" begin={`-${j * 1.5}s`} path={d} />
                  </circle>
                ))}
              {arc.blocked && (
                <g transform={`translate(${mid[0]} ${mid[1]}) scale(${1 / zoomTier})`}>
                  <circle r="13" fill="#f4433622" stroke="#ef5350" strokeWidth="1.5" />
                  <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-red-400">✕</text>
                </g>
              )}
            </g>
          )
        })}
      </g>
    ),
    [active, zoomTier],
  )

  /* ── MODO BRASIL: contornos IBGE + fluxo interno + estados (memoizado) ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const brazilLayer = useMemo(
    () => (
      <g>
        {statesOn && (
          <>
            {showInternal &&
              INTERNAL_FLOWS.map((f) => {
                const a = project(f.deLL)
                const b = project(f.paraLL)
                const d = arcPath(a, b, 0.25)
                const mid = quadPoint(d, 0.5)
                const internalCopy = lang === 'pt' ? [f.rotulo, f.valor] : (BR_MAP_I18N[lang].internal[f.id] ?? [f.rotulo, f.valor])
                return (
                  <g key={f.id} style={{ pointerEvents: 'none' }}>
                    <path d={d} fill="none" stroke={f.color} strokeWidth={2.4 / zoomTier}
                      strokeDasharray="6 4" className="flow-line" opacity="0.95" vectorEffect="non-scaling-stroke" />
                    <text x={mid[0]} y={mid[1] - 8 / zoomTier} textAnchor="middle" fontSize={10 / zoomTier}
                      fontWeight="700" fill={f.color} className="font-mono"
                      style={{ paintOrder: 'stroke', stroke: '#0d1117', strokeWidth: 3.5 / zoomTier, strokeLinejoin: 'round' }}>
                      {internalCopy[0]} · {internalCopy[1]}
                    </text>
                  </g>
                )
              })}

            {brGeo ? (
              brGeo.map((g) => (
                <path key={g.code} d={g.d} fill="#4caf5008" stroke="#4caf50"
                  strokeWidth={0.7 / zoomTier} vectorEffect="non-scaling-stroke" opacity="0.55"
                  style={{ pointerEvents: 'none' }} />
              ))
            ) : (
              <text x={MAP_W / 2} y={40 / zoomTier} textAnchor="middle" fontSize={11 / zoomTier}
                className="fill-zinc-500 font-mono" style={{ pointerEvents: 'none' }}>
                {copy.loadingStates}
              </text>
            )}

            {BR_STATES.filter((st) => st.expBi >= 4 && st.dest !== 'mundo').map((st) => {
              const from: [number, number] = [st.lng, st.lat]
              const to = st.dest === 'CHN' ? A.china : st.dest === 'EUA' ? A.usa : A.eu
              const d = arcPath(from, to, 0.16)
              return (
                <path key={`sfl-${st.code}`} d={d} fill="none" stroke="#4caf50"
                  strokeWidth={1.2 / zoomTier} strokeDasharray="3 4" opacity="0.5"
                  vectorEffect="non-scaling-stroke" style={{ pointerEvents: 'none' }} />
              )
            })}

            {BR_STATES.map((st) => {
              const [x, y] = project([st.lng, st.lat])
              const meta = STATE_CAT_META[st.cat]
              const r = (3.5 + Math.sqrt(st.expBi) * 1.7) / zoomTier
              const sel = selFlow === `st-${st.code}`
              return (
                <g key={st.code} style={{ cursor: 'pointer' }}
                  onClick={() => { if (!movedRef.current) setSelFlow(`st-${st.code}`) }}>
                  <circle cx={x} cy={y} r={r} fill={`${meta.color}66`} stroke={sel ? '#ffffff' : meta.color}
                    strokeWidth={(sel ? 2 : 1) / zoomTier}>
                    <title>{`${st.nome}: US$ ${st.expBi.toLocaleString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR')} ${lang === 'en' ? 'bn' : lang === 'es' ? 'mil M' : 'bi'} (${lang === 'en' ? 'Jan–Jul' : lang === 'es' ? 'ene–jul' : 'jan–jul'} 2025) · ${brFragmentForLang(st.produtos, lang)} — ${copy.click}`}</title>
                  </circle>
                  {st.expBi >= 4 && (
                    <text x={x} y={y - r - 4 / zoomTier} textAnchor="middle" fontSize={9.5 / zoomTier} fontWeight="700"
                      fill={meta.color} className="font-mono pointer-events-none"
                      style={{ paintOrder: 'stroke', stroke: '#0d1117', strokeWidth: 3 / zoomTier, strokeLinejoin: 'round' }}>
                      {st.code} ${st.expBi.toFixed(0)}{lang === 'en' ? 'bn' : lang === 'es' ? 'mil M' : 'bi'}
                    </text>
                  )}
                </g>
              )
            })}
          </>
        )}
      </g>
    ),
    [statesOn, showInternal, brGeo, selFlow, zoomTier, lang],
  )

  /* ── marcadores de mortes corporativas (memoizados) ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deathsLayer = useMemo(
    () => (
      <g>
        {showDeaths &&
          DISASTERS.map((d) => {
            const [x, y] = project(d.lngLat)
            const r = (4 + Math.sqrt(d.mortosNum / 500000) * 8) / zoomTier
            const sel = selDisaster === d.id
            return (
              <g key={d.id} className="cursor-pointer" onClick={() => setSelDisaster(sel ? null : d.id)}>
                <circle cx={x} cy={y} r={r * 2.2} fill="#f44336" opacity="0.12" className="marker-ring"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                <circle cx={x} cy={y} r={r} fill="#f44336" stroke="#0d1117" strokeWidth={1 / zoomTier} />
                <text x={x} y={y - r - 4 / zoomTier} textAnchor="middle" fontSize={9 / zoomTier} fontWeight="700"
                  className="fill-red-300 font-mono" style={{ paintOrder: 'stroke', stroke: '#0d1117', strokeWidth: 3 / zoomTier }}>
                  {d.local.split(',')[0]}
                </text>
                <title>{`${d.local} (${d.ano}) · ${d.empresa} · ${d.mortos} — ${copy.click}`}</title>
              </g>
            )
          })}
      </g>
    ),
    [showDeaths, selDisaster, zoomTier, lang],
  )

  /* ── camada de chokepoints navais e gargalos estratégicos (memoizada) ── */
  const chokepointsLayer = useMemo(() => {
    const chokepointsActive = lens === 'geografia' || overlayMode === 'chokepoints' || overlayMode === 'dit'
    if (!chokepointsActive) return null
    const langIdx = lang === 'en' ? 1 : lang === 'es' ? 2 : 0

    return (
      <g className="chokepoints-layer">
        {GLOBAL_CHOKEPOINTS.map((cp) => {
          const [cx, cy] = project(cp.lngLat)
          const name = cp.nome[langIdx]
          const flow = cp.fluxoGlobal[langIdx]
          const risk = cp.risco[langIdx]
          return (
            <g key={cp.id} transform={`translate(${cx} ${cy})`} className="cursor-pointer">
              <g transform={`scale(${1 / zoomTier})`}>
                <circle r={14} fill="#f59e0b" opacity="0.18" className="marker-ring" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                <path d="M 0 -8 L 8 0 L 0 8 L -8 0 Z" fill="#f59e0b" stroke="#0d1117" strokeWidth="1.5" />
                <text y={-11} textAnchor="middle" fontSize="9" fontWeight="800" fill="#f59e0b" className="font-mono pointer-events-none"
                  style={{ paintOrder: 'stroke', stroke: '#0d1117', strokeWidth: 3, strokeLinejoin: 'round' }}>
                  ◆ {name}
                </text>
              </g>
              <title>{`◆ ${name} · ${flow} · ${risk}`}</title>
            </g>
          )
        })}
      </g>
    )
  }, [lens, overlayMode, zoomTier, lang])

  /* ── marcadores dos blocos (memoizados; escala compensada por zoomTier) ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const markersLayer = useMemo(
    () => (
      <g>
        {BLOCS.map((b) => {
          const [x, y] = project(b.anchor)
          const small = b.tier === 'secondary'
          return (
            <g key={b.id} transform={`translate(${x} ${y})`} className="cursor-pointer" onClick={() => openCountry(b.id)}>
              <g transform={`scale(${1 / zoomTier})`}>
                <circle r={small ? 13 : 19} fill={b.color} opacity="0.1" className="marker-ring"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                <rect
                  x={small ? -15 : -21} y={small ? -8 : -11}
                  width={small ? 30 : 42} height={small ? 16 : 22} rx={small ? 5 : 6}
                  fill="#0d1117ee" stroke={b.color} strokeWidth={small ? 1.2 : 1.4}
                />
                <text y={small ? 3.5 : 4} textAnchor="middle" fontSize={small ? 8.5 : 10.5} fontWeight="800"
                  fill={b.color} className="font-mono pointer-events-none">
                  {b.code}
                </text>
              </g>
              <title>{`${lang === 'en' ? 'Bloc anatomy' : lang === 'es' ? 'Anatomía del bloque' : 'Anatomia do bloco'} ${b.code}`}</title>
            </g>
          )
        })}
      </g>
    ),
    [zoomTier, lang],
  )

  /* ── pausa das animações SMIL quando a aba está oculta ou movimento reduzido ── */
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const apply = () => {
      try {
        if (document.hidden || reducedMotion) svg.pauseAnimations()
        else svg.unpauseAnimations()
      } catch {
        /* SMIL indisponível neste navegador */
      }
    }
    document.addEventListener('visibilitychange', apply)
    apply()
    return () => document.removeEventListener('visibilitychange', apply)
  }, [reducedMotion])

  return (
    <div ref={containerRef}
      className={`map-root ${isInteracting ? 'is-interacting' : ''} relative overflow-hidden border-zinc-800 bg-zinc-900/60 ${
        isFs
          ? 'fixed inset-0 z-[100] flex flex-col items-stretch justify-start rounded-none border-0 bg-black'
          : 'rounded-xl border'
      }`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid meet"
        className={`map-svg select-none ${isFs ? 'w-full flex-1 min-h-0' : 'h-auto w-full'} ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        role="img"
        aria-label={copy.mapAria}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onPointerLeave={() => { endDrag(); setHover(null); setHoverFlow(null); setFlowTip(null) }}
      >
        <defs>
          <marker id="arrRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef5350" />
          </marker>
        </defs>

        <rect width={MAP_W} height={MAP_H} fill="#0d1117" />

        <g
          ref={viewportRef}
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
            transformOrigin: '0 0',
            willChange: isInteracting ? 'transform' : undefined,
          }}
        >
          {/* oceano + grade */}
          <path d={SPHERE_D} fill="#10151d" stroke="#1b2430" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={GRATICULE_D} fill="none" stroke="#141b24" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

          {/* países (camada memoizada) + overlay de destaque do tour */}
          {countriesLayer}
          {tourGlowLayer}

          {/* ── fluxos · conflitos · Brasil · mortes · chokepoints · blocos: TODOS memoizados ── */}
          {flowsLayer}
          {flowHoverLayer}
          {conflictLayer}
          {brazilLayer}
          {deathsLayer}
          {chokepointsLayer}
          {markersLayer}
        </g>
      </svg>

      {/* ── MOBILE: barra de controle inferior (estilo app de mapas) ── */}
      <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex items-stretch gap-1 rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur md:hidden"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
        <button onClick={() => setSheetOpen((s) => !s)} aria-expanded={sheetOpen}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold ${
            sheetOpen ? 'bg-money/15 text-money' : 'text-zinc-300'
          }`}>
          <span className="text-base leading-none">☰</span>{copy.layers}
        </button>
        <button onClick={() => zoomAroundCenter(1.5)} aria-label={copy.zoomIn}
          className="flex flex-1 items-center justify-center rounded-lg text-lg text-zinc-300">＋</button>
        <button onClick={() => zoomAroundCenter(1 / 1.5)} aria-label={copy.zoomOut}
          className="flex flex-1 items-center justify-center rounded-lg text-lg text-zinc-300">－</button>
        <button onClick={() => setView({ k: 1, x: 0, y: 0 })} aria-label={copy.reset}
          className="flex flex-1 items-center justify-center rounded-lg text-base text-zinc-300">⟲</button>
        <button onClick={goBrazil} aria-label={copy.brazil}
          className="flex flex-1 items-center justify-center rounded-lg font-mono text-[11px] font-bold text-emerald-300">BR</button>
        <button onClick={startTour}
          aria-label={copy.startTour}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold text-emerald-300">
          <span className="text-base leading-none">▶</span>Tour
        </button>
        <button onClick={toggleFullscreen} aria-label={isFs ? copy.exitFullscreen : copy.fullscreen}
          className="flex flex-1 items-center justify-center rounded-lg text-base text-zinc-300">⛶</button>
      </div>

      {/* ── MOBILE: bottom sheet de camadas, legenda e ferramentas ── */}
      {sheetOpen && (
        <div className="thin-scroll absolute inset-x-2.5 bottom-[4.25rem] z-30 max-h-[62%] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur md:hidden"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center justify-between px-1 pb-1.5">
            <span className="text-[9.5px] uppercase tracking-widest text-zinc-500">{copy.layersPanel}</span>
            <button onClick={() => setSheetOpen(false)} aria-label={copy.closeLayers}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400">✕</button>
          </div>

          {(Object.keys(TYPE_STYLE) as FlowType[]).map((flowType) => {
            const st = flowTypeStyleForLang(flowType, lang)
            return <button key={flowType} onClick={() => toggleLayer(flowType)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-xs transition-colors active:bg-zinc-800/80">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: st.color }} />
              <span className={`flex-1 ${visibleLayers[flowType] ? 'text-zinc-200' : 'text-zinc-500 line-through'}`}>{st.label}</span>
              <span className={`font-mono text-[10px] ${visibleLayers[flowType] ? 'text-emerald-300' : 'text-zinc-600'}`}>
                {visibleLayers[flowType] ? 'ON' : 'off'}
              </span>
            </button>
          })}

          <div className="my-1 h-px bg-zinc-800" />

          <button onClick={() => { setShowWages((s) => !s); if (!showWages) setShowDeaths(false) }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-xs active:bg-zinc-800/80">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm bg-gradient-to-r from-red-400 via-amber-400 to-teal-400" />
            <span className={`flex-1 ${showWages ? 'text-zinc-200' : 'text-zinc-500'}`}>🌡 {t(lang, 'salario')}</span>
            <span className={`font-mono text-[10px] ${showWages ? 'text-emerald-300' : 'text-zinc-600'}`}>{showWages ? 'ON' : 'off'}</span>
          </button>
          <button onClick={() => { setShowDeaths((s) => !s); if (!showDeaths) setShowWages(false) }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-xs active:bg-zinc-800/80">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
            <span className={`flex-1 ${showDeaths ? 'text-zinc-200' : 'text-zinc-500'}`}>{t(lang, 'mortes')}</span>
            <span className={`font-mono text-[10px] ${showDeaths ? 'text-emerald-300' : 'text-zinc-600'}`}>{showDeaths ? 'ON' : 'off'}</span>
          </button>
          <button onClick={() => {
            const next = overlayMode === 'dit' ? 'padrao' : 'dit'
            setSharedMap({ overlayMode: next })
          }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-xs active:bg-zinc-800/80">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm bg-amber-400" />
            <span className={`flex-1 ${lens === 'geografia' || overlayMode === 'dit' ? 'text-zinc-200 font-bold' : 'text-zinc-500'}`}>🌐 DIT / Chokepoints</span>
            <span className={`font-mono text-[10px] ${lens === 'geografia' || overlayMode === 'dit' ? 'text-emerald-300' : 'text-zinc-600'}`}>{lens === 'geografia' || overlayMode === 'dit' ? 'ON' : 'off'}</span>
          </button>
          <button onClick={() => { handleGoTo3D(); setSheetOpen(false) }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-xs active:bg-zinc-800/80">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" />
            <span className="flex-1 text-zinc-200">🌐 {lang === 'en' ? '3D Globe' : 'Globo 3D'}</span>
          </button>
          <button onClick={() => { setShowFlowList((s) => !s); setSheetOpen(false) }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-xs active:bg-zinc-800/80">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm border border-zinc-500" />
            <span className="flex-1 text-zinc-200">☰ {t(lang, 'fluxos')} ({FLOWS.length})</span>
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href).catch(() => {}) }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-xs active:bg-zinc-800/80">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm border border-zinc-500" />
            <span className="flex-1 text-zinc-200">🔗 {t(lang, 'copiar')}</span>
          </button>

          <div className="my-1 h-px bg-zinc-800" />
          <div className="px-2 pb-1 pt-0.5 text-[9px] uppercase tracking-widest text-zinc-600">{copy.legend}</div>
          {(Object.keys(TYPE_STYLE) as FlowType[]).map((flowType) => {
            const st = flowTypeStyleForLang(flowType, lang)
            return <div key={flowType} className="flex items-center gap-2.5 px-2 py-1 text-[10.5px] text-zinc-400">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: st.color }} />
              {st.label}
            </div>
          })}
        </div>
      )}

      {/* rótulo flutuante do país sob o cursor (suprimido durante hover de fluxo ou tour) */}
      {hover && !hoverFlow && tourStep === null && (
        <div
          className="pointer-events-none absolute z-30 -translate-y-full rounded-md border border-zinc-700 bg-zinc-900/95 px-2 py-1 shadow-xl"
          style={{ left: hover.x + 10, top: hover.y - 6 }}
        >
          <span className="text-[11px] font-semibold text-zinc-100">{hover.name}</span>{' '}
          {hover.wageUsd !== undefined && (
            <span className="mr-1 font-mono text-[9px] text-sky-300">≈ US$ {hover.wageUsd}/{copy.month} ·</span>
          )}
          {ISO_TO_BLOC[hover.iso] ? (
            <span className="ml-1 font-mono text-[9px] text-money">{copy.clickBloc}</span>
          ) : (
            <span className="ml-1 font-mono text-[9px] text-zinc-500">ISO {hover.iso}</span>
          )}
        </div>
      )}

      {/* card flutuante do fluxo em hover (segue o cursor) */}
      {flowTip && hoverFlow === flowTip.id && !selFlow &&
        (() => {
          const fl = localizedFlows.find((f) => f.id === flowTip.id)
          if (!fl) return null
          const st = flowTypeStyleForLang(fl.type, lang)
          const fc = BLOCS.find((b) => b.id === fl.from)
          const tc = BLOCS.find((b) => b.id === fl.to)
          const flip = flowTip.x > (containerRef.current?.clientWidth ?? 800) - 300
          return (
            <div
              className={`pointer-events-none absolute z-30 w-64 -translate-y-full rounded-xl border bg-zinc-900/95 p-3 shadow-2xl backdrop-blur ${
                flip ? '-translate-x-full' : ''
              }`}
              style={{ left: flowTip.x + (flip ? -12 : 12), top: flowTip.y - 10, borderColor: `${st.color}66` }}
            >
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                {fc && <span style={{ color: fc.color }}>{fc.code}</span>}
                <span className="text-zinc-600">──▶</span>
                {tc && <span style={{ color: tc.color }}>{tc.code}</span>}
                <span className="ml-auto rounded px-1.5 py-0.5" style={{ background: `${st.color}22`, color: st.color }}>
                  {st.label.split('(')[0].trim()}
                </span>
              </div>
              <div className="mt-1.5 text-xs font-bold leading-snug text-zinc-100">{fl.titulo}</div>
              <div className="mt-1.5 flex items-baseline justify-between gap-2">
                <span className="font-mono text-sm font-extrabold" style={{ color: st.color }}>{fl.totalAnual}</span>
                <span className="shrink-0 text-[9.5px] text-zinc-500">{copy.clickDetails}</span>
              </div>
            </div>
          )
        })()}

      {/* camadas + ferramentas (PAINEL DE DESKTOP) */}
      <div className="absolute left-2.5 top-2.5 z-20 hidden flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-900/85 p-1.5 backdrop-blur md:flex">
        {(Object.keys(TYPE_STYLE) as FlowType[]).map((flowType) => {
          const st = flowTypeStyleForLang(flowType, lang)
          return <button key={flowType} onClick={() => toggleLayer(flowType)}
            className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] transition-opacity ${
              visibleLayers[flowType] ? 'opacity-100' : 'opacity-40'
            } hover:bg-zinc-800/80`}>
            <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: st.color }} />
            <span className="hidden text-zinc-300 sm:inline">{st.label}</span>
          </button>
        })}
        <div className="my-0.5 h-px bg-zinc-800" />
        <button onClick={() => { setShowWages((s) => !s); if (!showWages) setShowDeaths(false) }}
          className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] transition-opacity ${
            showWages ? 'opacity-100' : 'opacity-40'
          } hover:bg-zinc-800/80`}>
          <span className="inline-block h-2 w-2 shrink-0 rounded-sm bg-gradient-to-r from-red-400 via-amber-400 to-teal-400" />
          <span className="hidden text-zinc-300 sm:inline">🌡 {t(lang, 'salario')}</span>
        </button>
        <button onClick={() => { setShowDeaths((s) => !s); if (!showDeaths) setShowWages(false) }}
          className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] transition-opacity ${
            showDeaths ? 'opacity-100' : 'opacity-40'
          } hover:bg-zinc-800/80`}>
          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
          <span className="hidden text-zinc-300 sm:inline">{t(lang, 'mortes')}</span>
        </button>
        <button onClick={() => {
          const next = overlayMode === 'dit' ? 'padrao' : 'dit'
          setSharedMap({ overlayMode: next })
        }}
          className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] transition-opacity ${
            lens === 'geografia' || overlayMode === 'dit' ? 'opacity-100 font-bold text-amber-300' : 'opacity-40'
          } hover:bg-zinc-800/80`}>
          <span className="inline-block h-2 w-2 shrink-0 rounded-sm bg-amber-400" />
          <span className="hidden text-zinc-300 sm:inline">🌐 DIT / Chokepoints</span>
        </button>
        <button onClick={handleGoTo3D}
          className="rounded-md border border-sky-500/50 px-1.5 py-1 text-left text-[10px] font-semibold text-sky-300 hover:bg-sky-500/10">
          🌐 3D {lang === 'en' ? 'Globe' : 'Globo'}
        </button>
        <button onClick={startTour}
          className="mt-0.5 rounded-md border border-emerald-500/50 px-1.5 py-1 text-left text-[10px] font-semibold text-emerald-300 hover:bg-emerald-500/10">
          ▶ {t(lang, 'tour')}
        </button>
        <button onClick={() => setShowFlowList((s) => !s)}
          className={`rounded-md border px-1.5 py-1 text-left text-[10px] font-semibold transition-colors ${
            showFlowList ? 'border-money/60 text-money' : 'border-zinc-700 text-zinc-300 hover:border-money/60 hover:text-money'
          }`}>
          ☰ {t(lang, 'fluxos')} ({FLOWS.length})
        </button>
        <button onClick={() => { navigator.clipboard?.writeText(window.location.href).catch(() => {}) }}
          title={copy.copyTitle}
          className="rounded-md border border-zinc-700 px-1.5 py-1 text-left text-[10px] font-semibold text-zinc-300 transition-colors hover:border-money/60 hover:text-money">
          🔗 {t(lang, 'copiar')}
        </button>
      </div>

      {/* lista de fluxos (roteiro de análise) — desktop: canto sup. direito · mobile: sheet sobre a barra */}
      {showFlowList && (
        <div className="thin-scroll absolute right-12 top-2.5 z-30 max-h-[78%] w-72 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur max-md:inset-x-2.5 max-md:bottom-[4.25rem] max-md:left-2.5 max-md:top-auto max-md:w-auto max-md:max-h-[58%]">
          <div className="px-1 pb-1.5 text-[9.5px] uppercase tracking-widest text-zinc-500">
            {copy.flowList}
          </div>
          {(Object.keys(TYPE_STYLE) as FlowType[]).map((flowType) => {
            const items = localizedFlows.filter((f) => f.type === flowType)
            if (!items.length) return null
            const st = flowTypeStyleForLang(flowType, lang)
            return (
              <div key={flowType} className="mb-2">
                <div className="px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: st.color }}>
                  {st.label}
                </div>
                {items.map((f) => {
                  const { mid, fromCode: fc, toCode: tc } = FLOW_GEO[f.id]
                  return (
                    <button key={f.id}
                      onClick={() => { setSelFlow(f.id); flyTo(mid[0], mid[1], f.tier === 'detail' ? 3.2 : 2.4); setShowFlowList(false) }}
                      className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left hover:bg-zinc-800/80 ${
                        selFlow === f.id ? 'bg-zinc-800' : ''
                      }`}>
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: flowTypeStyleForLang(f.type, lang).color }} />
                      <span className="w-[74px] shrink-0 font-mono text-[9px] text-zinc-500">{fc}→{tc}</span>
                      <span className="min-w-0 flex-1 truncate text-[10.5px] text-zinc-300">{f.titulo}</span>
                      {f.tier === 'detail' && <span className="shrink-0 rounded bg-zinc-800 px-1 font-mono text-[8px] text-zinc-500">zoom</span>}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* aviso do modo detalhado */}
      {view.k >= 2 && (
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-sky-400/40 bg-zinc-900/90 px-3 py-1 text-[10px] font-semibold text-sky-300 backdrop-blur max-md:px-2 max-md:py-0.5 max-md:text-[9px]">
          {copy.detailMode}: +{FLOWS.filter((f) => f.tier === 'detail').length} {copy.regionalVisible}
        </div>
      )}

      <ZoomButtons onZoom={zoomAroundCenter} onReset={() => setView({ k: 1, x: 0, y: 0 })} onBrazil={goBrazil} onFullscreen={toggleFullscreen} isFs={isFs} lang={lang} />

      {/* card "país sem dados" */}
      {selectedInfo && !hover && (
        <div className="absolute bottom-12 left-2.5 z-20 max-w-[240px] rounded-lg border border-dashed border-zinc-600 bg-zinc-900/95 p-3 max-md:bottom-[4.5rem]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold text-zinc-100">{selectedInfo.name}</span>
            <button className="text-[10px] text-zinc-500 hover:text-zinc-200" onClick={() => setSelectedInfo(null)}>✕</button>
          </div>
          <p className="mt-1 text-[10.5px] leading-snug text-zinc-400">
            {copy.noData}{' '}
            <code className="rounded bg-zinc-800 px-1 font-mono text-[10px]">{selectedInfo.iso}</code> {copy.noDataJoin}{' '}
            <code className="font-mono text-[10px]">BLOC_MEMBERS</code> {copy.noDataEntry}{' '}
            <code className="font-mono text-[10px]">countries.ts</code>.
          </p>
        </div>
      )}

      {/* legenda salarial (heatmap ativo) */}
      {showWages && (
        <div className="absolute bottom-2.5 right-2.5 z-20 rounded-lg border border-zinc-800 bg-zinc-900/90 p-2 backdrop-blur max-md:bottom-[4.5rem]">
          <div className="mb-1 text-[9px] uppercase tracking-widest text-zinc-500">{copy.wageLegend}</div>
          <div className="h-3 w-48 rounded-full"
            style={{ background: 'linear-gradient(to right, #f44336, #ff8a65, #ffc107, #42a5f5, #26a69a)' }} />
          <div className="mt-0.5 flex justify-between font-mono text-[8.5px] text-zinc-500">
            <span>&lt;300</span><span>700</span><span>1,5k</span><span>3k+</span>
          </div>
        </div>
      )}

      {/* card do desastre selecionado */}
      {selDisaster && (() => {
        const d = DISASTERS.find((x) => x.id === selDisaster)!
        return (
          <div className="absolute bottom-12 left-2.5 z-20 max-w-[300px] rounded-xl border border-red-500/60 bg-zinc-900/95 p-3.5 shadow-2xl max-md:bottom-[4.5rem]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-mono text-[9.5px] uppercase tracking-widest text-red-400">{d.ano} · {d.local}</div>
                <div className="text-xs font-bold text-zinc-100">{d.empresa}</div>
              </div>
              <button className="text-[10px] text-zinc-500 hover:text-zinc-200" onClick={() => setSelDisaster(null)}>✕</button>
            </div>
            <div className="mt-1.5 font-mono text-sm font-extrabold text-red-400">{d.mortos}</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-300">
              {textoPorModo(mode, d.did, d.adv)}
            </p>
          </div>
        )
      })()}

      {/* tour guiado — MESMAS paradas do 3D; apresentação segue o modo (simples/completa) */}
      {tourStep !== null && (() => {
        const tour = activeTour
        const s = STOPS[tourStep]
        if (!s) return null
        const setMode = useApp.getState().setMode
        const A = tour.accent
        return (
          <div id="tour-spotlight-target" className="absolute bottom-14 left-1/2 z-30 w-[min(94%,620px)] -translate-x-1/2 rounded-xl border bg-zinc-900/95 p-4 shadow-2xl backdrop-blur max-md:bottom-[5rem] max-md:p-3"
            style={{ borderColor: `${A}88`, boxShadow: `0 0 28px ${A}22, 0 18px 50px rgba(0,0,0,.55)` }}>
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
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => startDriverTour(tourStep)}
                  title={lang === 'pt' ? 'Ativar modo Spotlight acessível (Driver.js)' : 'Activate accessible Spotlight mode (Driver.js)'}
                  className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 hover:bg-amber-500/20 max-md:px-2.5 max-md:py-1.5"
                >
                  🔦
                </button>
                <button onClick={() => setTourStep(tourStep > 0 ? tourStep - 1 : null)}
                  className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2 max-md:text-xs">←</button>
                <button onClick={() => setTourStep(tourStep < STOPS.length - 1 ? tourStep + 1 : null)}
                  className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2 max-md:text-xs">→</button>
                <button onClick={endTour} aria-label={copy.endTour}
                  className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2 max-md:text-xs">✕</button>
              </div>
            </div>
            {mode !== 'avancado' ? (
              <>
                <p className="mt-2 text-xs leading-relaxed text-zinc-200">{textoPorModo(mode, s.did, s.adv, s.simples)}</p>
                <div className="mt-2.5 grid grid-cols-3 gap-1.5 max-md:grid-cols-3">
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
              <div className="flex max-w-[60%] flex-wrap items-center gap-1 overflow-hidden">
                {STOPS.map((st, i) => (
                  <button key={st.id} onClick={() => setTourStep(i)} title={st.titulo} aria-label={`${copy.goStep} ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === tourStep ? 'w-5' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'} max-md:h-2.5 max-md:w-3`}
                    style={i === tourStep ? { background: A } : undefined} />
                ))}
              </div>
              <div className="flex gap-1">
                <button onClick={() => setTourStep(tourStep > 0 ? tourStep - 1 : null)}
                  className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2 max-md:text-xs">←</button>
                <button onClick={() => (tourStep < STOPS.length - 1 ? setTourStep(tourStep + 1) : endTour())}
                  className="rounded border px-2 py-0.5 text-[10px] font-bold hover:bg-white/5 max-md:px-4 max-md:py-2 max-md:text-xs"
                  style={{ borderColor: `${A}99`, color: A }}>
                  {tourStep < STOPS.length - 1 ? copy.next : copy.finish}
                </button>
              </div>
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

      {/* legenda + conflitos rápidos (desktop; no mobile a legenda vive no sheet) */}
      <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-800 px-4 py-2.5 md:flex">
        {(Object.keys(TYPE_STYLE) as FlowType[]).map((t) => (
          <span key={t} className={`inline-flex items-center gap-1.5 text-[10.5px] ${visibleLayers[t] ? 'text-zinc-400' : 'text-zinc-600 line-through'}`}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: TYPE_STYLE[t].color }} />
            {flowTypeStyleForLang(t, lang).label}
          </span>
        ))}
        <span className="ml-auto hidden text-[10px] text-zinc-600 md:inline">
          {copy.footerHint}
        </span>
      </div>

      {/* botão do fluxo interno (só no modo Brasil) */}
      {statesOn && (
        <button
          onClick={() => setShowInternal((s) => !s)}
          className={`absolute bottom-2.5 left-2.5 z-20 rounded-lg border px-3 py-1.5 text-[11px] font-semibold backdrop-blur transition-colors max-md:bottom-[4.5rem] ${
            showInternal
              ? 'border-sky-400/70 bg-sky-400/15 text-sky-300'
              : 'border-zinc-700 bg-zinc-900/90 text-zinc-300 hover:border-sky-400/60 hover:text-sky-300'
          }`}
        >
          {showInternal ? copy.internalOn : copy.internalOff}
        </button>
      )}

      {/* card do fluxo selecionado (como no 3D; no tour, o card do tour já basta) */}
      {tourStep === null && (
        <FlowCard flow={selFlowObj} onClose={() => setSelFlow(null)} />
      )}
    </div>
  )
}



/** Seletor de guerras de blocos (atalhos do Módulo 03 dentro do mapa). */
export function ConflictSelector() {
  const conflict = useApp((s) => s.conflict)
  const setConflict = useApp((s) => s.setConflict)
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const conflicts = useMemo(() => conflictsForLang(lang), [lang])
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
        <div className="rounded-lg border p-3 text-xs leading-relaxed" style={{ borderColor: active.color + '55', background: active.color + '0d' }}>
          <div className="font-semibold" style={{ color: active.color }}>{active.title}</div>
          <p className="mt-1 text-zinc-300">{textoPorModo(mode, active.didatico, active.avancado)}</p>
        </div>
      )}
    </div>
  )
}
