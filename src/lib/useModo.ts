/**
 * Rótulos e textos sensíveis ao NÍVEL DE LEITURA.
 *
 * `FRACTION_META` e os labels do mapa vivem nos dados e são únicos (não podem
 * variar por modo, senão o dataset fica inconsistente). Este hook devolve uma
 * camada de apresentação que troca só o que a pessoa LÊ, mantendo número,
 * cor e chave intactos.
 */
import { useMemo } from 'react'
import { useApp } from '../store/useApp'
import { FRACTION_META, type FractionKey } from '../data/countries'
import { termoSimples, resolve, isSimples } from './simples'

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

/** Rótulo de uma fração isolada, no modo atual. */
export function useFractionLabel(): (k: FractionKey) => string {
  const mode = useApp((s) => s.mode)
  return (k) => {
    const base = FRACTION_META[k]
    return isSimples(mode) ? termoSimples(base.label) : base.label
  }
}

/**
 * Escolhe o texto de um par didático/avançado conforme o modo.
 * Em modo simples cai no didático (o mais próximo do cotidiano), mas usa
 * `simples` quando o dado já tiver esse campo.
 */
export function useText(): (textos: { simples?: string; did?: string; adv?: string }) => string {
  const mode = useApp((s) => s.mode)
  return (textos) => resolve(textos, mode)
}

/** `true` quando o modo atual esconde fórmula/termo técnico. */
export function useOcultaFormula(): boolean {
  const mode = useApp((s) => s.mode)
  return isSimples(mode)
}
