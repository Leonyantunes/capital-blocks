import CircuitDiagram from './CircuitDiagram'
import ControlsPanel from './ControlsPanel'
import MetricCard from './MetricCard'
import ProfitCurve from './ProfitCurve'
import { UnpaidClock } from './Clocks'
import Tip from './ui/Tip'
import ModeBadge from './ui/ModeBadge'
import { computeCircuit, fmtHours, pct, units, unpaidHours } from '../lib/marx'
import { mt, modRef, pick } from '../i18n'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'

function UnpaidWorkCard() {
  const { e, mode, lang } = useApp()
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
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
              {textoPorModo(mode,
                tr('Seu dia de trabalho em 8 horas', 'Your 8-hour workday', 'Tu jornada de 8 horas'),
                tr('Tradutor: trabalho não pago na jornada', 'Translator: unpaid labor in the workday', 'Traductor: trabajo no pagado en la jornada'),
                tr('O que acontece nas suas 8 horas de trabalho', 'What happens during your 8-hour workday', 'Qué ocurre durante tus 8 horas de trabajo'))}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
              {tr('Em uma jornada de 8 horas, você trabalha', 'In an 8-hour workday, you work', 'En una jornada de 8 horas, trabajas')}{' '}
              <span className="font-mono font-bold text-emerald-300">
                {String(hUnpaid).padStart(2, '0')}h {String(mUnpaid).padStart(2, '0')}min
              </span>{' '}
              {tr('para a empresa sem equivalente salarial — e apenas', 'for the company beyond the wage equivalent — while only', 'para la empresa más allá del equivalente salarial — mientras solo')}{' '}
              <span className="font-mono font-bold text-red-300">
                {String(hPaid).padStart(2, '0')}h {String(mPaid).padStart(2, '0')}min
              </span>{' '}
              {tr('corresponde ao tempo equivalente ao seu salário.', 'corresponds to the time equivalent to your wage.', 'corresponde al tiempo equivalente a tu salario.')}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {textoPorModo(
                mode,
                tr('A parte verde é o tempo em que você produz valor além do equivalente ao salário. Suba a intensidade de exploração e veja o verde ocupar mais do seu dia.', 'The green section is the time in which you produce value beyond the wage equivalent. Raise exploitation intensity and watch green occupy more of the day.', 'La parte verde es el tiempo en que produces valor más allá del equivalente salarial. Aumenta la intensidad de explotación y observa cómo el verde ocupa más del día.'),
                tr(`Horas Não Pagas = 8 · m/(m+v) = 8 · ${r.e.toFixed(2)}/${(r.e + 1).toFixed(2)} = ${fmtHours(minutes / 60)} — equivalente material da taxa de mais-valia.`, `Unpaid Hours = 8 · m/(m+v) = 8 · ${r.e.toFixed(2)}/${(r.e + 1).toFixed(2)} = ${fmtHours(minutes / 60)} — material equivalent of the surplus-value rate.`, `Horas No Pagadas = 8 · m/(m+v) = 8 · ${r.e.toFixed(2)}/${(r.e + 1).toFixed(2)} = ${fmtHours(minutes / 60)} — equivalente material de la tasa de plusvalía.`),
                tr('A parte verde mostra o tempo em que você continua produzindo depois de já ter gerado o valor equivalente ao seu salário. Mexa no controle e veja esse tempo mudar.', 'The green section shows the time you keep producing after generating the value equivalent to your wage. Move the control and see that time change.', 'La parte verde muestra el tiempo en que sigues produciendo después de generar el valor equivalente a tu salario. Mueve el control y observa cómo cambia ese tiempo.'),
              )}
            </p>
          </div>
        </div>

        {/* barra de progresso explicativa */}
        <div className="min-w-[220px] flex-1">
          <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider">
            <span className="text-red-300">{textoPorModo(mode,
              tr(`Para você (${fmtHours(paid / 60)})`, `Wage-equivalent time (${fmtHours(paid / 60)})`, `Tiempo equivalente al salario (${fmtHours(paid / 60)})`),
              tr(`Equivalente ao salário (${fmtHours(paid / 60)})`, `Wage equivalent (${fmtHours(paid / 60)})`, `Equivalente al salario (${fmtHours(paid / 60)})`),
              tr(`Tempo ligado ao salário (${fmtHours(paid / 60)})`, `Time linked to the wage (${fmtHours(paid / 60)})`, `Tiempo ligado al salario (${fmtHours(paid / 60)})`))}</span>
            <span className="text-emerald-300">{textoPorModo(mode,
              tr(`Não pago (${fmtHours(minutes / 60)})`, `Unpaid (${fmtHours(minutes / 60)})`, `No pagado (${fmtHours(minutes / 60)})`),
              tr(`Trabalho não pago (${fmtHours(minutes / 60)})`, `Unpaid labor (${fmtHours(minutes / 60)})`, `Trabajo no pagado (${fmtHours(minutes / 60)})`),
              tr(`Tempo além do salário (${fmtHours(minutes / 60)})`, `Time beyond the wage equivalent (${fmtHours(minutes / 60)})`, `Tiempo más allá del equivalente salarial (${fmtHours(minutes / 60)})`))}</span>
          </div>
          <div className="flex h-5 w-full overflow-hidden rounded-lg border border-zinc-800">
            <div className="bg-red-400 transition-all duration-300" style={{ width: `${(paid / 480) * 100}%` }} />
            <div className="bg-emerald-400 transition-all duration-300" style={{ width: `${(minutes / 480) * 100}%` }} />
          </div>
          <Tip text={textoPorModo(
            mode,
            tr('Arraste o slider "Intensidade de Exploração" acima para mudar este relógio.', 'Drag the "Exploitation Intensity" slider above to change this clock.', 'Arrastra el control "Intensidad de explotación" de arriba para cambiar este reloj.'),
            tr('Derivado diretamente de e = m/v no circuito acima.', 'Derived directly from e = m/v in the circuit above.', 'Derivado directamente de e = m/v en el circuito anterior.'),
            tr('Mexa no controle de trabalho não pago para mudar este relógio.', 'Move the unpaid-labor control to change this clock.', 'Mueve el control de trabajo no pagado para cambiar este reloj.'),
          )}>
            <div className="mt-2 inline-block cursor-help rounded bg-zinc-800/80 px-2 py-1 font-mono text-[10px] text-zinc-400">
              {textoPorModo(
                mode,
                tr(`${((unpaidHours(e) / 8) * 100).toFixed(0)}% da jornada além do tempo ligado ao salário`, `${((unpaidHours(e) / 8) * 100).toFixed(0)}% of the workday beyond wage-equivalent time`, `${((unpaidHours(e) / 8) * 100).toFixed(0)}% de la jornada más allá del tiempo equivalente al salario`),
                tr(`e = m/v = ${(e * 100).toFixed(0)}% → jornada ${((unpaidHours(e) / 8) * 100).toFixed(0)}% não paga`, `e = m/v = ${(e * 100).toFixed(0)}% → workday ${((unpaidHours(e) / 8) * 100).toFixed(0)}% unpaid`, `e = m/v = ${(e * 100).toFixed(0)}% → jornada ${((unpaidHours(e) / 8) * 100).toFixed(0)}% no pagada`),
                tr(`${((unpaidHours(e) / 8) * 100).toFixed(0)}% das 8 horas ficam além do tempo equivalente ao salário`, `${((unpaidHours(e) / 8) * 100).toFixed(0)}% of the 8 hours lies beyond wage-equivalent time`, `${((unpaidHours(e) / 8) * 100).toFixed(0)}% de las 8 horas queda más allá del tiempo equivalente al salario`),
              )}
            </div>
          </Tip>
        </div>
      </div>
    </div>
  )
}

