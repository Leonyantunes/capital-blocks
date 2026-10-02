# TODO — Capital Blocks

Plano de trabalho definido em 2026-09-12. **P0 = prioridade agora** (análise já feita,
executar com medição antes/depois). P1 = registradas; planejar em detalhe antes de executar.
P2 = correções/limpezas conhecidas (podem entrar de carona em outros commits).

Regra de ouro das P0: **nenhuma regressão visual aceitável** — otimizar sem perder qualidade.
Critério de sucesso: 60fps sustentados no mapa base e ≥45fps durante tour/zoom em celular
mid-range (perfis DevTools mobile + device real), com aparência idêntica lado a lado.

> **Auditoria 2026-10-02 — estado de fechamento:** `npm run build` ✅ · `npm test`
> 102/102 executados ✅ (1 suíte/1 teste deliberadamente skipped) · `test:globe` 392/392 ✅ ·
> `test:framing` 52/52 ✅ · `test:tours` 0 erros/0 avisos ✅. Entraram mais três melhorias
> sem reduzir a qualidade: pan/pinch/trackpad do mapa 2D agora coalescem eventos em no máximo
> 1 commit React por frame; o globo 3D recupera DPR/nitidez automaticamente com histerese após
> quedas temporárias de FPS; partículas 3D deixam de desenhar/atualizar quando os arcos estão
> desligados e fluxos invisíveis deixam de recalcular Bézier. O manifesto PWA também passou a
> usar URLs relativas e foi validado num build com `VITE_BASE=/capital-blocks/`.
>
> **V1.0.0:** o escopo funcional/editorial está fechado. Tradução completa EN/ES foi
> explicitamente movida para o ciclo pós-V1; hoje só o chrome está parcialmente traduzido.
> Como validações/polimentos pós-release permanecem: (1) perfil + comparação visual em Android
> mid-range real; (2) ampliar a cobertura de empresas quando houver nova rodada editorial;
> (3) capturar screenshots/GIFs reais para a landing. Revisão das fontes pendentes, proveniência das 101
> estatísticas dos tours e auditoria editorial (0 erros/0 avisos) foram concluídas em 2026-10-02.
> O globo pode sair do selo
> BETA depois da validação visual/performance em aparelho real.

> **2026-10-02 — Fecho editorial dos tours + 3º nível de leitura:** as 101 estatísticas
> dos 6 tours agora carregam `sourceIds` canônicos e os cards 2D/3D abrem diretamente a
> ficha da fonte no Módulo 10. A auditoria dos tours passou a validar arrays aninhados de
> `didStats` corretamente; `test:tours` fecha com 101/101 estatísticas conferidas. As 49
> paradas têm texto `simples` explícito e o teste editorial bloqueia jargões técnicos no
> nível fundamental/início do médio. A varredura transversal também levou `textoPorModo()`
> aos principais módulos, simuladores, drawers, gráficos e tooltips. O registro de fontes
> está sem entradas efetivas em `revisao-pendente` nesta data.

