# DATA-GUIDELINES — Diretrizes de Dados do Capital Blocks

Normas obrigatórias para qualquer informação exibida no sistema. O objetivo é manter o
rigor das fontes, a didática dual-mode e a coerência conceitual (marxista + lente MMT
onde couber).

**§0 — Constituição teórica:** nenhuma informação pode violar `THEORY.md`
(Marx · Heterodoxia Keynes/Kalecki · MMT · TMD). Premissas neoclássicas são banidas;
temas fiscais exigem dupla lente (ortodoxa citada como dominante a criticar + heterodoxa);
países periféricos exigem enquadramento TMD (troca desigual, superexploração, vaza de rendas,
gargalo cambial) quando aplicável.

---

## 1. Regras universais para cada número exibido

Todo dado no app DEVE carregar os campos abaixo (ver modelo em `src/data/indicators.ts`):

| Campo | Exigência |
| :--- | :--- |
| `value` | valor formatado pt-BR (`US$ 2.718 bi`, `56,8%`, `R$ 195–294 bi`) |
| `year` | período explícito (`2024`, `Q4 2025`, `1985→2020`) — nunca número sem data |
| `source` | fonte primária nomeada (`IMF COFER`, `SIPRI`, `BCB`, `Tesouro Nacional`, `IBGE`, formato ILAESE) |
| `sourceUrl` | link direto da fonte quando existir |
| `didatico` | 1–2 frases de tradução para leigos, com metáfora concreta |
| `avancado` | formulação técnica com categoria marxista correta (c, v, m, capital fictício…) |
| `estimate: true` | OBRIGATÓRIO quando o valor for ilustrativo/não-verificado (badge “est.” na UI) |

**Proibido:** número solto em texto sem fonte; misturar bases de anos diferentes sem
sinalizar; usar média “de cabeça” como se fosse estatística oficial.

## 2. Hierarquia de fontes (preferência decrescente)

1. **Instituições primárias**: FMI (WEO, COFER, Fiscal Monitor), Banco Mundial, BIS,
   SIPRI, Tesouro Transparente, IBGE, BCB, ministries.
2. **Formatos especializados**: Anuário Estatístico ILAESE (empresas/exploitação BR).
3. **Agências de referência**: Reuters/FT citando a primária (linkar a primária mesmo assim).
4. **Estimativas próprias didáticas**: sempre `estimate: true`.

## 3. Lente MMT — regras para o Módulo 05 (Dívida Pública)

Toda explicação de dívida pública deve oferecer as DUAS leituras lado a lado:

* **Leitura marxista** (fluxo principal): dívida como captura de renda pelo capital
  portador de juros; título = capital fictício; Estado como campo de batalha entre frações.
* **Leitura MMT** (`MmtPanel.tsx`): emitente soberano não dá calote involuntário na própria
  moeda; impostos não financiam tecnicamente o gasto; identidade setorial
  `(S−I) ≡ (G−T)+(X−M)`; o limite real é inflação/capacidade produtiva, não solvência.
* **Comparativo obrigatório** ao citar “crise fiscal”: contrastar Japão (~230–250% PIB,
  moeda própria, sem default) × Grécia (~130%, euro, colapso) × periferia endividada em
  dólar (restrição externa real). Nunca usar “dívida alta” como autoexplicativo.
* Juros altos SEMPRE com dupla leitura: transferência a rentistas (Marx) + instrumento
  desinflacionário debatido pela MMT; citar quem paga e quem recebe.

## 4. Semântica visual fixa

| Conceito | Cor token | Uso proibido |
| :--- | :--- | :--- |
| Capital-dinheiro M / financeiro | `money #FFC107` | nunca para trabalho/salário |
| Capital constante c / máquinas | `machine #2196F3` | nunca para lucro |
| Capital variável v / salários | `labor #F44336` | nunca para Estado |
| Mais-valia m / lucro | `emerald #4CAF50` | nunca para custos |
| Capital fictício / dívida | `fict #9C27B0` | nunca para produção real |

Números sempre em `font-mono`; texto corrido em Inter.

## 5. Mapa-múndi — como plugar novos países/dados

Geografia real: Natural Earth 110m via `world-atlas` + `d3-geo`
(`src/lib/world.ts`). Todos os ~177 países já são renderizados, com hover (nome +
ISO) e clique.

Para dar dados a um país novo:

1. Adicione o ISO numérico em `BLOC_MEMBERS` (`src/lib/world.ts`) — cria um bloco
   colorido clicável;
   ou marque apenas presença no BRICS+ via `BRICS_ISO`.
2. Crie a entrada completa em `src/data/countries.ts` (PIB nominal/PPP, frações
   somando 100%, facções com teses e firms, `ilaese?` opcional).
3. Se for membro BRICS+, atualize também `INDICATORS`/conflitos quando relevante.
4. Países sem dados mostram o card “aguardando dados” com instrução — não remover
   esse feedback.

## 6. Fluxos geopolíticos (partículas)

Novo fluxo = entrada em `FLOWS` (`src/data/flows.ts`) com âncoras
`[lng, lat]` reais, `type` conforme camada (commodities/manufatura/drain/dollar/brics/fantasma),
bend e dur escolhidos para legibilidade. Máx. 3 partículas por rota.

## 7. Cadência de atualização sugerida

