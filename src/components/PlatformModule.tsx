import { useState } from 'react'
import { m } from 'framer-motion'
import Tip from './ui/Tip'
import ModeBadge from './ui/ModeBadge'
import { locale, mt, pick } from '../i18n'
import { useApp } from '../store/useApp'
import { textoPorModo } from '../lib/simples'

interface Params {
  corridas: number
  valorCorrida: number
  kmDia: number
  custoKm: number
  comissaoPct: number
  jornada: number
}

const DEFAULTS: Params = { corridas: 12, valorCorrida: 20, kmDia: 140, custoKm: 0.6, comissaoPct: 25, jornada: 10 }

function Slider({ label, tip, value, min, max, step, unit, onChange, localeCode, accentClass = '' }: {
  label: string; tip?: string; value: number; min: number; max: number; step: number; unit: string
  onChange: (n: number) => void; localeCode: string; accentClass?: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label className="text-xs text-zinc-300">
          {label}{' '}
          {tip && (
            <Tip text={tip}>
              <span className="cursor-help rounded border border-zinc-700 px-1 font-mono text-[9px] text-zinc-500">?</span>
            </Tip>
          )}
        </label>
        <span className="font-mono text-xs font-semibold text-zinc-200">
          {value.toLocaleString(localeCode)} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} className={accentClass} />
    </div>
  )
}

