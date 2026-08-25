# THEORY.md — Diretrizes Teóricas do Capital Blocks

Este documento é a **constituição teórica** do projeto. Todo texto, simulação,
gráfico ou dado adicionado ao sistema deve ser verificável contra estes pilares.
Em caso de conflito entre uma convenção "de mercado" e estas diretrizes, vencem
as diretrizes. (Ver também `DATA-GUIDELINES.md` para regras de dados.)

---

## Premissa zero: o que este app NÃO assume

Nenhuma tela pode pressupor os axiomas neoclássicos:

| Proibido (ortodoxia) | Substituto heterodoxo adotado |
| :--- | :--- |
| Moeda neutra (véu sobre a economia real) | Moeda **endógena**, criada pelo crédito e pelo gasto público; moeda é relação de poder |
| Escassez de moeda soberana ("dinheiro acabou") | Emissor monetário não tem restrição financeira operacional; limite = recursos reais/inflação |
| Fundos emprestáveis (poupança prévia financia investimento) | **Investimento cria poupança** (Keynes/Kalecki, princípio da demanda efetiva) |
| Equilíbrio geral tendencial | Capitalismo como processo de acumulação desequilibrada, movido por incerteza e expectativas |
| Estado-família / casa de orçamento doméstico | Estado emissor soberano × Estado usuário de moeda alheia (hierarquia monetária global) |
| Livre comércio ganha-ganha universal | Troca desigual estrutural Centro–Sul (Prebisch–Singer, Marini) |

---

## PILAR 1 — Marx, *O Capital* (valor, exploração, crises)

* Trabalho vivo é a **única fonte** de valor novo e mais-valia: `W = c + v + m`.
* Capital é **relação social** de exploração, não agregado de máquinas.
* Métricas centrais do app: `e = m/v`, `k = c/v`, `g = m/(c+v)` e a
  **tendência decrescente da taxa de lucro** (motor analítico das crises de
  sobreacumulação — Módulo 01).
* Crise = realização insuficiente do valor produzido; guerra e crédito como
  "soluções" espúrias (Módulo 03 e 05).
* Capital fictício (Livro III): títulos = direitos capitalizados sobre
  mais-valia futura (Módulo 02-Riqueza Mundial e 05-Dívida).

## PILAR 2 — Macroeconomia heterodoxa (Keynes, Kalecki, Minsky)

* **Demanda efetiva**: investimento determina poupança, nunca o inverso.
* **Equação kaleckiana dos lucros**: `Π ≈ I + (G−T) + NX + C_cap − S_trab`
  — *"os trabalhadores gastam o que ganham; os capitalistas ganham o que gastam"*.
  Consequência didática usada no app: **déficit público sustenta margens
  privadas** — e a austeridade as destrói (simulador do Módulo 05).
* **Paradoxo da parcimônia**: tentativa generalizada de poupar encolhe a renda
  e a própria poupança agregada.
* **Incerteza não-ergódica**: decisões de investimento dependem de expectativas
  e preferência pela liquidez (Minsky: estabilidade gera fragilidade).
* Política fiscal anticíclica: cortar gastos na crise aprofunda a recessão e
  **deteriora** o próprio indicador fiscal que diz querer proteger.

## PILAR 3 — MMT: o sistema moeda × dívida soberana

* Países com **soberania monetária plena** (moeda fiduciária própria, câmbio
  flutuante, dívida majoritariamente na própria moeda — EUA, Japão, Reino Unido;
  **Brasil = caso intermediário/parcial**) gastam **criando** a moeda e
  tributam **anulando-a**. Impostos não financiam tecnicamente o gasto:
  criam demanda pela moeda, redistribuem e liberam capacidade produtiva.
* Identidade setorial obrigatória em qualquer discussão fiscal:
  `(S − I) ≡ (G − T) + (X − M)` — déficit público é superávit de outro setor.
* Dívida pública em moeda própria = **ativo financeiro líquido do setor não-
  governo**; seu serviço é um canal de distribuição de renda aos detentores
  (leitura marxista: capital portador de juros).
* O vínculo real do emissor soberano é **inflação × capacidade produtiva
  oculta** — nunca "falta de dinheiro".
* Hierarquia monetária global: emitir a moeda-reserva (EUA) ≠ emitir moeda
  periférica (Brasil). A restrição cambial do Sul é real (Pilar 4).

## PILAR 4 — Teoria Marxista da Dependência (Marini, dos Santos, Bambirra)

* A divisão internacional do trabalho força a periferia a **compensar a troca
  desigual** pela **superexploração do trabalho**: remuneração da força de
  trabalho **abaixo do seu valor de reprodução**, jornada/intensidade ampliadas.
* **Três canais de vazamento de valor** Sul → Norte (visualizados no mapa e
  nos drawers de países do Sul Global):
  1. **Troca desigual** — commodities de baixo valor agregado ↔ manufatura/
     tecnologia/propriedade intelectual do Centro.
  2. **Remessa de rendas de propriedade** — lucros, dividendos e royalties de
     filiais para matrizes imperialistas.
  3. **Serviço da dívida externa** — transferência financeira permanente em
     moeda forte.
* Blocos de capital do Sul são **associados-subordinados** do imperialismo: o
  agro-exportador e o financeiro brasileiro, p.ex., internalizam a
  superexploração e repassam o excedente ao Centro (reprimarização,
  câmbio desvalorizado, juros altos — ver Raio-X ILAESE e drawer Brasil).
* Superexploração não é atraso acidental: é **condição de funcionamento** do
  modo de produção dependente.

---

## Matriz de aplicação por módulo

| Módulo | Pilares dominantes | Artefatos |
| :--- | :--- | :--- |
| 01 Circuito | P1 + P2 (ponte keynesiana) | sliders c/v·m/v, relógio 8h, curva de g, card demanda efetiva |
| 02 Mapa/Riqueza | P1 + P4 | fluxos drain, painel riqueza mundial, drawers TMD, indicadores |
| 03 Guerra | P1 + P4 | épocas, cadeia impostos→contrato→dividendos |
| 05 Dívida | P3 + P2 + P1 | toggle Ortodoxa⇄MMT, identidade setorial, simulador kaleckiano, fluxo morte/ressurreição |
| 06 Raio-X | P1 + P4 | decomposição W=c+v+m, clocks, ILAESE |
| 07 Plataformas | P1 + P2 | salário por peça, transferência de c |

## Regras de redação

1. Nunca tratar "mercado" como sujeito neutro; nomear **frações de capital**.
2. Números fiscais sempre com dupla leitura (§Pilar 3) quando soberania for plena
   ou parcial — e com restrição cambial explícita quando periférica.
3. Autores de referência permitidos nas legendas avançadas: Marx, Engels, Lenin,
  Luxemburgo, Kalecki, Keynes, Minsky, Prebisch, Marini, dos Santos, Bambirra,
  Wray, Kelton, Mosler, Hudson, Shaikh.
4. Economistas ortodoxos só aparecem **citados como visão dominante a criticar**
   (ex.: "a regra r>g de Blanchard, quando válida…"), nunca como autoridade
   normativa do app.
