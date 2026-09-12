# TODO — Capital Blocks

Plano de trabalho definido em 2026-09-12. **P0 = prioridade agora** (análise já feita,
executar com medição antes/depois). P1 = registradas; planejar em detalhe antes de executar.
P2 = correções/limpezas conhecidas (podem entrar de carona em outros commits).

Regra de ouro das P0: **nenhuma regressão visual aceitável** — otimizar sem perder qualidade.
Critério de sucesso: 60fps sustentados no mapa base e ≥45fps durante tour/zoom em celular
mid-range (perfis DevTools mobile + device real), com aparência idêntica lado a lado.

---

## P0 · Otimização mobile dos mapas 2D e 3D (analisado — executar primeiro)

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

14. **Modo referências + página de referências** — badge/fonte discreta e consistente
    em TODOS os números exibidos (mapas, tours, cards, drawers) + página central com
    todas as fontes de dados e informações (uso educacional/didático). **Aproveitar a
    implementação para auditar os dados e corrigir os que estiverem errados/desatualizados.**
15. **Página de configurações** — centralizar toggles: modo com/sem referências,
    didático/avançado (e o futuro simplificado), idioma, modo claro/escuro, modo
    apresentação. (Hoje espalhados na Navbar.)
16. **Auditoria didático × avançado** — garantir diferença clara e consistente entre os
    dois modos em todo o app (há pares de texto quase idênticos hoje).
17. **Modo didático simplificado (3º nível)** — foco em público leigo/menor escolaridade:
    ainda mais limpo visualmente, direto, informações fáceis de absorver; afeta TODO o app.
18. **Modo claro** — design system por tokens já existe (fase obsidian); criar paleta
    clara equivalente + persistência por tema.
19. **Completar a listagem de empresas do Raio-X** — hoje 24 BR + 119 globais;
    ampliar cobertura (empresas ausentes relevantes) e resolver o dedupe com as fontes
    dinâmicas (ver P2-23).
20. **Tradução completa do app para ES e EN** — hoje só o "chrome" (`i18n.ts`); todo o
    conteúdo dos módulos/tours/dados é PT-BR. Grande esforço editorial: planejar
    pipeline (dados dual-language em `src/data` vs camada de tradução).
21. **Landing page profissional** — apresentação do projeto, tour de screenshots/GIFs,
    CTA para o app.

---

## P2 · Correções e limpezas conhecidas (podem ir de carona)

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
