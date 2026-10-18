# ANALISE_PERFORMANCE_E_OTIMIZACOES.md

> **Análise avançada de performance e otimização — Capital Blocks**
> Base: commit `d0e3cac` (`release: conclusao definitiva do capital-blocks v1.1.0`), working tree limpo.
> Método: leitura integral do código dos 4 motores de mapa, medição do bundle de produção (`npm run build`), contagem de elementos em runtime por script, e **validação experimental** do achado nº 1 com build comparativo (antes/depois, mesmo commit).
> Regra do projeto respeitada (TODO.md): nenhuma mudança de comportamento visual foi proposta sem medição; a única mudança validada experimentalmente foi revertida e está documentada no Apêndice A para aplicação.
> **Status:** a Onda 1 foi implementada em 18/10/2026 (diff desta análise + build A/B final + 5 suítes verdes) — ver **Apêndice B**.

---

## 1. Sumário executivo (TL;DR)

| # | Achado | Onde | Ganho estimado | Risco | Status |
|---|--------|------|----------------|-------|--------|
| **A1** | `vendor-deck` (deck.gl, 943 kB / **255 kB gz**) era baixado **e executado no primeiro load** — o helper de preload do Vite foi parar dentro do chunk do deck.gl, e o entry passou a importá-lo estaticamente. O modo GPU é "opcional", mas todos pagavam por ele. | `vite.config.ts` (manualChunks) | **Primeiro load: 351,7 → 97,6 kB gz (−254 kB, −72%)** | Baixo — **validado** com build A/B | ✅ Implementado |
| **B1** | No globo 3D, `distKey = (camDist*100)\|0` muda a cada frame de zoom → `applySelection()` + `recolorDots()` reescrevem e re-enviam à GPU o buffer de cor de **~15 mil pontos (~180 kB)** por frame. O único consumidor semântico é `detailOn = camDist < 2.75`. | `Globe3DCanvas.tsx:1297` | Elimina upload de ~180 kB/frame (+~100 kB no mobile) durante qualquer zoom do globo | Baixo — mudar a chave para 2 níveis preserva 100% do resultado visual | ✅ Implementado |
| **C1** | `isInteracting` nas deps de 3 memos do 2D forçava recomputação das camadas de fluxos/hover/tour **2× por gesto** (~250 elementos). A classe `.is-interacting` já existe no root — a supressão do `drop-shadow` virou 100% CSS. | `MapWorld.tsx:832/838, 938/989, 1002/1009` | Menos trabalho de reconciliação em pan/zoom; remove acoplamento de estado a CSS | Baixo | ✅ Implementado |
| **A3** | `DISASTERS` (camada mortes, **91 kB gz**) é import estático no 2D e no 3D → entra no load da aba inicial, mesmo com a camada desligada. | `MapWorld.tsx:17`, `Globe3DCanvas.tsx:15` | −91 kB gz no load da tela inicial | Baixo (import dinâmico na 1ª ativação) | Onda 2 |
| **C2** | Partículas SMIL (~112 no desktop, 52 no mobile) rodam **para sempre**, mesmo com o mapa fora da tela. Já existe a infra de pausa (`pauseAnimations` em visibilitychange/reduced-motion) — falta só o IntersectionObserver. | `MapWorld.tsx:953-957, 1215-1234` | Bateria/CPU em scroll longo e em páginas com mapa fora do viewport | Baixo | Onda 2 |
| **C4** | Contornos estaduais do IBGE são buscados **em runtime** da rede e projetados na main thread; o SW ignora origem cruzada → offline quebra a camada Brasil. | `MapWorld.tsx:649`, `sw.js:40` | Offline real + zero latência na ativação + -1 dependência externa | Médio (precisa script de build) | Onda 2 |
| **D1/D2** | `GpuFlowMap` consome o store **sem selector** e escreve `setSharedMap` a cada frame de pan — o 2D já tem debounce de 250 ms, o GPU não. | `GpuFlowMap.tsx:20, 34-44` | Elimina re-render do mapa GPU + escrita no store por frame | Baixo | Onda 2 |
| **E1** | Dados de conflitos **duplicados e divergentes** entre 2D (`CONFLICTS`) e 3D (`GLOBE_CONFLICTS`). | `MapWorld.tsx:79`, `GlobeModule.tsx:20` | Fonte única de verdade; evita correção em um lugar só | Baixo | Onda 2 |
| **F3** | Fontes via **CDN do Google** contradizem o "sem telemetria" do README e quebram o PWA offline (o SW não cacheia cross-origin). | `index.html:14-18`, `public/landing.html` | Privacidade + offline de verdade (Fontsource self-hosted) | Baixo | Onda 3 |
| **A2** | `maplibre-gl` estava no `package.json` com **zero imports** no código. | `package.json:27` | −800 kB em node_modules, lockfile e `npm ci` mais rápido | Nenhum | ✅ Implementado |

