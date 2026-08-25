/**
 * DADOS TEÓRICOS — MMT (moeda×dívida soberana), TMD (dependência) e o
 * comparativo Ortodoxa × Heterodoxa. Base: THEORY.md na raiz.
 */

/* ── MMT · Brasil: soberania MONETÁRIA PARCIAL/INTERMEDIÁRIA ── */
export const MMT_BR = {
  soberania: 'Parcial / Intermediária',
  dividaInternaReaisPct: 95, // ≈95–97% da DPF em moeda própria (Tesouro Nacional)
  estrangeirosPctMax: 10,
  mecanismoImpostos:
    'Anulação de moeda: dão valor à moeda, redistribuem renda e liberam capacidade — não “financiam” tecnicamente o gasto',
  restricaoReal:
    'Capacidade produtiva oculta + gargalo cambial (divisas para importações essenciais) + inflação por conflito distributivo',
  armadilhaRentista:
    'Grande parte da dívida interna é remunerada a Selic (+): juro alto infla o estoque SEM gasto novo — captura estrutural pelo capital portador de juros',
} as const

export const SOVEREIGN_STEPS = [
  {
    t: '1 · O Estado gasta CRIANDO reais',
    didatico: 'Quando o governo paga um hospital ou um aposentado, ele credita reais nas contas dos bancos. O dinheiro não vem "de algum lugar": ele passa a existir naquele momento.',
    avancado: 'Gasto líquido credora contas de reserva no BCB (consolidação Tesouro-BCB): moeda fiduciária é passivo estatal emitido pelo próprio gasto.',
  },
  {
    t: '2 · Impostos ANULAM reais',
    didatico: 'O imposto apaga dinheiro da economia. Para que serve então? Para dar valor ao real (todo mundo precisa dele para pagar o leão), redistribuir e liberar espaço na economia.',
    avancado: 'Débito resgata passivos estatais: tributo cria demanda inelástica pela moeda e libera capacidade real, administrando pressão inflacionária.',
  },
  {
    t: '3 · Títulos = poupança remunerada do privado',
    didatico: 'O "rombo" do governo é exatamente o que sobra guardado no setor privado. A dívida pública em reais é a poupança segura de bancos e fundos — com juros pagos por você.',
    avancado: 'Título público é ativo líquido do setor não-governo: sua emissão satisfaz demanda de ativos seguros; seu serviço canaliza mais-valia socializada aos portadores (ponte p/ Pilar 1).',
  },
] as const

/* ── TMD — canais de vazamento de valor Sul → Norte ── */
export interface TmdChannel {
  tipo: string
  textoDidatico: string
  textoAvancado: string
}

export const TMD_CHANNELS: TmdChannel[] = [
  {
    tipo: 'Troca desigual',
    textoDidatico:
      'O Sul exporta sacas e minério (baratos) e importa máquinas, remédios e software (caríssimos). Cada ano, troca-se mais trabalho do Sul por menos valor do Norte.',
    textoAvancado:
      'Termos de troca historicamente declinantes para primários (Prebisch–Singer): produtividade cresce no centro via salários/valorização técnica, não via preço das commodities — transferência implícita de trabalho incorporado.',
  },
  {
    tipo: 'Superexploração do trabalho (Marini)',
    textoDidatico:
      'Para continuar "competitivo", o Sul paga salário que não cobre a vida inteira do trabalhador e estica a jornada. É isso que barateia a soja e o minério — e engorda o lucro de quem vende lá fora.',
    textoAvancado:
      'Marini: compensação da troca desigual via remuneração da força de trabalho abaixo do valor de reprodução + intensificação/jornada. Ver clocks ILAESE (ex.: Salobo 07h39 não pagas/8h) como mensuração empírica.',
  },
  {
    tipo: 'Vaza de rendas de propriedade + dívida',
    textoDidatico:
      'Lucros de multinacionais voltam para as matrizes nos EUA/Europa, royalties saem do país, e a dívida em dólar cobra seu pedágio anual — divisas que nunca viram escola nem vacina.',
    textoAvancado:
      'Repatriação de lucros/dividendos/royalties (BR: R$195–294 bi/ano) + serviço da dívida externa drenam divisas: o excedente gerado internamente sustenta a acumulação do centro (dos Santos: dependência como reprodução ampliada do subdesenvolvimento).',
  },
]

/* ── Comparativo teórico (card/modal) ── */
export interface TheoryTopic {
  id: string
  titulo: string
  ortodoxa: { tese: string; contra: string }
  heterodoxa: { tese: string; autores: string }
}

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: 'divida',
    titulo: 'Dívida pública',
    ortodoxa: {
      tese:
        '“O Estado deve gastar como uma família: primeiro arrecadar, depois gastar. Dívida alta é fardo para os netos e acima de certo % do PIB vira calote iminente — cortar gastos demonstra responsabilidade.”',
      contra:
        'Premissa contestada: trata o emissor da moeda como usuário dela. Japão (~230–250% do PIB) refuta o “teto”; austeridade encolhe o PIB (denominador) e piora a própria razão.',
    },
    heterodoxa: {
      tese:
        'Emissor soberano paga sempre seus títulos na própria moeda: a dívida é o ativo financeiro líquido do setor privado, e seu limite é inflação/recursos reais — nunca “falta de dinheiro”. Quem detém os títulos (rentistas) captura os juros: leitura marxista do MESMO fato.',
      autores: 'MMT: Mosler, Wray, Kelton · Marx: capital fictício/portador de juros · Kalecki: déficit sustenta lucros',
    },
  },
  {
    id: 'cambio',
    titulo: 'Câmbio do Sul Global',
    ortodoxa: {
      tese:
        '“Câmbio flutuante se ajusta sozinho às forças de mercado e equilibra o comércio; intervenção só gera distorção.”',
      contra:
        'Premissa contestada: fluxos financeiros dominam o comércio — ciclos de juros do centro e fuga de capitais produzem sobrevalorizações/colapsos, nada de “ajuste suave”.',
    },
    heterodoxa: {
      tese:
        'Câmbio periférico é estruturalmente volátil e tende ao rebaixamento: desvalorização barateia exportações E salários (superexploração via câmbio), facilita aquisições estrangeiras e encarece tecnologia — mecanismo de dependência, não acidente.',
      autores: 'Marini (superexploração) · Tavares/Serra (ciclos) · Keynes (controle de capitais)',
    },
  },
  {
    id: 'comercio',
    titulo: 'Comércio exterior',
    ortodoxa: {
      tese:
        '“Livre comércio beneficia todos: cada país explora suas vantagens comparativas e todos ganham.”',
      contra:
        'Premissa contestada: vantagem comparativa é fotografia estática; especialização primária trava trajetória tecnológica e perpetua a hierarquia (evidência: desindustrialização brasileira 27%→11%).',
    },
    heterodoxa: {
      tese:
        'Troca desigual: o intercâmbio Centro–Sul transfere trabalho incorporado do Sul ao Norte; a superexploração local compensa a perda e financia o consumo/financeirização imperialistas.',
      autores: 'Prebisch–Singer · Marini · dos Santos · Emmanuel (troca desigual)',
    },
  },
]
