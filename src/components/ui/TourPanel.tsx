import type { TourStop } from '../../data/tour'
import type { TourDef } from '../../data/tours'
import type { UIMode } from '../../store/useApp'
import { useApp } from '../../store/useApp'
import { NIVEIS, textoPorModo } from '../../lib/simples'
import SourceLinks from './SourceLinks'
import TourQuizCard from './TourQuizCard'

/**
 * Copy mínima do tour compartilhada pelos dois mapas (MAP_UI / GLOBE_UI).
 * Só o que o card usa — o resto do copy de cada módulo continua local.
 */
export interface TourPanelCopy {
  step: string
  chooseTour: string
  levels: Record<UIMode, readonly [string, string]>
  previousStep: string
  endTour: string
  goStep: string
  next: string
  finish: string
}

interface TourPanelProps {
  id?: string
  stop: TourStop
  stepIndex: number
  total: number
  accent: string
  tourId: string
  tours: TourDef[]
  copy: TourPanelCopy
  /** '2d' usa o fundo do mapa; '3d' usa o fundo do globo. */
  surface: '2d' | '3d'
  /**
   * Em telas largas o card vira uma coluna lateral e o mapa encolhe para
   * dividir o palco — nada de conteúdo por cima do globo/mapa.
   * `md` = globo 3D (palco de altura fixa) · `xl` = mapa 2D (o SVG é
   * limitado pela proporção, então só vale a pena em telas bem largas).
   */
  dockAt: 'md' | 'xl'
  onPrev: () => void
  onNext: () => void
  onEnd: () => void
  onSelectStep: (index: number) => void
  onSelectTour: (id: string) => void
  onFinish: () => void
  finalLabel: string
  onSpotlight?: () => void
}

const LAYOUT = {
  md:
    'max-md:bottom-16 max-md:left-1/2 max-md:max-h-[50%] max-md:w-[min(94%,620px)] max-md:-translate-x-1/2 max-md:p-3 ' +
    'md:bottom-3 md:right-3 md:top-14 md:w-[380px]',
  xl:
    'max-xl:bottom-16 max-xl:left-1/2 max-xl:max-h-[50%] max-xl:w-[min(94%,620px)] max-xl:-translate-x-1/2 max-xl:p-3 ' +
    'xl:bottom-3 xl:right-3 xl:top-14 xl:w-[380px]',
} as const

/**
 * Card do tour guiado (2D e 3D).
 *
 * Estrutura em três faixas: cabeçalho e navegação ficam SEMPRE visíveis e só
 * o miolo rola. Assim paradas com quiz não esticam o card para fora do palco
 * nem escondem o botão de avançar.
 */