> Números de gzip desta análise: `gzip -9` consistente (pode variar ±2 kB do relatório do Vite).

---

## 2. Baseline medido (antes de qualquer mudança)

Build de produção no commit atual: **2119 módulos, ~28 s locais**. Chunks principais:

| Chunk | Bruto | gzip | Quando carrega hoje |
|---|---:|---:|---|
| `index-*.js` (entry) | 197 kB | 67 kB | **Sempre** |
| `vendor-motion` (framer-motion) | 85 kB | 30 kB | **Sempre** (legítimo — App usa motion) |
| `vendor-deck` (@deck.gl/core+layers+react) | 922 kB | **255 kB** | **Sempre (bug A1)** — deveria ser só no modo GPU |
| `index-DfMG1Hwa.css` | 79 kB | 13 kB | Sempre |
| `vendor-graph` (cytoscape + 3d-force-graph + three/examples) | 1 204 kB | 359 kB | Só no grafo corporativo (lazy ok) |
| `vendor-three` (three core 0.185) | 560 kB | 140 kB | Só globo 3D (lazy ok) |
| `disasters` (dados camada mortes) | 263 kB | 91 kB | Aba inicial (**A3**) |
| `vendor-duckdb` | 193 kB | 45 kB | Só laboratório SQL (lazy ok) |
| `MapModule`, `ConsequencesModule`, `WarModule`… | vários | 49/72/35 | Por aba (ok) |

Contagens verificadas em runtime (por script sobre os dados):

- **52 fluxos** (26 com `tier: 'detail'`), 20 blocos, 177 países.
- **112 partículas SMIL** de fluxo no desktop (2 por rota + 1 extra nas 8 rotas de peso ≥ 2,5); **52 no mobile** (`COARSE`).
- Globo: passo de amostragem de pontos de terra `DOT_STEP = 0.85°` (desktop) / `1.15°` (mobile) → **≈15 mil / ≈8,4 mil pontos**.

Primeiro load medido, somando entry + imports estáticos + `modulepreload`: **351,7 kB gz**.
Aba inicial (mapa SVG) soma depois `MapModule + countries + vendor-geo + disasters + CSS` ≈ **217 kB gz** → tela inicial completa ≈ **570 kB gz**.

---

## 3. Achados detalhados

### A. Carregamento / pipeline de build

#### A1 — [CRÍTICO, VALIDADO] deck.gl no caminho crítico do primeiro load

**O que acontece.** O entry `index-*.js` contém, na primeira linha:

```js
import{e as De}from"./vendor-deck-vF9y7ff1.js"
```

…e `De` é o helper `__vitePreload` usado por todos os `lazy(() => import(...))`. Ou seja: o Rollup mesclou o módulo virtual `vite/preload-helper` **dentro do chunk do deck.gl** (`vendor-deck`), e como o entry precisa do helper, ele passou a importar estaticamente o chunk inteiro. O `dist/index.html` confirma com `<link rel="modulepreload" href=".../vendor-deck-*.js">` — o deck.gl é **baixado, parseado e executado na primeira visita**, apesar de o mapa GPU ser um recurso opcional (só entra ao trocar para o modo deck.gl no módulo Mapa).

