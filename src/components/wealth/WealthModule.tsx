import FollowSalary from './FollowSalary'
import BillionaireTimeline from './BillionaireTimeline'
import { TopOneChart, MirrorBars, ConcentrationStats } from './ConcentrationCharts'
import DataQuiz from '../ui/DataQuiz'
import EscalaCompare from '../ui/EscalaCompare'
import Tip from '../ui/Tip'
import ModeBadge from '../ui/ModeBadge'
import { mt, pick } from '../../i18n'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'

/**
 * MÓDULO 07 — QUEM SUSTENTA QUÊ?
 * Duas demonstrações centrais das diretrizes:
 *   A) o trabalhador sustenta todo o circuito — e o dinheiro não fica com ele;
 *   B) a concentração patrimonial é tendência de regime (Piketty: r > g),
 *      revertida apenas por compressão política (1936–1979).
 */
export default function WealthModule() {
  const lang = useApp((s) => s.lang)
  const mode = useApp((s) => s.mode)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">{mt(lang, 'wealth').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'wealth').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {textoPorModo(
            mode,
            tx('Duas perguntas simples, duas respostas desconfortáveis: (1) quem produz TODA a riqueza? O trabalho. (2) Onde ela fica? Em cima, nas mãos de cada vez menos gente. Aqui você segue o dinheiro passo a passo — do salário até o bilionário.', 'Two simple questions, two uncomfortable answers: (1) who produces ALL wealth? Labor. (2) Where does it end up? At the top, in fewer and fewer hands. Here you follow the money step by step — from wages to billionaires.', 'Dos preguntas simples, dos respuestas incómodas: (1) ¿quién produce TODA la riqueza? El trabajo. (2) ¿Dónde termina? Arriba, en cada vez menos manos. Aquí sigues el dinero paso a paso — del salario al multimillonario.'),
            tx('Circulação do valor entre classes (Kalecki/Marx) + dinâmica seular da concentração patrimonial (WID/Piketty): compressão distributiva 1936–79 como exceção política, não regra econômica; r > g como força restauradora.', 'Circulation of value between classes (Kalecki/Marx) + the secular dynamics of wealth concentration (WID/Piketty): distributive compression in 1936–79 as a political exception, not an economic rule; r > g as the restoring force.', 'Circulación del valor entre clases (Kalecki/Marx) + dinámica secular de la concentración patrimonial (WID/Piketty): la compresión distributiva de 1936–79 como excepción política, no como regla económica; r > g como fuerza restauradora.'),
            tx('Aqui você acompanha dois caminhos: para onde o salário vai depois que chega ao trabalhador e como a riqueza está dividida entre grupos diferentes. Os gráficos usam dados históricos e estimativas indicadas nas fontes.', 'Here you follow two paths: where wages go after reaching workers, and how wealth is divided among different groups. The charts use historical data and estimates identified in the sources.', 'Aquí sigues dos recorridos: adónde va el salario después de llegar al trabajador y cómo se reparte la riqueza entre distintos grupos. Los gráficos usan datos históricos y estimaciones indicadas en las fuentes.'),
          )}
        </p>
      </header>

      <DataQuiz />

      <FollowSalary />

      <section className="flex flex-col gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          {tx('A riqueza foi se aglomerando — século a século', 'Wealth kept concentrating — century after century', 'La riqueza se fue concentrando — siglo tras siglo')}
        </h3>
        <TopOneChart />
        <MirrorBars />
        <ConcentrationStats />
      </section>

      <BillionaireTimeline />

      <EscalaCompare usdBi={454} titulo={tx('Tradutor: a riqueza privada mundial (US$ 454 tri) em unidades humanas', 'Translator: global private wealth (US$ 454 tn) in human-scale units', 'Traductor: la riqueza privada mundial (US$ 454 bill.) en unidades humanas')} />

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-dashed border-sky-400/40 bg-sky-400/5 p-4">
          <h4 className="text-sm font-bold text-sky-300">
            {textoPorModo(mode,
              tx('E então… dá para reverter?', 'So… can it be reversed?', 'Entonces… ¿se puede revertir?'),
              tx('Compressão: a exceção que prova a regra', 'Compression: the exception that proves the rule', 'Compresión: la excepción que confirma la regla'),
              tx('Essa divisão pode mudar?', 'Can this distribution change?', '¿Puede cambiar esta distribución?'),
            )}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">
            {textoPorModo(
              mode,
              tx('Sim — já aconteceu. Entre 1936 e 1979, imposto altíssimo sobre heranças e lucros, sindicatos fortes e salário mínimo valorizado espremeram a fatia dos 1% pela metade. Não foi bondade: foi pressão organizada. Quando a pressão parou, a curva voltou a subir. Concentração não é destino — é escolha política mantida.', 'Yes — it has happened before. Between 1936 and 1979, very high taxes on inheritances and top incomes, strong unions, and rising minimum wages cut the top 1% share roughly in half. It was organized pressure. When that pressure weakened, the curve rose again. Concentration is shaped by sustained political choices.', 'Sí — ya ocurrió. Entre 1936 y 1979, impuestos muy altos sobre herencias y rentas superiores, sindicatos fuertes y un salario mínimo valorizado redujeron aproximadamente a la mitad la porción del 1%. Fue presión organizada. Cuando esa presión se debilitó, la curva volvió a subir. La concentración depende de decisiones políticas sostenidas.'),
              tx('A janela 1936–1979 (top marginal rates >70%, capital controls, densidade sindical >30%) demonstra elasticidade política da distribuição: sem instituições comprimidoras, r>g restaura o padrão patrimonial em ~uma geração.', 'The 1936–1979 window (top marginal rates >70%, capital controls, union density >30%) shows the political elasticity of distribution: without institutions that compress inequality, r > g restores the wealth pattern in roughly one generation.', 'La ventana 1936–1979 (tasas marginales máximas >70%, controles de capital, densidad sindical >30%) muestra la elasticidad política de la distribución: sin instituciones que compriman la desigualdad, r > g restablece el patrón patrimonial en aproximadamente una generación.'),
              tx('Sim. Em vários períodos históricos, impostos, salários, sindicatos, crescimento econômico e preços dos ativos mudaram a divisão da riqueza. O gráfico mostra que essa distribuição varia ao longo do tempo.', 'Yes. In different historical periods, taxes, wages, unions, economic growth, and asset prices changed how wealth was divided. The chart shows that this distribution changes over time.', 'Sí. En distintos períodos históricos, los impuestos, los salarios, los sindicatos, el crecimiento económico y los precios de los activos cambiaron la distribución de la riqueza. El gráfico muestra que esa distribución varía con el tiempo.'),
            )}
          </p>
        </article>
        <Tip text={textoPorModo(
          mode,
          tx('O sistema inteiro — bancos, Estado, acionistas, aluguéis — é sustentado pelo trabalho vivo de todos os dias. Se ele para uma semana, tudo trava. Se os mercados financeiros param uma semana… ninguém passa fome.', 'The whole system — banks, the state, shareholders, rents — ultimately depends on daily living labor. If that labor stops for a week, essential activity stalls. If financial markets close for a week, daily production can still continue.', 'Todo el sistema — bancos, Estado, accionistas, alquileres — depende en última instancia del trabajo vivo cotidiano. Si ese trabajo se detiene una semana, la actividad esencial se paraliza. Si los mercados financieros cierran una semana, la producción diaria puede continuar.'),
          tx('Assimetria estrutural: reprodução social depende integralmente do trabalho vivo; a realização financeira depende dele apenas indiretamente — daí o poder de veto do capital e a fragilidade negociadora do trabalho.', 'Structural asymmetry: social reproduction depends directly on living labor; financial realization depends on it indirectly — one source of capital’s veto power and labor’s weaker bargaining position.', 'Asimetría estructural: la reproducción social depende directamente del trabajo vivo; la realización financiera depende de él de forma indirecta — una fuente del poder de veto del capital y de la menor capacidad negociadora del trabajo.'),
          tx('Transporte, comida, energia e hospitais dependem de trabalho diário. Este cartão usa essa comparação para mostrar a diferença entre produzir bens e serviços e negociar ativos financeiros.', 'Transport, food, energy, and hospitals depend on daily work. This card uses that comparison to show the difference between producing goods and services and trading financial assets.', 'El transporte, la comida, la energía y los hospitales dependen del trabajo diario. Esta tarjeta usa esa comparación para mostrar la diferencia entre producir bienes y servicios y negociar activos financieros.'),
        )}>
          <article className="h-full cursor-help rounded-xl border border-dashed border-red-400/40 bg-red-400/5 p-4">
            <h4 className="text-sm font-bold text-red-300">
              {textoPorModo(mode,
                tx('O teste definitivo', 'The decisive test', 'La prueba decisiva'),
                tx('Teste material da dependência', 'Material test of dependence', 'Prueba material de la dependencia'),
                tx('Compare dois tipos de atividade', 'Compare two kinds of activity', 'Compara dos tipos de actividad'),
              )}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              {tx(
                'Pare o trabalho uma semana: transporte, comida, energia, hospitais — TUDO trava em dias. Pare a bolsa uma semana: a vida continua normal. Quem sustenta quem fica óbvio quando invertemos o experimento.',
                'Stop work for a week: transport, food, energy, hospitals — essential systems stall within days. Close the stock exchange for a week and everyday production can continue. Reversing the experiment makes the dependency visible.',
                'Detén el trabajo durante una semana: transporte, comida, energía, hospitales — los sistemas esenciales se paralizan en pocos días. Cierra la bolsa una semana y la producción cotidiana puede continuar. Invertir el experimento hace visible la dependencia.',
              )}
            </p>
          </article>
        </Tip>
      </div>

      <p className="text-[10px] leading-relaxed text-zinc-600">
        {tx(
          'Fontes: UBS Global Wealth Report 2024 (faixas, fim-2023); World Inequality Database (Top 1% EUA, série aproximada); Oxfam “Inequality Inc.” (2024); Forbes Billionaires 2024/25. Orçamentos domésticos do fluxo “Siga o Salário” são ilustrativos (pesquisas de orçamento familiar brasileiro, arredondados p/ didática).',
          'Sources: UBS Global Wealth Report 2024 (wealth bands, end-2023); World Inequality Database (US Top 1%, approximate series); Oxfam “Inequality Inc.” (2024); Forbes Billionaires 2024/25. Household budgets in “Follow the Wage” are illustrative (Brazilian household-budget surveys, rounded for teaching).',
          'Fuentes: UBS Global Wealth Report 2024 (franjas, fin de 2023); World Inequality Database (Top 1% de EE. UU., serie aproximada); Oxfam “Inequality Inc.” (2024); Forbes Billionaires 2024/25. Los presupuestos domésticos de “Sigue el salario” son ilustrativos (encuestas brasileñas de presupuestos familiares, redondeadas con fines didácticos).',
        )}
      </p>
    </div>
  )
}
