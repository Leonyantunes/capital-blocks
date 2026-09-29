import CircuitDiagram from './CircuitDiagram'
import ControlsPanel from './ControlsPanel'
import MetricCard from './MetricCard'
import ProfitCurve from './ProfitCurve'
import { UnpaidClock } from './Clocks'
import Tip from './ui/Tip'
import ModeBadge from './ui/ModeBadge'
import { computeCircuit, fmtHours, pct, units, unpaidHours } from '../lib/marx'
import { mt, modRef } from '../i18n'
import { useApp } from '../store/useApp'

function UnpaidWorkCard() {
  const { e, mode } = useApp()
  const r = computeCircuit(1, e)
  const minutes = unpaidHours(e) * 60
  const paid = 8 * 60 - minutes
  const hUnpaid = Math.floor(minutes / 60)
  const mUnpaid = Math.round(minutes % 60)
  const hPaid = Math.floor(paid / 60)
  const mPaid = Math.round(paid % 60)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-4">
          <UnpaidClock minutesUnpaid={minutes} size={170} />
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              {mode === 'didatico' ? 'Seu dia de trabalho em 8 horas' : 'Tradutor: trabalho não pago na jornada'}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
              Em uma jornada de 8 horas, você trabalha{' '}
              <span className="font-mono font-bold text-emerald-300">
                {String(hUnpaid).padStart(2, '0')}h {String(mUnpaid).padStart(2, '0')}min
              </span>{' '}
              para a empresa — e apenas{' '}
              <span className="font-mono font-bold text-red-300">
                {String(hPaid).padStart(2, '0')}h {String(mPaid).padStart(2, '0')}min
              </span>{' '}
              paga o seu salário.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {mode === 'didatico'
                ? 'A parte verde é o tempo em que você produz lucro de graça. Suba a intensidade de exploração e veja o verde engolir o seu dia.'
                : `Horas Não Pagas = 8 · m/(m+v) = 8 · ${r.e.toFixed(2)}/${(r.e + 1).toFixed(2)} = ${fmtHours(minutes / 60)} — equivalente material da taxa de mais-valia.`}
            </p>
          </div>
        </div>

        {/* barra de progresso explicativa */}
        <div className="min-w-[220px] flex-1">
          <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider">
            <span className="text-red-300">Para você ({fmtHours(paid / 60)})</span>
            <span className="text-emerald-300">De graça p/ empresa ({fmtHours(minutes / 60)})</span>
          </div>
          <div className="flex h-5 w-full overflow-hidden rounded-lg border border-zinc-800">
            <div className="bg-red-400 transition-all duration-300" style={{ width: `${(paid / 480) * 100}%` }} />
            <div className="bg-emerald-400 transition-all duration-300" style={{ width: `${(minutes / 480) * 100}%` }} />
          </div>
          <Tip text={mode === 'didatico'
            ? 'Arraste o slider "Intensidade de Exploração" acima para mudar este relógio.'
            : 'Derivado diretamente de e = m/v no circuito acima.'}>
            <div className="mt-2 inline-block cursor-help rounded bg-zinc-800/80 px-2 py-1 font-mono text-[10px] text-zinc-400">
              e = m/v = {(e * 100).toFixed(0)}% → jornada {((unpaidHours(e) / 8) * 100).toFixed(0)}% gratuita
            </div>
          </Tip>
        </div>
      </div>
    </div>
  )
}

