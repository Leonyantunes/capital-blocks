# RELATÓRIO EXECUTIVO E TÉCNICO — Capital Blocks

**Auditoria:** 2026-11-10, Windows, Chrome 157, Node 22.16.0  
**Raiz:** `C:\Users\leony\Documents\Default Project`  
**Revisão base:** `b72bd7de184e98514261d19fc6316c0d5392761e` (`main` +2 de `origin/main`).  
**Escopo:** análise estática, testes automatizados em cópia, smoke de browser/viewport, segurança não invasiva, inventário funcional, transferibilidade; nenhum código de produção alterado.

## 1. Resumo executivo e parecer
O Capital Blocks é um **produto educacional client-side funcional com base técnica acima do mínimo**, divisão por módulos e testes fortes para matemática, tours, dados e chunking. A compilação e os scripts de qualidade foram aprovados. Foram registradas **18 entradas rastreáveis**: **P0 0; P1 2; P2 10; P3 6**. Das entradas, **16 possuem evidência estática ou dinâmica direta**, **1 é provável** e **1 é uma pendência ainda não validada**. A classificação "confirmado" para análise estática **não significa** defeito reproduzido em dispositivo real.

**Parecer de lançamento:** **não homologado para produção definitiva** nesta auditoria. Não há P0 demonstrado, mas antes de uma release pública controlada recomenda-se corrigir AUD-001 (escopo da limpeza de caches), tratar os alertas de tooling AUD-002 conforme exposição real, resolver problemas críticos de acessibilidade/CSV/integrações, criar smoke regressivo e obter aprovação humana do 3D e publicação. A aplicação já consegue carregar e executar funções centrais em navegador de teste; não é correto descrevê-la como "quebrada por completo".

## 2. Pontos fortes observados
- Client-side de implantação simples, sem autenticação ou banco remoto que exijam manutenção operacional.
- Registro centralizado `src/data/modules.ts`; lazy imports dos dez módulos em `src/App.tsx`.
- Preferências por Zustand com sanitização no rehydrate e deep links por URL.
- Fallback SVG para o mapa, globo 3D isolado, bibliotecas pesadas dinamicamente carregadas.
- Quadro de fontes com 54 registros, indicação explícita de estimativa e estado de verificação (20 fontes apenas declaradas **não são** equivalentes a falsas).
- Excelentes verificações estáticas de tours: 56 paradas/448 voos, 52 rotas, 115 estatísticas; testes passaram.
- Orçamento de performance operacional e isolamentos de chunks: 110,3 KiB gzip inicial, teto 128 KiB.
- Laboratório SQL **real** DuckDB-Wasm: consulta de contagem retornou 18 sem fallback simulado.
- Preferências de tema realmente mudaram no navegador; 10 módulos mais 3D/settings carregaram sem exceção detectada no smoke.

