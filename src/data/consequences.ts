/**
 * MÓDULO 08 — CONSEQUÊNCIAS SISTÊMICAS: AS MORTES DO CAPITALISMO
 * Base: série em 8 episódios de Filipe Boni (YouTube) + literatura de
 * Davis, Williams, Rodney, Nixon, Patnaik, Hickel, Hochschild, Bevins,
 * Klein, Kadri, Malm, Harvey. Definições dual-mode (THEORY.md).
 */

export type Era = 'historica' | 'atual'

export interface Mechanism {
  t: string
  did: string
  adv: string
}

export interface Episode {
  id: string
  ep: number
  era: Era
  titulo: string
  curto: string
  periodo: string
  local: string
  color: string
  videoId: string
  vitimas: { numero: string; rotulo: string; did: string; adv: string }
  mecanismos: Mechanism[]
  aprof: { autores: string; did: string; adv: string }
}

export const EPISODES: Episode[] = [
  /* ═══════════ HISTÓRICAS ═══════════ */
  {
    id: 'americas', ep: 1, era: 'historica',
    titulo: 'A Colonização das Américas e a gênese do capitalismo global',
    curto: 'Colonização das Américas',
    periodo: '1492 – séc. XVII', local: 'Américas (Potosí, Zacatecas, Huancavelica)',
    color: '#ff7043', videoId: 'HYTnsV7fKcM',
    vitimas: {
      numero: '50–90 milhões',
      rotulo: 'mortos indígenas · ~90% da população nativa (60 mi → 5–6 mi)',
      did: 'A conquista das Américas foi uma das maiores catástrofes da história humana: de cada 10 pessoas que viviam aqui, 9 morreram.',
      adv: 'Colapso demográfico de ~90% em um século e meio — base demográfica e mineral da acumulação primitiva europeia.',
    },
    mecanismos: [
      {
        t: 'Acumulação primitiva: separação à força das terras',
        did: 'Para o capitalismo nascer, alguém precisou ser expulso à força do que tinha. Na América, terras, ouro e prata viraram propriedade das coroas europeias — e os povos nativos viraram mão de obra escravizada.',
        adv: 'Acumulação primitiva de capital: expropriação dos povos nativos de seus territórios para concentrar recursos nas metrópoles — pedra angular do sistema-mundo moderno/colonial (Wallerstein, Quijano).',
      },
      {
        t: 'Encomienda e Mita: trabalho forçado institucionalizado',
        did: 'Os sobreviventes foram obrigados a trabalhar nas minas em escalas rotativas — um imposto pago com vida. Quem entrava na mina muitas vezes não voltava.',
        adv: 'Instituições de coerção colonial: a Encomienda e a Mita andina organizavam rotações de trabalho forçado para as minas, regulando o ritmo de destruição da força de trabalho.',
      },
      {
        t: 'A Grande Morte ecológica: o clima esfriou',
        did: 'Quando dezenas de milhões morreram, as fazendas nativas foram abandonadas e as florestas voltaram a crescer — tanto CO₂ foi absorvido que a Europa entrou numa "Pequena Idade do Gelo". Um massacre humano tão grande que apareceu no clima do planeta.',
        adv: '"The Great Dying": abandono de ~56 milhões de hectares cultivados → regeneração florestal → sequestro de ~7 Gt CO₂ → contribuição antropogênica para a Pequena Idade do Gelo (Ruddiman/Koch).',
      },
      {
        t: 'Requerimento (1513): o massacre com papel timbrado',
        did: 'Antes de atacar, os espanhóis liam um documento em castelhano que ninguém entendia: "aceitem a Coroa e a Igreja". Se não aceitassem, a guerra era declarada "justa". O direito moderno dando licença jurídica ao massacre.',
        adv: 'Dispositivo jurídico-militar: o Requerimento de 1513 convertia a resistência indígena em "guerra justa" e crime de insubordinação à Coroa e à Igreja — aço contra macuahuitl com bênção notarial.',
      },
      {
        t: 'Prata e mercúrio: Potosí envenenado',
        did: 'A prata que enriqueceu a Europa era fundida com mercúrio — um veneno que matou os mineiros e envenenou rios e solos até hoje. A montanha "comeu gente" por dentro e por fora.',
        adv: 'Processo do Pátio (Medina, 1554): amalgamação com mercúrio em Huancavelica/Potosí emitiu >56 mil toneladas de vapor de Hg — ~25% da poluição química pré-industrial da América Latina.',
      },
      {
        t: 'Revolução dos Preços: a primeira inflação do capitalismo',
        did: 'Tanta prata chegou na Europa que os preços subiram 600% em dois séculos. Camponeses e assalariados quebraram; banqueiros holandeses e ingleses ficaram ricos. O sangue americano financiou o nascimento das finanças europeias.',
        adv: 'Revolução dos Preços (séc. XVI–XVII): inflação de ~600% corroendo salários reais; a prata de Potosí/Zacatecas serviu de colateral às redes de crédito de Fugger, Welser e à banca holandesa/inglesa.',
      },
    ],
    aprof: {
      autores: 'Wallerstein · Quijano · Hochschild (contexto)',
      did: 'A conquista não foi um "encontro de mundos": foi a fundação a sangue do mundo moderno — de um lado quem manda e acumula, do outro quem fornece trabalho e matéria-prima. As leis espanholas regulavam o QUANTO explorar, nunca SE explorar.',
      adv: 'Sistema-mundo moderno/colonial (Wallerstein; colonialidade do poder, Quijano): Leyes de Burgos (1512) e Leyes Nuevas (1542) demonstram a dinâmica do direito colonial — regular o grau de exploração para preservar a força de trabalho sem jamais cessar a extração de sobretrabalho.',
    },
  },
  {
    id: 'escravidao', ep: 2, era: 'historica',
    titulo: 'A escravidão transatlântica financiou a Revolução Industrial',
    curto: 'Escravidão transatlântica',
    periodo: 'séc. XVI – 1860s', local: 'África · Caribe · Brasil · Sul dos EUA',
    color: '#a1887f', videoId: 'qDWD13uZfKE',
    vitimas: {
      numero: '15–20 milhões',
      rotulo: 'mortos africanos (captura, marchas, Passagem do Meio, plantation)',
      did: 'Além dos que atravessaram o oceano em porões de morte, milhões morreram nas guerras de captura e nas marchas até a costa. Cada açúcar doce na Europa tinha um custo de sangue na África.',
      adv: 'Custo humano direto e indireto do tráfico: guerras de captura, marchas forçadas, mortalidade da Passagem do Meio e expectativa de vida de poucos anos nas plantations.',
    },
    mecanismos: [
      {
        t: 'Tese de Eric Williams: escravidão financiou a indústria',
        did: 'Os lucros do tráfico negreiro e do açúcar/algodão escravista bancaram as fábricas da Revolução Industrial inglesa. A escravidão não foi um "atraso" do capitalismo — foi o combustível do seu arranque.',
        adv: 'Tese de Williams (Capitalismo e Escravidão): lucros do tráfico e da plantation caribenha/americana financiaram a industrialização britânica; a abolição (1833+) atendeu à demanda estrutural por mercados assalariados, não à filantropia.',
      },
      {
        t: 'A África empobrecida de propósito',
        did: 'O tráfico roubou dezenas de milhões de jovens em idade de trabalhar e ter filhos. Em 1850, a África tinha metade da população que deveria ter. O subdesenvolvimento africano não é acidente: foi projeto.',
        adv: 'Rodney/Manning: remoção de dezenas de milhões em idade produtiva/reprodutiva estagnou a população africana em ~50 mi em 1850 (contra ~100 mi projetados) — subdesenvolvimento como produção ativa do metabolismo colonial.',
      },
      {
        t: 'A plantation foi a primeira "fábrica" da história',
        did: 'Antes das fábricas de Manchester, já existia linha de produção com relógio, turno e disciplina total — nas usinas de açúcar e nos algodoais. O modelo industrial foi ensaiado com corpos escravizados.',
        adv: 'Plantation como proto-indústria: disciplina temporal e trabalho contínuo precedem a fábrica; o algodão escravista do Sul dos EUA supria 75% da matéria-prima de Lancashire.',
      },
      {
        t: 'Seres humanos como ativo financeiro',
        did: 'Pessoas escravizadas eram hipotecadas, penhoradas e seguradas como mercadoria. No navio Zong (1781), 133 africanos foram jogados vivos ao mar para que os donos COBRASSEM o seguro. A seguradora era a Lloyd\u2019s de Londres.',
        adv: 'Financeirização da vida: corpos como colateral segurável — Massacre do Zong (1781): 133 africanos lançados ao mar para acionar apólice marítima da Lloyd\u2019s; litígio Gregson v. Gilbert como espelho do fetichismo.',
      },
      {
        t: 'A abolição pagou os donos, não os escravizados',
        did: 'Quando o Reino Unido aboliu a escravidão (1833), pagou 20 milhões de libras — 40% do orçamento do Estado — de indenização AOS PROPRIETÁRIOS. Aos escravizados: zero. A dívida foi paga pelos contribuintes até 2015.',
        adv: 'Slavery Abolition Act (1833): £20 mi (~5% do PIB; 40% do orçamento) compensaram proprietários; financiada por empréstimo cujo serviço perdurou até 2015 — transferência estatal que consolidou o patrimônio rentista.',
      },
    ],
    aprof: {
      autores: 'Eric Williams · Walter Rodney · C.L.R. James · Trotsky',
      did: 'O açúcar barato e o chá/café adoçados alimentavam os operários ingleses por menos dinheiro — assim o patrão pagava menos salário e lucrava mais. A fome barata do Norte era feita com o sangue do Sul.',
      adv: 'Desenvolvimento desigual e combinado: trabalho não pago nos eitos americanos coexiste com assalariados hiperexplorados em Lancashire; açúcar/chá/café rebaixam o valor da força de trabalho europeia, elevando a taxa de mais-valia industrial.',
    },
  },
  {
    id: 'india', ep: 3, era: 'historica',
    titulo: 'O "livre mercado" britânico e as fomes estruturais na Índia',
    curto: 'Fomes coloniais na Índia',
    periodo: '1770 – 1943', local: 'Índia colonial (Bengala, Deccan)',
    color: '#ffd54f', videoId: 'YInv6bL2-gE',
    vitimas: {
      numero: '30–165 milhões',
      rotulo: 'mortes por fome sob domínio britânico · 165 mi em excesso só entre 1880–1920',
      did: 'As fomes da Índia colonial não foram "falta de chuva": foram política de Estado. As estimativas vão de 30 milhões até 165 milhões de mortos em excesso.',
      adv: 'Estimativa tradicional 30–60 mi; Hickel/Patnaik calculam 165 mi de mortes em excesso 1880–1920 — fome como política de acumulação, não como catástrofe natural.',
    },
    mecanismos: [
      {
        t: 'Desindustrialização forçada: quebrar os teares',
        did: 'A Índia produzia os tecidos mais cobiçados do mundo. A Grã-Bretanha taxou os tecidos indianos na Europa, invadiu a Índia com tecidos de fábrica e quebrou os teares artesanais: de 38% do comércio para 3% em um século.',
        adv: 'Desindustrialização deliberada: tecelagem indiana cai de 38% (1730) para 3% (1840) do comércio africano ocidental — tarifas assimétricas + dumping manufatureiro de Manchester.',
      },
      {
        t: 'Impostos em dinheiro: a armadilha do Zamindari',
        did: 'Os colonizadores privatizaram terras comunais e exigiram imposto EM DINHEIRO. Sem dinheiro? Vender a colheita de comida — ou pedir ao agiota. Resultado: plantava-se algodão e ópio para exportar enquanto se passava fome.',
        adv: 'Zamindari (Permanent Settlement, 1793) e Ryotwari: privatização de terras comunais + tributação monetária exclusiva → endividamento camponês e conversão de alimentos em culturas de exportação (algodão, juta, ópio).',
      },
      {
        t: 'Drain of Wealth: US$ 45 trilhões drenados',
        did: 'A Coroa cobrava impostos na Índia, usava o dinheiro para "comprar" produtos indianos e revendia no exterior, ficando com tudo. A conta: cerca de US$ 45 TRILHÕES drenados da Índia em 173 anos.',
        adv: 'Drain of Wealth (Naoroji/Patnaik): impostos em rúpias monetizavam exportações com lucro retido em Londres — ≈US$ 45 tri (1765–1938), financiando colônias de povoamento e o Padrão-Ouro.',
      },
      {
        t: 'Fome como laboratório: a "Ração Temple"',
        did: 'Nas secas, o Império aplicava o dogma do "livre mercado": nada de socorro que "desestimulasse o trabalho". Fome de distância (se andasse mais de X km, não merecia comida) e rações de 1.627 calorias — MENOS que nos campos de concentração nazistas.',
        adv: 'Biopolítica malthusiana: laissez-faire dogmático sob Lytton; "Temple Wage" de 1.627 kcal/dia para trabalho pesado (abaixo do racionamento de Buchenwald) e "Distance Test" como filtro de sobrevivência.',
      },
      {
        t: 'Bengala 1943: Churchill e a terra arrasada',
        did: 'Na última grande fome, Churchill confiscou barcos e estoques de arroz na Bengala "para bloquear os japoneses" — e 3 milhões de indianos morreram com comida sendo estocada para o exército britânico.',
        adv: 'Denial Policy (1942–43): confisco de embarcações/estoques em Bengala; 0,8–3,8 mi de mortos enquanto grãos seguiam para estoques militares — negação de socorro com retórica de guerra.',
      },
    ],
    aprof: {
      autores: 'Mike Davis · Utsa Patnaik · Jason Hickel · Amartya Sen',
      did: 'As ferrovias e telégrafos que os ingleses construíram não salvaram ninguém: serviam para LEVAR OS GRÃOS PARA FORA das regiões famintas, direto aos portos de exportação. A infraestrutura foi construída para drenar, não para alimentar.',
      adv: '"Holocausto Colonial" (Davis): ferrovia/telegrafia integraram a Índia ao mercado mundial como duto de drenagem de grãos das zonas em fome aos portos; Sen (entitlements): a fome é colapso de acesso, não de disponibilidade — disponibilidade havia.',
    },
  },
  {
    id: 'congo', ep: 4, era: 'historica',
    titulo: 'O Estado Livre do Congo: um país virou propriedade privada',
    curto: 'Congo de Leopoldo II',
    periodo: '1885 – 1920', local: 'Bacia do Congo',
    color: '#81c784', videoId: 'yvuQQL0R21Q',
    vitimas: {
      numero: '~10 milhões',
      rotulo: 'mortos · ~50% da população do Congo',
      did: 'Um país inteiro virou propriedade de UM homem — o rei Leopoldo II da Bélgica. Em 35 anos, metade da população congolesa morreu produzindo borracha.',
      adv: '≈10 mi de mortos (1885–1920), ~50% da população: regime de trabalho forçado para extrativismo de borracha silvestre sob propriedade dinástica privada.',
    },
    mecanismos: [
      {
        t: 'Berlim 1884–85: o país como propriedade de um homem',
        did: 'Na Conferência de Berlim, as potências repartiram a África. O Congo não virou colônia da Bélgica: virou PROPRIEDADE PRIVADA do rei Leopoldo II — 2,6 milhões de km², 85 vezes o tamanho da Bélgica.',
        adv: 'Conferência de Berlim (1884–85): o État Indépendant du Congo como propriedade privada dinástica (2,6 mi km², 85× a Bélgica) — forma pura de soberania-capital.',
      },
      {
        t: 'O pneu criou a demanda: borracha vira ouro',
        did: 'Em 1887 inventaram o pneu. De repente, a borracha das florestas do Congo virou matéria-prima estratégica da nova indústria mundial — e coletá-la virou cota de trabalho forçado sob pena de morte.',
        adv: 'Segunda Revolução Industrial: pneu pneumático (Dunlop, 1887) converte látex silvestre (Landolphia) em commodity estratégica — demanda exógena define a intensidade do terror.',
      },
      {
        t: '"Terra de ninguém": expropriação por decreto',
        did: 'Por decreto, TODAS as terras "não usadas ao estilo europeu" viraram propriedade do Estado-Leopoldo. Os congoleses foram proibidos de caçar, pescar e coletar na própria floresta — só podiam coletar borracha PARA ele.',
        adv: 'Decretos de 1891/92 (terra nullius): todas as terras "desocupadas" nacionalizadas; populações privadas de acesso de subsistência — expropriação jurídica que força a venda da força de trabalho ou o trabalho forçado direto.',
      },
      {
        t: 'Mãos cortadas como contabilidade de munição',
        did: 'As milícias tinham cota de borracha e de balas. Cada tiro disparado precisava de comprovação: a MÃO DIREITA cortada de um congonlês — vivo ou morto. Famílias eram sequestradas como reféns até a cota ser cumprida.',
        adv: 'Concessionárias (ABIR, Anversoise) remuneravam administradores por tonelada; Force Publique exigia prova de uso de cartucho via amputação de mão direita — contabilidade macabra do incentivo econômico ao terror; reféns (mulheres/crianças) como garantia de cota.',
      },
      {
        t: 'Os lucros foram virar prédios na Bélgica',
        did: 'A ferrovia que escoava a borracha foi construída sobre milhares de mortos. O dinheiro foi financiar os monumentos, museus e avenidas de Bruxelas — a Bélgica inteira é, em parte, um memorial não declarado ao saque do Congo.',
        adv: 'Infraestrutura de escoamento (Matadi-Leopoldville) construída com trabalho forçado; lucros capitalizados em infraestrutura urbana belga — acumulação primitiva espacialmente desacoplada do custo humano.',
      },
    ],
    aprof: {
      autores: 'Adam Hochschild · Jules Marchal · David Harvey',
      did: 'O Congo mostra o capitalismo sem maquiagem: quando não há lei nenhuma protegendo o trabalhador, é isso. E não acabou: hoje o mesmo chão fornece coltan e cobalto para os celulares e carros elétricos do Norte.',
      adv: '"O Fantasma do Rei Leopoldo" (Hochschild): o Congo como forma pura do capital sem mediação institucional. Continuidade extrativista: coltan/cobalto/ouro do Kivu alimentam a transição energética do Norte (acumulação por despossessão, Harvey).',
    },
  },

  /* ═══════════ ATUAIS ═══════════ */
  {
    id: 'indonesia', ep: 5, era: 'atual',
    titulo: 'Indonésia 1965: o massacre que abriu o país ao capital estrangeiro',
    curto: 'Indonésia 1965',
    periodo: '1965 – 1998', local: 'Indonésia (Jacarta, West Papua)',
    color: '#ba68c8', videoId: 'E7c6qKKFCJo',
    vitimas: {
      numero: '500 mil – 1 milhão',
      rotulo: 'executados no genocídio anticomunista (1965–66)',
      did: 'Em menos de um ano, entre meio milhão e um milhão de pessoas — sindicalistas, camponeses, professores, militantes — foram caçadas e executadas. E o mundo aplaudiu o "milagre econômico" que veio depois.',
      adv: 'Genocídio anticomunista (1965–66): 500 mil–1 mi de mortos pelo exército e milícias — condição de abertura da "Nova Ordem" de Suharto ao capital estrangeiro (Bevins, O Método Jacarta).',
    },
    mecanismos: [
      {
        t: 'Antes: petróleo era do povo indonésio',
        did: 'O presidente Sukarno havia declarado que o petróleo indonésio era propriedade do povo — e forçou as petroleiras americanas e inglesas a entregar 60% dos lucros ao Estado. Isso não podia ficar de pé.',
        adv: 'Lei nº 44/1960: petróleo como propriedade popular; Caltex, Stanvac e Shell obrigadas a repassar 60% dos lucros — nacionalismo resource-based incompatível com o bloco atlantista.',
      },
      {
        t: 'Listas de nomes feitas pela CIA',
        did: 'Após o golpe de Suharto, a embaixada dos EUA entregou listas com milhares de nomes de militantes comunistas, sindicalistas e camponeses — que foram executados um a um. Washington acompanhava e marcava os "concluídos".',
        adv: 'Apoio operacional EUA: embaixada/CIA forneceram lists nominal de quadros do PKI, sindicalistas (SOBSI) e camponeses (BTI) — verificação de execução documentada em despachos desclassificados.',
      },
      {
        t: 'A "Máfia de Berkeley": economistas treinados nos EUA',
        did: 'Um grupo de economistas indonésios formado em universidades americanas (com dinheiro das fundações Ford e Rockefeller) assumiu a economia do país e aplicou receita pronta: austeridade, corte de subsídios, abrir tudo para fora.',
        adv: 'Berkeley Mafia: quadros formados em UC Berkeley sob funding Ford/Rockefeller implementaram estabilização ortodoxa, cortes de subsídio e liberalização — captura técnica do aparato estatal.',
      },
      {
        t: 'Genebra 1967: o país foi loteado numa conferência',
        did: 'Dois anos após o massacre, generais e executivos das maiores corporações do mundo se reuniram na Suíça — e saíram de lá com pedaços da Indonésia: minas, florestas, petróleo.',
        adv: 'Genebra Conference (1967): TOEFL-generais × executivos (Time-Life, bancos, mineradoras) — loteamento de ativos indonésios como desenho institucional pós-terror.',
      },
      {
        t: 'Lei 1/1967: isenção total e montanha de ouro',
        did: 'A nova lei de investimentos entregou o que faltava: imposto zero, lucro saindo do país sem limite, e uma montanha de OURO em West Papua entregue à mineradora americana Freeport.',
        adv: 'Foreign Investment Law nº 1/1967: tax holiday integral, remessa ilimitada de lucros, concessões territoriais — Freeport-McMoRan em Ertsberg/Grasberg (West Papua) como caso emblemático.',
      },
      {
        t: 'Salário de 10 centavos por dia',
        did: 'Com os líderes sindicais mortos, não havia quem negociasse. Os salários da indústria caíram para cerca de 10 centavos de dólar POR DIA. O "milagre indonésio" era isso.',
        adv: 'Superexploração pós-terror: eliminação física das lideranças sindicais (SOBSI) deprimiu salários industriais a ~US$0,10/dia — compressão salarial como vantagem comparativa ofertada ao capital global.',
      },
    ],
    aprof: {
      autores: 'Vincent Bevins · David Harvey · Andreas Harsono',
      did: 'O Método Jacarta virou manual: matar o movimento popular, abrir o país e chamar de milagre. O mesmo roteiro repetiu-se na América Latina nos anos 70. E a reforma agrária que ameaçava os latifúndios morreu junto com os camponeses.',
      adv: 'Bevins: o método Jacarta como template de contrainsurgência pró-mercado no Sul Global. Acumulação por despossessão (Harvey): revogação da Reforma Agrária (1960), conversão de milhões de hectares em palma/níquel — despossessão como acumulação.',
    },
  },
  {
    id: 'bhopal', ep: 6, era: 'atual',
    titulo: 'Bhopal 1984: quando cortar custos vale mais que mil vidas',
    curto: 'Bhopal (Union Carbide)',
    periodo: '1984 – hoje', local: 'Bhopal, Índia',
    color: '#4dd0e1', videoId: 'Ud5m9DgJzBI',
    vitimas: {
      numero: '3.000 mortos · 570 mil intoxicados',
      rotulo: 'na noite do desastre e nas décadas seguintes',
      did: 'Numa única noite, um gás venenoso vazou sobre uma cidade dormindo: 3 mil morreram até o amanhecer. Meio milhão de pessoas carma doenças para o resto da vida — e seus filhos e netos também.',
      adv: '3.000 óbitos imediatos; 500–570 mil com morbidade crônica (MIC — isocianato de metila): maior catástrofe industrial da história, com dano transgeracional documentado.',
    },
    mecanismos: [
      {
        t: 'A fábrica nasceu da "Revolução Verde"',
        did: 'A fábrica da Union Carbide foi montada na Índia para produzir veneno de plantação (o pesticida Sevin), empurrando a agricultura indiana para a dependência de agrotóxicos.',
        adv: 'UCIL (1969): produção de Sevin (carbaril) via MIC intermediário — inserção da agricultura indiana no pacote tecnológico da Revolução Verde (dependência de insumos corporativos).',
      },
      {
        t: 'Cortar custos: menos gente, menos treino, segurança desligada',
        did: 'Quando o pesticida parou de vender, a matriz mandou cortar custos: a equipe do setor mais perigoso caiu de 13 para 6, o treino de 540 dias para 17, e o sistema de refrigeração que mantinha o gás seguro ficou DESLIGADO por seis meses.',
        adv: 'Agressiva redução de custos pós-queda de demanda: staff MIC 13→6; treinamento 540→17 dias; refrigeração do tanque de MIC desativada ~6 meses — degradação deliberada de margens de segurança.',
      },
      {
        t: 'Duplo padrão: na matriz americana era seguro',
        did: 'A fábrica irmã nos EUA tinha computadores de monitoramento, menos gás estocado e equipamentos funcionando. Na Índia, o quebrado ficava quebrado. Vida indiana valia menos no balanço.',
        adv: 'Assimetria de padrões: planta-gêmea em Institute (WV) com SCADA, estoques mínimos e scrubbers operacionais vs. manutenção suspensa em Bhopal — precificação diferenciada do risco por nacionalidade.',
      },
      {
        t: 'US$ 500 por vítima: a "justiça" do acordo',
        did: 'Culpa? A empresa inventou a teoria de que foi "sabotagem de um funcionário". Sete anos depois, fecharam acordo: US$ 465 milhões para TUDO — cerca de US$ 500 por vítima. Menos que um iPhone.',
        adv: 'Estratégia de impunidade: teoria da sabotagem individual para blindar a estrutura gestora; settlement (1989) de US$ 465 mi — ~US$500/vítima média, homologado pela Suprema Corte indiana.',
      },
      {
        t: 'Violência lenta: o veneno continua até hoje',
        did: 'Os resíduos tóxicos nunca foram removidos. Infiltraram no chão e na água, causando malformações e câncer até em netos das vítimas. A Dow Chemical, que comprou a empresa, diz que não é responsável.',
        adv: 'Slow violence (Nixon): contaminação persistente de aquíferos por resíduos nunca remediatados — dano diferido e invisível ao mercado; Dow Chemical (adquirente 2001) nega sucessão de responsabilidade.',
      },
    ],
    aprof: {
      autores: 'Rob Nixon · Ulrich Beck (contexto) · Sathyu Sarangi',
      did: 'Bhopal mostra a regra da globalização corporativa: o lucro sobe para os EUA, o veneno fica na Índia. E a "violência lenta" não dá manchete — ela aparece, devagar, na água e no corpo das gerações seguintes.',
      adv: 'Slow violence (Nixon): destruição diferida, fora do escaneamento midiático-financeiro, sobre "zonas de sacrifício" periféricas — externalização assimétrica de risco na cadeia de valor global (Beck: modernização reflexiva sem democratização do risco).',
    },
  },
  {
    id: 'iraque', ep: 7, era: 'atual',
    titulo: 'Iraque 2003: a guerra para salvar o dólar',
    curto: 'Iraque & petrodólar',
    periodo: '2003 – 2011 (efeitos até hoje)', local: 'Iraque',
    color: '#ef5350', videoId: '2vsE0YGRqDY',
    vitimas: {
      numero: '200–600 mil+',
      rotulo: 'mortos iraquianos (civis e combatentes)',
      did: 'A invasão e o caos seguinte mataram entre 200 mil e mais de 600 mil iraquianos. E tudo começou com uma moeda: em qual dinheiro o petróleo iraquiano seria cobrado.',
      adv: '200–600 mil+ mortes diretas/indiretas (Lancet surveys; Iraq Body Count) — destruição de Estado e sociedade como variável central do conflito.',
    },
    mecanismos: [
      {
        t: 'Petrodólar: por que o dólar manda',
        did: 'Desde 1974, um acordo secreto garante que TODO petróleo do mundo seja vendido em DÓLARES. Isso força todos os países a estocar dólares — é o que sustenta o império da moeda americana.',
        adv: 'Acordo Nixon-Faisal (1974): precificação exclusiva em USD da OPEP — demanda estrutural por dólares recicla superávits em Treasuries, ancorando a hegemonia monetária pós-Bretton Woods.',
      },
      {
        t: 'Saddam trocou o dólar pelo euro',
        did: 'Em 2000, o Iraque anunciou que passaria a vender seu petróleo EM EUROS. Parece detalhe — mas se outros fizessem o mesmo, a demanda mundial por dólares cairia. Em 2003, os EUA invadiram. O euro no Iraque acabou na segunda-feira seguinte à invasão.',
        adv: 'Conversão do oil-for-food ao EUR (nov/2000): ameaça existencial à demanda por reservas em USD — hipótese monetária da guerra, revertida pela CPA em 2003.',
      },
      {
        t: 'O plano era anterior ao 11 de setembro',
        did: 'O grupo neoconservador PNAC já defendia derrubar Saddam desde 1998. O 11 de setembro não causou a guerra: foi usado como pretexto para executar um plano que já existia.',
        adv: 'PNAC (1998, carta a Clinton): "regime change" como objetivo doutrinário — 9/11 como janela de oportunidade discursiva, não causa material.',
      },
      {
        t: 'Destruição como lucro: "acumulação por desperdício"',
        did: 'Para a indústria de armas e reconstrução, a guerra é um negócio redondo: primeiro se vende a bomba que destrói, depois o contrato que reconstrói. Tudo pago pelo contribuinte americano e iraquiano.',
        adv: 'Accumulation by waste (Kadri): destruição acelerada de capital fixo reativa ciclos de sobreacumulação bélica — demanda cativa para MIC + contratos de reconstrução privada.',
      },
      {
        t: 'Paul Bremer assinou a privatização do país',
        did: 'O governador americano do Iraque ocupado assinou decretos em série: dissolveu o exército (400 mil soldados na rua, armados), privatizou estatais, permitiu 100% de propriedade estrangeira e lucros saindo sem limite — com bancos como JPMorgan dentro.',
        adv: 'CPA Orders: nº2 (dissolução do exército — 400k desmobilizados armados), nº37/39/40 (flat tax, 100% FDI, remessa integral, abertura bancária a JPMorgan) — choque neoliberal via poder de ocupação (Klein).',
      },
      {
        t: 'Contratos sem licitação para os amigos do poder',
        did: 'Bilhões em contratos sem concorrência foram para a Halliburton — a empresa onde o vice-presidente Dick Cheney tinha sido CEO. A guerra pagou os amigos, e os amigos pagaram a campanha.',
        adv: 'Captura corporativa: RIO/LOGCAP sem competitive bidding para Halliburton/KBR (revolving door Cheney) — fusão de aparato estatal e fração rentista do MIC.',
      },
    ],
    aprof: {
      autores: 'Naomi Klein · Ali Kadri · Antonia Juhasz',
      did: 'O Iraque foi laboratório: como transformar um país inteiro em campo de testes do capitalismo mais radical, com bombas. E mostrou que a moeda do petróleo vale guerras.',
      adv: 'Doutrina do Choque (Klein): terapia de choque armada como método — destruição de Estado como condição de implementação do fundamentalismo de mercado; Kadri: desperdício imperial como forma de acumulação rentista-dolarizada.',
    },
  },
  {
    id: 'clima', ep: 8, era: 'atual',
    titulo: 'Bônus: a crise climática e as 22 empresas que queimaram o planeta',
    curto: 'Crise climática',
    periodo: '1977 – hoje', local: 'Planeta',
    color: '#4caf50', videoId: 'NcgauA5yluk',
    vitimas: {
      numero: '1 milhão+/ano',
      rotulo: 'mortes associadas aos impactos climáticos (OMS/Lancet) · 22 empresas = 1/3 das emissões históricas',
      did: 'A crise climática já mata mais de um milhão de pessoas por ano. E um terço de TODA a poluição que causou o aquecimento saiu de apenas 22 empresas — que sabiam da ciência desde 1977 e escolheram esconder.',
      adv: '≥1 mi de mortes anuais atribuíveis (WHO/Lancet Countdown); Carbon Majors: 22 entidades responsáveis por ~1/3 das emissões industriais cumulativas de GEE (Heede, 2014).',
    },
    mecanismos: [
      {
        t: 'Por que carvão e petróleo venceram? Poder sobre o trabalho',
        did: 'Não foi porque a água faltava: o carvão venceu porque permitia levar a fábrica para a CIDADE, onde havia multidões de trabalhadores disciplinados. A escolha da energia fóssil foi uma escolha sobre PODER sobre as pessoas.',
        adv: 'Malm (Fossil Capital): transição ao vapor-carvão precede escassez hídrica — localização urbana maximiza disciplina e disponibilidade de trabalho assalariado; energia como relação social de comando.',
      },
      {
        t: 'Elas sabiam desde 1977 — com precisão assustadora',
        did: 'Cientistas da Exxon previram em 1977, em relatório interno, o aquecimento de 0,2°C por década — com precisão assustadora. Em 1988, a Shell mapeou até a elevação dos mares. E as empresas decidiram ESPERAR O CAOS E LUCRAR.',
        adv: 'Ciência de atribuição interna: James Black (Exxon, 1977) projeta +0,2°C/década (±0,04); Shell (1988, "Greenhouse Effect") mapeia acidificação, SLR e migrações — conhecimento antecipado e suprimido (Supran/Oreskes).',
      },
      {
        t: 'US$ 17 trilhões que não podem ser queimados',
        did: 'Os relatórios internos admitiam: para salvar o clima, seria preciso DEIXAR NO CHÃO combustíveis no valor de até US$ 17 trilhões. Preferiram arriscar o planeta a arriscar o balanço.',
        adv: 'Stranded assets: compatibilidade 2°C exige abstenção de reservas avaliadas em até US$17 tri — risco sistêmico financeiro que organiza a inação climática como defesa de balanço.',
      },
      {
        t: 'A fábrica de dúvidas (mesmo manual do tabaco)',
        did: 'Contrataram as MESMAS agências de relações públicas que o cigarro usou para negar que fazia mal. Financiaram institutos de fachada, semearram dúvida, compraram debates. Atrasaram décadas de ação — décadas de lucro.',
        adv: 'Merchants of Doubt (Oreskes/Conway): Global Climate Coalition + PR firms do tabaco — produção institucional de incerteza como estratégia de regulação adiada.',
      },
      {
        t: 'ISDS: quando a empresa processa o PLANETA',
        did: 'Existe um mecanismo internacional em que uma empresa pode PROCESSAR um país inteiro em tribunais privados — por bilhões — se ele aprovar lei ambiental que "ameace lucros futuros". A soberania popular perde para o lucro esperado.',
        adv: 'ISDS (Investor-State Dispute Settlement): arbitragem privado-internacional que monetiza regulação como expropriação — supremacia do direito de propriedade corporativa sobre soberania ecológica (Tienhaara).',
      },
    ],
    aprof: {
      autores: 'Andreas Malm · Jason Moore (fratura metabólica) · Naomi Oreskes',
      did: 'Marx já falava de "fratura metabólica": o capitalismo rasga o ciclo entre a terra e as pessoas. A crise climática é essa fratura em escala planetária — e quem a causou sabe exatamente o que fez, desde 1977.',
      adv: 'Fratura metabólica (Marx/Foster; Moore): ruptura do metabolismo sociedadenatureza via urbanização capitalista. Fossil Capital (Malm): o carbono como forma de comando sobre o trabalho — a crise climática como externalização racional do ponto de vista do capital.',
    },
  },
]

export const PLAYLIST_URL =
  'https://www.youtube.com/playlist?list=PLkBnPChzQkPxrzD7k3R7eGEvBkBEIZsYb'
