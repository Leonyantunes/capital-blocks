# PLANO DE EXECUÇÃO PARA A IA IMPLEMENTADORA

**Escopo obrigatório:** corrigir falhas reais e riscos de produção. **Escopo opcional:** evolução editorial e funcional aprovada separadamente. As prioridades foram definidas em `02_ACHADOS.json`. Este documento não autoriza mudanças na fase de auditoria concluída.

## Pré-flight (antes da fase 1)
1. Ler `00_LEIA_PRIMEIRO.md`, `01_RELATORIO_AUDITORIA.md`, `02_ACHADOS.json`, `04_TESTES_E_VALIDACOES.md` e `PROGRESSO.md`.
2. Entrar na raiz e executar `git status --short --branch`, `git log -1 --oneline`, `node --version`; distinguir auditoria `Auditorias/` de mudanças de terceiros.
3. Confirmar que cada achado ainda se reproduz; se já corrigido, marcar resolvido com evidência e **não** reimplementar.
4. Criar branch/backup seguro e checkpoints; evitar modificar artefatos históricos de auditoria. Atualizar progresso em arquivo apropriado a cada fase, sem sobrescrever esta auditoria como se fosse um patch.
5. Capturar baseline `npm test`, scripts específicos, build e budget (idealmente em cópia ou worktree limpo) e comparar à seção de testes. Evitar instalar versões incompatíveis sem necessidade.

## Fase 1 — Problemas de alta prioridade / proteção do lançamento
**AUD-001 — P1: service worker.**
- Alterar a rotina de `activate` para remover somente caches com namespace exclusivo Capital Blocks e versão antiga. Não apagar caches alheios.
- Escrever teste isolado de upgrade: criar `cb-v2`, `cb-v3` e `outro-app-cache` num contexto descartável; confirmar `cb-v3` e `outro-app-cache` preservados após ativação.
- Garantir subpath do GitHub Pages e network-first do HTML inalterados.
- **Aceite:** comportamento conforme o JSON, zero exclusão de caches de terceiros.

**AUD-002 — P1: dependências de build/dev.**
- Conferir relatórios JSON do npm audit e quais advisory versions são realmente usadas.
- Buscar versões corrigidas compatíveis de Vite/Vitest/transitivas, sem aplicar `npm audit fix` automaticamente; testar updates de lockfile, typecheck, suíte e CI numa cópia/branch.
- **Aceite:** nenhum aviso relevante aplicável ou justificativa explícita e verificável de risco residual; publicar não requer expor dev server.

**Gate da fase:** todos os scripts automatizados verdes; nenhum `node_modules` quebrado; lockfile determinístico; SW isolado.

## Fase 2 — Correções funcionais, confiabilidade e proteção de dados
**AUD-003 (BRAPI):** reduzir lote inicial a no máximo o teto declarado de 20 símbolos, incluindo USD-BRL; mockar fetch para verificar todas requisições e fallback sem chave. Não gastar quota real sem aprovação humana.

**AUD-005 (CSV):** criar serializador seguro, sem fórmulas executáveis e com quotes/CRLF/Unicode preservados. Testar reimport em CSV reader.

**AUD-007 (DuckDB retry):** permitir recuperação após falha transitória e resetar `initPromise` e recursos parcialmente iniciados; preservar erro honesto e impedir fallback falso.

**AUD-008 (cache quotes):** validar `SyncResult`/cotação recebida do localStorage antes de `quotesToRecords`; descartar inválido com fallback estático e sem loop de erro.

**AUD-009 (privacidade API):** oferecer limpeza de token/cache com feedback, consentimento claro e possibilidade de usar token sem persistir, respeitando a arquitetura sem backend.

**Dependências:** AUD-005 e AUD-007 antes de smoke SQL; AUD-008/AUD-009 antes do browser E2E das empresas. Dados e integrações externas não devem ser alterados semanticamente sem checagem de fonte.

**Gate da fase:** unit/integration tests para casos acima; console sem uncaught; nenhum token em log/commit; SQL válido continua retornando resultados.

## Fase 3 — Fechamento das funcionalidades que são parte do escopo de produção
**AUD-006 — proteção do SQL livre:** limitar tamanho do resultado em memória e opções de cancelamento/feedback; preservar as quatro tabelas e as quatro consultas predefinidas; não fingir SQL por JS. Se houver proposta de bloqueio de statements SQL, definir escopo pedagógico com humano antes para não mudar produto inadvertidamente.

**AUD-011 — compatibilidade 3D:** depende de dispositivos físicos e aprovação humana. A IA prepara roteiro e baseline e pode corrigir regressões detectadas, mas não deve alegar homologação de dispositivos que não testou. **Se ausente hardware:** manter badge BETA, fallback SVG e pendência explícita; não bloquear trabalho independente.

**AUD-017 — ciclo release:** preparar changelog, checklist e rollback; a execução de tag, push e deploy requer autorização humana específica. Conferir `main`, remotes, tag e URL real antes de publicar.

