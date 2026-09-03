import { create } from 'zustand'
import type { FractionKey } from '../data/countries'

export type TabId = 'home' | 'globe3d' | 'circuit' | 'war' | 'debt' | 'companies' | 'platform' | 'wealth' | 'consequences' | 'alternatives'
export type PriceBasis = 'nominal' | 'ppp'
export type UIMode = 'didatico' | 'avancado'
export type ConflictId = 'semis' | 'energia' | 'reprimaria' | null

interface AppState {
  tab: TabId
  setTab: (t: TabId) => void

  /** Dual-Mode global: didático (padrão) vs avançado marxista-contábil */
  mode: UIMode
  setMode: (m: UIMode) => void

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

  /** Modo apresentação (fonte ampliada para projeção em sala) */
  presentation: boolean
  setPresentation: (on: boolean) => void

  /** Idioma do chrome da UI (conteúdo dos módulos em PT-BR) */
  lang: 'pt' | 'en' | 'es'
  setLang: (l: 'pt' | 'en' | 'es') => void
}

export const useApp = create<AppState>((set) => ({
  tab: 'home',
  setTab: (tab) => set({ tab }),

  mode: 'didatico',
  setMode: (mode) => set({ mode }),

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

  lang: 'pt',
  setLang: (lang) => set({ lang }),
}))
