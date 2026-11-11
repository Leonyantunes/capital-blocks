# LEIA PRIMEIRO — Transferência da auditoria do Capital Blocks

**Data local:** 2026-11-10 (America/Sao_Paulo)  
**Projeto:** `C:\Users\leony\Documents\Default Project`  
**Auditoria:** `C:\Users\leony\Documents\Default Project\Auditorias\2026-11-10`  
**Código:** package 1.1.0; Git HEAD `b72bd7de184e98514261d19fc6316c0d5392761e`, branch `main`. No início: `main...origin/main [ahead 2]`, árvore limpa; após auditoria, somente `?? Auditorias/` era esperado. Tag local única `v1.0.0`.

## O que é o aplicativo
**Capital Blocks — A anatomia do capitalismo global** é um site educacional trilíngue (PT-BR/EN/ES), integralmente client-side, com dez módulos interativos de economia e geopolítica, mapas 2D/3D, simuladores, pesquisa de fontes e laboratório SQL local DuckDB-Wasm. Não há servidor de aplicação, banco remoto, usuários/roles nem autenticação própria; as integrações BRAPI e Alpha Vantage são **opcionais e dependem de decisão/credencial do usuário**.

**Stack:** React 18, TypeScript, Vite 7, Tailwind 4, Zustand 5 persistido, Framer Motion, d3-geo/TopoJSON SVG, Three.js/WebWorker, Deck.gl, Cytoscape/3d-force-graph, DuckDB-Wasm, Vitest/jsdom. Deploy planejado por GitHub Pages em `.github/workflows/deploy.yml`.

## Mapa de arquivos que efetivamente importam
- `src/main.tsx` e `src/App.tsx`: bootstrap, shell, rotas de abas (via `?t=`) e lazy imports.
- `src/data/modules.ts`: registro canônico das dez abas; `src/components/Navbar.tsx`: navegação desktop/mobile.
- `src/store/useApp.ts`: Zustand, sincronização de `?t=`, `?l=`, `?m=`, estado e preferências persistentes validadas.
- `src/components/MapModule.tsx`, `MapWorld.tsx`, `map/GpuFlowMap.tsx`, `globe3d/GlobeModule.tsx` e `Globe3DCanvas.tsx`: mapas, WebGL, Worker, tours, interação.
- `src/components/{CircuitModule,DebtModule,CompaniesModule,PlatformModule,SettingsModule}.tsx` e `war/`, `wealth/`, `consequences/`, `alternatives/`: módulos didáticos.
- `src/components/sources/{SourcesModule,AnalyticsLab}.tsx`, `src/lib/duckdb/duckdbClient.ts`: fontes e SQL real em navegador.
- `src/lib/marketApi/{sync,brapi,alphavantage}.ts`: sincronização de cotações opcional, token e cache local.
- `src/data/`, sobretudo `sources.ts`, `tours.ts`, `analyticsDatasets.ts`: datasets, proveniência e conteúdo.
- `public/{sw.js,landing.html,manifest.webmanifest,icon.svg}`: offline/PWA e landing.
- `scripts/`, `src/test/`, `vite.config.ts`, `package.json`, `.github/workflows/deploy.yml`: testes, build, orçamento e deploy.

## Estado validado e o que NÃO foi validado
- `npm test`: **131 passed, 1 skipped**, 12 arquivos de testes aprovados. O único skip é a integração BRAPI live, deliberadamente desativada.
- `npm run test:globe`: **448/448**; `test:framing`: **52/52**; `test:tours` e `test:tours:editorial`: **0 erros, 0 avisos**.
- `npm run build`: aprovado na cópia isolada; `npm run test:perf:budget`: aprovado, inicial **110,3 KiB gzip** contra limite **128 KiB**.
- `npm audit --omit=dev`: zero vulnerabilidades reportadas; `npm audit`: **3 altas + 2 moderadas** em dependências de tooling.
- Chrome headless: renderizadas as 12 rotas/visões (dez módulos, globo, configurações), quatro em 375×812, dois cenários de idioma; sem erros JS ou overflow horizontal detectados nessas visitas. Tema escuro → claro funcional. Laboratório DuckDB-Wasm real respondeu `SELECT COUNT(*) AS total FROM comex_fluxos` = **18**.
- **Não foi feita homologação de todas as interações de todos os componentes**, de leitores de tela, de telefones físicos, de serviços externos com token, de produção real nem de carga SQL pesada. Não afirmar aprovação integral desses itens.

## Ordem de leitura e execução
1. `01_RELATORIO_AUDITORIA.md`: diagnóstico, cobertura real e critérios de lançamento.
2. `02_ACHADOS.json`: registro estruturado **AUD-001…AUD-018**, gravidade, evidências e aceitação.
3. `04_TESTES_E_VALIDACOES.md`: baseline, logs e roteiro de regressão.
4. `03_PLANO_DE_EXECUCAO.md`: fases e dependências para a IA implementadora.
5. `05_TAREFAS_HUMANAS.md`: aprovações, dispositivos, credenciais e decisões editoriais.
6. `06_PROMPT_PARA_IA.md`: instrução completa pronta para outra IA executar **as correções**.
7. `PROGRESSO.md`: estado exato e histórico desta auditoria.
8. `evidencias/`: logs, relatórios JSON, smoke de navegador e screenshots.

## Segurança operacional da transferência
**Esta auditoria NÃO implementou correções.** A IA executora deverá primeiro refazer `git status --short --branch`, verificar os achados contra o HEAD corrente, criar estratégia reversível e guardar segredos fora do repositório. Não executar `npm audit fix` automaticamente nem sincronizar APIs reais sem autorização. Só fazer push/tag/deploy mediante aprovação explícita humana. Os arquivos gerados nesta pasta são documentação, não alteração funcional.

## Comandos relevantes
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
**Atenção:** `npm run build` escreve `dist/` e `*.tsbuildinfo`, e testes podem criar caches; nesta auditoria eles rodaram em cópia temporária com `node_modules` em junction. Na futura etapa de implementação esses comandos poderão operar no branch de trabalho autorizado.