> **Status (2026-09-12):** P0 concluída (commit 7cc5f7a 2D · e59d585 3D+worker) e P2
> concluída (8e2a90a rápido · e7b8bcb médio). Verificado no navegador: render idêntico
> aos baselines, FPS do globo 68 → 87 no HUD (software rendering; ganho maior esperado
> em GPU mobile), picking e drawers OK. Falta ainda medir em device real Android.
>
> **2026-09-13 — Tour padronizado (c39b86b):** rota selecionada sempre visível (2D e 3D),
> enquadramento com folga + distância mínima, distância 3D derivada do k (`distFromK`),
> `stopIsos` em união + isos nas paradas cegas, auto-close não dispara no tour, voos
> mais suaves (3D 2.5s · 2D ~3s) e aba restaurada da URL (`?t=`). Contrato de parada
> documentado no cabeçalho de `tours.ts` — tours novos não precisam mexer no código.
>
> **2026-09-28 — Numeração única (da96c6e + fecho):** a numeração de módulos foi
> centralizada em `src/data/modules.ts` (`MODULES`, `modRef()`, `modTitle()`); Navbar,
> i18n e store consomem o registro e **nenhum número é escrito à mão no código**.
> README reescrito na ordem canônica (o antigo tinha 05 duplicado e 08/09 ausentes).
> Também: preferências agora persistem (aba 2), suíte Vitest criada (aba 3) e 7 fontes
> promovidas de `revisao-pendente` → `url-incluida` (aba 4).
>
> **Estado verificado ao fim:** `npm run build` ✅ · `npm test` 49/49 ✅ ·
> `test:globe` 392/392 ✅ · `test:framing` 52/52 ✅.
>
> **2026-09-30 — Fecho de qualidade + features P1 (análise externa + execução):**
> a auditoria encontrou divergências entre docs e código e pendências reais, todas
> resolvidas. **Correções:** SW funcionava só na raiz do domínio (paths absolutos em
> `main.tsx`/`public/sw.js` quebravam o deploy de subpath — agora o escopo é derivado
> da localização do próprio sw.js, e o Vite reescreve o index.html); os 4 setores BR
> antes em gap ganharam entradas MEDIDAS no próprio dataset (B3 0.36/0.05 · WEG
> 0.13/0.10 · Embraer 0.08/0.12 · Localiza 0.07/0.03; decisão editorial: varejo
> farmacêutico é varejo); header de `wages.ts` citava fonte RETRAÍDA (Gallup/Statista)
> — agora cita a cadeia ILOSTAT; `Tip.tsx` ficou acessível por teclado de verdade
> (tabIndex + focus-within + aria-describedby); constantes duplicadas deduplicadas
> (`WORLD_GDP_TRI`/`WORLD_EQUITIES_TRI` em worldWealth.ts; `SM_BR_ANO` em
> alternatives.ts); empresas globais agora carregam `fonte` por registro.
> **Infra:** deploy.yml roda as 5 suítes ANTES do build/deploy. **Features:** página
> de configurações (aba `settings`, botão ⚙ — centraliza nível de leitura, tema,
> idioma, referências e apresentação); modo referências (`showRefs` + `RefTag` +
> `fonte` no MetricCard com proveniência); modo claro (paleta `[data-theme='light']`
> por variáveis em index.css — mapas 2D/3D mantêm canvas escuro próprio); landing
> page estática autocontida (`public/landing.html`).
>
> **Estado verificado ao fim:** `npm run build` ✅ · `npm test` 83/83 ✅ ·
> `test:globe` 392/392 ✅ · `test:framing` 52/52 ✅ · `test:tours` 0 erros ✅.

---

## P0 · Otimização mobile dos mapas 2D e 3D — ✅ CONCLUÍDA (7cc5f7a + e59d585)

### Globo 3D — o maior ganho está em draw calls (~200 → ~30)

Diagnóstico (contagem atual de objetos desenháveis por frame):
52 arcos × 3 objetos (linha + núcleo branco + seta-cone) = 156 · marcadores 19×2 = 38 ·
desastres 10×2 = 20 · oceano/estrelas/grade/atmosfera/halo/pontos/fronteiras/movers ≈ 9
→ **~205 draw calls** com tudo visível. Mobile GPU é limitada por draw call, não por
triângulos — é o gargalo dominante do 3D.

1. **[3D-a] Fundir linhas dos arcos por tipo de fluxo** — hoje cada fluxo tem `Line` +
   `Line` núcleo com material próprio (opacidade por material). Fundir as geometrias em
   ~12 `LineSegments` (6 tipos × sólido/tracejado — dash exige material separado), com
   **cor por vértice** escurecendo/clareando para simular opacidade (o blending já é
   aditivo: cor escura ≈ opacidade baixa, mesma estratégia já usada nos *movers* em
   `Globe3DCanvas.applySelection`). Visibilidade por camada = `object.visible` do grupo
   do tipo; seleção/ênfase = rewrite do buffer de cores (idem movers). 156 → 12 draw
   calls, aparência equivalente.
2. **[3D-b] Setas dos arcos em um `InstancedMesh`** — 52 cones com 52 geometrias
   idênticas; uma única `ConeGeometry` compartilhada + instancing com cor por instância
   (`instanceColor`). 52 → 1 draw call.
3. **[3D-c] Marcadores de blocos em 2 `InstancedMesh`** (esferas + anéis), mantendo
   raycast via `instanceId` → mapeamento `instanceId → blocId` (labels HTML continuam).
   Desastres idem quando a camada estiver ativa. 58 → ~4 draw calls.
4. **[3D-d] Compartilhar geometrias** — Cone/Sphere/Ring criadas por objeto hoje;
   centralizar instâncias únicas (menos memória GPU, init mais rápido, dispose simples).