export default function CircuitModule() {
  const { k, e, mode, lang } = useApp()
  const r = computeCircuit(k, e)
  const didatico = mode === 'didatico'

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">{mt(lang, 'circuit').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'circuit').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {didatico ? (
            <>
              Toda riqueza começa com dinheiro que vira máquinas + trabalho, passa pela produção e volta como MAIS
              dinheiro. A pergunta central:{' '}
              <span className="text-zinc-200">de onde sai esse “mais”?</span> Mexa nos controles e descubra.
            </>
          ) : (
            <>
              Anatomia metamórfica do ciclo produtivo:{' '}
              <span className="rounded bg-zinc-800/90 px-1.5 py-0.5 font-mono text-[13px] text-zinc-200">
                M — C(L/MP) … P … C′ — M′
              </span>{' '}
              Ajuste a composição orgânica e a taxa de exploração para ver onde a mais-valia nasce.
            </>
          )}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <ControlsPanel />
        <div className="flex flex-col gap-4">
          <CircuitDiagram />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {didatico ? (
              <>
                <MetricCard label="O patrão investe" value={units(r.M)} sub="dinheiro inicial" accent="text-money" />
                <MetricCard label="Lucro extraído" value={units(r.m)} sub="produzido por quem trabalha" accent="text-emerald-300"
                  tip="Este valor nasce APENAS no processo P — do trabalho além do que é pago." />
                <MetricCard label="Nível de automação" value={r.k.toFixed(1)} sub="máquinas por trabalhador" accent="text-sky-300"
                  tip="Quanto mais máquinas relativas, menos trabalho vivo — e menos fonte de lucro." />
                <MetricCard label="Ganho dos donos" value={pct(r.profitRate)} sub={`a cada ${units(r.M)} investidos`}
                  accent={r.profitRate < 20 ? 'text-red-300' : 'text-emerald-300'}
                  tip="Automação demais faz esse número cair — mesmo com trabalhadores exploradíssimos." />
              </>
            ) : (
              <>
                <MetricCard label="Capital adiantado M" value={`${r.M.toFixed(0)}`} sub="c + v" formula="M = c+v" accent="text-money" />
                <MetricCard label="Taxa de lucro g" value={`${r.profitRate.toFixed(1)}%`} sub="sobre o capital total" formula="g = m/(c+v)" accent={r.profitRate < 20 ? 'text-red-300' : 'text-emerald-300'} />
                <MetricCard label="Composição orgânica" value={r.k.toFixed(1)} sub="c / v" formula="k = c/v" accent="text-sky-300" />
                <MetricCard label="Taxa de mais-valia" value={`${(r.e * 100).toFixed(0)}%`} sub="grau de exploração" formula="e = m/v" accent="text-red-300" />
              </>
            )}
          </div>
        </div>
      </div>

      <UnpaidWorkCard />

      {didatico && (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* história em 3 passos */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h3 className="text-sm font-bold text-zinc-100">A história inteira em 3 passos</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {[
                { n: '1', t: 'O patrão investe', d: 'compra máquinas e paga salários', color: '#ffc107' },
                { n: '2', t: 'Você trabalha', d: 'e produz TODA a riqueza do produto', color: '#f44336' },
                { n: '3', t: 'Ele vende e lucra', d: 'fica com o pedaço que você não recebeu', color: '#4caf50' },
              ].map((s, i, arr) => (
                <div key={s.n} className="flex items-center gap-2">
                  <div className="rounded-lg border p-2.5" style={{ borderColor: `${s.color}66`, background: `${s.color}0d` }}>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold"
                        style={{ background: s.color, color: '#0d1117' }}>{s.n}</span>
                      <span className="text-xs font-bold" style={{ color: s.color }}>{s.t}</span>
                    </div>
                    <div className="mt-0.5 text-[10.5px] text-zinc-400">{s.d}</div>
                  </div>
                  {i < arr.length - 1 && <span className="text-zinc-600">→</span>}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
              O segredo está entre o passo 2 e o 3: o produto sai valendo MAIS do que custou pagar por ele. Esse
              “mais” é o trabalho não pago — o relógio acima mostra exatamente quantas horas ele representa.
            </p>
          </div>

          {/* termômetro do lucro */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h3 className="text-sm font-bold text-zinc-100">Termômetro do lucro</h3>
            <div className="mt-3">
              <div className="relative h-5 w-full overflow-visible rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400">
                <div className="absolute -top-1.5 h-8 w-1.5 rounded-full bg-white shadow-lg ring-2 ring-zinc-950"
                  style={{ left: `calc(${Math.min(Math.max(r.profitRate, 0), 100).toFixed(1)}% - 3px)` }} />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[9px] text-zinc-500">
                <span>0% (prejuízo)</span><span>50%</span><span>100%</span>
              </div>
              <p className="mt-2 font-mono text-sm font-bold text-zinc-100">
                a cada R$100 investidos, voltam <span className="text-money">R${r.profitRate.toFixed(0)}</span> de lucro
              </p>
              <p className="mt-1 text-[10.5px] leading-snug text-zinc-500">
                mexa os sliders e veja o ponteiro: mais automação = ponteiro escorregando para a esquerda.
              </p>
            </div>
          </div>
        </div>
      )}

      {didatico ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed border-sky-400/40 bg-sky-400/5 p-4">
            <h4 className="text-sm font-bold text-sky-300">Por que a automação derruba o lucro?</h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              Máquinas não pedem aumento — mas também <strong>não produzem lucro novo</strong>. Só o trabalho vivo
              gera valor. Quanto mais robôs e menos gente, menor o ganho sobre todo o capital investido. É a
              “tendência de queda do lucro”.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-fuchsia-400/40 bg-fuchsia-400/5 p-4">
            <h4 className="text-sm font-bold text-fuchsia-300">Bancos × produção real</h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              Nem todo capital passa pela fábrica: bancos vivem de <span className="font-mono">M—M′</span> (emprestar
              para receber mais). Esse ganho financeiro é descontado — no juro, no aluguel, na dívida pública — do
              valor que só a produção real criou.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-money/40 bg-money/5 p-4 sm:col-span-2">
            <h4 className="text-sm font-bold text-money">Mas… quem garante que C′ será VENDIDO? (Keynes & Kalecki)</h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              O circuito mostra como o valor nasce — não se ele será realizado. Isso depende da{' '}
              <strong>demanda efetiva</strong>: alguém precisa comprar o produto sob incerteza. Por isso déficit
              público sustenta vendas e lucros, e por isso “todo mundo poupar de uma vez” derruba a economia inteira
              (paradoxo da parcimônia). Veja o simulador no {modRef('debt')}.
            </p>
          </div>
        </div>
      ) : (
        <ProfitCurve />
      )}
    </div>
  )
}
