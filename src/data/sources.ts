/**
 * REGISTRO CANÔNICO DE FONTES — base documental do Capital Blocks.
 * Ver `DATA-STANDARD.md` para o contrato. Esta lista alimenta a página
 * `Fontes & Referências` e deve ser atualizada sempre que uma fonte relevante
 * entrar no app.
 *
 * Regra de honestidade: `verificacao` nunca promete mais do que foi conferido.
 * `revisao-pendente` significa "não citar como fato fechado sem checar".
 */

export type SourceCategory =
  | 'macro'
  | 'moeda'
  | 'riqueza'
  | 'trabalho'
  | 'comercio'
  | 'guerra'
  | 'fiscal-br'
  | 'empresas'
  | 'brasil'
  | 'teoria'
  | 'alternativas'
  | 'impactos'
  | 'geo'
  | 'metodo';

export type SourceKind =
  | 'fonte-primaria'
  | 'base-oficial'
  | 'anuario'
  | 'relatorio-anual'
  | 'academica'
  | 'ong-especializada'
  | 'midia-especializada'
  | 'enciclopedia'
  | 'audiovisual'
  | 'metodologia-interna'
  | 'portal-oficial';

export type VerificationState =
  | 'fonte-declarada'
  | 'url-incluida'
  | 'revisao-pendente';

export interface SourceLink {
  rotulo: string;
  url: string;
  acessoEm: string;
}

export interface SourceRecord {
  id: string;
  nome: string;
  instituicao?: string;
  categoria: SourceCategory;
  tipo: SourceKind;
  ano: string;
  urls: SourceLink[];
  resumoDidatico: string;
  resumoAvancado: string;
  cobre: string[];
  usadoEm: string[];
  estimate?: boolean;
  verificacao: VerificationState;
  observacao?: string;
}

export const SOURCE_CATEGORIES: { id: SourceCategory; rotulo: string }[] = [
  { id: 'macro', rotulo: 'Macroeconomia' },
  { id: 'moeda', rotulo: 'Moeda e crédito' },
  { id: 'riqueza', rotulo: 'Riqueza e concentração' },
  { id: 'trabalho', rotulo: 'Trabalho e salários' },
  { id: 'comercio', rotulo: 'Comércio e fluxos' },
  { id: 'guerra', rotulo: 'Guerra e defesa' },
  { id: 'fiscal-br', rotulo: 'Fiscalidade no Brasil' },
  { id: 'empresas', rotulo: 'Empresas e mercado' },
  { id: 'brasil', rotulo: 'Brasil' },
  { id: 'teoria', rotulo: 'Teoria e conceitos' },
  { id: 'alternativas', rotulo: 'Alternativas' },
  { id: 'impactos', rotulo: 'Vítimas e impactos' },
  { id: 'geo', rotulo: 'Geografia e técnica' },
  { id: 'metodo', rotulo: 'Métodos e estimativas' },
];

export const SOURCE_KINDS: { id: SourceKind; rotulo: string }[] = [
  { id: 'fonte-primaria', rotulo: 'Fonte primária' },
  { id: 'base-oficial', rotulo: 'Base oficial' },
  { id: 'anuario', rotulo: 'Anuário' },
  { id: 'relatorio-anual', rotulo: 'Relatório anual' },
  { id: 'academica', rotulo: 'Acadêmica' },
  { id: 'ong-especializada', rotulo: 'ONG especializada' },
  { id: 'midia-especializada', rotulo: 'Mídia especializada' },
  { id: 'enciclopedia', rotulo: 'Enciclopédia' },
  { id: 'audiovisual', rotulo: 'Audiovisual' },
  { id: 'metodologia-interna', rotulo: 'Metodologia interna' },
  { id: 'portal-oficial', rotulo: 'Portal oficial' },
];

