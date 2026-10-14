/**
 * MÓDULO 08 — CONSEQUÊNCIAS SISTÊMICAS: AS MORTES DO CAPITALISMO
 * Base: série em 8 episódios de Filipe Boni (YouTube) + literatura de
 * Davis, Williams, Rodney, Nixon, Patnaik, Hickel, Hochschild, Bevins,
 * Klein, Kadri, Malm, Harvey. Definições em três níveis de leitura (THEORY.md).
 */

import { pick, type Lang } from '../i18n'

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

type BiText = readonly [en: string, es: string]
type MechanismTr = { t: BiText; did: BiText; adv: BiText }
type EpisodeTr = {
  titulo: BiText
  curto: BiText
  periodo: BiText
  local: BiText
  vitimas: { numero: BiText; rotulo: BiText; did: BiText; adv: BiText }
  mecanismos: MechanismTr[]
  aprof: { autores: BiText; did: BiText; adv: BiText }
}

const EPISODE_TR: Record<string, EpisodeTr> = {
  americas: {
    titulo: ['The Colonization of the Americas and the genesis of global capitalism', 'La colonización de las Américas y la génesis del capitalismo global'],
    curto: ['Colonization of the Americas', 'Colonización de las Américas'],
    periodo: ['1492 – 17th century', '1492 – s. XVII'],
    local: ['Americas (Potosí, Zacatecas, Huancavelica)', 'Américas (Potosí, Zacatecas, Huancavelica)'],
    vitimas: {
      numero: ['50–90 million', '50–90 millones'],
      rotulo: ['Indigenous deaths · ~90% of the native population (60m → 5–6m)', 'muertes indígenas · ~90% de la población nativa (60 M → 5–6 M)'],
      did: ['The conquest of the Americas was one of the greatest catastrophes in human history: of every 10 people who lived here, 9 died.', 'La conquista de las Américas fue una de las mayores catástrofes de la historia humana: de cada 10 personas que vivían aquí, 9 murieron.'],
      adv: ['Demographic collapse of ~90% over a century and a half — the demographic and mineral basis of European primitive accumulation.', 'Colapso demográfico de ~90% en un siglo y medio — base demográfica y mineral de la acumulación primitiva europea.'],
    },
    mecanismos: [
      { t: ['Primitive accumulation: forced separation from the land', 'Acumulación primitiva: separación forzada de la tierra'], did: ['For capitalism to emerge, people first had to be forcibly dispossessed of what they held. In the Americas, land, gold and silver became property of European crowns — and native peoples were turned into enslaved labor.', 'Para que naciera el capitalismo, primero hubo que expulsar por la fuerza a personas de lo que poseían. En América, tierras, oro y plata pasaron a ser propiedad de las coronas europeas — y los pueblos originarios fueron convertidos en mano de obra esclavizada.'], adv: ['Primitive accumulation of capital: expropriation of native peoples from their territories to concentrate resources in the metropoles — cornerstone of the modern/colonial world-system (Wallerstein, Quijano).', 'Acumulación primitiva de capital: expropiación de los pueblos originarios de sus territorios para concentrar recursos en las metrópolis — piedra angular del sistema-mundo moderno/colonial (Wallerstein, Quijano).'] },
      { t: ['Encomienda and Mita: institutionalized forced labor', 'Encomienda y Mita: trabajo forzado institucionalizado'], did: ['Survivors were forced to work in mines on rotating shifts — a tax paid with life. Many who entered the mine never came back.', 'Los sobrevivientes fueron obligados a trabajar en las minas por turnos rotativos — un impuesto pagado con la vida. Muchos de quienes entraban a la mina no regresaban.'], adv: ['Institutions of colonial coercion: Encomienda and the Andean Mita organized rotations of forced labor for mines, regulating the rate at which labor power was destroyed.', 'Instituciones de coerción colonial: la Encomienda y la Mita andina organizaban rotaciones de trabajo forzado para las minas, regulando el ritmo de destrucción de la fuerza de trabajo.'] },
      { t: ['The ecological Great Dying: the climate cooled', 'La Gran Muerte ecológica: el clima se enfrió'], did: ['When tens of millions died, native farms were abandoned and forests regrew — so much CO₂ was absorbed that Europe entered a “Little Ice Age”. A human massacre so vast that it registered in the planet’s climate.', 'Cuando murieron decenas de millones, los campos indígenas fueron abandonados y los bosques volvieron a crecer — se absorbió tanto CO₂ que Europa entró en una “Pequeña Edad de Hielo”. Una masacre humana tan grande que quedó registrada en el clima del planeta.'], adv: ['“The Great Dying”: abandonment of ~56 million hectares of cultivated land → forest regeneration → sequestration of ~7 Gt CO₂ → anthropogenic contribution to the Little Ice Age (Ruddiman/Koch).', '“The Great Dying”: abandono de ~56 millones de hectáreas cultivadas → regeneración forestal → secuestro de ~7 Gt de CO₂ → contribución antropogénica a la Pequeña Edad de Hielo (Ruddiman/Koch).'] },
      { t: ['Requerimiento (1513): massacre on official letterhead', 'Requerimiento (1513): la masacre con papel oficial'], did: ['Before attacking, the Spanish read a document in Castilian that nobody understood: “accept the Crown and the Church”. Refusal made the war “just”. Modern law granting a legal license to massacre.', 'Antes de atacar, los españoles leían un documento en castellano que nadie entendía: “acepten la Corona y la Iglesia”. Si no aceptaban, la guerra se declaraba “justa”. El derecho moderno otorgando licencia jurídica a la masacre.'], adv: ['Legal-military device: the 1513 Requerimiento converted Indigenous resistance into “just war” and the crime of insubordination to Crown and Church — steel against macuahuitl with a notarial blessing.', 'Dispositivo jurídico-militar: el Requerimiento de 1513 convertía la resistencia indígena en “guerra justa” y delito de insubordinación a la Corona y la Iglesia — acero contra macuahuitl con bendición notarial.'] },
      { t: ['Silver and mercury: poisoned Potosí', 'Plata y mercurio: Potosí envenenado'], did: ['The silver that enriched Europe was processed with mercury — a poison that killed miners and contaminated rivers and soils to this day. The mountain “ate people” from the inside and outside.', 'La plata que enriqueció a Europa se procesaba con mercurio — un veneno que mató mineros y contaminó ríos y suelos hasta hoy. La montaña “comía gente” por dentro y por fuera.'], adv: ['Patio process (Medina, 1554): mercury amalgamation in Huancavelica/Potosí emitted >56,000 tonnes of Hg vapor — ~25% of pre-industrial chemical pollution in Latin America.', 'Proceso de patio (Medina, 1554): la amalgamación con mercurio en Huancavelica/Potosí emitió >56 mil toneladas de vapor de Hg — ~25% de la contaminación química preindustrial de América Latina.'] },
      { t: ['Price Revolution: capitalism’s first inflation', 'Revolución de los Precios: la primera inflación del capitalismo'], did: ['So much silver reached Europe that prices rose 600% over two centuries. Peasants and wage earners were ruined; Dutch and English bankers grew rich. American blood financed the birth of European finance.', 'Llegó tanta plata a Europa que los precios subieron 600% en dos siglos. Campesinos y asalariados quebraron; banqueros neerlandeses e ingleses se enriquecieron. La sangre americana financió el nacimiento de las finanzas europeas.'], adv: ['Price Revolution (16th–17th centuries): ~600% inflation eroded real wages; silver from Potosí/Zacatecas served as collateral for the credit networks of Fugger, Welser and Dutch/English banking.', 'Revolución de los Precios (s. XVI–XVII): inflación de ~600% erosionando salarios reales; la plata de Potosí/Zacatecas sirvió de colateral a las redes de crédito de Fugger, Welser y la banca neerlandesa/inglesa.'] },
    ],
    aprof: { autores: ['Wallerstein · Quijano · Hochschild (context)', 'Wallerstein · Quijano · Hochschild (contexto)'], did: ['The conquest was not an “encounter of worlds”: it was the bloody foundation of the modern world — on one side those who command and accumulate, on the other those who supply labor and raw materials. Spanish laws regulated HOW MUCH to exploit, never WHETHER to exploit.', 'La conquista no fue un “encuentro de mundos”: fue la fundación sangrienta del mundo moderno — de un lado quienes mandan y acumulan, del otro quienes aportan trabajo y materia prima. Las leyes españolas regulaban CUÁNTO explotar, nunca SI explotar.'], adv: ['Modern/colonial world-system (Wallerstein; coloniality of power, Quijano): the Laws of Burgos (1512) and New Laws (1542) reveal the dynamic of colonial law — regulating the degree of exploitation to preserve labor power without ever ending surplus-labor extraction.', 'Sistema-mundo moderno/colonial (Wallerstein; colonialidad del poder, Quijano): las Leyes de Burgos (1512) y Leyes Nuevas (1542) muestran la dinámica del derecho colonial — regular el grado de explotación para preservar la fuerza de trabajo sin cesar jamás la extracción de sobretrabajo.'] },
  },
  escravidao: {
    titulo: ['The transatlantic slave trade financed the Industrial Revolution', 'La esclavitud transatlántica financió la Revolución Industrial'],
    curto: ['Transatlantic slavery', 'Esclavitud transatlántica'],
    periodo: ['16th century – 1860s', 's. XVI – década de 1860'],
    local: ['Africa · Caribbean · Brazil · US South', 'África · Caribe · Brasil · Sur de EE. UU.'],
    vitimas: { numero: ['15–20 million', '15–20 millones'], rotulo: ['African deaths (capture, marches, Middle Passage, plantation)', 'muertes africanas (captura, marchas, Paso Medio, plantación)'], did: ['Beyond those who crossed the ocean in death holds, millions died in wars of capture and forced marches to the coast. Every sweet spoonful of sugar in Europe carried a blood cost in Africa.', 'Además de quienes cruzaron el océano en bodegas de muerte, millones murieron en guerras de captura y marchas forzadas hasta la costa. Cada dulce cucharada de azúcar en Europa tenía un costo de sangre en África.'], adv: ['Direct and indirect human cost of the trade: wars of capture, forced marches, Middle Passage mortality and life expectancy of only a few years on plantations.', 'Costo humano directo e indirecto del tráfico: guerras de captura, marchas forzadas, mortalidad del Paso Medio y esperanza de vida de pocos años en las plantaciones.'] },
    mecanismos: [
      { t: ['Eric Williams’s thesis: slavery financed industry', 'Tesis de Eric Williams: la esclavitud financió la industria'], did: ['Profits from the slave trade and slave-grown sugar/cotton financed the factories of the British Industrial Revolution. Slavery was not a capitalist “backwardness” — it was fuel for its takeoff.', 'Las ganancias del tráfico esclavista y del azúcar/algodón producidos por esclavos financiaron las fábricas de la Revolución Industrial británica. La esclavitud no fue un “atraso” del capitalismo — fue combustible para su despegue.'], adv: ['Williams thesis (Capitalism and Slavery): profits from the trade and Caribbean/American plantations financed British industrialization; abolition (1833+) served a structural demand for wage markets, not philanthropy.', 'Tesis de Williams (Capitalismo y esclavitud): las ganancias del tráfico y de las plantaciones caribeñas/americanas financiaron la industrialización británica; la abolición (1833+) atendió una demanda estructural de mercados asalariados, no a la filantropía.'] },
      { t: ['Africa deliberately impoverished', 'África empobrecida deliberadamente'], did: ['The trade removed tens of millions of young people of working and childbearing age. By 1850, Africa had half the population it should have had. African underdevelopment was not an accident: it was produced.', 'El tráfico arrebató a decenas de millones de jóvenes en edad de trabajar y tener hijos. En 1850, África tenía la mitad de la población que debería haber tenido. El subdesarrollo africano no fue accidente: fue producido.'], adv: ['Rodney/Manning: removal of tens of millions of people of productive/reproductive age stagnated the African population at ~50m in 1850 (vs ~100m projected) — underdevelopment as active production of the colonial metabolism.', 'Rodney/Manning: la extracción de decenas de millones de personas en edad productiva/reproductiva estancó la población africana en ~50 M en 1850 (frente a ~100 M proyectados) — subdesarrollo como producción activa del metabolismo colonial.'] },
      { t: ['The plantation was history’s first “factory”', 'La plantación fue la primera “fábrica” de la historia'], did: ['Before Manchester’s factories, there were already production lines with clocks, shifts and total discipline — in sugar mills and cotton fields. The industrial model was rehearsed on enslaved bodies.', 'Antes de las fábricas de Manchester ya existían líneas de producción con reloj, turnos y disciplina total — en ingenios azucareros y campos de algodón. El modelo industrial se ensayó sobre cuerpos esclavizados.'], adv: ['Plantation as proto-industry: time discipline and continuous labor preceded the factory; slave-grown cotton from the US South supplied 75% of Lancashire’s raw material.', 'La plantación como protoindustria: disciplina temporal y trabajo continuo preceden a la fábrica; el algodón esclavista del Sur de EE. UU. suministraba 75% de la materia prima de Lancashire.'] },
      { t: ['Human beings as financial assets', 'Seres humanos como activos financieros'], did: ['Enslaved people were mortgaged, pledged and insured as commodities. On the Zong (1781), 133 Africans were thrown alive into the sea so the owners could COLLECT insurance. The insurer was Lloyd’s of London.', 'Las personas esclavizadas eran hipotecadas, empeñadas y aseguradas como mercancía. En el Zong (1781), 133 africanos fueron arrojados vivos al mar para que los dueños pudieran COBRAR el seguro. La aseguradora era Lloyd’s de Londres.'], adv: ['Financialization of life: bodies as insurable collateral — Zong Massacre (1781): 133 Africans thrown overboard to trigger a Lloyd’s marine policy; Gregson v. Gilbert litigation as a mirror of fetishism.', 'Financiarización de la vida: cuerpos como colateral asegurable — Masacre del Zong (1781): 133 africanos arrojados al mar para activar una póliza marítima de Lloyd’s; litigio Gregson v. Gilbert como espejo del fetichismo.'] },
      { t: ['Abolition paid the owners, not the enslaved', 'La abolición pagó a los dueños, no a los esclavizados'], did: ['When the UK abolished slavery (1833), it paid £20 million — 40% of the state budget — in compensation TO OWNERS. To the enslaved: zero. Taxpayers serviced the debt until 2015.', 'Cuando el Reino Unido abolió la esclavitud (1833), pagó £20 millones — 40% del presupuesto estatal — de indemnización A LOS PROPIETARIOS. A los esclavizados: cero. Los contribuyentes pagaron la deuda hasta 2015.'], adv: ['Slavery Abolition Act (1833): £20m (~5% of GDP; 40% of the budget) compensated owners; financed by a loan whose servicing continued until 2015 — a state transfer that consolidated rentier wealth.', 'Slavery Abolition Act (1833): £20 M (~5% del PIB; 40% del presupuesto) compensaron a propietarios; financiado con un préstamo cuyo servicio continuó hasta 2015 — transferencia estatal que consolidó patrimonio rentista.'] },
    ],
    aprof: { autores: ['Eric Williams · Walter Rodney · C.L.R. James · Trotsky', 'Eric Williams · Walter Rodney · C.L.R. James · Trotsky'], did: ['Cheap sugar and sweetened tea/coffee fed English workers for less money — allowing employers to pay lower wages and raise profits. Cheap calories in the North were made with blood from the South.', 'El azúcar barato y el té/café endulzados alimentaban a los obreros ingleses por menos dinero — permitiendo al patrón pagar salarios menores y ganar más. Las calorías baratas del Norte se hacían con sangre del Sur.'], adv: ['Uneven and combined development: unpaid labor in American fields coexists with hyper-exploited wage labor in Lancashire; sugar/tea/coffee lower the value of European labor power, raising the industrial rate of surplus value.', 'Desarrollo desigual y combinado: trabajo no pagado en los campos americanos coexiste con asalariados hiperexplotados en Lancashire; azúcar/té/café abaratan el valor de la fuerza de trabajo europea, elevando la tasa industrial de plusvalía.'] },
  },
  india: {
    titulo: ['British “free markets” and structural famines in India', 'El “libre mercado” británico y las hambrunas estructurales en India'], curto: ['Colonial famines in India', 'Hambrunas coloniales en India'], periodo: ['1770 – 1943', '1770 – 1943'], local: ['Colonial India (Bengal, Deccan)', 'India colonial (Bengala, Decán)'],
    vitimas: { numero: ['30–165 million', '30–165 millones'], rotulo: ['famine deaths under British rule · 165m excess deaths in 1880–1920 alone', 'muertes por hambre bajo dominio británico · 165 M de exceso solo entre 1880–1920'], did: ['Famines in colonial India were not simply “lack of rain”: they were shaped by state policy. Estimates range from 30 million to 165 million excess deaths.', 'Las hambrunas de la India colonial no fueron simplemente “falta de lluvia”: estuvieron moldeadas por la política estatal. Las estimaciones van de 30 millones a 165 millones de muertes en exceso.'], adv: ['Traditional estimate 30–60m; Hickel/Patnaik calculate 165m excess deaths in 1880–1920 — famine as a policy of accumulation, not a natural catastrophe.', 'Estimación tradicional 30–60 M; Hickel/Patnaik calculan 165 M de muertes en exceso entre 1880–1920 — hambre como política de acumulación, no catástrofe natural.'] },
    mecanismos: [
      { t: ['Forced deindustrialization: breaking the looms', 'Desindustrialización forzada: romper los telares'], did: ['India made some of the world’s most coveted textiles. Britain taxed Indian cloth in Europe, flooded India with factory textiles and broke artisanal looms: from 38% of trade to 3% in a century.', 'India producía algunos de los tejidos más codiciados del mundo. Gran Bretaña gravó los textiles indios en Europa, inundó India con tejidos fabriles y quebró los telares artesanales: de 38% del comercio a 3% en un siglo.'], adv: ['Deliberate deindustrialization: Indian weaving falls from 38% (1730) to 3% (1840) of West African trade — asymmetric tariffs + Manchester manufacturing dumping.', 'Desindustrialización deliberada: el tejido indio cae de 38% (1730) a 3% (1840) del comercio de África Occidental — aranceles asimétricos + dumping manufacturero de Manchester.'] },
      { t: ['Cash taxes: the Zamindari trap', 'Impuestos en efectivo: la trampa del Zamindari'], did: ['Colonizers privatized common lands and demanded taxes IN CASH. No cash? Sell the food harvest — or borrow from the moneylender. The result: cotton and opium for export while people went hungry.', 'Los colonizadores privatizaron tierras comunales y exigieron impuestos EN DINERO. ¿Sin dinero? Vender la cosecha de alimentos — o pedir al usurero. Resultado: algodón y opio para exportación mientras la gente pasaba hambre.'], adv: ['Zamindari (Permanent Settlement, 1793) and Ryotwari: privatization of common lands + exclusively monetary taxation → peasant indebtedness and conversion of food land to export crops (cotton, jute, opium).', 'Zamindari (Permanent Settlement, 1793) y Ryotwari: privatización de tierras comunales + tributación exclusivamente monetaria → endeudamiento campesino y conversión de alimentos en cultivos de exportación (algodón, yute, opio).'] },
      { t: ['Drain of Wealth: US$45 trillion drained', 'Drain of Wealth: US$45 billones drenados'], did: ['The Crown collected taxes in India, used that money to “buy” Indian goods and resold them abroad, keeping the proceeds. The estimate: roughly US$45 TRILLION drained from India over 173 years.', 'La Corona cobraba impuestos en India, usaba ese dinero para “comprar” productos indios y los revendía en el exterior, quedándose con lo recaudado. La estimación: cerca de US$45 BILLONES drenados de India en 173 años.'], adv: ['Drain of Wealth (Naoroji/Patnaik): rupee taxes monetized exports whose profit was retained in London — ≈US$45tn (1765–1938), financing settler colonies and the Gold Standard.', 'Drain of Wealth (Naoroji/Patnaik): impuestos en rupias monetizaban exportaciones cuyo beneficio quedaba en Londres — ≈US$45 bill. (1765–1938), financiando colonias de poblamiento y el Patrón Oro.'] },
      { t: ['Famine as a laboratory: the “Temple ration”', 'El hambre como laboratorio: la “Ración Temple”'], did: ['During droughts, the empire applied “free-market” dogma: no relief that might “discourage work”. Distance tests determined access to food and rations were 1,627 calories — LESS than in Nazi concentration camps.', 'Durante las sequías, el Imperio aplicaba el dogma del “libre mercado”: nada de ayuda que “desalentara el trabajo”. Pruebas de distancia determinaban el acceso a comida y las raciones eran de 1.627 calorías — MENOS que en campos de concentración nazis.'], adv: ['Malthusian biopolitics: dogmatic laissez-faire under Lytton; “Temple Wage” of 1,627 kcal/day for hard labor (below Buchenwald rationing) and “Distance Test” as a survival filter.', 'Biopolítica maltusiana: laissez-faire dogmático bajo Lytton; “Temple Wage” de 1.627 kcal/día para trabajo pesado (por debajo del racionamiento de Buchenwald) y “Distance Test” como filtro de supervivencia.'] },
      { t: ['Bengal 1943: Churchill and scorched earth', 'Bengala 1943: Churchill y la tierra arrasada'], did: ['In the last great famine, Churchill confiscated boats and rice stocks in Bengal “to block the Japanese” — and 3 million Indians died while food was stockpiled for the British military.', 'En la última gran hambruna, Churchill confiscó barcos y reservas de arroz en Bengala “para bloquear a los japoneses” — y 3 millones de indios murieron mientras se almacenaba comida para el ejército británico.'], adv: ['Denial Policy (1942–43): confiscation of boats/stocks in Bengal; 0.8–3.8m deaths while grain continued to military reserves — denial of relief under wartime rhetoric.', 'Denial Policy (1942–43): confiscación de embarcaciones/reservas en Bengala; 0,8–3,8 M de muertos mientras el grano seguía hacia reservas militares — negación de ayuda con retórica de guerra.'] },
    ],
    aprof: { autores: ['Mike Davis · Utsa Patnaik · Jason Hickel · Amartya Sen', 'Mike Davis · Utsa Patnaik · Jason Hickel · Amartya Sen'], did: ['The railways and telegraphs built by the British did not save people: they served to MOVE GRAIN OUT of famine areas, straight to export ports. The infrastructure was built to drain, not to feed.', 'Los ferrocarriles y telégrafos construidos por los británicos no salvaron a nadie: servían para SACAR EL GRANO de las regiones hambrientas hacia puertos de exportación. La infraestructura fue construida para drenar, no para alimentar.'], adv: ['“Late Victorian Holocausts” (Davis): rail/telegraph integrated India into the world market as a conduit draining grain from famine zones to ports; Sen (entitlements): famine is collapse of access, not availability — food was available.', '“Holocaustos de la era victoriana tardía” (Davis): ferrocarril/telegrafía integraron India al mercado mundial como conducto de drenaje de granos desde zonas hambrientas a puertos; Sen (entitlements): el hambre es colapso de acceso, no de disponibilidad — disponibilidad había.'] },
  },
  congo: {
    titulo: ['The Congo Free State: a country became private property', 'El Estado Libre del Congo: un país convertido en propiedad privada'], curto: ['Leopold II’s Congo', 'Congo de Leopoldo II'], periodo: ['1885 – 1920', '1885 – 1920'], local: ['Congo Basin', 'Cuenca del Congo'],
    vitimas: { numero: ['~10 million', '~10 millones'], rotulo: ['deaths · ~50% of Congo’s population', 'muertos · ~50% de la población del Congo'], did: ['An entire country became the property of ONE man — King Leopold II of Belgium. In 35 years, half of the Congolese population died producing rubber.', 'Un país entero se convirtió en propiedad de UN hombre — el rey Leopoldo II de Bélgica. En 35 años, la mitad de la población congoleña murió produciendo caucho.'], adv: ['≈10m deaths (1885–1920), ~50% of the population: forced-labor regime for wild-rubber extraction under private dynastic ownership.', '≈10 M de muertos (1885–1920), ~50% de la población: régimen de trabajo forzado para extraer caucho silvestre bajo propiedad dinástica privada.'] },
    mecanismos: [
      { t: ['Berlin 1884–85: a country as one man’s property', 'Berlín 1884–85: el país como propiedad de un hombre'], did: ['At the Berlin Conference, the powers partitioned Africa. Congo did not become a Belgian colony: it became King Leopold II’s PRIVATE PROPERTY — 2.6 million km², 85 times the size of Belgium.', 'En la Conferencia de Berlín, las potencias se repartieron África. El Congo no se convirtió en colonia de Bélgica: se convirtió en PROPIEDAD PRIVADA del rey Leopoldo II — 2,6 millones de km², 85 veces Bélgica.'], adv: ['Berlin Conference (1884–85): the État Indépendant du Congo as private dynastic property (2.6m km², 85× Belgium) — pure form of capital-sovereignty.', 'Conferencia de Berlín (1884–85): el État Indépendant du Congo como propiedad dinástica privada (2,6 M km², 85× Bélgica) — forma pura de soberanía-capital.'] },
      { t: ['The tire created demand: rubber became gold', 'El neumático creó la demanda: el caucho se volvió oro'], did: ['The pneumatic tire was invented in 1887. Suddenly, rubber from Congo’s forests became strategic raw material for a new global industry — and collecting it became a forced-labor quota punishable by death.', 'En 1887 se inventó el neumático. De pronto, el caucho de los bosques del Congo se volvió materia prima estratégica de una nueva industria mundial — y recolectarlo se convirtió en cuota de trabajo forzado bajo pena de muerte.'], adv: ['Second Industrial Revolution: pneumatic tire (Dunlop, 1887) turns wild latex (Landolphia) into a strategic commodity — exogenous demand determines the intensity of terror.', 'Segunda Revolución Industrial: el neumático (Dunlop, 1887) convierte el látex silvestre (Landolphia) en commodity estratégica — la demanda exógena determina la intensidad del terror.'] },
      { t: ['“No man’s land”: expropriation by decree', '“Tierra de nadie”: expropiación por decreto'], did: ['By decree, ALL land “not used in the European manner” became property of Leopold’s state. Congolese people were forbidden to hunt, fish or gather in their own forest — they could only collect rubber FOR him.', 'Por decreto, TODAS las tierras “no usadas al modo europeo” pasaron a ser propiedad del Estado de Leopoldo. A los congoleños se les prohibió cazar, pescar y recolectar en su propio bosque — solo podían recolectar caucho PARA él.'], adv: ['1891/92 decrees (terra nullius): all “unoccupied” lands nationalized; populations deprived of subsistence access — legal expropriation forcing the sale of labor power or direct forced labor.', 'Decretos de 1891/92 (terra nullius): todas las tierras “desocupadas” nacionalizadas; poblaciones privadas de acceso de subsistencia — expropiación jurídica que fuerza la venta de fuerza de trabajo o el trabajo forzado directo.'] },
      { t: ['Severed hands as ammunition accounting', 'Manos cortadas como contabilidad de munición'], did: ['Militias had rubber quotas and bullet quotas. Every shot had to be accounted for with proof: the RIGHT HAND cut from a Congolese person — alive or dead. Families were held hostage until quotas were met.', 'Las milicias tenían cuotas de caucho y de balas. Cada disparo debía justificarse con una prueba: la MANO DERECHA cortada de una persona congoleña — viva o muerta. Familias eran tomadas como rehenes hasta cumplir la cuota.'], adv: ['Concession companies (ABIR, Anversoise) paid administrators per tonne; Force Publique required proof of cartridge use via right-hand amputation — macabre accounting of economic incentives for terror; hostages (women/children) as quota collateral.', 'Concesionarias (ABIR, Anversoise) pagaban a administradores por tonelada; Force Publique exigía prueba del uso de cartuchos mediante amputación de la mano derecha — contabilidad macabra del incentivo económico al terror; rehenes (mujeres/niños) como garantía de cuota.'] },
      { t: ['Profits became buildings in Belgium', 'Las ganancias se convirtieron en edificios en Bélgica'], did: ['The railway that moved rubber was built over thousands of deaths. The money financed monuments, museums and avenues in Brussels — Belgium is, in part, an undeclared memorial to the plunder of Congo.', 'El ferrocarril que sacaba el caucho fue construido sobre miles de muertos. El dinero financió monumentos, museos y avenidas de Bruselas — Bélgica es, en parte, un memorial no declarado al saqueo del Congo.'], adv: ['Export infrastructure (Matadi-Leopoldville) built with forced labor; profits capitalized into Belgian urban infrastructure — primitive accumulation spatially detached from its human cost.', 'Infraestructura de exportación (Matadi-Leopoldville) construida con trabajo forzado; ganancias capitalizadas en infraestructura urbana belga — acumulación primitiva espacialmente desacoplada de su costo humano.'] },
    ],
    aprof: { autores: ['Adam Hochschild · Jules Marchal · David Harvey', 'Adam Hochschild · Jules Marchal · David Harvey'], did: ['Congo shows capitalism without makeup: when no law protects workers, this is the result. And it did not end: today the same ground supplies coltan and cobalt for phones and electric cars in the North.', 'El Congo muestra el capitalismo sin maquillaje: cuando ninguna ley protege al trabajador, este es el resultado. Y no terminó: hoy el mismo suelo provee coltán y cobalto para celulares y autos eléctricos del Norte.'], adv: ['“King Leopold’s Ghost” (Hochschild): Congo as a pure form of capital without institutional mediation. Extractive continuity: coltan/cobalt/gold from Kivu feed the North’s energy transition (accumulation by dispossession, Harvey).', '“El fantasma del rey Leopoldo” (Hochschild): el Congo como forma pura del capital sin mediación institucional. Continuidad extractiva: coltán/cobalto/oro de Kivu alimentan la transición energética del Norte (acumulación por desposesión, Harvey).'] },
  },
  indonesia: {
    titulo: ['Indonesia 1965: the massacre that opened the country to foreign capital', 'Indonesia 1965: la masacre que abrió el país al capital extranjero'], curto: ['Indonesia 1965', 'Indonesia 1965'], periodo: ['1965 – 1998', '1965 – 1998'], local: ['Indonesia (Jakarta, West Papua)', 'Indonesia (Yakarta, Papúa Occidental)'],
    vitimas: { numero: ['500,000 – 1 million', '500 mil – 1 millón'], rotulo: ['executed in the anticommunist mass killings (1965–66)', 'ejecutados en las matanzas anticomunistas (1965–66)'], did: ['In less than a year, between half a million and one million people — trade unionists, peasants, teachers, activists — were hunted down and executed. And the world applauded the “economic miracle” that followed.', 'En menos de un año, entre medio millón y un millón de personas — sindicalistas, campesinos, profesores, militantes — fueron perseguidas y ejecutadas. Y el mundo aplaudió el “milagro económico” que vino después.'], adv: ['Anticommunist mass killings (1965–66): 500,000–1m killed by the army and militias — condition for Suharto’s “New Order” opening to foreign capital (Bevins, The Jakarta Method).', 'Matanzas anticomunistas (1965–66): 500 mil–1 M de muertos a manos del ejército y milicias — condición de apertura del “Nuevo Orden” de Suharto al capital extranjero (Bevins, El método Yakarta).'] },
    mecanismos: [
      { t: ['Before: Indonesian oil belonged to the people', 'Antes: el petróleo pertenecía al pueblo indonesio'], did: ['President Sukarno had declared Indonesian oil the property of the people — and forced US and British oil companies to hand 60% of profits to the state. That arrangement could not stand.', 'El presidente Sukarno había declarado que el petróleo indonesio era propiedad del pueblo — y obligó a las petroleras estadounidenses y británicas a entregar 60% de sus ganancias al Estado. Ese arreglo no podía mantenerse.'], adv: ['Law No. 44/1960: oil as popular property; Caltex, Stanvac and Shell required to transfer 60% of profits — resource-based nationalism incompatible with the Atlantic bloc.', 'Ley nº 44/1960: petróleo como propiedad popular; Caltex, Stanvac y Shell obligadas a transferir 60% de las ganancias — nacionalismo basado en recursos incompatible con el bloque atlantista.'] },
      { t: ['Name lists supplied by the CIA', 'Listas de nombres suministradas por la CIA'], did: ['After Suharto’s coup, the US embassy supplied lists containing thousands of names of communist activists, trade unionists and peasants — who were executed one by one. Washington followed the process and marked names as “completed”.', 'Tras el golpe de Suharto, la embajada de EE. UU. entregó listas con miles de nombres de militantes comunistas, sindicalistas y campesinos — ejecutados uno por uno. Washington seguía el proceso y marcaba los “completados”.'], adv: ['US operational support: embassy/CIA supplied nominal lists of PKI cadres, unionists (SOBSI) and peasants (BTI) — execution verification documented in declassified cables.', 'Apoyo operativo de EE. UU.: embajada/CIA suministraron listas nominales de cuadros del PKI, sindicalistas (SOBSI) y campesinos (BTI) — verificación de ejecuciones documentada en cables desclasificados.'] },
      { t: ['The “Berkeley Mafia”: economists trained in the US', 'La “Mafia de Berkeley”: economistas formados en EE. UU.'], did: ['A group of Indonesian economists trained at US universities (with Ford and Rockefeller foundation money) took over economic policy and applied a ready-made prescription: austerity, subsidy cuts and broad opening to foreign capital.', 'Un grupo de economistas indonesios formado en universidades estadounidenses (con dinero de las fundaciones Ford y Rockefeller) tomó el control de la política económica y aplicó una receta preparada: austeridad, recortes de subsidios y amplia apertura al capital extranjero.'], adv: ['Berkeley Mafia: cadres trained at UC Berkeley with Ford/Rockefeller funding implemented orthodox stabilization, subsidy cuts and liberalization — technical capture of the state apparatus.', 'Berkeley Mafia: cuadros formados en UC Berkeley con financiamiento Ford/Rockefeller implementaron estabilización ortodoxa, recortes de subsidios y liberalización — captura técnica del aparato estatal.'] },
      { t: ['Geneva 1967: the country was parceled out at a conference', 'Ginebra 1967: el país fue repartido en una conferencia'], did: ['Two years after the massacre, generals and executives from some of the world’s largest corporations met in Switzerland — and left with pieces of Indonesia: mines, forests and oil.', 'Dos años después de la masacre, generales y ejecutivos de algunas de las mayores corporaciones del mundo se reunieron en Suiza — y salieron con partes de Indonesia: minas, bosques y petróleo.'], adv: ['Geneva Conference (1967): generals × executives (Time-Life, banks, mining companies) — allocation of Indonesian assets as a post-terror institutional design.', 'Conferencia de Ginebra (1967): generales × ejecutivos (Time-Life, bancos, mineras) — reparto de activos indonesios como diseño institucional posterior al terror.'] },
      { t: ['Law 1/1967: full exemption and a mountain of gold', 'Ley 1/1967: exención total y una montaña de oro'], did: ['The new investment law supplied the missing pieces: zero tax, unlimited profit remittances abroad, and a mountain of GOLD in West Papua handed to US miner Freeport.', 'La nueva ley de inversiones aportó lo que faltaba: impuesto cero, remesa ilimitada de ganancias al exterior y una montaña de ORO en Papúa Occidental entregada a la minera estadounidense Freeport.'], adv: ['Foreign Investment Law No. 1/1967: full tax holiday, unlimited profit remittance, territorial concessions — Freeport-McMoRan at Ertsberg/Grasberg (West Papua) as the emblematic case.', 'Foreign Investment Law nº 1/1967: exención fiscal total, remesa ilimitada de ganancias, concesiones territoriales — Freeport-McMoRan en Ertsberg/Grasberg (Papúa Occidental) como caso emblemático.'] },
      { t: ['Wages of 10 cents a day', 'Salarios de 10 centavos al día'], did: ['With union leaders dead, there was nobody left to bargain. Industrial wages fell to roughly 10 US cents PER DAY. That was the “Indonesian miracle”.', 'Con los líderes sindicales muertos, no quedaba quién negociara. Los salarios industriales cayeron a unos 10 centavos de dólar POR DÍA. Ese era el “milagro indonesio”.'], adv: ['Post-terror super-exploitation: physical elimination of union leadership (SOBSI) depressed industrial wages to ~US$0.10/day — wage compression offered as comparative advantage to global capital.', 'Superexplotación posterior al terror: eliminación física de dirigentes sindicales (SOBSI) deprimió salarios industriales a ~US$0,10/día — compresión salarial ofrecida como ventaja comparativa al capital global.'] },
    ],
    aprof: { autores: ['Vincent Bevins · David Harvey · Andreas Harsono', 'Vincent Bevins · David Harvey · Andreas Harsono'], did: ['The Jakarta Method became a manual: kill the popular movement, open the country and call it a miracle. The same script was repeated in Latin America in the 1970s. The land reform that threatened large estates died with the peasants.', 'El Método Yakarta se volvió manual: matar al movimiento popular, abrir el país y llamarlo milagro. El mismo guion se repitió en América Latina en los años 70. Y la reforma agraria que amenazaba a los latifundios murió junto con los campesinos.'], adv: ['Bevins: the Jakarta method as a template for pro-market counterinsurgency in the Global South. Accumulation by dispossession (Harvey): revocation of Agrarian Reform (1960), conversion of millions of hectares to palm/nickel — dispossession as accumulation.', 'Bevins: el método Yakarta como plantilla de contrainsurgencia promercado en el Sur Global. Acumulación por desposesión (Harvey): revocación de la Reforma Agraria (1960), conversión de millones de hectáreas a palma/níquel — desposesión como acumulación.'] },
  },
  bhopal: {
    titulo: ['Bhopal 1984: when cutting costs matters more than thousands of lives', 'Bhopal 1984: cuando recortar costos vale más que miles de vidas'], curto: ['Bhopal (Union Carbide)', 'Bhopal (Union Carbide)'], periodo: ['1984 – today', '1984 – hoy'], local: ['Bhopal, India', 'Bhopal, India'],
    vitimas: { numero: ['3,000 dead · 570,000 poisoned', '3.000 muertos · 570 mil intoxicados'], rotulo: ['on the night of the disaster and in the following decades', 'en la noche del desastre y en las décadas siguientes'], did: ['In a single night, poisonous gas leaked over a sleeping city: 3,000 died by morning. Half a million people carry illnesses for the rest of their lives — and so do their children and grandchildren.', 'En una sola noche, un gas venenoso se filtró sobre una ciudad dormida: 3.000 murieron antes del amanecer. Medio millón de personas cargan enfermedades por el resto de sus vidas — y también sus hijos y nietos.'], adv: ['3,000 immediate deaths; 500–570k with chronic morbidity (MIC — methyl isocyanate): largest industrial catastrophe in history, with documented transgenerational harm.', '3.000 muertes inmediatas; 500–570 mil con morbilidad crónica (MIC — isocianato de metilo): mayor catástrofe industrial de la historia, con daño transgeneracional documentado.'] },
    mecanismos: [
      { t: ['The factory was born from the “Green Revolution”', 'La fábrica nació de la “Revolución Verde”'], did: ['The Union Carbide plant was built in India to make crop poison (the pesticide Sevin), pushing Indian agriculture toward dependence on agrochemicals.', 'La planta de Union Carbide se montó en India para producir veneno agrícola (el pesticida Sevin), empujando la agricultura india hacia la dependencia de agroquímicos.'], adv: ['UCIL (1969): Sevin (carbaryl) production using MIC as an intermediate — integration of Indian agriculture into the Green Revolution technological package (dependence on corporate inputs).', 'UCIL (1969): producción de Sevin (carbaril) mediante MIC como intermediario — inserción de la agricultura india en el paquete tecnológico de la Revolución Verde (dependencia de insumos corporativos).'] },
      { t: ['Cut costs: fewer people, less training, safety shut down', 'Recortar costos: menos gente, menos capacitación, seguridad apagada'], did: ['When pesticide sales fell, headquarters ordered cuts: staff in the most dangerous unit fell from 13 to 6, training from 540 days to 17, and the refrigeration system that kept the gas safe was SHUT OFF for six months.', 'Cuando cayó la venta del pesticida, la matriz ordenó recortes: el equipo del sector más peligroso bajó de 13 a 6, la capacitación de 540 días a 17, y el sistema de refrigeración que mantenía seguro el gas quedó APAGADO durante seis meses.'], adv: ['Aggressive cost reduction after demand fell: MIC staff 13→6; training 540→17 days; MIC tank refrigeration disabled ~6 months — deliberate degradation of safety margins.', 'Reducción agresiva de costos tras la caída de demanda: personal MIC 13→6; capacitación 540→17 días; refrigeración del tanque MIC desactivada ~6 meses — degradación deliberada de márgenes de seguridad.'] },
      { t: ['Double standard: the US sister plant was safer', 'Doble estándar: la planta hermana en EE. UU. era más segura'], did: ['The sister plant in the US had computer monitoring, smaller gas inventories and functioning equipment. In India, broken equipment stayed broken. Indian lives were valued less on the balance sheet.', 'La planta hermana en EE. UU. tenía monitoreo informático, menos gas almacenado y equipos funcionando. En India, lo roto seguía roto. Las vidas indias valían menos en el balance.'], adv: ['Asymmetric standards: sister plant in Institute, WV with SCADA, minimal inventories and operational scrubbers vs maintenance suspended in Bhopal — differentiated pricing of risk by nationality.', 'Asimetría de estándares: planta gemela en Institute, WV con SCADA, inventarios mínimos y scrubbers operativos frente a mantenimiento suspendido en Bhopal — fijación diferenciada del riesgo por nacionalidad.'] },
      { t: ['US$500 per victim: the “justice” of the settlement', 'US$500 por víctima: la “justicia” del acuerdo'], did: ['Responsibility? The company promoted a theory of “employee sabotage”. Seven years later, the settlement closed everything for US$465 million — roughly US$500 per victim. Less than an iPhone.', '¿Responsabilidad? La empresa promovió la teoría del “sabotaje de un empleado”. Siete años después, el acuerdo cerró todo por US$465 millones — unos US$500 por víctima. Menos que un iPhone.'], adv: ['Impunity strategy: individual-sabotage theory to shield management structure; 1989 settlement of US$465m — ~US$500 per average victim, approved by India’s Supreme Court.', 'Estrategia de impunidad: teoría de sabotaje individual para blindar la estructura gestora; acuerdo de 1989 por US$465 M — ~US$500 por víctima promedio, homologado por la Corte Suprema india.'] },
      { t: ['Slow violence: the poison remains today', 'Violencia lenta: el veneno continúa hasta hoy'], did: ['The toxic waste was never removed. It seeped into soil and water, causing malformations and cancer even among victims’ grandchildren. Dow Chemical, which bought the company, says it is not responsible.', 'Los residuos tóxicos nunca fueron retirados. Se infiltraron en suelo y agua, causando malformaciones y cáncer incluso en nietos de las víctimas. Dow Chemical, que compró la empresa, dice no ser responsable.'], adv: ['Slow violence (Nixon): persistent aquifer contamination from unremediated waste — deferred damage invisible to markets; Dow Chemical (acquirer 2001) denies successor liability.', 'Slow violence (Nixon): contaminación persistente de acuíferos por residuos no remediados — daño diferido e invisible al mercado; Dow Chemical (adquirente en 2001) niega responsabilidad sucesoria.'] },
    ],
    aprof: { autores: ['Rob Nixon · Ulrich Beck (context) · Sathyu Sarangi', 'Rob Nixon · Ulrich Beck (contexto) · Sathyu Sarangi'], did: ['Bhopal shows a rule of corporate globalization: profit rises to the US, poison stays in India. And “slow violence” does not make headlines — it appears gradually in the water and bodies of later generations.', 'Bhopal muestra una regla de la globalización corporativa: la ganancia sube a EE. UU., el veneno queda en India. Y la “violencia lenta” no ocupa titulares — aparece poco a poco en el agua y en los cuerpos de generaciones posteriores.'], adv: ['Slow violence (Nixon): deferred destruction, outside media/financial scanning, imposed on peripheral “sacrifice zones” — asymmetric risk externalization in the global value chain (Beck: reflexive modernization without democratization of risk).', 'Slow violence (Nixon): destrucción diferida, fuera del escaneo mediático-financiero, sobre “zonas de sacrificio” periféricas — externalización asimétrica del riesgo en la cadena global de valor (Beck: modernización reflexiva sin democratización del riesgo).'] },
  },
  iraque: {
    titulo: ['Iraq 2003: the war to save the dollar', 'Irak 2003: la guerra para salvar el dólar'], curto: ['Iraq & petrodollar', 'Irak y petrodólar'], periodo: ['2003 – 2011 (effects continue today)', '2003 – 2011 (efectos hasta hoy)'], local: ['Iraq', 'Irak'],
    vitimas: { numero: ['200–600k+', '200–600 mil+'], rotulo: ['Iraqi deaths (civilians and combatants)', 'muertos iraquíes (civiles y combatientes)'], did: ['The invasion and the chaos that followed killed between 200,000 and more than 600,000 Iraqis. And it all began with a currency: in what money Iraqi oil would be charged.', 'La invasión y el caos posterior mataron entre 200 mil y más de 600 mil iraquíes. Y todo comenzó con una moneda: en qué dinero se cobraría el petróleo iraquí.'], adv: ['200–600k+ direct/indirect deaths (Lancet surveys; Iraq Body Count) — destruction of state and society as a central variable in the conflict.', '200–600 mil+ muertes directas/indirectas (encuestas Lancet; Iraq Body Count) — destrucción de Estado y sociedad como variable central del conflicto.'] },
    mecanismos: [
      { t: ['Petrodollar: why the dollar dominates', 'Petrodólar: por qué domina el dólar'], did: ['Since 1974, a secret agreement guarantees that ALL oil in the world is sold in DOLLARS. That forces every country to stock dollars — which is what sustains the empire of the US currency.', 'Desde 1974, un acuerdo secreto garantiza que TODO el petróleo del mundo se venda en DÓLARES. Eso obliga a todos los países a acumular dólares — y es lo que sostiene el imperio de la moneda estadounidense.'], adv: ['Nixon-Faisal agreement (1974): exclusive OPEC pricing in USD — structural demand for dollars recycles surpluses into Treasuries, anchoring post-Bretton Woods monetary hegemony.', 'Acuerdo Nixon-Faisal (1974): fijación exclusiva en USD del petróleo de la OPEP — demanda estructural de dólares recicla superávits en Treasuries, anclando la hegemonía monetaria pos-Bretton Woods.'] },
      { t: ['Saddam switched from the dollar to the euro', 'Saddam cambió del dólar al euro'], did: ['In 2000, Iraq announced that it would start selling its oil IN EUROS. It sounds like a detail — but if others did the same, global demand for dollars would fall. In 2003, the US invaded. The euro in Iraq ended on the Monday after the invasion.', 'En 2000, Irak anunció que empezaría a vender su petróleo EN EUROS. Parece un detalle — pero si otros hicieran lo mismo, la demanda mundial de dólares caería. En 2003, EE. UU. invadió. El euro en Irak terminó el lunes siguiente a la invasión.'], adv: ['Conversion of oil-for-food to EUR (Nov 2000): existential threat to demand for USD reserves — monetary hypothesis of the war, reversed by the CPA in 2003.', 'Conversión de oil-for-food a EUR (nov/2000): amenaza existencial a la demanda de reservas en USD — hipótesis monetaria de la guerra, revertida por la CPA en 2003.'] },
      { t: ['The plan predated September 11', 'El plan era anterior al 11 de septiembre'], did: ['The neoconservative PNAC group had already advocated overthrowing Saddam since 1998. September 11 did not cause the war: it was used as a pretext to execute a plan that already existed.', 'El grupo neoconservador PNAC ya defendía derrocar a Saddam desde 1998. El 11 de septiembre no causó la guerra: se usó como pretexto para ejecutar un plan que ya existía.'], adv: ['PNAC (1998, letter to Clinton): “regime change” as a doctrinal objective — 9/11 as a discursive window of opportunity, not a material cause.', 'PNAC (1998, carta a Clinton): “regime change” como objetivo doctrinario — 9/11 como ventana de oportunidad discursiva, no causa material.'] },
      { t: ['Destruction as profit: “accumulation by waste”', 'Destrucción como ganancia: “acumulación por desperdicio”'], did: ['For the arms and reconstruction industries, war is a perfect business: first they sell the bomb that destroys, then the contract that rebuilds. Everything is paid by American and Iraqi taxpayers.', 'Para las industrias de armas y reconstrucción, la guerra es un negocio redondo: primero se vende la bomba que destruye, luego el contrato que reconstruye. Todo lo pagan los contribuyentes estadounidenses e iraquíes.'], adv: ['Accumulation by waste (Kadri): accelerated destruction of fixed capital reactivates cycles of military overaccumulation — captive demand for the MIC + private reconstruction contracts.', 'Accumulation by waste (Kadri): destrucción acelerada de capital fijo reactiva ciclos de sobreacumulación bélica — demanda cautiva para el complejo militar-industrial + contratos privados de reconstrucción.'] },
      { t: ['Paul Bremer signed the country’s privatization', 'Paul Bremer firmó la privatización del país'], did: ['The US administrator of occupied Iraq signed a series of orders: dissolved the army (400,000 armed soldiers out of work), privatized state companies, allowed 100% foreign ownership and unrestricted profit remittances — with banks such as JPMorgan entering.', 'El administrador estadounidense del Irak ocupado firmó una serie de órdenes: disolvió el ejército (400 mil soldados armados sin trabajo), privatizó empresas estatales, permitió 100% de propiedad extranjera y remesas de ganancias sin límite — con bancos como JPMorgan entrando.'], adv: ['CPA Orders: No.2 (army dissolved — 400k armed demobilized), Nos.37/39/40 (flat tax, 100% FDI, full remittance, banking opened to JPMorgan) — neoliberal shock via occupation power (Klein).', 'Órdenes CPA: nº2 (disolución del ejército — 400 mil desmovilizados armados), nº37/39/40 (flat tax, 100% IED, remesa integral, apertura bancaria a JPMorgan) — choque neoliberal mediante poder de ocupación (Klein).'] },
      { t: ['No-bid contracts for friends in power', 'Contratos sin licitación para amigos del poder'], did: ['Billions in no-bid contracts went to Halliburton — the company where Vice President Dick Cheney had been CEO. The war paid the friends, and the friends paid the campaign.', 'Miles de millones en contratos sin competencia fueron a Halliburton — la empresa donde el vicepresidente Dick Cheney había sido CEO. La guerra pagó a los amigos, y los amigos pagaron la campaña.'], adv: ['Corporate capture: RIO/LOGCAP without competitive bidding for Halliburton/KBR (Cheney revolving door) — fusion of state apparatus and the rentier fraction of the military-industrial complex.', 'Captura corporativa: RIO/LOGCAP sin competitive bidding para Halliburton/KBR (puerta giratoria Cheney) — fusión de aparato estatal y fracción rentista del complejo militar-industrial.'] },
    ],
    aprof: { autores: ['Naomi Klein · Ali Kadri · Antonia Juhasz', 'Naomi Klein · Ali Kadri · Antonia Juhasz'], did: ['Iraq was a laboratory: how to turn an entire country into a testing ground for the most radical capitalism, with bombs. And it showed that the currency used to price oil is worth wars.', 'Irak fue un laboratorio: cómo convertir un país entero en campo de pruebas del capitalismo más radical, con bombas. Y mostró que la moneda del petróleo vale guerras.'], adv: ['Shock Doctrine (Klein): armed shock therapy as method — destruction of the state as a condition for implementing market fundamentalism; Kadri: imperial waste as a form of rentier, dollarized accumulation.', 'Doctrina del Shock (Klein): terapia de choque armada como método — destrucción del Estado como condición para implementar fundamentalismo de mercado; Kadri: desperdicio imperial como forma de acumulación rentista dolarizada.'] },
  },
  clima: {
    titulo: ['Bonus: the climate crisis and the 22 companies that burned the planet', 'Bono: la crisis climática y las 22 empresas que quemaron el planeta'], curto: ['Climate crisis', 'Crisis climática'], periodo: ['1977 – today', '1977 – hoy'], local: ['Planet', 'Planeta'],
    vitimas: { numero: ['1 million+/year', '1 millón+/año'], rotulo: ['deaths associated with climate impacts (WHO/Lancet) · 22 companies = 1/3 of historical emissions', 'muertes asociadas a impactos climáticos (OMS/Lancet) · 22 empresas = 1/3 de las emisiones históricas'], did: ['The climate crisis already kills more than one million people a year. And one third of ALL the pollution that caused warming came from only 22 companies — which knew the science since 1977 and chose to hide it.', 'La crisis climática ya mata a más de un millón de personas por año. Y un tercio de TODA la contaminación que causó el calentamiento salió de solo 22 empresas — que conocían la ciencia desde 1977 y eligieron ocultarla.'], adv: ['≥1m attributable annual deaths (WHO/Lancet Countdown); Carbon Majors: 22 entities responsible for ~1/3 of cumulative industrial GHG emissions (Heede, 2014).', '≥1 M de muertes anuales atribuibles (WHO/Lancet Countdown); Carbon Majors: 22 entidades responsables de ~1/3 de las emisiones industriales acumuladas de GEI (Heede, 2014).'] },
    mecanismos: [
      { t: ['Why did coal and oil win? Power over labor', '¿Por qué ganaron carbón y petróleo? Poder sobre el trabajo'], did: ['It was not simply because water ran out: coal won because it allowed factories to move to CITIES, where large pools of workers could be disciplined. The choice of fossil energy was also a choice about POWER over people.', 'No fue simplemente porque faltara agua: el carbón ganó porque permitía llevar la fábrica a las CIUDADES, donde grandes masas de trabajadores podían ser disciplinadas. La elección de energía fósil también fue una elección sobre PODER sobre las personas.'], adv: ['Malm (Fossil Capital): the shift to steam-coal predates water scarcity — urban location maximizes discipline and availability of wage labor; energy as a social relation of command.', 'Malm (Fossil Capital): la transición a vapor-carbón precede la escasez hídrica — la ubicación urbana maximiza disciplina y disponibilidad de trabajo asalariado; energía como relación social de mando.'] },
      { t: ['They knew since 1977 — with frightening precision', 'Lo sabían desde 1977 — con una precisión aterradora'], did: ['Exxon scientists predicted in 1977, in an internal report, warming of 0.2°C per decade — with frightening precision. In 1988, Shell even mapped sea-level rise. And the companies decided to WAIT FOR CHAOS AND PROFIT.', 'Científicos de Exxon predijeron en 1977, en un informe interno, un calentamiento de 0,2°C por década — con una precisión aterradora. En 1988, Shell incluso cartografió la subida del nivel del mar. Y las empresas decidieron ESPERAR EL CAOS Y LUCRAR.'], adv: ['Internal attribution science: James Black (Exxon, 1977) projects +0.2°C/decade (±0.04); Shell (1988, “Greenhouse Effect”) maps acidification, SLR and migrations — anticipated and suppressed knowledge (Supran/Oreskes).', 'Ciencia interna de atribución: James Black (Exxon, 1977) proyecta +0,2°C/década (±0,04); Shell (1988, “Greenhouse Effect”) cartografía acidificación, SLR y migraciones — conocimiento anticipado y suprimido (Supran/Oreskes).'] },
      { t: ['US$17 trillion that cannot be burned', 'US$17 billones que no pueden quemarse'], did: ['The internal reports admitted it: to save the climate, fuels worth up to US$17 trillion would have to be LEFT IN THE GROUND. They preferred to risk the planet rather than risk the balance sheet.', 'Los informes internos lo admitían: para salvar el clima habría que DEJAR BAJO TIERRA combustibles por hasta US$17 billones. Prefirieron arriesgar el planeta antes que arriesgar el balance.'], adv: ['Stranded assets: 2°C compatibility requires foregoing reserves valued at up to US$17tn — systemic financial risk that organizes climate inaction as balance-sheet defense.', 'Stranded assets: compatibilidad con 2°C exige renunciar a reservas valoradas en hasta US$17 bill. — riesgo financiero sistémico que organiza la inacción climática como defensa del balance.'] },
      { t: ['The doubt factory (the tobacco playbook)', 'La fábrica de dudas (el mismo manual del tabaco)'], did: ['They hired the SAME public-relations agencies the cigarette industry used to deny harm. They funded front institutes, seeded doubt, bought debates. They delayed action for decades — decades of profit.', 'Contrataron las MISMAS agencias de relaciones públicas que el cigarrillo usó para negar sus daños. Financiaron institutos pantalla, sembraron dudas, compraron debates. Retrasaron décadas de acción — décadas de ganancias.'], adv: ['Merchants of Doubt (Oreskes/Conway): Global Climate Coalition + tobacco PR firms — institutional production of uncertainty as a strategy to delay regulation.', 'Merchants of Doubt (Oreskes/Conway): Global Climate Coalition + firmas de PR del tabaco — producción institucional de incertidumbre como estrategia para retrasar regulación.'] },
      { t: ['ISDS: when a company sues the PLANET', 'ISDS: cuando una empresa demanda al PLANETA'], did: ['There is an international mechanism in which a company can SUE an entire country in private tribunals — for billions — if it passes an environmental law that “threatens future profits”. Popular sovereignty loses to expected profit.', 'Existe un mecanismo internacional en el que una empresa puede DEMANDAR a un país entero en tribunales privados — por miles de millones — si aprueba una ley ambiental que “amenaza ganancias futuras”. La soberanía popular pierde frente al lucro esperado.'], adv: ['ISDS (Investor-State Dispute Settlement): private-international arbitration that monetizes regulation as expropriation — supremacy of corporate property rights over ecological sovereignty (Tienhaara).', 'ISDS (Investor-State Dispute Settlement): arbitraje privado-internacional que monetiza regulación como expropiación — supremacía del derecho de propiedad corporativa sobre la soberanía ecológica (Tienhaara).'] },
    ],
    aprof: { autores: ['Andreas Malm · Jason Moore (metabolic rift) · Naomi Oreskes', 'Andreas Malm · Jason Moore (fractura metabólica) · Naomi Oreskes'], did: ['Marx already spoke of a “metabolic rift”: capitalism tears the cycle between the land and people. The climate crisis is that rift on a planetary scale — and those who caused it have known exactly what they were doing since 1977.', 'Marx ya hablaba de una “fractura metabólica”: el capitalismo rompe el ciclo entre la tierra y las personas. La crisis climática es esa fractura a escala planetaria — y quienes la causaron saben exactamente lo que hicieron desde 1977.'], adv: ['Metabolic rift (Marx/Foster; Moore): rupture of the society-nature metabolism through capitalist urbanization. Fossil Capital (Malm): carbon as a form of command over labor — the climate crisis as an externalization rational from capital’s point of view.', 'Fractura metabólica (Marx/Foster; Moore): ruptura del metabolismo sociedad-naturaleza mediante urbanización capitalista. Fossil Capital (Malm): carbono como forma de mando sobre el trabajo — la crisis climática como externalización racional desde el punto de vista del capital.'] },
  },
}

