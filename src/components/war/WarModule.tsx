import { useState } from 'react'
import { m } from 'framer-motion'
import WarMap from './WarMap'
import ConflictDrawer from './ConflictDrawer'
import { WAR_EPOCHS, WAR_CONFLICTS, SUPPLIERS, warText } from '../../data/wars'
import Tip from '../ui/Tip'
import ModeBadge from '../ui/ModeBadge'
import { mt, pick } from '../../i18n'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'

/** Teoria — guerra e capital em três níveis de leitura. */
function TheoryCards() {
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const cards = [
    {
      color: '#ef5350',
      t: textoPorModo(
        mode,
        pick(lang, 'A guerra "limpa o tabuleiro"', 'War "clears the board"', 'La guerra "limpia el tablero"'),
        pick(lang, 'Destruição de c & sobreacumulação', 'Destruction of c & overaccumulation', 'Destrucción de c y sobreacumulación'),
        pick(lang, 'Guerras também mudam a economia', 'Wars also reshape the economy', 'Las guerras también cambian la economía'),
      ),
      d: textoPorModo(
        mode,
        pick(lang, 'Quando as fábricas produzem mais do que dá para vender lucrativamente, o capital fica estagnado. A guerra DESTRÓI fábricas, pontes e cidades inteiras — e reconstruir tudo reabre um mercado gigante e rentável. O lucro global respira.', 'When factories produce more than can be sold profitably, capital stagnates. War DESTROYS factories, bridges and entire cities — rebuilding them reopens a huge profitable market. Global profit gets room to breathe.', 'Cuando las fábricas producen más de lo que puede venderse con beneficio, el capital se estanca. La guerra DESTRUYE fábricas, puentes y ciudades enteras — reconstruirlo todo reabre un mercado enorme y rentable. El beneficio global respira.'),
        pick(lang, 'Destruição física do capital constante resolve a sobreacumulação: a reconstrução abre novos campos de investimento e eleva temporariamente g = m/(c+v) global. Padrão 1929→1939→1945; Ucrânia como laboratório contemporâneo.', 'Physical destruction of constant capital resolves overaccumulation: reconstruction opens new fields of investment and temporarily raises global g = m/(c+v). Pattern 1929→1939→1945; Ukraine as a contemporary laboratory.', 'La destrucción física del capital constante resuelve la sobreacumulación: la reconstrucción abre nuevos campos de inversión y eleva temporalmente g = m/(c+v) global. Patrón 1929→1939→1945; Ucrania como laboratorio contemporáneo.'),
        pick(lang, 'Conflitos destroem infraestrutura e mudam gastos públicos, produção e comércio. A reconstrução depois cria novas encomendas e investimentos; o efeito econômico varia conforme o país e o conflito.', 'Conflicts destroy infrastructure and change public spending, production and trade. Reconstruction then creates new orders and investment; the economic effect varies by country and conflict.', 'Los conflictos destruyen infraestructura y cambian el gasto público, la producción y el comercio. La reconstrucción posterior crea nuevos pedidos e inversiones; el efecto económico varía según el país y el conflicto.'),
      ),
    },
    {
      color: '#ffc107',
      t: textoPorModo(
        mode,
        pick(lang, 'O negócio mais seguro do mundo', 'The safest business in the world', 'El negocio más seguro del mundo'),
        pick(lang, 'Complexo militar-industrial: captura do Estado', 'Military-industrial complex: capture of the state', 'Complejo militar-industrial: captura del Estado'),
        pick(lang, 'Governos compram grande parte das armas', 'Governments buy most weapons', 'Los gobiernos compran gran parte de las armas'),
      ),
      d: textoPorModo(
        mode,
        pick(lang, 'Quem vende armas tem o MELHOR cliente possível: o Estado. Não há concorrência de verdade, não há crise que corte o pedido — o orçamento público vira lucro privado garantido, pago com impostos e dívida.', 'Arms sellers have the BEST possible customer: the state. There is little real competition and crises rarely cancel the order — public budgets become guaranteed private profit, paid through taxes and debt.', 'Quien vende armas tiene el MEJOR cliente posible: el Estado. Hay poca competencia real y las crisis rara vez cancelan el pedido — el presupuesto público se convierte en beneficio privado garantizado, pagado con impuestos y deuda.'),
        pick(lang, 'Demanda estatal inelástica + contratos cost-plus eliminam risco de realização; porta giratória Pentágono↔conselhos consolida fração rentista. SIPRI Top-100: US$632 bi/ano em receita de armamento.', 'Inelastic state demand + cost-plus contracts eliminate realization risk; the Pentagon↔boards revolving door consolidates a rentier fraction. SIPRI Top 100: US$632 bn/year in arms revenue.', 'Demanda estatal inelástica + contratos cost-plus eliminan el riesgo de realización; la puerta giratoria Pentágono↔consejos consolida una fracción rentista. Top 100 SIPRI: US$632 mil M/año en ingresos por armamento.'),
        pick(lang, 'Empresas de defesa vendem principalmente para governos. Quando o orçamento militar cresce, aumentam as encomendas; contratos públicos podem reduzir parte do risco comercial dessas empresas.', 'Defense companies sell mainly to governments. When military budgets grow, orders increase; public contracts can reduce part of these companies’ commercial risk.', 'Las empresas de defensa venden principalmente a gobiernos. Cuando crece el presupuesto militar, aumentan los pedidos; los contratos públicos pueden reducir parte del riesgo comercial de estas empresas.'),
      ),
    },
    {
      color: '#ba68c8',
      t: textoPorModo(
        mode,
        pick(lang, 'Briga pelo bolo mundial', 'Fight over the global pie', 'Disputa por el pastel mundial'),
        pick(lang, 'Partilha imperialista: recursos, rotas e moeda', 'Imperialist partition: resources, routes and currency', 'Reparto imperialista: recursos, rutas y moneda'),
        pick(lang, 'Conflitos podem envolver recursos e rotas', 'Conflicts can involve resources and routes', 'Los conflictos pueden involucrar recursos y rutas'),
      ),
      d: textoPorModo(
        mode,
        pick(lang, 'Por trás de cada guerra grande há uma disputa por coisas concretas: petróleo, minerais raros, chips, rotas comerciais e qual moeda manda no comércio mundial. Impérios crescem até esbarrar uns nos outros — e aí a conversa acaba em tiros.', 'Behind every major war is a struggle over concrete things: oil, rare minerals, chips, trade routes and which currency dominates world trade. Empires grow until they run into each other — and then the argument turns into gunfire.', 'Detrás de cada gran guerra hay una disputa por cosas concretas: petróleo, minerales raros, chips, rutas comerciales y qué moneda domina el comercio mundial. Los imperios crecen hasta chocar entre sí — y entonces la discusión termina a tiros.'),
        pick(lang, 'Lenin (Imperialismo, estágio superior): exportação de capitais exige proteção territorial; a repartição do mundo é renegociada pela força quando a correlação econômica muda. Hegemonia monetária (petrodólar × desdolarização) é o troféu final.', 'Lenin (Imperialism, the Highest Stage): capital exports require territorial protection; the division of the world is renegotiated by force when economic power shifts. Monetary hegemony (petrodollar × de-dollarization) is the ultimate prize.', 'Lenin (El imperialismo, fase superior): la exportación de capitales exige protección territorial; el reparto del mundo se renegocia por la fuerza cuando cambia la correlación económica. La hegemonía monetaria (petrodólar × desdolarización) es el trofeo final.'),
        pick(lang, 'Alguns conflitos também envolvem controle de petróleo, minerais, tecnologia, rotas comerciais e influência entre países. Esses fatores não explicam sozinhos todas as guerras, mas ajudam a entender seus efeitos econômicos.', 'Some conflicts also involve control of oil, minerals, technology, trade routes and influence between countries. These factors do not explain every war by themselves, but they help explain their economic effects.', 'Algunos conflictos también involucran el control de petróleo, minerales, tecnología, rutas comerciales e influencia entre países. Estos factores no explican por sí solos todas las guerras, pero ayudan a entender sus efectos económicos.'),
      ),
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
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const ep = WAR_EPOCHS[epochIndex]
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-extrabold" style={{ color: ep.color }}>{ep.faixa}</span>
          <span className="text-sm font-semibold text-zinc-200">{warText(lang, ep.rotuloCurto)}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">{pick(lang, 'linha do tempo reversa', 'reverse timeline', 'línea de tiempo inversa')}</span>
      </div>
      <input
        type="range" min={0} max={WAR_EPOCHS.length - 1} step={1} value={epochIndex}
        onChange={(e) => setEpochIndex(parseInt(e.target.value))}
        className="mt-2 range-labor"
        aria-label={pick(lang, 'Viajar no tempo das guerras', 'Travel through the history of wars', 'Viajar por la historia de las guerras')}
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-500">
        {WAR_EPOCHS.map((e, i) => (
          <button key={e.id} onClick={() => setEpochIndex(i)}
            className={`transition-colors hover:text-zinc-200 ${i === epochIndex ? 'font-bold' : ''}`}
            style={i === epochIndex ? { color: e.color } : undefined}>
            {e.from}
          </button>
        ))}
        <span>← 2026 · {pick(lang, 'voltar no tempo', 'go back in time', 'retroceder en el tiempo')} →</span>
      </div>

      {/* conflitos da época */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {WAR_CONFLICTS.filter((c) => c.epoch === epochIndex).map((c) => (
          <span key={c.id} className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10.5px] text-zinc-400">
            {warText(lang, c.curto)} <span className="font-mono text-[9px] text-zinc-600">{warText(lang, c.periodo)}</span>
          </span>
        ))}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-zinc-300">{textoPorModo(mode, warText(lang, ep.introDidatico), warText(lang, ep.introAvancado))}</p>
      {mode === 'avancado' && (
        <p className="mt-1.5 rounded-lg bg-zinc-950/70 p-2 font-mono text-[10.5px] leading-relaxed text-zinc-500">
          [{pick(lang, 'avançado', 'advanced', 'avanzado')}] {warText(lang, ep.introAvancado)}
        </p>
      )}
    </div>
  )
}

/** Tabela dos gigantes do complexo militar-industrial. */
function DefenseGiants() {
  const lang = useApp((s) => s.lang)
  const list = Object.values(SUPPLIERS).filter((s) => s.defesaBi)
  const max = Math.max(...list.map((s) => s.defesaBi ?? 0))
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-100">{pick(lang, 'Os gigantes do Complexo Militar-Industrial', 'Giants of the Military-Industrial Complex', 'Gigantes del Complejo Militar-Industrial')}</h3>
        <Tip text={pick(lang, 'Contexto: as 100 maiores contratadas de defesa do mundo faturaram ~US$632 bilhões num único ano (SIPRI). Estes são os principais nomes.', 'Context: the world’s 100 largest defense contractors generated ~US$632 billion in a single year (SIPRI). These are some of the leading names.', 'Contexto: las 100 mayores contratistas de defensa del mundo facturaron ~US$632 mil millones en un solo año (SIPRI). Estos son algunos de los principales nombres.')}>
          <span className="cursor-help font-mono text-[10px] text-zinc-500">{pick(lang, 'SIPRI Top-100 ≈ US$632 bi/ano ↗', 'SIPRI Top 100 ≈ US$632 bn/year ↗', 'Top 100 SIPRI ≈ US$632 mil M/año ↗')}</span>
        </Tip>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {list.map((s) => (
          <article key={s.id} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-zinc-100">{s.nome}</h4>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">{warText(lang, s.pais)}</span>
              </div>
              <span className="font-mono text-base font-extrabold text-money">≈${s.defesaBi} {pick(lang, 'bi', 'bn', 'mil M')}<span className="ml-1 text-[9px] font-normal text-zinc-600">{pick(lang, 'defesa/ano', 'defense/year', 'defensa/año')}</span></span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-money"
                style={{ width: `${((s.defesaBi ?? 0) / max) * 100}%` }} />
            </div>
            <div className="mt-1.5 text-[11px] text-zinc-400">{warText(lang, s.setor)}</div>
            <div className="mt-0.5 text-[10.5px] leading-snug text-emerald-300/90">{warText(lang, s.destaque)}</div>
          </article>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
        {pick(lang,
          'Receitas de defesa aproximadas dos relatórios anuais FY2024 (segmento militar). Rostec: estatal russa, estimativa consolidada. Rheinmetall: crescimento acelerado (+~35%/ano) desde 2022.',
          'Approximate defense revenue from FY2024 annual reports (military segment). Rostec: Russian state company, consolidated estimate. Rheinmetall: accelerated growth (+~35%/year) since 2022.',
          'Ingresos de defensa aproximados según informes anuales FY2024 (segmento militar). Rostec: empresa estatal rusa, estimación consolidada. Rheinmetall: crecimiento acelerado (+~35%/año) desde 2022.',
        )}
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
          {mt(lang, 'war').title}
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {textoPorModo(
            mode,
            pick(lang, 'Guerra não é acidente nem “loucura humana”: na maior parte dos casos, alguém LUCRA com ela — antes, durante e depois. Siga o dinheiro: quem fabrica, quem financia, quem reconstrói. Viaje de 2026 até 1914 e veja o padrão se repetir.', 'War is neither an accident nor “human madness”: in most cases, someone PROFITS from it — before, during and after. Follow the money: who manufactures, who finances, who rebuilds. Travel from 2026 back to 1914 and watch the pattern repeat.', 'La guerra no es un accidente ni una “locura humana”: en la mayoría de los casos, alguien GANA con ella — antes, durante y después. Sigue el dinero: quién fabrica, quién financia, quién reconstruye. Viaja de 2026 a 1914 y observa cómo se repite el patrón.'),
            pick(lang, 'A guerra como continuação da concorrência inter-capitalista por outros meios: destruição de c, socialização fiscal dos custos, privatização das margens. Cinco épocas, mesmo mecanismo estrutural.', 'War as the continuation of inter-capitalist competition by other means: destruction of c, fiscal socialization of costs, privatization of margins. Five eras, the same structural mechanism.', 'La guerra como continuación de la competencia intercapitalista por otros medios: destrucción de c, socialización fiscal de los costos, privatización de los márgenes. Cinco épocas, el mismo mecanismo estructural.'),
            pick(lang, 'Conflitos mudam gastos dos governos, preços de energia, comércio e produção. Use a linha do tempo para comparar quem vende, quem compra e como as rotas econômicas mudam em cada época.', 'Conflicts change government spending, energy prices, trade and production. Use the timeline to compare who sells, who buys and how economic routes change in each era.', 'Los conflictos cambian el gasto de los gobiernos, los precios de la energía, el comercio y la producción. Usa la línea de tiempo para comparar quién vende, quién compra y cómo cambian las rutas económicas en cada época.'),
          )}
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
