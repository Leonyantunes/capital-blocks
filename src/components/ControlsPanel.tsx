import MetricCard from './MetricCard'
import Tip from './ui/Tip'
import { PRESETS, computeCircuit, fmtHours, pct, units, unpaidHours } from '../lib/marx'
import { pick } from '../i18n'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'

export default function ControlsPanel() {
  const { k, e, setK, setE, mode, lang } = useApp()
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const r = computeCircuit(k, e)
  const didatico = mode !== 'avancado'

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {textoPorModo(mode,
          tr('Mexa na simulação', 'Adjust the simulation', 'Ajusta la simulación'),
          tr('Parâmetros da simulação', 'Simulation parameters', 'Parámetros de la simulación'),
          tr('Teste o que muda', 'Test what changes', 'Prueba qué cambia'))}
      </h3>

      {/* Nível de automação / composição orgânica */}
      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label htmlFor="slider-k" className="text-sm text-zinc-300">
            {mode === 'avancado' ? (
              <>{tr('Composição orgânica', 'Organic composition', 'Composición orgánica')} <span className="font-mono text-zinc-500">k = c/v</span></>
            ) : textoPorModo(mode,
              tr('Nível de Automação', 'Automation level', 'Nivel de automatización'),
              tr('Nível de Automação', 'Automation level', 'Nivel de automatización'),
              tr('Máquinas por trabalhador', 'Machines per worker', 'Máquinas por trabajador'))}
          </label>
          <Tip text={textoPorModo(
            mode,
            tr('Quantas máquinas e matérias-primas para cada trabalhador. Suba para "automatizar".', 'How many machines and raw materials per worker. Raise it to "automate".', 'Cuántas máquinas y materias primas por trabajador. Súbelo para "automatizar".'),
            tr('k = c/v: razão entre capital constante e variável.', 'k = c/v: ratio of constant to variable capital.', 'k = c/v: razón entre capital constante y variable.'),
            tr('Quanto a empresa usa de máquinas e materiais em comparação com a quantidade de trabalho.', 'How much the company uses machines and materials relative to labor.', 'Cuánto usa la empresa máquinas y materiales en relación con el trabajo.'),
          )}>
            <span className="cursor-help font-mono text-sm font-semibold text-sky-300">{r.k.toFixed(1)}</span>
          </Tip>
        </div>
        <input id="slider-k" type="range" min={0.5} max={14} step={0.1}
          value={k} onChange={(ev) => setK(parseFloat(ev.target.value))} />
        <p className="mt-1 text-[11px] leading-tight text-zinc-500">
          {textoPorModo(
            mode,
            tr('Mais robôs e matérias-primas por pessoa — menos gente empregada por real investido.', 'More robots and raw materials per person — fewer people employed per unit invested.', 'Más robots y materias primas por persona — menos personas empleadas por unidad invertida.'),
            tr('Automação ↑ ⇒ mais máquina (c), menos trabalho vivo (v).', 'Automation ↑ ⇒ more machinery (c), less living labor (v).', 'Automatización ↑ ⇒ más maquinaria (c), menos trabajo vivo (v).'),
            tr('Para o mesmo investimento, aumentar este controle significa usar mais máquinas e materiais por trabalhador.', 'For the same investment, raising this control means using more machines and materials per worker.', 'Para la misma inversión, aumentar este control significa usar más máquinas y materiales por trabajador.'),
          )}
        </p>
      </div>

      {/* Intensidade de exploração / taxa de mais-valia */}
      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label htmlFor="slider-e" className="text-sm text-zinc-300">
            {mode === 'avancado' ? (
              <>{tr('Taxa de mais-valia', 'Rate of surplus value', 'Tasa de plusvalía')} <span className="font-mono text-zinc-500">e = m/v</span></>
            ) : textoPorModo(mode,
              tr('Intensidade de Exploração', 'Exploitation intensity', 'Intensidad de explotación'),
              tr('Intensidade de Exploração', 'Exploitation intensity', 'Intensidad de explotación'),
              tr('Tempo de trabalho não pago', 'Unpaid labor time', 'Tiempo de trabajo no pagado'))}
          </label>
          <Tip text={textoPorModo(
            mode,
            tr(`Jornada de 8h: ${fmtHours(unpaidHours(e))} são trabalho gratuito para a empresa.`, `8-hour workday: ${fmtHours(unpaidHours(e))} are unpaid work for the company.`, `Jornada de 8 h: ${fmtHours(unpaidHours(e))} son trabajo no pagado para la empresa.`),
            tr('e = m/v: mais-valia dividida pelo capital variável.', 'e = m/v: surplus value divided by variable capital.', 'e = m/v: plusvalía dividida por capital variable.'),
            tr(`Em uma jornada de 8h, este modelo representa ${fmtHours(unpaidHours(e))} além do tempo equivalente ao salário.`, `In an 8-hour workday, this model represents ${fmtHours(unpaidHours(e))} beyond the time equivalent to the wage.`, `En una jornada de 8 h, este modelo representa ${fmtHours(unpaidHours(e))} más allá del tiempo equivalente al salario.`),
          )}>
            <span className="cursor-help font-mono text-sm font-semibold text-red-300">{pct(e * 100, 0)}</span>
          </Tip>
        </div>
        <input id="slider-e" type="range" min={0.5} max={5} step={0.05}
          value={e} onChange={(ev) => setE(parseFloat(ev.target.value))} />
        <p className="mt-1 text-[11px] leading-tight text-zinc-500">
          {textoPorModo(
            mode,
            tr(`Quanto do dia é trabalho gratuito: hoje, ${fmtHours(unpaidHours(e))} das 8 horas.`, `How much of the day is unpaid work: currently ${fmtHours(unpaidHours(e))} out of 8 hours.`, `Cuánto del día es trabajo no pagado: actualmente ${fmtHours(unpaidHours(e))} de 8 horas.`),
            tr('Intensidade da exploração: jornada, produtividade e salário real.', 'Exploitation intensity: workday, productivity and real wage.', 'Intensidad de explotación: jornada, productividad y salario real.'),
            tr(`O modelo separa ${fmtHours(unpaidHours(e))} das 8 horas como tempo além do equivalente ao salário.`, `The model separates ${fmtHours(unpaidHours(e))} of the 8 hours as time beyond the wage equivalent.`, `El modelo separa ${fmtHours(unpaidHours(e))} de las 8 horas como tiempo más allá del equivalente salarial.`),
          )}
        </p>
      </div>

      {/* Presets históricos gamificados */}
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-widest text-zinc-500">
          {textoPorModo(mode,
            tr('Viaje no tempo', 'Travel through time', 'Viaja en el tiempo'),
            tr('Presets históricos', 'Historical presets', 'Preajustes históricos'),
            tr('Veja exemplos históricos', 'See historical examples', 'Mira ejemplos históricos'))}
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
                {tr(p.label,
                  p.id === 'manufatura' ? '19th-century manufacturing' : p.id === 'fordismo' ? 'Fordist industry' : p.id === 'automacao' ? 'Automation / AI' : 'Platformization & gig work',
                  p.id === 'manufatura' ? 'Manufactura del siglo XIX' : p.id === 'fordismo' ? 'Industria fordista' : p.id === 'automacao' ? 'Automatización / IA' : 'Uberización y plataformas')}
                {mode === 'simples' ? (
                  <span className="ml-1 font-mono text-[10px] opacity-70">
                    {tr('máquinas', 'machines', 'máquinas')} {p.k} · {fmtHours(unpaidHours(p.e))} {tr('além do salário', 'beyond the wage', 'más allá del salario')}
                  </span>
                ) : (
                  <span className="ml-1 font-mono text-[10px] opacity-60">
                    k={p.k} · e={p.e}
                  </span>
                )}
                {mode === 'didatico' && (
                  <span className="ml-1 font-mono text-[10px] text-emerald-300/80">
                    · {fmtHours(unpaidHours(p.e))} {tr('não pagas', 'unpaid', 'no pagadas')}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Leituras derivadas */}
      <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3">
        <MetricCard label={textoPorModo(mode, tr('Investimento em máquinas', 'Investment in machinery', 'Inversión en maquinaria'), tr('Capital constante c', 'Constant capital c', 'Capital constante c'), tr('Máquinas e materiais', 'Machines and materials', 'Máquinas y materiales'))} value={units(r.c)}
          formula={didatico ? undefined : 'c = k·v'} accent="text-sky-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')}
          tip={textoPorModo(
            mode,
            tr('Matérias-primas, fábricas e máquinas usadas pela empresa na produção.', 'Raw materials, factories and machines used by the company in production.', 'Materias primas, fábricas y máquinas usadas por la empresa en la producción.'),
            tr('Capital constante: meios de produção que transferem seu valor ao produto.', 'Constant capital: means of production that transfer their value to the product.', 'Capital constante: medios de producción que transfieren su valor al producto.'),
            tr('Tudo o que a empresa usa para produzir, como máquinas, prédios e materiais.', 'Everything the company uses to produce, such as machines, buildings and materials.', 'Todo lo que la empresa usa para producir, como máquinas, edificios y materiales.'),
          )} />
        <MetricCard label={textoPorModo(mode, tr('Folha de salários', 'Payroll', 'Nómina salarial'), tr('Capital variável v', 'Variable capital v', 'Capital variable v'), tr('Salários', 'Wages', 'Salarios'))} value={units(r.v)}
          formula={didatico ? undefined : 'v = 100 (base)'}
          accent="text-red-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')}
          tip={textoPorModo(
            mode,
            tr('O total que a empresa paga às pessoas que trabalham neste exemplo.', 'The total the company pays the people working in this example.', 'El total que la empresa paga a las personas que trabajan en este ejemplo.'),
            tr('Capital variável: parcela adiantada em salários para comprar força de trabalho.', 'Variable capital: the amount advanced in wages to purchase labor power.', 'Capital variable: parte adelantada en salarios para comprar fuerza de trabajo.'),
            tr('Quanto a empresa paga em salários neste exemplo.', 'How much the company pays in wages in this example.', 'Cuánto paga la empresa en salarios en este ejemplo.'),
          )} />
        <MetricCard label={textoPorModo(mode, tr('Lucro novo produzido', 'New profit produced', 'Nuevo beneficio producido'), tr('Mais-valia m', 'Surplus value m', 'Plusvalía m'), tr('Valor que fica depois dos salários', 'Value left after wages', 'Valor que queda después de los salarios'))} value={units(r.m)}
          formula={didatico ? undefined : 'm = e·v'}
          accent="text-emerald-300" fonte={tr('modelo do app', 'app model', 'modelo de la app')}
          tip={textoPorModo(
            mode,
            tr('No modelo, é a parte do valor produzido que fica com a empresa depois da parcela equivalente aos salários.', 'In the model, it is the part of produced value that remains with the company after the wage-equivalent share.', 'En el modelo, es la parte del valor producido que queda en la empresa después de la parte equivalente a los salarios.'),
            tr('Mais-valia: valor excedente produzido além do equivalente ao salário, m = e·v.', 'Surplus value: excess value produced beyond the wage equivalent, m = e·v.', 'Plusvalía: valor excedente producido más allá del equivalente salarial, m = e·v.'),
            tr('A parte do valor produzido que o modelo separa da parcela equivalente aos salários.', 'The part of produced value the model separates from the wage-equivalent share.', 'La parte del valor producido que el modelo separa de la parte equivalente a los salarios.'),
          )} />
        <MetricCard label={textoPorModo(mode, tr('Valor total produzido', 'Total value produced', 'Valor total producido'), tr('Valor novo C′', 'New value C′', 'Valor nuevo C′'), tr('Valor total do exemplo', 'Total value in the example', 'Valor total del ejemplo'))} value={units(r.W)} fonte={tr('modelo do app', 'app model', 'modelo de la app')} />
      </div>
    </div>
  )
}