## 3. Inventário técnico e fluxo de dados
| Camada | Arquivos principais | Responsabilidade | Observação |
|---|---|---|---|
| Bootstrap / shell | `src/main.tsx`, `src/App.tsx` | Inicialização, layout, boundary, Suspense | 12 visões carregadas |
| Navegação / Estado | `Navbar.tsx`, `src/store/useApp.ts`, `src/data/modules.ts` | 10 abas + 3D + configurações; ?t, ?m, ?l | Tema testado |
| Linguagem / design | `src/i18n.ts`, `src/index.css`, `SettingsModule.tsx` | PT/EN/ES, três níveis, dark/light | EN e ES em smoke |
| Mapa 2D / GPU | `MapModule.tsx`, `MapWorld.tsx`, `map/GpuFlowMap.tsx` | Geo, fluxos, seleção e tours | SVG carregou; GPU não teve interação profunda |
| Globo 3D | `globe3d/{GlobeModule,Globe3DCanvas,landWorker}.ts[x]` | WebGL, câmera e geometria | UI carregou; device real pendente |
| Circuito/dívida | `CircuitModule.tsx`, `DebtModule.tsx`, `debt/*.tsx` | Simuladores teóricos e fiscais | Inputs de dívida sem nome acessível |
| Empresas/redes/APIs | `CompaniesModule.tsx`, `network/CorporateNetworkGraph.tsx`, `lib/marketApi/*` | Raio-X, cache e dados externos opt-in | BRAPI lote 21; token armazenado |
| Plataformas/riqueza | `PlatformModule.tsx`, `wealth/*.tsx` | Simuladores e concentração | Sliders não rotulados |
| Guerra/consequências/alternativas | `war/*.tsx`, `consequences/*.tsx`, `alternatives/*.tsx` | Timeline, impacto e cenários | Visões carregadas; controles não exaustivos |
| Fontes/SQL | `sources/*.tsx`, `duckdbClient.ts`, `analyticsDatasets.ts` | Proveniência, busca e SQL browser | DuckDB real funciona; export/carga exigem correção |
| Dados estáticos | `src/data/*.ts` | Países, fluxos, empresas, tours, fontes | Revisão editorial pontual recomendada |
| PWA / deploy | `public/sw.js`, `.github/workflows/deploy.yml` | Offline e release Pages | Limpeza de cache amplo, sem smoke E2E |
| Testes e gates | `src/test/*.test.ts`, `scripts/*.mjs`, `vite.config.ts` | Regressão, perf e integração conceitual | 131 testes aprovados; browser CI ausente |

### Ausências arquiteturais intencionais
**Não há** backend, banco remoto, controle RBAC, cadastro ou sessão autenticada, migrações de banco e endpoints privados; auditá-los como se existissem seria falso. O único tráfego externo operacional avaliado no código envolve serviços de mercado *opt-in*, links de fontes e capas/vídeos YouTube; chamadas reais das APIs com chave e privacidade no navegador destino **não foram executadas**.

## 4. Matriz de cobertura por área
**Legenda:** `auditada` = código e comportamento pertinente verificados no escopo da checagem; `parcialmente auditada` = componente examinado e tela aberta, mas sem interações/equipamentos completos; `bloqueada` = necessita serviço/aparelho/credencial/decisão; `não aplicável` = camada não existe.

| Área / fluxo | Estado | Evidência / lacuna |
|---|---|---|
| Módulo 01 — mapa SVG, blocos, indicadores | parcialmente auditada | Código e visita browser desktop/mobile; click/drag/zoom/tour completo não percorridos |
| Módulo 01 — modo GPU Deck.gl | parcialmente auditada | Código/configuração inspecionados; picking/performance GPU real não exaustivos |
| Módulo 01 — globo 3D | bloqueada | Render em Chrome headless; performance Android/iOS físico e FPS de campo pendentes (AUD-011) |
| Módulo 02 — Circuito | parcialmente auditada | Visita browser + testes conceituais; simuladores não exaustivos |
| Módulo 03 — Guerra | parcialmente auditada | Visita browser; períodos, mapa/drawer não exaustivos |
| Módulo 04 — Dívida/MMT/Kalecki | parcialmente auditada | Visita browser; sete ranges sem nome acessível; transições de valores não exaustivas |
| Módulo 05 — Empresas/consulta | parcialmente auditada | Visita desktop/mobile, código, integridade; busca e filtros não cobertos E2E |
| Módulo 05 — Teia 2D/3D | parcialmente auditada | Código inspecionado; alternância sustentada e cleanup não profilados |
| Módulo 05 — BRAPI/Alpha Vantage live | bloqueada | Integração depende de token/rede/cota; teste live skip intencional |
| Módulo 06 — Plataformas | parcialmente auditada | Visita, seis ranges sem nome; simulação de todos extremos pendente |
| Módulo 07 — Riqueza | parcialmente auditada | Visita; range não rotulado; gráficos não exercitados completamente |
| Módulo 08 — Consequências | parcialmente auditada | Visita; vídeos e links externos não acionados |
| Módulo 09 — Alternativas | parcialmente auditada | Visita; cada cenário não totalmente exercitado |
| Módulo 10 — Fontes e filtros | parcialmente auditada | 54 registros renderizados; seleção de filtros não exaustiva |
| Módulo 10 — DuckDB-Wasm SQL | parcialmente auditada | **Engine real e SELECT validados**; cancelamento, erros pesados, limites e export não exercitados |
| Configurações, tema, idioma | parcialmente auditada | Tema dark→light provado, EN/ES smoke; todas persistências/contrastes pendentes |
| Navbar / responsividade | parcialmente auditada | Browser desktop e 375×812; sem overflow horizontal observado; menu mobile e foco pendentes |
| Tours e contratos editoriais | auditada | 448 voos, 52 enquadramentos, scripts tours/editorial sem falhas; não implica E2E visual |
| Estado local / sanitização | auditada | Inspeção e testes store; exceções específicas de cache apontadas |
| Fontes e editoria externas | parcialmente auditada | Status contados, sem revalidação em sítios externos |
| PWA, cache e offline | parcialmente auditada | Código revisado; sem teste de instalação ou offline real |
| Build / typecheck / budget | auditada | Exit 0 de build e budget na cópia isolada |
| Dependências e workflow | auditada | npm audit runtime e completo; workflow e configs examinados |
| Testes dinâmicos Safari / Android | bloqueada | Aparelhos reais não disponíveis ao agente |
| Autenticação/RBAC e banco remoto | não aplicável | Não existem nesta arquitetura |

