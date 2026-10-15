import type { UIMode, DisciplineLens, TabId } from '../store/useApp'

/** Ordem de escolha do texto: do mais simples ao mais técnico (testado em simples.test.ts). */
export const NIVEIS: {
  id: UIMode
  rotulo: string
  publico: string
  descricao: string
  cor: string
}[] = [
  {
    id: 'simples',
    rotulo: 'Simples',
    publico: 'Fundamental II e início do Ensino Médio',
    descricao: 'Para quem está começando: palavras do dia a dia, sem fórmula.',
    cor: 'amber-300',
  },
  {
    id: 'didatico',
    rotulo: 'Didático',
    publico: 'Ensino Médio, ENEM e Graduação Introdutória',
    descricao: 'Explicações com alguma conta e metáfora. Padrão do app.',
    cor: 'emerald-300',
  },
  {
    id: 'avancado',
    rotulo: 'Avançado',
    publico: 'Universitários, Pós-Graduação e Pesquisadores',
    descricao: 'Categorias marxistas, fórmulas e referências.',
    cor: 'sky-300',
  },
]

export interface LenteMeta {
  id: DisciplineLens
  rotulo: [pt: string, en: string, es: string]
  curto: [pt: string, en: string, es: string]
  cor: string
  descricao: [pt: string, en: string, es: string]
}

export const LENTES: LenteMeta[] = [
  {
    id: 'geral',
    rotulo: ['Visão Integrada', 'Integrated View', 'Visión Integrada'],
    curto: ['Geral', 'All', 'General'],
    cor: '#ffc107',
    descricao: [
      'Combina geopolítica, circuitos econômicos, empresas e trabalho.',
      'Combines geopolitics, economic circuits, corporations and labor.',
      'Combina geopolítica, circuitos económicos, empresas y trabajo.',
    ],
  },
  {
    id: 'geografia',
    rotulo: ['Modo Geografia', 'Geography Mode', 'Modo Geografía'],
    curto: ['Geografia', 'Geography', 'Geografía'],
    cor: '#38bdf8',
    descricao: [
      'Foco em Divisão Internacional do Trabalho (DIT), fluxos comerciais, recursos estratégicos e território.',
      'Focus on International Division of Labor, trade flows, strategic resources and territory.',
      'Enfoque en División Internacional del Trabajo, flujos comerciales, recursos estratégicos y territorio.',
    ],
  },
  {
    id: 'historia',
    rotulo: ['Modo História', 'History Mode', 'Modo Historia'],
    curto: ['História', 'History', 'Historia'],
    cor: '#fb7185',
    descricao: [
      'Foco em transições de hegemonia, colonialismo, Bretton Woods (1944), Choque de 1971 e crises.',
      'Focus on hegemonic transitions, colonialism, Bretton Woods (1944), the 1971 Shock and crises.',
      'Enfoque en transiciones hegemónicas, colonialismo, Bretton Woods (1944), el Shock de 1971 y crisis.',
    ],
  },
  {
    id: 'economia',
    rotulo: ['Modo Economia Política', 'Political Economy Mode', 'Modo Economía Política'],
    curto: ['Economia', 'Economics', 'Economía'],
    cor: '#34d399',
    descricao: [
      'Foco analítico em Marx (c+v+m), Kalecki (demanda efetiva), MMT (moeda soberana) e TMD (dependência).',
      'Analytical focus on Marx (c+v+m), Kalecki (effective demand), MMT (sovereign money) and Dependency Theory.',
      'Enfoque analítico en Marx (c+v+m), Kalecki (demanda efectiva), MMT (moneda soberana) y TMD (dependencia).',
    ],
  },
]

export interface ModulePedagogyMeta {
  bncc: string[]
  perguntaAula: [pt: string, en: string, es: string]
  recorteLente: Record<Exclude<DisciplineLens, 'geral'>, [pt: string, en: string, es: string]>
  notaMetodologicaPesquisa: [pt: string, en: string, es: string]
}

