import { useEffect, useRef } from 'react'

/** FOCUS TRAP — prende o Tab dentro do drawer/modal e devolve o foco ao fechar (a11y). */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current
    const prev = document.activeElement as HTMLElement | null
    const sel = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
    const focusables = () => Array.from(el.querySelectorAll<HTMLElement>(sel))
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = focusables()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault() }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault() }
    }
    el.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [active])
  return ref
}