Com `manualChunks` em formato de objeto (`{ 'vendor-deck': ['@deck.gl/core', ...] }`), não há como direcionar o módulo virtual do helper — a resolução falha (`Missing "./preload-helper" specifier in "vite" package`).

**Correção validada (build A/B no mesmo commit).** Converter `manualChunks` para função e isolar o helper:

```ts
manualChunks(id) {
  if (id.includes('vite/preload-helper')) return 'vendor-preload'
  if (id.includes('node_modules/framer-motion/')) return 'vendor-motion'
  if (id.includes('node_modules/d3-geo/') || id.includes('node_modules/topojson-client/') || id.includes('world-atlas/')) return 'vendor-geo'
  if (/node_modules\/three\/build\/three\.(core|module)\.js$/.test(id)) return 'vendor-three'
  if (id.includes('node_modules/cytoscape/') || id.includes('node_modules/3d-force-graph/')) return 'vendor-graph'
  if (id.includes('node_modules/@deck.gl/')) return 'vendor-deck'
  if (id.includes('node_modules/@duckdb/duckdb-wasm/')) return 'vendor-duckdb'
},
```

**Resultado medido:**

| Métrica | Antes | Depois |
|---|---:|---:|
| Imports estáticos do entry | vendor-motion + **vendor-deck** | vendor-motion + **vendor-preload (1,1 kB)** |
| `modulepreload` no index.html | motion, **deck** | motion, preload |
| Primeiro load (entry + estáticos + preloads) | **351,7 kB gz** | **97,6 kB gz** |
| `vendor-three` (globo) | 573 030 B | 573 030 B (idêntico, mesmo hash) |
| `vendor-graph` / `vendor-geo` / `vendor-motion` / `vendor-duckdb` | — | tamanhos idênticos |

**Armadilha documentada:** a primeira tentativa usou `id.includes('node_modules/three/')` — isso arrastou o `three.webgpu.js` (importado por `three-render-objects`, usado pelo grafo corporativo) para o chunk do globo, inflando `vendor-three` de 573 kB para 1 146 kB. Por isso o matcher final é ancorado em `three.(core|module).js` — o globo continua baixando só o core.

#### A2 — Dependência morta: `maplibre-gl`

Declarado em `package.json:27` e no lockfile, **nenhum import em `src/`, `scripts/` ou config**. O deck.gl usa camadas próprias; o maplibre nunca chegou a ser usado (a mensagem do commit `70e9b1b` menciona "deck.gl e maplibre", mas o segundo ficou pelo caminho). Não entra no bundle (tree-shaken), mas pesa ~800 kB em node_modules, no lockfile e no `npm ci` do CI. **Remover.**

#### A3 — Dados da camada mortes no load inicial (91 kB gz)

`DISASTERS` é import estático em `MapWorld.tsx:17` e `Globe3DCanvas.tsx:15`. A camada só renderiza com `layer === 'mortes'` / `o.layer === 'deaths'` — ou seja, 91 kB gz de dados trilíngues baixados em toda visita, para um recurso opt-in. Vira `import('../data/disasters')` na primeira ativação da camada (com o dado em estado/ref; o tooltip de país não depende dele).

---

### B. Globo 3D — `Globe3DCanvas.tsx`

#### B1 — [ALTO] Recolor + upload de buffer de pontos a cada frame de zoom

No loop de frames:

```ts
const camDist = camera.position.length()
const distKey = (camDist * 100) | 0        // linha 1297 — muda a cada frame de zoom
...
if (key !== selCache) {
  selCache = key
  applySelection()   // linha 1317 — reescreve cores de todos os arcos
  recolorDots()      // linha 1318 — reescreve Float32Array de ~15k pontos + attr.needsUpdate
}
```

`recolorDots()` (linhas 701-754) percorre `dotIsos` (~15 mil no desktop / ~8,4 mil no mobile) reescrevendo o atributo de cor e marcando `attr.needsUpdate = true` → **re-upload de ~180 kB (desktop) / ~100 kB (mobile) de buffer de GPU, por frame**, durante todo zoom/scroll do globo. `applySelection()` idem para as cores dos arcos.

