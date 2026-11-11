# TAREFAS HUMANAS E APROVAÇÕES — CAPITAL BLOCKS

Não é necessário que o usuário passe senhas, chaves ou tokens para a IA. Esta lista inclui tudo que não deve ser inventado pelo agente. Os passos são escritos para quem não programa.

## HUM-01 — Homologar globo 3D em dois aparelhos reais (AUD-011)
**Prioridade:** P2 / gate para remover selo BETA. **Por que humano:** emulador/headless não mede o hardware, consumo de energia e gestos reais de Android/iOS.
**Pré-requisitos:** versão de teste acessível por HTTPS (não precisa publicar em produção), Android intermediário físico e iPhone com Safari, bateria/carga adequadas.
**Como fazer:**
1. Abrir a versão de homologação no Chrome do Android e depois no Safari do iPhone.
2. Abrir módulo 01 → Globo 3D; esperar renderizar pontos e fluxos.
3. Por 3–5 minutos, arrastar o globo, aproximar/afastar, escolher país/fluxo e iniciar e terminar um tour.
4. Usar botão de retorno ao mapa 2D; confirmar que o centro e o zoom permanecem coerentes.
5. Observar travamentos, canvas em branco, toque sem resposta, aquecimento e consumo incomum.
6. Registrar modelo e versão do SO/navegador, screenshots ou vídeo curto, taxa de quadros quando ferramenta estiver disponível e horário do teste. Critério-alvo do projeto: **≥45 FPS durante interação**.
**Concluído quando:** dois aparelhos testados, resultados com problemas e pass/fail documentados; se não passar, **manter BETA e fallback**.
**Retornar à IA:** modelo/OS/navegador, descrição do comportamento, FPS quando disponível e evidência, sem dados pessoais.

## HUM-02 — Confirmar experiência com teclado e leitor de tela (AUD-004 / AUD-010)
**Prioridade:** P2 / acessibilidade. **Por que humano:** checagens automáticas e DOM não cobrem anúncio perceptivo real nem navegação por gestos assistivos.
**Pré-requisitos:** build já corrigido; Windows NVDA ou macOS/iOS VoiceOver; navegador atualizado.
**Como fazer:**
1. Abrir o site e navegar usando apenas TAB, SHIFT+TAB, ENTER, ESPAÇO e ESC.
2. Abrir Dívida, Plataformas, Riqueza, Empresas e Fontes; encontrar sliders e caixas de pesquisa.
3. Ativar leitor de tela e conferir que o controle anuncia seu propósito, valor e modo adequado em PT/EN/ES.
4. Abrir/fechar drawer e menu; confirmar retorno do foco ao elemento anterior.
5. Verificar contraste e visibilidade do foco em dark/light; informar itens que não sejam compreensíveis.
**Concluído quando:** fluxos críticos compreensíveis e problemas documentados.
**Retornar à IA:** lista de módulo + controle + nome anunciado errado ou ausente (sem informações pessoais).

## HUM-03 — Decidir se sincronização real e tokens são desejados (AUD-003 / AUD-009)
**Prioridade:** P2. **Por que humano:** API externa pode cobrar, consumir cota e exige credencial pessoal.
**Pré-requisitos:** correções mockadas aprovadas, conta BRAPI/Alpha Vantage do próprio operador.
**Como fazer:**
1. Confirmar se o módulo Raio-X precisará operar **com cotações reais** na release; a base estática funciona sem integração.
2. Se sim, obter uma chave gratuita ou paga diretamente no site do fornecedor e confirmar limites do plano.
3. Em **ambiente de homologação privado**, inserir a chave no campo da própria interface do Capital Blocks. Nunca enviá-la por chat, screenshot, issue, commit ou auditoria.
4. Executar uma sincronização controlada e observar contagem/cotas/erros, sem insistir quando houver rate limit.
5. Testar a opção de apagar a credencial (a ser implementada) e confirmar que ela não reaparece.
**Concluído quando:** decisão de uso, tier/limites declarados (sem token), chamada de teste controlada ou decisão de manter desativado.
**Retornar à IA:** provedor, limite de símbolos por request, comportamento dos testes e se optou por persistência de token.

