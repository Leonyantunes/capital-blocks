/**
 * MODO SIMPLES — 3º nível de leitura (fundamental / início do ensino médio).
 *
 * O app tem três níveis: `simples`, `didatico` (padrão) e `avancado`.
 * Este módulo concentra a resolução editorial entre eles e as substituições
 * conservadoras usadas quando ainda não existe copy simples explícita.
 *
 * COMO FUNCIONA, E POR QUE ASSIM
 * ──────────────────────────────
 * Muitos datasets históricos ainda guardam textos em pares: `did` (didático)
 * e `adv` (avançado). As áreas mais importantes também têm `simples`
 * explícito; onde ele ainda não existe, o fallback passa por uma tradução
 * conservadora. Então a estratégia é:
 *
 *   1. `resolve()` respeita o nível escolhido. No modo simples, um texto
 *      explicitamente curado vence; quando ele não existe, o didático passa
 *      por `simplificarTexto()` sem alterar números.
 *   2. Um glossário curado troca vocabulário técnico por explicações do dia a
 *      dia em QUALQUER texto didático usado como fallback. Isso dá cobertura
 *      transversal aos módulos e tours sem duplicar centenas de strings.
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
  if (modo === 'simples') {
    const base = textos.simples ?? textos.did ?? textos.adv ?? ''
    return textos.simples ?? simplificarTexto(base)
  }
  if (modo === 'avancado') return textos.adv ?? textos.did ?? textos.simples ?? ''
  return textos.did ?? textos.simples ?? textos.adv ?? ''
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

/* Substituições em frases completas. Mantêm dígitos, moedas, percentuais,
   datas e unidades intactos: o modo simples muda linguagem, nunca dado. */
const FRASES_SIMPLES: [RegExp, string][] = [
  [/\bmais-valia\b/gi, 'valor criado pelo trabalho e não pago em salário'],
  [/\bexcedente\b/gi, 'valor que sobra depois dos custos'],
  [/\bacumula[cç][aã]o\b/gi, 'concentração de riqueza'],
  [/\bsuperexplora[cç][aã]o\b/gi, 'trabalho muito mal pago'],
  [/\btroca desigual\b/gi, 'troca em que um lado fica com mais valor'],
  [/\bhierarquia monet[aá]ria\b/gi, 'diferença de poder entre moedas'],
  [/\bcapital constante\b/gi, 'máquinas e materiais'],
  [/\bcapital vari[aá]vel\b/gi, 'salários'],
  [/\bcapital produtivo\b/gi, 'empresas que produzem bens e serviços'],
  [/\bcapital financeiro\b/gi, 'bancos, crédito e investimentos'],
  [/\bcapital fict[ií]cio\b/gi, 'ativos financeiros baseados em ganhos futuros'],
  [/\bcomposi[cç][aã]o org[aâ]nica\b/gi, 'relação entre máquinas e trabalho'],
  [/\bfinanceiriza[cç][aã]o\b/gi, 'importância das finanças'],
  [/\bprimariza[cç][aã]o\b/gi, 'dependência maior de produtos primários'],
  [/\breprimariza[cç][aã]o\b/gi, 'volta da dependência de produtos primários'],
  [/\bdesindustrializa[cç][aã]o\b/gi, 'perda de peso da indústria'],
  [/\brentismo\b/gi, 'ganho com juros, aluguéis e ativos'],
  [/\bchokepoint\b/gi, 'ponto de passagem estratégico'],
  [/\bclearing\b/gi, 'sistema de compensação de pagamentos'],
  [/\bdefault\b/gi, 'calote ou suspensão de pagamento'],
  [/\bfoundry\b/gi, 'fábrica especializada em chips'],
  [/\bexport controls\b/gi, 'restrições de exportação'],
  [/\bnearshoring\b/gi, 'produção transferida para um país vizinho'],
  [/\boffshore\b/gi, 'dinheiro ou empresa registrado fora do país'],
  [/\bexternaliza[cç][aã]o\b/gi, 'custo empurrado para outras pessoas ou lugares'],
  [/\bproletariado\b/gi, 'trabalhadores assalariados'],
  [/\bburguesia\b/gi, 'donos de grandes empresas e patrimônios'],
]

/**
 * Simplifica frases didáticas para fundamental/início do ensino médio.
 * É deliberadamente conservador: só troca expressões conhecidas e preserva
 * números, símbolos e unidades exatamente como vieram do dataset.
 */
export function simplificarTexto(texto: string): string {
  let out = texto
  for (const [padrao, troca] of FRASES_SIMPLES) out = out.replace(padrao, troca)
  return out
}

/** Atalho explícito para componentes que têm pares did/adv. */
export function textoPorModo(modo: UIMode, did?: string, adv?: string, simples?: string): string {
  return resolve({ simples, did, adv }, modo)
}

/**
 * Traduz um termo curto para o modo simples, se houver tradução curada.
 * Devolve o termo original quando não há — é preferível o termo técnico
 * com explicação a uma invenção.
 */
export function termoSimples(termo: string): string {
  return SIMPLES[termo.toLowerCase().trim()] ?? termo
}
