import { useApp } from '../../store/useApp'
import { LENTES, MODULE_PEDAGOGY } from '../../lib/simples'
import { pick } from '../../i18n'

/**
 * Barra contextual de mediação pedagógica e rigor metodológico.
 * Aparece automaticamente quando:
 * - O usuário escolhe uma lente disciplinar (Geografia, História, Economia);
 * - Ou está no modo Apresentação/Professor (`presentation === true`);
 * - Ou está no modo Avançado/Pesquisador (`mode === 'avancado'`).
 */
export default function LessonGuideBar() {
  const tab = useApp((s) => s.tab)
  const mode = useApp((s) => s.mode)
  const lens = useApp((s) => s.lens)
  const presentation = useApp((s) => s.presentation)
  const lang = useApp((s) => s.lang)

  const key = tab === 'globe3d' ? 'home' : tab
  const meta = MODULE_PEDAGOGY[key]
  if (!meta) return null

  const showLens = lens !== 'geral'
  const showAdvancedNote = mode === 'avancado'
  if (!showLens && !presentation && !showAdvancedNote) return null

  const li = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2
  const lenteObj = LENTES.find((l) => l.id === lens) ?? LENTES[0]

  return (
    <aside
      aria-label={pick(lang, 'Guia de aula e metodologia', 'Lesson and methodology guide', 'Guía de clase y metodología')}
      className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/75 p-3.5 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {showLens && (
            <span
              className="rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-onaccent"
              style={{ background: lenteObj.cor }}
            >
              {lenteObj.rotulo[li]}
            </span>
          )}
          {presentation && (
            <span className="rounded-md border border-sky-400/50 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-300">
              {pick(lang, 'Modo Professor / Sala de Aula', 'Teacher / Classroom Mode', 'Modo Profesor / Aula')}
            </span>
          )}
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-mono text-[9.5px] text-zinc-500">BNCC:</span>
            {meta.bncc.map((code) => (
              <span
                key={code}
                className="rounded border border-zinc-700 bg-zinc-950 px-1.5 py-px font-mono text-[9px] text-zinc-400"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showLens && (
        <p className="mt-2 text-xs leading-relaxed text-zinc-200">
          <strong style={{ color: lenteObj.cor }}>{lenteObj.rotulo[li]}:</strong>{' '}
          {meta.recorteLente[lens as 'geografia' | 'historia' | 'economia'][li]}
        </p>
      )}

      {(presentation || mode === 'simples' || mode === 'didatico') && (
        <div className="mt-2 rounded-lg border border-amber-400/30 bg-amber-400/5 px-3 py-2 text-xs text-zinc-200">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
            {pick(lang, 'Pergunta disparadora para aula:', 'Classroom discussion prompt:', 'Pregunta disparadora para el aula:')}{' '}
          </span>
          {meta.perguntaAula[li]}
        </div>
      )}

      {showAdvancedNote && (
        <div className="mt-2 rounded-lg border border-sky-400/30 bg-sky-400/5 px-3 py-2 text-[11px] leading-relaxed text-zinc-300">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-300">
            {pick(lang, 'Nota Metodológica (Nível Universitário/Pesquisa):', 'Methodological Note (University/Research):', 'Nota Metodológica (Nivel Universitario/Investigación):')}{' '}
          </span>
          {meta.notaMetodologicaPesquisa[li]}
        </div>
      )}
    </aside>
  )
}
