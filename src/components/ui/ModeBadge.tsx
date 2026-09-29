import { useApp } from '../../store/useApp'
import { NIVEIS, rotuloDoModo, descricaoDoModo } from '../../lib/simples'

/**
 * Badge persistente do nível de leitura atual — presente em todo cabeçalho de
 * módulo. Três níveis: Simples (3º modo), Didático (padrão) e Avançado.
 */
export default function ModeBadge() {
  const mode = useApp((s) => s.mode)
  const nivel = NIVEIS.find((n) => n.id === mode)
  return (
    <span
      title={descricaoDoModo(mode)}
      className={`shrink-0 cursor-help rounded-full border px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.18em] ${
        mode === 'simples'
          ? 'border-amber-300/50 bg-amber-300/10 text-amber-300'
          : mode === 'didatico'
            ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
            : 'border-sky-400/50 bg-sky-400/10 text-sky-300'
      }`}
    >
      {rotuloDoModo(mode)}
    </span>
  )
}