export const SOURCES: SourceRecord[] = [
  {
    id: 'imf-weo',
    nome: 'World Economic Outlook',
    instituicao: 'Fundo Monetário Internacional',
    categoria: 'macro',
    tipo: 'fonte-primaria',
    ano: '2025–2026',
    urls: [
      {
        rotulo: 'WEO no portal de dados do FMI (dataset IMF.RES:WEO)',
        url: 'https://data.imf.org/en/datasets/IMF.RES:WEO',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'A principal pesquisa do FMI sobre o tamanho das economias do mundo.',
    resumoAvancado: 'Base para PIB nominal/PPP e razões dívida/PIB; usar sempre a safra de abril/outubro.',
    cobre: ['PIB nominal e em PPC dos blocos.', 'Dívida pública em % do PIB por país.'],
    usadoEm: ['src/data/countries.ts', 'src/data/indicators.ts', 'src/data/theory.ts', 'Mapa 2D', 'Drawer de blocos'],
    verificacao: 'url-incluida',
    observacao:
      'MUDANÇA DE ENDEREÇO: desde out/2025 o banco do WEO migrou para o portal de dados do FMI (data.imf.org); as páginas antigas /en/Publications/WEO/weo-database/<safra> foram descontinuadas. Há guia de transição oficial. Os PIBs em countries.ts são aproximações por país — conferir a tabela exata ao atualizar a safra.',
  },
  {
    id: 'imf-cofer',
    nome: 'Currency Composition of Official Foreign Exchange Reserves',
    instituicao: 'Fundo Monetário Internacional',
    categoria: 'moeda',
    tipo: 'fonte-primaria',
    ano: 'Q4 2025',
    urls: [
      {
        rotulo: 'Conjunto de dados COFER',
        url: 'https://data.imf.org/en/datasets/IMF.STA:COFER',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Mostra em quais moedas os bancos centrais guardam reservas internacionais.',
    resumoAvancado: 'Base para medir a hierarquia monetária e a desdolarização gradual das reservas oficiais.',
    cobre: ['Participação do dólar, euro, iene, libra e renminbi nas reservas.'],
    usadoEm: ['src/data/indicators.ts', 'Indicadores Globais', 'Mapa 2D'],
    verificacao: 'url-incluida',
  },
  {
    id: 'imf-fiscal-monitor',
    nome: 'Fiscal Monitor',
    instituicao: 'Fundo Monetário Internacional',
    categoria: 'moeda',
    tipo: 'fonte-primaria',
    ano: '2025',
    urls: [
      {
        rotulo: 'Publicação Fiscal Monitor',
        url: 'https://www.imf.org/en/Publications/FM',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'O raio-X do FMI sobre dívidas e déficits dos governos.',
    resumoAvancado: 'Base para a dívida pública mundial como capital fictício estatal.',
    cobre: ['Dívida pública mundial e sua relação com o PIB global.'],
    usadoEm: ['src/data/worldWealth.ts', 'Riqueza Mundial'],
    verificacao: 'url-incluida',
  },
  {
    id: 'banco-mundial',
    nome: 'Portal de dados do Banco Mundial',
    instituicao: 'Banco Mundial',
    categoria: 'macro',
    tipo: 'portal-oficial',
    ano: 'portal contínuo',
    urls: [
      {
        rotulo: 'Portal do Banco Mundial',
        url: 'https://www.worldbank.org/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Portal para checar PIB, renda por pessoa e desenvolvimento.',
    resumoAvancado: 'Fonte complementar para contas nacionais e indicadores de desenvolvimento.',
    cobre: ['Checagem de PIB, renda per capita e indicadores sociais.'],
    usadoEm: ['src/data/affected.ts (checagem)'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar a tabela/indicador exato quando um número passar a citá-lo diretamente.',
  },
  {
    id: 'onu',
    nome: 'Portal das Nações Unidas',
    instituicao: 'Organização das Nações Unidas',
    categoria: 'macro',
    tipo: 'portal-oficial',
    ano: 'portal contínuo',
    urls: [
      {
        rotulo: 'Portal da ONU',
        url: 'https://www.un.org/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Portal para checar população, desenvolvimento e crises humanitárias.',
    resumoAvancado: 'Referência institucional para contexto populacional e humanitário.',
    cobre: ['Checagem de contexto populacional e humanitário.'],
    usadoEm: ['src/data/affected.ts (checagem)', 'src/data/consequences.ts (checagem)'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar agência/tabela exata quando um número passar a citá-la diretamente.',
  },
  {
    id: 'unctad',
    nome: 'Conferência das Nações Unidas sobre Comércio e Desenvolvimento',
    instituicao: 'UNCTAD',
    categoria: 'comercio',
    tipo: 'base-oficial',
    ano: '2024',
    urls: [
      {
        rotulo: 'World Investment Report 2024',
        url: 'https://unctad.org/publication/world-investment-report-2024',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'A agência da ONU que estuda comércio, investimento e desenvolvimento.',
    resumoAvancado: 'Base potencial para fluxos comerciais e cadeias globais de valor.',
    cobre: ['Checagem de comércio e investimento internacional.'],
    usadoEm: ['src/data/flows.ts (checagem)'],
    verificacao: 'url-incluida',
    observacao: 'Página do relatório verificada; a tabela exata por indicador ainda depende do registro anual citado.',
  },
  {
    id: 'bis-credito-total',
    nome: 'Total credit statistics',
    instituicao: 'Bank for International Settlements',
    categoria: 'moeda',
    tipo: 'fonte-primaria',
    ano: '2024',
    urls: [
      {
        rotulo: 'Tópico Total credit no portal de dados do BIS',
        url: 'https://data.bis.org/topics/TOTAL_CREDIT',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Quanto empresas e famílias devem a bancos e ao mercado de crédito.',
    resumoAvancado: 'Base para o crédito privado como antecipação de demanda e hipoteca de mais-valia futura.',
    cobre: ['Dívida privada não financeira global.'],
    usadoEm: ['src/data/worldWealth.ts', 'Riqueza Mundial'],
    verificacao: 'url-incluida',
  },
  {
    id: 'bis-derivativos',
    nome: 'Estatísticas de derivativos de balcão',
    instituicao: 'Bank for International Settlements',
    categoria: 'moeda',
    tipo: 'fonte-primaria',
    ano: 'jun/2024',
    urls: [
      {
        rotulo: 'Estatísticas de derivativos OTC (tópico no portal de dados do BIS)',
        url: 'https://data.bis.org/topics/OTC_DER',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'O tamanho das apostas financeiras feitas com derivativos.',
    resumoAvancado: 'Valor nocional não é riqueza: mede exposição e interdependência financeira.',
    cobre: ['Nocional de derivativos OTC usado no painel de riqueza.'],
    usadoEm: ['src/data/worldWealth.ts', 'Riqueza Mundial'],
    verificacao: 'url-incluida',
    observacao:
      'Tópico oficial localizado e verificado; o nocional de US$ 667 tri é de jun/2024 e deve ser conferido na tabela OTC_DER antes de cada nova safra.',
  },
  {
    id: 'tesouro-eua-cbo',
    nome: 'Orçamento e juros da dívida dos Estados Unidos',
    instituicao: 'Congressional Budget Office',
    categoria: 'moeda',
    tipo: 'fonte-primaria',
    ano: '2024–2025',
    urls: [
      {
        rotulo: 'Tópicos de orçamento do CBO',
        url: 'https://www.cbo.gov/topics/budget',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Quanto os EUA pagam de juros aos donos da própria dívida.',
    resumoAvancado: 'Base para a leitura da dívida como transferência fiscal ao capital portador de juros.',
    cobre: ['Juros líquidos e comparação com o orçamento de defesa.'],
    usadoEm: ['src/data/indicators.ts', 'Indicadores Globais'],
    verificacao: 'url-incluida',
  },
  {
    id: 'tesouro-nacional-br',
    nome: 'Tesouro Nacional e Orçamento da União',
    instituicao: 'Tesouro Nacional',
    categoria: 'fiscal-br',
    tipo: 'base-oficial',
    ano: 'portal contínuo',
    urls: [
      {
        rotulo: 'Tesouro Transparente',
        url: 'https://www.tesourotransparente.gov.br/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Onde o governo brasileiro publica receitas, despesas e dívida.',
    resumoAvancado: 'Base para orçamento federal, dívida pública mobiliária e composição em moeda nacional.',
    cobre: ['Orçamento da União e dívida pública federal.'],
    usadoEm: ['src/data/debt.ts', 'src/data/theory.ts', 'Módulo Dívida'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar relatório, tabela, mês e ano sempre que um número passar a citá-lo diretamente.',
  },
  {
    id: 'bcb-brics',
    nome: 'BRICS no Banco Central do Brasil',
    instituicao: 'Banco Central do Brasil',
    categoria: 'macro',
    tipo: 'base-oficial',
    ano: '2025',
    urls: [
      {
        rotulo: 'Página do BCB sobre o BRICS',
        url: 'https://www.bcb.gov.br/en/about/brics-en',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'A página do BCB que explica o bloco dos emergentes.',
    resumoAvancado: 'Ponto de partida institucional para o peso econômico e populacional do BRICS+.',
    cobre: ['Contexto institucional do BRICS+.'],
    usadoEm: ['src/data/indicators.ts', 'Indicadores Globais'],
    verificacao: 'url-incluida',
  },
  {
    id: 'bcb-portal',
    nome: 'Portal do Banco Central do Brasil',
    instituicao: 'Banco Central do Brasil',
    categoria: 'moeda',
    tipo: 'portal-oficial',
    ano: 'portal contínuo',
    urls: [
      {
        rotulo: 'Portal do BCB',
        url: 'https://www.bcb.gov.br/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Onde o Brasil publica câmbio, reservas, juros e estatísticas externas.',
    resumoAvancado: 'Base potencial para remessas, reservas, câmbio e setor externo brasileiro.',
    cobre: ['Checagem de estatísticas monetárias e externas do Brasil.'],
    usadoEm: ['src/data/flows.ts (checagem)'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar a estatística/tabela exata quando um número passar a citá-lo diretamente.',
  },
  {
    id: 'wfe-sifma',
    nome: 'Estatísticas de bolsas de valores',
    instituicao: 'World Federation of Exchanges / SIFMA',
    categoria: 'riqueza',
    tipo: 'base-oficial',
    ano: 'fim-2024',
    urls: [
      {
        rotulo: 'Portal da WFE',
        url: 'https://www.world-exchanges.org/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Quanto valem todas as empresas listadas nas bolsas do planeta.',
    resumoAvancado: 'Base para o mercado acionário como esfera de títulos e capital fictício.',
    cobre: ['Capitalização do mercado acionário global.'],
    usadoEm: ['src/data/worldWealth.ts', 'Riqueza Mundial', 'Raio-X de Empresas'],
    verificacao: 'url-incluida',
  },
  {
    id: 'ubs-gwr',
    nome: 'Global Wealth Report',
    instituicao: 'UBS',
    categoria: 'riqueza',
    tipo: 'relatorio-anual',
    ano: '2024 (fim-2023)',
    urls: [
      {
        rotulo: 'Comunicado — Global Wealth Report 2024 (Zurique, 10/jul/2024)',
        url: 'https://www.ubs.com/global/en/media/display-page-ndp/en-20240710-gwr-2024.html',
        acessoEm: '2026-09-28',
      },
      {
        rotulo: 'Global Wealth Report 2024 (PDF)',
        url: 'https://www.ubs.com/content/dam/assets/wm/global/insights/doc/global-wealth-report.pdf',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'O relatório anual sobre quem tem a riqueza das famílias no mundo.',
    resumoAvancado: 'Base para riqueza líquida privada e concentração patrimonial por faixa.',
    cobre: ['Riqueza líquida privada global e faixas de concentração.'],
    usadoEm: ['src/data/worldWealth.ts', 'src/data/concentration.ts', 'Riqueza Mundial'],
    verificacao: 'url-incluida',
    observacao:
      'Edição 2024 verificada (15ª edição; dados até 6/abr/2023, 56 mercados ≈ 92% da riqueza mundial). Riqueza cresceu 4,2% em 2023 (+8,4% real); ~US$ 83 tri serão transmitidos em 20 anos. Conferir a edição seguinte (GWR 2025) antes de atualizar PRIVaTE_NET_WEALTH_TRI.',
  },
  {
    id: 'savills-imobiliario',
    nome: 'Total Value of Global Real Estate',
    instituicao: 'Savills',
    categoria: 'riqueza',
    tipo: 'relatorio-anual',
    ano: '2023 (dados de fim-2022)',
    urls: [
      {
        rotulo: 'Total Value of Global Real Estate — Property remains the world’s biggest store of wealth',
        url: 'https://www.savills.com/impacts/market-trends/the-total-value-of-global-real-estate-property-remains-the-worlds-biggest-store-of-wealth.html',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'Quanto valem casas, prédios comerciais e terra agrícola no planeta.',
    resumoAvancado: 'Base para o imobiliário como ativo real e colateral do crédito.',
    cobre: ['Valor do estoque imobiliário mundial.'],
    usadoEm: ['src/data/worldWealth.ts', 'Riqueza Mundial'],
    verificacao: 'url-incluida',
    observacao:
      'VERIFICADO: US$ 379,7 tri no fim-2022 (−2,8% no ano; +18,7% em 3 anos). Residencial US$ 287,6 tri (3/4), comercial ~13%, terra agrícola 11%. China 26% e EUA 19% do total. Quase 4× o PIB mundial. Cuidado: NÃO confundir com o volume de INVESTIMENTO imobiliário (Savills reporta US$ 380 BI em H1/2025, não tri) — grandezas distintas.',
  },
  {
    id: 'oxfam-desigualdade',
    nome: 'Relatórios de desigualdade',
    instituicao: 'Oxfam',
    categoria: 'riqueza',
    tipo: 'ong-especializada',
    ano: 'jan/2024',
    urls: [
      {
        rotulo: 'Portal da Oxfam',
        url: 'https://www.oxfam.org/en',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Quem ficou com a riqueza nova criada nos últimos anos.',
    resumoAvancado: 'Base para a captura desproporcional da riqueza nova pelo topo da pirâmide.',
    cobre: ['Participação do Top 1% na riqueza criada desde 2020.'],
    usadoEm: ['src/data/concentration.ts', 'Módulo Riqueza'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar o relatório/página exata quando o número for citado isoladamente.',
  },
  {
    id: 'wid-world',
    nome: 'World Inequality Database',
    instituicao: 'World Inequality Lab',
    categoria: 'riqueza',
    tipo: 'base-oficial',
    ano: 'séries históricas',
    urls: [
      {
        rotulo: 'Portal WID.world',
        url: 'https://wid.world/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'O banco de dados aberto sobre quem tem quanto no mundo.',
    resumoAvancado: 'Base para séries históricas de concentração de renda e riqueza.',
    cobre: ['Séries do Top 1% e faixas de riqueza.'],
    usadoEm: ['src/data/concentration.ts (checagem)', 'Módulo Riqueza'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar país, série e safra exatas quando um ponto passar a citá-la diretamente.',
  },
  {
    id: 'forbes-bilionarios',
    nome: 'Lista de bilionários',
    instituicao: 'Forbes',
    categoria: 'riqueza',
    tipo: 'midia-especializada',
    ano: '2025',
    urls: [
      {
        rotulo: 'Ranking de bilionários da Forbes',
        url: 'https://www.forbes.com/billionaires/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'A lista anual das pessoas mais ricas do planeta.',
    resumoAvancado: 'Proxy jornalístico da concentração extrema; patrimônio listado oscila com o mercado.',
    cobre: ['Número de bilionários e maiores fortunas por ano.'],
    usadoEm: ['src/data/concentration.ts', 'Módulo Riqueza'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar edição/data da lista sempre que um valor for citado isoladamente.',
  },
  {
    id: 'oit-trabalho',
    nome: 'Estatísticas e normas do trabalho',
    instituicao: 'Organização Internacional do Trabalho',
    categoria: 'trabalho',
    tipo: 'base-oficial',
    ano: '2023–2024',
    urls: [
      {
        rotulo: 'ILOSTAT — base de estatísticas do trabalho (portal da OIT)',
        url: 'https://ilostat.ilo.org/data/',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'A agência da ONU para salários, emprego e mortes no trabalho.',
    resumoAvancado: 'Base para salários por país, informalidade e mortalidade ocupacional.',
    cobre: ['Salários médios por país e mortes ligadas ao trabalho.'],
    usadoEm: ['src/data/wages.ts', 'src/data/tour.ts', 'Mapa 2D'],
    verificacao: 'url-incluida',
    observacao:
      'ILOSTAT é a base canônica (300 mi+ de pontos, perfis por país em /data/country-profiles/). Os valores de wages.ts são ordem de grandeza didática: conferir a tabela e a safra específicas de cada país antes de citar como estatística oficial.',
  },
  {
    id: 'gallup-statista-salarios',
    nome: 'Salários — cadeia de dados gratuitos (OIT, OCDE, OWID)',
    instituicao: 'OIT / OCDE / Our World in Data',
    categoria: 'trabalho',
    tipo: 'base-oficial',
    ano: 'séries 1990–2025',
    urls: [
      {
        rotulo: 'ILOSTAT — base de estatísticas do trabalho',
        url: 'https://ilostat.ilo.org/data/',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'OIT — Global Wage Report 2024-25 (PDF)',
        url: 'https://ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@inst/documents/publication/wcms_921154.pdf',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'Our World in Data — Average hourly earnings (série ILO, update 2026-02)',
        url: 'https://ourworldindata.org/grapher/average-hourly-earnings',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'OCDE — Average annual wages (dados abertos SDMX)',
        url: 'https://data-explorer.oecd.org/',
        acessoEm: '2026-09-29',
      },
    ],
    resumoDidatico: 'Quanto ganha uma pessoa em cada país, com dados públicos e gratuitos.',
    resumoAvancado:
      'TROCA DE FONTE (2026-09): a referência anterior era "Gallup / Statista", o que era incorreto — o Gallup mede engajamento e bem-estar no trabalho (State of the Global Workplace), NÃO salário, e o Statista é pago. Substituída por uma cadeia gratuita, citável e com API: ILOSTAT (base canônica, topic wages), OIT Global Wage Report 2024-25 (argumento de escala: crescimento salarial real voltou a positivo em 2023-24 e a desigualdade salarial diminuiu em ~2/3 dos países desde 2000), OWID (série pronta de rendimento médio por hora, base ILO, em dólares internacionais de preços 2021, com metainformação e procedimento de limpeza publicados) e OCDE para países ricos. Para o Brasil, a base é a PNAD Contínua do IBGE. ATENÇÃO METODOLÓGICA: salários não são comparáveis entre plataformas e nem entre países sem PPP — fixar UMA fonte por país.',
    cobre: ['Salários médios por país para o mapa e o painel de renda.'],
    usadoEm: ['src/data/wages.ts', 'Mapa 2D'],
    verificacao: 'url-incluida',
    observacao:
      'Decisão do autor aplicada em 2026-09. A base é a OIT/ILOSTAT; OWID serve de série já filtrada e visualizável. Fixar sempre a mesma fonte por país, converter com PPP e declarar o ano. Para Brasil, preferir PNAD Contínua (IBGE). Os valores em wages.ts seguem sendo ordem de grandeza didática até que a safra por país seja conferida.',
  },
  {
    id: 'comex-mdic',
    nome: 'Comex Stat',
    instituicao: 'Ministério do Desenvolvimento, Indústria, Comércio e Serviços',
    categoria: 'comercio',
    tipo: 'base-oficial',
    ano: '2024; parcial jan–jul/2025',
    urls: [
      {
        rotulo: 'Comex Stat — estatísticas de comércio exterior (MDIC)',
        url: 'https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas',
        acessoEm: '2026-09-28',
      },
      {
        rotulo: 'API oficial do Comex Stat (documentação)',
        url: 'https://api-comexstat.mdic.gov.br/docs',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'O que cada estado brasileiro exporta e para onde vai.',
    resumoAvancado: 'Base para exportações por UF, destinos e pauta de produtos.',
    cobre: ['Exportações brasileiras por estado, destino e produto.'],
    usadoEm: ['src/data/flows.ts', 'src/data/brazil.ts', 'Mapa 2D'],
    verificacao: 'url-incluida',
    observacao:
      'Portal e API oficial verificados (dados abertos em CSV por NCM/UF/URF). Continua valendo a regra: distinguir SEMPRE valor anual de valor parcial jan–jul/2025 e registrar a consulta exata — a safra parcial não pode ser somada a um ano fechado.',
  },
  {
    id: 'alfandegas-estatisticas-nacionais',
    nome: 'Alfândegas e institutos nacionais de estatística',
    instituicao: 'GACC, US Census, Eurostat, INEGI, Destatis e congêneres',
    categoria: 'comercio',
    tipo: 'base-oficial',
    ano: '2024',
    urls: [
      {
        rotulo: 'US Census — International Trade Data',
        url: 'https://www.census.gov/foreign-trade/data/index.html',
        acessoEm: '2026-10-02',
      },
      {
        rotulo: 'Eurostat — International trade in goods (Comext)',
        url: 'https://ec.europa.eu/eurostat/web/international-trade-in-goods/database',
        acessoEm: '2026-10-02',
      },
    ],
    resumoDidatico: 'Os registros oficiais de importação e exportação de cada país.',
    resumoAvancado: 'Base para rotas comerciais bilaterais e cadeias produtivas.',
    cobre: ['Comércio bilateral e setorial usado nos fluxos do mapa.'],
    usadoEm: ['src/data/flows.ts', 'Mapa 2D'],
    verificacao: 'url-incluida',
    observacao: 'VERIFICADO: Census e Eurostat/Comext oferecem séries por parceiro, produto, fluxo e período. O registro funciona como fonte-guarda-chuva; cada valor isolado continua devendo declarar órgão, tabela/dataset, período e unidade no próprio fluxo.',
  },
  {
    id: 'zucman-tjn-paraísos',
    nome: 'Pesquisas sobre lucros deslocados e riqueza oculta',
    instituicao: 'Gabriel Zucman / Tax Justice Network',
    categoria: 'comercio',
    tipo: 'academica',
    ano: '2024',
    urls: [
      {
        rotulo: 'The State of Tax Justice 2024 — Tax Justice Network',
        url: 'https://taxjustice.net/reports/the-state-of-tax-justice-2024',
        acessoEm: '2026-09-28',
      },
      {
        rotulo: 'Relatório completo (PDF)',
        url: 'https://taxjustice.net/wp-content/uploads/2024/11/State-of-Tax-Justice-2024-English-Tax-Justice-Network.pdf',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'Estudos que estimam quanto lucro some nos paraísos fiscais.',
    resumoAvancado: 'Base para Missing Profits, Hidden Wealth e rotas de capital fantasma.',
    cobre: ['Estimativas de lucros deslocados e fluxos para paraísos fiscais.'],
    usadoEm: ['src/data/flows.ts', 'Mapa 2D'],
    verificacao: 'url-incluida',
    observacao:
      'VERIFICADO (State of Tax Justice 2024): países perdem US$ 492 bi/ano por abuso tributário global — dos quais US$ 347,6 bi por deslocamento de lucro de multinacionais e US$ 144,8 bi por offshore de indivíduos ricos. O relatório Working Paper 18 de 2024 estima lucro deslocado de ~US$ 1,13 tri em 2021. CUIDADO COM A UNIDADE: são trilhões de LUCRO DESLOCADO, e bilhões de ARRECADAÇÃO PERDIDA — não confundir. 43% das perdas vêm dos 8 países que vetaram a convenção da ONU em ago/2024 (EUA, Reino Unido, Japão, Canadá, Austrália, Israel, Nova Zelândia, Coreia do Sul). Sempre apresentar como ESTIMATIVA, nunca como arrecadação oficial.',
  },
  {
    id: 'us-treasury-tic',
    nome: 'Treasury International Capital',
    instituicao: 'U.S. Department of the Treasury',
    categoria: 'moeda',
    tipo: 'base-oficial',
    ano: '2024',
    urls: [
      {
        rotulo: 'Treasury International Capital (TIC) — portal oficial',
        url: 'https://home.treasury.gov/data/treasury-international-capital-tic-system',
        acessoEm: '2026-10-02',
      },
      {
        rotulo: 'TIC — holdings anuais de títulos por país',
        url: 'https://home.treasury.gov/data/treasury-international-capital-tic-system/tic-forms-instructions/us-claims-on-foreigners-from-holdings-of-foreign-securities',
        acessoEm: '2026-10-02',
      },
    ],
    resumoDidatico: 'Quem compra e vende títulos e dólares dos EUA no mundo.',
    resumoAvancado: 'Base para liquidez do dólar e detenção estrangeira de Treasuries.',
    cobre: ['Fluxos de capitais e títulos do Tesouro dos EUA.'],
    usadoEm: ['src/data/flows.ts', 'Mapa 2D'],
    verificacao: 'url-incluida',
    observacao: 'VERIFICADO: o TIC publica transações mensais e holdings mensais/anuais, incluindo Major Foreign Holders of Treasury Securities. Para números de estoque, registrar a data de referência; para fluxo, registrar o mês/período — não misturar estoque e transação.',
  },
  {
    id: 'pboc-cips',
    nome: 'Banco Popular da China e pagamentos em yuan',
    instituicao: 'People’s Bank of China',
    categoria: 'moeda',
    tipo: 'base-oficial',
    ano: '2024',
    urls: [
      {
        rotulo: 'PBoC — RMB Internationalization Reports',
        url: 'https://www.pbc.gov.cn/en/3688241/3688636/3828468/index.html',
        acessoEm: '2026-10-02',
      },
      {
        rotulo: 'CIPS — retrospectiva operacional de 2024',
        url: 'https://www.cips.com.cn/kjjqgs/2025-01/15/article_2026071719450899636.shtml',
        acessoEm: '2026-10-02',
      },
    ],
    resumoDidatico: 'Como a China tenta fazer comércio sem depender do dólar.',
    resumoAvancado: 'Base para CIPS, liquidação em yuan e infraestrutura alternativa ao SWIFT.',
    cobre: ['Comércio Rússia–China em moedas locais e pagamentos em yuan.'],
    usadoEm: ['src/data/flows.ts', 'Mapa 2D'],
    verificacao: 'url-incluida',
    observacao: 'VERIFICADO: o PBoC mantém a série anual de internacionalização do RMB e o CIPS publica estatísticas operacionais/participantes. Percentuais de comércio em moedas locais exigem a fonte bilateral correspondente; CIPS mede infraestrutura de pagamento, não participação do dólar por si só.',
  },
  {
    id: 'sipri-milex',
    nome: 'Military Expenditure Database',
    instituicao: 'Stockholm International Peace Research Institute',
    categoria: 'guerra',
    tipo: 'fonte-primaria',
    ano: '2024',
    urls: [
      {
        rotulo: 'Base de gasto militar do SIPRI',
        url: 'https://www.sipri.org/databases/milex',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Quanto cada país gasta com exércitos e armas.',
    resumoAvancado: 'Base para militarização como saída da sobreacumulação do complexo bélico-industrial.',
    cobre: ['Gasto militar global e por país.'],
    usadoEm: ['src/data/indicators.ts', 'src/data/wars.ts', 'Indicadores Globais', 'War Room'],
    verificacao: 'url-incluida',
  },
  {
    id: 'costs-of-war',
    nome: 'Costs of War',
    instituicao: 'Brown University',
    categoria: 'guerra',
    tipo: 'academica',
    ano: '2001–2024',
    urls: [
      {
        rotulo: 'Projeto Costs of War',
        url: 'https://costsofwar.watson.brown.edu/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Quanto as guerras dos EUA realmente custaram, incluindo veteranos.',
    resumoAvancado: 'Base para custos diretos, apropriados e projetados das guerras pós-2001.',
    cobre: ['Custos das guerras do Afeganistão, Iraque e guerra ao terror.'],
    usadoEm: ['src/data/wars.ts', 'War Room'],
    verificacao: 'url-incluida',
    observacao: 'Separar custo direto de custo projetado com veteranos até 2050.',
  },
  {
    id: 'crs-gao-guerra',
    nome: 'Fiscalização e apropriações de guerra dos EUA',
    instituicao: 'Congressional Research Service / Government Accountability Office',
    categoria: 'guerra',
    tipo: 'base-oficial',
    ano: '2024',
    urls: [
      {
        rotulo: 'Portal do GAO',
        url: 'https://www.gao.gov/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Os auditores e pesquisadores do Congresso dos EUA.',
    resumoAvancado: 'Base para ajuda militar apropriada, contratos e reembolsos de coalizão.',
    cobre: ['Ajuda militar, contratos sem licitação e custos de coalizão.'],
    usadoEm: ['src/data/wars.ts', 'War Room'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar relatório/número e data exatos quando um valor for citado isoladamente.',
  },
  {
    id: 'edis-ue',
    nome: 'Estratégia industrial de defesa da União Europeia',
    instituicao: 'Comissão Europeia',
    categoria: 'guerra',
    tipo: 'base-oficial',
    ano: '2024',
    urls: [
      {
        rotulo: 'Comissão Europeia — European Defence Industrial Strategy (5 mar 2024)',
        url: 'https://commission.europa.eu/news-and-media/news/first-ever-european-defence-industrial-strategy-enhance-europes-readiness-and-security-2024-03-05_en',
        acessoEm: '2026-10-02',
      },
      {
        rotulo: 'Comissão Europeia — ASAP e capacidade de munição',
        url: 'https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/story-von-der-leyen-commission/solidarity-ukraine_en',
        acessoEm: '2026-10-02',
      },
    ],
    resumoDidatico: 'A meta europeia de produzir munição e armas em casa.',
    resumoAvancado: 'Base para militarização europeia e metas de produção de projéteis.',
    cobre: ['Meta de produção de projéteis e gasto militar europeu.'],
    usadoEm: ['src/data/wars.ts', 'War Room'],
    verificacao: 'url-incluida',
    observacao: 'VERIFICADO: a EDIS foi apresentada em 5/3/2024 e fixa metas de compras conjuntas/europeias até 2030; a meta de capacidade de 2 milhões de munições/ano até o fim de 2025 aparece no programa ASAP. Não atribuir a meta de munições à EDIS quando a fonte específica é o ASAP.',
  },
  {
    id: 'nist-chips',
    nome: 'CHIPS for America e liderança em lógica de ponta',
    instituicao: 'National Institute of Standards and Technology',
    categoria: 'guerra',
    tipo: 'fonte-primaria',
    ano: '2024',
    urls: [
      {
        rotulo: 'Comunicado do NIST sobre TSMC e CHIPS Act',
        url: 'https://www.nist.gov/news-events/news/2024/04/biden-harris-administration-announces-preliminary-terms-tsmc-expanded',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'O governo dos EUA diz que a TSMC faz mais de 90% dos chips lógicos de ponta.',
    resumoAvancado: 'Base oficial para o “escudo de silício” como gargalo do capital constante avançado.',
    cobre: ['Concentração da lógica de ponta na TSMC e política industrial de chips.'],
    usadoEm: ['src/data/indicators.ts', 'src/data/wars.ts', 'Mapa 2D', 'Globo 3D'],
    verificacao: 'url-incluida',
    observacao: 'A formulação canônica é “leading-edge logic chips”, não um nó nanométrico único.',
  },
  {
    id: 'bis-doc-export-controls',
    nome: 'Controles de exportação de semicondutores',
    instituicao: 'Bureau of Industry and Security / U.S. Department of Commerce',
    categoria: 'guerra',
    tipo: 'base-oficial',
    ano: '2022–2024',
    urls: [
      {
        rotulo: 'BIS — pacote de controles de 2 dez 2024',
        url: 'https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military',
        acessoEm: '2026-10-02',
      },
      {
        rotulo: 'Federal Register — 89 FR 96790 (regra AJ74)',
        url: 'https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf',
        acessoEm: '2026-10-02',
      },
    ],
    resumoDidatico: 'As regras dos EUA que tentam travar os chips avançados da China.',
    resumoAvancado: 'Base para export controls sobre EUV, foundry avançada e chips de IA.',
    cobre: ['Regime de controles sobre chips/EUV e guerra tecnológica.'],
    usadoEm: ['src/data/wars.ts', 'War Room'],
    verificacao: 'url-incluida',
    observacao: 'VERIFICADO: regra 89 FR 96790, efetiva em 2/12/2024, adicionou controles sobre equipamentos de fabricação, HBM, software/tecnologia e regras FDP; o comunicado BIS resume 24 tipos de equipamentos, 3 tipos de software e mudanças na Entity List. Medidas futuras devem ser versionadas separadamente.',
  },
  {
    id: 'orcamento-uniao',
    nome: 'Orçamento da União',
    instituicao: 'Governo Federal do Brasil',
    categoria: 'fiscal-br',
    tipo: 'base-oficial',
    ano: 'LOA 2025',
    urls: [
      {
        rotulo: 'MPO — Orçamento Cidadão 2025',
        url: 'https://www.gov.br/planejamento/pt-br/assuntos/orcamento/orcamento-cidadao/orcamento-cidadao-2025',
        acessoEm: '2026-10-02',
      },
      {
        rotulo: 'MPO — Lei Orçamentária Anual 2025',
        url: 'https://www.gov.br/planejamento/pt-br/assuntos/orcamento/orcamentos-anuais/2025/loa/lei-orcamentaria-anual-loa-2025',
        acessoEm: '2026-10-02',
      },
      {
        rotulo: 'MPO — Painel do Orçamento Federal / SIOP',
        url: 'https://www.gov.br/planejamento/pt-br/acesso-a-informacao/transparencia-e-prestacao-de-contas/mpo-transparente/orcamento',
        acessoEm: '2026-10-02',
      },
    ],
    resumoDidatico: 'Para onde vai cada R$100 do orçamento federal.',
    resumoAvancado: 'Base do painel orçamentário; distinguir despesa primária, financeira e rolagem.',
    cobre: ['Juros, amortizações, saúde, educação, assistência e infraestrutura.'],
    usadoEm: ['src/data/debt.ts', 'Módulo Dívida'],
    verificacao: 'url-incluida',
    observacao: 'VERIFICADO para LOA 2025: o Orçamento Cidadão separa despesas primárias e financeiras e o SIOP permite consultar a execução. O app deve rotular claramente LOA (autorização) versus execução e nunca tratar rolagem/amortização da dívida como se fosse despesa primária comparável a saúde ou educação.',
  },
  {
    id: 'ibpt-millenium-fiscal',
    nome: 'Transferência fiscal interestadual — estimativas em disputa',
    instituicao: 'debate público (sem fonte institucional única)',
    categoria: 'fiscal-br',
    tipo: 'metodologia-interna',
    ano: 'estimativas disputadas',
    urls: [
      {
        rotulo: 'Receita Federal — dados de transferências e repartição da receita federal',
        url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/2024/novembro/receita-federal-|-transferencias',
        acessoEm: '2026-09-29',
      },
    ],
    resumoDidatico: 'Quem paga mais imposto acaba recebendo menos de volta. Está no debate, mas a conta exata é disputada.',
    resumoAvancado: 'NÃO HÁ FONTE INSTITUCIONAL ÚNICA: nem o IBPT nem o Instituto Millenium publicam esse cálculo (verificado em seus portais em 2026-09). O número "≈ R$ 150–250 bi/ano" é widely citado no debate e usado como ordem de grandeza, sem autor institucional verificável. O que é reproduzível e oficial: as transferências constitucionais publicadas pela Tesouro Nacional (SIAFI/API) e os cruzamentos Receita Federal + CGU de 2022, que mostram concentração forte — São Paulo pagou R$ 830 bi e recebeu R$ 59 bi (≈ R$ 0,07 por real), contra Amapá em R$ 3,97 por real.',
    cobre: ['Transferência fiscal interna em fluxos do modo Brasil (como ordem de grandeza, não estatística).'],
    usadoEm: ['src/data/brazil.ts', 'Mapa 2D'],
    estimate: true,
    verificacao: 'url-incluida',
    observacao:
      'DECISÃO DO AUTOR (2026-09): manter o intervalo "≈ R$ 150–250 bi/ano" como estimativa didática de debate, mas sem atribuir autoria a instituição que não publica o cálculo. Ao citar, dizer explicitamente que é ordem de grandeza em disputa. A única base oficial e reproduzível é a API de transferências constitucionais da STN (alimentada pelo SIAFI) — usar isso quando for necessário um número fechado.',
  },
  {
    id: 'relatorios-anuais-empresas',
    nome: 'Relatórios anuais e registros de mercado',
    instituicao: 'SEC / CVM / B3',
    categoria: 'empresas',
    tipo: 'relatorio-anual',
    ano: 'FY2024–2025',
    urls: [
      {
        rotulo: 'Busca de documentos na SEC',
        url: 'https://www.sec.gov/search-filings',
        acessoEm: '2026-09-13',
      },
      {
        rotulo: 'Portal da CVM',
        url: 'https://www.gov.br/cvm/pt-br',
        acessoEm: '2026-09-13',
      },
      {
        rotulo: 'Portal da B3',
        url: 'https://www.b3.com.br/pt_br/para-voce',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Os documentos oficiais onde cada empresa conta receita, lucro e funcionários.',
    resumoAvancado: 'Base para receita, lucro líquido, quadro de pessoal e dividendos do Raio-X.',
    cobre: ['Fundamentos corporativos usados na decomposição W = c + v + m.'],
    usadoEm: ['src/data/companies.ts', 'Raio-X de Empresas'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar formulário/relatório e data por empresa quando um número for citado isoladamente.',
  },
  {
    id: 'ilaese-anuario',
    nome: 'Anuário Estatístico — referência metodológica',
    instituicao: 'ILAESE',
    categoria: 'empresas',
    tipo: 'anuario',
    ano: 'edição 2025/26 (referência de formato)',
    urls: [
      {
        rotulo: 'ILAESE — Ranking geral Brasil, setor privado (PDF público)',
        url: 'https://ilaese.org.br/wp-content/uploads/2026/02/RankingGeralBrasilSetorPrivado-1.pdf',
        acessoEm: '2026-09-29',
      },
    ],
    resumoDidatico: 'O anuário que inspirou o formato do Raio-X: medir exploração a partir da jornada de trabalho.',
    resumoAvancado:
      'REFERÊNCIA METODOLÓGICA, NÃO FONTE DE NÚMEROS DESTE APP. O anuário do ILAESE é vendido em exemplar físico e e-book; a única publicação gratuita é o PDF do ranking. A metodologia que este app replica é a tradução da jornada em horas de trabalho não pago: m/(m+v) da jornada de 8h. A nota metodológica do próprio ILAESE é preservada aqui como ressalva: o excedente é redistribuído entre setores via preços, logo taxa de exploração não equivale a produtividade interna. Os números exibidos no Raio-X vêm de demonstrações financeiras (DFs) e NÃO deste anuário.',
    cobre: ['Formato do Raio-X brasileiro e a métrica de horas não pagas.'],
    usadoEm: ['src/data/companies.ts', 'Raio-X de Empresas (só formato)'],
    verificacao: 'fonte-declarada',
    observacao:
      'DECISÃO DO AUTOR (2026-09): manter apenas como referência metodológica, sem citar números do anuário. A edição corrente é 2025/26. O PDF público do ranking traz um número isolado (COMGÁS nº 1 em 2024, 7h44 não pagas em 8h), mas optou-se por não usá-lo para evitar qualquer alegação de licenciamento. Em compensação, os números de produtividade/exploração do app devem sempre apontar para as DFs das empresas (fonte: relatorios-anuais-empresas).',
  },
  {
    id: 'market-data-apis',
    nome: 'Provedores dinâmicos de cotações e fundamentos',
    instituicao: 'BRAPI / Alpha Vantage',
    categoria: 'empresas',
    tipo: 'portal-oficial',
    ano: 'limites verificados 2026-09',
    urls: [
      {
        rotulo: 'BRAPI — planos e limitações do plano gratuito',
        url: 'https://brapi.dev/faq/api-e-gratis-mesmo',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'BRAPI — limites de requisições',
        url: 'https://brapi.dev/faq/tem-algum-limite',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'Alpha Vantage — suporte e limites',
        url: 'https://www.alphavantage.co/support',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'Alpha Vantage — documentação',
        url: 'https://www.alphavantage.co/documentation',
        acessoEm: '2026-09-29',
      },
    ],
    resumoDidatico: 'Cotações opcionais que atualizam empresas na página do Raio-X.',
    resumoAvancado: 'Camada dinâmica opt-in; registros recebem origem API e badge de estimativa. BRAPI (B3, em R$): plano gratuito = 15.000 requisições/mês, 1 ação por requisição, delay ~30 min, histórico de 3 meses, sem dividendos; Startup R$ 59,99 = 150k/mês e 10 ações/req; Pro R$ 99,99 = 500k/mês e 20 ações/req. Alpha Vantage (EUA/global): 25 requisições/dia e 5/min no plano gratuito, com isenção declarada para projetos open-source ou educacionais verificados.',
    cobre: ['Cotações, capitalização e fundamentos dinâmicos.'],
    usadoEm: ['src/lib/marketApi/*', 'Raio-X de Empresas'],
    estimate: true,
    verificacao: 'url-incluida',
    observacao:
      'Limites conferidos na documentação oficial E medidos na prática em 2026-09-29. ACHADO IMPORTANTE — a doc e o comportamento real divergem: sem token, respondem APENAS 4 tickers (PETR4, VALE3, ITUB4, MGLU3); qualquer outro, inclusive USD-BRL, devolve MISSING_TOKEN mesmo em requisição isolada. O código anterior enviava ~128 tickers de uma vez e falhava com 401 para todo visitante sem token. brapi.ts foi corrigido: sem token, sincroniza só as 4 isentas; com token, fatia o universo em lotes de 20 (teto do plano Pro; Startup aceita 10). Testado de ponta a ponta contra a API real: 4 cotações em 352 ms. Como o câmbio exige token, sem ele as caps chegam em BRL e o app sinaliza que não converteu.',
  },
  {
    id: 'ibge',
    nome: 'Portal do IBGE',
    instituicao: 'Instituto Brasileiro de Geografia e Estatística',
    categoria: 'brasil',
    tipo: 'base-oficial',
    ano: 'portal contínuo',
    urls: [
      {
        rotulo: 'Portal do IBGE',
        url: 'https://www.ibge.gov.br/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'O retrato oficial do Brasil: gente, trabalho e produção.',
    resumoAvancado: 'Base para desindustrialização, mercado de trabalho e contas nacionais.',
    cobre: ['Indústria no PIB, mercado de trabalho e contas brasileiras.'],
    usadoEm: ['src/data/countries.ts', 'src/data/theory.ts', 'src/data/alternatives.ts (checagem)'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar pesquisa, tabela e ano sempre que um número passar a citá-lo diretamente.',
  },
  {
    id: 'marx-capital',
    nome: 'O Capital',
    instituicao: 'Karl Marx',
    categoria: 'teoria',
    tipo: 'academica',
    ano: '1867',
    urls: [],
    resumoDidatico: 'O livro que explica de onde sai o lucro: do trabalho não pago.',
    resumoAvancado: 'Fundamento de valor, mais-valia, composição orgânica e capital fictício.',
    cobre: ['Categorias c, v, m e teoria das crises.'],
    usadoEm: ['THEORY.md', 'Circuito do Capital', 'Glossário'],
    verificacao: 'fonte-declarada',
  },
  {
    id: 'heterodox-macro',
    nome: 'Macroeconomia heterodoxa',
    instituicao: 'Keynes / Kalecki / Minsky',
    categoria: 'teoria',
    tipo: 'academica',
    ano: '1936–1986',
    urls: [],
    resumoDidatico: 'A escola que diz: quem gasta primeiro cria a renda depois.',
    resumoAvancado: 'Demanda efetiva, equação dos lucros, incerteza e instabilidade financeira.',
    cobre: ['Demanda efetiva, lucros kaleckianos e fragilidade financeira.'],
    usadoEm: ['THEORY.md', 'Módulo Dívida', 'Circuito do Capital'],
    verificacao: 'fonte-declarada',
  },
  {
    id: 'mmt-literatura',
    nome: 'Literatura da Teoria Monetária Moderna',
    instituicao: 'Wray / Mosler / Kelton e seguidores',
    categoria: 'teoria',
    tipo: 'academica',
    ano: '1998–2020',
    urls: [],
    resumoDidatico: 'A teoria que explica por que país com moeda própria não “quebra” como uma família.',
    resumoAvancado: 'Soberania monetária, impostos como destruição de moeda e restrição real pela inflação.',
    cobre: ['Moeda soberana, dívida pública e restrição inflacionária.'],
    usadoEm: ['THEORY.md', 'Módulo Dívida', 'Painel MMT'],
    verificacao: 'fonte-declarada',
  },
  {
    id: 'tmd-literatura',
    nome: 'Teoria Marxista da Dependência',
    instituicao: 'Marini / Dos Santos / Bambirra',
    categoria: 'teoria',
    tipo: 'academica',
    ano: '1969–1978',
    urls: [],
    resumoDidatico: 'A teoria que explica por que a periferia trabalha mais e fica com menos.',
    resumoAvancado: 'Troca desigual, superexploração e transferência de valor para o centro.',
    cobre: ['Dependência, superexploração e vazamento Sul–Norte.'],
    usadoEm: ['THEORY.md', 'Drawer de blocos', 'Mapa 2D'],
    verificacao: 'fonte-declarada',
  },
  {
    id: 'wikipedia-contexto',
    nome: 'Wikipédia em português',
    instituicao: 'Wikimedia Foundation',
    categoria: 'teoria',
    tipo: 'enciclopedia',
    ano: 'consulta contínua',
    urls: [
      {
        rotulo: 'Página inicial da Wikipédia',
        url: 'https://pt.wikipedia.org/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'Um ponto de partida rápido para entender nomes, datas e conceitos.',
    resumoAvancado: 'Fonte terciária para contexto não controverso; nunca fonte única de número contestado.',
    cobre: ['Checagem inicial de contexto histórico e conceitual.'],
    usadoEm: ['checagem editorial'],
    verificacao: 'fonte-declarada',
    observacao: 'Exigir fonte primária ou acadêmica para números, vítimas, guerras e teses centrais.',
  },
  {
    id: 'ica-wcm',
    nome: 'World Cooperative Monitor',
    instituicao: 'International Cooperative Alliance',
    categoria: 'alternativas',
    tipo: 'anuario',
    ano: '2025',
    urls: [
      {
        rotulo: 'Portal da Aliança Cooperativa Internacional',
        url: 'https://ica.coop/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'O ranking mundial das maiores cooperativas do planeta.',
    resumoAvancado: 'Base para escala econômica do cooperativismo mundial.',
    cobre: ['Faturamento e escala das maiores cooperativas.'],
    usadoEm: ['src/data/alternatives.ts', 'Módulo Alternativas'],
    verificacao: 'fonte-declarada',
    observacao: 'Registrar edição/página exata quando o número for citado isoladamente.',
  },
  {
    id: 'mondragon-casos',
    nome: 'Casos de cooperativas e produção entre pares',
    instituicao: 'Mondragon e instituições dos casos',
    categoria: 'alternativas',
    tipo: 'base-oficial',
    ano: 'safra por caso · Mondragon 2024/2025',
    urls: [
      {
        rotulo: 'Informe anual 2024 — Mondragon Corporation (PDF)',
        url: 'https://www.mondragon-corporation.com/people/site/assets/files/103207/informe-anual-2024.pdf',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'Empresas sem patrão, cidades com orçamento popular e remédios abertos.',
    resumoAvancado: 'Base empírica para pluralismo institucional e planejamento democrático.',
    cobre: ['Mondragon, Emília-Romanha, Kerala, Wikipédia, SUS e afins.'],
    usadoEm: ['src/data/alternatives.ts', 'Módulo Alternativas'],
    verificacao: 'url-incluida',
    observacao:
      'VERIFICADO para Mondragon: FY2024 — vendas € 11.213 bi, 70.085 trabalhadores (média), € 376,8 mi investidos, € 1.661 bi de EBITDA; lucro € 632 mi. FY2025: vendas € 11,3 bi, 71.400+ trabalhadores, lucro € 618,8 mi, 1.300 empregos novos — maior empregador do País Basco, 2º de Navarra, 5º do setor privado na Espanha. Os demais casos (Emília-Romanha, Kerala, Wikipédia, SUS) continuam SEM fonte verificada: precisam de fonte e ano individuais. Atenção: €11 bi ≈ US$12 bi, NÃO US$120 bi.',
  },
  {
    id: 'ostrom-commons',
    nome: 'Governo dos bens comuns',
    instituicao: 'Elinor Ostrom / Nobel de Economia',
    categoria: 'alternativas',
    tipo: 'academica',
    ano: '1990–2009',
    urls: [],
    resumoDidatico: 'A prova de que comunidades podem cuidar de recursos sem patrão.',
    resumoAvancado: 'Base para gestão comunitária de commons além do dilema mercado–Estado.',
    cobre: ['Princípios de governança de bens comuns.'],
    usadoEm: ['src/data/alternatives.ts', 'Módulo Alternativas'],
    verificacao: 'fonte-declarada',
  },
  {
    id: 'un-habitat-orcamento',
    nome: 'Democracia fiscal e orçamento participativo',
    instituicao: 'UN-Habitat e governos locais',
    categoria: 'alternativas',
    tipo: 'base-oficial',
    ano: 'safra por caso · base UN-Habitat 2020',
    urls: [
      {
        rotulo: 'UN-Habitat — Participatory Budgeting e os ODS (Escobedo, México)',
        url: 'http://unhabitat.org/exploring-the-role-of-participatory-budgeting-in-accelerating-the-sdgs-a-multidimensional-approach',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'Quando a população decide onde o dinheiro da cidade vai.',
    resumoAvancado: 'Base para democracia fiscal e planejamento participativo.',
    cobre: ['Orçamento participativo e gestão urbana democrática.'],
    usadoEm: ['src/data/alternatives.ts', 'Módulo Alternativas'],
    verificacao: 'url-incluida',
    observacao:
      'VERIFICADO: a base canônica da UN-Habitat é de 2020 (Escobedo, México) e estima que o orçamento participativo alcançou MAIS DE 3.000 instituições locais e algumas supramunicipais — número de alcance, não deojo. IMPORTANTE: a fonte é de 2020 e é um caso específico; se o app citar Porto Alegre, Belo Horizonte ou Nova Iorque, cada um precisa de fonte e ano PRÓPRIOS (não reaproveitar esta). Dado antigo: 6 anos até a safra atual.',
  },
  {
    id: 'afl-cio-pay-ratios',
    nome: 'Razões salariais entre executivos e trabalhadores',
    instituicao: 'AFL-CIO',
    categoria: 'alternativas',
    tipo: 'ong-especializada',
    ano: '2024 (dados FY2024) · série atualizada',
    urls: [
      {
        rotulo: 'Executive Paywatch — razões CEO/trabalhador (S&P 500)',
        url: 'https://aflcio.org/paywatch',
        acessoEm: '2026-09-28',
      },
      {
        rotulo: 'Comunicado — Principais CEOs GANharam 285× o salário do trabalhador (2024)',
        url: 'https://aflcio.org/press/releases/new-afl-cio-report-nations-top-ceos-made-285-times-workers-pay-2024',
        acessoEm: '2026-09-28',
      },
    ],
    resumoDidatico: 'Quantas vezes o chefão ganha mais do que o funcionário comum.',
    resumoAvancado: 'Base para desigualdade salarial intra-firma e financeirização da gestão.',
    cobre: ['Pay ratios e tetos salariais em cooperativas e corporações.'],
    usadoEm: ['src/data/alternatives.ts', 'Módulo Alternativas'],
    verificacao: 'url-incluida',
    observacao:
      'VERIFICADO: média S&P 500 = 285:1 em 2024 (era 268:1 em 2023); edição 2025 reporta 5.387:1 — a série varia muito conforme o ano e o recorte, então citar SEMPRE com o ano junto. Composição Setorial 2025: Manufacturing 11.139:1 (distorcido por Musk/Tesla), Retail 564:1, Finance 312:1, Utilities 105:1. Recomenda-se usar a razão por setor, não a média geral, para evitar outliers.',
  },
  {
    id: 'vitimas-pesquisa-historica',
    nome: 'Pesquisas sobre fome, colonialismo e guerras',
    instituicao: 'Patnaik / Davis / Hickel / Sen e historiografia',
    categoria: 'impactos',
    tipo: 'academica',
    ano: '2000–2026',
    urls: [
      {
        rotulo: 'Utsa Patnaik — The Republic of Hunger (conferência SAHMAT, Nova Deli, 2004, PDF)',
        url: 'https://macroscan.org/fet/apr04/pdf/Rep_Hun.pdf',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'Mike Davis — Late Victorian Holocausts (Verso, 2000)',
        url: 'https://www.versobooks.com/products/308-late-victorian-holocausts',
        acessoEm: '2026-09-29',
      },
    ],
    resumoDidatico: 'Pesquisas que tentam contar quantas vidas o colonialismo e as guerras custaram.',
    resumoAvancado:
      'NÚMERO VERIFICADO (Patnaik 2004, PDF lido na íntegra): mais de 4 milhões de mortes em excesso na Rússia até 1996 pelo método do próprio autor; taxa de morte entre adultos aptos subiu de 49 para 58 por mil (1990-92) e para 84 por mil (1994); expectativa de vida masculina na Rússia caiu 5,9 anos; PIB real de 1995 abaixo do de 1985 em −45% (Rússia), −54% (Ucrânia) e −82% (Geórgia), com fonte UNDP 1998/2000 no mesmo documento. REGRA: estimadores divergem e NUNCA devem ser fundidos — sempre citar autor e ano junto. O intervalo de 4 milhões é a estimativa do autor, não consenso.',
    cobre: ['Mortes coloniais, fomes e guerras do módulo Consequências.'],
    usadoEm: ['src/data/consequences.ts', 'Módulo Consequências'],
    verificacao: 'url-incluida',
    observacao:
      'Aplicada a recomendação padrão da auditoria (2026-09). Patnaik 2004 e Davis 2000 verificados um a um e citáveis. Hickel aparece no conjunto de autores, mas a edição do Global Justice Report ainda deve ser conferida separadamente antes de citar número dele. Preservar intervalos e autores; nunca fundir estimativas incompatíveis.',
  },
  {
    id: 'intervencoes-registros',
    nome: 'Coup d\'Etat Project — registro de golpes e intervenções',
    instituicao: 'Cline Center for the Study of Dangerous Ideas (Universidade de Illinois)',
    categoria: 'impactos',
    tipo: 'academica',
    ano: '1945–2026 (dataset v2.2.2)',
    urls: [
      {
        rotulo: 'Coup d\'Etat Project — página institucional e dataset',
        url: 'https://clinecenter.illinois.edu/project/research-themes/democracy-and-development/coup-detat-project',
        acessoEm: '2026-09-29',
      },
    ],
    resumoDidatico: 'Quantas vezes houve golpe ou tentativa de golpe no mundo — e como isso atrasa um país.',
    resumoAvancado:
      'NÚMERO VERIFICADO (Cline Center, dataset v2.2.2): 1.161 eventos entre 1945 e o início de 2026 — 472 golpes consumados, 408 tentativas e 281 conspirações. O dataset tem DOI 10.13012/B2IDB-9651987_V10 e codebook de 18 páginas, que descreve o tipo de ator iniciador e o destino do executivo deposto (morto, ferido, exilado). CRITÉRIO DE CONTAGEM: o número é sempre desagregado nas três categorias acima; nunca somar. Séries de conferência para comparabilidade histórica: Powell e Thyne, "Global Instances of Coups from 1950 to 2010" (Journal of Peace Research 48(2), 2011) e Marshall, "Coups d\'Etat 1946-2021" (Systemic Peace, 2022).',
    cobre: ['Intervenções, golpes e operações por país.'],
    usadoEm: ['src/data/affected.ts', 'Mapa de Afetados'],
    verificacao: 'url-incluida',
    observacao:
      'Aplicada a recomendação padrão da auditoria (2026-09): o Cline Center é a fonte primária com total desagregável por tipo de evento, com DOI e codebook. ALERTA QUE DEVE PERMANECER: o Cline Center declara publicamente que NÃO fez e NÃO publica estudo algum de 300+ golpes com participação do governo dos EUA, apesar de circulação de desinformação equivalente em mídia em espanhol — se o módulo citar números de intervenção, o critério tem de ser o do dataset, não manchetes. Fixar o critério de contagem antes de citar qualquer total por país.',
  },
  {
    id: 'desastres-corporativos',
    nome: 'Desastres corporativos — camadas documentais (ILOSTAT, AEAT, CSB, EJAtlas)',
    instituicao: 'OIT / AEAT-Previdência / US CSB / EJAtlas',
    categoria: 'impactos',
    tipo: 'base-oficial',
    ano: '2024–2026 (por caso)',
    urls: [
      {
        rotulo: 'ILOSTAT — segurança e saúde no trabalho (base OSH, indicador SDG 8.8.1)',
        url: 'https://ilostat.ilo.org/topics/safety-and-health-at-work/',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'AEAT/Previdência — Estatísticas de Acidentes de Trabalho (Brasil, dados abertos)',
        url: 'https://www.gov.br/previdencia/pt-br/assuntos/previdencia-social/estatisticas',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'US Chemical Safety and Hazard Investigation Board — relatórios de investigação',
        url: 'https://www.csb.gov/',
        acessoEm: '2026-09-29',
      },
      {
        rotulo: 'EJAtlas — atlas de conflitos socioambientais ligados a empresas',
        url: 'https://ejatlas.org/',
        acessoEm: '2026-09-29',
      },
    ],
    resumoDidatico: 'Quando fábricas, minas e remédios matam ou adoecem milhares.',
    resumoAvancado:
      'ESTRUTURA EM 4 CAMADAS, sem dupla contagem. (1) ILOSTAT: base de morte e lesão por acidente de trabalho, indicador SDG 8.8.1, por país e ano. (2) AEAT/Previdência + TST: acidentes de trabalho no Brasil com recorte por CNAE — é o único caminho para mineração, construção e têxtil no país. (3) US CSB: relatórios de investigação por evento industrial, com mortos e feridos documentados. (4) EJAtlas: catálogo de milhares de conflitos socioambientais vinculados a empresas, cobre Mariana e Bhopal. REGRA CRÍTICA: a camada agregada (totais ILO) é estimativa de causa de trabalho e NÃO é contagem por caso — jamais somar aos mortos de Bhopal, Brumadinho ou Mariana. Cada caso deve registrar o documento que o fundamenta (laudo pericial, ação da MPF/CNIJ, sentença, relatório) e preservar divergências entre fontes.',
    cobre: ['Bhopal, Mariana, Brumadinho, opioides e congêneres.'],
    usadoEm: ['src/data/disasters.ts', 'Mapa 2D', 'Globo 3D'],
    verificacao: 'url-incluida',
    observacao:
      'Aplicada a recomendação padrão da auditoria (2026-09): a entrada deixa de ser um agregador sem URL e passa a citar quatro camadas documentais, cada uma com escopo diferente. O que muda na prática: os totais ILO servem de contexto de escala, e cada caso (Bhopal, Vila Socó, Brumadinho, Rana Plaza, Mariana) precisa continuar apontando para seu próprio documento. Separar sempre, em campo próprio: mortos diretos, expostos e projeções.',
  },
  {
    id: 'natural-earth',
    nome: 'Natural Earth e world-atlas',
    instituicao: 'Natural Earth',
    categoria: 'geo',
    tipo: 'base-oficial',
    ano: '110m',
    urls: [
      {
        rotulo: 'Portal Natural Earth',
        url: 'https://www.naturalearthdata.com/',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico: 'O desenho gratuito dos países usado no mapa.',
    resumoAvancado: 'Base cartográfica vetorial para fronteiras e projeções.',
    cobre: ['Geometrias dos países e projeção do mapa.'],
    usadoEm: ['src/lib/world.ts', 'Mapa 2D', 'Globo 3D'],
    verificacao: 'url-incluida',
  },
  {
    id: 'motor-w-cvm',
    nome: 'Modelo contábil W = c + v + m',
    instituicao: 'Capital Blocks',
    categoria: 'metodo',
    tipo: 'metodologia-interna',
    ano: 'modelo permanente',
    urls: [],
    resumoDidatico: 'A conta que separa salário, lucro e custo em cada empresa.',
    resumoAvancado: 'Aproximação contábil documentada em DATA-GUIDELINES §9; não é estatística oficial.',
    cobre: ['Decomposição corporativa e taxa de exploração.'],
    usadoEm: ['src/lib/companyMetrics.ts', 'src/data/companies.ts', 'Raio-X de Empresas'],
    verificacao: 'fonte-declarada',
  },
  {
    id: 'premissas-setoriais',
    nome: 'Premissas setoriais de margem e folha',
    instituicao: 'Capital Blocks',
    categoria: 'metodo',
    tipo: 'metodologia-interna',
    ano: 'premissas didáticas',
    urls: [
      {
        rotulo: 'OCDE — valor adicionado em corporações não financeiras',
        url: 'https://www.oecd.org/en/data/indicators/value-added-in-non-financial-corporations.html',
        acessoEm: '2026-10-02',
      },
      {
        rotulo: 'OCDE — remuneração de empregados por atividade',
        url: 'https://www.oecd.org/en/data/indicators/employee-compensation-by-activity.html',
        acessoEm: '2026-10-02',
      },
    ],
    resumoDidatico: 'Estimativas sinalizadas para lucro e folha quando a empresa não traz todos os dados; a OCDE ajuda a conferir se a ordem de grandeza do setor faz sentido.',
    resumoAvancado: 'Premissas internas de margem e participação da folha, tratadas como estimativas e calibradas contra contas setoriais da OCDE; não são parâmetros oficiais nem substituem demonstrações financeiras.',
    cobre: ['Estimativas de registros dinâmicos sem fundamentais completos.'],
    usadoEm: ['src/lib/companyMetrics.ts', 'src/lib/marketApi/sync.ts'],
    estimate: true,
    verificacao: 'url-incluida',
    observacao: 'METODOLOGIA, NÃO ESTATÍSTICA: a OCDE fornece participação do trabalho/capital no valor adicionado e remuneração por atividade, úteis como teste de plausibilidade. As margens internas continuam estimate=true e não devem ser apresentadas como “média oficial do setor”. Preferir DFs da empresa sempre que disponíveis.',
  },
  {
    id: 'fluxos-tiers',
    nome: 'Metodologia visual dos fluxos',
    instituicao: 'Capital Blocks',
    categoria: 'metodo',
    tipo: 'metodologia-interna',
    ano: 'modelo permanente',
    urls: [],
    resumoDidatico: 'Por que algumas rotas aparecem de longe e outras só no zoom.',
    resumoAvancado: 'Camadas base/detail controlam densidade visual sem mudar os valores.',
    cobre: ['Partículas, camadas e níveis de detalhe do mapa.'],
    usadoEm: ['src/data/flows.ts', 'Mapa 2D'],
    verificacao: 'fonte-declarada',
  },
];

/** Índice canônico para ligar números, tours e cards à página de fontes. */
export const SOURCE_BY_ID: Readonly<Record<string, SourceRecord>> = Object.freeze(
  Object.fromEntries(SOURCES.map((s) => [s.id, s])) as Record<string, SourceRecord>,
);

export function sourceById(id: string): SourceRecord | undefined {
  return SOURCE_BY_ID[id];
}

export function sourcePrimaryUrl(id: string): string | undefined {
  return SOURCE_BY_ID[id]?.urls[0]?.url;
}

export function sourcesSummary(list: SourceRecord[] = SOURCES) {
  const porCategoria = SOURCE_CATEGORIES.map((c) => ({
    ...c,
    total: list.filter((s) => s.categoria === c.id).length,
  })).filter((c) => c.total > 0);
  return {
    total: list.length,
    comUrl: list.filter((s) => s.urls.length > 0).length,
    semUrl: list.filter((s) => s.urls.length === 0).length,
    estimativas: list.filter((s) => s.estimate).length,
    revisaoPendente: list.filter((s) => s.verificacao === 'revisao-pendente').length,
    porCategoria,
  };
}
