/** GLOSSÁRIO — termos-chave com definição dual-mode (THEORY.md compliant). */

export interface GlossaryTerm {
  id: string
  termo: string
  /** nome formal que aparece nos livros */
  formal: string
  didatico: string
  avancado: string
  categoria: 'valor' | 'moeda' | 'dependencia' | 'crise'
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'mais-valia', termo: 'Mais-valia', formal: 'm (Mehrwert)',
    categoria: 'valor',
    didatico: 'É o trabalho que você faz DE GRAÇA para a empresa. Se em 8 horas você “paga” seu salário em 3, as outras 5 horas são pura mais-valia: riqueza que você criou e outra pessoa embolsou.',
    avancado: 'Valor excedente criado pelo trabalho vivo além do necessário à reprodução da força de trabalho: m = W − (c+v). Fonte única do lucro, do juro e da renda fundiária.',
  },
  {
    id: 'capital-constante', termo: 'Capital constante', formal: 'c',
    categoria: 'valor',
    didatico: 'Máquinas, prédios, matérias-primas. Transferem valor para o produto aos pedaços, mas não criam valor NOVO — um robô não trabalha “extra” de graça.',
    avancado: 'Porção do capital materializada em meios de produção cujo valor é transferido (via depreciação/consumo intermediário) ao produto sem geração de valor novo.',
  },
  {
    id: 'capital-variavel', termo: 'Capital variável', formal: 'v',
    categoria: 'valor',
    didatico: 'A folha de salários. É a única “parte” do dinheiro do patrão que compra algo capaz de criar valor novo: força de trabalho.',
    avancado: 'Desembolso que compra força de trabalho — único elemento cujo uso gera valor superior ao próprio valor de reprodução.',
  },
  {
    id: 'composicao-organica', termo: 'Composição orgânica', formal: 'k = c/v',
    categoria: 'valor',
    didatico: 'Quantas máquinas por trabalhador. Quando sobe (automação), a fatia “viva” da produção encolhe — e é dela que o lucro nasce.',
    avancado: 'Razão entre capital constante e variável; sua elevação sob taxa de exploração constante comprime a taxa de lucro (Lei da Tendência Decrescente).',
  },
  {
    id: 'taxa-lucro', termo: 'Taxa de lucro', formal: 'g = m/(c+v)',
    categoria: 'valor',
    didatico: 'Quanto os donos ganham sobre TUDO que investiram. O número que organiza as decisões do capitalismo.',
    avancado: 'Relação entre mais-valia e capital total adiantado; sua tendência decrescente estrutural motoriza crises, guerra por mercados e financeirização.',
  },
  {
    id: 'capital-ficticio', termo: 'Capital fictício', formal: 'fictitious capital',
    categoria: 'moeda',
    didatico: 'Papéis que “valem” dinheiro por prometerem pedaços de lucros futuros: ações, títulos, derivativos. Não são riqueza produzida — são promessas sobre riqueza que ainda será feita.',
    avancado: 'Capitalização de rendas esperadas (título = fluxo descontado): forma pura de titularidade sobre mais-valia futura, autônoma da base real — e combustível das crises de colapso de promessas.',
  },
  {
    id: 'portador-juros', termo: 'Capital portador de juros', formal: 'M—M′',
    categoria: 'moeda',
    didatico: 'Dinheiro que “engorda” sozinho: empresta, aplica, cobra. É o ganho mais fácil do capitalismo — e é pago com o trabalho de alguém em algum lugar.',
    avancado: 'Forma mais fetichizada do capital (M—M′): apropria de parte da mais-valia social via juro, sem mediação produtiva visível.',
  },
  {
    id: 'sobreacumulacao', termo: 'Sobreacumulação', formal: 'overaccumulation',
    categoria: 'crise',
    didatico: 'Quando o capitalismo produziu mais do que consegue vender com lucro. Fábricas paradas, dinheiro sem onde investir — aí nascem bolhas, guerras e crises.',
    avancado: 'Massa de capitais que não encontra campo rentável de realização; resolve-se por destruição de valor (crise), guerra ou expansão espacial/financeira.',
  },
  {
    id: 'demanda-efetiva', termo: 'Demanda efetiva', formal: 'effective demand',
    categoria: 'moeda',
    didatico: 'O quanto a gente, de fato, COMPRA. Se todos cortam gastos ao mesmo tempo, as vendas caem, os lucros caem, os empregos caem — e a economia encolhe. Poupar “todo mundo junto” empobrece.',
    avancado: 'Princípio keynesiano-kaleckiano: o investimento cria a poupança que o financia; a realização do valor depende do gasto agregado, não da frugalidade.',
  },
  {
    id: 'soberania-monetaria', termo: 'Soberania monetária', formal: 'monetary sovereignty (MMT)',
    categoria: 'moeda',
    didatico: 'Poder de quem EMITE a moeda que todos usam. Quem emite não “fica sem dinheiro” — o limite real é a inflação e a capacidade de produzir. Quem não emite (país endividado em dólar, família) aí sim pode “ficar sem”.',
    avancado: 'Emissor de moeda fiduciária não-conversível com câmbio flutuante enfrenta restrição real (inflação/capacidade), não financeira. Hierarquia monetária global subordina emissores periféricos à divisa do centro.',
  },
  {
    id: 'identidade-setorial', termo: 'Identidade setorial', formal: '(S−I) ≡ (G−T)+(X−M)',
    categoria: 'moeda',
    didatico: 'O déficit de um é o superávit de outro — sempre. Se o governo “gasta demais”, é porque famílias e empresas estão guardando. Não existe déficit público sem crédito no balanço de alguém.',
    avancado: 'Identidade contábil ex-post das contas nacionais: o saldo fiscal é a contrapartida exata dos saldos privado e externo — austeridade transfere o ajuste para algum setor.',
  },
  {
    id: 'troca-desigual', termo: 'Troca desigual', formal: 'unequal exchange',
    categoria: 'dependencia',
    didatico: 'O Sul vende barato o que custa muito trabalho (minério, comida) e compra caro o que embute tecnologia. A cada giro, riqueza escorre do Sul para o Norte.',
    avancado: 'Transferência sistemática de trabalho incorporado via termos de troca declinantes dos primários (Prebisch–Singer; Emmanuel), institucionalizada pela divisão internacional do trabalho.',
  },
  {
    id: 'superexploracao', termo: 'Superexploração do trabalho', formal: 'superexploração (Marini)',
    categoria: 'dependencia',
    didatico: 'Pagar o trabalhador MENOS do que ele precisa para viver com dignidade — e compensar com jornada maior. É o truque que barateia as commodities do Sul e engorda os lucros do Norte.',
    avancado: 'Mecanismo de compensação da troca desigual: valor da força de trabalho pago abaixo de sua reprodução + intensificação/extensão da jornada, preservando margens do capital dependente.',
  },
  {
    id: 'exercito-reserva', termo: 'Exército industrial de reserva', formal: 'reserve army of labour',
    categoria: 'dependencia',
    didatico: 'A fila de gente desempregada ou subempregada esperando vaga. Ela pressiona os salários de quem está empregado: “se você reclamar, tem mil na porta”.',
    avancado: 'Massa trabalhadora relativamente excedente que disciplina o valor da força de trabalho; no Sul, permanente e estrutural (BR: 92,1 mi / 43,65%).',
  },
  {
    id: 'imperialismo', termo: 'Imperialismo', formal: 'estágio monopolista (Lenin)',
    categoria: 'dependencia',
    didatico: 'A fase em que grandes capitais de poucos países dominam o mundo inteiro com fábricas, bancos e exércitos — e brigam entre si por mercados, matérias-primas e rotas. As guerras grandes nascem daqui.',
    avancado: 'Fase monopolista: exportação de capitais, formação de blocos, partilha e repartilha territorial proporcional à força econômica — a guerra como continuação da concorrência.',
  },
  {
    id: 'buyback', termo: 'Buyback', formal: 'recompra de ações',
    categoria: 'moeda',
    didatico: 'A empresa compra as próprias ações de volta para o preço subir — em vez de investir, dar aumento ou contratar. Atalho direto do lucro para o bolso dos acionistas.',
    avancado: 'Distribuição de excedente via redução do float: eleva EPS e múltiplos, priorizando valorização acionária sobre acumulação real — síntese da hegemonia da governança rentista.',
  },
]
