import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FractionKey } from '../data/countries'
import { TABS, type TabId } from '../data/modules'

export type { TabId }
export type PriceBasis = 'nominal' | 'ppp'
export type UIMode = 'simples' | 'didatico' | 'avancado'
export type DisciplineLens = 'geral' | 'geografia' | 'historia' | 'economia'
export type MapOverlayMode = 'padrao' | 'dit' | 'chokepoints'
export type Theme = 'dark' | 'light'
export type ConflictId = 'semis' | 'energia' | 'reprimaria' | null
export type MapRenderer = 'svg' | 'gpu'
const RENDERERS = ['svg', 'gpu'] as const

/** Estado de sessão compartilhado entre MapWorld (2D) e GlobeModule (3D) */
export interface SharedMapSession {
  lng: number
  lat: number
  k: number
  selFlow: string | null
  activeTourId: string
  tourStep: number | null
  overlayMode: MapOverlayMode
}

const K_MIN = 0.5
const K_MAX = 14
const E_MIN = 0.5
const E_MAX = 5

const FRACTION_KEYS: FractionKey[] = ['produtivo', 'financeiro', 'comercial', 'ficticio', 'estatal']
const LANGS = ['pt', 'en', 'es'] as const
const LENSES = ['geral', 'geografia', 'historia', 'economia'] as const
export type Lang = (typeof LANGS)[number]

interface AppState {
  tab: TabId
  setTab: (t: TabId) => void

  /** Três níveis globais: simples (Fundamental/Médio), didático (padrão) e avançado (universitário/pesquisa). */
  mode: UIMode
  setMode: (m: UIMode) => void

  /** Lente disciplinar ativa: geral, geografia, historia ou economia. */
  lens: DisciplineLens
  setLens: (l: DisciplineLens) => void

  /** Sessão espacial sincronizada entre Mapa 2D e Globo 3D (não persiste no localStorage). */
  sharedMap: SharedMapSession
  setSharedMap: (patch: Partial<SharedMapSession>) => void

  /** Composição orgânica c/v */
  k: number
  /** Taxa de mais-valia m/v */
  e: number
  setK: (k: number) => void
  setE: (e: number) => void

  countryId: string | null
  openCountry: (id: string) => void
  closeCountry: () => void

  basis: PriceBasis
  setBasis: (b: PriceBasis) => void

  hiddenFractions: FractionKey[]
  toggleFraction: (f: FractionKey) => void

  /** Guerra de blocos destacada no mapa */
  conflict: ConflictId
  setConflict: (c: ConflictId) => void

  /** Glossário global */
  glossaryOpen: boolean
  setGlossaryOpen: (open: boolean) => void

  /** Modo apresentação (fonte ampliada + guia pedagógico de sala) */
  presentation: boolean
  setPresentation: (on: boolean) => void

  /** Tema da UI: obsidian (padrão) ou claro */
  theme: Theme
  setTheme: (t: Theme) => void

  /** Modo referências: exibe a fonte junto dos números exibidos */
  showRefs: boolean
  setShowRefs: (on: boolean) => void

  /** Idioma do chrome da UI */
  lang: Lang
  setLang: (l: Lang) => void

  /** Motor de renderização do mapa: svg (leve, backup) ou gpu (Deck.gl WebGL2) */
  mapRenderer: MapRenderer
  setMapRenderer: (r: MapRenderer) => void
}

function urlParams(): URLSearchParams | null {
  return typeof window === 'undefined' ? null : new URLSearchParams(window.location.search)
}

function initialTab(): TabId {
  const t = urlParams()?.get('t')
  return (TABS as string[]).includes(t ?? '') ? (t as TabId) : 'home'
}

function initialModeFromUrl(): UIMode | null {
  const m = urlParams()?.get('m')
  return (['simples', 'didatico', 'avancado'] as string[]).includes(m ?? '') ? (m as UIMode) : null
}

function initialLangFromUrl(): Lang | null {
  const l = urlParams()?.get('l')
  return (LANGS as readonly string[]).includes(l ?? '') ? (l as Lang) : null
}

