import { useState } from 'react'
import { m } from 'framer-motion'
import DonutChart from './DonutChart'
import MmtPanel from './MmtPanel'
import { FiscalLensToggle, LensPanels, type FiscalLens } from './debt/FiscalLensPanels'
import KaleckiSimulator from './debt/KaleckiSimulator'
import TheoryCompareCard from './TheoryCompareCard'
import ModeBadge from './ui/ModeBadge'
import { BUDGET_BR, DEATH_STEPS } from '../data/debt'
import { mt } from '../i18n'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'

function BudgetDashboard() {
  const segments = BUDGET_BR.map((b) => ({ key: b.key, label: b.label, value: b.pct, color: b.color }))
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-sm font-semibold text-zinc-100">Para onde vai cada R$100 do orçamento da União</h3>
      <p className="mt-0.5 text-xs text-zinc-500">
        A dívida devora metade — antes de uma única consulta ou aula ser paga.
      </p>
      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row">
        <DonutChart segments={segments} centerLabel="orçamento" centerValue="R$100" />
        <ul className="w-full space-y-1.5">
          {BUDGET_BR.map((b) => (
            <li key={b.key}>
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: b.color }} />
                  <span className="truncate text-[11px] text-zinc-300">{b.label}</span>
                </span>
                <span className={`shrink-0 font-mono text-xs font-bold ${b.key === 'divida' ? 'text-fuchsia-300' : 'text-zinc-400'}`}>
                  {b.pct.toLocaleString('pt-BR')}%
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded bg-zinc-800">
                <m.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="h-full rounded"
                  style={{ background: b.color }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
        Valores aproximados para uso didático (Orçamento da União, despesa total incluindo rolagem). A fração
        "dívida" concentra juros + amortizações capturadas pelo capital portador de juros.
      </p>
    </div>
  )
}

export default function DebtModule() {
  const { mode, lang } = useApp()
  const [lens, setLens] = useState<FiscalLens>('mmt')
  const didatico = mode !== 'avancado'

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300">{mt(lang, 'debt').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'debt').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {didatico
            ? 'O que o Estado faz dentro do capitalismo? Quem paga — e quem recebe? Aqui a dívida é explicada em DUAS lentes: a ortodoxa (dominante) e a heterodoxa (MMT), sempre com a leitura marxista de quem captura os juros.'
            : 'Ciclo da sobreacumulação → título público → capitalização de juros; operacionalidade monetária soberana (MMT) e equação kaleckiana dos lucros. Três lentes sobre o mesmo fluxo fiscal.'}
        </p>
      </header>

      <FiscalLensToggle lens={lens} setLens={setLens} />
      <LensPanels lens={lens} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Fluxograma animado */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h3 className="mb-3 text-sm font-semibold text-zinc-100">O ciclo da dívida, passo a passo</h3>
          <ol className="relative space-y-3 pl-6">
            {/* trilha vertical */}
            <span aria-hidden className="absolute bottom-2 left-[9px] top-2 w-px overflow-hidden bg-zinc-800">
              <span className="trail-dot absolute left-1/2 block h-8 w-[3px] -translate-x-1/2 rounded bg-fuchsia-400/80" />
            </span>
            {DEATH_STEPS.map((s, i) => (
              <m.li key={s.n}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
              >
                <span className="absolute -left-[22px] top-3.5 flex h-5 w-5 items-center justify-center rounded-full border font-mono text-[10px] font-bold"
                  style={{ borderColor: s.accent, color: s.accent, background: '#161b22' }}>
                  {s.n}
                </span>
                <h4 className="text-sm font-semibold" style={{ color: s.accent }}>{s.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-300">{textoPorModo(mode, s.didatico, s.avancado)}</p>
              </m.li>
            ))}
          </ol>
        </div>

        <BudgetDashboard />
      </div>

      <div className="rounded-xl border border-dashed border-fict/40 bg-fict/5 p-4">
        <p className="text-xs leading-relaxed text-zinc-300">
          <strong className="text-fuchsia-300">Capital fictício</strong> (Marx, Livro III): o título público não é
          capital — é um <em>direito sobre renda futura</em>, cujo preço nasce da capitalização dos juros prometidos.
          Quanto maior a Selic, mais o Estado transfere de valor novo para quem já tem.{' '}
          <span className="text-zinc-500">Mas há uma segunda leitura sobre a dívida — a MMT. Veja abaixo.</span>
        </p>
      </div>

      <MmtPanel />

      <KaleckiSimulator />

      <TheoryCompareCard />
    </div>
  )
}
