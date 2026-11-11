# TESTES, DIAGNÓSTICOS E GATES DE VALIDAÇÃO

**Ambiente:** Windows Desktop Commander, Node 22.16.0, Chrome 157.0.8103.39 (headless), projeto Capital Blocks 1.1.0.  
**Preservação:** todos os testes/build executados em cópia `%TEMP%\capital-blocks-audit-20261110` com `src/`, `scripts/`, `public/`, configs e `package*.json` copiados; `node_modules` por junction de leitura/execução. `dist` e `tsbuildinfo` novos criados apenas na cópia. Não foi executado `npm install`, `npm audit fix`, push, deploy, mutação de dados ou integração live com chave.

## 1. Comandos executados e resultados observados
| Comando / ação | Resultado observado | Evidência |
|---|---|---|
| `npm run test` | Exit 0; **131 passed, 1 skipped**; 12 suites aprovadas, 1 pulada | `evidencias/TEST_test.log` |
| `npm run test:globe` | Exit 0; **448 voos/448**, 56 paradas | `evidencias/TEST_test_globe.log` |
| `npm run test:framing` | Exit 0; **52/52** caminhos e enquadramentos | `evidencias/TEST_test_framing.log` |
| `npm run test:tours` | Exit 0; **0 erros, 0 avisos**, 115 estatísticas | `evidencias/TEST_test_tours.log` |
| `npm run test:tours:editorial` | Exit 0; **0 erros, 0 avisos** | `evidencias/TEST_test_tours_editorial.log` |
| `npm run build` | Exit 0, TS e Vite concluídos, ~39,61s | `evidencias/TEST_build.log` |
| `npm run test:perf:budget` | Exit 0; inicial **110,3/128,0 KiB gzip**, vendor-graph **354,6 KiB gzip** | `evidencias/TEST_perf_budget.log` |
| `npm audit --omit=dev --json` | Exit 0; **0 vulnerabilidades** no conjunto de produção | `evidencias/dependency_audit_raw.json` |
| `npm audit --json` | Exit 1; **3 high + 2 moderate**, total 5 | `evidencias/dependency_audit_all_raw.json` |
| Git `status` e `tag --list` | Antes: main ahead 2, HEAD b72bd7d; depois só `?? Auditorias/`; tag `v1.0.0` | `PROGRESSO.md` / inspeção remota |
| Chrome headless CDP `Page.navigate` | 12 visões/rotas + 4 mobiles + 2 variantes de idioma = **18 cenários**; sem exceções HTTP>=400/JS capturadas | `evidencias/browser_scenarios.json`, PNGs |
| UI tema | Settings: clique em Claro mudou `data-theme` dark→light | `evidencias/browser_interactions.json` |
| UI SQL real | DuckDB-Wasm iniciou; `SELECT COUNT(*) AS total FROM comex_fluxos` → **18**, 1 linha | `evidencias/browser_interactions.json` |
| Check de rótulos DOM | Dívida 7 ranges, Plataforma 6, Riqueza 1 e buscas Empresas/Fontes sem associação programática | `evidencias/browser_interactions.json` |

### Ações que NÃO foram realizadas
- **BRAPI real/Alpha Vantage real:** `src/test/brapiLive.test.ts` é opt-in `BRAPI_LIVE=1`; não ativamos para não usar cota/credencial de terceiro. Testes de adapter mockado existentes passaram.
- **iPhone/Safari, Android intermediário, leitores de tela físicos:** sem acesso autorizado a hardware; métricas de FPS/temperatura e WCAG AA **não validadas**.
- **Off-line/install PWA/atualização SW em origem compartilhada:** potencialmente afeta caches; apenas análise estática, nenhuma cache de produção foi tocada.
- **Pen-test, scanner de endpoints privados e tráfego externo:** sem escopo/infrastrutura autorizada; app não possui backend próprio.
- **Benchmarks adversariais de SQL, OOM ou long queries:** não realizados por segurança do ambiente; análise estática recomenda limites (AUD-006).
- **Auditoria individual de cada link/fonte externa e cada linha de dataset:** conteúdo grande, sem abertura externa; estados de fonte são os definidos pelo projeto, não certificado independente de veracidade.
- **Todos os cliques de todas as telas, tour visual ponta a ponta e fluxo com teclado completo:** scripts atuais provaram *render inicial* e interações pontuais, não E2E de cada componente.