5. **[3D-e] Matriz de pontos em Web Worker** — `buildLandMatrixAsync` divide por
   `setTimeout` (chunks de 6 faixas de latitude com `geoContains` em ~170 países);
   em CPU mobile cada chunk pode levar dezenas de ms → jank durante o load. Mover para
   worker (`new Worker(new URL(...), {type:'module'})` funciona no Vite), transferir o
   `Float32Array` (zero-copy) e manter o método atual como fallback. Progresso via
   `postMessage`.
6. **[3D-f] Só se o profiling pedir** — avaliar `antialias` em mobile de alto DPR
   (hoje off; em DPR ≥ 2.5 a qualidade já é boa) e `powerPreference`. Não mudar sem
   evidência de ganho ≥ 10% de frame time sem perda visível.

### Mapa 2D — partículas, filtros e eventos

Diagnóstico: ~112 partículas SMIL visíveis (8 fluxos com 3 + 44 com 2), 177 paths de
país com 2 handlers cada + `<title>`, `drop-shadow` **por path** no destaque do tour
(um fluxo da UE pinta 27 países com filtro individual = 26 camadas de raster a mais).

7. **[2D-a] Orçamento de partículas por ponteiro** — `matchMedia('(pointer: coarse)')`:
   1 partícula por fluxo (2–3 hoje), 3 apenas no fluxo selecionado; desktop inalterado.
   SMIL já pausa com aba oculta/reduced-motion (mantém).
8. **[2D-b] Destaque do tour sem filtro por path** — aplicar o `drop-shadow` **uma vez
   no `<g>`** que agrupa só os países destacados (um único filter pass), ou trocar por
   overlay de traçado largo translúcido (visualmente equivalente ao glow). Elimina o
   custo dominante de re-rasterização durante pan/zoom do tour.
9. **[2D-c] Delegação de eventos** — handlers `onPointerEnter`/`onClick` no `<g>`
   (via `event.target`) em vez de 177×2 closures; menos memória e mount mais rápido.
10. **[2D-d] Hover só com ponteiro fino** — gate `pointer: fine` no `showHoverLabel`
    (evita tooltip preso/toques disparando hover e re-renders durante o arrasto no
    celular; no toque o `<title>` nativo já é inútil e o clique abre o drawer).
11. **[2D-e] Avaliar (descartável)** — degrau de quantização 0,5× do `kq` **apenas
    durante pinch ativo**. Se houver popping perceptível, descartar (qualidade primeiro).
12. **[2D-f] Manter** — camadas memoizadas, hover como overlay, `will-change: transform`,
    `touch-action: none`, `vector-effect: non-scaling-stroke`: já corretos, não mexer.

### Medição (fazer parte de cada PR)

13. **Perfil antes/depois obrigatório** — FPS HUD do próprio globo + Chrome DevTools
    (throttle CPU 4×/6×, motores mobile) + um device real Android mid-range. Registrar
    números no PR. Screenshot lado a lado (antes/depois) para atestar ausência de
    regressão visual.

---

## P1 · Registradas — planejar antes de executar

14. **Modo referências + página de referências** — ✅ CONCLUÍDA. A página central
    existe (Módulo 10, com estado de verificação honesto) e a auditoria de dados foi
    feita (5ff72cc + fecho 2026-09-30). O modo referências entrou em 2026-09-30:
    flag `showRefs` no store + `ui/RefTag.tsx` + `fonte` no `MetricCard`
    (proveniência "modelo do app" nos cartões de slider) + toggle nas Configurações.
    Os painéis que já exibiam fonte inline (IndicatorsStrip, FlowCard, drawers,
    wealth, linhas expandidas do Raio-X) seguem como estão. As 101 estatísticas dos
    tours agora também têm `sourceIds` canônicos e atalho direto para a ficha da fonte.
15. **Página de configurações** — ✅ CONCLUÍDA (2026-09-30): aba `settings` no
    registro canônico (fora da fileira numerada), botão ⚙ na Navbar (desktop,
    mobile e gaveta), página com nível de leitura, tema, idioma, modo referências
    e modo apresentação, com descrições e estado anunciado (role="switch").
16. **Auditoria didático × avançado × simples** — ✅ CONCLUÍDA na rodada de fechamento
    da V1: tours, módulos principais, simuladores, drawers, gráficos e tooltips passaram
    pela varredura; `test:tours:editorial` bloqueia regressões editoriais nas 49 paradas.