### Limitações de interpretação
As páginas foram acessadas individualmente via `Page.navigate` (CDP), com checagem de título, heading, exceções, overflow e screenshots; isso **não equivale** a testes E2E de todos os cliques e transições. Os prints foram examinados para mobile Home/Empresas/Fontes e Settings desktop. O benchmark de FPS físico e auditoria WCAG AA integral ficaram de fora. Datasets extensos foram inspecionados por estrutura e contratos, não validados registro a registro contra fontes externas.

## 5. Achados e severidade
| ID | P | Componente | Síntese | Estado |
|---|---|---|---|---|
| AUD-001 | P1 | Service worker | Cache cleanup afeta nomes de outras aplicações na mesma origem | confirmado |
| AUD-002 | P1 | Build/dev toolchain | 5 alertas npm audit (3 high, 2 moderate) | confirmado |
| AUD-003 | P2 | BRAPI | Primeiro lote com token pode chegar a 21 símbolos sob teto 20 | confirmado (estático) |
| AUD-004 | P2 | Formulários | 14 sliders e buscas sem rótulo acessível na amostra | confirmado (browser) |
| AUD-005 | P2 | SQL/CSV | Exportação ignora aspas/quebra/fórmula | confirmado (estático) |
| AUD-006 | P2 | SQL | Resultado sem limite de linhas/tempo | confirmado (estático) |
| AUD-007 | P2 | SQL init | Promise rejeitada não reinicializável | confirmado (estático) |
| AUD-008 | P2 | Cache de cotações | Validação de schema insuficiente | confirmado (estático) |
| AUD-009 | P2 | Chaves API | Token mantido em localStorage após desativação | confirmado (intencional, risco) |
| AUD-010 | P2 | CI | Sem browser E2E/axe gate | confirmado |
| AUD-011 | P2 | Globo 3D | Homologação em aparelhos físicos ausente | não validado |
| AUD-012 | P3 | Grafo 3D | Cleanup com API privada | provável |
| AUD-013 | P3 | Globo 3D | setItem sem proteção contra erro de storage | confirmado |
| AUD-014 | P3 | README | Versão 1.0.0 diverge do package 1.1.0 | confirmado |
| AUD-015 | P3 | Dados/SQL | Parquet externo planejado, não obrigatório | confirmado (opcional) |
| AUD-016 | P3 | Fontes | 20 registros apenas declarados; revisão editorial opcional | confirmado (opcional) |
| AUD-017 | P2 | Release | Git ahead 2, falta tag/deploy homologado | confirmado |
| AUD-018 | P3 | Tooling | Lint ausente/algumas exceções de TypeScript/hooks | confirmado |

