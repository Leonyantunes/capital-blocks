import { AnimatePresence, m } from 'framer-motion'
import Tip from '../ui/Tip'
import { MMT_BR, SOVEREIGN_STEPS } from '../../data/theory'
import { useApp } from '../../store/useApp'

export type FiscalLens = 'ortodoxa' | 'mmt'

export function FiscalLensToggle({ lens, setLens }: { lens: FiscalLens; setLens: (l: FiscalLens) => void }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">
        Lente monetária — como explicar a dívida?
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        <button onClick={() => setLens('ortodoxa')}
          className={`rounded-lg border px-3 py-2 text-left transition-colors ${
            lens === 'ortodoxa' ? 'border-sky-400/70 bg-sky-400/10' : 'border-zinc-800 hover:border-zinc-600'
          }`}>
          <div className={`text-xs font-bold ${lens === 'ortodoxa' ? 'text-sky-300' : 'text-zinc-300'}`}>
            Visão Ortodoxa (dominante)
          </div>
          <div className="text-[10.5px] leading-snug text-zinc-500">
            “Estado-família”: austeridade e restrição orçamentária
          </div>
        </button>
        <button onClick={() => setLens('mmt')}
          className={`rounded-lg border px-3 py-2 text-left transition-colors ${
            lens === 'mmt' ? 'border-emerald-400/70 bg-emerald-400/10' : 'border-zinc-800 hover:border-zinc-600'
          }`}>
          <div className={`text-xs font-bold ${lens === 'mmt' ? 'text-emerald-300' : 'text-zinc-300'}`}>
            Visão Heterodoxa / MMT
          </div>
          <div className="text-[10.5px] leading-snug text-zinc-500">
            Soberania monetária & restrição de recursos reais
          </div>
        </button>
      </div>
    </div>
  )
}

