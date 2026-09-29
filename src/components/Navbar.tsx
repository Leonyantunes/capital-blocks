import { Suspense, lazy, useEffect, useState } from 'react'
import { useApp, type TabId, type UIMode } from '../store/useApp'
import { t } from '../i18n'
import { MODULES, MAP_TAB_TOOLTIP, TABS, modTitle } from '../data/modules'

const GlossaryDrawer = lazy(() => import('./GlossaryDrawer'))

/* A lista de abas e a numeração vêm de `data/modules.ts` (registro canônico).
   Aqui só acrescentamos o complemento editorial de cada módulo — o número nunca
   é escrito à mão, vem de `modTitle(id)` (ver TODO P2-24). */
const TITLES: Record<TabId, string> = {
  home: MAP_TAB_TOOLTIP.pt,
  globe3d: MAP_TAB_TOOLTIP.pt,
  circuit: `${modTitle('circuit')} — composição orgânica, exploração e tendência decrescente`,
  war: `${modTitle('war')} — linha do tempo reversa, matriz militar e quem lucra`,
  debt: `${modTitle('debt')} — lente monetária, identidade setorial e simulador kaleckiano`,
  companies: `${modTitle('companies')} — ILAESE + maiores do mundo, decompostos em c·v·m`,
  platform: `${modTitle('platform')} — salário por peça e transferência de capital constante`,
  wealth: `${modTitle('wealth')} — Concentração, bilionários e o que sustenta o quê`,
  consequences: `${modTitle('consequences')} — massacres, territórios e custos deslocados`,
  alternatives: `${modTitle('alternatives')} — cooperativas, orçamento democrático e garantia de emprego`,
  sources: `${modTitle('sources')} — busca, filtros, estado de verificação e links diretos`,
}

/* Abas numeradas na ordem de navegação, derivadas do registro canônico. */
const NAV_TABS = TABS.filter((id) => id !== 'globe3d')

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <rect x="1" y="1" width="11" height="11" rx="2" fill="#ffc107" />
      <rect x="14" y="1" width="11" height="11" rx="2" fill="#4caf50" opacity=".85" />
      <rect x="1" y="14" width="11" height="11" rx="2" fill="#2196f3" opacity=".85" />
      <rect x="14" y="14" width="11" height="11" rx="2" fill="#f44336" opacity=".85" />
    </svg>
  )
}

/** Controles de modo/idioma — reutilizados na barra (desktop) e na gaveta (mobile).
 *  Três níveis de leitura: Simples (3º modo) ⇄ Didático ⇄ Avançado. */