E o mais importante: dentro de `applySelection()`, **a única coisa que usa `camDist` é** `const detailOn = camDist < 2.75` (linha 800). Toda a sensibilidade a distância cabe em 1 bit.

**Correção proposta (2 níveis + histerese opcional):**

```ts
const distKey = camDist < 2.75 ? 1 : 0
```

Resultado visual idêntico (a opacidade das fronteiras por zoom já é tratada separadamente, com change-detection própria, nas linhas 1321-1329). O custo de zoom passa a ser: zero recolors entre 2.75 e o infinito, e um único recolor ao cruzar o limiar.

#### B2 — `toneMappingExposure` sem efeito

Linha 776 escreve `renderer.toneMappingExposure`, mas o renderer (criado na linha 141) nunca define `renderer.toneMapping` — o default `NoToneMapping` ignora exposure. Ou remover a linha, ou habilitar tone mapping de verdade (`ACESFilmic`) **com verificação visual dos 3 temas** (o bloom é calculado por conta própria hoje). Sem impacto de perf; é dívida técnica / bug latente.

#### B3 — `landWorker`: `isos: string[]` clonado por inteiro

`viaWorker` transfere apenas `positions.buffer`; a lista `isos` (~15 mil strings ISO por ponto amostrado) é **structured-clone** completa na resposta do worker, e permanece como `string[]` na `LandMatrix` (memória + GC). Trocar por `Uint16Array` de códigos (com um dicionário `code → iso` de 177 entradas) reduz a cópia a ~30 kB binários e o footprint permanente. Impacto: medido apenas na inicialização do globo (não é per-frame), por isso fica na Onda 2.

---

### C. Mapa 2D SVG — `MapWorld.tsx`

#### C1 — `isInteracting` dentro de memos (recomputação 2× por gesto)

A supressão do `drop-shadow` durante gestos existe nas camadas de tour (832), fluxos (938) e hover (1002), e por isso `isInteracting` entrou nas deps dos três memos (838, 989, 1009). Cada transição de gesto (início e fim) **reconstitui a árvore React das camadas de fluxo** (~52 grupos + ~112 partículas + hit-areas). A classe `.is-interacting` já é aplicada no root (linha 1238) e o padrão de CSS correspondente já existe para o viewport (`willChange`, 1269).

**Correção (implementada):** o `filter` saiu do `style` inline e virou a classe `.glow-filter` no `index.css`, com cor/raio via CSS vars:

```css
.map-root .glow-filter { filter: drop-shadow(0 0 var(--glow-blur, 8px) var(--glow-color, #fff)); }
.map-root.is-interacting .glow-filter { filter: none; }
```

…e `isInteracting` saiu das deps dos três memos. Sem impacto visual; menos trabalho de reconciliação e menos acoplamento.

#### C2 — Partículas SMIL nunca pausam fora da tela

Já existe a infra certa (linhas 1215-1234): `svg.pauseAnimations()` em `document.hidden` e em `prefers-reduced-motion`. Falta o caso "aba visível, mapa fora do viewport" — o caso mais comum em páginas longas (a home tem conteúdo abaixo do mapa — o próprio módulo Consequences usa `AffectedMap` também). Um `IntersectionObserver` no container alternando pause/unpause resolve; comportamento visível idêntico (a animação retoma de onde parou). Mesmo problema no `WarMap` (linhas 109-113: `animateMotion` sem nenhum gate de reduced-motion — quebraria a acessibilidade se alguém adicionar o gate global só no MapWorld).

#### C3 — Link compartilhado `?v=` sem clamp

`MapWorld.tsx:282-288` valida só `isNaN` — um link `?v=999999,0,0` abre o mapa num zoom absurdo (ou `k=0`/negativo). Clampar `k` aos mesmos limites do gesto de roda e `x,y` ao range do viewBox é uma correção de 3 linhas.

#### C4 — IBGE em runtime + projeção na main thread