export default function TourPanel({
  id,
  stop,
  stepIndex,
  total,
  accent,
  tourId,
  tours,
  copy,
  surface,
  dockAt,
  onPrev,
  onNext,
  onEnd,
  onSelectStep,
  onSelectTour,
  onFinish,
  finalLabel,
  onSpotlight,
}: TourPanelProps) {
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const setMode = useApp((s) => s.setMode)
  const last = stepIndex >= total - 1
  const surfaceBg = surface === '3d' ? 'bg-[#060b16]/95' : 'bg-zinc-900/95'

  return (
    <div
      id={id}
      role="dialog"
      aria-label={stop.titulo}
      className={`tour-panel absolute z-30 flex flex-col overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur ${surfaceBg} ${LAYOUT[dockAt]}`}
      style={{ borderColor: `${accent}88`, boxShadow: `0 0 28px ${accent}22, 0 18px 50px rgba(0,0,0,.6)` }}
    >
      {/* cabeçalho fixo: capítulo, nível de leitura, título, escolha do tour e ações */}
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9.5px] uppercase tracking-widest" style={{ color: accent }}>
            <span>{stop.chapter} · {copy.step} {stepIndex + 1}/{total}</span>
            <span className="inline-flex overflow-hidden rounded border border-zinc-700">
              {NIVEIS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setMode(n.id)}
                  title={copy.levels[n.id][1]}
                  className={`px-1.5 py-px text-[9px] font-bold normal-case tracking-normal transition-colors ${
                    mode === n.id ? 'text-onaccent' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                  style={mode === n.id ? { background: accent } : undefined}
                >
                  {copy.levels[n.id][0]}
                </button>
              ))}
            </span>
          </div>
          <div className="mt-0.5 text-sm font-bold text-zinc-100">{stop.titulo}</div>
          <select
            value={tourId}
            onChange={(e) => onSelectTour(e.target.value)}
            title={copy.chooseTour}
            aria-label={copy.chooseTour}
            className="mt-1.5 max-w-full cursor-pointer truncate rounded-md border border-zinc-700 bg-zinc-950 px-1.5 py-1 text-[10.5px] font-semibold text-zinc-200 outline-none hover:border-zinc-500"
          >
            {tours.map((td) => (
              <option key={td.id} value={td.id}>{td.titulo}</option>
            ))}
          </select>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onSpotlight && (
            <button
              onClick={onSpotlight}
              title={
                lang === 'pt'
                  ? 'Ativar modo Spotlight acessível (Driver.js)'
                  : lang === 'es'
                    ? 'Activar modo Spotlight accesible (Driver.js)'
                    : 'Activate accessible Spotlight mode (Driver.js)'
              }
              className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 hover:bg-amber-500/20 max-md:px-2.5 max-md:py-1.5"
            >
              🔦
            </button>
          )}
          <button
            onClick={onPrev}
            aria-label={copy.previousStep}
            disabled={stepIndex === 0}
            className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-zinc-400 max-md:px-3.5 max-md:py-2"
          >
            ←
          </button>
          <button
            onClick={onEnd}
            aria-label={copy.endTour}
            className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 max-md:px-3.5 max-md:py-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* miolo rolável: texto, números/fontes invariantes, dica e quiz */}
      <div className="tour-panel-body thin-scroll mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <p className={`text-xs leading-relaxed ${mode === 'avancado' ? 'text-zinc-300' : 'text-zinc-200'}`}>
          {textoPorModo(mode, stop.did, stop.adv, stop.simples)}
        </p>
        {stop.didStats.length > 0 && (
          <div className={`mt-2.5 grid gap-1.5 ${stop.didStats.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {stop.didStats.map((d) => (
              <div
                key={d.k}
                className="rounded-lg border px-2 py-1.5 text-center"
                style={{ borderColor: `${accent}44`, background: `${accent}0d` }}
              >
                <div className="font-mono text-sm font-extrabold leading-tight" style={{ color: accent }}>{d.v}</div>
                <div className="mt-0.5 text-[9px] leading-tight text-zinc-400">{d.k}</div>
                <SourceLinks sourceIds={d.sourceIds} />
              </div>
            ))}
          </div>
        )}
        {stop.dica && (
          <p className="mt-2 font-mono text-[10px] leading-snug text-zinc-500">💡 {stop.dica}</p>
        )}
        {stop.quiz && <TourQuizCard key={stop.id} quiz={stop.quiz} accentColor={accent} />}
      </div>

      {/* rodapé fixo: progresso + avançar (sempre alcançável, mesmo com quiz longo) */}
      <div className="mt-2.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex max-w-[55%] flex-wrap items-center gap-1 overflow-hidden">
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                onClick={() => onSelectStep(i)}
                title={`${copy.goStep} ${i + 1}`}
                aria-label={`${copy.goStep} ${i + 1}`}
                aria-current={i === stepIndex ? 'step' : undefined}
                className={`h-1.5 shrink-0 rounded-full transition-all ${
                  i === stepIndex ? 'w-5' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                }`}
                style={i === stepIndex ? { background: accent } : undefined}
              />
            ))}
          </div>
          <button
            onClick={onNext}
            className="rounded border px-3 py-1 text-[11px] font-bold hover:bg-white/5 max-md:px-4 max-md:py-2"
            style={{ borderColor: `${accent}99`, color: accent }}
          >
            {last ? copy.finish : copy.next}
          </button>
        </div>
        {last && (
          <button
            onClick={onFinish}
            className="mt-2 w-full rounded-lg px-3 py-1.5 text-[11px] font-bold text-onaccent hover:brightness-110"
            style={{ background: accent }}
          >
            {finalLabel}
          </button>
        )}
      </div>
    </div>
  )
}
