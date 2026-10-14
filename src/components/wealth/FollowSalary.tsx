import { useState } from 'react'
import { SALARY_PRESETS } from '../../data/concentration'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'
import { locale, pick } from '../../i18n'

const W = 900
const H = 470

interface DestNode {
  key: 'renda' | 'corporacoes' | 'bancos' | 'estado'
  label: string
  sub: string
  color: string
  y: number
}

const DESTS: DestNode[] = [
  { key: 'renda', label: 'Proprietários & fundos', sub: 'aluguel, financiamento imobiliário', color: '#ba68c8', y: 118 },
  { key: 'corporacoes', label: 'Corporações', sub: 'consumo vira lucro extra', color: '#4caf50', y: 198 },
  { key: 'bancos', label: 'Bancos', sub: 'juros — dinheiro rendendo dinheiro', color: '#ffc107', y: 278 },
  { key: 'estado', label: 'Estado → dívida → rentistas', sub: 'impostos pagos viram juros', color: '#f87171', y: 358 },
]

const HALO = {
  paintOrder: 'stroke' as const,
  stroke: '#0d1117',
  strokeWidth: 4.5,
  strokeLinejoin: 'round' as const,
}

/** SIGA O SALÁRIO — percentuais vivem nas caixas de destino (zero sobreposição). */
export default function FollowSalary() {
  const [presetId, setPresetId] = useState(SALARY_PRESETS[1].id)
  const preset = SALARY_PRESETS.find((p) => p.id === presetId)!
  const sobra = Math.max(100 - preset.streams.reduce((s, x) => s + x.pct, 0), 0)
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const didatico = mode !== 'avancado'
  const loc = locale(lang)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)

  const presetLabel = (id: string) => {
    if (id === 'minimo') return tx('Salário mínimo', 'Minimum wage', 'Salario mínimo')
    if (id === 'medio') return tx('Salário médio', 'Average wage', 'Salario medio')
    return tx('Classe média alta', 'Upper middle income', 'Clase media alta')
  }
  const presetRange = (id: string) => {
    const monthly = id === 'minimo' ? 1518 : id === 'medio' ? 3100 : 8000
    return `≈ R$ ${monthly.toLocaleString(loc)}/${tx('mês', 'month', 'mes')}`
  }
  const streamLabel = (rotulo: string) => {
    switch (rotulo) {
      case 'Aluguel / moradia': return tx(rotulo, 'Rent / housing', 'Alquiler / vivienda')
      case 'Comida & básicos': return tx(rotulo, 'Food & essentials', 'Comida y básicos')
      case 'Impostos embutidos no consumo': return tx(rotulo, 'Taxes embedded in consumption', 'Impuestos incluidos en el consumo')
      case 'Juros de dívidas (cartão, crediário)': return tx(rotulo, 'Debt interest (cards, installment credit)', 'Intereses de deuda (tarjeta, crédito a plazos)')
      case 'Aluguel / financiamento': return tx(rotulo, 'Rent / mortgage', 'Alquiler / hipoteca')
      case 'Consumo familiar': return tx(rotulo, 'Household consumption', 'Consumo familiar')
      case 'Impostos embutidos': return tx(rotulo, 'Embedded taxes', 'Impuestos incluidos')
      case 'Juros (cartão, carro, cheque especial)': return tx(rotulo, 'Interest (cards, car, overdraft)', 'Intereses (tarjeta, auto, descubierto)')
      case 'Moradia melhor / condomínio': return tx(rotulo, 'Better housing / condo fees', 'Mejor vivienda / comunidad')
      case 'Consumo & serviços': return tx(rotulo, 'Consumption & services', 'Consumo y servicios')
      case 'Juros & seguros': return tx(rotulo, 'Interest & insurance', 'Intereses y seguros')
      default: return rotulo
    }
  }

  const workerX = 218
  const destX = 596
  const pctOf = (dest: DestNode['key']) => preset.streams.find((s) => s.dest === dest)?.pct ?? 0
  const destCopy = (d: DestNode) => {
    if (mode !== 'simples') {
      switch (d.key) {
        case 'renda': return { label: tx('Proprietários & fundos', 'Property owners & funds', 'Propietarios y fondos'), sub: tx('aluguel, financiamento imobiliário', 'rent, mortgage financing', 'alquiler, financiación hipotecaria') }
        case 'corporacoes': return { label: tx('Corporações', 'Corporations', 'Corporaciones'), sub: tx('consumo vira lucro extra', 'consumption becomes additional profit', 'el consumo se convierte en beneficio adicional') }
        case 'bancos': return { label: tx('Bancos', 'Banks', 'Bancos'), sub: tx('juros — dinheiro rendendo dinheiro', 'interest — money earning money', 'intereses — dinero generando dinero') }
        case 'estado': return { label: tx('Estado → dívida → rentistas', 'State → debt → rentiers', 'Estado → deuda → rentistas'), sub: tx('impostos pagos viram juros', 'paid taxes become interest payments', 'los impuestos pagados se convierten en intereses') }
      }
    }
    switch (d.key) {
      case 'renda': return { label: tx('Moradia', 'Housing', 'Vivienda'), sub: tx('aluguel e financiamento da casa', 'rent and home financing', 'alquiler y financiación de la vivienda') }
      case 'corporacoes': return { label: tx('Lojas e empresas', 'Shops and companies', 'Tiendas y empresas'), sub: tx('compras de produtos e serviços', 'purchases of goods and services', 'compras de productos y servicios') }
      case 'bancos': return { label: tx('Bancos', 'Banks', 'Bancos'), sub: tx('juros de empréstimos e financiamentos', 'loan and financing interest', 'intereses de préstamos y financiación') }
      case 'estado': return { label: tx('Governo', 'Government', 'Gobierno'), sub: tx('impostos e outras cobranças', 'taxes and other charges', 'impuestos y otros cobros') }
    }
    return { label: d.label, sub: d.sub }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">{tx('Siga o salário: para onde vai cada real', 'Follow the wage: where each unit of pay goes', 'Sigue el salario: adónde va cada unidad del sueldo')}</h3>
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {SALARY_PRESETS.map((p) => (
            <button key={p.id} onClick={() => setPresetId(p.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                presetId === p.id ? 'bg-money text-onaccent' : 'text-zinc-400 hover:text-zinc-200'
              }`}>
              {presetLabel(p.id)}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-0.5 text-[11px] text-zinc-500">
        {tx('Orçamento doméstico ilustrativo', 'Illustrative household budget', 'Presupuesto doméstico ilustrativo')} · {presetRange(preset.id)} · {tx('os percentuais aparecem em cada caixa de destino', 'percentages appear in each destination box', 'los porcentajes aparecen en cada caja de destino')}
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-auto w-full" role="img" aria-label={tx('Fluxo do salário do trabalhador para as frações de capital', 'Flow of workers’ wages toward different capital-income destinations', 'Flujo del salario del trabajador hacia distintos destinos de renta del capital')}>
        <defs>
          {DESTS.map((d) => (
            <marker key={d.key} id={`salArr-${d.key}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={d.color} />
            </marker>
          ))}
          <marker id="salArrM" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ce93d8" />
          </marker>
          <marker id="salArrV" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f44336" />
          </marker>
        </defs>

        {/* ── ACIONISTAS ── */}
        <g>
          <rect x={destX} y={16} width={264} height={48} rx={9} fill="#1a1220" stroke="#ce93d8" strokeOpacity="0.8" />
          <text x={destX + 12} y={35} fontSize="11.5" fontWeight="700" fill="#ce93d8">
            {textoPorModo(mode, tx('ACIONISTAS', 'SHAREHOLDERS', 'ACCIONISTAS'), tx('ACIONISTAS', 'SHAREHOLDERS', 'ACCIONISTAS'), tx('DONOS E ACIONISTAS', 'OWNERS & SHAREHOLDERS', 'DUEÑOS Y ACCIONISTAS'))}
          </text>
          <text x={destX + 12} y={50} fontSize="9" className="fill-zinc-500">
            {textoPorModo(mode, tx('dividendos · buybacks · valorização', 'dividends · buybacks · appreciation', 'dividendos · recompras · valorización'), tx('dividendos · buybacks · valorização', 'dividends · buybacks · appreciation', 'dividendos · recompras · valorización'), tx('lucros distribuídos e valorização das ações', 'distributed profits and share appreciation', 'beneficios distribuidos y valorización de las acciones'))}
          </text>
          <title>{textoPorModo(mode, tx('Parte do valor produzido é apropriada por quem possui a empresa.', 'Part of the value produced is appropriated by those who own the company.', 'Parte del valor producido es apropiada por quienes poseen la empresa.'), tx('Mais-valia produzida pelo trabalho e apropriada pelos proprietários do capital.', 'Surplus value produced by labor and appropriated by owners of capital.', 'Plusvalía producida por el trabajo y apropiada por los propietarios del capital.'), tx('Parte do valor produzido pode ficar com os donos e acionistas.', 'Part of the value produced can remain with owners and shareholders.', 'Parte del valor producido puede quedar en manos de dueños y accionistas.'))}</title>
        </g>

        {/* ── fluxo +m ── */}
        <path d={`M 218 54 Q 407 30 596 40`} fill="none" stroke="#ce93d8" strokeWidth="2.6"
          strokeDasharray="7 5" className="flow-line" markerEnd="url(#salArrM)">
          <title>{textoPorModo(mode, tx('O trabalho não pago vai para quem possui a empresa.', 'Unpaid labor goes to those who own the company.', 'El trabajo no pagado va a quienes poseen la empresa.'), tx('Mais-valia: o trabalho não pago vai direto para quem possui, sem passar pelo rendimento do trabalhador.', 'Surplus value: unpaid labor goes directly to owners without passing through workers’ income.', 'Plusvalía: el trabajo no pagado va directamente a los propietarios sin pasar por el ingreso del trabajador.'), tx('Esta linha mostra a parte do valor que o modelo coloca diretamente com os donos.', 'This line shows the share of value that the model assigns directly to owners.', 'Esta línea muestra la parte del valor que el modelo asigna directamente a los dueños.'))}</title>
        </path>
        <text x={407} y={22} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#ce93d8"
          className="font-mono" style={HALO}>
          {textoPorModo(mode, tx('+ trabalho não pago — nunca volta', '+ unpaid labor — never returns', '+ trabajo no pagado — no vuelve'), tx('+m (trabalho não pago) — nunca volta', '+m (unpaid labor) — never returns', '+m (trabajo no pagado) — no vuelve'), tx('+ valor que fica com os donos', '+ value retained by owners', '+ valor que queda con los dueños'))}
        </text>

        {/* ── EMPRESA ── */}
        <g>
          <rect x={40} y={30} width={178} height={64} rx={10} fill="#161b22" stroke="#4caf50" strokeOpacity="0.6" />
          <text x={129} y={52} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-300">{tx('EMPRESA', 'COMPANY', 'EMPRESA')}</text>
          {mode === 'simples' ? (
            <>
              <text x={129} y={68} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('vende o que foi produzido', 'sells what was produced', 'vende lo que se produjo')}</text>
              <text x={129} y={82} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('e paga os salários', 'and pays wages', 'y paga los salarios')}</text>
            </>
          ) : didatico ? (
            <>
              <text x={129} y={68} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('vende o produto pelo preço cheio…', 'sells the product at full price…', 'vende el producto al precio completo…')}</text>
              <text x={129} y={82} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('…e paga só o salário', '…and pays only the wage', '…y paga solo el salario')}</text>
            </>
          ) : (
            <>
              <text x={129} y={68} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('recebe C′ = c+v+m', 'receives C′ = c+v+m', 'recibe C′ = c+v+m')}</text>
              <text x={129} y={82} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('devolve só v ao trabalho', 'returns only v to labor', 'devuelve solo v al trabajo')}</text>
            </>
          )}
          <title>{textoPorModo(mode, tx('A empresa vende o produto e paga salários; o restante é dividido entre outros destinos.', 'The company sells the product and pays wages; the remainder is divided among other destinations.', 'La empresa vende el producto y paga salarios; el resto se divide entre otros destinos.'), tx('A empresa realiza o valor da mercadoria e devolve ao trabalho apenas a parcela salarial.', 'The company realizes the commodity’s value and returns only the wage share to labor.', 'La empresa realiza el valor de la mercancía y devuelve al trabajo solo la parte salarial.'), tx('A empresa vende o que produziu, paga salários e distribui o restante entre outros destinos.', 'The company sells what was produced, pays wages, and distributes the remainder to other destinations.', 'La empresa vende lo producido, paga salarios y distribuye el resto entre otros destinos.'))}</title>
        </g>

        {/* salário */}
        <path d={`M 129 94 L 129 156`} fill="none" stroke="#f44336" strokeWidth="2.5" markerEnd="url(#salArrV)">
          <title>{textoPorModo(mode, tx('Salário recebido pelo trabalhador.', 'Wage received by the worker.', 'Salario recibido por el trabajador.'), tx('Salário: parcela do valor que retorna ao trabalhador como rendimento.', 'Wage: the share of value that returns to the worker as income.', 'Salario: parte del valor que vuelve al trabajador como ingreso.'), tx('Dinheiro recebido pelo trabalhador como salário.', 'Money received by the worker as wages.', 'Dinero recibido por el trabajador como salario.'))}</title>
        </path>
        <text x={139} y={130} fontSize="10" className="fill-red-300 font-mono" style={HALO}>
          {textoPorModo(mode, tx('salário', 'wage', 'salario'), tx('−v (salário)', '−v (wage)', '−v (salario)'), tx('salário', 'wage', 'salario'))}
        </text>

        {/* ── TRABALHADOR ── */}
        <g>
          <rect x={40} y={162} width={178} height={112} rx={12} fill="#161b22" stroke="#f44336" strokeWidth="2" />
          <text x={129} y={188} textAnchor="middle" fontSize="13" fontWeight="800" className="fill-zinc-100">{tx('TRABALHADOR(A)', 'WORKER', 'TRABAJADOR/A')}</text>
          {mode === 'simples' ? (
            <>
              <text x={129} y={206} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('participa da produção', 'takes part in production', 'participa en la producción')}</text>
              <text x={129} y={222} textAnchor="middle" fontSize="9.5" className="fill-red-300">{tx('recebe o salário', 'receives the wage', 'recibe el salario')}</text>
            </>
          ) : didatico ? (
            <>
              <text x={129} y={206} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('produz TODA a riqueza', 'produces ALL the wealth', 'produce TODA la riqueza')}</text>
              <text x={129} y={222} textAnchor="middle" fontSize="9.5" className="fill-red-300">{tx('recebe só o salário', 'receives only the wage', 'recibe solo el salario')}</text>
            </>
          ) : (
            <>
              <text x={129} y={206} textAnchor="middle" fontSize="9.5" className="fill-zinc-400">{tx('produz W = c+v+m', 'produces W = c+v+m', 'produce W = c+v+m')}</text>
              <text x={129} y={222} textAnchor="middle" fontSize="9.5" className="fill-red-300 font-mono">{tx('fica com v (salário)', 'keeps v (wage)', 'se queda con v (salario)')}</text>
            </>
          )}
          <text x={129} y={240} textAnchor="middle" fontSize="9.5" className="fill-sky-300 font-mono">
            {tx('sobra', 'left over', 'sobra')}: {sobra}% ({tx('poupança', 'savings', 'ahorro')})
          </text>
          <text x={129} y={258} textAnchor="middle" fontSize="8.5" className="fill-zinc-500">
            {textoPorModo(mode, tx('o resto vai p/ quem está acima ↑', 'the rest flows upward ↑', 'el resto fluye hacia arriba ↑'), tx('o resto sustenta o sistema ↑', 'the rest sustains the system ↑', 'el resto sostiene el sistema ↑'), tx('o restante vai para os destinos à direita ↑', 'the remainder goes to the destinations on the right ↑', 'el resto va a los destinos de la derecha ↑'))}
          </text>
          <title>{textoPorModo(mode, tx('O salário recebido é repartido entre gastos e possível poupança.', 'The wage received is split between expenses and possible savings.', 'El salario recibido se reparte entre gastos y posible ahorro.'), tx('O salário é uma fração do valor produzido e volta à circulação por diferentes pagamentos.', 'The wage is a fraction of produced value and returns to circulation through different payments.', 'El salario es una fracción del valor producido y vuelve a circular mediante distintos pagos.'), tx('O salário é dividido entre vários gastos; se houver sobra, ela pode ser guardada.', 'The wage is divided among several expenses; any remainder can be saved.', 'El salario se divide entre varios gastos; si sobra algo, puede ahorrarse.'))}</title>
        </g>

        {sobra >= 15 && (
          <text x={129} y={292} textAnchor="middle" fontSize="9" className="fill-sky-300">
            {textoPorModo(mode, tx('renda alta → dá até para guardar e investir', 'higher income → some can be saved and invested', 'ingreso alto → hasta permite ahorrar e invertir'), tx('renda alta → a sobra vira capital (r > g)', 'higher income → the surplus becomes capital (r > g)', 'ingreso alto → el excedente se convierte en capital (r > g)'), tx('com renda maior, pode sobrar dinheiro para guardar ou investir', 'with higher income, money may remain to save or invest', 'con mayor ingreso, puede sobrar dinero para ahorrar o invertir'))}
          </text>
        )}

        {/* ── fluxos (sem rótulos no meio — pct nas caixas) ── */}
        {preset.streams.map((st, i) => {
          const dest = DESTS.find((d) => d.key === st.dest)!
          const copy = destCopy(dest)
          const bend = (i % 2 === 0 ? 1 : -1) * (18 + i * 12)
          const mx = (workerX + destX) / 2
          const my = (210 + dest.y) / 2
          const d = `M ${workerX} 210 Q ${mx} ${my - bend} ${destX} ${dest.y}`
          const w = 1.6 + (st.pct / 34) * 3.2
          return (
            <path key={st.rotulo} d={d} fill="none" stroke={dest.color} strokeWidth={w}
              strokeDasharray="6 5" opacity="0.85" markerEnd={`url(#salArr-${st.dest})`}>
              <title>{`${streamLabel(st.rotulo)}: ${st.pct}% ${tx('do salário', 'of the wage', 'del salario')} → ${copy.label} (${copy.sub})`}</title>
            </path>
          )
        })}
        {[0, 1].map((j) =>
          preset.streams.map((st, i) => {
            const dest = DESTS.find((d) => d.key === st.dest)!
            const bend = (i % 2 === 0 ? 1 : -1) * (18 + i * 12)
            const mx = (workerX + destX) / 2
            const my = (210 + dest.y) / 2
            const d = `M ${workerX} 210 Q ${mx} ${my - bend} ${destX} ${dest.y}`
            return (
              <circle key={`${st.rotulo}-${j}`} r="2.4" fill={dest.color}>
                <animateMotion dur={`${3.2 + i * 0.4}s`} repeatCount="indefinite"
                  begin={`-${j * (3.2 + i * 0.4) / 2}s`} path={d} />
              </circle>
            )
          }),
        )}

        {/* ── nós destino (com percentual embutido) ── */}
        {DESTS.map((d) => {
          const pct = pctOf(d.key)
          const copy = destCopy(d)
          return (
            <g key={d.key}>
              <rect x={destX} y={d.y - 28} width={264} height={56} rx={9} fill="#161b22" stroke={d.color} strokeOpacity="0.65" />
              <text x={destX + 12} y={d.y - 8} fontSize="11.5" fontWeight="700" fill={d.color}>{copy.label}</text>
              <text x={destX + 12} y={d.y + 6} fontSize="9" className="fill-zinc-500">{copy.sub}</text>
              <text x={destX + 12} y={d.y + 20} fontSize="9.5" fontWeight="700" fill={d.color} className="font-mono">
                {pct}% {tx('do salário vai para cá', 'of the wage goes here', 'del salario va aquí')}
              </text>
              <title>{`${copy.label}: ${pct}% ${tx('do salário', 'of the wage', 'del salario')} — ${copy.sub}`}</title>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 text-xs leading-relaxed text-zinc-300">
        {mode === 'simples' ? (
          <>
            {tx('Este é um exemplo de orçamento doméstico. O salário é dividido entre moradia, compras, juros, impostos e outros gastos; quanto sobra depende da renda e das despesas de cada família. Os percentuais aqui são ilustrativos e aparecem nas caixas do desenho.', 'This is an example household budget. Wages are divided among housing, purchases, interest, taxes, and other expenses; what remains depends on each household’s income and costs. The percentages are illustrative and appear in the diagram boxes.', 'Este es un ejemplo de presupuesto doméstico. El salario se divide entre vivienda, compras, intereses, impuestos y otros gastos; lo que sobra depende de los ingresos y gastos de cada hogar. Los porcentajes son ilustrativos y aparecen en las cajas del diagrama.')}
          </>
        ) : didatico ? (
          <>
            {tx('Repare no desenho:', 'Look at the diagram:', 'Mira el diagrama:')}{' '}
            <strong className="text-red-300">{tx('o trabalhador produz o valor inteiro — e quase nada retorna para ele.', 'the worker produces the full value — and only a small share returns as wages.', 'el trabajador produce el valor completo — y solo una pequeña parte vuelve como salario.')}</strong>{' '}
            {tx('O salário se despedaça em aluguel, juro, imposto e lucro de outrem em poucos dias. A única linha que nunca chega de volta é a roxa do topo: o trabalho não pago indo direto para os acionistas. E a “sobra”? Só existe quando o salário já é alto o bastante.', 'The wage quickly splits into rent, interest, taxes, and other firms’ profits. The one line that never returns is the purple line at the top: unpaid labor going directly to shareholders. And the “remainder”? It appears only when income is high enough.', 'El salario se divide rápidamente entre alquiler, intereses, impuestos y beneficios de otras empresas. La única línea que no vuelve es la morada de arriba: trabajo no pagado que va directamente a los accionistas. ¿Y la “sobra”? Solo aparece cuando el ingreso es suficientemente alto.')}
          </>
        ) : (
          <>
            {tx('Circulação do valor entre classes: o adiantamento `v` retorna como rendimento e é reabsorvido pelas frações (renda fundiária, lucro comercial, juros, tributo→serviço da dívida); a massa `m` realiza-se diretamente na esfera acionária. A “sobra” crescente nos presets de renda alta é a porta de entrada da capitalização individual — microfundamento do r > g pikettiano.', 'Circulation of value between classes: the advance `v` returns as income and is reabsorbed by different fractions (ground rent, commercial profit, interest, tax→debt service); the mass `m` is realized directly in the shareholder sphere. The growing “remainder” in higher-income presets opens the door to individual capitalization — a micro-foundation of Piketty’s r > g.', 'Circulación del valor entre clases: el adelanto `v` vuelve como ingreso y es reabsorbido por distintas fracciones (renta del suelo, beneficio comercial, intereses, impuesto→servicio de la deuda); la masa `m` se realiza directamente en la esfera accionaria. La “sobra” creciente en los presets de renta alta abre la puerta a la capitalización individual — un microfundamento del r > g de Piketty.')}
          </>
        )}
      </div>
    </section>
  )
}