/** Guia estruturado por módulo para professores (Fundamental/Médio) e pesquisadores (Universidade) */
export const MODULE_PEDAGOGY: Partial<Record<TabId, ModulePedagogyMeta>> = {
  home: {
    bncc: ['EF08GE05', 'EF09GE11', 'EM13CHS201', 'EM13CHS401'],
    perguntaAula: [
      'Por que os países que exportam mais matéria-prima e trabalham mais horas continuam com menor renda média e moeda mais fraca?',
      'Why do countries that export the most raw materials and work the longest hours still have lower average wages and weaker currencies?',
      '¿Por qué los países que exportan más materias primas y trabajan más horas siguen teniendo menores salarios medios y monedas más débiles?',
    ],
    recorteLente: {
      geografia: [
        'Observe a Divisão Internacional do Trabalho (DIT): fluxos azuis (commodities) saem do Sul Global, enquanto fluxos rosas (manufatura) e roxos (rendas de propriedade) concentram valor na Tríade e na Ásia Oriental.',
        'Observe the International Division of Labor: blue flows (commodities) leave the Global South while pink (manufacturing) and purple (property income) concentrate value in the Triad and East Asia.',
        'Observa la División Internacional del Trabajo: los flujos azules (commodities) salen del Sur Global mientras los rosas (manufactura) y morados (rentas) concentran valor en la Tríada y Asia Oriental.',
      ],
      historia: [
        'Compare como as antigas rotas coloniais do Atlântico foram reconfiguradas após 1945 (hegemonia do dólar) e após 2001 (entrada da China na OMC e ascensão do BRICS+).',
        'Compare how former Atlantic colonial routes were reconfigured after 1945 (dollar hegemony) and after 2001 (China’s WTO entry and rise of BRICS+).',
        'Compara cómo las antiguas rutas coloniales del Atlántico se reconfiguraron tras 1945 (hegemonía del dólar) y tras 2001 (ingreso de China en la OMC y ascenso de BRICS+).',
      ],
      economia: [
        'Compare o PIB Nominal com o PIB PPP e observe como a Hierarquia Monetária (MMT/TMD) permite ao centro emissor financiar déficits enquanto a periferia precisa gerar saldos primários em divisa.',
        'Compare Nominal GDP with PPP GDP and observe how the Monetary Hierarchy allows core issuers to finance deficits while the periphery must earn hard-currency surpluses.',
        'Compara el PIB Nominal con el PIB PPA y observa cómo la Jerarquía Monetaria permite al centro financiar déficits mientras la periferia necesita generar superávits en divisas.',
      ],
    },
    notaMetodologicaPesquisa: [
      'Metodologia (Avançado): PIBs nominais e PPP baseados no IMF WEO (safra 2025/26). As decomposições internas por frações de capital (c_prod, c_fin, c_com, c_fict, c_est) são proxies pedagógicas inspiradas na tradição de contas nacionais marxistas (Shaikh & Tonak, 1994; ILAESE). Fluxos bilaterais consolidam séries Comex Stat, US Census, Eurostat, UNCTAD e Zucman (Missing Profits).',
      'Methodology (Advanced): Nominal and PPP GDPs from IMF WEO (2025/26). Internal capital-fraction breakdowns are pedagogical proxies inspired by Marxian national-accounts literature (Shaikh & Tonak, 1994; ILAESE). Bilateral flows consolidate Comex Stat, US Census, Eurostat, UNCTAD and Zucman (Missing Profits).',
      'Metodología (Avanzado): PIB nominal y PPA basados en FMI WEO (2025/26). Las descomposiciones por fracciones de capital son aproximaciones pedagógicas inspiradas en las cuentas nacionales marxistas (Shaikh & Tonak, 1994; ILAESE).',
    ],
  },
  circuit: {
    bncc: ['EF09HI01', 'EM13CHS401', 'EM13CHS402'],
    perguntaAula: [
      'Se uma fábrica substituir quase todos os trabalhadores por robôs, o que acontece com o preço unitário e com a taxa de lucro sobre o capital total investido?',
      'If a factory replaces almost all workers with robots, what happens to unit value and to the profit rate on total invested capital?',
      'Si una fábrica reemplaza a casi todos los trabajadores por robots, ¿qué ocurre con el valor unitario y con la tasa de ganancia sobre el capital total invertido?',
    ],
    recorteLente: {
      geografia: [
        'A elevação de k = c/v nos países centrais empurra etapas intensivas em trabalho vivo (v) para zonas francas e maquiladoras do Sul Global.',
        'Rising k = c/v in core countries pushes labor-intensive stages (v) toward export-processing zones in the Global South.',
        'El aumento de k = c/v en los países centrales desplaza las etapas intensivas en trabajo vivo (v) hacia zonas francas del Sur Global.',
      ],
      historia: [
        'Use os 4 presets históricos (Manufatura séc. XIX → Fordismo → Automação/IA → Uberização) para visualizar a evolução secular da composição técnica e orgânica do capital.',
        'Use the 4 historical presets (19th-c. Manufacturing → Fordism → Automation/AI → Platformization) to trace the secular evolution of organic composition.',
        'Usa los 4 preajustes históricos para visualizar la evolución secular de la composición orgánica del capital.',
      ],
      economia: [
        'Identidade fundamental: W = c + v + m, com taxa de lucro g = m/(c+v) = e/(k+1). Para e constante, ∂g/∂k = -e/(k+1)² < 0 (Lei da Tendência Decrescente da Taxa de Lucro, Livro III de O Capital).',
        'Core identity: W = c + v + m, profit rate g = m/(c+v) = e/(k+1). Holding e constant, ∂g/∂k = -e/(k+1)² < 0 (Law of the Tendency of the Rate of Profit to Fall, Capital Vol. III).',
        'Identidad fundamental: W = c + v + m, tasa de ganancia g = m/(c+v) = e/(k+1). Con e constante, ∂g/∂k < 0 (Ley de la Tendencia Decreciente de la Tasa de Ganancia).',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): O modelo opera em taxas de fluxo anualizadas com rotação unitária (n = 1) e capital variável normalizado (v = 100). A tradução em horas não pagas (H = 8 · e/(e+1)) assume equivalência entre valor novo (v+m) e jornada diária de 8h (convenção ILAESE / DIEESE).',
      'Methodological Note (Advanced): The model operates on annualized flow rates with unit turnover (n = 1) and normalized variable capital (v = 100). Unpaid hours (H = 8 · e/(e+1)) assume proportionality between new value (v+m) and an 8h workday.',
      'Nota Metodológica (Avanzado): El modelo opera con rotación unitaria (n = 1) y capital variable normalizado (v = 100). Las horas no pagadas asumen proporcionalidad entre valor nuevo (v+m) y jornada de 8h.',
    ],
  },
  war: {
    bncc: ['EF09HI10', 'EF09HI15', 'EM13CHS204', 'EM13CHS604'],
    perguntaAula: [
      'De onde sai o dinheiro que paga as encomendas recordes da indústria de armas durante uma guerra e quem fica com os ativos após a reconstrução?',
      'Where does the money that pays for record weapons orders come from during a war, and who owns the assets after reconstruction?',
      '¿De dónde sale el dinero que paga los pedidos récord de armas durante una guerra y quién se queda con los activos tras la reconstrucción?',
    ],
    recorteLente: {
      geografia: [
        'Observe no mapa como os conflitos se concentram ao redor de gargalos energéticos (Golfo Pérsico, Leste Europeu) e tecnológicos (Estreito de Taiwan).',
        'Notice on the map how conflicts cluster around energy (Persian Gulf, Eastern Europe) and technology (Taiwan Strait) chokepoints.',
        'Observa en el mapa cómo los conflictos se concentran en torno a cuellos de botella energéticos y tecnológicos.',
      ],
      historia: [
        'Use o controle deslizante reverso (2026 → 1914) para ver como a 1ª e a 2ª Guerra Mundial transferiram o estoque de ouro europeu para os EUA, fundando Bretton Woods.',
        'Use the reverse slider (2026 → 1914) to see how WWI and WWII transferred European gold reserves to the US, founding Bretton Woods.',
        'Usa el deslizador inverso (2026 → 1914) para ver cómo las dos guerras mundiales transfirieron el oro europeo a EE. UU.',
      ],
      economia: [
        'Keynesianismo bélico e destruição de capital constante (c): o gasto militar socializa o custo via dívida pública/tributos e garante realização sem risco (contratos cost-plus) ao complexo industrial-militar.',
        'Military Keynesianism and destruction of constant capital (c): military spending socializes costs via public debt/taxes while guaranteeing risk-free realization (cost-plus contracts).',
        'Keynesianismo bélico y destrucción de capital constante (c): el gasto militar socializa costos vía deuda/impuestos y garantiza realización sin riesgo.',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): Dados de gasto militar baseados no SIPRI Milex Database (2024) e custos acumulados de conflitos pós-2001 baseados no projeto Costs of War (Watson Institute, Brown University) e relatórios CRS/GAO.',
      'Methodological Note (Advanced): Military spending data from SIPRI Milex Database (2024); post-2001 war costs from the Costs of War Project (Brown University) and CRS/GAO reports.',
      'Nota Metodológica (Avanzado): Datos de gasto militar de SIPRI Milex (2024) y costos acumulados de Costs of War (Brown University).',
    ],
  },
  debt: {
    bncc: ['EF09GE13', 'EM13CHS402', 'EM13CHS404'],
    perguntaAula: [
      'Por que um país que emite a própria moeda (como EUA ou Japão) funciona diferente de uma família ou de um país endividado em moeda estrangeira?',
      'Why does a country that issues its own currency (like the US or Japan) work differently from a household or a country indebted in foreign currency?',
      '¿Por qué un país que emite su propia moneda funciona diferente de una familia o de un país endeudado en moneda extranjera?',
    ],
    recorteLente: {
      geografia: [
        'Compare a posição do Japão e dos EUA (topo da hierarquia monetária) com a da periferia latino-americana e africana, onde a restrição externa em dólar impõe limites reais.',
        'Compare Japan and the US (top of the monetary hierarchy) with the Latin American and African periphery, where external dollar constraints bind.',
        'Compara Japón y EE. UU. con la periferia latinoamericana y africana, donde la restricción externa en dólares impone límites reales.',
      ],
      historia: [
        'A dívida pública moderna nasce como alavanca da acumulação primitiva (Marx, cap. 24) e muda de natureza após 1971 com o fim da conversibilidade em ouro.',
        'Modern public debt emerged as a lever of primitive accumulation (Marx, ch. 24) and changed nature after 1971 with the end of gold convertibility.',
        'La deuda pública moderna nació como palanca de la acumulación primitiva y cambió de naturaleza tras 1971.',
      ],
      economia: [
        'Cruze a identidade contábil de Godley (S−I) ≡ (G−T) + (X−M) com a equação de lucros de Kalecki e a leitura marxista do título público como capital fictício portador de juros.',
        'Cross Godley’s sectoral identity (S−I) ≡ (G−T) + (X−M) with Kalecki’s profit equation and Marx’s reading of public bonds as interest-bearing fictitious capital.',
        'Cruza la identidad sectorial de Godley con la ecuación de ganancias de Kalecki y la lectura marxista del capital ficticio.',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): Na LOA brasileira, é fundamental distinguir o Orçamento Geral (que inclui refinanciamento/rolagem do principal da dívida mobiliária) do resultado primário/nominal das Contas Nacionais (STN/BCB). Veja Fontes (#orcamento-uniao).',
      'Methodological Note (Advanced): In Brazil’s federal budget (LOA), distinguish total budget appropriations (which include debt rollover/refinancing) from net interest and primary balance in National Accounts (STN/BCB).',
      'Nota Metodológica (Avanzado): En el presupuesto federal brasileño (LOA), distíngase entre el presupuesto total (con refinanciamiento) y el gasto neto en intereses.',
    ],
  },
  companies: {
    bncc: ['EF09GE12', 'EM13CHS401', 'EM13CHS403'],
    perguntaAula: [
      'Como o valor de mercado de uma Big Tech na bolsa pode ser muitas vezes maior do que tudo o que ela vende em um ano?',
      'How can a Big Tech company’s stock-market value be many times larger than everything it sells in a year?',
      '¿Cómo puede el valor bursátil de una Big Tech ser muchas veces mayor que todo lo que vende en un año?',
    ],
    recorteLente: {
      geografia: [
        'Filtre por país e setor: note como as empresas de maior capitalização (capital fictício) estão nos EUA, enquanto mineradoras e montadoras concentram headcount físico.',
        'Filter by country and sector: notice how the highest market-cap firms are in the US, while miners and assemblers concentrate physical headcount.',
        'Filtra por país y sector: observa cómo las empresas de mayor capitalización están en EE. UU.',
      ],
      historia: [
        'Compare as gigantes industriais do século XX (montadoras, siderúrgicas e petroleiras) com as plataformas digitais e empresas de semicondutores do século XXI.',
        'Compare 20th-century industrial giants (automakers, steel, oil) with 21st-century digital platforms and semiconductor firms.',
        'Compara los gigantes industriales del siglo XX con las plataformas digitales y empresas de semiconductores del siglo XXI.',
      ],
      economia: [
        'Decomposição contábil W = c + v + m: v é estimado por headcount × salário médio setorial; m pelo lucro líquido; c como resíduo operacional (receita − v − m).',
        'Accounting decomposition W = c + v + m: v estimated via headcount × sector average wage; m via net income; c as operating residual (revenue − v − m).',
        'Descomposición contable W = c + v + m: v estimado por plantilla × salario medio; m por beneficio neto; c como residuo.',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): Como a mais-valia é redistribuída entre setores via preços de produção e rendas de monopólio/juros (Marx, Livro III), uma alta razão m/v contábil em bancos ou empresas de petróleo reflete também captura intersetorial de mais-valia, e não apenas exploração interna no local.',
      'Methodological Note (Advanced): Because surplus value is redistributed across sectors via prices of production and monopoly/interest rents (Marx, Capital Vol. III), a high accounting m/v in banks or oil firms also reflects intersectoral surplus capture.',
      'Nota Metodológica (Avanzado): Dado que la plusvalía se redistribuye entre sectores mediante precios de producción y rentas, una razón m/v alta en bancos o petroleras refleja también captura intersectorial.',
    ],
  },
  platform: {
    bncc: ['EF09GE12', 'EM13CHS401', 'EM13CHS402', 'EM13CHS404'],
    perguntaAula: [
      'Por que motoristas e entregadores de aplicativo trabalham mais de 10h diárias, arcam com veículo e combustível, mas não têm garantia de salário mínimo nem férias?',
      'Why do app delivery workers and drivers work over 10 hours a day, pay for their own vehicle and gas, but have no minimum wage or paid vacation guarantees?',
      '¿Por qué los repartidores y conductores de aplicación trabajan más de 10 horas al día, asumen el vehículo y combustible, pero no tienen salario mínimo ni vacaciones?',
    ],
    recorteLente: {
      geografia: [
        'Observe como as sedes e servidores das grandes plataformas ficam no Norte Global (Vale do Silício, Amsterdã), enquanto milhões de trabalhadores precários circulam nas metrópoles do Sul Global.',
        'Notice how gig platform headquarters and servers remain in the Global North (Silicon Valley, Amsterdam), while millions of precarious workers circulate in Global South metropolises.',
        'Observa cómo las sedes de plataformas están en el Norte Global, mientras millones de trabajadores precarios circulan en metrópolis del Sur Global.',
      ],
      historia: [
        'Compare a jornada fabril dos séculos XIX e XX (com direitos conquistados após décadas de lutas sindicais) com o trabalho sob demanda mediado por algoritmo no século XXI.',
        'Compare 19th and 20th-century factory workdays (with labor rights won through union struggles) with 21st-century algorithm-managed on-demand work.',
        'Compara la jornada fabril de los siglos XIX y XX con el trabajo por demanda gestionado por algoritmos en el siglo XXI.',
      ],
      economia: [
        'Transferência de capital constante para o trabalhador: a plataforma não adianta c (celular, veículo e manutenção são pagos pelo entregador), elevando a taxa de mais-valia aparente e socializando o risco operacional.',
        'Transfer of constant capital to labor: platforms advance zero c (phone, vehicle, and maintenance paid by the worker), driving up the rate of surplus-value while socializing operational risk.',
        'Transferencia de capital constante a la fuerza de trabajo: la plataforma no adelanta c, elevando la tasa de plusvalía y socializando el riesgo operativo.',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): Baseado nas pesquisas do IBGE/PNAD Contínua (módulo Trabalho por Aplicativo), OIT e Fairwork Brasil (Oxford/UFRJ). O rendimento médio por hora dos plataformizados desconta despesas de combustível, depreciação e dados para estimar a remuneração líquida real.',
      'Methodological Note (Advanced): Based on IBGE/PNAD Contínua (Platform Work module), ILO, and Fairwork Brazil (Oxford/UFRJ). Average hourly earnings deduct fuel, vehicle depreciation, and data costs to estimate real net remuneration.',
      'Nota Metodológica (Avanzado): Basado en IBGE/PNAD Contínua (Trabajo en Plataformas), OIT y Fairwork Brasil (Oxford/UFRJ). Se descuentan combustible, depreciación y conectividad para estimar el ingreso neto real.',
    ],
  },
  wealth: {
    bncc: ['EF09GE11', 'EM13CHS201', 'EM13CHS403', 'EM13CHS404'],
    perguntaAula: [
      'Se toda a riqueza acumulada no mundo fosse repartida igualmente, quanto caberia a cada ser humano adulto, e por que a maior parte está concentrada no topo 1%?',
      'If all global wealth were divided equally, how much would each adult receive, and why is most of it concentrated in the top 1%?',
      '¿Si toda la riqueza acumulada se repartiera por igual, cuánto recibiría cada adulto y por qué la mayor parte está concentrada en el 1% superior?',
    ],
    recorteLente: {
      geografia: [
        'Analise a pirâmide da riqueza global: o topo (EUA e Europa Ocidental) detém ativos financeiros líquidos, enquanto a base (África, América Latina e Sul da Ásia) detém trabalho vivo e recursos primários.',
        'Analyze the global wealth pyramid: the top (US and Western Europe) holds liquid financial claims, while the base (Africa, Latin America, South Asia) holds living labor and primary resources.',
        'Analiza la pirámide de riqueza global: la cúspide posee activos financieros líquidos, mientras la base posee trabajo vivo y recursos primarios.',
      ],
      historia: [
        'Da acumulação primitiva colonial (pilhagem mineral e comércio escravista) à financeirização neoliberal: o estoque de riqueza acumulada reflete séculos de expansão e proteção jurídica de ativos.',
        'From colonial primitive accumulation (bullion plunder and slave trade) to neoliberal financialization: accumulated wealth stocks reflect centuries of imperial expansion and asset protection.',
        'De la acumulación primitiva colonial a la financiarización neoliberal: el acervo de riqueza refleja siglos de expansión imperial y protección patrimonial.',
      ],
      economia: [
        'Diferença entre fluxo de valor novo (PIB = v + m) e estoque de riqueza: a riqueza patrimonial (W) capitaliza fluxos futuros de mais-valia descontados à taxa de juros do mercado (capital fictício).',
        'Distinction between new value flow (GDP = v + m) and wealth stock: accumulated net worth (W) capitalizes discounted future surplus-value streams (fictitious capital).',
        'Diferencia entre flujo de valor nuevo (PIB = v + m) y acervo de riqueza: el patrimonio acumulado capitaliza flujos futuros de plusvalía (capital ficticio).',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): Dados consolidados a partir do World Inequality Report (WID.world / Piketty, Chancel, Saez, Zucman), Global Wealth Report (UBS/Credit Suisse) e Forbes Billionaires Index. As participações do topo incluem estimativas de paraísos fiscais conforme metodologia Zucman (2014).',
      'Methodological Note (Advanced): Data synthesized from the World Inequality Report (WID.world), UBS Global Wealth Report, and Forbes Billionaires Index. Top wealth fractiles adjust for offshore tax havens following Zucman (2014).',
      'Nota Metodológica (Avanzado): Datos del World Inequality Report (WID.world), Informe de Riqueza Global de UBS y Forbes Billionaires Index, ajustados por paraísos fiscales según Zucman (2014).',
    ],
  },
  consequences: {
    bncc: ['EF08GE14', 'EF09HI15', 'EM13CHS106', 'EM13CHS304'],
    perguntaAula: [
      'Por que os maiores desastres industriais, ambientais e sanitários da história quase sempre atingem comunidades pobres enquanto os lucros já foram distribuídos aos acionistas?',
      'Why do the largest industrial, environmental, and health disasters in history almost always strike poor communities while profits were already distributed to shareholders?',
      '¿Por qué los mayores desastres industriales, ambientales y sanitarios afectan a comunidades pobres mientras las ganancias ya fueron distribuidas a los accionistas?',
    ],
    recorteLente: {
      geografia: [
        'Racismo ambiental e zonas de sacrifício: trace no mapa onde estão localizados os desastres corporativos (Bhopal, Cubatão, Mariana, Brumadinho, Rana Plaza, Minamata).',
        'Environmental racism and sacrifice zones: locate corporate disasters on the map (Bhopal, Cubatão, Mariana, Brumadinho, Rana Plaza, Minamata Bay).',
        'Racismo ambiental y zonas de sacrificio: localiza en el mapa dónde se ubican los desastres corporativos (Bhopal, Cubatão, Mariana, Brumadinho, Rana Plaza, Minamata).',
      ],
      historia: [
        'Evolução da blindagem corporativa: da proteção estatal sob regimes autoritários aos acordos judiciais contemporâneos que convertem a perda de vidas humanas em custo operacional administrável.',
        'Evolution of corporate liability shields: from authoritarian state protection to contemporary out-of-court settlements pricing human life as manageable operating costs.',
        'Evolución del blindaje corporativo: de la protección estatal bajo regímenes autoritarios a acuerdos extrajudiciales que cotizan la vida humana como costo operativo.',
      ],
      economia: [
        'Externalização forçada de custos: ao cortar gastos de manutenção e segurança no capital constante fixo (c), corporações maximizam a taxa de lucro imediata e transferem o risco catastrófico para a sociedade.',
        'Forced cost externalization: by cutting fixed constant capital (c) safety and maintenance, corporations maximize short-term profit rates while shifting catastrophic risk to society.',
        'Externalización forzada de costos: al recortar mantenimiento en capital constante fijo (c), las corporaciones maximizan la tasa de ganancia inmediata y transfieren el riesgo catastrófico a la sociedad.',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): Compilado a partir de relatórios da OIT (2,9 milhões de mortes laborais anuais), laudos do US Chemical Safety Board (CSB), inquéritos de Ministérios Públicos e literatura de ecologia política (Bullard; Acselrad; Rob Nixon - Slow Violence).',
      'Methodological Note (Advanced): Compiled from ILO reports (2.9M annual workplace fatalities), US Chemical Safety Board (CSB) findings, and political ecology literature (Bullard, Nixon - Slow Violence).',
      'Nota Metodológica (Avanzado): Compilado a partir de informes de la OIT (2,9M de muertes laborales anuales), peritajes del US CSB y literatura de ecología política.',
    ],
  },
  alternatives: {
    bncc: ['EF09HI32', 'EM13CHS102', 'EM13CHS404', 'EM13CHS604'],
    perguntaAula: [
      'Se o modelo atual concentra renda e degrada a biosfera, quais são as propostas concretas de reorganização da produção, da moeda e da propriedade já testadas no mundo?',
      'If the current system concentrates wealth and degrades the biosphere, what concrete proposals for reorganizing production, currency, and property have been tested globally?',
      '¿Si el modelo actual concentra riqueza y degrada la biosfera, cuáles son las propuestas concretas para reorganizar producción, moneda y propiedad?',
    ],
    recorteLente: {
      geografia: [
        'Mapeie iniciativas territoriais de soberania alimentar, transição energética justa, fundos soberanos de recursos naturais e bancos públicos comunitários de desenvolvimento.',
        'Map territorial initiatives for food sovereignty, just energy transitions, natural resource sovereign wealth funds, and community development banks.',
        'Mapea iniciativas territoriales de soberanía alimentaria, transición energética justa y fondos soberanos de recursos naturales.',
      ],
      historia: [
        'Do Estado de Bem-Estar e planejamento centralizado aos experimentos de autogestão operária (Iugoslávia, Mondragón) e às economias mistas lideradas pelo Estado (China, Vietnã).',
        'From the Welfare State and centralized planning to worker self-management (Yugoslavia, Mondragón) and strategic state-led mixed economies (China, Vietnam).',
        'Del Estado de Bienestar a la autogestión obrera y las economías mixtas lideradas por empresas públicas estratégicas.',
      ],
      economia: [
        'Planejamento democrático vs. coordenação exclusiva pelo mercado: cálculo econômico socialista, garantia pública de emprego (Job Guarantee / MMT) e desmercantilização de bens comuns.',
        'Democratic planning vs. exclusive market coordination: socialist economic calculation, public Job Guarantee (MMT), and decommodification of essential common goods.',
        'Planificación democrática vs. mercado: cálculo económico socialista, garantía pública de empleo (MMT) y desmercantilización de bienes comunes.',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): Taxonomia comparativa baseada em modelos de economia política heterodoxa (Cockshott & Cottrell, 1993; Albert & Hahnel - Parecon; Mariana Mazzucato - Estado Empreendedor; Karl Polanyi - A Grande Transformação).',
      'Methodological Note (Advanced): Comparative taxonomy grounded in heterodox political economy models (Cockshott & Cottrell, 1993; Albert & Hahnel; Mazzucato; Polanyi).',
      'Nota Metodológica (Avanzado): Taxonomía comparativa basada en modelos heterodoxos (Cockshott & Cottrell, Mazzucato, Polanyi).',
    ],
  },
  sources: {
    bncc: ['EM13CHS101', 'EM13CHS103', 'EM13CHS401'],
    perguntaAula: [
      'Como transformar dados e estatísticas oficiais em ferramentas de denúncia e análise crítica da realidade social?',
      'How can official government statistics and corporate balance sheets be transformed into tools for critical analysis and social accountability?',
      '¿Cómo transformar datos y estadísticas oficiales en herramientas de análisis crítico y compromiso social?',
    ],
    recorteLente: {
      geografia: [
        'Georreferenciamento de dados abertos: cruze bases do IBGE, MDIC Comex Stat e agências internacionais para evidenciar a geografia desigual do valor.',
        'Open data georeferencing: cross-reference IBGE, Comex Stat, and international agencies to reveal the uneven geography of value extraction.',
        'Georreferenciación de datos abiertos: cruza bases del IBGE y aduanas internacionales para evidenciar la geografía desigual del valor.',
      ],
      historia: [
        'Evolução histórica das Contas Nacionais: do esforço de guerra de Kuznets e Keynes à padronização do Sistema de Contas Nacionais (SNA) pela ONU (1953 a 2008).',
        'Historical evolution of National Accounts: from Kuznets and Keynes war efforts to the UN System of National Accounts standards (1953 to 2008).',
        'Evolución histórica de las Cuentas Nacionales: del esfuerzo de guerra de Kuznets y Keynes a los manuales SCN de la ONU.',
      ],
      economia: [
        'Crítica metodológica do PIB: por que o SCN contabiliza publicidade e especulação financeira como "geração de valor", enquanto o trabalho doméstico e de cuidado não pago permanece invisibilizado.',
        'Methodological critique of GDP: why SNA counts advertising and financial fees as "value creation" while unpaid domestic and care work remains invisible.',
        'Crítica metodológica del PIB: por qué el SCN contabiliza la especulación como "creación de valor" mientras invisibiliza el trabajo de cuidados no remunerado.',
      ],
    },
    notaMetodologicaPesquisa: [
      'Nota Metodológica (Avançado): Todos os dados do Capital Blocks provêm de fontes primárias públicas auditáveis (MDIC, IBGE, BCB, STN, SEC, SIPRI, UNCTAD, FMI, Banco Mundial, WID.world, PWT). Cada número no aplicativo possui rastreabilidade via `sourceUsage.ts` e link de citação.',
      'Methodological Note (Advanced): All Capital Blocks data originate from auditable public primary sources (MDIC, IBGE, SEC, SIPRI, UNCTAD, IMF, WID, PWT) with provenance traceability in `sourceUsage.ts`.',
      'Nota Metodológica (Avanzado): Todos los datos provienen de fuentes primarias auditables, con trazabilidad completa en `sourceUsage.ts`.',
    ],
  },
}

export const isSimples = (m: UIMode): boolean => m === 'simples'

/** Título curto do modo, para badges e tooltips (invariante de simples.test.ts). */
export function rotuloDoModo(m: UIMode): string {
  return NIVEIS.find((n) => n.id === m)?.rotulo ?? 'Didático'
}

/** Frase curta que explica o modo atual (invariante de simples.test.ts). */
export function descricaoDoModo(m: UIMode): string {
  return NIVEIS.find((n) => n.id === m)?.descricao ?? ''
}

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

export function resolveDidatico(textos: { did?: string; adv?: string }): string {
  return textos.did ?? textos.adv ?? ''
}

/* ── TRADUÇÕES CURADAS (invariantes travadas por src/test/simples.test.ts) ── */
const SIMPLES: Record<string, string> = {
  produtivo: 'Fábricas e máquinas',
  financeiro: 'Bancos e juros',
  comercial: 'Lojas e comércio exterior',
  ficticio: 'Promessas de ganho',
  estatal: 'Governo',
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
  'acumulação': 'Quando os donos ficam com cada vez mais',
  'super-exploração': 'Trabalhar de mais e ganhar de menos',
  'troca desigual': 'A troca que favorece sempre o mesmo lado',
  'fração de capital': 'O grupo que manda por um setor',
  'hegemonia': 'O país que dita as regras para os outros',
  'dívida soberana': 'Dívida que o país pode pagar na própria moeda',
  'dinheiro endógeno': 'O dinheiro nasce do gasto e do crédito',
  'paradoxo da parcimônia': 'Todo mundo poupar junto derruba a economia',
  'demanda efetiva': 'Alguém precisa comprar para a economia girar',
  'trabalho não pago': 'Horas que você trabalha e não recebe',
  'plataformização': 'Trabalhar por aplicativo, sem chefe e sem proteção',
  'superexploração': 'Trabalhar de mais e ganhar de menos',
}

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

export function simplificarTexto(texto: string): string {
  let out = texto
  for (const [padrao, troca] of FRASES_SIMPLES) out = out.replace(padrao, troca)
  return out
}

export function textoPorModo(modo: UIMode, did?: string, adv?: string, simples?: string): string {
  return resolve({ simples, did, adv }, modo)
}

export function termoSimples(termo: string): string {
  return SIMPLES[termo.toLowerCase().trim()] ?? termo
}