/** Mantém links pedagógicos reproduzíveis sem apagar estado espacial do mapa. */
function syncUrlParam(key: 't' | 'm' | 'l', value: string, defaultValue: string): void {
  if (typeof window === 'undefined') return
  const p = new URLSearchParams(window.location.search)
  if (value === defaultValue) p.delete(key)
  else p.set(key, value)
  const qs = p.toString()
  window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`)
}

const num = (v: unknown, min: number, max: number, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback

const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback)

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(v as string) ? (v as T) : fallback

const fractions = (v: unknown): FractionKey[] =>
  Array.isArray(v) ? (v.filter((f) => FRACTION_KEYS.includes(f as FractionKey)) as FractionKey[]) : []

interface PersistedState {
  mode: UIMode
  lens: DisciplineLens
  k: number
  e: number
  basis: PriceBasis
  hiddenFractions: FractionKey[]
  presentation: boolean
  theme: Theme
  showRefs: boolean
  lang: Lang
  mapRenderer: MapRenderer
}

function sanitize(persisted: unknown): Partial<PersistedState> {
  const p = (persisted ?? {}) as Partial<Record<keyof PersistedState, unknown>>
  return {
    mode: oneOf(p.mode, ['simples', 'didatico', 'avancado'] as const, 'didatico'),
    lens: oneOf(p.lens, LENSES, 'geral'),
    k: num(p.k, K_MIN, K_MAX, 4),
    e: num(p.e, E_MIN, E_MAX, 1.5),
    basis: oneOf(p.basis, ['nominal', 'ppp'] as const, 'nominal'),
    hiddenFractions: fractions(p.hiddenFractions),
    presentation: bool(p.presentation, false),
    theme: oneOf(p.theme, ['dark', 'light'] as const, 'dark'),
    showRefs: bool(p.showRefs, false),
    lang: oneOf(p.lang, LANGS, 'pt'),
    mapRenderer: oneOf(p.mapRenderer, RENDERERS, 'svg'),
  }
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      tab: initialTab(),
      setTab: (tab) => {
        syncUrlParam('t', tab, 'home')
        set({ tab })
      },

      mode: initialModeFromUrl() ?? 'didatico',
      setMode: (mode) => {
        syncUrlParam('m', mode, 'didatico')
        set({ mode })
      },

      lens: 'geral',
      setLens: (lens) => set({ lens }),

      sharedMap: {
        lng: -15,
        lat: 15,
        k: 1,
        selFlow: null,
        activeTourId: 'principal',
        tourStep: null,
        overlayMode: 'padrao',
      },
      setSharedMap: (patch) =>
        set((s) => ({ sharedMap: { ...s.sharedMap, ...patch } })),

      k: 4,
      e: 1.5,
      setK: (k) => set({ k }),
      setE: (e) => set({ e }),

      countryId: null,
      openCountry: (countryId) => set({ countryId }),
      closeCountry: () => set({ countryId: null }),

      basis: 'nominal',
      setBasis: (basis) => set({ basis }),

      hiddenFractions: [],
      toggleFraction: (f) =>
        set((s) => ({
          hiddenFractions: s.hiddenFractions.includes(f)
            ? s.hiddenFractions.filter((x) => x !== f)
            : [...s.hiddenFractions, f],
        })),

      conflict: null,
      setConflict: (conflict) => set({ conflict }),

      glossaryOpen: false,
      setGlossaryOpen: (glossaryOpen) => set({ glossaryOpen }),

      presentation: false,
      setPresentation: (presentation) => set({ presentation }),

      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      showRefs: false,
      setShowRefs: (showRefs) => set({ showRefs }),

      lang: initialLangFromUrl() ?? 'pt',
      setLang: (lang) => {
        syncUrlParam('l', lang, 'pt')
        set({ lang })
      },

      mapRenderer: 'svg',
      setMapRenderer: (mapRenderer) => set({ mapRenderer }),
    }),
    {
      name: 'cb.app.v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        mode: s.mode,
        lens: s.lens,
        k: s.k,
        e: s.e,
        basis: s.basis,
        hiddenFractions: s.hiddenFractions,
        presentation: s.presentation,
        theme: s.theme,
        showRefs: s.showRefs,
        lang: s.lang,
        mapRenderer: s.mapRenderer,
      }),
      merge: (persisted, current) => {
        const restored = sanitize(persisted)
        const urlMode = initialModeFromUrl()
        const urlLang = initialLangFromUrl()
        return {
          ...current,
          ...restored,
          ...(urlMode ? { mode: urlMode } : {}),
          ...(urlLang ? { lang: urlLang } : {}),
        }
      },
    },
  ),
)