`fetch('https://servicodados.ibge.gov.br/...')` (linha 649) no momento em que o modo Brasil liga; a projeção GeoJSON→path SVG roda na main thread. Três problemas: (1) latência externa visível; (2) offline quebra (o SW da linha 40 ignora origem cruzada); (3) dependência de disponibilidade de um serviço público de terceiro. **Sugestão:** script de build (seguindo o padrão dos `scripts/*.mjs` auditáveis do repo) que baixa e gera `src/data/brStates.ts` com os paths já projetados (a qualidade `minima` é pequena — a aba Brasil carrega hoje alguns kB de rede por sessão); manter o fetch como fallback. Ganho colateral: elimina a projeção main-thread.

#### C5 — Nomes de países em inglês no pt/es

Tooltips/`<title>` do MapWorld usam `f.name` do Natural Earth (inglês) — em pt-BR aparece "Germany", "Russia" etc. (`MapWorld.tsx:895, 904`). **O precedente já existe no próprio repo:** `WarMap.tsx:35-40` e `AffectedMap.tsx:67` usam `Intl.DisplayNames` (zero bytes de bundle, nomes localizados nativos). Alinhar o MapWorld.

---

### D. Mapa GPU deck.gl — `GpuFlowMap.tsx`

#### D1 — Store inteiro sem selector

`const { sharedMap, setSharedMap, setMapRenderer, setTab, openCountry, lang } = useApp()` (linha 20) — re-render a **qualquer** mudança de store (inclusive toasts, selFlow do 2D, etc.). Trocar por seletores individuais (`useApp(s => s.setSharedMap)` etc.), como o MapWorld já faz.

#### D2 — `setSharedMap` por frame + feedback loop

`onViewStateChange` (34-44) escreve no store **a cada frame** de pan/zoom do deck. O 2D já resolveu isso com debounce de 250 ms (`MapWorld.tsx:575-583`). Como o componente também **lê** `sharedMap` na inicialização, o resultado hoje é: frame de pan → write no store → re-render do GpuFlowMap (D1) → mais trabalho por frame. Debounce de 250 ms + selectors resolvem ambos.

#### D3 — Paridade de recursos e a promessa de "60 FPS"

O modo GPU cobre ~40% do que o 2D oferece: sem legenda, sem conflitos/guerras, sem BRICS/DIT/salários/mortes, sem modo Brasil, sem tour, sem partículas, sem tooltips/labels de países (só `autoHighlight`). O rótulo "⚡ GPU Deck.gl 60 FPS" sugere paridade que não existe. Decisão de produto: (a) rotular como "visualização massiva (beta) — subconjunto de camadas" e mover para opções avançadas; ou (b) portar as camadas faltantes para layers do deck. Também: `pitch: 38` (linha 27) em um mapa de fluxos 2D distorce a leitura — avaliar `pitch: 0` ou deixar o usuário controlar.

---

### E. Dados e arquitetura

#### E1 — Conflitos duplicados 2D/3D

`CONFLICTS` (MapWorld.tsx:79) e `GLOBE_CONFLICTS` (GlobeModule.tsx:20) descrevem os mesmos 3 conflitos com campos/textos próprios. Extrair `src/data/conflicts.ts` (com os textos trilíngues) e consumir nos dois motores — uma correção editorial passa a valer para ambos.

#### E2 — Estado `'chokepoints'` inalcançável na prática

`MapOverlayMode = 'padrao' | 'dit' | 'chokepoints'` (store) e o MapWorld testa `overlayMode === 'chokepoints'` (linha 1154), mas **nada na UI jamais define esse valor** (os dois toggles só alternam `dit`/`padrao`). Ou expor o toggle, ou remover do union (mantendo a ativação via `lens === 'geografia'`, que já cobre os chokepoints).

---

### F. Infraestrutura, PWA e qualidade

#### F1 — Tooling: sem linter/formatter, flags TS desligadas