### Contagem por grupo funcional
| Grupo | Itens (IDs) | Quantidade |
|---|---|---:|
| Segurança/privacidade/cadeia de suprimentos | 001, 002, 005, 009 | 4 |
| Funcionalidade, persistência e robustez | 003, 007, 008, 013 | 4 |
| Interface, acessibilidade e compatibilidade | 004, 011 | 2 |
| Performance e escala | 006, 012 | 2 |
| Testes, CI, documentação e release | 010, 014, 017, 018 | 4 |
| Dados/editoria e produto opcional | 015, 016 | 2 |
| **Total** | | **18** |

Os campos completos, incluindo evidência, solução, status e critério de aceite estão em `02_ACHADOS.json`; o resumo acima não substitui o registro.

## 6. Segurança
Não foram identificadas vulnerabilidades de autorização/SQL-injection em backend porque não há backend. Os pontos de exposição são: tokens *do próprio usuário* em localStorage (AUD-009), APIs opt-in; CSV potencialmente aberto em planilhas (AUD-005); execução de SQL no browser sem limite (AUD-006, disponibilidade local); cache origin-wide (AUD-001); dependências de build/test (AUD-002). A API BRAPI é chamada com token na querystring do provedor, comportamento do adaptador já presente; nunca publicar tokens em logs. Nenhuma credencial foi solicitada ou revelada. `npm audit --omit=dev` relatou **0** e `npm audit` relatou **5** no estado do lockfile — não confundir com pentest.

## 7. Interface, responsividade e acessibilidade
O app renderizou layouts desktop e mobile 375×812 nas rotas de amostragem; não foi detectado overflow horizontal de documento, nem erro JavaScript no console coletado. Screenshot de Home mobile mostrou mapa e botões, e Fontes e Empresas apresentaram conteúdo legível na parte visível. Isso **não certifica** contraste WCAG, navegação integral por teclado ou screen reader. AUD-004 é defeito inequívoco: sete ranges sem nome no Módulo 04, seis no 06, um no 07 e campos de busca sem label associado em Empresas e Fontes. Os `select` dos filtros analisados possuem aria-label; evitar relatórios falsamente generalistas de "todos sem label".

## 8. Desempenho e arquitetura
Orçamento estático do pacote compilado aprovado: **110,3 KiB gzip** inicial, `vendor-graph` **354,6 KiB gzip**, `vendor-deck` **254,3 KiB gzip**, `vendor-three` **139,6 KiB gzip**. O build mantém laziness no orçamento especificado. O motor DuckDB-Wasm carrega bundles significativos sob demanda; o custo já é reconhecido em `PERFORMANCE-GATE.md`. Não foram repetidos perfis CPU/energia reais nem medições detalhadas com DevTools Performance nesta sessão. Por isso AUD-006 é risco de consulta sem limite, não benchmark medido; AUD-011 continua bloqueado.

## 9. Testes, build e entrega
| Verificação | Resultado | Evidência |
|---|---|---|
| Vitest | **131 passaram; 1 skip intencional** | `evidencias/TEST_test.log` |
| Voo do globo | **448/448** | `TEST_test_globe.log` |
| Enquadramento | **52/52** | `TEST_test_framing.log` |
| Tours | **0 erro / 0 aviso** | `TEST_test_tours.log` |
| Editorial de tours | **0 erro / 0 aviso** | `TEST_test_tours_editorial.log` |
| Build TypeScript + Vite | **exit 0** | `TEST_build.log` |
| Budget pós-build | **exit 0; 110,3 / 128 KiB** | `TEST_perf_budget.log` |
| Audit runtime | **0 advisory** | `dependency_audit_raw.json` |
| Audit completo | **5 advisories** | `dependency_audit_all_raw.json` |
| Browser, 18 cenários | Rotas carregaram, sem exception/overflow detectados | `browser_scenarios.json`, `UI_*.png` |
| Interações | Tema alternou, DuckDB retornou **18**, campos sem nomes detectados | `browser_interactions.json` |
| BRAPI live, dispositivos reais | **Não executados** | Teste pulado / demanda de token, redes e hardware |

