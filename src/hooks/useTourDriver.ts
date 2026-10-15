import { useEffect, useRef, useState, useCallback } from 'react'
import { driver, type Driver, type DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import type { TourStop } from '../data/tour'
import { pick } from '../i18n'
import type { UIMode } from '../store/useApp'

interface UseTourDriverOptions {
  stops: TourStop[]
  activeStep: number | null
  onStepChange: (step: number) => void
  onEndTour: () => void
  accent?: string
  mode?: UIMode
  lang?: 'pt' | 'en' | 'es'
  targetElementSelector?: string
}

export function useTourDriver({
  stops,
  activeStep,
  onStepChange,
  onEndTour,
  accent = '#10b981',
  mode = 'didatico',
  lang = 'pt',
  targetElementSelector = '#tour-spotlight-target',
}: UseTourDriverOptions) {
  const driverInstanceRef = useRef<Driver | null>(null)
  const isSyncingFromAppRef = useRef(false)
  const [isDriverActive, setIsDriverActive] = useState(false)

  const buildStepContent = useCallback(
    (stop: TourStop, index: number): string => {
      const li = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2
      const desc =
        mode === 'simples'
          ? stop.simples || stop.did
          : mode === 'avancado'
          ? stop.adv
          : stop.did

      const statsHtml =
        stop.didStats && stop.didStats.length > 0
          ? `<div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
              ${stop.didStats
                .map(
                  (st) => `
                <div style="background: rgba(255,255,255,0.06); padding: 4px 8px; border-radius: 6px; font-size: 11px; border: 1px solid rgba(255,255,255,0.1);">
                  <strong style="color: ${accent}; font-family: monospace;">${st.v}</strong>
                  <span style="color: #a1a1aa; margin-left: 4px;">${st.k}</span>
                </div>
              `
                )
                .join('')}
            </div>`
          : ''

      const dicaHtml = stop.dica
        ? `<div style="margin-top: 8px; font-size: 10.5px; color: #71717a; border-left: 2px solid ${accent}; padding-left: 6px;">
            💡 ${stop.dica}
          </div>`
        : ''

      return `
        <div style="font-family: inherit; line-height: 1.5; color: #e4e4e7;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${accent}; font-weight: 700; margin-bottom: 4px;">
            ${stop.chapter} · ${pick(lang, 'Parada', 'Stop', 'Parada')} ${index + 1}/${stops.length}
          </div>
          <p style="font-size: 12.5px; color: #d4d4d8; margin: 0 0 4px 0;">${desc}</p>
          ${statsHtml}
          ${dicaHtml}
        </div>
      `
    },
    [accent, lang, mode, stops.length]
  )

  const startDriverTour = useCallback(
    (startIndex = 0) => {
      if (stops.length === 0) return

      const driveSteps: DriveStep[] = stops.map((s, idx) => ({
        element: targetElementSelector,
        popover: {
          title: s.titulo,
          description: buildStepContent(s, idx),
          side: 'bottom',
          align: 'center',
          popoverClass: 'capital-tour-driver-popover',
          showProgress: true,
          progressText: `{{current}} / {{total}}`,
          nextBtnText:
            idx === stops.length - 1
              ? pick(lang, 'Concluir ✓', 'Finish ✓', 'Finalizar ✓')
              : pick(lang, 'Próximo →', 'Next →', 'Siguiente →'),
          prevBtnText: pick(lang, '← Anterior', '← Previous', '← Anterior'),
          doneBtnText: pick(lang, 'Concluir ✓', 'Finish ✓', 'Finalizar ✓'),
        },
      }))

      const d = driver({
        animate: true,
        allowClose: true,
        overlayColor: 'rgba(9, 9, 11, 0.78)',
        stagePadding: 4,
        stageRadius: 12,
        steps: driveSteps,
        onHighlightStarted: (_el, _step, opts) => {
          const idx = opts.driver.getActiveIndex() ?? 0
          if (!isSyncingFromAppRef.current) {
            onStepChange(idx)
          }
        },
        onDestroyed: () => {
          setIsDriverActive(false)
          onEndTour()
        },
      })

      driverInstanceRef.current = d
      setIsDriverActive(true)
      d.drive(startIndex)
    },
    [buildStepContent, lang, onEndTour, onStepChange, stops, targetElementSelector]
  )

  const destroyDriver = useCallback(() => {
    if (driverInstanceRef.current?.isActive()) {
      driverInstanceRef.current.destroy()
    }
    setIsDriverActive(false)
  }, [])

  // Sincroniza se o app mudar o passo externamente
  useEffect(() => {
    if (activeStep !== null && driverInstanceRef.current?.isActive()) {
      const activeIdx = driverInstanceRef.current.getActiveIndex()
      if (activeIdx !== activeStep) {
        isSyncingFromAppRef.current = true
        driverInstanceRef.current.moveTo(activeStep)
        isSyncingFromAppRef.current = false
      }
    }
  }, [activeStep])

  return {
    startDriverTour,
    destroyDriver,
    isDriverActive,
  }
}