Sem ESLint/Prettier (nem deps, nem script, nem config) — mas há **comentários `// eslint-disable-next-line react-hooks/exhaustive-deps` órfãos** no código (p.ex. `MapWorld.tsx:915, 1012, 1045`), de um linter que nunca foi instalado. E `tsconfig.app.json:16-17` desliga `noUnusedLocals`/`noUnusedParameters`. Sugestão: adotar **Biome** (uma ferramenta, zero config pesada) ou ESLint flat + Prettier; ligar as duas flags do TS; e transformar os `eslint-disable` órfãos em `useExhaustiveDependencies` válidos — ou remover. (Os memos com `eslint-disable` hoje são as maiores fontes de risco de bug sutil de closure no arquivo.)

#### F2 — Versão do package.json dessincronizada

`package.json:4` diz `"version": "1.0.0"`, mas o commit de release é `v1.1.0`. Alinhar na Onda 1 (1 linha) e, se houver tags, usar `npm version` para nunca mais divergir.

#### F3 — Google Fonts por CDN (privacidade + offline + performance)

`index.html:14-18` carrega Inter/JetBrains Mono de `fonts.googleapis.com`/`fonts.gstatic.com` (com o carregamento assíncrono bem feito, por sinal), e `public/landing.html` idem. Isso contradiz o "sem telemetria/rastreamento" do README (o request vaza IP/navegador ao Google) e quebra o offline do PWA (o SW só cacheia same-origin). **Fontsource** (`@fontsource-variable/inter`, `@fontsource/jetbrains-mono`) self-hospeda com subsetting, elimina 2 preconnects e torna o offline real. Ganho menor de latência (1ª visita), ganho real de privacidade e offline.

#### F4 — SW sem cache para origem cruzada

Se a decisão for **manter** alguma dependência externa (IBGE), vale uma rota explícita no SW para cacheá-la (stale-while-revalidate com TTL), como já é feito para same-origin. Alternativa preferida: resolver na origem (C4 / F3) e não precisar disso.

#### F5 — Lacunas de teste por área

O repo tem 5 suítes no CI (conteúdo/empresa/store/tours + propriedades do voo 3D + enquadramento + auditorias editoriais) — muito acima da média. As lacunas que restam:

- **Nada visual/e2e nos mapas**: uma regressão de render no SVG/globo só é pega a olho. Com Playwright, 3-4 snapshots (mapa 2D padrão, modo Brasil, globo, deck) + comparação de pixels resolveriam.
- **Sem orçamento de bytes no CI**: o bug A1 passaria (e passou) pelo CI. Um passo que falha se `entry + estáticos > X kB gz` (p.ex. 120 kB) teria travado o deck.gl no caminho crítico. Custa ~10 linhas no workflow.
- **Viewport math do 2D não testada**: o 3D tem `flight-test.mjs`/`framing-test.mjs` (property tests), mas o pan/zoom/clamp do 2D é inline no componente. Extrair `zoomAt(screenPt, delta, view)` para um módulo puro e testar (mesmo padrão dos scripts existentes).

#### F6 — `chunkSizeWarningLimit: 1500`

O limite foi elevado até 1500 kB — o que esconde justamente os chunks problemáticos (vendor-graph 1204 kB, vendor-deck 943, disasters 263). Com os chunks nomeados (que já são), o aviso é acionável: baixar para ~400 kB e tratar os legítimos com comentário no config.

---

## 4. Roadmap em ondas (impacto × esforço)

### Onda 1 — fazer já (baixo risco, ganho alto, tudo verificado) — ✅ IMPLEMENTADA

1. ~~**A1**~~ ✅ — `manualChunks` função + `vendor-preload` (Apêndice A). −254 kB gz no primeiro load, resto idêntico.
2. ~~**B1**~~ ✅ — `distKey` booleano (`camDist < 2.75`). Elimina ~180 kB/frame de upload de GPU no zoom do globo.
3. ~~**A2**~~ ✅ — `maplibre-gl` removido do `package.json` + lockfile.
4. ~~**C1**~~ ✅ — CSS `.glow-filter` + `.is-interacting`; `isInteracting` fora das deps dos 3 memos.
5. ~~**F2**~~ ✅ — `version: 1.1.0`.
6. ~~**C3**~~ ✅ — clamp do `?v=` (k 1–10; conteúdo sempre parcialmente visível).
7. ~~**B2**~~ ✅ — `toneMappingExposure` removido (com nota para reintroduzir se um dia houver tone mapping).

