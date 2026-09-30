import MetricCard from './MetricCard'
import Tip from './ui/Tip'
import { PRESETS, computeCircuit, fmtHours, pct, units, unpaidHours } from '../lib/marx'
import { useApp } from '../store/useApp'

export default function ControlsPanel() {
  const { k, e, setK, setE, mode } = useApp()
  const r = computeCircuit(k, e)
  const didatico = mode === 'didatico'

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {didatico ? 'Mexa na simulação' : 'Parâmetros da simulação'}
      </h3>

      {/* Nível de automação / composição orgânica */}
      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label htmlFor="slider-k" className="text-sm text-zinc-300">
            {didatico ? (
              <>Nível de Automação</>
            ) : (
              <>Composição orgânica <span className="font-mono text-zinc-500">k = c/v</span></>
            )}
          </label>
          <Tip text={didatico
            ? 'Quantas máquinas e matérias-primas para cada trabalhador. Suba para "automatizar".'
            : 'k = c/v: razão entre capital constante e variável.'}>
            <span className="cursor-help font-mono text-sm font-semibold text-sky-300">{r.k.toFixed(1)}</span>
          </Tip>
        </div>
        <input id="slider-k" type="range" min={0.5} max={14} step={0.1}
          value={k} onChange={(ev) => setK(parseFloat(ev.target.value))} />
        <p className="mt-1 text-[11px] leading-tight text-zinc-500">
          {didatico
            ? 'Mais robôs e matérias-primas por pessoa — menos gente empregada por real investido.'
            : 'Automação ↑ ⇒ mais máquina (c), menos trabalho vivo (v).'}
        </p>
      </div>

      {/* Intensidade de exploração / taxa de mais-valia */}
      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label htmlFor="slider-e" className="text-sm text-zinc-300">
            {didatico ? (
              <>Intensidade de Exploração</>
            ) : (
              <>Taxa de mais-valia <span className="font-mono text-zinc-500">e = m/v</span></>
            )}
          </label>
          <Tip text={didatico
            ? `Jornada de 8h: ${fmtHours(unpaidHours(e))} são trabalho gratuito para a empresa.`
            : 'e = m/v: mais-valia dividida pelo capital variável.'}>
            <span className="cursor-help font-mono text-sm font-semibold text-red-300">{pct(e * 100, 0)}</span>
          </Tip>
        </div>
        <input id="slider-e" type="range" min={0.5} max={5} step={0.05}
          value={e} onChange={(ev) => setE(parseFloat(ev.target.value))} />
        <p className="mt-1 text-[11px] leading-tight text-zinc-500">
          {didatico
            ? `Quanto do dia é trabalho gratuito: hoje, ${fmtHours(unpaidHours(e))} das 8 horas.`
            : 'Intensidade da exploração: jornada, produtividade e salário real.'}
        </p>
      </div>

      {/* Presets históricos gamificados */}
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-widest text-zinc-500">
          {didatico ? 'Viaje no tempo' : 'Presets históricos'}
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((p) => {
            const active = Math.abs(k - p.k) < 0.001 && Math.abs(e - p.e) < 0.001
            return (
              <button key={p.id} onClick={() => { setK(p.k); setE(p.e) }}
                className={`rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors ${
                  active
                    ? 'border-money/60 bg-money/10 text-amber-200'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}>
                {p.label}
                <span className="ml-1 font-mono text-[10px] opacity-60">
                  k={p.k} · e={p.e}
                </span>
                {didatico && (
                  <span className="ml-1 font-mono text-[10px] text-emerald-300/80">
                    · {fmtHours(unpaidHours(p.e))} não pagas
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Leituras derivadas */}
      <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3">
        <MetricCard label={didatico ? 'Investimento em máquinas' : 'Capital constante c'} value={units(r.c)}
          formula={didatico ? undefined : 'c = k·v'} accent="text-sky-300" fonte="modelo do app"
          tip={didatico ? 'Matérias-primas, fábricas, máquinas — transferem valor, mas não criam lucro novo.' : undefined} />
        <MetricCard label={didatico ? 'Folha de salários' : 'Capital variável v'} value={units(r.v)}
          formula={didatico ? undefined : 'v = 100 (base)'}
          accent="text-red-300" fonte="modelo do app"
          tip={didatico ? 'O que a empresa paga em salários — a única parte que compra "trabalho vivo".' : undefined} />
        <MetricCard label={didatico ? 'Lucro novo produzido' : 'Mais-valia m'} value={units(r.m)}
          formula={didatico ? undefined : 'm = e·v'}
          accent="text-emerald-300" fonte="modelo do app"
          tip={didatico ? 'Nasce do tempo de trabalho não pago — só existe porque há trabalhadores.' : undefined} />
        <MetricCard label={didatico ? 'Valor total produzido' : 'Valor novo C′'} value={units(r.W)} fonte="modelo do app" />
      </div>
    </div>
  )
}
