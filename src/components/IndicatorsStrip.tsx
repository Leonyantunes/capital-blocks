import { INDICATORS } from '../data/indicators'
import Tip from './ui/Tip'
import { useApp } from '../store/useApp'

/** Faixa de indicadores globais pesquisados (fontes primárias, dual-mode). */
export default function IndicatorsStrip() {
  const mode = useApp((s) => s.mode)
  return (
    <section aria-label="Indicadores globais">
      <div className="mb-1.5 flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Painel de indicadores globais
        </h3>
        <span className="text-[10px] text-zinc-600">fontes primárias · passe o mouse p/ ler</span>
      </div>
      <div className="thin-scroll flex gap-3 overflow-x-auto pb-1">
        {INDICATORS.map((ind) => (
          <Tip key={ind.id} text={mode !== 'avancado' ? ind.didatico : ind.avancado}>
            <article className="group w-60 shrink-0 cursor-help rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 transition-colors hover:border-zinc-600">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl font-extrabold" style={{ color: ind.color }}>{ind.value}</span>
                <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                  {ind.source}
                </span>
              </div>
              <div className="mt-1.5 text-xs font-semibold leading-snug text-zinc-200">{ind.label}</div>
              <div className="mt-0.5 text-[10.5px] leading-snug text-zinc-500">{ind.sub}</div>
              <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-zinc-600">
                <span>{ind.year}</span>
                {ind.sourceUrl && (
                  <a href={ind.sourceUrl} target="_blank" rel="noreferrer"
                    className="underline decoration-dotted hover:text-money" onClick={(e) => e.stopPropagation()}>
                    fonte ↗
                  </a>
                )}
              </div>
            </article>
          </Tip>
        ))}
      </div>
    </section>
  )
}