*Verificação obrigatória (protocolo TODO.md):* build A/B comparando tabela de chunks + smoke visual do globo cruzando 2.75.

### Onda 2 — ganho médio/líquido (esforço pequeno a médio)

8. **A3** — import dinâmico de `DISASTERS` na 1ª ativação (−91 kB gz na tela inicial).
9. **C2** — IntersectionObserver → `pauseAnimations()` (MapWorld + WarMap).
10. **D1+D2** — selectors no GpuFlowMap + debounce de 250 ms no `setSharedMap`.
11. **E1** — `src/data/conflicts.ts` único para 2D/3D.
12. **B3** — `isos` como `Uint16Array` no worker e na `LandMatrix`.
13. **C4** — script `npm run build:brstates` (padrão `scripts/*.mjs`) gerando paths do IBGE já projetados; fetch runtime vira fallback.
14. **C5** — `Intl.DisplayNames` nos tooltips do MapWorld (copiar padrão do WarMap).
15. **F5 (parcial)** — gate de orçamento de bytes no CI (impede regressão do tipo A1).

### Onda 3 — estrutural / qualidade

16. **F1** — Biome/ESLint+Prettier, `noUnusedLocals/Parameters: true`, resolver os `eslint-disable` órfãos.
17. **F3** — fontes self-hosted (Fontsource) + remoção dos preconnects.
18. **F4** — política de cache do SW para cross-origin (se ainda houver alguma).
19. **F5 (resto)** — Playwright visual (4 snapshots) + extrair/testar viewport math do 2D.
20. **D3** — decisão de produto sobre o modo GPU (rótulo honesto + subconjunto documentado, ou portar camadas); `pitch` revisado.
21. **F6** — baixar `chunkSizeWarningLimit` e tratar exceções individualmente.
22. **E2** — expor ou remover `'chokepoints'` do `MapOverlayMode`.

---

## 5. O que já é excelente — **não mexer**

Registrado para que nenhuma onda futura "otimize" o que já está no ponto:

- **Globo 3D:** batching/instancing (arcos, pontos, gratícula, atmosfera em pouquíssimos draw calls), worker para a matriz de terra com fallback `viaChunks`, DPR adaptativo com histerese, `zoomTier` com degraus estáveis (não re-renderiza a cada nível de zoom), rótulos que só tocam no DOM o que mudou (1341-1346), rAF coalescing na interação.
- **2D SVG:** transform direto no `<g>` do viewport (sem re-render por frame), memos por camada com comentários explicando as deps, partículas com orçamento por dispositivo (`COARSE`), `vectorEffect` correto nas larguras, `willChange` condicional durante gesto.
- **Store:** `sharedMap` com debounce no 2D, sanitização no rehydrate, sync atômico 2D→3D (`handleGoTo3D`).
- **Pipeline:** code splitting por aba, SW network-first para HTML + cache-first para assets hashed, 5 suítes no CI antes do build, scripts de auditoria (`tour-audit`, `tour-editorial`) e property tests do voo/enquadramento 3D, `describe.skipIf(!LIVE)` no teste de rede.
- **Docs:** `TODO.md` com protocolo de medição, `DATA-STANDARD.md`, comentários de intenção no código (o "porquê" está documentado junto das decisões).

---

## 6. Protocolo de verificação (para cada onda)

1. **Antes:** `npm run build` → guardar tabela de tamanhos (bruto/gz) + `Select-String modulepreload dist/index.html` + `git stash` se necessário.
2. **Depois:** mesma medição; nenhum chunk fora de `vendor-*`/`disasters` deve mudar de tamanho por causa de config de chunking.
3. **Visual:** smoke manual nos 4 motores (2D padrão/geografia/Brasil, globo com zoom cruzando 2.75, war map, deck) + devtools Performance (FPS em pan/zoom do globo antes/depois do B1).
4. **Rede:** DevTools → Network com cache desabilitado na 1ª visita: confirmar que `vendor-deck` **não** aparece até trocar para o modo GPU.
5. **CI:** as 5 suítes continuam verdes (as mudanças da Onda 1 não tocam lógica de conteúdo).