## 2. Roteiro de reprodução seguro dos achados relevantes
**AUD-001 — cache origin-wide (sem provocar perda de dados):**
1. Ler `public/sw.js` linhas de evento `activate`.
2. Identificar `filter(k => k !== CACHE)`; basta análise para demonstrar o alcance.
3. **Na correção**, usar origem de teste descartável com caches `cb-v2`, `cb-v3` e `app-externo-v1`, sem executar na origem de usuário; comprovar a preservação de terceiros.

**AUD-002 — advisories tooling:**
1. Executar `npm audit --json` em branch/cópia e comparar `dependency_audit_all_raw.json`.
2. Conferir os módulos e as ranges afetadas `vite`, `undici`, `source-map-js`, `vitest`, `@vitest/mocker`.
3. Comparar com `npm audit --omit=dev`; não deduzir exposição em runtime sem análise de deploy.

**AUD-003 — BRAPI 21 símbolos:**
1. Inspecionar `LOTE_COM_TOKEN = 20` e adição `USD-BRL` ao primeiro grupo em `brapi.ts`.
2. Criar em branch teste de `fetch` mock que registra parâmetros da URL.
3. Verificar comprimento de cada lote **incluindo câmbio**, sem fazer requisição real.

**AUD-004 — nomes dos inputs:**
1. Em Chrome com build, abrir `?t=debt` e `?t=platform`; inspecionar `input[type=range]` e computed accessibility names.
2. Repetir em `?t=wealth`, inputs busca de `?t=companies` e `?t=sources`.
3. Depois da correção, TAB até cada controle e conferir anúncio por NVDA/VoiceOver quando disponível, nos três idiomas.

**AUD-005 — CSV:**
1. Ler `handleExportCsv` no `AnalyticsLab.tsx`: só aspas se string contém vírgula.
2. Gerar com teste unitário valores: `A "quoted"`, `a,b`, `x\nz`, `=1+1`, `+CMD`, nulos e Unicode. Não abrir CSV malicioso em planilha real.
3. Após correção, importar usando parser confiável e comparar valores exatos; formula prefix tratado por política clara.

**AUD-006/007 — SQL:**
1. Testar contrato de limitação e retry com mocks e bases pequenas; evitar gerar bilhões de linhas.
2. Em browser, selecionar aba SQL e rodar `SELECT COUNT(*) AS total FROM comex_fluxos`; base de regressão observada: 18. Testar query inválida e consulta válida posterior.
3. Testar Worker indisponível injetado e recuperação após tentativa seguinte sem reload, sem simular SQL.

**AUD-008/009 — cache/segredos:**
1. Testar payloads de cache inválidos em localStorage dentro de browser de perfil de teste, sem ler os tokens pessoais do usuário.
2. Validar fallback à base estática e botão de remoção explícita da chave.

