# CAPITAL BLOCKS — A Anatomia do Capitalismo Global (Fase 2)

Visualizador interativo fundamentado em quatro pilares teóricos — ver **`THEORY.md`**
(constituição do projeto):

1. **Marx, *O Capital***: valor-trabalho, `W=c+v+m`, tendência decrescente de g
2. **Heterodoxia Keynes/Kalecki/Minsky**: demanda efetiva, moeda endógena, paradoxo da parcimônia, equação kaleckiana dos lucros
3. **MMT**: soberania monetária, impostos como anulação de moeda, dívida = ativo líquido do privado, limite = inflação/recursos reais
4. **Teoria Marxista da Dependência** (Marini/dos Santos/Bambirra): troca desigual, superexploração e vazamento de valor Sul→Norte

Premissas neoclássicas (moeda neutra, Estado-família, fundos emprestáveis, equilíbrio geral)
estão **banidas** por diretriz.

Visualizador interativo que traduz categorias de *O Capital* (Marx, 1867) em componentes
visuais alimentados por dados econômicos reais (FMI) e no formato do Anuário ILAESE.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + bundle de produção (dist/)
```

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS v4 · Zustand · Framer Motion
**Mapa geopolítico real**: Natural Earth 110m (`world-atlas` TopoJSON) projetado com
`d3-geo` — ~177 países clicáveis, zoom/pan, fluxos por partículas SMIL.
Restante das visualizações em **SVG puro** (rosca, relógios, curvas, circuito).

## Design System (Dark Premium)

| Token | Valor | Uso |
| :--- | :--- | :--- |
| fundo `zinc-950` | `#0D1117` | obsidian base |
| painel `zinc-900` | `#161B22` | cards/painéis (`zinc-800` = borda `#30363D`) |
| `money` | `#FFC107` | capital-dinheiro M, fluxos financeiros |
| `machine` | `#2196F3` | capital constante c, commodities |
| `labor` | `#F44336` | capital variável v, trabalho vivo |
| `surplus`/emerald | `#4CAF50` | mais-valia m, lucro |
| `fict`/fuchsia | `#9C27B0` | capital fictício, dívida |

Tipografia Inter (UI) + JetBrains Mono (números). Tokens definidos via `@theme` em
`src/index.css`, remapeando as escalas Tailwind para a paleta oficial.

## Dual-Mode Global (Header)

`[ Didático ] ⇄ [ Avançado ]` — estado global (`useApp.mode`), padrão **Didático**.

| Aspecto | Didático (default) | Avançado (marxista-contábil) |
| :--- | :--- | :--- |
| Automação | "Nível de Automação" | Composição orgânica `k = c/v` |
| Exploração | "Intensidade de Exploração" + relógio | Taxa de mais-valia `e = m/v` |
| Lucro | "Ganho dos donos", "Trabalho não pago na jornada" | `g = m/(c+v)`, tendência decrescente |
| Fórmulas | deslizam para fora (AnimatePresence) | sempre visíveis |
| Tooltips | linguagem direta sobre todo número | definições formais |

## Módulos

* **HOME · Módulo 02 — Mapa Geopolítico** (`MapWorld.tsx`): mapa-múndi REAL (todos os
  países, hover com ISO, clique → drawer dos blocos com dados / card "aguardando dados"
  nos demais). 4 camadas de fluxos animados — commodities, vaza de mais-valia,
  liquidez dólar e BRICS Pay (membros BRICS+ contornados). Zoom por scroll/botões +
  pan por arraste. Seletor de guerras: Semicondutores, Energia & Sanções, Reprimarização.
* **Painel de Indicadores Globais** (`IndicatorsStrip.tsx`): dados pesquisados com fonte
  primária e ano — COFER (dólar 56,8% Q4/2025), SIPRI (US$2.718 bi militar 2024),
  Japão ~230–250% PIB, juros EUA > US$1 tri, BRICS+ (~40% PIB PPP), TSMC ~90% chips
  avançados. Tooltips dual-mode.
* **Riqueza Mundial sob Raio-X** (`WorldWealthPanel.tsx`): base real × esfera de títulos
  (ações US$124 tri + dívida pública ~102 + dívida privada ~95 = capital fictício),
  imobiliário US$380 tri, derivativos nocionais US$667 tri, riqueza privada US$454 tri —
  razões computadas contra o PIB mundial (US$115 tri).
