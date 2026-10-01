/**
 * MODO SIMPLES — 3º nível de leitura (fundamental / início do ensino médio).
 *
 * O app já tem dois níveis: `didatico` (padrão) e `avancado` (marxista-
 * contábil). Este módulo adiciona o mais simples, para quem ainda não tem o
 * vocabulário econômico nem a fórmula.
 *
 * COMO FUNCIONA, E POR QUE ASSIM
 * ──────────────────────────────
 * Os módulos do app guardam textos em pares: `did` (didático) e `adv`
 * (avançado). Não existe um terceiro par nos dados, e escrever um `simples`
 * para ~1.500 textos seria uma campanha editorial gigante que envelheceria
 * mal. Então a estratégia é:
 *
 *   1. `resolve()` escolhe o melhor texto disponível (simples → didático →
 *      avançado como fallback), para que a função seja total e nunca
 *      devolva `undefined`.
 *   2. Um conjunto pequeno e curado de traduções de verdade, "do jeito que se
 *      fala" para os textos mais carregados (nome das frações, do mapa, dos
 *     cartões de indicador), onde a simplificação faz mais diferença.
 *   3. `NIVEIS` alimenta o badge e o alerta de contexto, para que o app
 *      explique em que modo a pessoa está.
 *
 * A regra de ouro do projeto continua valendo: simplificar a LINGUAGEM nunca
 * pode simplificar o NÚMERO. Se não há um termo simples, mostra-se o termo
 * técnico com uma explicação curta — nunca se inventa ou arredonda um valor.
 */

import type { UIMode } from '../store/useApp'

/** Ordem de escolha do texto: do mais simples ao mais técnico. */
export const NIVEIS: { id: UIMode; rotulo: string; descricao: string; cor: string }[] = [
  {
    id: 'simples',
    rotulo: 'Simples',
    descricao: 'Para quem está começando: palavras do dia a dia, sem fórmula.',
    cor: 'amber-300',
  },
  {
    id: 'didatico',
    rotulo: 'Didático',
    descricao: 'Explicações com alguma conta e metáfora. Padrão do app.',
    cor: 'emerald-300',
  },
  {
    id: 'avancado',
    rotulo: 'Avançado',
    descricao: 'Categorias marxistas, fórmulas e referências.',
    cor: 'sky-300',
  },
]

export const isSimples = (m: UIMode): boolean => m === 'simples'

/** Título curto do modo, para badges e tooltips. */
export function rotuloDoModo(m: UIMode): string {
  return NIVEIS.find((n) => n.id === m)?.rotulo ?? 'Didático'
}

/** Frase curta que explica o modo atual (uma linha, para tooltips). */
export function descricaoDoModo(m: UIMode): string {
  return NIVEIS.find((n) => n.id === m)?.descricao ?? ''
}

/**
 * Escolhe o melhor texto disponível a partir de um objeto com um ou mais
 * níveis. Aceita `{ simples?, did?, adv? }` (a forma usada nos datasets) ou
 * uma lista de candidatos. Devolve string vazia em vez de `undefined`, para
 * que a UI nunca renderize "undefined".
 */
export function resolve<T extends Record<string, string | undefined>>(
  textos: T,
  modo: UIMode,
): string {
  if (textos.simples) return textos.simples
  /* avançado pede o avançado (cai no didático só se não houver); os outros
     dois modos caem no didático (o mais próximo do cotidiano) */
  if (modo === 'avancado') return textos.adv ?? textos.did ?? ''
  return textos.did ?? textos.adv ?? ''
}

/** Igual a `resolve`, mas devolve o didático como piso (para tooltips longos). */
export function resolveDidatico(textos: { did?: string; adv?: string }): string {
  return textos.did ?? textos.adv ?? ''
}

/* ── TRADUÇÕES CURADAS ────────────────────────────────────────────────────
 * Só entram aqui termos que aparecem literalmente na tela e que, em modo
 * simples, mudam de verdade a leitura. A lista é curta de propósito: cada
 * entrada é uma decisão editorial, não uma tradução mecânica. */

const SIMPLES: Record<string, string> = {
  /* frações de capital (rosca dos países) */
  produtivo: 'Fábricas e máquinas',
  financeiro: 'Bancos e juros',
  comercial: 'Lojas e comércio exterior',
  ficticio: 'Promessas de ganho',
  estatal: 'Governo',

  /* conceitos do circuito */
  'capital constante': 'Máquinas e matéria-prima',
  'capital variável': 'Salários dos trabalhadores',
  'mais-valia': 'Trabalho de graça',
  'extração de mais-valia': 'trabalho de graça',
  'capital-dinheiro': 'dinheiro investido',
  'valor expandido': 'valor que cresceu',
  'realização': 'venda',
  'taxa de exploração': 'Quanto se ganha sem trabalhar',
  'tendência decrescente': 'Os lucros vão caindo com o tempo',
  'modo de produção': 'A forma como a sociedade trabalha',

  /* geopolítica */
  'acumulação': 'Quando os donos ficam com cada vez mais',
  'super-exploração': 'Trabalhar de mais e ganhar de menos',
  'troca desigual': 'A troca que favorece sempre o mesmo lado',
  'fração de capital': 'O grupo que manda por um setor',
  'hegemonia': 'O país que dita as regras para os outros',

  /* dinheiro e dívida */
  'dívida soberana': 'Dívida que o país pode pagar na própria moeda',
  'dinheiro endógeno': 'O dinheiro nasce do gasto e do crédito',
  'paradoxo da parcimônia': 'Todo mundo poupar junto derruba a economia',
  'demanda efetiva': 'Alguém precisa comprar para a economia girar',

  /* trabalho */
  'trabalho não pago': 'Horas que você trabalha e não recebe',
  'plataformização': 'Trabalhar por aplicativo, sem chefe e sem proteção',
  'superexploração': 'Trabalhar de mais e ganhar de menos',
}

/**
 * Traduz um termo curto para o modo simples, se houver tradução curada.
 * Devolve o termo original quando não há — é preferível o termo técnico
 * com explicação a uma invenção.
 */
export function termoSimples(termo: string): string {
  return SIMPLES[termo.toLowerCase().trim()] ?? termo
}