---

## Apêndice A — Diff exato validado do achado A1

```diff
   build: {
     rollupOptions: {
       output: {
-        manualChunks: {
-          'vendor-motion': ['framer-motion'],
-          'vendor-geo': ['d3-geo', 'topojson-client', 'world-atlas/countries-110m.json'],
-          'vendor-three': ['three'],
-          'vendor-graph': ['cytoscape', '3d-force-graph'],
-          'vendor-deck': ['@deck.gl/core', '@deck.gl/layers', '@deck.gl/react'],
-          'vendor-duckdb': ['@duckdb/duckdb-wasm'],
-        },
+        manualChunks(id) {
+          if (id.includes('vite/preload-helper')) return 'vendor-preload'
+          if (id.includes('node_modules/framer-motion/')) return 'vendor-motion'
+          if (id.includes('node_modules/d3-geo/') || id.includes('node_modules/topojson-client/') || id.includes('world-atlas/')) return 'vendor-geo'
+          if (/node_modules\/three\/build\/three\.(core|module)\.js$/.test(id)) return 'vendor-three'
+          if (id.includes('node_modules/cytoscape/') || id.includes('node_modules/3d-force-graph/')) return 'vendor-graph'
+          if (id.includes('node_modules/@deck.gl/')) return 'vendor-deck'
+          if (id.includes('node_modules/@duckdb/duckdb-wasm/')) return 'vendor-duckdb'
+        },
       },
     },
```

**Evidência do build A/B (mesmo commit, `vite build`):**

```
ANTES   entry importa: vendor-motion, vendor-deck          → 351,7 kB gz no 1º load
DEPOIS  entry importa: vendor-motion, vendor-preload (1,1 kB) → 97,6 kB gz no 1º load
        vendor-three 573 030 B (hash idêntico) · vendor-graph/geo/motion/duckdb inalterados
```

> Nota: o script do deck continua íntegro — `GpuFlowMap` (lazy) importa `vendor-deck` no grafo dinâmico, e o `__vite__mapDeps` o pré-carrega **ao ativar o modo GPU**, como originalmente projetado.

---

## Apêndice B — Onda 1 implementada (18/10/2026)

**Arquivos alterados:**

| Arquivo | Mudança |
|---|---|
| `vite.config.ts` | `manualChunks` objeto → função + `vendor-preload` + matcher do three ancorado no core |
| `src/components/globe3d/Globe3DCanvas.tsx` | `distKey = camDist < 2.75 ? 1 : 0`; `toneMappingExposure` removido (B2) |
| `src/components/MapWorld.tsx` | helper `glowVars` + classe `.glow-filter`; `isInteracting` fora das deps dos 3 memos; clamp do `?v=` |
| `src/index.css` | `.map-root .glow-filter` / `.map-root.is-interacting .glow-filter` |
| `package.json` + lockfile | `maplibre-gl` removido; `version: 1.1.0` |

**Build A/B final (produção, `npm run build`):**

```
ANTES   1º load = 351,7 kB gz   (entry + motion + vendor-deck 255 kB)
DEPOIS  1º load =  97,6 kB gz   (entry + motion + vendor-preload 1,1 kB)
        vendor-three 573 030 B (MESMO hash: DiUEOK-7, inalterado)
        vendor-deck/faAZIP97 · vendor-graph/hAbvM5BE · geo/motion/duckdb inalterados
```

**Suítes (todas verdes):** `npm test` (115 passed, 1 skipped) · `test:globe` (448/448) · `test:framing` (52/52) · `test:tours` (0 erros) · `test:tours:editorial` (0 erros).

**Pendência de verificação manual (protocolo da §6):** smoke visual do globo cruzando 2.75 (modo detalhado), das partículas/glow do 2D em gesto e do card `?v=` malformado — nada disso é coberto por teste automatizado ainda (item F5 da Onda 3).
