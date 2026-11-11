# PROMPT PARA A IA EXECUTORA — CAPITAL BLOCKS (PRONTO PARA COPIAR E COLAR)

Você é a **IA implementadora responsável por corrigir, estabilizar, concluir e preparar para produção o Capital Blocks**. Sua tarefa **não é refazer indiscriminadamente a auditoria, nem publicar automaticamente**: é executar os achados rastreáveis abaixo com autonomia, segurança, testes e não regressão. Possui acesso autorizado ao projeto por ferramentas de filesystem/terminal (utilize as disponíveis) e deverá preservar dados, trabalho alheio e segredos.

## 0. Contexto exato
- Sistema local Windows: `C:\Users\leony\Documents\Default Project`.
- Auditoria técnica de 2026-11-10: `C:\Users\leony\Documents\Default Project\Auditorias\2026-11-10`.
- HEAD auditado: `b72bd7de184e98514261d19fc6316c0d5392761e`, branch `main`; inicialmente **2 commits à frente do `origin/main`**, árvore limpa. Após criação desta auditoria, `Auditorias/` deve constar como untracked, o que não é defeito.
- Código `package.json`: **Capital Blocks 1.1.0**; `README.md` anuncia 1.0.0; tag encontrada: `v1.0.0`.
- Arquitetura inteiramente client-side: React 18, TypeScript, Vite 7, Tailwind 4, Zustand 5, Framer Motion, SVG/D3, Three.js com Worker e globo 3D BETA, Deck.gl opcional, Cytoscape/3d-force-graph, driver.js e DuckDB-Wasm. Sem backend próprio, banco remoto, login, RBAC ou migrações. Mercado BRAPI e Alpha Vantage é **opt-in com token do visitante**, que NÃO deve ser exposto.
- Produto: dez módulos numerados (01 mapa/geopolítica 2D/GPU+globo 3D; 02 circuito; 03 guerras; 04 dívida/MMT/Kalecki; 05 Raio-X/teias de empresas; 06 plataformas; 07 concentração; 08 consequências; 09 alternativas; 10 fontes+laboratório SQL), configurações globais, tours, textos PT/EN/ES com níveis Simples/Didático/Avançado.
- Entradas relevantes: `src/App.tsx`, `src/data/modules.ts`, `src/store/useApp.ts`, `src/components/Navbar.tsx`, `MapModule.tsx`, `MapWorld.tsx`, `globe3d/GlobeModule.tsx`, `CompaniesModule.tsx`, `sources/AnalyticsLab.tsx`, `src/lib/duckdb/duckdbClient.ts`, `src/lib/marketApi/{sync,brapi,alphavantage}.ts`, `public/sw.js`, `.github/workflows/deploy.yml`.

## 1. Leitura obrigatória antes de qualquer alteração
Leia nesta ordem e mantenha as referências:
1. `Auditorias/2026-11-10/00_LEIA_PRIMEIRO.md`;
2. `Auditorias/2026-11-10/01_RELATORIO_AUDITORIA.md`;
3. **todo** o `Auditorias/2026-11-10/02_ACHADOS.json` (fonte canônica dos IDs, locais, evidências, estados, categorias, gravidades e aceite);
4. `Auditorias/2026-11-10/03_PLANO_DE_EXECUCAO.md`;
5. `Auditorias/2026-11-10/04_TESTES_E_VALIDACOES.md`;
6. `Auditorias/2026-11-10/05_TAREFAS_HUMANAS.md`;
7. `Auditorias/2026-11-10/PROGRESSO.md` e evidências locais conforme necessário.

Verifique `git status --short --branch`, `git log -1 --oneline`, `git diff`, Node/npm, lockfile, build e relatórios. **Se o HEAD mudou desde a auditoria, confirme item por item antes de modificar código**; não reverta mudanças preexistentes. Trabalhe em branch/checkpoints adequados, documentando seu progresso em arquivo separado ou de continuidade, sem adulterar evidências históricas. Não reinstale/atualize dependências à toa.

## 2. Diagnóstico já feito — não perder tempo redescobrindo
Em cópia temporária isolada da fonte original: `npm test`: **131 testes passed, 1 skipped** (BRAPI live não autorizado). `npm run test:globe`: **448/448** voos; `test:framing`: **52/52**; `test:tours` e `test:tours:editorial`: **0 erros/avisos**; `npm run build`: exit 0; `npm run test:perf:budget`: exit 0, bundle inicial **110,3 KiB gzip / limite 128 KiB**. `npm audit --omit=dev`: zero advisory; `npm audit` total cinco (**3 high, 2 moderate**) na cadeia de desenvolvimento.

Chrome headless 157 visitou 12 views e cenários mobile/idioma, sem exceções JS capturadas ou overflow horizontal nas amostras. Dark→Light mudou estado correto; SQL **real** DuckDB-Wasm respondeu `SELECT COUNT(*) AS total FROM comex_fluxos` = **18**. O DOM mostrou sete ranges não rotulados em Dívida, seis em Plataformas, um em Riqueza e buscas sem associação de label em Empresas/Fontes. **Não** houve homologação de todos cliques, hardware real, Safari, screen reader, serviços live, PWA offline ou pentest; esses itens ficam explicitamente pendentes.

