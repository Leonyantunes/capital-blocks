import { Suspense, lazy, useEffect, useState } from 'react'
import { useApp, type TabId } from '../store/useApp'
import { t } from '../i18n'

const GlossaryDrawer = lazy(() => import('./GlossaryDrawer'))

const TABS: { id: TabId; num: string; key: 'mapa' | 'circuito' | 'guerra' | 'divida' | 'raio' | 'plataformas' | 'riqueza' | 'consequencias' | 'alternativas'; title: string }[] = [
  { id: 'home', num: '01', key: 'mapa', title: 'Módulo 01 — Mapa Geopolítico Interativo (Home)' },
  { id: 'circuit', num: '02', key: 'circuito', title: 'Módulo 02 — O Circuito do Capital' },
  { id: 'war', num: '03', key: 'guerra', title: 'Módulo 03 — Guerra de Capitais & Conflitos Imperialistas (War Room)' },
  { id: 'debt', num: '04', key: 'divida', title: 'Módulo 04 — Morte e Ressurreição do Capital (MMT × Ortodoxia)' },
  { id: 'companies', num: '05', key: 'raio', title: 'Módulo 05 — Raio-X das Empresas (ILAESE + Globais)' },
  { id: 'platform', num: '06', key: 'plataformas', title: 'Módulo 06 — Indústria 4.0 & Plataformização do Trabalho' },
  { id: 'wealth', num: '07', key: 'riqueza', title: 'Módulo 07 — Quem Sustenta Quê? Trabalho & Concentração' },
  { id: 'consequences', num: '08', key: 'consequencias', title: 'Módulo 08 — Consequências Sistêmicas: As Mortes do Capitalismo' },
  { id: 'alternatives', num: '09', key: 'alternativas', title: 'Módulo 09 — E Para Onde Podemos Ir? Sistemas que já funcionam' },
]

function ModeToggle() {
  const mode = useApp((s) => s.mode)
  const setMode = useApp((s) => s.setMode)
  const presentation = useApp((s) => s.presentation)
  const setPresentation = useApp((s) => s.setPresentation)
  const lang = useApp((s) => s.lang)
  const setLang = useApp((s) => s.setLang)
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
        {(['didatico', 'avancado'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              mode === m ? 'bg-money text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`}>
            {m === 'didatico' ? t(lang, 'didatico') : t(lang, 'avancado')}
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
  /* chunk do glossário só entra quando ele é aberto pela primeira vez */
  const [glossaryLoaded, setGlossaryLoaded] = useState(false)
  useEffect(() => {
    if (glossaryOpen) setGlossaryLoaded(true)
  }, [glossaryOpen])
  const [showName, setShowName] = useState(true)

  /* o nome aparece na entrada, recolhe em animação e volta no hover do logo */
  useEffect(() => {
    const t = setTimeout(() => setShowName(false), 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
        <button
          onClick={() => setTab('home')}
          onMouseEnter={() => setShowName(true)}
          onMouseLeave={() => setShowName(false)}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Capital Blocks — Início">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <rect x="1" y="1" width="11" height="11" rx="2" fill="#ffc107" />
            <rect x="14" y="1" width="11" height="11" rx="2" fill="#4caf50" opacity=".85" />
            <rect x="1" y="14" width="11" height="11" rx="2" fill="#2196f3" opacity=".85" />
            <rect x="14" y="14" width="11" height="11" rx="2" fill="#f44336" opacity=".85" />
          </svg>
          <span
            className={`hidden overflow-hidden leading-tight transition-all duration-700 ease-out sm:block ${
              showName ? 'max-w-[240px] opacity-100' : 'max-w-0 opacity-0'
            } group-hover:max-w-[240px] group-hover:opacity-100`}>
            <span className="block whitespace-nowrap text-sm font-extrabold tracking-wide text-zinc-100">CAPITAL BLOCKS</span>
            <span className="block whitespace-nowrap text-[10px] tracking-wider text-zinc-500">A ANATOMIA DO CAPITALISMO GLOBAL</span>
          </span>
        </button>

        <nav className="thin-scroll flex flex-1 items-center gap-1 overflow-x-auto">
          {TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} title={tb.title}
              className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                tab === tb.id ? 'bg-money text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200'
              }`}>
              <span className="mr-1 font-mono text-[10px] opacity-70">{tb.num}</span>
              {t(lang, tb.key)}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => useApp.getState().setGlossaryOpen(true)}
            title="Glossário: os conceitos do site explicados nos dois níveis"
            className="rounded-lg border border-zinc-800 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-400 transition-colors hover:border-money/60 hover:text-money"
          >
            {t(lang, 'glossario')}
          </button>
          <ModeToggle />
        </div>
      </div>
      </header>
      {glossaryLoaded && (
        <Suspense fallback={null}>
          <GlossaryDrawer />
        </Suspense>
      )}
    </>
  )
}
