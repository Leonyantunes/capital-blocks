import { useApp } from '../../store/useApp'

/** Badge persistente do nível de leitura atual — presente em todo cabeçalho de módulo. */
export default function ModeBadge() {
  const mode = useApp((s) => s.mode)
  return (
    <span
      title={mode === 'didatico'
        ? 'Modo Didático: linguagem direta, metáforas e sem fórmulas'
        : 'Modo Avançado: categorias marxistas, fórmulas e referências'}
      className={`shrink-0 cursor-help rounded-full border px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.18em] ${
        mode === 'didatico'
          ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
          : 'border-sky-400/50 bg-sky-400/10 text-sky-300'
      }`}
    >
      {mode === 'didatico' ? 'Didático' : 'Avançado'}
    </span>
  )
}
