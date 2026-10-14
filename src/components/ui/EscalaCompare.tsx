import { useState } from 'react'
import { locale, pick } from '../../i18n'
import { useApp } from '../../store/useApp'

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

const UNITS: Unidade[] = ['smbr', 'smus', 'escola', 'hospital', 'fome']

export default function EscalaCompare({ usdBi, titulo }: { usdBi: number; titulo?: string }) {
  const [unit, setUnit] = useState<Unidade>('smbr')
  const lang = useApp((s) => s.lang)

  const reais = usdBi * 1e9 * CAMBIO
  const fmt = (n: number) => n.toLocaleString(locale(lang), { maximumFractionDigits: n < 100 ? 1 : 0 })
  const label = (u: Unidade) => ({
    smbr: pick(lang, 'Anos de salário mínimo (BR)', 'Years of minimum wage (Brazil)', 'Años de salario mínimo (Brasil)'),
    smus: pick(lang, 'Anos de salário mínimo (EUA)', 'Years of minimum wage (US)', 'Años de salario mínimo (EE. UU.)'),
    escola: pick(lang, 'Escolas públicas construídas', 'Public schools built', 'Escuelas públicas construidas'),
    hospital: pick(lang, 'Hospitais construídos', 'Hospitals built', 'Hospitales construidos'),
    fome: pick(lang, '% da fome extrema erradicada', '% of extreme hunger eradicated', '% del hambre extrema erradicada'),
  }[u])

  let resultado = ''
  switch (unit) {
    case 'smbr': resultado = `${fmt(reais / SM_BR_ANO)} ${pick(lang, 'anos de salário mínimo brasileiro', 'years of Brazilian minimum wage', 'años de salario mínimo brasileño')}`; break
    case 'smus': resultado = `${fmt((usdBi * 1e9) / SM_US_ANO)} ${pick(lang, 'anos de salário mínimo americano', 'years of US minimum wage', 'años de salario mínimo estadounidense')}`; break
    case 'escola': resultado = `${fmt(reais / ESCOLA_BRL)} ${pick(lang, 'escolas públicas construídas', 'public schools built', 'escuelas públicas construidas')}`; break
    case 'hospital': resultado = `${fmt(reais / HOSPITAL_BRL)} ${pick(lang, 'hospitais construídos', 'hospitals built', 'hospitales construidos')}`; break
    case 'fome': resultado = `${fmt((usdBi / FOME_ANO_USBI) * 100)}% ${pick(lang, 'da fome extrema do mundo erradicada por 1 ano', 'of global extreme hunger eradicated for one year', 'del hambre extrema mundial erradicada durante un año')}`; break
  }

  return (
    <div className="rounded-xl border border-dashed border-money/40 bg-money/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-money">{titulo ?? pick(lang, 'Tradutor de escalas', 'Scale translator', 'Traductor de escalas')}</h3>
        <span className="font-mono text-[9.5px] text-zinc-600">{pick(lang, 'unidades humanas · constantes estimadas', 'human units · estimated constants', 'unidades humanas · constantes estimadas')}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {UNITS.map((u) => (
          <button key={u} onClick={() => setUnit(u)}
            className={`rounded-lg border px-2.5 py-1 text-[10.5px] font-medium transition-colors ${
              unit === u ? 'border-money/70 bg-money/15 text-money' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}>
            {label(u)}
          </button>
        ))}
      </div>
      <p className="mt-2.5 rounded-lg bg-zinc-950/70 p-3 font-mono text-sm font-bold text-zinc-100">
        US$ {usdBi.toLocaleString(locale(lang))} {pick(lang, 'bi', 'bn', 'mil M')} = <span className="text-money">{resultado}</span>
      </p>
    </div>
  )
}
