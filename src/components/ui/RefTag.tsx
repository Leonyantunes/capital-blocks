import { useApp } from '../../store/useApp'

/**
 * Marca discreta de fonte — renderiza SÓ quando o modo referências está
 * ligado (Configurações, `showRefs`). Junto do número, mostra instituição
 * e safra; desligado, some (aula limpa).
 *
 * Os painéis que já exibem a fonte inline (IndicatorsStrip, FlowCard,
 * ConflictDrawer, WorldWealthPanel, linhas expandidas do Raio-X) não usam
 * este componente — o alvo são os números sem fonte visível permanente.
 */
export default function RefTag({ fonte, className }: { fonte?: string; className?: string }) {
  const showRefs = useApp((s) => s.showRefs)
  if (!showRefs || !fonte) return null
  return (
    <span
      className={`inline-block rounded bg-zinc-800/80 px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-zinc-400 ${className ?? ''}`}
    >
      {fonte}
    </span>
  )
}