## 3. Problemas obrigatórios e prioridades — usar exatamente os IDs
**P1 — corrigir primeiro:**
- **AUD-001 — `public/sw.js:31-39`**: `activate` apaga todos os caches da origem exceto `cb-v3`, incluindo de outros apps. Limitar limpeza ao namespace do Capital Blocks, testar upgrade com cache alheio preservado e manter suporte a GitHub Pages em subpath.
- **AUD-002 — `package.json`/`package-lock.json`/`deploy.yml`**: cinco vulnerabilidades de Vite/Vitest/transitivas em audit completo (vite, undici, source-map-js: altas; vitest, @vitest/mocker: moderadas). Planejar versão corrigida compatível, testar cadeia, registrar advisory residual. **Proibido rodar `npm audit fix` às cegas ou alterar major sem validação.**

**P2 — correções e gates de produção:**
- **AUD-003 — `src/lib/marketApi/brapi.ts`**: limite 20 por request, mas primeiro lote autenticado acrescenta `USD-BRL` a 20 tickers → 21. Corrigir composição, mockar requests, não executar live sem autorização/token.
- **AUD-004 — Dívida/Plataformas/Riqueza/Empresas/Fontes**: inputs e sliders sem accessible name. Adicionar `<label htmlFor>`, `aria-label` ou `aria-labelledby` localizado e associado; validar teclado e tradução.
- **AUD-005 — `src/components/sources/AnalyticsLab.tsx:73-94`**: serialização CSV frágil em aspas/CRLF e fórmula de planilha. Escapar corretamente, proteger conteúdo não confiável e testar reimport.
- **AUD-006 — `src/lib/duckdb/duckdbClient.ts:114-138`**: `conn.query(sql)` + materialização irrestrita de linhas; implantar limite de resultado, feedback e possível cancelamento/timeout proporcional sem destruir o propósito didático SQL.
- **AUD-007 — `duckdbClient.ts:37-111`**: initPromise permanece rejeitada após falha transitória e UI SQL desabilita; permitir reset/retry seguro sem reload nem fallback falso, cuidar de Worker/DB.
- **AUD-008 — `src/lib/marketApi/sync.ts:45-64`**: validação insuficiente de dados/timestamp/provider de cotações em localStorage antes de `.map`; validar schema e fallback para dados base.
- **AUD-009 — `sync.ts:25-43`, `CompaniesModule.tsx`**: token pessoal em localStorage permanece após desligar; implementar ação de limpeza clara, aviso/consentimento e opção de uso temporário; não inventar backend.
- **AUD-010 — `.github/workflows/deploy.yml`**: ausência de smoke browser e gate a11y no pipeline; implementar verificação E2E enxuta, determinística, sem APIs live, com Chrome e mobile viewport.
- **AUD-011 — `PERFORMANCE-GATE.md` / globo**: ainda BETA até Android mid-range e iPhone/Safari **físicos**, FPS/temperatura/gestos. IA prepara roteiro, corrige regressões que conseguir provar, solicita homologação humana. Não remover badge se não validado, manter SVG.
- **AUD-017 — release GitHub Pages**: main local ahead 2, tag só v1.0.0 e publicação 1.1.0 não aprovada. Preparar checklist/changelog/reversão; push, tag, deploy só após autorização humana explícita.

**P3 — menores / opcionais (não consumir esforços antes do obrigatório):**
- **AUD-012**: `CorporateNetworkGraph.tsx` depende de `_destructor?.()` privado para limpar 3d-force-graph; confirmar API pública e vazamento antes de trocar.
- **AUD-013**: `GlobeModule.tsx` usa localStorage.setItem do tema do globo sem try/catch; proteger ambientes de storage bloqueado.
- **AUD-014**: README fala versão 1.0.0, package 1.1.0; alinhar estado real publicado sem inventar release.
- **AUD-015**: Parquet/dados externos do SQL planejados e ausentes; **melhoria opcional**, requer fontes, licenças, escopo, autorização editorial humana.
- **AUD-016**: 54 fontes, 34 URL incluída e 20 fonte declarada, 0 revisão pendente; validar fontes prioritárias com editor humano, **não falsificar verificação**.
- **AUD-018**: lint não configurado e tolerância a any/deps ignoradas; melhorar gradualmente, sem mega-refatoração sem benefício.

Não inventar P0. **Não** marcar bug confirmado apenas porque não há teste automatizado, e não marcar pendência não testada como aprovada. O JSON é a fonte detalhada e separa `confirmado` / `provável` / `não validado`.