17. **Modo didático simplificado (3º nível)** — ✅ CONCLUÍDA (2026-10-02): `UIMode
    'simples'` com estratégia `resolve()` (simples → didático → avançado) e
    traduções curadas em `src/lib/simples.ts` — simplifica a LINGUAGEM sem
    simplificar o NÚMERO.
18. **Modo claro** — ✅ CONCLUÍDA (2026-09-30): paleta `[data-theme='light']` por
    variáveis em `index.css` (os utilitários Tailwind v4 compilam para
    `var(--color-*)` — inverte sem tocar nas classes); flag `theme` no store
    (persistida + validada), `data-theme` na raiz + meta theme-color acompanham;
    token `onaccent` (texto sobre destaque não inverte). Mapas 2D/3D mantêm canvas
    escuro próprio nos dois temas.
19. **Completar a listagem de empresas do Raio-X** — parcial: dedupe com fontes
    dinâmicas resolvido (merge por ticker) e as globais agora têm `fonte` por
    registro (2026-09-30). Falta ampliar cobertura (empresas ausentes relevantes).
20. **Tradução completa do app para ES e EN — PÓS-V1** — parcial: o chrome (`i18n.ts`)
    cobre a UI inteira incluindo Configurações e Módulo 10; o conteúdo dos
    módulos/tours/dados segue PT-BR. Não bloqueia a V1. Grande esforço editorial: planejar pipeline
    (dados dual-language em `src/data` vs camada de tradução).
21. **Landing page profissional** — ✅ CONCLUÍDA (2026-09-30): página estática
    autocontida em `public/landing.html` (design system do app, hero com a
    fórmula W=c+v+m, 10 módulos, recursos, metodologia, CTA para o app).
    Screenshots/GIFs reais do app ainda não entram (requerem captura em device).

---

## P2 · Correções e limpezas conhecidas — ✅ CONCLUÍDAS (8e2a90a + e7b8bcb)

22. **Bugs de UI**: tooltip TMD com texto invertido (`CountryDrawer.tsx:42` — mostra o
    texto do modo oposto); `colSpan={7}` na tabela BR de 5 colunas
    (`CompaniesModule.tsx:420`).
23. **Dedupe das fontes de mercado** — `COMPANIES_ALL.concat(apiRecords)` duplica
    Petrobras/Vale/Itaú etc. ao sincronizar BRAPI/Alpha Vantage
    (`CompaniesModule.tsx:65-84`); chaves por ticker/nome + merge em vez de concat.
24. **Numeração de módulos inconsistente** — Navbar diz 07, `WealthModule` diz "MÓDULO
    08", `WorldWealthPanel` diz "Módulo 07", `BillionaireTimeline` cita "Módulo 06".
    Centralizar numeração/nomes num único export.
25. **Comentário/conta do salário mínimo** — `SM_BR_ANO = 18216` rotulado "1.518 × 13,3"
    (`EscalaCompare.tsx:9`, `alternatives.ts`) mas 18216 = 1518×12; decidir intenção
    (13º/terço muda as comparações em ~10%) e corrigir.
26. **Código morto** — `mt`/`lang` não usados em `MapModule.tsx`; `Math.round((r*1518)/1518)`
    em `AlternativesModule.tsx:53`; ternário `? 0 : 0` em `KaleckiSimulator.tsx:80`;
    `loadSyncSettings()` 3× em `CompaniesModule.tsx:104-106`.
27. **Rascunhos em dados de produção** — `debt.ts:21` ("Bolsa Família, BNDES? Não: …") e
    `brazil.ts:45,49,54` ("RGE?", "Porto Sul?", "Refinaria?").
28. **A11y** — ESC fecha drawers (`useFocusTrap`); `ui/Tip.tsx` acessível por
    teclado/foco (hoje hover-only); partículas SMIL de `CircuitDiagram`/`FollowSalary`/
    `WarMap` sob `prefers-reduced-motion`.
29. **Constantes duplicadas** — PIB mundial/market cap em `companies.ts` ×
    `worldWealth.ts`; anotações hardcoded de `ConcentrationCharts` vs `TOP1_SERIES`.
30. **Limpeza de repo** — remover os 6 arquivos vazios da raiz (`alternatives`, `circuit`,
    `companies`, `consequences`, `debt`, `platform`); atualizar `DATA-GUIDELINES.md`
    (`FLOWS` hoje em `src/data/flows.ts`; campo `salarioMedioK`).
