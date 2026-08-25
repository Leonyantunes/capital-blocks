import { useState } from 'react'
import { m } from 'framer-motion'
import Tip from './ui/Tip'
import ModeBadge from './ui/ModeBadge'
import { mt } from '../i18n'
import { useApp } from '../store/useApp'

interface Params {
  corridas: number
  valorCorrida: number
  kmDia: number
  custoKm: number
  comissaoPct: number
  jornada: number
}

const DEFAULTS: Params = { corridas: 12, valorCorrida: 20, kmDia: 140, custoKm: 0.6, comissaoPct: 25, jornada: 10 }

function Slider({ label, tip, value, min, max, step, unit, onChange, accentClass = '' }: {
  label: string; tip?: string; value: number; min: number; max: number; step: number; unit: string
  onChange: (n: number) => void; accentClass?: string
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
          {value.toLocaleString('pt-BR')} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} className={accentClass} />
    </div>
  )
}

const TRANSFERRED_COSTS = [
  'Combustível e recargas',
  'Veículo: manutenção e depreciação',
  'Celular, internet e aplicativo',
  'Previdência, férias e 13º inexistentes',
]

export default function PlatformModule() {
  const [p, setP] = useState<Params>(DEFAULTS)
  const set = function <K extends keyof Params>(key: K) {
    return (v: number) => setP((s) => ({ ...s, [key]: v }))
  }
  const lang = useApp((s) => s.lang)
  const didatico = useApp((s) => s.mode) === 'didatico'

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
    { key: 'plataforma', label: 'Plataforma (comissão)', v: comissao, color: '#ffc107' },
    { key: 'custos', label: 'Custos do capital pagos por VOCÊ', v: custos, color: '#2196f3' },
    { key: 'trabalhador', label: 'Que sobra para o trabalhador', v: liquido, color: '#f44336' },
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
          {didatico
            ? 'No app, você é "seu patrão". Mas quem paga o carro, a gasolina e o celular? Você. Quem fica com uma parte garantida de cada corrida? O aplicativo. Simule sua jornada:'
            : 'Reintrodução do salário por peça via plataformas: externalização do capital constante sobre o trabalhador e apropriação de mais-valia sem relação formal de emprego.'}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Simulador */}
        <div className="flex flex-col gap-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Simulador da corrida</h3>
          <Slider label="Corridas por dia" value={p.corridas} onChange={set('corridas')} min={4} max={24} step={1} unit="/dia"
            tip="Salário por peça: cada corrida é uma 'peça'. Mais peças = mais trabalho, sem hora extra." />
          <Slider label="Valor médio da corrida" value={p.valorCorrida} onChange={set('valorCorrida')} min={10} max={35} step={1} unit="R$"
            tip="A tarifa cai quando há muitos motoristas conectados — o algoritmo administra o exército industrial de reserva em tempo real." />
          <Slider label="Comissão da plataforma" value={p.comissaoPct} onChange={set('comissaoPct')} min={15} max={40} step={1} unit="%"
            tip="Corte fixo sobre cada corrida: a plataforma não investe, não arrisca frota — e ainda escolhe o preço." />
          <Slider label="Quilometragem diária" value={p.kmDia} onChange={set('kmDia')} min={60} max={260} step={10} unit="km" accentClass="range-machine"
            tip="Rodar para conseguir corrida também é tempo de trabalho não remunerado." />
          <Slider label="Custo por km" value={p.custoKm} onChange={set('custoKm')} min={0.3} max={1.2} step={0.05} unit="R$/km" accentClass="range-machine"
            tip="Gasolina, óleo, pneus, revisão: capital constante pago pelo trabalhador." />
          <Slider label="Jornada conectado" value={p.jornada} onChange={set('jornada')} min={8} max={14} step={1} unit="h" accentClass="range-labor" />
        </div>

        {/* Resultados */}
        <div className="flex flex-col gap-4">
          {/* Para onde vai cada R$ */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">Para onde vai o dinheiro das corridas</h3>
              <span className="font-mono text-[11px] text-zinc-500">bruto do dia: R$ {bruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-3 flex h-7 w-full overflow-hidden rounded-lg border border-zinc-800">
              {shares.map((s) => (
                <m.div key={s.key} animate={{ width: `${(s.v / shareTotal) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  style={{ background: s.color }} title={`${s.label}: R$ ${s.v.toFixed(2)}`} />
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
              <MetricBox label="Líquido/dia" value={`R$ ${liquido.toFixed(2)}`} accent="text-red-300"
                tip="O que realmente entra no bolso depois da comissão e dos custos." />
              <MetricBox label="Por hora trabalhada" value={`R$ ${porHora.toFixed(2)}`} accent="text-red-300"
                tip="Incluindo tempo parado esperando corrida." />
              <MetricBox label="Salário mínimo/hora (CLT)" value={`R$ ${minimoHora.toFixed(2)}`} accent="text-zinc-300"
                tip="Referência: R$ 1.518/mês ÷ 220 h." />
              <MetricBox
                label={didatico ? 'Exploração oculta' : 'Taxa oculta (bruto/líquido −1)'}
                value={Number.isFinite(taxaOculta) ? `${taxaOculta.toFixed(0)}%` : '∞'}
                accent={taxaOculta >= 400 ? 'text-fuchsia-300' : 'text-money'}
                tip={didatico
                  ? 'De tudo que seu trabalho movimenta, esta é a fatia que NÃO chega em você: comissão + custos que deveriam ser da empresa.'
                  : '(M′ − líquido)/líquido: apropriação total relativa à renda efetiva do trabalhador.'}
              />
            </div>
          </div>

          {/* Diagrama de transferência de custos */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">Transferência do capital constante</h3>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2">
              <div className="rounded-lg border border-money/50 bg-money/5 p-3">
                <div className="text-xs font-bold text-money">Plataforma (app)</div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-zinc-400">
                  <li>· Algoritmo de precificação</li>
                  <li>· Marca e base de clientes</li>
                  <li>· Comissão garantida: <span className="font-mono text-money">{p.comissaoPct}%</span></li>
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
                <div className="text-xs font-bold text-labor">Você (trabalhador)</div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-zinc-300">
                  {TRANSFERRED_COSTS.map((t) => <li key={t}>· {t}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-zinc-500">
              <span className="text-fuchsia-300">━▶</span> custos empurrados para o bolso do trabalhador ·{' '}
              <span className="text-red-300">━▶</span> comissão sobe para a plataforma
            </p>
          </div>

          {/* Salário por peça */}
          <div className="rounded-xl border border-dashed border-money/40 bg-money/5 p-4">
            <h4 className="text-sm font-bold text-money">Isso já existiu antes: o salário por peça</h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              Marx descreve no Livro I o <em>salário por peça</em>: pagar por "peça produzida" esconde a jornada,
              intensifica o trabalho e transfere ao operário os riscos da produção. O aplicativo é a mesma lógica com
              GPS: a peça agora se chama corrida, entrega ou pacote — e o "galpão" é a rua.
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
