import { useApp, type DisciplineLens, type UIMode } from '../../store/useApp'
import { LENTES } from '../../lib/simples'
import { pick } from '../../i18n'

const NEXT_MODE: Record<UIMode, UIMode> = {
  simples: 'didatico',
  didatico: 'avancado',
  avancado: 'simples',
}

export default function ModeBadge() {
  const mode = useApp((s) => s.mode)
  const setMode = useApp((s) => s.setMode)
  const lens = useApp((s) => s.lens)
  const setLens = useApp((s) => s.setLens)
  const lang = useApp((s) => s.lang)
  const li = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2

  const label =
    mode === 'simples'
      ? pick(lang, 'Simples · Escola', 'Basic · School', 'Fácil · Escuela')
      : mode === 'didatico'
        ? pick(lang, 'Didático · Ensino Médio', 'Didactic · High School', 'Didáctico · Secundaria')
        : pick(lang, 'Avançado · Pesquisa', 'Advanced · Research', 'Avanzado · Investigación')

  const description =
    mode === 'simples'
      ? pick(lang, 'Linguagem direta e exemplos concretos (clique para alternar nível).', 'Direct language and concrete examples (click to switch level).', 'Lenguaje directo y ejemplos concretos (haz clic para cambiar nivel).')
      : mode === 'didatico'
        ? pick(lang, 'Explicação didática com conceitos e contexto (clique para alternar nível).', 'Didactic explanation with concepts and context (click to switch level).', 'Explicación didáctica con conceptos y contexto (haz clic para cambiar nivel).')
        : pick(lang, 'Leitura universitária/pesquisa com categorias, fórmulas e notas metodológicas.', 'University/research reading with categories, formulas and methodological notes.', 'Lectura universitaria/investigación con categorías, fórmulas y notas metodológicas.')

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => setMode(NEXT_MODE[mode])}
        title={description}
        className={`shrink-0 cursor-pointer rounded-full border px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.16em] transition-colors ${
          mode === 'simples'
            ? 'border-amber-300/50 bg-amber-300/10 text-amber-300 hover:bg-amber-300/20'
            : mode === 'didatico'
              ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
              : 'border-sky-400/50 bg-sky-400/10 text-sky-300 hover:bg-sky-400/20'
        }`}
      >
        {label}
      </button>

      <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/90 p-0.5">
        {LENTES.map((l) => {
          const active = lens === l.id
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setLens(l.id as DisciplineLens)}
              title={l.descricao[li]}
              className={`rounded-full px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider transition-colors ${
                active ? 'text-onaccent' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={active ? { background: l.cor } : undefined}
            >
              {l.curto[li]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