export default function CircuitModule() {
  const { k, e, mode, lang } = useApp()
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const r = computeCircuit(k, e)
  const didatico = mode !== 'avancado'

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">{mt(lang, 'circuit').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'circuit').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {mode === 'simples' ? (
            <>
              {tr('O dinheiro entra na empresa, paga máquinas, materiais e salários, e volta depois da venda. Use os controles para ver como o valor produzido é dividido.', 'Money enters the firm, pays for machines, materials and wages, and returns after the sale. Use the controls to see how the produced value is divided.', 'El dinero entra en la empresa, paga máquinas, materiales y salarios, y vuelve después de la venta. Usa los controles para ver cómo se divide el valor producido.')}
            </>
          ) : didatico ? (
            <>
              {tr('Toda riqueza começa com dinheiro que vira máquinas + trabalho, passa pela produção e volta como MAIS dinheiro. A pergunta central:', 'The circuit starts with money that becomes machines + labor, passes through production and returns as MORE money. The central question:', 'El circuito comienza con dinero que se convierte en máquinas + trabajo, pasa por la producción y vuelve como MÁS dinero. La pregunta central:')}{' '}
              <span className="text-zinc-200">{tr('de onde sai esse “mais”?', 'where does that “more” come from?', '¿de dónde sale ese “más”?')}</span> {tr('Mexa nos controles e descubra.', 'Move the controls and explore.', 'Mueve los controles y explora.')}
            </>
          ) : (
            <>
              {tr(
                'Anatomia metamórfica do ciclo produtivo:',
                'Metamorphic anatomy of the productive cycle:',
                'Anatomía metamórfica del ciclo productivo:',
              )}{' '}
              <span className="rounded bg-zinc-800/90 px-1.5 py-0.5 font-mono text-[13px] text-zinc-200">
                M — C(L/MP) … P … C′ — M′
              </span>{' '}
              {tr('Ajuste a composição orgânica e a taxa de exploração para ver onde a mais-valia nasce.', 'Adjust organic composition and the rate of exploitation to see where surplus value arises.', 'Ajusta la composición orgánica y la tasa de explotación para ver dónde surge la plusvalía.')}
            </>
          )}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <ControlsPanel />
        <div className="flex flex-col gap-4">
          <CircuitDiagram />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {mode === 'simples' ? (
              <>
                <MetricCard label={tr('Dinheiro colocado na produção', 'Money put into production', 'Dinero puesto en la producción')} value={units(r.M)} sub={tr('valor inicial do exemplo', 'initial value in the example', 'valor inicial del ejemplo')} accent="text-money" fonte={tr('modelo do app', 'app model', 'modelo de la app')} />
                <MetricCard label={tr('Valor que sobra no modelo', 'Value left in the model', 'Valor que queda en el modelo')} value={units(r.m)} sub={tr('depois da parcela ligada aos salários', 'after the wage-related share', 'después de la parte ligada a los salarios')} accent="text-emerald-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')}
                  tip={tr('É a parte que o modelo separa do valor equivalente aos salários.', 'It is the portion the model separates from the value equivalent to wages.', 'Es la parte que el modelo separa del valor equivalente a los salarios.')} />
                <MetricCard label={tr('Máquinas por trabalhador', 'Machines per worker', 'Máquinas por trabajador')} value={r.k.toFixed(1)} sub={tr('nível usado na simulação', 'level used in the simulation', 'nivel usado en la simulación')} accent="text-sky-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')}
                  tip={tr('Aumente este número para simular uma produção com mais máquinas e materiais por pessoa.', 'Increase this number to simulate production with more machines and materials per worker.', 'Aumenta este número para simular una producción con más máquinas y materiales por trabajador.')} />
                <MetricCard label={tr('Lucro sobre o investimento', 'Profit on investment', 'Beneficio sobre la inversión')} value={pct(r.profitRate)} sub={tr(`a cada ${units(r.M)} investidos`, `for each ${units(r.M)} invested`, `por cada ${units(r.M)} invertidos`)} fonte={tr('modelo do app', 'app model', 'modelo de la app')}
                  accent={r.profitRate < 20 ? 'text-red-300' : 'text-emerald-300'}
                  tip={tr('Mostra quanto o modelo calcula de lucro em relação ao dinheiro colocado no início.', 'Shows how much profit the model calculates relative to the money advanced at the start.', 'Muestra cuánto beneficio calcula el modelo en relación con el dinero adelantado al inicio.')} />
              </>
            ) : didatico ? (
              <>
                <MetricCard label={tr('O patrão investe', 'The owner invests', 'El propietario invierte')} value={units(r.M)} sub={tr('dinheiro inicial', 'initial money', 'dinero inicial')} accent="text-money" fonte={tr('modelo do app', 'app model', 'modelo de la app')} />
                <MetricCard label={tr('Lucro extraído', 'Extracted profit', 'Beneficio extraído')} value={units(r.m)} sub={tr('produzido por quem trabalha', 'produced by labor', 'producido por el trabajo')} accent="text-emerald-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')}
                  tip={tr('Este valor nasce APENAS no processo P — do trabalho além do que é pago.', 'In this model, this value arises in process P — from labor beyond the wage equivalent.', 'En este modelo, este valor surge en el proceso P — del trabajo más allá del equivalente salarial.')} />
                <MetricCard label={tr('Nível de automação', 'Automation level', 'Nivel de automatización')} value={r.k.toFixed(1)} sub={tr('máquinas por trabalhador', 'machines per worker', 'máquinas por trabajador')} accent="text-sky-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')}
                  tip={tr('Quanto mais máquinas relativas, menos trabalho vivo — e menos fonte de lucro.', 'The more machinery relative to labor, the less living labor remains in the model as the source of new value.', 'Cuanta más maquinaria haya en relación con el trabajo, menos trabajo vivo queda en el modelo como fuente de nuevo valor.')} />
                <MetricCard label={tr('Ganho dos donos', 'Owners’ return', 'Retorno de los propietarios')} value={pct(r.profitRate)} sub={tr(`a cada ${units(r.M)} investidos`, `for each ${units(r.M)} invested`, `por cada ${units(r.M)} invertidos`)} fonte={tr('modelo do app', 'app model', 'modelo de la app')}
                  accent={r.profitRate < 20 ? 'text-red-300' : 'text-emerald-300'}
                  tip={tr('No modelo, automação muito alta faz esse número cair mesmo com uma taxa de exploração elevada.', 'In the model, very high automation makes this number fall even with a high exploitation rate.', 'En el modelo, una automatización muy alta hace caer este número incluso con una tasa de explotación elevada.')} />
              </>
            ) : (
              <>
                <MetricCard label={tr('Capital adiantado M', 'Advanced capital M', 'Capital adelantado M')} value={`${r.M.toFixed(0)}`} sub="c + v" formula="M = c+v" accent="text-money" fonte={tr('modelo do app', 'app model', 'modelo de la app')} />
                <MetricCard label={tr('Taxa de lucro g', 'Profit rate g', 'Tasa de ganancia g')} value={`${r.profitRate.toFixed(1)}%`} sub={tr('sobre o capital total', 'on total capital', 'sobre el capital total')} formula="g = m/(c+v)" accent={r.profitRate < 20 ? 'text-red-300' : 'text-emerald-300'} fonte={tr('modelo do app', 'app model', 'modelo de la app')} />
                <MetricCard label={tr('Composição orgânica', 'Organic composition', 'Composición orgánica')} value={r.k.toFixed(1)} sub="c / v" formula="k = c/v" accent="text-sky-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')} />
                <MetricCard label={tr('Taxa de mais-valia', 'Rate of surplus value', 'Tasa de plusvalía')} value={`${(r.e * 100).toFixed(0)}%`} sub={tr('grau de exploração', 'degree of exploitation', 'grado de explotación')} formula="e = m/v" accent="text-red-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')} />
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
            <h3 className="text-sm font-bold text-zinc-100">
              {textoPorModo(mode,
                tr('A história inteira em 3 passos', 'The whole story in 3 steps', 'Toda la historia en 3 pasos'),
                tr('A história inteira em 3 passos', 'The full circuit in 3 steps', 'El circuito completo en 3 pasos'),
                tr('O caminho do dinheiro em 3 passos', 'The path of money in 3 steps', 'El recorrido del dinero en 3 pasos'))}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(mode === 'simples' ? [
                { n: '1', t: tr('A empresa investe', 'The company invests', 'La empresa invierte'), d: tr('compra materiais, máquinas e paga salários', 'buys materials and machines and pays wages', 'compra materiales y máquinas y paga salarios'), color: '#ffc107' },
                { n: '2', t: tr('A produção acontece', 'Production happens', 'Ocurre la producción'), d: tr('pessoas usam esses recursos para criar o produto', 'people use those resources to make the product', 'las personas usan esos recursos para crear el producto'), color: '#f44336' },
                { n: '3', t: tr('O produto é vendido', 'The product is sold', 'El producto se vende'), d: tr('o dinheiro volta e o modelo calcula o que sobra', 'money returns and the model calculates what remains', 'el dinero vuelve y el modelo calcula lo que queda'), color: '#4caf50' },
              ] : [
                { n: '1', t: tr('O patrão investe', 'The owner invests', 'El propietario invierte'), d: tr('compra máquinas e paga salários', 'buys machinery and pays wages', 'compra maquinaria y paga salarios'), color: '#ffc107' },
                { n: '2', t: tr('Você trabalha', 'You work', 'Tú trabajas'), d: tr('e produz TODA a riqueza do produto', 'and produce the product’s new value', 'y produces el nuevo valor del producto'), color: '#f44336' },
                { n: '3', t: tr('Ele vende e lucra', 'The owner sells and profits', 'El propietario vende y obtiene beneficio'), d: tr('fica com a parte que excede o equivalente ao salário', 'keeps the share beyond the wage equivalent', 'se queda con la parte que excede el equivalente salarial'), color: '#4caf50' },
              ]).map((s, i, arr) => (
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
              {textoPorModo(
                mode,
                tr('O ponto central está entre produzir e vender: o modelo separa uma parte equivalente ao salário e outra que fica como excedente. O relógio acima traduz essa divisão em horas.', 'The central point lies between production and sale: the model separates a wage-equivalent share from the surplus. The clock above translates that split into hours.', 'El punto central está entre producir y vender: el modelo separa una parte equivalente al salario y otra que queda como excedente. El reloj de arriba traduce esa división en horas.'),
                tr('O segredo está entre o passo 2 e o 3: o produto sai valendo MAIS do que o equivalente aos salários pagos. Esse “mais” aparece como trabalho não pago — o relógio acima mostra quantas horas ele representa.', 'The key lies between steps 2 and 3: the product leaves production with MORE value than the wage equivalent paid. That “more” appears as unpaid labor — the clock above shows how many hours it represents.', 'La clave está entre los pasos 2 y 3: el producto sale de la producción con MÁS valor que el equivalente salarial pagado. Ese “más” aparece como trabajo no pagado — el reloj de arriba muestra cuántas horas representa.'),
                tr('O modelo compara o valor ligado aos salários com o valor que fica além dele. O relógio acima mostra essa divisão em horas de uma jornada de 8 horas.', 'The model compares the value linked to wages with the value beyond it. The clock above shows that split across an 8-hour workday.', 'El modelo compara el valor ligado a los salarios con el valor que queda más allá. El reloj de arriba muestra esa división en una jornada de 8 horas.'),
              )}
            </p>
          </div>

          {/* termômetro do lucro */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h3 className="text-sm font-bold text-zinc-100">{textoPorModo(mode,
              tr('Termômetro do lucro', 'Profit gauge', 'Medidor de beneficio'),
              tr('Termômetro do lucro', 'Profit-rate gauge', 'Medidor de la tasa de ganancia'),
              tr('Quanto volta como lucro', 'How much returns as profit', 'Cuánto vuelve como beneficio'))}</h3>
            <div className="mt-3">
              <div className="relative h-5 w-full overflow-visible rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400">
                <div className="absolute -top-1.5 h-8 w-1.5 rounded-full bg-white shadow-lg ring-2 ring-zinc-950"
                  style={{ left: `calc(${Math.min(Math.max(r.profitRate, 0), 100).toFixed(1)}% - 3px)` }} />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[9px] text-zinc-500">
                <span>0% ({tr('prejuízo', 'loss', 'pérdida')})</span><span>50%</span><span>100%</span>
              </div>
              <p className="mt-2 font-mono text-sm font-bold text-zinc-100">
                {tr('a cada R$100 investidos, voltam', 'for each R$100 invested, profit is', 'por cada R$100 invertidos, el beneficio es')} <span className="text-money">R${r.profitRate.toFixed(0)}</span>
              </p>
              <p className="mt-1 text-[10.5px] leading-snug text-zinc-500">
                {textoPorModo(
                  mode,
                  tr('mexa nos controles e veja como o ponteiro muda.', 'move the controls and watch the marker change.', 'mueve los controles y observa cómo cambia el indicador.'),
                  tr('mexa os sliders e veja o ponteiro: mais automação = ponteiro escorregando para a esquerda.', 'move the sliders and watch the marker: more automation pushes it to the left.', 'mueve los controles y observa el indicador: más automatización lo empuja hacia la izquierda.'),
                  tr('mexa nos controles para comparar os cenários.', 'move the controls to compare scenarios.', 'mueve los controles para comparar escenarios.'),
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {didatico ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed border-sky-400/40 bg-sky-400/5 p-4">
            <h4 className="text-sm font-bold text-sky-300">
              {textoPorModo(mode,
                tr('O que muda quando entram mais máquinas?', 'What changes when more machines are added?', '¿Qué cambia cuando entran más máquinas?'),
                tr('Por que a automação derruba o lucro?', 'Why can automation lower the profit rate?', '¿Por qué puede la automatización reducir la tasa de ganancia?'),
                tr('O que o modelo mostra sobre automação?', 'What does the model show about automation?', '¿Qué muestra el modelo sobre la automatización?'))}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              {textoPorModo(
                mode,
                tr('Neste modelo, colocar mais máquinas por trabalhador aumenta a parte do investimento gasta em equipamentos. Mantendo as outras regras iguais, a porcentagem de lucro sobre todo o investimento diminui.', 'In this model, adding more machinery per worker increases the share of investment spent on equipment. Holding the other rules constant, profit as a percentage of total investment falls.', 'En este modelo, añadir más maquinaria por trabajador aumenta la parte de la inversión gastada en equipos. Manteniendo las demás reglas constantes, el beneficio como porcentaje de la inversión total disminuye.'),
                tr('Máquinas transferem valor, mas no modelo o novo valor vem do trabalho vivo. Quanto mais máquinas em relação ao trabalho, menor a taxa de lucro sobre todo o capital investido: é a “tendência de queda da taxa de lucro”.', 'Machines transfer value, while in the model new value comes from living labor. The more machinery there is relative to labor, the lower the profit rate on total capital: the “tendency of the rate of profit to fall.”', 'Las máquinas transfieren valor, mientras que en el modelo el nuevo valor proviene del trabajo vivo. Cuanta más maquinaria haya en relación con el trabajo, menor será la tasa de ganancia sobre el capital total: la “tendencia decreciente de la tasa de ganancia”.'),
                tr('Neste modelo, mais máquinas por trabalhador mudam a divisão do investimento e podem reduzir a taxa de lucro calculada.', 'In this model, more machines per worker change the composition of investment and can reduce the calculated profit rate.', 'En este modelo, más máquinas por trabajador cambian la composición de la inversión y pueden reducir la tasa de ganancia calculada.'),
              )}
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-fuchsia-400/40 bg-fuchsia-400/5 p-4">
            <h4 className="text-sm font-bold text-fuchsia-300">
              {textoPorModo(mode,
                tr('E os bancos?', 'What about banks?', '¿Y los bancos?'),
                tr('Bancos × produção real', 'Banks × real production', 'Bancos × producción real'),
                tr('Onde entram os bancos?', 'Where do banks enter?', '¿Dónde entran los bancos?'))}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              {textoPorModo(
                mode,
                tr('Bancos também recebem dinheiro por juros de empréstimos. Esse fluxo acontece junto da produção e ajuda a explicar para onde vai parte da renda de famílias, empresas e governos.', 'Banks also receive income through loan interest. This flow runs alongside production and helps explain where part of the income of households, firms and governments goes.', 'Los bancos también reciben ingresos por intereses de préstamos. Ese flujo ocurre junto a la producción y ayuda a explicar adónde va parte del ingreso de hogares, empresas y gobiernos.'),
                tr('Nem todo capital passa pela fábrica: bancos operam também no circuito M—M′ (emprestar para receber mais). Juros, aluguéis e serviço da dívida redistribuem parte do valor criado na produção.', 'Not all capital passes through the factory: banks also operate through the M—M′ circuit, lending money to receive more money. Interest, rent and debt service redistribute part of the value created in production.', 'No todo el capital pasa por la fábrica: los bancos también operan mediante el circuito M—M′, prestando dinero para recibir más dinero. Intereses, rentas y servicio de deuda redistribuyen parte del valor creado en la producción.'),
                tr('Além da produção, existem fluxos financeiros como juros de empréstimos. Eles redistribuem parte da renda entre famílias, empresas, bancos e governo.', 'Alongside production there are financial flows such as loan interest. They redistribute part of income among households, firms, banks and government.', 'Además de la producción existen flujos financieros como los intereses de préstamos. Redistribuyen parte del ingreso entre hogares, empresas, bancos y gobierno.'),
              )}
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-money/40 bg-money/5 p-4 sm:col-span-2">
            <h4 className="text-sm font-bold text-money">
              {textoPorModo(mode,
                tr('E se ninguém comprar?', 'What if nobody buys?', '¿Y si nadie compra?'),
                tr('Mas… quem garante que C′ será VENDIDO? (Keynes & Kalecki)', 'But… who guarantees that C′ will be SOLD? (Keynes & Kalecki)', 'Pero… ¿quién garantiza que C′ será VENDIDO? (Keynes y Kalecki)'),
                tr('Produzir não basta: alguém precisa comprar', 'Producing is not enough: someone must buy', 'Producir no basta: alguien tiene que comprar'))}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              {textoPorModo(
                mode,
                tr('Uma empresa pode produzir e ainda assim não vender tudo. As vendas dependem de pessoas, empresas e governo terem renda e decidirem gastar. O simulador de dívida mostra como os gastos públicos entram nessa história.', 'A firm can produce and still fail to sell everything. Sales depend on households, firms and government having income and choosing to spend. The debt simulator shows how public spending enters this story.', 'Una empresa puede producir y aun así no venderlo todo. Las ventas dependen de que hogares, empresas y gobierno tengan ingresos y decidan gastar. El simulador de deuda muestra cómo entra el gasto público en esta historia.'),
                tr('O circuito mostra como o valor nasce — não se ele será realizado. Isso depende da demanda efetiva: alguém precisa comprar o produto sob incerteza. Por isso o déficit público pode sustentar vendas e lucros, e por isso “todo mundo poupar de uma vez” pode derrubar a demanda agregada (paradoxo da parcimônia).', 'The circuit shows how value is produced — not whether it will be realized in sale. That depends on effective demand: someone must buy the product under uncertainty. A public deficit can therefore support sales and profits, while everyone trying to save at once can depress aggregate demand (the paradox of thrift).', 'El circuito muestra cómo se produce el valor — no si se realizará en la venta. Eso depende de la demanda efectiva: alguien debe comprar el producto bajo incertidumbre. Por eso un déficit público puede sostener ventas y beneficios, mientras que si todos intentan ahorrar a la vez puede caer la demanda agregada (paradoja del ahorro).'),
                tr('Produzir não garante a venda. O resultado também depende de haver compradores e renda circulando na economia.', 'Production does not guarantee a sale. The outcome also depends on buyers and income circulating through the economy.', 'Producir no garantiza la venta. El resultado también depende de que haya compradores e ingresos circulando en la economía.'),
              )}{' '}
              {tr('Veja o simulador no', 'See the simulator in', 'Consulta el simulador en')} {modRef('debt', lang)}.
            </p>
          </div>
        </div>
      ) : (
        <ProfitCurve />
      )}
    </div>
  )
}