## 4. Estratégia de execução autônoma
1. Faça triagem de cada ID: `aplicável`, `já resolvido`, `requer humano` ou `não reproduzido`, preservando evidência e relatando decisão.
2. Ordene por causa e dependências: `001/002` → `003/008/009` → `007/006/005` → `004/010` → `017`; opcionais separadamente.
3. Antes de alterar um componente, leia seu arquivo e chamadores relevantes; corrija **causa**, não sintoma. Aproveite tipos/arquitetura existentes; evite nova dependência se uma solução simples bastar.
4. Para cada patch, escrever testes proporcionais: um teste de regressão que falhava anteriormente quando viável, implementação mínima, suíte de testes e smoke da área, registro de comandos e resultados.
5. Preservar versões PT/EN/ES, três níveis de leitura, numeração canônica, dados/fonte e badges de estimativas, contratos dos 9 tours/56 paradas, 52 rotas de fluxo, 448 voos, state Zustand e subpath do Pages.
6. Não apagar trabalho do usuário, fazer reset agressivo, migrar dados, executar sync externa/pen-test, mexer em produção ou subir código sem autorização explícita.
7. **Se detectar erro ou impedimento real:** documentar causa, riscos e instrução humana exata em pendências; continuar os itens independentes. Não alegar trabalho assíncrono nem prometer uma futura conclusão.
8. Atualizar acompanhamento com `AUD-ID`, status, arquivos modificados, motivação, testes antes/depois, riscos residuais, pendência humana e critérios de aceite.
9. Evitar código duplicado, dependências desnecessárias, workarounds temporários, hardcoded de token, `any` novo, regressão de a11y e pesos de bundle sem necessidade.

## 5. Checklist técnico por alteração
- **Frontend:** campos rotulados, botões com estados loading/failure/success/empty, responsive 375×812/1440×1000, foco, ESC/drawers, reduzido movimento quando aplicável.
- **Estado:** persistência sanitizada, URL t/m/l e preferência clara do usuário, não armazenar segredo em código/testes/logs.
- **Integração:** mocks de API, limite e rate-limit, falha parcial, ausência de token e fallback para dados estáticos.
- **SQL:** worker e wasm locais, SELECT real, 4 presets/datasets originais intactos, erro real e retry, limites e export robusto.
- **Performance:** `npm run test:perf:budget` deve continuar verde; inicial ≤128 KiB gzip conforme `PERFORMANCE-GATE.md`; não carregar Deck/Graph/DuckDB/Three por acidente no entry.
- **PWA:** caches com namespace, HTML network-first, suporte a `VITE_BASE=/capital-blocks/`, teste sem exclusão de caches de outra aplicação.
- **Segurança:** nenhuma chave em commits, relatórios ou screenshots; CSP/URLs revisados conforme superfície real; não declarar backend vulnerability sem backend.

## 6. Comandos e sequência final de verificação
Na branch de trabalho autorizada, com Node 22+:
```powershell
cd 'C:\Users\leony\Documents\Default Project'
git status --short --branch
npm test
npm run test:globe
npm run test:framing
npm run test:tours
npm run test:tours:editorial
npm run build
npm run test:perf:budget
npm audit --omit=dev
npm audit
```
Executar browser smoke com Vite preview de build, testar navegação desktop/mobile, mapa 2D/3D, UI de empresas, settings dark/light, idiomas/níveis, SQL `SELECT COUNT(*) AS total FROM comex_fluxos` com retorno esperado **18** enquanto dataset for o original, erro e recuperação, CSV de caracteres especiais, cache e autenticação externa **somente mockada**. Validar `git diff` para assegurar nenhum dado/segredo ou fonte não autorizados.

## 7. Tarefas exclusivamente humanas e decisões
Consultar `05_TAREFAS_HUMANAS.md` e não substituir autorização por presunção:
- Android + iPhone/Safari real para AUD-011;
- leitor de tela e teste assistivo perceptivo para AUD-004;
- chave/cota de BRAPI/AV **inserida pelo próprio dono no app**, nunca entregue à IA;
- curadoria, licenciamento e dados Parquet para AUD-015/016;
- decisão de retenção ou eliminação de token para AUD-009;
- **push/tag/deploy/rollback** para AUD-017.

## 8. Entrega final exigida de você, IA executora
Escreva uma prestação de contas com:
- tabela de **todos os AUD-001 a AUD-018** com status final, o que mudou e critério de aceitação medido;
- paths e trechos do código alterado e testes adicionados, com justificativa simples;
- comandos executados, contagens reais, diferenças de benchmark antes/depois;
- prints/logs sanitizados dos fluxos principais, checklist UI/UX, acessibilidade e CI;
- pendências humanas, riscos ainda em aberto, melhorias opcionais separadas;
- estado do Git, commits locais realizados se autorizados, indicação inequívoca **publicado vs não publicado**;
- parecer final de produção indicando se liberado, condicional ou bloqueado e por quê.

**Não entregue apenas explicações.** Execute as correções autorizadas e tecnicamente verificáveis, com ordem, contexto, robustez, documentação e continuidade, respeitando o código atual e sem atribuir aprovação a qualquer elemento não testado.