## HUM-04 — Aprovar curadoria de dados e expansão Parquet (AUD-015 / AUD-016)
**Prioridade:** P3 opcional; pode ser requisito editorial específico para uso institucional. **Por que humano:** julgamento de fontes, licença, metodologias e permissão de distribuição não se reduz a compilação.
**Pré-requisitos:** `DATA-GUIDELINES.md`, `DATA-STANDARD.md`, 54 fontes em `src/data/sources.ts`, 4 tabelas SQL embutidas.
**Como fazer:**
1. Abrir o módulo 10 — Fontes; conferir principais estatísticas a citar em aula/pesquisa.
2. Para registros marcados `fonte-declarada`, localizar a página/tabela de origem e a safra precisa, registrando URL e data de acesso. **Não** marcar como verificados sem a checagem.
3. Decidir se quer importar novos conjuntos Parquet e para qual pergunta didática; definir responsável pela atualização periódica.
4. Verificar as licenças das fontes e se é permitido redistribuir o conjunto no app.
5. Aprovar explicitamente lista de datasets, critérios, custos de download e prioridades; se não houver justificativa, manter os quatro datasets atuais.
**Concluído quando:** pacote editorial aprovado ou opção conscientemente adiada.
**Retornar à IA:** lista de fontes/datasets autorizados, URL, ano/safra, tipo de licença/condição e observações conceituais; sem credenciais.

## HUM-05 — Autorizar publicação, tag e verificação do GitHub Pages (AUD-017 / AUD-014)
**Prioridade:** P2 antes de anunciar release. **Por que humano:** publicar expõe conteúdo, cria release e pode impactar o site público, exigindo decisão do proprietário.
**Pré-requisitos:** correções concluídas, testes e smoke aprovados, changelog e procedimento de rollback.
**Como fazer:**
1. Solicitar à IA relatório de mudanças, `git diff --stat` e resultado dos testes finais. Não aprovar se não estiver claro.
2. Confirmar branch de publicação e domínio do Pages do repositório; HEAD local estava dois commits à frente do remoto e **não** foi sincronizado na auditoria.
3. Aprovar **explicitamente** se devem ser feitos push para main, tag `v1.1.0`, deploy e eventualmente release notes.
4. Depois da execução autorizada, abrir URL pública em janela anônima e no celular, navegar pelos dez módulos e entrar no SQL.
5. Em falha, solicitar rollback ao último commit/tag conhecido bom. Guardar URL e logs do GitHub Actions.
**Concluído quando:** URL confirmada, pipeline verde, tags coerentes, rollback disponível.
**Retornar à IA:** aprovação específica (o que publicar e quando), URL final, resultado do smoke e eventual necessidade de rollback.

## HUM-06 — Definir padrão de privacidade do armazenamento de chaves (AUD-009)
**Prioridade:** P2. **Por que humano:** depende de nível de conveniência e risco aceito pelo público-alvo.
**Como fazer:** escolher entre “lembrar token opcionalmente neste navegador” e “usar somente até fechar a aba”; exigir botão “Apagar token e cache” e aviso claro para computadores compartilhados. Preferir padrão sem persistência se não prejudicar a experiência desejada.
**Retornar à IA:** preferência por padrão, frase de consentimento aprovada e política de limpeza.

## Tarefas que NÃO são necessárias
Não pedir login de banco, credencial de servidor, OAuth, acesso ao deploy de produção ou criação de backend por padrão: **essas peças não integram a arquitetura atual**. A IA deve resolver correções locais independentes mesmo enquanto aguarda aprovação humana para hardware/serviços/lançamento.