export default function PlatformModule() {
  const [p, setP] = useState<Params>(DEFAULTS)
  const set = function <K extends keyof Params>(key: K) {
    return (v: number) => setP((s) => ({ ...s, [key]: v }))
  }
  const lang = useApp((s) => s.lang)
  const mode = useApp((s) => s.mode)
  const loc = locale(lang)
  const tr = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const didatico = mode !== 'avancado'

  const bruto = p.corridas * p.valorCorrida
  const comissao = bruto * (p.comissaoPct / 100)
  const custos = p.kmDia * p.custoKm
  const liquido = Math.max(bruto - comissao - custos, 0)
  const porHora = liquido / p.jornada
  const minimoHora = 1518 / 220 // salário mínimo 2025 / jornada média mensal CLT
  /** Taxa oculta: quanto a plataforma + custos transferidos representam sobre o que sobra */
  const taxaOculta = liquido > 0 ? ((bruto - liquido) / liquido) * 100 : Infinity

  const shareTotal = bruto || 1
  const shares = [
    { key: 'plataforma', label: tr('Plataforma (comissão)', 'Platform (commission)', 'Plataforma (comisión)'), v: comissao, color: '#ffc107' },
    { key: 'custos', label: tr('Custos do capital pagos por VOCÊ', 'Capital costs paid by YOU', 'Costos de capital pagados por TI'), v: custos, color: '#2196f3' },
    { key: 'trabalhador', label: tr('Que sobra para o trabalhador', 'What remains for the worker', 'Lo que queda para el trabajador'), v: liquido, color: '#f44336' },
  ]
  const transferredCosts = [
    tr('Combustível e recargas', 'Fuel and charging', 'Combustible y recargas'),
    tr('Veículo: manutenção e depreciação', 'Vehicle: maintenance and depreciation', 'Vehículo: mantenimiento y depreciación'),
    tr('Celular, internet e aplicativo', 'Phone, internet and app', 'Teléfono, internet y aplicación'),
    tr('Previdência, férias e 13º inexistentes', 'No employer pension, paid vacation or 13th salary', 'Sin previsión patronal, vacaciones pagadas ni aguinaldo'),
  ]

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">{mt(lang, 'platform').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'platform').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {textoPorModo(
            mode,
            tr('No app, você é "seu patrão". Mas quem paga o carro, a gasolina e o celular? Você. Quem fica com uma parte garantida de cada corrida? O aplicativo. Simule sua jornada:', 'In the app, you are "your own boss". But who pays for the car, fuel and phone? You do. Who keeps a guaranteed share of every ride? The platform. Simulate your workday:', 'En la app, eres "tu propio jefe". Pero ¿quién paga el auto, el combustible y el teléfono? Tú. ¿Quién se queda con una parte garantizada de cada viaje? La plataforma. Simula tu jornada:'),
            tr('Reintrodução do salário por peça via plataformas: externalização do capital constante sobre o trabalhador e apropriação de mais-valia sem relação formal de emprego.', 'Platforms reintroduce piece wages: constant-capital costs are externalized onto the worker while surplus value is appropriated without a formal employment relationship.', 'Las plataformas reintroducen el salario por pieza: externalizan los costos de capital constante sobre el trabajador y apropian plusvalía sin relación laboral formal.'),
            tr('Quem trabalha por aplicativo paga combustível, manutenção e celular, enquanto a plataforma recebe uma parte de cada corrida. Mude os valores e veja quanto sobra no fim do dia.', 'App workers pay for fuel, maintenance and phone service while the platform takes a share of every ride. Change the values and see what remains at the end of the day.', 'Quien trabaja por aplicación paga combustible, mantenimiento y teléfono, mientras la plataforma recibe una parte de cada viaje. Cambia los valores y mira cuánto queda al final del día.'),
          )}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Simulador */}
        <div className="flex flex-col gap-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{tr('Simulador da corrida', 'Ride simulator', 'Simulador del viaje')}</h3>
          <Slider label={tr('Corridas por dia', 'Rides per day', 'Viajes por día')} value={p.corridas} onChange={set('corridas')} min={4} max={24} step={1} unit={tr('/dia', '/day', '/día')} localeCode={loc}
            tip={tr("Salário por peça: cada corrida é uma 'peça'. Mais peças = mais trabalho, sem hora extra.", "Piece wage: each ride is a 'piece'. More pieces = more work, without overtime pay.", "Salario por pieza: cada viaje es una 'pieza'. Más piezas = más trabajo, sin horas extra.")} />
          <Slider label={tr('Valor médio da corrida', 'Average ride fare', 'Valor medio del viaje')} value={p.valorCorrida} onChange={set('valorCorrida')} min={10} max={35} step={1} unit="R$" localeCode={loc}
            tip={tr('A tarifa cai quando há muitos motoristas conectados — o algoritmo administra o exército industrial de reserva em tempo real.', 'Fares fall when many drivers are online — the algorithm manages the reserve army of labor in real time.', 'La tarifa cae cuando hay muchos conductores conectados — el algoritmo administra el ejército industrial de reserva en tiempo real.')} />
          <Slider label={tr('Comissão da plataforma', 'Platform commission', 'Comisión de la plataforma')} value={p.comissaoPct} onChange={set('comissaoPct')} min={15} max={40} step={1} unit="%" localeCode={loc}
            tip={tr('Corte fixo sobre cada corrida: a plataforma não investe, não arrisca frota — e ainda escolhe o preço.', 'A fixed cut of every ride: the platform does not fund or risk the fleet — and it still sets the price.', 'Un recorte fijo de cada viaje: la plataforma no financia ni arriesga la flota — y aun así fija el precio.')} />
          <Slider label={tr('Quilometragem diária', 'Daily mileage', 'Kilometraje diario')} value={p.kmDia} onChange={set('kmDia')} min={60} max={260} step={10} unit="km" localeCode={loc} accentClass="range-machine"
            tip={tr('Rodar para conseguir corrida também é tempo de trabalho não remunerado.', 'Driving while waiting for a ride is also unpaid working time.', 'Circular para conseguir un viaje también es tiempo de trabajo no remunerado.')} />
          <Slider label={tr('Custo por km', 'Cost per km', 'Costo por km')} value={p.custoKm} onChange={set('custoKm')} min={0.3} max={1.2} step={0.05} unit="R$/km" localeCode={loc} accentClass="range-machine"
            tip={tr('Gasolina, óleo, pneus, revisão: capital constante pago pelo trabalhador.', 'Fuel, oil, tires and maintenance: constant capital paid by the worker.', 'Gasolina, aceite, neumáticos y mantenimiento: capital constante pagado por el trabajador.')} />
          <Slider label={tr('Jornada conectado', 'Hours online', 'Horas conectado')} value={p.jornada} onChange={set('jornada')} min={8} max={14} step={1} unit="h" localeCode={loc} accentClass="range-labor" />
        </div>

        {/* Resultados */}
        <div className="flex flex-col gap-4">
          {/* Para onde vai cada R$ */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">{tr('Para onde vai o dinheiro das corridas', 'Where the ride money goes', 'A dónde va el dinero de los viajes')}</h3>
              <span className="font-mono text-[11px] text-zinc-500">{tr('bruto do dia', 'daily gross', 'bruto del día')}: R$ {bruto.toLocaleString(loc, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-3 flex h-7 w-full overflow-hidden rounded-lg border border-zinc-800">
              {shares.map((s) => (
                <m.div key={s.key} animate={{ width: `${(s.v / shareTotal) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  style={{ background: s.color }} title={`${s.label}: R$ ${s.v.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
              ))}
            </div>
            <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-3">
              {shares.map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="flex min-w-0 items-center gap-1.5 text-zinc-300">
                    <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="shrink-0 font-mono font-bold" style={{ color: s.color }}>
                    {((s.v / shareTotal) * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MetricBox label={tr('Líquido/dia', 'Net/day', 'Neto/día')} value={`R$ ${liquido.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} accent="text-red-300"
                tip={tr('O que realmente entra no bolso depois da comissão e dos custos.', 'What actually reaches the worker after commission and costs.', 'Lo que realmente llega al bolsillo después de la comisión y los costos.')} />
              <MetricBox label={tr('Por hora trabalhada', 'Per hour worked', 'Por hora trabajada')} value={`R$ ${porHora.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} accent="text-red-300"
                tip={tr('Incluindo tempo parado esperando corrida.', 'Including idle time waiting for a ride.', 'Incluye el tiempo parado esperando un viaje.')} />
              <MetricBox label={tr('Salário mínimo/hora (CLT)', 'Minimum wage/hour (formal employment)', 'Salario mínimo/hora (empleo formal)')} value={`R$ ${minimoHora.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} accent="text-zinc-300"
                tip={tr('Referência: R$ 1.518/mês ÷ 220 h.', 'Reference: R$1,518/month ÷ 220 h.', 'Referencia: R$ 1.518/mes ÷ 220 h.')} />
              <MetricBox
                label={textoPorModo(mode, tr('Exploração oculta', 'Hidden exploitation', 'Explotación oculta'), tr('Taxa oculta (bruto/líquido −1)', 'Hidden rate (gross/net −1)', 'Tasa oculta (bruto/neto −1)'), tr('Parte que não fica com o trabalhador', 'Share that does not remain with the worker', 'Parte que no queda con el trabajador'))}
                value={Number.isFinite(taxaOculta) ? `${taxaOculta.toFixed(0)}%` : '∞'}
                accent={taxaOculta >= 400 ? 'text-fuchsia-300' : 'text-money'}
                tip={textoPorModo(
                  mode,
                  tr('De tudo que seu trabalho movimenta, esta é a fatia que NÃO chega em você: comissão + custos que deveriam ser da empresa.', 'Of everything your work generates, this is the share that does NOT reach you: commission plus costs shifted from the company.', 'De todo lo que mueve tu trabajo, esta es la parte que NO te llega: comisión más costos trasladados por la empresa.'),
                  tr('(M′ − líquido)/líquido: apropriação total relativa à renda efetiva do trabalhador.', '(M′ − net)/net: total appropriation relative to the worker’s effective income.', '(M′ − neto)/neto: apropiación total relativa al ingreso efectivo del trabajador.'),
                  tr('Compara o dinheiro movimentado com o que realmente sobra depois da comissão e dos custos do trabalho.', 'Compares the money generated with what actually remains after commission and work costs.', 'Compara el dinero generado con lo que realmente queda tras la comisión y los costos del trabajo.'),
                )}
              />
            </div>
          </div>

          {/* Diagrama de transferência de custos */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">{tr('Transferência do capital constante', 'Transfer of constant-capital costs', 'Transferencia de costos de capital constante')}</h3>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2">
              <div className="rounded-lg border border-money/50 bg-money/5 p-3">
                <div className="text-xs font-bold text-money">{tr('Plataforma (app)', 'Platform (app)', 'Plataforma (app)')}</div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-zinc-400">
                  <li>· {tr('Algoritmo de precificação', 'Pricing algorithm', 'Algoritmo de precios')}</li>
                  <li>· {tr('Marca e base de clientes', 'Brand and customer base', 'Marca y base de clientes')}</li>
                  <li>· {tr('Comissão garantida', 'Guaranteed commission', 'Comisión garantizada')}: <span className="font-mono text-money">{p.comissaoPct}%</span></li>
                </ul>
              </div>
              <svg viewBox="0 0 120 120" className="hidden w-20 sm:block" aria-hidden>
                <path d="M 8 38 C 45 38 70 52 108 60" fill="none" stroke="#9c27b0" strokeWidth="2" markerEnd="url(#arrFict)" className="flow-line" />
                <path d="M 108 74 C 70 82 45 92 8 96" fill="none" stroke="#f44336" strokeWidth="2" markerEnd="url(#arrLabor)" className="flow-line flow-line--slow" />
                <defs>
                  <marker id="arrFict" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#9c27b0" />
                  </marker>
                  <marker id="arrLabor" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f44336" />
                  </marker>
                </defs>
              </svg>
              <div className="rounded-lg border border-labor/50 bg-labor/5 p-3">
                <div className="text-xs font-bold text-labor">{tr('Você (trabalhador)', 'You (worker)', 'Tú (trabajador)')}</div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-zinc-300">
                  {transferredCosts.map((t) => <li key={t}>· {t}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-zinc-500">
              <span className="text-fuchsia-300">━▶</span> {tr('custos empurrados para o bolso do trabalhador', 'costs shifted into the worker’s pocket', 'costos trasladados al bolsillo del trabajador')} ·{' '}
              <span className="text-red-300">━▶</span> {tr('comissão sobe para a plataforma', 'commission flows up to the platform', 'la comisión sube a la plataforma')}
            </p>
          </div>

          {/* Salário por peça */}
          <div className="rounded-xl border border-dashed border-money/40 bg-money/5 p-4">
            <h4 className="text-sm font-bold text-money">{tr('Isso já existiu antes: o salário por peça', 'This existed before: piece wages', 'Esto ya existía: el salario por pieza')}</h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              {tr(
                'Marx descreve no Livro I o salário por peça: pagar por "peça produzida" esconde a jornada, intensifica o trabalho e transfere ao operário os riscos da produção. O aplicativo é a mesma lógica com GPS: a peça agora se chama corrida, entrega ou pacote — e o "galpão" é a rua.',
                'In Capital, Volume I, Marx describes piece wages: paying per "piece produced" hides the workday, intensifies labor and shifts production risks to the worker. The app applies the same logic with GPS: the piece is now a ride, delivery or parcel — and the "factory floor" is the street.',
                'En El capital, Libro I, Marx describe el salario por pieza: pagar por "pieza producida" oculta la jornada, intensifica el trabajo y traslada al trabajador los riesgos de la producción. La aplicación aplica la misma lógica con GPS: la pieza ahora es un viaje, una entrega o un paquete — y el "taller" es la calle.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricBox({ label, value, accent, tip }: { label: string; value: string; accent: string; tip?: string }) {
  return (
    <div className="rounded-lg bg-zinc-950/60 p-2.5">
      <div className="text-[9.5px] uppercase tracking-wider text-zinc-500">{label}</div>
      <Tip text={tip ?? ''}>
        <div className={`font-mono text-base font-bold ${accent}`}>{value}</div>
      </Tip>
    </div>
  )
}