| Dado | Fonte | Frequência |
| :--- | :--- | :--- |
| PIB blocos | IMF WEO | abril/outubro |
| Reservas por moeda | IMF COFER | trimestral |
| Gasto militar | SIPRI | anual (abril) |
| Orçamento/dívida BR | Tesouro/Senado | mensal |
| Empresas ILAESE | anuário | anual |

## 8. Checklist antes de commitar dados novos

- [ ] Fonte primária + ano no objeto de dados?
- [ ] Textos `didatico` E `avancado` escritos?
- [ ] `estimate: true` se ilustrativo?
- [ ] Cores respeitam §4?
- [ ] Se é dívida/fiscal: passou pelo §3 (dual-lens)?
- [ ] `npm run build` verde?

## 9. Modelo de decomposição corporativa (Raio-X Global)

Para cada empresa do Raio-X Global (`WORLD_COMPANIES`), o valor anual produzido é
decomposto em runtime (`src/lib/companyMetrics.ts`) pela trinômia **W = c + v + m**:

```
v  = funcionários × remuneração média anual estimada      (capital variável)
m  = lucro líquido reportado                              (mais-valia apropriada como lucro)
c  = receita − v − m                                      (insumos + depreciação transferidos)
e  = m/v  →  horas não pagas = 8·e/(e+1)                  (taxa de exploração)
```

Regras:
1. `capTri` (valor de mercado) usa consenso de data explícita — o preço de um título é
   volátil por natureza; sempre citar "dez/2025" ou equivalente.
2. `receitaBi`, `lucroBi`, `funcionariosMil`: relatórios anuais FY2024/FY2025
   (10-K/20-F/Fortune). Lucros GAAP/IFRS marcados quando distorcidos (ex.: Broadcom pós-
   VMware, Berkshire mark-to-market).
3. `salarioMedioK` é ESTIMATIVA por país/setor → sempre exibida com badge “est.” e
   tooltip revelando a premissa.
4. Métricas derivadas exibidas: `% do market cap mundial` (÷ US$124 tri, WFE),
   `% do PIB mundial` (÷ US$115 tri, IMF WEO) e `Mercado ÷ Receita` (“anos de produção”
   precificados) — proxy didático do fictício embutido no preço.

### 9.1 — Modelo UNIFICADO (BR + Global) e registros dinâmicos de API

* Brasil e Global compartilham o mesmo schema (`CompanyRecord`) e o mesmo motor
  (`metricsFor`): a base brasileira também é decomposta em W = c + v + m a partir
  de receita/lucro/funcionários/salário médio (DFs FY2024) — sem mais números
  avulsos fora do modelo.
* **Fontes dinâmicas** (`lib/marketApi/`): DESLIGADAS por padrão; ativadas só na
  página do Raio-X. Adaptadores: BRAPI/B3 (cotações em lote) e Alpha Vantage
  (fundamentais completos). Cache local 24 h; nada sai do navegador.
* Escada de estimativa para registros `origem: 'api'` (sempre badge `API·est.`):
  1. fundamentais completos da API → caminho normal (v = empregados × salário);
  2. só cotação → `receita ≈ cap ÷ P/S (2,5)` → `lucro ≈ margem setorial × receita`
     → `v ≈ share setorial de folha × receita`;
  3. setores PT/EN mapeados em `sectorEstimate()` (companyMetrics.ts).
* Agregados da síntese global incluem os registros dinâmicos; os do painel
  "Riqueza Mundial" usam apenas a base curada estática.

## 10. Riqueza mundial (`worldWealth.ts`) — itens e fontes

| Agregado | Valor | Fonte/vintage |
| :--- | :--- | :--- |
| PIB nominal mundial | ≈ US$ 115 tri | IMF WEO 2025 |
| Riqueza líquida privada | ≈ US$ 454 tri | UBS GWR 2024 (fim-2023); GWR 2025 em alta |
| Mercado acionário global | ≈ US$ 124 tri | WFE/SIFMA fim-2024 |
| Dívida pública mundial | ≈ US$ 102 tri (~93% PIB) | IMF Fiscal Monitor |
| Dívida privada não-financeira | ≈ US$ 95 tri | BIS 2024 |
| Derivativos OTC (nocional) | ≈ US$ 667 tri | BIS jun/2024 (nocional ≠ riqueza!) |
| Imobiliário mundial | ≈ US$ 380 tri | Savills 2023 |

Razões computadas em runtime: esfera de títulos ÷ PIB anual; riqueza ÷ PIB;
derivativos ÷ PIB. Toda a esfera de títulos é classificada como **capital fictício**;
imobiliário como ativo real não-produtivo (renda fundiária).

## 11. Módulo Guerra (`wars.ts`) — regras específicas

* **Épocas**: sempre do presente para o passado (slider reverso). Cada conflito pertence a
  exatamente uma época e carrega `lngLat` geográfico real.
* **Empresas beneficiadas**: texto duplo obrigatório — ganho didático (história concreta)
  + ganho avançado (categoria marxista). Quando houver série de preço/receita, incluir
  `surge` normalizado (base = 100 na data-chave) com rótulos de período.
* **Valores de guerra**: citar Costs of War (Brown), SIPRI, GAO/CRS como fontes padrão;
  custos projetados (ex.: veteranos até 2050) devem vir separados dos custos diretos.
* **Cadeia da mais-valia bélica**: todo drawer termina no diagrama
  impostos/dívida → orçamento → contrato cost-plus → dividendos/buybacks.
* Receitas de defesa das contratadas: segmento militar dos relatórios anuais FY2024,
  arredondado; estatais (Rostec) marcadas como estimativa consolidada.
