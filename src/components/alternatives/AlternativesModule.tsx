import { useState } from 'react'
import { m } from 'framer-motion'
import Tip from '../ui/Tip'
import ModeBadge from '../ui/ModeBadge'
import { altCasesForLang, coopStatsForLang, JG, payRatiosForLang } from '../../data/alternatives'
import { locale, mt, pick, type Lang } from '../../i18n'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'

/** Pirâmide salarial interativa: cooperativa × corporações. */
function PayPyramid() {
  const lang = useApp((s) => s.lang)
  const ratios = payRatiosForLang(lang)
  const [sel, setSel] = useState(ratios[0].id)
  const chosen = ratios.find((p) => p.id === sel)!
  const max = ratios[ratios.length - 1].ratio
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-sm font-bold text-zinc-100">{tx('A pirâmide salarial é uma ESCOLHA', 'The pay pyramid is a CHOICE', 'La pirámide salarial es una ELECCIÓN')}</h3>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
        {tx(
          'Quantas vezes o salário do topo é maior que o da base? Mexa nas opções — a diferença não é “natureza”, é regra interna aprovada (ou imposta).',
          'How many times larger is top pay than base pay? Try the options — the gap is not “nature”; it is an internal rule that was approved (or imposed).',
          '¿Cuántas veces es mayor el salario de la cima que el de la base? Prueba las opciones — la diferencia no es “naturaleza”; es una regla interna aprobada (o impuesta).',
        )}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {ratios.map((p) => (
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
            <span className="text-zinc-400">{tx('Salário do topo ÷ salário da base', 'Top pay ÷ base pay', 'Salario de la cima ÷ salario de la base')}</span>
            <span className="font-mono font-bold" style={{ color: chosen.color }}>{chosen.ratio}:1</span>
          </div>
          <div className="h-6 w-full overflow-hidden rounded-lg bg-zinc-800/70">
            <m.div animate={{ width: `${(chosen.ratio / max) * 100}%` }}
              transition={{ type: 'spring', stiffness: 110, damping: 20 }}
              className="h-full rounded-lg" style={{ background: chosen.color }} />
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950/70 p-2.5 text-[11px] leading-relaxed text-zinc-300">
          {didaticoText(lang, chosen.ratio)}
        </div>
      </div>
    </div>
  )
}

function didaticoText(lang: Lang, r: number) {
  if (r <= 10)
    return pick(lang,
      `No topo da cooperativa, 1 pessoa ganha ${r} salários de base. Na corporação equivalente do topo da lista, seriam centenas. A diferença não vem da “genialidade” do CEO — vem de quem define as regras.`,
      `At the top of the cooperative, one person earns ${r} base salaries. In the comparable corporation at the top of the list, it would be hundreds. The difference does not come from the CEO’s “genius” — it comes from who sets the rules.`,
      `En la cima de la cooperativa, una persona gana ${r} salarios de base. En la corporación equivalente de la parte alta de la lista serían cientos. La diferencia no viene de la “genialidad” del CEO — viene de quién define las reglas.`)
  const meses = (40 / (r / 12) * 12).toFixed(0)
  return pick(lang,
    `O topo ganha ${r} vezes a base — ou seja, ${r} salários por mês. Em uma jornada de 40 anos, a base acumula o que o topo recebe em ${meses} meses... de trabalho. O resto é estrutura de poder.`,
    `The top earns ${r} times the base — that is, ${r} base salaries per month. Over a 40-year career, the base accumulates what the top receives in ${meses} months... of work. The rest is a power structure.`,
    `La cima gana ${r} veces la base — es decir, ${r} salarios de base por mes. En una carrera de 40 años, la base acumula lo que la cima recibe en ${meses} meses... de trabajo. El resto es estructura de poder.`)
}

/** Simulador da Garantia de Emprego (MMT). */
function JobGuaranteeSim() {
  const [participantes, setParticipantes] = useState(12) // milhões
  const [salario, setSalario] = useState(1518)
  const lang = useApp((s) => s.lang)
  const mode = useApp((s) => s.mode)
  const didatico = mode !== 'avancado'
  const loc = locale(lang)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const custoBi = (participantes * 1e6 * salario * 13.3) / 1e9
  const pctPib = (custoBi / (JG.pibBrTri * 1000)) * 100
  const vsJuros = (custoBi / JG.jurosAnoBi) * 100

  return (
    <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-emerald-300">{tx('Simulador: Garantia de Emprego (MMT)', 'Simulator: Job Guarantee (MMT)', 'Simulador: Garantía de Empleo (MMT)')}</h3>
        <span className="font-mono text-[9.5px] text-zinc-500">{tx('Tcherneva · Wray · proposta viva', 'Tcherneva · Wray · active proposal', 'Tcherneva · Wray · propuesta vigente')}</span>
      </div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-300">
        {didatico
          ? tx('E se o Estado GARANTISSE um emprego com salário digno para todo mundo que quisesse trabalhar — em creches, reflorestamento, cuidado, cultura? Como emissor da moeda, ele pode pagar. O limite é real (inflação, capacidade), não financeiro. Simule:', 'What if the state GUARANTEED a job with a decent wage to everyone who wanted to work — in childcare, reforestation, care and culture? As a currency issuer, it can pay. The constraint is real (inflation, capacity), not merely financial. Simulate it:', '¿Y si el Estado GARANTIZARA un empleo con salario digno a toda persona que quisiera trabajar — en guarderías, reforestación, cuidados, cultura? Como emisor de moneda, puede pagar. El límite es real (inflación, capacidad), no meramente financiero. Simúlalo:')
          : tx('Employer of last resort: âncora salarial exógena que estabiliza demanda e precifica o piso do mercado de trabalho — custo limitado por capacidade real, financiado por soberania monetária (parcial no caso BR).', 'Employer of last resort: an exogenous wage anchor that stabilizes demand and prices the labor-market floor — cost constrained by real capacity, financed through monetary sovereignty (partial in Brazil’s case).', 'Employer of last resort: ancla salarial exógena que estabiliza la demanda y fija el piso del mercado laboral — costo limitado por capacidad real, financiado mediante soberanía monetaria (parcial en el caso de Brasil).')}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-zinc-300">{tx('Pessoas no programa', 'People in the program', 'Personas en el programa')}</span>
            <span className="font-mono font-bold text-zinc-100">{participantes.toLocaleString(loc)} {tx('mi', 'M', 'M')}</span>
          </div>
          <input type="range" min={5} max={30} step={1} value={participantes}
            aria-label={tx('Pessoas no programa de garantia de emprego, em milhões', 'People in the job guarantee program, in millions', 'Personas en el programa de garantía de empleo, en millones')}
            onChange={(e) => setParticipantes(parseInt(e.target.value))} />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-zinc-300">{tx('Salário mensal', 'Monthly wage', 'Salario mensual')}</span>
            <span className="font-mono font-bold text-zinc-100">R$ {salario.toLocaleString(loc)}</span>
          </div>
          <input type="range" min={1518} max={3000} step={50} value={salario}
            aria-label={tx('Salário mensal do programa em reais', 'Program monthly wage in Brazilian reais', 'Salario mensual del programa en reales brasileños')}
            onChange={(e) => setSalario(parseInt(e.target.value))} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-950/70 p-2.5">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">{tx('Custo/ano', 'Cost/year', 'Costo/año')}</div>
          <div className="font-mono text-base font-extrabold text-emerald-300">
            R$ {custoBi.toLocaleString(loc, { maximumFractionDigits: 0 })} {tx('bi', 'bn', 'mil M')}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950/70 p-2.5">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">{tx('% do PIB', '% of GDP', '% del PIB')}</div>
          <div className="font-mono text-base font-extrabold text-zinc-100">{pctPib.toLocaleString(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</div>
        </div>
        <div className="rounded-lg bg-zinc-950/70 p-2.5">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">{tx('vs juros da dívida (2024)', 'vs debt interest (2024)', 'vs intereses de la deuda (2024)')}</div>
          <div className="font-mono text-base font-extrabold text-money">{vsJuros.toLocaleString(loc, { maximumFractionDigits: 0 })}%</div>
        </div>
      </div>
      <p className="mt-2 text-[10.5px] leading-relaxed text-zinc-400">
        {didatico
          ? tx('Compare com o terceiro número: gastamos com JUROS da dívida muito mais do que custaria empregar milhões de pessoas em coisas úteis. Não falta dinheiro — falta prioridade. E o programa ainda cria um PISO salarial: ninguém aceita menos que isso na iniciativa privada.', 'Compare it with the third number: debt INTEREST costs far more than employing millions of people in useful work would. The issue is priority. The program also creates a WAGE FLOOR: private employers have to compete with it.', 'Compáralo con el tercer número: gastamos en INTERESES de la deuda mucho más de lo que costaría emplear a millones de personas en trabajos útiles. La cuestión es la prioridad. El programa además crea un PISO SALARIAL: el sector privado tiene que competir con él.')
          : tx('Âncora salarial exógena: o custo do programa define o piso de fato do mercado privado; comparado ao serviço de juros (~R$900 bi/ano), o programa é fiscalmente trivial para um emissor parcialmente soberano — a restrição é inflação/capacidade, administrável via alocação setorial.', 'Exogenous wage anchor: program compensation sets the effective private-market floor; compared with debt-interest service (~R$900 bn/year), the program is fiscally modest for a partially sovereign issuer — the constraint is inflation/capacity, manageable through sectoral allocation.', 'Ancla salarial exógena: la remuneración del programa fija el piso efectivo del mercado privado; comparado con el servicio de intereses (~R$900 mil M/año), el programa es fiscalmente modesto para un emisor parcialmente soberano — la restricción es inflación/capacidad, administrable mediante asignación sectorial.')}
      </p>
    </div>
  )
}

/** MÓDULO 09 — E PARA ONDE PODEMOS IR? */
export default function AlternativesModule() {
  const lang = useApp((s) => s.lang)
  const mode = useApp((s) => s.mode)
  const didatico = mode !== 'avancado'
  const stats = coopStatsForLang(lang)
  const cases = altCasesForLang(lang)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)

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
            ? tx('Os módulos anteriores mostraram como o sistema machuca. Mas criticar sem apontar caminho é meio caminho. A boa notícia: alternativas NÃO são utopia — já existem, já funcionam, já escalam. Cooperativas com 70 mil pessoas sem patrão. Cidades onde o povo decide o orçamento. Um Nobel provando que comunidades cuidam de bens comuns melhor que empresas ou Estados. Conheça as provas:', 'The previous modules showed how the system causes harm. But critique without a path forward only goes halfway. The good news: alternatives are NOT utopian — they already exist, work and scale. Cooperatives with 70,000 people and no boss. Cities where residents decide the budget. Nobel-winning research showing how communities can govern shared resources. See the evidence:', 'Los módulos anteriores mostraron cómo el sistema causa daño. Pero criticar sin señalar caminos se queda a medias. La buena noticia: las alternativas NO son utopía — ya existen, funcionan y escalan. Cooperativas con 70 mil personas sin patrón. Ciudades donde la población decide el presupuesto. Un Nobel mostrando cómo las comunidades pueden gestionar recursos comunes. Conoce las pruebas:')
            : tx('Terceiro ato: para além da crítica (Pilares 1–4), evidências empíricas de instituições não-capitalistas em escala — cooperativas de trabalho/produção/crédito, commons governados (Ostrom), produção entre pares, democracia fiscal e planejamento cibernético. O debate não é “mercado × Estado”: é sobre pluralismo institucional.', 'Third act: beyond critique (Pillars 1–4), empirical evidence of non-capitalist institutions at scale — worker/producer/credit cooperatives, governed commons (Ostrom), peer production, fiscal democracy and cybernetic planning. The debate is not simply “market × state”: it is about institutional pluralism.', 'Tercer acto: más allá de la crítica (Pilares 1–4), evidencia empírica de instituciones no capitalistas a escala — cooperativas de trabajo/producción/crédito, comunes gobernados (Ostrom), producción entre pares, democracia fiscal y planificación cibernética. El debate no es simplemente “mercado × Estado”: trata del pluralismo institucional.')}
        </p>
      </header>

      {/* stats */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3.5">
            <div className="font-mono text-2xl font-extrabold text-emerald-300">{s.value}</div>
            <div className="mt-1 text-xs font-semibold text-zinc-200">{s.label}</div>
            {s.sub && <div className="mt-0.5 text-[10px] leading-snug text-zinc-500">{s.sub}</div>}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-600">
        {tx('Fonte: International Cooperative Alliance · World Cooperative Monitor 2025 · “Se as 300 maiores cooperativas fossem um país, seu faturamento (US$ 2,79 tri) superaria o PIB do Reino Unido.”', 'Source: International Cooperative Alliance · World Cooperative Monitor 2025 · “If the 300 largest cooperatives were a country, their revenue (US$2.79 tn) would exceed the UK GDP.”', 'Fuente: International Cooperative Alliance · World Cooperative Monitor 2025 · “Si las 300 mayores cooperativas fueran un país, su facturación (US$2,79 bill.) superaría el PIB del Reino Unido.”')}
      </p>

      {/* casos */}
      <section className="grid gap-3 md:grid-cols-2">
        {cases.map((c, i) => (
          <m.article key={c.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-600">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-zinc-100">{c.titulo}</h3>
              <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider"
                style={{ color: c.color, background: `${c.color}18` }}>{c.local.split('·')[0].trim()}</span>
            </div>
            <Tip text={textoPorModo(mode,
              tx('Dado-chave do caso — passe o mouse para a leitura técnica.', 'Key case fact — hover for the technical reading.', 'Dato clave del caso — pasa el cursor para la lectura técnica.'),
              tx('Dado-chave do caso.', 'Key case fact.', 'Dato clave del caso.'),
              tx('Número importante deste caso.', 'Important number for this case.', 'Número importante de este caso.'))}>
              <div className="mt-2 cursor-help rounded-lg bg-zinc-950/60 p-2 font-mono text-[11px] font-bold" style={{ color: c.color }}>
                {c.dado}
              </div>
            </Tip>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">{textoPorModo(mode, c.did, c.adv)}</p>
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
          {textoPorModo(mode,
            tx('O ponto final (que é um começo)', 'The ending point (which is a beginning)', 'El punto final (que es un comienzo)'),
            tx('Conclusão analítica', 'Analytical conclusion', 'Conclusión analítica'),
            tx('O que aprendemos', 'What we learned', 'Lo que aprendimos'))}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-zinc-300">
          {didatico
            ? tx('Nada daqui é ficção científica: cada exemplo EXISTE, com CNPJ, trabalhadores e décadas de funcionamento. O sistema dominante não é o único possível — é o que venceu disputas históricas e mantém o poder de narrar. Os módulos 01–08 mostraram o custo disso. Este módulo mostra que a pergunta certa nunca foi “utopia ou realidade?” — e sim: “quem decide as regras, e com quem elas conversam?”', 'None of this is science fiction: every example EXISTS, with legal organizations, workers and decades of operation. The dominant system is not the only possible one — it is the one that won historical struggles and retained the power to tell the story. Modules 01–08 showed its costs. This module shows that the useful question was never “utopia or reality?” but “who sets the rules, and whose interests do they serve?”', 'Nada de esto es ciencia ficción: cada ejemplo EXISTE, con organizaciones legales, trabajadores y décadas de funcionamiento. El sistema dominante no es el único posible — es el que ganó disputas históricas y conservó el poder de narrarlas. Los módulos 01–08 mostraron sus costos. Este módulo muestra que la pregunta útil nunca fue “¿utopía o realidad?”, sino “¿quién define las reglas y a qué intereses sirven?”')
            : tx('Conclusão: pluralismo institucional é factível e existente — cooperativas, commons, democracia fiscal e planejamento operam hoje em escala. A questão analítica desloca-se de “viabilidade” para “mecanismos de transição”: reforma monetária (P3), compressão distributiva (P2), autogestão em rede (P1) e soberania periférica (P4). O site fornece o diagnóstico; a política é o próximo capítulo.', 'Conclusion: institutional pluralism is feasible and already exists — cooperatives, commons, fiscal democracy and planning operate at scale today. The analytical question shifts from “viability” to “transition mechanisms”: monetary reform (P3), distributive compression (P2), networked self-management (P1) and peripheral sovereignty (P4). The site provides the diagnosis; politics is the next chapter.', 'Conclusión: el pluralismo institucional es viable y ya existe — cooperativas, comunes, democracia fiscal y planificación operan hoy a escala. La cuestión analítica pasa de la “viabilidad” a los “mecanismos de transición”: reforma monetaria (P3), compresión distributiva (P2), autogestión en red (P1) y soberanía periférica (P4). El sitio ofrece el diagnóstico; la política es el siguiente capítulo.')}
        </p>
      </section>

      <p className="text-[10px] leading-relaxed text-zinc-600">
        {tx('Fontes: ICA/World Cooperative Monitor 2025 · Mondragon Corporation · ILO “Care work and care jobs” (2018) · Ostrom, “Governing the Commons” (Nobel 2009) · UN-Habitat (orçamento participativo) · Medina (CyberSyn) · Tcherneva, “The Case for a Job Guarantee” · Wray, “MMT”. Números do simulador JG são estimativas didáticas.', 'Sources: ICA/World Cooperative Monitor 2025 · Mondragon Corporation · ILO “Care work and care jobs” (2018) · Ostrom, “Governing the Commons” (Nobel 2009) · UN-Habitat (participatory budgeting) · Medina (CyberSyn) · Tcherneva, “The Case for a Job Guarantee” · Wray, “MMT”. JG simulator figures are didactic estimates.', 'Fuentes: ICA/World Cooperative Monitor 2025 · Mondragon Corporation · OIT “Care work and care jobs” (2018) · Ostrom, “Governing the Commons” (Nobel 2009) · UN-Habitat (presupuesto participativo) · Medina (CyberSyn) · Tcherneva, “The Case for a Job Guarantee” · Wray, “MMT”. Las cifras del simulador JG son estimaciones didácticas.')}
      </p>
    </div>
  )
}
