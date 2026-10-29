import type { Lang } from '../i18n'

const SIMPLE: Record<string, readonly [pt: string, en: string, es: string]> = {
  'mais-valia': [
    'É a parte do valor criada pelo trabalho que não volta ao trabalhador como salário.',
    'It is the part of value created by work that does not return to the worker as wages.',
    'Es la parte del valor creada por el trabajo que no vuelve al trabajador como salario.',
  ],
  'capital-constante': [
    'São máquinas, prédios, energia e matérias-primas usados para produzir.',
    'These are machines, buildings, energy, and raw materials used in production.',
    'Son máquinas, edificios, energía y materias primas usadas para producir.',
  ],
  'capital-variavel': [
    'É o dinheiro gasto com salários para contratar trabalho.',
    'It is the money spent on wages to hire labor.',
    'Es el dinero gastado en salarios para contratar trabajo.',
  ],
  'composicao-organica': [
    'Compara quanto a produção usa em máquinas e materiais com quanto gasta em salários.',
    'It compares how much production uses in machines and materials with how much it spends on wages.',
    'Compara cuánto usa la producción en máquinas y materiales con cuánto gasta en salarios.',
  ],
  'taxa-lucro': [
    'Compara o lucro obtido com todo o dinheiro investido para produzir.',
    'It compares profit with all the money invested in production.',
    'Compara la ganancia obtenida con todo el dinero invertido para producir.',
  ],
  'capital-ficticio': [
    'São papéis e contratos cujo preço depende de ganhos esperados no futuro, como ações e títulos.',
    'These are papers and contracts whose price depends on expected future income, such as shares and bonds.',
    'Son papeles y contratos cuyo precio depende de ingresos esperados en el futuro, como acciones y títulos.',
  ],
  'portador-juros': [
    'É dinheiro emprestado ou aplicado para receber mais dinheiro depois por meio de juros.',
    'It is money lent or invested to receive more money later through interest.',
    'Es dinero prestado o invertido para recibir más dinero después mediante intereses.',
  ],
  'sobreacumulacao': [
    'Acontece quando há muito dinheiro procurando investimento lucrativo e poucas oportunidades consideradas rentáveis.',
    'It happens when a lot of money seeks profitable investment and too few opportunities are considered attractive.',
    'Ocurre cuando mucho dinero busca inversiones rentables y hay pocas oportunidades consideradas atractivas.',
  ],
  'demanda-efetiva': [
    'É o gasto que realmente acontece. Se famílias, empresas e governo gastam menos ao mesmo tempo, as vendas podem cair.',
    'It is spending that actually happens. If households, firms, and government all spend less at the same time, sales can fall.',
    'Es el gasto que realmente ocurre. Si hogares, empresas y gobierno gastan menos al mismo tiempo, las ventas pueden caer.',
  ],
  'soberania-monetaria': [
    'É a capacidade de um Estado emitir a moeda usada para pagar suas próprias obrigações. Isso muda os limites financeiros que enfrenta.',
    'It is a state’s ability to issue the currency used to pay its own obligations. This changes the financial constraints it faces.',
    'Es la capacidad de un Estado de emitir la moneda usada para pagar sus propias obligaciones. Esto cambia las restricciones financieras que enfrenta.',
  ],
  'identidade-setorial': [
    'Mostra que o saldo financeiro de governo, setor privado e exterior está ligado: o déficit de um setor aparece como superávit de outro.',
    'It shows that the financial balances of government, private sector, and foreign sector are linked: one sector’s deficit appears as another’s surplus.',
    'Muestra que los saldos financieros del gobierno, sector privado y exterior están conectados: el déficit de un sector aparece como superávit de otro.',
  ],
  'troca-desigual': [
    'Descreve uma troca em que países podem vender produtos com muito trabalho e recursos por preços baixos e comprar bens tecnológicos mais caros.',
    'It describes exchange in which countries may sell labor- and resource-intensive goods cheaply and buy more expensive technology-intensive goods.',
    'Describe un intercambio en el que países pueden vender bienes con mucho trabajo y recursos a precios bajos y comprar bienes tecnológicos más caros.',
  ],
  'superexploracao': [
    'É quando o trabalho é pago muito pouco em relação ao custo de viver e pode vir junto de jornadas longas ou trabalho mais intenso.',
    'It is when work is paid too little relative to the cost of living and may come with very long hours or more intense work.',
    'Es cuando el trabajo se paga demasiado poco respecto al costo de vivir y puede venir con jornadas largas o trabajo más intenso.',
  ],
  'exercito-reserva': [
    'É a população desempregada, subempregada ou em trabalho muito precário que procura emprego e pode reduzir o poder de negociação de quem já trabalha.',
    'It is the unemployed, underemployed, or highly precarious population seeking work, which can reduce the bargaining power of people already employed.',
    'Es la población desempleada, subempleada o en trabajo muy precario que busca empleo y puede reducir el poder de negociación de quienes ya trabajan.',
  ],
  'imperialismo': [
    'É a disputa de grandes empresas e Estados por mercados, recursos, investimentos e rotas, usando poder econômico, político e às vezes militar.',
    'It is competition by large firms and states over markets, resources, investment, and routes using economic, political, and sometimes military power.',
    'Es la disputa de grandes empresas y Estados por mercados, recursos, inversiones y rutas usando poder económico, político y a veces militar.',
  ],
  buyback: [
    'É quando uma empresa usa dinheiro para recomprar suas próprias ações, reduzindo a quantidade delas no mercado.',
    'It is when a company uses cash to buy back its own shares, reducing the number of shares in the market.',
    'Es cuando una empresa usa dinero para recomprar sus propias acciones, reduciendo la cantidad de acciones en el mercado.',
  ],
}

export function glossarySimpleForLang(id: string, lang: Lang): string {
  const tri = SIMPLE[id]
  if (!tri) throw new Error(`Termo do glossário sem texto simples explícito: ${id}`)
  return tri[lang === 'pt' ? 0 : lang === 'en' ? 1 : 2]
}
