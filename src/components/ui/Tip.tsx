import { useId, useRef, useState, type ReactNode } from 'react'

interface TipProps {
  text: string
  children: ReactNode
  className?: string
}

/** Tooltip ilustrativo — micro-explicação ao passar o mouse OU ao focar por
 *  teclado (o gatilho é focável e referencia o tooltip via aria-describedby). */
export default function Tip({ text, children, className }: TipProps) {
  const id = useId()
  const rootRef = useRef<HTMLSpanElement>(null)
  const [placement, setPlacement] = useState<'left' | 'center' | 'right'>('center')

  const updatePlacement = () => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect) return
    const center = rect.left + rect.width / 2
    if (center < 120) setPlacement('left')
    else if (window.innerWidth - center < 120) setPlacement('right')
    else setPlacement('center')
  }

  const desktopPosition =
    placement === 'left'
      ? 'left-0'
      : placement === 'right'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2'

  return (
    <span
      ref={rootRef}
      className={`group/tip relative inline-flex ${className ?? ''}`}
      onMouseEnter={updatePlacement}
      onFocusCapture={updatePlacement}
    >
      <span
        tabIndex={0}
        aria-describedby={id}
        className="cursor-help rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-money"
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-40 mb-1.5 hidden w-56 max-w-[calc(100vw-2rem)] rounded-lg border border-zinc-800 bg-zinc-800/95 px-2.5 py-2 text-[11px] leading-snug text-zinc-200 shadow-xl backdrop-blur group-hover/tip:block group-focus-within/tip:block ${desktopPosition} max-md:fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:mb-0 max-md:w-auto max-md:max-w-none max-md:translate-x-0`}
      >
        {text}
      </span>
    </span>
  )
}