const etx = (lang: Lang, pt: string, [en, es]: BiText) => pick(lang, pt, en, es)

export function episodesForLang(lang: Lang): Episode[] {
  return EPISODES.map((ep) => {
    const tr = EPISODE_TR[ep.id]
    return {
      ...ep,
      titulo: etx(lang, ep.titulo, tr.titulo),
      curto: etx(lang, ep.curto, tr.curto),
      periodo: etx(lang, ep.periodo, tr.periodo),
      local: etx(lang, ep.local, tr.local),
      vitimas: {
        numero: etx(lang, ep.vitimas.numero, tr.vitimas.numero),
        rotulo: etx(lang, ep.vitimas.rotulo, tr.vitimas.rotulo),
        did: etx(lang, ep.vitimas.did, tr.vitimas.did),
        adv: etx(lang, ep.vitimas.adv, tr.vitimas.adv),
      },
      mecanismos: ep.mecanismos.map((m, i) => ({
        t: etx(lang, m.t, tr.mecanismos[i].t),
        did: etx(lang, m.did, tr.mecanismos[i].did),
        adv: etx(lang, m.adv, tr.mecanismos[i].adv),
      })),
      aprof: {
        autores: etx(lang, ep.aprof.autores, tr.aprof.autores),
        did: etx(lang, ep.aprof.did, tr.aprof.did),
        adv: etx(lang, ep.aprof.adv, tr.aprof.adv),
      },
    }
  })
}

export const PLAYLIST_URL =
  'https://www.youtube.com/playlist?list=PLkBnPChzQkPxrzD7k3R7eGEvBkBEIZsYb'
