import { useState } from 'react'
import { m } from 'framer-motion'
import Tip from '../ui/Tip'
import ModeBadge from '../ui/ModeBadge'
import { COOP_STATS, ALT_CASES, PAY_RATIOS, JG } from '../../data/alternatives'
import { mt } from '../../i18n'
import { useApp } from '../../store/useApp'

/** Pirâmide salarial interativa: cooperativa × corporações. */
function PayPyramid() {
  const [sel, setSel] = useState(PAY_RATIOS[0].id)
  const chosen = PAY_RATIOS.find((p) => p.id === sel)!
  const max = PAY_RATIOS[PAY_RATIOS.length - 1].ratio
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-sm font-bold text-zinc-100">A pirâmide salarial é uma ESCOLHA</h3>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
        Quantas vezes o salário do topo é maior que o da base? Mexa nas opções — a diferença não é “natureza”,
        é regra interna aprovada (ou imposta).
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {PAY_RATIOS.map((p) => (
          <button key={p.id} onClick={() => setSel(p.id)} title={p.nota}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              sel === p.id ? 'border-transparent text-onaccent' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            style={sel === p.id ? { background: p.color } : undefined}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        <div>
          <div className="mb-1 flex justify-between text-[10.5px]">
            <span className="text-zinc-400">Salário do topo ÷ salário da base</span>
            <span className="font-mono font-bold" style={{ color: chosen.color }}>{chosen.ratio}:1</span>
          </div>
          <div className="h-6 w-full overflow-hidden rounded-lg bg-zinc-800/70">
            <m.div animate={{ width: `${(chosen.ratio / max) * 100}%` }}
              transition={{ type: 'spring', stiffness: 110, damping: 20 }}
              className="h-full rounded-lg" style={{ background: chosen.color }} />
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950/70 p-2.5 text-[11px] leading-relaxed text-zinc-300">
          {didaticoText(chosen.ratio)}
        </div>
      </div>
    </div>
  )
}

function didaticoText(r: number) {
  if (r <= 10)
    return `No topo da cooperativa, 1 pessoa ganha ${r} salários de base. Na corporação equivalente do topo da lista, seriam centenas. A diferença não vem da “genialidade” do CEO — vem de quem define as regras.`
  return `O topo ganha ${r} vezes a base — ou seja, ${r} salários por mês. Em uma jornada de 40 anos, a base acumula o que o topo recebe em ${(40 / (r / 12) * 12).toFixed(0)} meses... de trabalho. O resto é estrutura de poder.`
}

/** Simulador da Garantia de Emprego (MMT). */
function JobGuaranteeSim() {
  const [participantes, setParticipantes] = useState(12) // milhões
  const [salario, setSalario] = useState(1518)
  const lang = useApp((s) => s.lang)
  const didatico = useApp((s) => s.mode) === 'didatico'
  const custoBi = (participantes * 1e6 * salario * 13.3) / 1e9
  const pctPib = (custoBi / (JG.pibBrTri * 1000)) * 100
  const vsJuros = (custoBi / JG.jurosAnoBi) * 100

  return (
    <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-emerald-300">Simulador: Garantia de Emprego (MMT)</h3>
        <span className="font-mono text-[9.5px] text-zinc-500">Tcherneva · Wray · proposta viva</span>
      </div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-300">
        {didatico
          ? 'E se o Estado GARANTISSE um emprego com salário digno para todo mundo que quisesse trabalhar — em creches, reflorestamento, cuidado, cultura? Como emissor da moeda, ele pode pagar. O limite é real (inflação, capacidade), não financeiro. Simule:'
          : 'Employer of last resort: âncora salarial exógena que estabiliza demanda e precifica o piso do mercado de trabalho — custo limitado por capacidade real, financiado por soberania monetária (parcial no caso BR).'}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-zinc-300">Pessoas no programa</span>
            <span className="font-mono font-bold text-zinc-100">{participantes} mi</span>
          </div>
          <input type="range" min={5} max={30} step={1} value={participantes}
            onChange={(e) => setParticipantes(parseInt(e.target.value))} />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-zinc-300">Salário mensal</span>
            <span className="font-mono font-bold text-zinc-100">R$ {salario.toLocaleString('pt-BR')}</span>
          </div>
          <input type="range" min={1518} max={3000} step={50} value={salario}
            onChange={(e) => setSalario(parseInt(e.target.value))} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-950/70 p-2.5">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">Custo/ano</div>
          <div className="font-mono text-base font-extrabold text-emerald-300">
            R$ {custoBi.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} bi
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950/70 p-2.5">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">% do PIB</div>
          <div className="font-mono text-base font-extrabold text-zinc-100">{pctPib.toFixed(1)}%</div>
        </div>
        <div className="rounded-lg bg-zinc-950/70 p-2.5">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">vs juros da dívida (2024)</div>
          <div className="font-mono text-base font-extrabold text-money">{vsJuros.toFixed(0)}%</div>
        </div>
      </div>
      <p className="mt-2 text-[10.5px] leading-relaxed text-zinc-400">
        {didatico
          ? 'Compare com o terceiro número: gastamos com JUROS da dívida muito mais do que custaria empregar milhões de pessoas em coisas úteis. Não falta dinheiro — falta prioridade. E o programa ainda cria um PISO salarial: ninguém aceita menos que isso na iniciativa privada.'
          : 'Âncora salarial exógena: o custo do programa define o piso de fato do mercado privado; comparado ao serviço de juros (~R$900 bi/ano), o programa é fiscalmente trivial para um emissor parcialmente soberano — a restrição é inflação/capacidade, administrável via alocação setorial.'}
      </p>
    </div>
  )
}

/** MÓDULO 09 — E PARA ONDE PODEMOS IR? */
export default function AlternativesModule() {
  const lang = useApp((s) => s.lang)
  const didatico = useApp((s) => s.mode) === 'didatico'

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">{mt(lang, 'alternatives').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'alternatives').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {didatico
            ? 'Os módulos anteriores mostraram como o sistema machuca. Mas criticar sem apontar caminho é meio caminho. A boa notícia: alternativas NÃO são utopia — já existem, já funcionam, já escalam. Cooperativas com 70 mil pessoas sem patrão. Cidades onde o povo decide o orçamento. Um Nobel provando que comunidades cuidam de bens comuns melhor que empresas ou Estados. Conheça as provas:'
            : 'Terceiro ato: para além da crítica (Pilares 1–4), evidências empíricas de instituições não-capitalistas em escala — cooperativas de trabalho/produção/crédito, commons governados (Ostrom), produção entre pares, democracia fiscal e planejamento cibernético. O debate não é “mercado × Estado”: é sobre pluralismo institucional.'}
        </p>
      </header>

      {/* stats */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {COOP_STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3.5">
            <div className="font-mono text-2xl font-extrabold text-emerald-300">{s.value}</div>
            <div className="mt-1 text-xs font-semibold text-zinc-200">{s.label}</div>
            {s.sub && <div className="mt-0.5 text-[10px] leading-snug text-zinc-500">{s.sub}</div>}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-600">
        Fonte: International Cooperative Alliance · World Cooperative Monitor 2025 · “Se as 300 maiores
        cooperativas fossem um país, seu faturamento (US$ 2,79 tri) superaria o PIB do Reino Unido.”
      </p>

      {/* casos */}
      <section className="grid gap-3 md:grid-cols-2">
        {ALT_CASES.map((c, i) => (
          <m.article key={c.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-600">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-zinc-100">{c.titulo}</h3>
              <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider"
                style={{ color: c.color, background: `${c.color}18` }}>{c.local.split('·')[0].trim()}</span>
            </div>
            <Tip text={didatico ? 'Dado-chave do caso — passe o mouse para a leitura técnica.' : 'Dado-chave do caso.'}>
              <div className="mt-2 cursor-help rounded-lg bg-zinc-950/60 p-2 font-mono text-[11px] font-bold" style={{ color: c.color }}>
                {c.dado}
              </div>
            </Tip>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">{didatico ? c.did : c.adv}</p>
            <div className="mt-auto pt-2 font-mono text-[9px] uppercase tracking-wider text-zinc-600">{c.pilares}</div>
          </m.article>
        ))}
      </section>

      {/* interativos */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <PayPyramid />
        <JobGuaranteeSim />
      </div>

      {/* fechamento */}
      <section className="rounded-xl border border-dashed border-emerald-400/40 bg-emerald-400/5 p-4">
        <h4 className="text-sm font-bold text-emerald-300">
          {didatico ? 'O ponto final (que é um começo)' : 'Conclusão analítica'}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-zinc-300">
          {didatico
            ? 'Nada daqui é ficção científica: cada exemplo EXISTE, com CNPJ, trabalhadores e décadas de funcionamento. O sistema dominante não é o único possível — é o que venceu disputas históricas e mantém o poder de narrar. Os módulos 01–08 mostraram o custo disso. Este módulo mostra que a pergunta certa nunca foi “utopia ou realidade?” — e sim: “quem decide as regras, e com quem elas conversam?”'
            : 'Conclusão: pluralismo institucional é factível e existente — cooperativas, commons, democracia fiscal e planejamento operam hoje em escala. A questão analítica desloca-se de “viabilidade” para “mecanismos de transição”: reforma monetária (P3), compressão distributiva (P2), autogestão em rede (P1) e soberania periférica (P4). O site fornece o diagnóstico; a política é o próximo capítulo.'}
        </p>
      </section>

      <p className="text-[10px] leading-relaxed text-zinc-600">
        Fontes: ICA/World Cooperative Monitor 2025 · Mondragon Corporation · ILO “Care work and care jobs” (2018) ·
        Ostrom, “Governing the Commons” (Nobel 2009) · UN-Habitat (orçamento participativo) · Medina (CyberSyn) ·
        Tcherneva, “The Case for a Job Guarantee” · Wray, “MMT”. Números do simulador JG são estimativas didáticas.
      </p>
    </div>
  )
}
