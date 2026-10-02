import MetricCard from './MetricCard'
import Tip from './ui/Tip'
import { PRESETS, computeCircuit, fmtHours, pct, units, unpaidHours } from '../lib/marx'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'

export default function ControlsPanel() {
  const { k, e, setK, setE, mode } = useApp()
  const r = computeCircuit(k, e)
  const didatico = mode !== 'avancado'

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {textoPorModo(mode, 'Mexa na simulação', 'Parâmetros da simulação', 'Teste o que muda')}
      </h3>

      {/* Nível de automação / composição orgânica */}
      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label htmlFor="slider-k" className="text-sm text-zinc-300">
            {mode === 'avancado' ? (
              <>Composição orgânica <span className="font-mono text-zinc-500">k = c/v</span></>
            ) : textoPorModo(mode, 'Nível de Automação', 'Nível de Automação', 'Máquinas por trabalhador')}
          </label>
          <Tip text={textoPorModo(
            mode,
            'Quantas máquinas e matérias-primas para cada trabalhador. Suba para "automatizar".',
            'k = c/v: razão entre capital constante e variável.',
            'Quanto a empresa usa de máquinas e materiais em comparação com a quantidade de trabalho.',
          )}>
            <span className="cursor-help font-mono text-sm font-semibold text-sky-300">{r.k.toFixed(1)}</span>
          </Tip>
        </div>
        <input id="slider-k" type="range" min={0.5} max={14} step={0.1}
          value={k} onChange={(ev) => setK(parseFloat(ev.target.value))} />
        <p className="mt-1 text-[11px] leading-tight text-zinc-500">
          {textoPorModo(
            mode,
            'Mais robôs e matérias-primas por pessoa — menos gente empregada por real investido.',
            'Automação ↑ ⇒ mais máquina (c), menos trabalho vivo (v).',
            'Para o mesmo investimento, aumentar este controle significa usar mais máquinas e materiais por trabalhador.',
          )}
        </p>
      </div>

      {/* Intensidade de exploração / taxa de mais-valia */}
      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label htmlFor="slider-e" className="text-sm text-zinc-300">
            {mode === 'avancado' ? (
              <>Taxa de mais-valia <span className="font-mono text-zinc-500">e = m/v</span></>
            ) : textoPorModo(mode, 'Intensidade de Exploração', 'Intensidade de Exploração', 'Tempo de trabalho não pago')}
          </label>
          <Tip text={textoPorModo(
            mode,
            `Jornada de 8h: ${fmtHours(unpaidHours(e))} são trabalho gratuito para a empresa.`,
            'e = m/v: mais-valia dividida pelo capital variável.',
            `Em uma jornada de 8h, este modelo representa ${fmtHours(unpaidHours(e))} além do tempo equivalente ao salário.`,
          )}>
            <span className="cursor-help font-mono text-sm font-semibold text-red-300">{pct(e * 100, 0)}</span>
          </Tip>
        </div>
        <input id="slider-e" type="range" min={0.5} max={5} step={0.05}
          value={e} onChange={(ev) => setE(parseFloat(ev.target.value))} />
        <p className="mt-1 text-[11px] leading-tight text-zinc-500">
          {textoPorModo(
            mode,
            `Quanto do dia é trabalho gratuito: hoje, ${fmtHours(unpaidHours(e))} das 8 horas.`,
            'Intensidade da exploração: jornada, produtividade e salário real.',
            `O modelo separa ${fmtHours(unpaidHours(e))} das 8 horas como tempo além do equivalente ao salário.`,
          )}
        </p>
      </div>

      {/* Presets históricos gamificados */}
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-widest text-zinc-500">
          {textoPorModo(mode, 'Viaje no tempo', 'Presets históricos', 'Veja exemplos históricos')}
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
                {mode === 'simples' ? (
                  <span className="ml-1 font-mono text-[10px] opacity-70">
                    máquinas {p.k} · {fmtHours(unpaidHours(p.e))} além do salário
                  </span>
                ) : (
                  <span className="ml-1 font-mono text-[10px] opacity-60">
                    k={p.k} · e={p.e}
                  </span>
                )}
                {mode === 'didatico' && (
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
        <MetricCard label={textoPorModo(mode, 'Investimento em máquinas', 'Capital constante c', 'Máquinas e materiais')} value={units(r.c)}
          formula={didatico ? undefined : 'c = k·v'} accent="text-sky-300" fonte="modelo do app"
          tip={textoPorModo(
            mode,
            'Matérias-primas, fábricas e máquinas usadas pela empresa na produção.',
            'Capital constante: meios de produção que transferem seu valor ao produto.',
            'Tudo o que a empresa usa para produzir, como máquinas, prédios e materiais.',
          )} />
        <MetricCard label={textoPorModo(mode, 'Folha de salários', 'Capital variável v', 'Salários')} value={units(r.v)}
          formula={didatico ? undefined : 'v = 100 (base)'}
          accent="text-red-300" fonte="modelo do app"
          tip={textoPorModo(
            mode,
            'O total que a empresa paga às pessoas que trabalham neste exemplo.',
            'Capital variável: parcela adiantada em salários para comprar força de trabalho.',
            'Quanto a empresa paga em salários neste exemplo.',
          )} />
        <MetricCard label={textoPorModo(mode, 'Lucro novo produzido', 'Mais-valia m', 'Valor que fica depois dos salários')} value={units(r.m)}
          formula={didatico ? undefined : 'm = e·v'}
          accent="text-emerald-300" fonte="modelo do app"
          tip={textoPorModo(
            mode,
            'No modelo, é a parte do valor produzido que fica com a empresa depois da parcela equivalente aos salários.',
            'Mais-valia: valor excedente produzido além do equivalente ao salário, m = e·v.',
            'A parte do valor produzido que o modelo separa da parcela equivalente aos salários.',
          )} />
        <MetricCard label={textoPorModo(mode, 'Valor total produzido', 'Valor novo C′', 'Valor total do exemplo')} value={units(r.W)} fonte="modelo do app" />
      </div>
    </div>
  )
}
