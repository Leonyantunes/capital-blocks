import { useState } from 'react'
import { m } from 'framer-motion'
import WarMap from './WarMap'
import ConflictDrawer from './ConflictDrawer'
import { WAR_EPOCHS, WAR_CONFLICTS, SUPPLIERS } from '../../data/wars'
import Tip from '../ui/Tip'
import ModeBadge from '../ui/ModeBadge'
import { mt } from '../../i18n'
import { useApp } from '../../store/useApp'

/** Teoria — a guerra como necessidade estrutural do capital (dual-mode). */
function TheoryCards() {
  const didatico = useApp((s) => s.mode) !== 'avancado'
  const cards = [
    {
      color: '#ef5350',
      t: didatico ? 'A guerra "limpa o tabuleiro"' : 'Destruição de c & sobreacumulação',
      d: didatico
        ? 'Quando as fábricas produzem mais do que dá para vender lucrativamente, o capital fica estagnado. A guerra DESTRÓI fábricas, pontes e cidades inteiras — e reconstruir tudo reabre um mercado gigante e rentável. O lucro global respira.'
        : 'Destruição física do capital constante resolve a sobreacumulação: a reconstrução abre novos campos de investimento e eleva temporariamente g = m/(c+v) global. Padrão 1929→1939→1945; Ucrânia como laboratório contemporâneo.',
    },
    {
      color: '#ffc107',
      t: didatico ? 'O negócio mais seguro do mundo' : 'Complexo militar-industrial: captura do Estado',
      d: didatico
        ? 'Quem vende armas tem o MELHOR cliente possível: o Estado. Não há concorrência de verdade, não há crise que corte o pedido — o orçamento público vira lucro privado garantido, pago com impostos e dívida.'
        : 'Demanda estatal inelástica + contratos cost-plus eliminam risco de realização; porta giratória Pentágono↔conselhos consolida fração rentista. SIPRI Top-100: US$632 bi/ano em receita de armamento.',
    },
    {
      color: '#ba68c8',
      t: didatico ? 'Briga pelo bolo mundial' : 'Partilha imperialista: recursos, rotas e moeda',
      d: didatico
        ? 'Por trás de cada guerra grande há uma disputa por coisas concretas: petróleo, minerais raros, chips, rotas comerciais e qual moeda manda no comércio mundial. Impérios crescem até esbarrar uns nos outros — e aí a conversa acaba em tiros.'
        : 'Lenin (Imperialismo, estágio superior): exportação de capitais exige proteção territorial; a repartição do mundo é renegociada pela força quando a correlação econômica muda. Hegemonia monetária (petrodólar × desdolarização) é o troféu final.',
    },
  ]
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cards.map((c, i) => (
        <m.article key={c.t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border p-4" style={{ borderColor: `${c.color}44`, background: `${c.color}08` }}>
          <h3 className="text-sm font-bold" style={{ color: c.color }}>{c.t}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{c.d}</p>
        </m.article>
      ))}
    </div>
  )
}

/** Linha do tempo reversa 2026 → 1914. */
function EpochTimeline({ epochIndex, setEpochIndex }: {
  epochIndex: number
  setEpochIndex: (i: number) => void
}) {
  const ep = WAR_EPOCHS[epochIndex]
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-extrabold" style={{ color: ep.color }}>{ep.faixa}</span>
          <span className="text-sm font-semibold text-zinc-200">{ep.rotuloCurto}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">linha do tempo reversa</span>
      </div>
      <input
        type="range" min={0} max={WAR_EPOCHS.length - 1} step={1} value={epochIndex}
        onChange={(e) => setEpochIndex(parseInt(e.target.value))}
        className="mt-2 range-labor"
        aria-label="Viajar no tempo das guerras"
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-500">
        {WAR_EPOCHS.map((e, i) => (
          <button key={e.id} onClick={() => setEpochIndex(i)}
            className={`transition-colors hover:text-zinc-200 ${i === epochIndex ? 'font-bold' : ''}`}
            style={i === epochIndex ? { color: e.color } : undefined}>
            {e.from}
          </button>
        ))}
        <span>← 2026 · voltar no tempo →</span>
      </div>

      {/* conflitos da época */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {WAR_CONFLICTS.filter((c) => c.epoch === epochIndex).map((c) => (
          <span key={c.id} className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10.5px] text-zinc-400">
            {c.curto} <span className="font-mono text-[9px] text-zinc-600">{c.periodo}</span>
          </span>
        ))}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-zinc-300">{ep.introDidatico}</p>
      <p className="mt-1.5 rounded-lg bg-zinc-950/70 p-2 font-mono text-[10.5px] leading-relaxed text-zinc-500">
        [avançado] {ep.introAvancado}
      </p>
    </div>
  )
}

/** Tabela dos gigantes do complexo militar-industrial. */
function DefenseGiants() {
  const list = Object.values(SUPPLIERS).filter((s) => s.defesaBi)
  const max = Math.max(...list.map((s) => s.defesaBi ?? 0))
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-100">Os gigantes do Complexo Militar-Industrial</h3>
        <Tip text='Contexto: as 100 maiores contratadas de defesa do mundo faturaram ~US$632 bilhões num único ano (SIPRI). Estes são os principais nomes.'>
          <span className="cursor-help font-mono text-[10px] text-zinc-500">SIPRI Top-100 ≈ US$632 bi/ano ↗</span>
        </Tip>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {list.map((s) => (
          <article key={s.id} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-zinc-100">{s.nome}</h4>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">{s.pais}</span>
              </div>
              <span className="font-mono text-base font-extrabold text-money">≈${s.defesaBi} bi<span className="ml-1 text-[9px] font-normal text-zinc-600">defesa/ano</span></span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-money"
                style={{ width: `${((s.defesaBi ?? 0) / max) * 100}%` }} />
            </div>
            <div className="mt-1.5 text-[11px] text-zinc-400">{s.setor}</div>
            <div className="mt-0.5 text-[10.5px] leading-snug text-emerald-300/90">{s.destaque}</div>
          </article>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
        Receitas de defesa aproximadas dos relatórios anuais FY2024 (segmento militar).
        Rostec: estatal russa, estimativa consolidada. Rheinmetall: crescimento acelerado
        (+~35%/ano) desde 2022.
      </p>
    </section>
  )
}

export default function WarModule() {
  const [epochIndex, setEpochIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400">{mt(lang, 'war').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">
          Guerra de Capitais & Conflitos Imperialistas
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {mode !== 'avancado'
            ? 'Guerra não é acidente nem “loucura humana”: na maior parte dos casos, alguém LUCRA com ela — antes, durante e depois. Siga o dinheiro: quem fabrica, quem financia, quem reconstrói. Viaje de 2026 até 1914 e veja o padrão se repetir.'
            : 'A guerra como continuação da concorrência inter-capitalista por outros meios: destruição de c, socialização fiscal dos custos, privatização das margens. Cinco épocas, mesmo mecanismo estrutural.'}
        </p>
      </header>

      <TheoryCards />

      <EpochTimeline epochIndex={epochIndex} setEpochIndex={setEpochIndex} />

      <WarMap epochIndex={epochIndex} onSelect={setSelected} selectedId={selected} />

      <DefenseGiants />

      <ConflictDrawer conflictId={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
