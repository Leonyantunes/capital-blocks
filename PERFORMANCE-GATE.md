# Gate de performance — baseline de release

Data da medição: **2026-10-29**.

Este documento registra o baseline reproduzível do Capital Blocks após a auditoria dos
três níveis de leitura. Ele não substitui perfil em aparelho real: os números abaixo
foram coletados no build de produção em Chrome, com viewport mobile 375×812 e, quando
indicado, CPU 4×.

## Orçamento estático

O comando obrigatório após `npm run build` é:

```bash
npm run test:perf:budget
```

Limites atuais:

- bundle inicial: **≤ 128 KiB gzip**;
- entry JS: **≤ 75 KiB gzip**;
- CSS inicial por arquivo: **≤ 16 KiB gzip**;
- qualquer chunk lazy: **≤ 400 KiB gzip**;
- `vendor-three-controls`: **≤ 8 KiB gzip**;
- Deck.gl, Three.js, DuckDB e grafo corporativo não podem entrar no preload inicial;
- o `GlobeModule` não pode importar `vendor-deck`, `vendor-graph` ou
  `vendor-duckdb`.

Baseline atual:

- bundle inicial: **110,3 KiB gzip**;
- entry JS: **66,2 KiB gzip**;
- CSS inicial: **13,3 KiB gzip**;
- maior chunk lazy: `vendor-graph`, **354,6 KiB gzip**;
- `vendor-deck`: **254,3 KiB gzip**;
- `vendor-three`: **139,6 KiB gzip**;
- `vendor-three-controls`: cerca de **4,5 KiB gzip**.

### DuckDB-Wasm local

O laboratório SQL continua **fora do preload inicial**. Ao abrir a sub-aba analítica,
o browser escolhe um bundle DuckDB compatível e carrega Worker/WASM sob demanda. O
artefato de deploy inclui as duas variantes por compatibilidade:

- Worker EH: **~184 KiB gzip**;
- Worker MVP: **~189 KiB gzip**;
- WASM EH: **~35,9 MB raw / 8,1 MB gzip**;
- WASM MVP: **~41,3 MB raw / 9,3 MB gzip**.

Esse custo é alto, mas isolado do Módulo 01 e dos demais fluxos iniciais. O gate bloqueia
qualquer retorno do DuckDB ao preload; reduzir o footprint do laboratório exige uma
decisão explícita de compatibilidade/distribuição, não deve ser feito ocultando o custo.

## Carregamento e estabilidade visual

Build de produção, origem local limpa, sem cache prévio:

| Cenário | FCP | LCP | CLS |
| --- | ---: | ---: | ---: |
| Desktop 1440×1000, CPU 1× | ~0,17 s | ~0,43 s | ~0,058 |
| Mobile 375×812, CPU 1× | ~0,10 s | ~0,22 s | 0 |
| Mobile 375×812, CPU 4× | 0,24–0,28 s | **0,39–1,54 s em 5 repetições** | **0** no trace dedicado |

O candidato de LCP mobile é o parágrafo introdutório do Módulo 01. O `MapModule`
agora entrega o cabeçalho antes de montar o mapa pesado e carrega `MapWorld` em um
chunk lazy separado. No perfil controlado de CPU 4×, cinco repetições produziram
**0,388 / 0,388 / 0,400 / 0,484 / 1,536 s** (mediana **0,400 s**) e o trace dedicado
de layout shift fechou em **CLS 0**. O `MapModule` caiu de aproximadamente **154 KiB
raw para 49 KiB raw**; o SVG ficou em `MapWorld` (~101 KiB raw) carregado depois do
primeiro paint.

## Mapa 2D

Viewport 375×812, DPR 2, CPU 1×, Chrome:

- ocioso: próximo de **60 FPS** no perfil do navegador;
- zoom/interação sintética: **59,9 FPS**, p95 ~16,8 ms.

O mapa 2D atende a meta de 60 FPS de forma prática no laboratório e permanece acima da
meta de 45 FPS durante interação.

## Globo 3D

O chunk do globo passou a carregar apenas o necessário para o renderer 3D:
`vendor-three` + `vendor-three-controls`. Antes da correção, a associação de
`OrbitControls` ao chunk do grafo fazia o globo baixar também `vendor-graph` e
`vendor-deck`, aproximadamente **625 KiB gzip** extras.

No ambiente headless usado na auditoria, o WebGL identifica:

```text
ANGLE (Microsoft Basic Render Driver, Direct3D11)
```

Esse é um renderer de software. Na rodada final, o `requestAnimationFrame` ficou em
cerca de **48 FPS** e o HUD do globo em torno de **25 FPS** nesse ambiente. Esses
números **não são critério de aprovação ou reprovação de GPU mobile real** porque o
renderer não representa uma GPU móvel real.

O globo deve continuar marcado como **BETA** até validar em pelo menos:

1. Android mid-range real;
2. iPhone/Safari real;
3. órbita, zoom e tour com FPS/temperatura observados;
4. comparação visual sem perda de nitidez relevante.

Meta em aparelho: **≥45 FPS durante tour/zoom** e comportamento próximo de 60 FPS no
estado base, sem regressão visual.

## Gate de release

Uma release não deve avançar se:

- `test:perf:budget` falhar;
- o smoke detectar overflow/console error;
- o LCP mobile 4× repetir acima de 2,5 s sem investigação;
- o mapa 2D cair abaixo de 45 FPS no perfil de interação;
- um chunk pesado voltar ao grafo inicial;
- o globo perder o selo BETA antes da validação em aparelho real.
