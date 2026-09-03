import { Suspense, lazy, useEffect } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import Navbar from './components/Navbar'
import { useApp } from './store/useApp'
import { t } from './i18n'
import ErrorBoundary from './components/ErrorBoundary'

/**
 * Code-splitting por módulo: cada aba vira um chunk carregado sob demanda.
 * Home (mapa+geografia real) e o shell ficam no chunk inicial.
 * Drawers (país/glossário) só carregam quando abertos pela 1ª vez.
 */
const MapModule = lazy(() => import('./components/MapModule'))
const GlobeModule = lazy(() => import('./components/globe3d/GlobeModule'))
const CircuitModule = lazy(() => import('./components/CircuitModule'))
const WarModule = lazy(() => import('./components/war/WarModule'))
const DebtModule = lazy(() => import('./components/DebtModule'))
const CompaniesModule = lazy(() => import('./components/CompaniesModule'))
const PlatformModule = lazy(() => import('./components/PlatformModule'))
const WealthModule = lazy(() => import('./components/wealth/WealthModule'))
const ConsequencesModule = lazy(() => import('./components/consequences/ConsequencesModule'))
const AlternativesModule = lazy(() => import('./components/alternatives/AlternativesModule'))
const CountryDrawer = lazy(() => import('./components/CountryDrawer'))

function ModuleFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center gap-3 text-zinc-500">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-money" />
      <span className="font-mono text-xs">carregando módulo…</span>
    </div>
  )
}

export default function App() {
  /* selectors individuais: mudança em k/e/mode NÃO re-renderiza o shell inteiro */
  const tab = useApp((s) => s.tab)
  const presentation = useApp((s) => s.presentation)
  const lang = useApp((s) => s.lang)

  useEffect(() => {
    document.documentElement.style.fontSize = presentation ? '19px' : '16px'
  }, [presentation])

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex min-h-full flex-col bg-zinc-950">
        <a href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[80] focus:rounded-lg focus:bg-money focus:px-3 focus:py-2 focus:text-xs focus:font-bold focus:text-zinc-950">
          Pular para o conteúdo
        </a>
        <Navbar />
        <AnimatePresence mode="wait">
          <m.main
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            id="conteudo"
            tabIndex={-1}
            className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 outline-none"
          >
            <Suspense fallback={<ModuleFallback />}>
              <ErrorBoundary>
                {tab === 'home' && <MapModule />}
                {tab === 'globe3d' && <GlobeModule />}
                {tab === 'circuit' && <CircuitModule />}
                {tab === 'war' && <WarModule />}
                {tab === 'debt' && <DebtModule />}
                {tab === 'companies' && <CompaniesModule />}
                {tab === 'platform' && <PlatformModule />}
                {tab === 'wealth' && <WealthModule />}
                {tab === 'consequences' && <ConsequencesModule />}
                {tab === 'alternatives' && <AlternativesModule />}
              </ErrorBoundary>
            </Suspense>
          </m.main>
        </AnimatePresence>
        <footer className="border-t border-zinc-900 px-4 py-4">
          <p className="mx-auto max-w-[1400px] text-[11px] leading-relaxed text-zinc-600">{t(lang, 'footer')}</p>
        </footer>
        <Suspense fallback={null}>
          <CountryDrawer />
        </Suspense>
      </div>
    </LazyMotion>
  )
}