function ModeControls({ stacked = false }: { stacked?: boolean }) {
  const mode = useApp((s) => s.mode)
  const setMode = useApp((s) => s.setMode)
  const presentation = useApp((s) => s.presentation)
  const setPresentation = useApp((s) => s.setPresentation)
  const lang = useApp((s) => s.lang)
  const setLang = useApp((s) => s.setLang)

  const MODOS: { id: UIMode; pt: string }[] = [
    { id: 'simples', pt: 'Simples' },
    { id: 'didatico', pt: 'Didático' },
    { id: 'avancado', pt: 'Avançado' },
  ]

  if (stacked) {
    return (
      <div className="space-y-2.5">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Nível de leitura
          </div>
          <div className="inline-flex w-full items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
            {MODOS.map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)}
                title={m.id === 'simples' ? 'Para quem está começando' : m.id === 'didatico' ? 'Padrão do app' : 'Com fórmulas e categorias'}
                className={`flex-1 rounded-md px-2 py-2 text-[11px] font-semibold transition-colors ${
                  mode === m.id ? 'bg-money text-zinc-950' : 'text-zinc-400'
                }`}>
                {m.pt}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPresentation(!presentation)}
            title={t(lang, 'apresentacao')}
            className={`rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
              presentation ? 'border-sky-400/70 bg-sky-400/15 text-sky-300' : 'border-zinc-800 text-zinc-400'
            }`}>
            Aa
          </button>
          <select value={lang} onChange={(e) => setLang(e.target.value as 'pt' | 'en' | 'es')} aria-label="Idioma da interface"
            className="h-[38px] flex-1 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-xs font-bold text-zinc-400">
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        onClick={() => setPresentation(!presentation)}
        title={t(lang, 'apresentacao')}
        className={`rounded-lg border px-2 py-1.5 text-[11px] font-bold transition-colors ${
          presentation ? 'border-sky-400/70 bg-sky-400/15 text-sky-300' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
        }`}>
        Aa
      </button>
      <select value={lang} onChange={(e) => setLang(e.target.value as 'pt' | 'en' | 'es')} aria-label="Idioma da interface"
        className="h-[30px] cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950 px-1 text-[10px] font-bold text-zinc-400 outline-none hover:text-zinc-200">
        <option value="pt">PT</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
      <div className="inline-flex shrink-0 items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
        {MODOS.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            title={m.id === 'simples' ? 'Para quem está começando: sem fórmula' : m.id === 'didatico' ? 'Padrão do app' : 'Com fórmulas e categorias marxistas'}
            className={`rounded-md px-1.5 py-1 text-[10px] font-semibold transition-colors ${
              mode === m.id ? 'bg-money text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200'
            }`}>
            {m.pt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const tab = useApp((s) => s.tab)
  const setTab = useApp((s) => s.setTab)
  const lang = useApp((s) => s.lang)
  const glossaryOpen = useApp((s) => s.glossaryOpen)
  const setGlossaryOpen = useApp((s) => s.setGlossaryOpen)
  const [glossaryLoaded, setGlossaryLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showName, setShowName] = useState(true)

  useEffect(() => {
    if (glossaryOpen) setGlossaryLoaded(true)
  }, [glossaryOpen])

  /* gaveta mobile: trava o scroll da página e fecha com Esc */
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  /* o nome aparece na entrada, recolhe em animação e volta no hover do logo */
  useEffect(() => {
    const t = setTimeout(() => setShowName(false), 3500)
    return () => clearTimeout(t)
  }, [])

  const go = (id: TabId) => { pressTab(id); setMenuOpen(false) }

  /** "01 Mapa" é um toggle 2D ⇄ 3D: no 2D vai ao 3D, no 3D volta ao 2D. */
  const pressTab = (id: TabId) => {
    if (id === 'home') {
      setTab(tab === 'globe3d' ? 'home' : tab === 'home' ? 'globe3d' : 'home')
      return
    }
    setTab(id)
  }
  const is3D = tab === 'globe3d'

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur"
        style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 md:px-4">
          <button
            onClick={() => setTab('home')}
            onMouseEnter={() => setShowName(true)}
            onMouseLeave={() => setShowName(false)}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Capital Blocks — Início">
            <Logo />
            <span
              className={`hidden overflow-hidden leading-tight transition-all duration-700 ease-out sm:block ${
                showName ? 'max-w-[240px] opacity-100' : 'max-w-0 opacity-0'
              } group-hover:max-w-[240px] group-hover:opacity-100`}>
              <span className="block whitespace-nowrap text-sm font-extrabold tracking-wide text-zinc-100">CAPITAL BLOCKS</span>
              <span className="block whitespace-nowrap text-[10px] tracking-wider text-zinc-500">A ANATOMIA DO CAPITALISMO GLOBAL</span>
            </span>
          </button>

          {/* ── navegação horizontal (desktop) ── */}
          <nav className="thin-scroll hidden flex-1 items-center gap-1 overflow-x-auto md:flex">
            {NAV_TABS.map((id) => {
              const m = MODULES[id]
              const isMap = id === 'home'
              const active = isMap ? tab === 'home' || is3D : tab === id
              const show3D = isMap && is3D
              return (
                <button key={id} onClick={() => pressTab(id)} title={TITLES[id]}
                  aria-pressed={isMap ? is3D : undefined}
                  className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? show3D
                        ? 'bg-sky-400 text-zinc-950'
                        : 'bg-money text-zinc-950'
                      : show3D
                        ? 'border border-sky-400/50 bg-sky-400/10 text-sky-300 hover:bg-sky-400/20'
                        : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200'
                  }`}>
                  <span className="mr-1 font-mono text-[10px] opacity-70">{show3D ? '3D' : m.num}</span>
                  {show3D ? `🌍 ${t(lang, m.labelKey)}` : t(lang, m.labelKey)}
                </button>
              )
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-1.5 md:flex">
            <button
              onClick={() => setGlossaryOpen(true)}
              title="Glossário: os conceitos do site explicados nos dois níveis"
              className="rounded-lg border border-zinc-800 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-400 transition-colors hover:border-money/60 hover:text-money"
            >
              {t(lang, 'glossario')}
            </button>
            <ModeControls />
          </div>

          {/* ── mobile: glossário compacto + hambúrguer da gaveta lateral ── */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:hidden">
            <button
              onClick={() => setGlossaryOpen(true)}
              aria-label="Abrir glossário"
              className="rounded-lg border border-zinc-800 px-2.5 py-2 text-[11px] font-bold text-zinc-400"
            >
              A-Z
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu de módulos"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-money/50 bg-money/10 text-lg text-money"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* ── gaveta lateral de módulos (mobile) ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label="Menu de módulos">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <aside className="thin-scroll absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col overflow-y-auto border-r border-zinc-800 bg-zinc-950 shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <span className="flex items-center gap-2">
                <Logo />
                <span className="text-sm font-extrabold tracking-wide text-zinc-100">CAPITAL BLOCKS</span>
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400">✕</button>
            </div>

            <nav className="flex-1 space-y-0.5 p-2">
              {NAV_TABS.map((id) => {
                const m = MODULES[id]
                const isMap = id === 'home'
                const active = isMap ? tab === 'home' || is3D : tab === id
                const show3D = isMap && is3D
                return (
                  <button key={id} onClick={() => go(id)} title={TITLES[id]}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      active
                        ? show3D
                          ? 'bg-sky-400/15 text-sky-300'
                          : 'bg-money/15 text-money'
                        : 'text-zinc-300 active:bg-zinc-900'
                    }`}>
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                      active ? (show3D ? 'bg-sky-400 text-zinc-950' : 'bg-money text-zinc-950') : 'bg-zinc-800 text-zinc-400'
                    }`}>{show3D ? '3D' : m.num}</span>
                    <span className="text-[13px] font-medium leading-tight">
                      {show3D ? `🌍 ${t(lang, m.labelKey)} · toque p/ 2D` : t(lang, m.labelKey)}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className="space-y-3 border-t border-zinc-800 p-3">
              <ModeControls stacked />
              <button
                onClick={() => { setGlossaryOpen(true); setMenuOpen(false) }}
                className="w-full rounded-lg border border-zinc-800 px-3 py-2.5 text-left text-xs font-semibold text-zinc-300">
                📖 {t(lang, 'glossario')}
              </button>
            </div>
          </aside>
        </div>
      )}

      {glossaryLoaded && (
        <Suspense fallback={null}>
          <GlossaryDrawer />
        </Suspense>
      )}
    </>
  )
}