## 3. Cenários de regressão UI prioritários
- **Navegação:** abrir home, circuit, war, debt, companies, platform, wealth, consequences, alternatives, sources, settings e globe3d via botão e deep link; conferir títulos, sem tela branca e sem exceções.
- **Responsividade:** 1440×1000 e 375×812, menu mobile, bottom bar do mapa, cards, grids, fontes e tabelas sem overflow *de documento*; tabelas com scroll interno são aceitáveis.
- **Dados/estado:** trocar tema, nível Simples/Didático/Avançado, EN/ES/PT, lente geografia/história/economia, nominal/PPP e reload; conferir persistência e preferência da URL.
- **Mapa 2D:** clique em EUA, Brasil e China abre drawer; zoom, pan, touch/pinch; SVG mantém fallback quando GPU indisponível.
- **Globo:** órbita, zoom, retorno 3D→2D com centro e escala, spotlight/tours e ausência de vazamento de workers/contexts. Validar hardware real.
- **Empresas:** Brasil/Mundo, busca, paginação, teia 2D↔3D, dados estáticos, token ausente e rate limit via mock, sincronização opt-in.
- **SQL:** presets 4, query válida, inválida e recuperação, export CSV com teste de conteúdo e possível engine indisponível; cancelar consultas longas.
- **Acessibilidade:** nome/label e value dos 14 sliders medidos, busca, focus visible, skip link, ESC/drawers, SR, reduzido movimento, contraste.
- **PWA/offline:** navegação HTML network-first, hash assets cache-first, subpath `/capital-blocks/`, preservação de caches alheios em simulação controlada.
- **UI negativa:** erro de rede, JSON local corrompido, WebGL indisponível, Worker indisponível e storage bloqueado (em mocks).

## 4. Critérios mínimos para release
- [ ] P1 mitigados, P2 obrigatórios com aceite e justificativas explícitas de riscos residuais.
- [ ] Pelo menos baseline 131 testes, voos, tours, framing, build, budget e audit aprovados após correções.
- [ ] Browser E2E real e manual dos fluxos de maior risco, sem uncaught/overflows indevidos.
- [ ] WCAG AA em rótulos e teclado críticos; teste assistivo humano se comprometido no escopo.
- [ ] Token privado protegido por controles de ciclo de vida; sem segredo em git/log.
- [ ] DuckDB responde 18 no dataset de origem **até que o dataset seja conscientemente versionado**; export e erro controlados.
- [ ] FPS mobile real documentado ou globo explicitamente BETA e seu risco aceito.
- [ ] Versionamento, tag, GitHub Pages e smoke pós-deploy aprovados pelo responsável; rollback preparado.
- [ ] Histórico do Git e dados preservados; documentação de achados atualizada sem declarações falsas.

## 5. Artefatos de evidência
Os arquivos `evidencias/TEST_*.log`, `dependency_audit*.json`, `browser_scenarios.json`, `browser_interactions.json`, `browser_audit.mjs`, `browser_interactions.mjs` e capturas `UI_*.png` constituem evidência local reexecutável. Os scripts de browser se conectam à porta local 9227 e preview 5179; **não** executar sem iniciar ambiente isolado de teste, pois não controlam o navegador normal do usuário. Não compartilhar URLs/tokens caso futuramente sejam adicionados às evidências.


## 6. Rodada complementar de interações — resultados e limites
| Ação | Resultado | Evidência |
|---|---|---|
| Fontes: inserir `World Economic Outlook` | **Aprovado:** 54 de 54 → **1 de 54** | `evidencias/browser_search_validations.json` |
| Empresas: inserir `Microsoft` | **Aprovado:** 40 linhas iniciais visíveis → **1 linha filtrada** | `evidencias/browser_search_validations.json` |
| Mobile: menu `☰` → Dívida | **Aprovado:** navegação para `Morte e Ressurreição do Capital` | `evidencias/browser_extended_checks.json` |
| Home: SVG → GPU Deck.gl | **Aprovado no Chrome de teste:** canvas criado, sem boundary/exception | `evidencias/browser_extended_checks.json` |
| SQL inválido → válido | **Aprovado:** `SELECT FROM` sinalizou falha; SELECT COUNT voltou a **18** | `evidencias/browser_extended_checks.json` |
| Tour: clique por seletor textual | **Não validado:** seletor da automação não localizou o controle na variação desktop | `evidencias/browser_extended_checks.json` |

**Nota de precisão:** primeira tentativa de automação de pesquisa usou seletor `input[type=text]` incompatível com inputs sem atributo `type`; não houve falha funcional do app confirmada por isso. A rodada com foco de campo e `Input.insertText` substituiu esse teste e comprovou as buscas. O resultado **não** deve ser confundido com validação completa de filtros, paginação, tours, navegadores alternativos ou desempenho GPU real.
