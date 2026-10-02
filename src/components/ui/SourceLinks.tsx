import { sourceById } from '../../data/sources'
import { useApp } from '../../store/useApp'

interface SourceLinksProps {
  sourceIds: string[]
  className?: string
}

/**
 * Liga um número exibido à ficha canônica da fonte. Mesmo com o modo de
 * referências desligado, mantém um atalho discreto para a proveniência;
 * quando ligado, mostra o nome curto de cada referência.
 */
export default function SourceLinks({ sourceIds, className }: SourceLinksProps) {
  const showRefs = useApp((s) => s.showRefs)
  const setTab = useApp((s) => s.setTab)
  const fontes = sourceIds.map(sourceById).filter((s): s is NonNullable<typeof s> => !!s)

  if (!fontes.length) return null

  const abrir = (id: string) => {
    if (typeof window !== 'undefined') {
      const hash = `#fonte-${id}`
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
    }
    setTab('sources')
  }

  if (!showRefs) {
    return (
      <button
        type="button"
        onClick={() => abrir(fontes[0].id)}
        title={fontes.map((s) => s.nome).join(' · ')}
        className={`mt-1 font-mono text-[8px] uppercase tracking-wide text-zinc-600 transition-colors hover:text-sky-300 ${className ?? ''}`}
      >
        ↗ {fontes.length === 1 ? 'fonte' : `${fontes.length} fontes`}
      </button>
    )
  }

  return (
    <div className={`mt-1 flex flex-wrap justify-center gap-1 ${className ?? ''}`}>
      {fontes.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => abrir(s.id)}
          title={s.nome}
          className="max-w-full truncate rounded border border-zinc-700/80 px-1 py-px font-mono text-[7.5px] text-zinc-500 transition-colors hover:border-sky-400/60 hover:text-sky-300"
        >
          {s.instituicao ?? s.nome}
        </button>
      ))}
    </div>
  )
}