/** Painel da narrativa dominante — cada tese com o contraponto anotado. */
export function OrthodoxPanel() {
  const claims = [
    {
      tese: '“O Estado gasta como uma família: precisa arrecadar antes de gastar.”',
      contra: 'Operacionalmente é o INVERSO: o gasto público cria a moeda que depois é tributada. Família usa a moeda; o Estado a emite.',
    },
    {
      tese: '“Dívida acima de X% do PIB = risco de calote iminente / fardo dos netos.”',
      contra: 'Japão convive com ~230–250% há décadas sem default. Calote involuntário exige dívida em moeda ALHEIA (Grécia/euro). Os “netos” herdariam títulos nas carteiras deles — não uma conta zerada.',
    },
    {
      tese: '“Superávit primário é o caminho para derrubar a razão dívida/PIB.”',
      contra: 'Austeridade encolhe o PIB (denominador) via demanda efetiva: a razão pode PIORAR cortando gastos. r×D − g×D domina o resultado.',
    },
    {
      tese: '“O mercado financeiro pune governos irresponsáveis com juros altos.”',
      contra: 'Quem “pune” são os detentores de títulos exigindo prêmio: interesse de classe na taxa alta. Juro alto infla a dívida indexada à Selic sem um real novo de gasto.',
    },
  ]
  return (
    <m.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-sky-400/40 bg-sky-400/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-1.5">
        <h3 className="text-sm font-bold text-sky-300">A metáfora burguesa do Estado-família</h3>
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-500">
          narrativa predominante · mídia/rating agencies
        </span>
      </div>
      <ul className="mt-2 space-y-2.5">
        {claims.map((c) => (
          <li key={c.tese} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
            <p className="text-xs font-medium leading-relaxed text-zinc-200">{c.tese}</p>
            <Tip text="Contraponto heterodoxo documentado em THEORY.md, Pilar 3.">
              <p className="mt-1 cursor-help rounded bg-red-400/10 px-2 py-1 text-[11px] leading-snug text-red-300">
                ✕ {c.contra}
              </p>
            </Tip>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] leading-snug text-zinc-600">
        Esta lente descreve como a ortodoxia explica a dívida — mantida no app como objeto
        de crítica, nunca como autoridade normativa.
      </p>
    </m.section>
  )
}

/** Painel MMT — operacionalização moeda × dívida + caso Brasil (soberania parcial). */
export function SovereignPanel() {
  const mode = useApp((s) => s.mode)
  const didatico = mode === 'didatico'
  return (
    <m.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3">
      {/* passos operacionais */}
      <div className="grid gap-2 md:grid-cols-3">
        {SOVEREIGN_STEPS.map((st) => (
          <article key={st.t} className="rounded-xl border border-emerald-400/40 bg-emerald-400/5 p-3">
            <h4 className="text-xs font-bold text-emerald-300">{st.t}</h4>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{didatico ? st.didatico : st.avancado}</p>
          </article>
        ))}
      </div>

      {/* Brasil: soberania parcial */}
      <div className="rounded-xl border p-4" style={{ borderColor: '#ffc10744', background: '#ffc10708' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-money">Caso Brasil: soberania monetária PARCIAL</h3>
          <Tip text={MMT_BR.armadilhaRentista}>
            <span className="cursor-help rounded bg-money/15 px-2 py-0.5 font-mono text-[10px] text-money">armadilha Selic ↗</span>
          </Tip>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat label="Dívida interna em reais" value={`≈${MMT_BR.dividaInternaReaisPct}%`} sub="da dívida pública federal" tip="Quase toda a dívida brasileira é interna e denominada em reais: o país paga em moeda que EMITE." />
          <MiniStat label="Estrangeiros nos títulos" value={`<${MMT_BR.estrangeirosPctMax}%`} sub="baixa exposição externa hoje" tip="Ao contrário dos anos 80, a dívida atual não depende de rolagem em dólar." />
          <MiniStat label="Soberania" value="Parcial" sub={MMT_BR.soberania} tip="Moeda própria e flutuante — mas economia aberta dependente de divisas para importar insumos críticos." />
          <MiniStat label="Restrição REAL" value="Recursos" sub={didatico ? 'inflação + capacidade produtiva + câmbio' : MMT_BR.restricaoReal} tip="O limite do gasto público brasileiro é inflação e gargalo cambial — não escassez de reais." />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
          {didatico
            ? `Tradução: o Brasil NÃO pode falir em real (emite o real!), mas pode sofrer com inflação e falta de dólares — e a taxa de juros altíssima transfere bilhões por ano aos donos dos títulos. Duas restrições diferentes, duas conversas diferentes.`
            : `${MMT_BR.armadilhaRentista} Restrição externa (TMD): serviços de dívida/remessas drenam divisas — ver bloco TMD no drawer do Brasil.`}
        </p>
      </div>

      {/* espelho déficit = ativo líquido */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h4 className="text-sm font-semibold text-zinc-100">O espelho contábil: déficit de um lado = ativo líquido do outro</h4>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-fuchsia-400/40 bg-fuchsia-400/5 p-2.5 text-center">
            <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">Governo (G − T)</div>
            <div className="font-mono text-lg font-bold text-fuchsia-300">−R$ 100 bi déficit</div>
          </div>
          <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/5 p-2.5 text-center">
            <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">Setor privado (+ resto)</div>
            <div className="font-mono text-lg font-bold text-emerald-300">+R$ 100 bi líquido</div>
          </div>
        </div>
        <div className="mx-auto my-2 h-6 w-px bg-gradient-to-b from-fuchsia-400 to-emerald-400" />
        <p className="text-center text-[11px] leading-relaxed text-zinc-400">
          {didatico
            ? 'A “dívida” do governo é, exatamente, a riqueza financeira acumulada por empresas, bancos e famílias em títulos públicos. Cortar o déficit = secar essa poupança.'
            : '(S−I) ≡ (G−T)+(X−M): austeridade transfere o ajuste para o balanço privado — quem absorve o encaixe negativo decide a crise.'}
        </p>
      </div>
    </m.section>
  )
}

function MiniStat({ label, value, sub, tip }: { label: string; value: string; sub: string; tip?: string }) {
  return (
    <Tip text={tip ?? ''}>
      <div className="h-full cursor-help rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 transition-colors hover:border-zinc-600">
        <div className="text-[9px] uppercase tracking-widest text-zinc-500">{label}</div>
        <div className="mt-0.5 font-mono text-base font-extrabold text-zinc-100">{value}</div>
        <div className="text-[9.5px] leading-tight text-zinc-500">{sub}</div>
      </div>
    </Tip>
  )
}

export function LensPanels({ lens }: { lens: FiscalLens }) {
  return (
    <AnimatePresence mode="wait">
      {lens === 'ortodoxa' ? (
        <m.div key="ortho" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <OrthodoxPanel />
        </m.div>
      ) : (
        <m.div key="mmt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SovereignPanel />
        </m.div>
      )}
    </AnimatePresence>
  )
}