* **Módulo 03 — Guerra de Capitais (War Room)** (`war/`): a mesma cartografia da Home
  reutilizada para demonstrar a luta entre blocos — **linha do tempo reversa 2026→1914**
  com 5 épocas (Ucrânia/Pacífico · Guerra ao Terror · Guerra Fria & Petrodólar · 2ª Guerra
  · 1ª Guerra), nós de conflito pulsantes e **linhas de suprimento** das matrizes
  (Lockheed, RTX, GD, Northrop, BAE, Rheinmetall, Thales, Rostec, Halliburton…) até as
  zonas de guerra. Drawer "quem lucra": empresas beneficiadas, gráficos de surto
  normalizado, stats com fonte (SIPRI, Costs of War, GAO) e a cadeia
  **impostos/dívida → orçamento → contrato cost-plus → dividendos**.
* **Módulo 05 — Dívida: Ortodoxa ⇄ MMT + Kalecki** (`DebtModule.tsx` + `debt/`):
  **toggle de lente monetária** [Austeridade/Estado-família (com contrapontos anotados)]
  ⇄ [Soberania Monetária: passos operacionais, Brasil soberania parcial (~95% dívida
  interna em reais), espelho déficit=ativo líquido]; fluxo marxista morte/ressurreição;
  `MmtPanel` comparativo; **simulador kaleckiano** `Π≈I+(G−T)+NX+C_cap−S_trab`; card
  comparativo Dívida/Câmbio/Comércio (ortodoxa × heterodoxa).
* **Módulo 01 — Circuito do Capital** (`CircuitDiagram.tsx`): M—C(L/MP)…P…C′—M′ animado;
  tradutor didático **Horas Não Pagas = 8·m/(m+v)** com relógio analógico e barra de
  progresso; presets gamificados incluindo **Uberização (k=12, e=4)**; curva da tendência
  decrescente (modo avançado).
* **Módulo 05 — Morte e Ressurreição do Capital** (`DebtModule.tsx`): ciclo animado da
  dívida (5 passos, textos duplos por modo) + dashboard "para onde vai cada R$100 do
  orçamento" (~50% devorado pela dívida pública).
* **Módulo 06 — Raio-X de Empresas** (`CompaniesModule.tsx`): modelo **unificado**
  (~140 empresas: 24 BR + ~120 globais) — TODAS decompostas pelo mesmo motor
  W = c+v+m (`lib/companyMetrics.ts`). Duas bases: **Brasil (DFs FY2024, formato
  ILAESE)** com produtividade/exploração/horas não pagas calculadas em runtime,
  e **Maiores do Mundo** (relatórios anuais FY2024/25) com clock de exploração,
  % do market cap mundial e múltiplo mercado/receita. Linha expansível abre o
  raio-X completo (rosca c·v·m + barras comparativas). **Fontes dinâmicas de
  mercado** (desligadas por padrão, ativáveis na própria página): BRAPI/B3 em
  lote e Alpha Vantage p/ fundamentais globais, com cache 24 h e estimativas
  setoriais sinalizadas (`API·est.`) — ver DATA-GUIDELINES §9.1.
* **Módulo 07 — Plataformização** (`PlatformModule.tsx`): simulador do salário por peça
  (corridas, tarifa, comissão, km, custo/km); barra "para onde vai o bruto"; diagrama de
  transferência do capital constante; taxa oculta >400% nos extremos.

## Diretrizes de dados

**`DATA-GUIDELINES.md`** define as normas obrigatórias: fonte primária + ano em todo
número, textos dual-mode, flag `estimate`, semântica de cores conceituais, regras da
dupla lente (marxista + MMT) para temas fiscais e o passo a passo para plugar novos
países no mapa (`BLOC_MEMBERS` → `countries.ts`).

Módulo 03 vive agora como atalhos dentro do mapa; Timeline (04) permanece planejada.

## Mecanismo de métricas (`src/lib/marx.ts`)

```ts
const c = k * v                     // capital constante
const m = e * v                     // mais-valia
const profitRate = (m / (c + v)) * 100   // g = m/(c+v) = e/(k+1)
const unpaidHours = 8 * (e / (e + 1))    // trabalho não pago na jornada de 8h
```

Drawer geopolítico: `$fração = share% × PIB(base nominal|PPP)`.

## Dados

* PIBs aproximados (base FMI) e frações internas: `src/data/countries.ts` (+ stats
  ILAESE do Brasil: reserva de 92,1 mi / 43,65%, desindustrialização 27→11,3%,
  remessas R$195–294 bi).
* Orçamento & ciclo da dívida: `src/data/debt.ts`.
* Empresas (formato Anuário ILAESE): `src/data/companies.ts` — registros marcados
  `estimate: true` são ilustrativos.

> Decomposições e métricas empresariais são estimativas didáticas para visualização,
> não estatística oficial.
