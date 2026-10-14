/** GLOSSÁRIO — termos-chave com definições para os três níveis de leitura (THEORY.md compliant). */

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

type GlossaryLocale = Pick<GlossaryTerm, 'termo' | 'formal' | 'didatico' | 'avancado'>

const GLOSSARY_I18N: Record<string, Record<'en' | 'es', GlossaryLocale>> = {
  'mais-valia': {
    en: { termo: 'Surplus value', formal: 'm (Mehrwert)', didatico: 'The part of your work you do without receiving it back as wages. If in an 8-hour day you reproduce your wage in 3 hours, the other 5 create surplus value: wealth you produced and someone else appropriated.', avancado: 'Excess value created by living labor beyond what is needed to reproduce labor power: m = W − (c+v). In Marxian theory it is the source of profit, interest and ground rent.' },
    es: { termo: 'Plusvalía', formal: 'm (Mehrwert)', didatico: 'La parte de tu trabajo que realizas sin recibirla de vuelta como salario. Si en una jornada de 8 horas reproduces tu salario en 3, las otras 5 crean plusvalía: riqueza que tú produjiste y otra persona apropió.', avancado: 'Valor excedente creado por el trabajo vivo más allá de lo necesario para reproducir la fuerza de trabajo: m = W − (c+v). En la teoría marxista es la fuente de la ganancia, el interés y la renta del suelo.' },
  },
  'capital-constante': {
    en: { termo: 'Constant capital', formal: 'c', didatico: 'Machines, buildings and raw materials. They pass their existing value into products over time, but they do not create new value by themselves.', avancado: 'The portion of capital embodied in means of production whose value is transferred to output through depreciation or intermediate consumption without creating new value.' },
    es: { termo: 'Capital constante', formal: 'c', didatico: 'Máquinas, edificios y materias primas. Transfieren su valor ya existente al producto con el tiempo, pero por sí solos no crean valor nuevo.', avancado: 'Porción del capital materializada en medios de producción cuyo valor se transfiere al producto mediante depreciación o consumo intermedio sin crear valor nuevo.' },
  },
  'capital-variavel': {
    en: { termo: 'Variable capital', formal: 'v', didatico: 'The wage bill. It is the part of capital spent on labor power, the input that can create more value than the amount paid to reproduce it.', avancado: 'Outlay used to purchase labor power — the element whose use can generate value greater than its own reproduction cost.' },
    es: { termo: 'Capital variable', formal: 'v', didatico: 'La masa salarial. Es la parte del capital gastada en fuerza de trabajo, el insumo capaz de crear más valor que el costo pagado para reproducirla.', avancado: 'Desembolso destinado a comprar fuerza de trabajo — el elemento cuyo uso puede generar un valor superior a su propio costo de reproducción.' },
  },
  'composicao-organica': {
    en: { termo: 'Organic composition', formal: 'k = c/v', didatico: 'A shorthand for how much machinery and material capital there is relative to labor. As automation rises, the living-labor share can shrink.', avancado: 'The ratio between constant and variable capital; under a constant rate of exploitation, a rising organic composition puts downward pressure on the rate of profit in Marx’s law of the tendency of the rate of profit to fall.' },
    es: { termo: 'Composición orgánica', formal: 'k = c/v', didatico: 'Una forma de resumir cuánto capital en máquinas y materiales hay en relación con el trabajo. Cuando aumenta la automatización, puede reducirse la parte de trabajo vivo.', avancado: 'Razón entre capital constante y variable; con una tasa de explotación constante, su aumento presiona a la baja la tasa de ganancia en la ley marxista de la tendencia decreciente de la tasa de ganancia.' },
  },
  'taxa-lucro': {
    en: { termo: 'Rate of profit', formal: 'g = m/(c+v)', didatico: 'How much profit owners obtain relative to the total capital they advanced. It is one of the numbers that organizes investment decisions under capitalism.', avancado: 'Ratio of surplus value to total capital advanced; its structural downward tendency is used to analyze crises, competition for markets and financialization.' },
    es: { termo: 'Tasa de ganancia', formal: 'g = m/(c+v)', didatico: 'Cuánta ganancia obtienen los propietarios en relación con todo el capital que adelantaron. Es uno de los números que organiza las decisiones de inversión bajo el capitalismo.', avancado: 'Relación entre plusvalía y capital total adelantado; su tendencia estructural a caer se usa para analizar crisis, competencia por mercados y financiarización.' },
  },
  'capital-ficticio': {
    en: { termo: 'Fictitious capital', formal: 'fictitious capital', didatico: 'Financial claims that are priced today because they promise a share of future income: stocks, bonds and derivatives. They are claims on future wealth rather than wealth already produced.', avancado: 'Capitalization of expected income (a security as a discounted cash flow): a property claim on future surplus value that can move relatively autonomously from the productive base and amplify financial crises.' },
    es: { termo: 'Capital ficticio', formal: 'fictitious capital', didatico: 'Derechos financieros que tienen precio hoy porque prometen una parte de ingresos futuros: acciones, bonos y derivados. Son derechos sobre riqueza futura, no riqueza ya producida.', avancado: 'Capitalización de rentas esperadas (un título como flujo descontado): derecho de propiedad sobre plusvalía futura que puede moverse con relativa autonomía respecto de la base productiva y amplificar crisis financieras.' },
  },
  'portador-juros': {
    en: { termo: 'Interest-bearing capital', formal: 'M—M′', didatico: 'Money advanced in order to return as more money through lending and financial claims. The interest it receives ultimately has to be paid from income created somewhere else in the economy.', avancado: 'The most fetishized form of capital (M—M′): it appropriates a share of social surplus value through interest without an immediately visible productive mediation.' },
    es: { termo: 'Capital portador de interés', formal: 'M—M′', didatico: 'Dinero adelantado para volver como más dinero mediante préstamos y derechos financieros. El interés que recibe termina pagándose con ingresos creados en alguna otra parte de la economía.', avancado: 'La forma más fetichizada del capital (M—M′): apropia una parte de la plusvalía social mediante el interés sin una mediación productiva inmediatamente visible.' },
  },
  'sobreacumulacao': {
    en: { termo: 'Overaccumulation', formal: 'overaccumulation', didatico: 'When there is more capital seeking profitable investment than the economy can absorb at the expected return. Idle capacity, speculative bubbles and crises can follow.', avancado: 'A mass of capital that cannot find sufficiently profitable realization; it can be resolved through devaluation and destruction of capital, war, or spatial and financial expansion.' },
    es: { termo: 'Sobreacumulación', formal: 'overaccumulation', didatico: 'Cuando hay más capital buscando inversión rentable de lo que la economía puede absorber con la rentabilidad esperada. Pueden aparecer capacidad ociosa, burbujas especulativas y crisis.', avancado: 'Masa de capital que no encuentra una realización suficientemente rentable; puede resolverse mediante desvalorización y destrucción de capital, guerra o expansión espacial y financiera.' },
  },
  'demanda-efetiva': {
    en: { termo: 'Effective demand', formal: 'effective demand', didatico: 'What households, firms and governments actually buy. If everyone cuts spending at the same time, sales, profits and jobs can fall together and the economy contracts.', avancado: 'Keynesian-Kaleckian principle: investment creates the saving that validates its financing, while realization of output depends on aggregate expenditure rather than collective thrift.' },
    es: { termo: 'Demanda efectiva', formal: 'effective demand', didatico: 'Lo que hogares, empresas y gobiernos compran efectivamente. Si todos recortan el gasto al mismo tiempo, pueden caer juntos las ventas, las ganancias y el empleo, y la economía se contrae.', avancado: 'Principio keynesiano-kaleckiano: la inversión crea el ahorro que valida su financiamiento, mientras la realización de la producción depende del gasto agregado y no del ahorro colectivo.' },
  },
  'soberania-monetaria': {
    en: { termo: 'Monetary sovereignty', formal: 'monetary sovereignty (MMT)', didatico: 'The degree of control a state has over the currency in which it spends and taxes. An issuer of its own floating fiat currency faces different constraints from a household or a country indebted in a foreign currency.', avancado: 'An issuer of a non-convertible fiat currency with a floating exchange rate faces real constraints such as inflation and productive capacity rather than a mechanical financing constraint. The global monetary hierarchy still constrains peripheral issuers through dependence on core currencies.' },
    es: { termo: 'Soberanía monetaria', formal: 'monetary sovereignty (MMT)', didatico: 'El grado de control que un Estado tiene sobre la moneda en la que gasta y cobra impuestos. Un emisor de su propia moneda fiduciaria flotante enfrenta restricciones distintas de un hogar o de un país endeudado en moneda extranjera.', avancado: 'Un emisor de moneda fiduciaria no convertible con tipo de cambio flotante enfrenta restricciones reales como inflación y capacidad productiva, más que una restricción mecánica de financiamiento. La jerarquía monetaria global sigue limitando a emisores periféricos por su dependencia de monedas centrales.' },
  },
  'identidade-setorial': {
    en: { termo: 'Sectoral balances identity', formal: '(S−I) ≡ (G−T)+(X−M)', didatico: 'One sector’s financial deficit is another sector’s surplus. Public, private and foreign balances are linked by accounting, so they cannot all improve in the same direction at the same time.', avancado: 'Ex-post national-accounts identity: the fiscal balance is the exact counterpart of private and external balances; austerity shifts the adjustment onto at least one other sector.' },
    es: { termo: 'Identidad de balances sectoriales', formal: '(S−I) ≡ (G−T)+(X−M)', didatico: 'El déficit financiero de un sector es el superávit de otro. Los saldos público, privado y externo están unidos por la contabilidad, por lo que no pueden mejorar todos en la misma dirección al mismo tiempo.', avancado: 'Identidad ex post de las cuentas nacionales: el saldo fiscal es la contrapartida exacta de los saldos privado y externo; la austeridad desplaza el ajuste hacia al menos otro sector.' },
  },
  'troca-desigual': {
    en: { termo: 'Unequal exchange', formal: 'unequal exchange', didatico: 'A pattern in which countries export goods that embody large amounts of labor and natural resources at relatively low prices while importing higher-priced technology-intensive goods. Value can systematically move from South to North through the terms of trade.', avancado: 'Systematic transfer of embodied labor through deteriorating terms of trade for primary goods (Prebisch–Singer; Emmanuel), institutionalized by the international division of labor.' },
    es: { termo: 'Intercambio desigual', formal: 'unequal exchange', didatico: 'Patrón en el que países exportan bienes con mucho trabajo y recursos naturales a precios relativamente bajos e importan bienes tecnológicos más caros. El valor puede desplazarse sistemáticamente del Sur al Norte por los términos de intercambio.', avancado: 'Transferencia sistemática de trabajo incorporado mediante términos de intercambio deteriorados para bienes primarios (Prebisch–Singer; Emmanuel), institucionalizada por la división internacional del trabajo.' },
  },
  'superexploracao': {
    en: { termo: 'Super-exploitation of labor', formal: 'super-exploitation (Marini)', didatico: 'Paying labor below the level required for a socially adequate reproduction of life, while extending or intensifying the working day. In dependency theory this helps sustain low export prices and profits elsewhere in the chain.', avancado: 'A mechanism that compensates for unequal exchange: labor power is paid below its reproduction value while the working day is intensified or extended, preserving margins for dependent capital.' },
    es: { termo: 'Superexplotación del trabajo', formal: 'superexplotación (Marini)', didatico: 'Pagar el trabajo por debajo del nivel necesario para una reproducción social adecuada de la vida, mientras se alarga o intensifica la jornada. En la teoría de la dependencia esto ayuda a sostener precios bajos de exportación y ganancias en otras partes de la cadena.', avancado: 'Mecanismo de compensación del intercambio desigual: la fuerza de trabajo se paga por debajo de su valor de reproducción mientras la jornada se intensifica o extiende, preservando márgenes del capital dependiente.' },
  },
  'exercito-reserva': {
    en: { termo: 'Reserve army of labor', formal: 'reserve army of labour', didatico: 'The population that is unemployed, underemployed or precariously attached to the labor market. Its existence can weaken workers’ bargaining power by increasing competition for jobs.', avancado: 'A relatively surplus working population that disciplines the value of labor power; in dependent economies it can become permanent and structural (BR: 92.1 million / 43.65% in the dataset used here).' },
    es: { termo: 'Ejército industrial de reserva', formal: 'reserve army of labour', didatico: 'La población desempleada, subempleada o vinculada precariamente al mercado de trabajo. Su existencia puede debilitar el poder de negociación de quienes trabajan al aumentar la competencia por empleos.', avancado: 'Población trabajadora relativamente excedente que disciplina el valor de la fuerza de trabajo; en economías dependientes puede volverse permanente y estructural (BR: 92,1 millones / 43,65% en el conjunto de datos usado aquí).' },
  },
  'imperialismo': {
    en: { termo: 'Imperialism', formal: 'monopoly stage (Lenin)', didatico: 'A phase in which large firms and financial groups from powerful states operate across the world, competing for markets, resources, investment outlets and strategic routes. Economic rivalry can become geopolitical and military conflict.', avancado: 'Monopoly stage characterized by capital export, formation of blocs and territorial repartition in proportion to economic and political power — war as a continuation of competition by other means.' },
    es: { termo: 'Imperialismo', formal: 'etapa monopolista (Lenin)', didatico: 'Fase en la que grandes empresas y grupos financieros de Estados poderosos actúan en todo el mundo y compiten por mercados, recursos, destinos de inversión y rutas estratégicas. La rivalidad económica puede convertirse en conflicto geopolítico y militar.', avancado: 'Etapa monopolista caracterizada por exportación de capitales, formación de bloques y reparto territorial proporcional al poder económico y político — la guerra como continuación de la competencia por otros medios.' },
  },
  buyback: {
    en: { termo: 'Buyback', formal: 'share repurchase', didatico: 'A company buys back its own shares, reducing the number in circulation and often increasing earnings per share. It is one way to return cash to shareholders instead of using it for investment, wages or hiring.', avancado: 'Distribution of surplus through a reduction in public float: it raises EPS and can support valuation multiples, prioritizing shareholder value over real accumulation — a characteristic mechanism of rentier-oriented corporate governance.' },
    es: { termo: 'Recompra de acciones', formal: 'share repurchase', didatico: 'Una empresa recompra sus propias acciones, reduce la cantidad en circulación y suele elevar la ganancia por acción. Es una forma de devolver efectivo a accionistas en vez de usarlo para inversión, salarios o contratación.', avancado: 'Distribución del excedente mediante reducción del free float: eleva el EPS y puede sostener múltiplos de valoración, priorizando el valor para accionistas sobre la acumulación real — mecanismo típico de la gobernanza corporativa orientada al rentismo.' },
  },
}

export function glossaryForLang(lang: 'pt' | 'en' | 'es'): GlossaryTerm[] {
  if (lang === 'pt') return GLOSSARY
  return GLOSSARY.map((term) => ({ ...term, ...GLOSSARY_I18N[term.id][lang] }))
}
