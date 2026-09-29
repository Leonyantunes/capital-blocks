# Política de Segurança

## Reportando uma vulnerabilidade

Este projeto é um **visualizador educacional estático**, sem backend, sem banco de
dados e sem coleta de dados de usuário. Ainda assim, se encontrar algo problemático,
reporte de forma privada.

**Por favor: não abra issue pública** para falhas de segurança antes de reportar.

GitHub permite reportar de forma privada via
**Security → Report a vulnerability** na aba do repositório (disponível para
mantenedores; se ainda não estiver habilitado, use o e-mail do autor no perfil do
commit mais recente).

O que incluir:

- descrição do problema e de como reproduzir
- impacto observável (o que um terceiro conseguiria fazer)
- versão/commit afetado e ambiente (navegador, Node)

Você receberá resposta em até 7 dias. Correções críticas tendem a ser aplicadas em
dias; melhorias podem entrar no ciclo normal.

## O que já é verdade sobre a superfície de ataque

Contexto honesto para quem avalia:

- **Sem servidor.** O app é 100% cliente. Não há banco de dados, autenticação, ou
  processamento de dados no back-end.
- **Sem telemetria.** Nenhum dado de uso é enviado a terceiros.
- **Sem chave do maintainer no repositório.** As fontes de dados de mercado
  (BRAPI / Alpha Vantage) são **desligadas por padrão**. Quando o usuário liga, o
  token é o **dele**, fica no `localStorage` do navegador dele e é enviado apenas ao
  endpoint do provedor. Nunca é versionado, e não é a chave de ninguém do projeto.
- **Sem `dangerouslySetInnerHTML` com dado externo.** O uso de `innerHTML` no app é
  restrito a duas operações internas e estáticas (limpar uma lista e escrever um
  spinner de carregamento) — nenhum conteúdo vindo de rede ou de usuário é injetado
  como HTML.
- **Sem `eval`/`new Function`.**
- **Service worker** de estratégia mista (network-first para HTML, cache-first para
  assets com hash), sem captura de requisições de terceiros.
- **Web Worker** usado só para computar geometria local, sem acesso a rede.

O que **não** é sanitizado por definição, e o autor assume: o app renderiza
fonte-e-dados; ele exibe números de fontes externas e, quando o usuário liga a API,
o token dele trafega para o provedor.

## Escopo

| Relato | Status |
| :--- | :--- |
| XSS via dado de fonte não confiável | **Sim** — relevante |
| Vazamento do token do próprio usuário | **Sim** — relevante |
| Integridade dos dados exibidos (fonte/safra errada) | **Sim** — prefira issue normal |
| Falha de build / regressão visual / conteúdo incorreto | Issue normal |
| Vulnerabilidade em dependência de runtime | Issue normal (cite a versão) |