**Gate da fase:** UI confiável em falhas SQL, rendering 2D disponível sem 3D, publicação ainda sem ações não autorizadas.

## Fase 4 — Refatorações e otimizações com benefício verificável
**AUD-012 — grafo 3D:** confirmar existência de API pública de teardown da versão instalada, substituir `_destructor` apenas se comprovadamente inadequada; testar limpeza com alternância repetida, WebGL/contextos e heap. Evitar rewrite completo.

**AUD-013 — gravação de preferência do globo:** capturar erro de storage na ação `pickTheme`, mantendo estado de sessão.

**AUD-018 — lint/Tipagem:** planejar script de lint com regras de React hooks/TypeScript prioritárias; não ativar centenas de avisos sem baseline. Revisar `any` apenas em boundaries críticos (DuckDB, Deck.gl, grafo).

**Gate da fase:** sem regressões perceptíveis de performance, bundle/chunks ou animações; só refatorar se o efeito operacional justificar.

## Fase 5 — Interface, acessibilidade e experiência
**AUD-004:** percorrer todos os ranges/inputs; associar rótulo via `htmlFor`+`id` ou `aria-label`/ `aria-labelledby`; manter traduções de PT/EN/ES e os valores lidos. Prioridade: dívida, plataformas, riqueza, busca empresas e fontes. Verificar foco e teclado, scroll do drawer, modais e affordances; usar axe e leitura com NVDA/VoiceOver quando possível.

**AUD-010:** implantar smoke automatizado simples de Chrome/Playwright (se justificar dependência; priorizar ferramenta já disponível) com pelo menos 12 visões, um fluxo de navegação, modo claro, EN/ES, SQL e layout mobile; capturar screenshots só em falhas. Colocar smoke e auditoria a11y mínima no CI com timeout e sem API externa.

**Gate da fase:** acessibilidade dos campos corrigidos e smoke reprodutível; 375×812 sem overflow nas telas principais; nenhuma regressão visual em 1440×1000.

## Fase 6 — Melhorias opcionais e editoriais (separadas do lançamento básico)
**AUD-014:** alinhar versão no README à versão/canal realmente lançado (não mudar versão do pacote automaticamente).
**AUD-015:** Parquet/datasets externos só após aprovação de licenças, qualidade e proveniência; manter como melhoria opcional.
**AUD-016:** revisar por impacto fontes com `fonte-declarada` e não promovê-las a `url-incluida` sem a verificação de página/tabela exata. A curadoria exige participação humana.
**AUD-018:** adoção ampliada de lint pode ocorrer aqui se não necessária ao gate anterior.

**Gate da fase:** opcionais não impedem release por si só; não converter estimativas em números oficiais sem fonte.

## Fase 7 — Homologação final, release e transferência
1. `npm test`, `npm run test:globe`, `test:framing`, `test:tours`, `test:tours:editorial`.
2. `npm run build`, `npm run test:perf:budget`; comparar orçamento inicial (baseline 110,3 KiB gzip) e lazy chunks.
3. `npm audit --omit=dev`, `npm audit`; registrar alertas remanescentes, em vez de omiti-los.
4. Browser real: 10 módulos + globo + settings; 375×812 e 1440×1000; dark/light, PT/EN/ES, 3 níveis, tour teclado, scroll, 2D↔3D, drawers, forms, links, erros de rede, SQL SELECT/erro/cancelamento, export CSV.
5. Testar offline/SW em origem isolada e subpath; simular upgrades sem tocar caches de outras aplicações.
6. Human tasks de `05_TAREFAS_HUMANAS.md` separadas; publicação **somente mediante autorização**. Não transformar ausência de dispositivo em declaração de sucesso.
7. Revisar artefatos, marcar cada AUD-ID como resolvido, pendente, rejeitado com razão ou opcional; anexar comandos/prints sanitizados. Entregar relatório final de regressão com diferenças e riscos residuais.

## Dependências e responsabilidades
| Corrente | IDs | Executante | Pré-requisito |
|---|---|---|---|
| SW e cadeia de suprimentos | 001→002 | IA | Cópia/branch, baseline |
| BRAPI e cache | 003→008→009 | IA / humano se teste live | Testes mockados; token privado só com consentimento |
| SQL | 007→006→005 | IA | Presets reais funcionando |
| Acessibilidade / gates | 004→010 | IA + homologador | Browser e ferramenta a11y |
| Hardware 3D | 011 | humano, IA apoiando | Android/iPhone físicos |
| Release | 017 | humano aprova; IA prepara | Gates anteriores aprovados |
| Opcionais | 012, 013, 014, 015, 016, 018 | IA/humano conforme JSON | Prioridade comercial |

**Esforço:** estimativas pequeno/médio/grande em `02_ACHADOS.json` são ordens de magnitude, não prazo prometido. Trabalhar incrementalmente, nunca sacrificar dados ou testes existentes.
