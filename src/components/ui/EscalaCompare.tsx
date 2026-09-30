import { useState } from 'react'

/**
 * TRADUTOR DE ESCALAS — converte um valor em US$ bi para unidades humanas
 * comparáveis (salários, escolas, hospitais, fome). Constantes estimadas
 * (DATA-GUIDELINES): câmbio R$5,5 · escola pública ≈ R$15 mi · hospital ≈ R$150 mi.
 */

import { SM_BR_ANO } from '../../data/alternatives'

const CAMBIO = 5.5
const SM_US_ANO = 15080 // federal $7,25/h × 2.080h
const ESCOLA_BRL = 15e6
const HOSPITAL_BRL = 150e6
const FOME_ANO_USBI = 45 // custo anual para erradicar fome extrema (ONU/FAO, est.)

type Unidade = 'smbr' | 'smus' | 'escola' | 'hospital' | 'fome'

const UNITS: { id: Unidade; label: string }[] = [
  { id: 'smbr', label: 'Anos de salário mínimo (BR)' },
  { id: 'smus', label: 'Anos de salário mínimo (EUA)' },
  { id: 'escola', label: 'Escolas públicas construídas' },
  { id: 'hospital', label: 'Hospitais construídos' },
  { id: 'fome', label: '% da fome extrema erradicada' },
]

export default function EscalaCompare({ usdBi, titulo }: { usdBi: number; titulo?: string }) {
  const [unit, setUnit] = useState<Unidade>('smbr')

  const reais = usdBi * 1e9 * CAMBIO
  const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: n < 100 ? 1 : 0 })

  let resultado = ''
  switch (unit) {
    case 'smbr': resultado = `${fmt(reais / SM_BR_ANO)} anos de salário mínimo brasileiro`; break
    case 'smus': resultado = `${fmt((usdBi * 1e9) / SM_US_ANO)} anos de salário mínimo americano`; break
    case 'escola': resultado = `${fmt(reais / ESCOLA_BRL)} escolas públicas construídas`; break
    case 'hospital': resultado = `${fmt(reais / HOSPITAL_BRL)} hospitais construídos`; break
    case 'fome': resultado = `${fmt((usdBi / FOME_ANO_USBI) * 100)}% da fome extrema do mundo erradicada por 1 ano`; break
  }

  return (
    <div className="rounded-xl border border-dashed border-money/40 bg-money/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-money">{titulo ?? 'Tradutor de escalas'}</h3>
        <span className="font-mono text-[9.5px] text-zinc-600">unidades humanas · constantes estimadas</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {UNITS.map((u) => (
          <button key={u.id} onClick={() => setUnit(u.id)}
            className={`rounded-lg border px-2.5 py-1 text-[10.5px] font-medium transition-colors ${
              unit === u.id ? 'border-money/70 bg-money/15 text-money' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}>
            {u.label}
          </button>
        ))}
      </div>
      <p className="mt-2.5 rounded-lg bg-zinc-950/70 p-3 font-mono text-sm font-bold text-zinc-100">
        US$ {usdBi.toLocaleString('pt-BR')} bi = <span className="text-money">{resultado}</span>
      </p>
    </div>
  )
}