## 10. Pendências de produto versus defeitos
**Obrigatório para estabilidade e qualidade de release:** escopo SW, hardening de tooling, acessibilidade, integridade de CSV/cache, testes práticos/CI, governança de chave e homologação mínima. **Opcional / condicionado ao produto:** expansão Parquet (AUD-015), enriquecimento editorial das 20 fontes declaradas (AUD-016), maior tipagem/lint (AUD-018), refinamento do grafo (AUD-012) se profiling justificar.

## 11. Gate para produção — parecer fundamentado
1. Corrigir/mitigar AUD-001 e AUD-002 sem regressão; revisar itens P2 funcionais, dados, privacidade e a11y.
2. Rodar suíte inteira, build, orçamento, audit novamente após alterações, incluindo testes novos dos problemas de origem.
3. Executar smoke visual/teclado/SQL, inclusive erros, mobile, troca mapa 2D/3D e fluxo de retorno.
4. Homologar 3D em Android/iOS físicos, ou **manter explicitamente BETA com fallback** e deixar pendência documentada se for lançada apenas a versão experimental.
5. Revalidar textos/datasets mais sensíveis editorialmente; não prometer que "fonte-declarada" = link exato conferido.
6. Humano aprovar push, tag 1.1.0, Pages e rollback; conferir URL pública após deployment.
7. Não declarar aprovação plena enquanto áreas bloqueadas permanecerem, mesmo com todos testes estáticos verdes.

**Conclusão:** base boa e testável, mas há riscos reais de código, lacunas de acessibilidade e gates de homologação/publicação. Esta auditoria **não implementou** correções.


## 12. Verificações dinâmicas adicionais de profundidade (mesma sessão)
Após a primeira rodada, foram executados testes de interação direcionados, registrados em `evidencias/browser_extended_checks.json` e `evidencias/browser_search_validations.json`:
- **Busca Fontes:** digitar `World Economic Outlook` alterou resultado de **54/54 para 1/54** registro.
- **Busca Empresas:** digitar `Microsoft` filtrou a tabela de **40 linhas visíveis para uma linha**, sem exceção detectada.
- **Menu mobile:** em 375×812, abrir `☰`, selecionar **Dívida** e confirmar heading `Morte e Ressurreição do Capital` funcionou.
- **GPU Deck.gl:** o botão do Home alternou para mapa com canvas WebGL2 renderizado, sem ErrorBoundary nem erro capturado no Chrome da auditoria. Não é benchmark FPS em aparelho.
- **SQL:** `SELECT FROM` gerou erro real (0 linhas); a consulta válida subsequente `SELECT COUNT(*) AS total FROM comex_fluxos` recuperou **18** sem reload.
- **Tour do mapa:** um localizador textual da automação não encontrou botão com texto `Tour` no layout desktop naquele estado; **fluxo visual de tour não foi exercitado por esse script**. Não registrar como bug sem inspecionar o controle correto.

Uma tentativa preliminar de automatizar buscas usou um seletor HTML que exigia atributo `type=text`, mas os inputs não declaram esse atributo (embora a propriedade JS `type` seja `text`). Foi **falha do seletor de teste**, não do aplicativo; a tentativa foi repetida com `Input.insertText` e as duas buscas passaram. A cobertura continua parcial, sem afirmar validação de cada botão.
