import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FractionKey } from '../data/countries'
import { TABS, type TabId } from '../data/modules'

/* TabId mora em data/modules.ts (registro canônico); reexportado aqui para
   manter `import { type TabId } from '../store/useApp'` funcionando. */
export type { TabId }
export type PriceBasis = 'nominal' | 'ppp'
export type UIMode = 'didatico' | 'avancado'
export type ConflictId = 'semis' | 'energia' | 'reprimaria' | null

/** Chaves do intervalo dos sliders (espelham ControlsPanel.tsx). */
const K_MIN = 0.5
const K_MAX = 14
const E_MIN = 0.5
const E_MAX = 5

const FRACTION_KEYS: FractionKey[] = ['produtivo', 'financeiro', 'comercial', 'ficticio', 'estatal']
const LANGS = ['pt', 'en', 'es'] as const
type Lang = (typeof LANGS)[number]

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
  lang: Lang
  setLang: (l: Lang) => void
}

/**
 * ?t=<aba> na URL restaura a aba (links compartilháveis; o mapa 2D escreve t=).
 * A URL tem prioridade sobre o estado salvo: um link explícito deve abrir
 * exatamente onde aponta, mesmo que o usuário tenha outra aba salva.
 */
function initialTab(): TabId {
  if (typeof window === 'undefined') return 'home'
  const t = new URLSearchParams(window.location.search).get('t')
  return (TABS as string[]).includes(t ?? '') ? (t as TabId) : 'home'
}

/* ── Validadores do rehydrate ──────────────────────────────────────────────
 * O localStorage é do usuário e pode estar corrompido, editado à mão ou
 * vindo de uma versão anterior do app com outro shape. Nada disso pode
 * quebrar o render nem-travar um slider fora do intervalo: o valor é
 * conferido e cai no default quando não bate. */

const num = (v: unknown, min: number, max: number, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback

const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback)

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(v as string) ? (v as T) : fallback

const fractions = (v: unknown): FractionKey[] =>
  Array.isArray(v) ? (v.filter((f) => FRACTION_KEYS.includes(f as FractionKey)) as FractionKey[]) : []

/* Só preferências persistem. `tab`, `countryId` e `glossaryOpen` são
 * deliberadamente EXCLUÍDAS: são posição na sessão, não preferência. A aba
 * continua vindo de ?t= na URL. */
interface PersistedState {
  mode: UIMode
  k: number
  e: number
  basis: PriceBasis
  hiddenFractions: FractionKey[]
  presentation: boolean
  lang: Lang
}

function sanitize(persisted: unknown): Partial<PersistedState> {
  const p = (persisted ?? {}) as Partial<Record<keyof PersistedState, unknown>>
  return {
    mode: oneOf(p.mode, ['didatico', 'avancado'] as const, 'didatico'),
    k: num(p.k, K_MIN, K_MAX, 4),
    e: num(p.e, E_MIN, E_MAX, 1.5),
    basis: oneOf(p.basis, ['nominal', 'ppp'] as const, 'nominal'),
    hiddenFractions: fractions(p.hiddenFractions),
    presentation: bool(p.presentation, false),
    lang: oneOf(p.lang, LANGS, 'pt'),
  }
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      /* ?t=<aba> na URL restaura a aba */
      tab: initialTab(),
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
    }),
    {
      name: 'cb.app.v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      /* parteialize: só preferências (ver comentário acima) */
      partialize: (s) => ({
        mode: s.mode,
        k: s.k,
        e: s.e,
        basis: s.basis,
        hiddenFractions: s.hiddenFractions,
        presentation: s.presentation,
        lang: s.lang,
      }),
      /* rehydrate: valida antes de aplicar no estado */
      merge: (persisted, current) => ({ ...current, ...sanitize(persisted) }),
    },
  ),
)
