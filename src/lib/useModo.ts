/**
 * Rótulos e textos sensíveis ao NÍVEL DE LEITURA.
 *
 * `FRACTION_META` e os labels do mapa vivem nos dados e são únicos (não podem
 * variar por modo, senão o dataset fica inconsistente). Este hook devolve uma
 * camada de apresentação que troca só o que a pessoa LÊ, mantendo número,
 * cor e chave intactos.
 *
 * O modo `simples` é um terceiro nível editorial. Componentes de texto usam
 * `textoPorModo()` para preferir copy simples explícita e, quando ela não
 * existe, aplicar uma simplificação conservadora ao texto didático. Números,
 * datas, percentuais, moedas, cores e chaves de dados permanecem intactos.
 */
import { useMemo } from 'react'
import { useApp } from '../store/useApp'
import { FRACTION_META, type FractionKey } from '../data/countries'
import { termoSimples, isSimples } from './simples'

export interface FractionView {
  key: FractionKey
  /** rótulo no modo atual */
  label: string
  color: string
  /** descrição no modo atual */
  desc: string
}

/** Rótulo da fração no modo atual + explicação curta. */
export function useFractions(): FractionView[] {
  const mode = useApp((s) => s.mode)
  return useMemo(() => {
    const simples = isSimples(mode)
    return (Object.keys(FRACTION_META) as FractionKey[]).map((key) => {
      const base = FRACTION_META[key]
      return {
        key,
        color: base.color,
        label: simples ? termoSimples(base.label) : base.label,
        /* no modo simples, a descrição vira uma frase do dia a dia */
        desc: simples ? termoSimples(base.desc) : base.desc,
      }
    })
  }, [mode])
}
