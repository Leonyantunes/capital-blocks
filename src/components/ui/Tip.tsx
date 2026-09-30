import { useId, type ReactNode } from 'react'

interface TipProps {
  text: string
  children: ReactNode
  className?: string
}

/** Tooltip ilustrativo — micro-explicação ao passar o mouse OU ao focar por
 *  teclado (o gatilho é focável e referencia o tooltip via aria-describedby). */
export default function Tip({ text, children, className }: TipProps) {
  const id = useId()
  return (
    <span className={`group/tip relative inline-flex ${className ?? ''}`}>
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
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 w-56 -translate-x-1/2 rounded-lg border border-zinc-800 bg-zinc-800/95 px-2.5 py-2 text-[11px] leading-snug text-zinc-200 opacity-0 shadow-xl backdrop-blur transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {text}
      </span>
    </span>
  )
}
