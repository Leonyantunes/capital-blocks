import type { ReactNode } from 'react'

interface TipProps {
  text: string
  children: ReactNode
  className?: string
}

/** Tooltip ilustrativo (micro-explicação ao passar o mouse). */
export default function Tip({ text, children, className }: TipProps) {
  return (
    <span className={`group/tip relative inline-flex ${className ?? ''}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 w-56 -translate-x-1/2 rounded-lg border border-zinc-800 bg-zinc-800/95 px-2.5 py-2 text-[11px] leading-snug text-zinc-200 opacity-0 shadow-xl backdrop-blur transition-opacity duration-150 group-hover/tip:opacity-100"
      >
        {text}
      </span>
    </span>
  )
}
