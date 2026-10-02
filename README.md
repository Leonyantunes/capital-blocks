# Capital Blocks

**Versão 1.0.0** — primeira versão pública estável.

**A anatomia do capitalismo global** — um visualizador interativo, em português, que
traduz categorias de *O Capital* em componentes visuais alimentados por dados
econômicos reais.

Mapa-múndi com fluxos de valor, globo 3D, um circuito do capital animado, guerra de
capitais com as linhas de suprimento das matrizes, o mecanismo de dívida pela lente do
MMT, um raio-X de ~160 empresas decompostas pela mesma fórmula `W = c + v + m`, e
simuladores jogáveis (salário por peça, curva da taxa de lucro, curva kaleckiana).

> 🇧🇷 A V1 é publicada com interface e conteúdo em **português do Brasil**. O "chrome"
> da UI já tem tradução parcial EN/ES; a tradução completa dos módulos, dados e tours
> fica para o ciclo pós-V1.

---

## Sumário

- [O projeto](#o-projeto)
- [Como rodar](#como-rodar)
- [Scripts](#scripts)
- [Stack](#stack)
- [Módulos](#módulos)
- [Arquitetura](#arquitetura)
- [Três níveis de leitura](#três-níveis-de-leitura)
- [Design System](#design-system)
- [Como os dados entram](#como-os-dados-entram)
- [Metodologia e limites](#metodologia-e-limites)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## O projeto

O app é construído sobre **quatro pilares teóricos** — declarados em
[`THEORY.md`](THEORY.md), que funciona como constituição do projeto:

1. **Marx, *O Capital*** — valor-trabalho, `W = c + v + m`, tendência decrescente de `g`
2. **Keynes / Kalecki / Minsky** — demanda efetiva, moeda endógena, paradoxo da
   parcimônia, equação kaleckiana dos lucros
3. **MMT** — soberania monetária, impostos como anulação de moeda, dívida como ativo
   líquido do setor privado, limite real = inflação e capacidade ociosa
4. **Teoria Marxista da Dependência** (Marini, dos Santos, Bambirra) — troca desigual,
   superexploração, vazamento de valor Sul → Norte

Premissas neoclássicas (moeda neutra, Estado-família, fundos emprestáveis, equilíbrio
geral) estão **banidas por diretriz** — não aparecem como pressuposto em nenhuma tela.

O botão **"01 Mapa"** alterna entre o mapa 2D (SVG) e o globo 3D (Three.js) do mesmo
módulo. A **landing page** do projeto ([`public/landing.html`](public/landing.html))
apresenta o app para quem chega de fora.

O botão **⚙** abre a **página de configurações** (aba `?t=settings`): nível de leitura,
tema claro/escuro, idioma, modo referências e modo apresentação — todas as preferências
num lugar só, com descrições.

## Como rodar

Requer **Node 22+**.

```bash
npm install
npm run dev       # http://localhost:5173
```

Não há backend, banco de dados nem variáveis de ambiente obrigatórias: o app é
inteiramente cliente. Tudo o que precisa saber está nos arquivos de `src/data/`.

## Scripts

| Script | O que faz |
| :--- | :--- |
| `npm run dev` | Servidor de desenvolvimento (Vite + HMR) |
| `npm run build` | Typecheck (`tsc -b`) + bundle de produção em `dist/` |
| `npm run preview` | Serve localmente o bundle de produção |
| `npm test` | Suíte Vitest (motor conceitual, motor empresarial, store, tours) |
| `npm run test:watch` | Mesma suíte em modo watch |
| `npm run test:globe` | Testes de propriedade do voo da câmera 3D |
| `npm run test:framing` | Testes de enquadramento de rota (2D/3D, antimeridiano) |
| `npm run test:tours` | Auditoria de integridade do contrato de parada dos tours |
| `npm run test:tours:editorial` | Auditoria das 49 paradas, do nível Simples e da qualidade editorial |

As quatro suítes auxiliares são `.mjs` puros (sem dependência de teste) e verificam
invariantes do globo, enquadramento e integridade/editorial dos tours. O deploy no GitHub Pages roda as
**cinco** suítes antes do build — nada quebrado é publicado.

## Stack

| Camada | Escolha |
| :--- | :--- |
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 7 |
| Estilo | Tailwind CSS v4 (tokens via `@theme`) |
| Estado | Zustand 5 (com `persist`) |
| Animação | Framer Motion (`m` + `LazyMotion`) |
| Mapa 2D | `world-atlas` (TopoJSON 110m) + `d3-geo` + `topojson-client` |
| Mapa 3D | Three.js, com matriz de pontos calculada em **Web Worker** |
| Testes | Vitest + jsdom |

Restante das visualizações em **SVG puro** (rosca, relógios, curvas, circuito).

## Módulos

A numeração é canônica e vive em [`src/data/modules.ts`](src/data/modules.ts) — nenhum
número é escrito à mão no código (Navbar, cabeçalhos, dicas de tour e textos que citam
outro módulo consomem o registro).

| # | Módulo | O que faz |
| :-- | :-- | :-- |
| 01 | **Mapa Geopolítico** (2D ⇄ 3D) | Mapa-múndi real, ~177 países clicáveis, 4 camadas de fluxo animado, guerras de blocos, indicadores globais e painel de riqueza mundial |
| 02 | **O Circuito do Capital** | `M — C(L/MP) … P … C′ — M′` animado, tradutor de *horas não pagas* com relógio analógico, curva da tendência decrescente |
| 03 | **Guerra de Capitais** (War Room) | Linha do tempo reversa 2026→1914, 5 épocas, linhas de suprimento das matrizes até as zonas de guerra, drawer "quem lucra" |
| 04 | **Morte e Ressurreição do Capital** | Lente Ortodoxa ⇄ MMT, identidade setorial `(S−I) ≡ (G−T)+(X−M)`, simulador kaleckiano |
| 05 | **Raio-X das Empresas** | ~160 empresas (24 BR + 137 globais) pelo mesmo motor `W = c + v + m`; formato Anuário ILAESE |
| 06 | **Plataformização do Trabalho** | Simulador de salário por peça, "para onde vai o bruto", taxa oculta |
| 07 | **Quem Sustenta Quê?** | Trabalho × concentração, bilionários, distribuição da renda |
| 08 | **Consequências Sistêmicas** | Desastres corporativos com coordenadas e mortos, países afetados |
| 09 | **E Para Onde Podemos Ir?** | Cooperativas, orçamento participativo, garantia de emprego — casos que já funcionam |
| 10 | **Fontes & Referências** | Base documental pesquisável, com estado de verificação por fonte |

Extras na Home (Módulo 01): **Indicadores Globais** (COFER, SIPRI, dívida/PIB, BRICS+,
TSMC), **Riqueza Mundial sob Raio-X** (títulos × base real contra o PIB mundial) e
**tours temáticos** guiados no 2D e no 3D.

## Arquitetura

```
src/
  data/          # 20 datasets tipados — a "fonte" do conteúdo
    modules.ts   #   registro canônico de numeração/títulos (inclui a aba settings)
    sources.ts   #   registro documental (fonte, safra, verificação)
    flows.ts     #   fluxos geopolíticos (o maior dataset, 736 linhas)
  lib/
    marx.ts              # motor conceitual: c=k·v, m=e·v, g=e/(k+1)
    companyMetrics.ts    # motor empresarial: decomposição W = c+v+m
    marketApi/           # cotações opcionais (BRAPI / Alpha Vantage)
  store/useApp.ts # Zustand: preferências globais + persistência
  components/     # um diretório por módulo
    SettingsModule.tsx   # página de configurações (aba settings)
  test/           # suíte Vitest
```

Decisões que valem destaque:

- **Store enxuto e persistido.** Um único store Zustand. `mode`, `k`, `e`, `basis`,
  `lang`, `theme`, `showRefs` e `presentation` sobrevivem ao reload; o estado vindo do
  rehydrate é **validado** (enums fixados em default, sliders fixados no intervalo,
  JSON corrompido não derruba o app). `tab`/`countryId` **não** persistem: a aba vem de
  `?t=` na URL, que tem prioridade sobre o estado salvo.
- **Code-splitting por módulo.** Cada aba é um `lazy()` separado; Home e shell ficam no
  chunk inicial. Three.js só é baixado se você abrir o mapa 3D.
- **Três vendors separados** (`motion`, `geo`, `three`) via `manualChunks`.
- **Modo de apresentação** muda a raiz de `font-size` para projeção em sala.
- **Service worker** com estratégia network-first para HTML (deploy novo nunca fica
  preso num `index.html` antigo) e cache-first para assets com hash.

## Três níveis de leitura

Alternador global no cabeçalho, padrão **Didático**. Vale para todo o app e mantém os
mesmos números, datas e unidades: muda a linguagem, não o dado.

| Aspecto | Simples | Didático | Avançado |
| :--- | :--- | :--- | :--- |
| Automação | "Máquinas por trabalhador" | "Nível de Automação" | Composição orgânica `k = c/v` |
| Exploração | "Tempo de trabalho não pago" | "Intensidade de Exploração" + relógio | Taxa de mais-valia `e = m/v` |
| Lucro | explicação em linguagem cotidiana | "Trabalho não pago na jornada" | `g = m/(c+v)` e tendência decrescente |
| Fórmulas | evitadas quando não são necessárias | aparecem com apoio visual | sempre visíveis |
| Tooltips | vocabulário de início do ensino médio | linguagem direta | definições formais |

Nos tours, as **49 paradas** têm copy simples explícita. Nos demais componentes,
`textoPorModo()` prefere copy simples curada e usa uma simplificação conservadora do
texto didático como fallback, preservando números e unidades.

## Design System

Tema escuro por padrão, definido por tokens em [`src/index.css`](src/index.css).
O **modo claro** é a mesma paleta invertida por variáveis sob `[data-theme='light']`
(os utilitários Tailwind v4 compilam para `var(--color-*)`): os componentes não
mudam uma linha. Os mapas 2D/3D são "instrumentos" com canvas escuro próprio e
mantêm o fundo escuro nos dois temas.

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `zinc-950` | `#0D1117` | fundo |
| `zinc-900` | `#161B22` | painéis (`zinc-800` = borda `#30363D`) |
| `money` | `#FFC107` | capital-dinheiro `M`, fluxos financeiros |
| `machine` | `#2196F3` | capital constante `c`, commodities |
| `labor` | `#F44336` | capital variável `v`, trabalho vivo |
| `surplus` | `#4CAF50` | mais-valia `m`, lucro |
| `fict` | `#9C27B0` | capital fictício, dívida |
| `onaccent` | `#0D1117` | texto sobre cor de destaque (não inverte no modo claro) |

Tipografia: Inter (UI) + JetBrains Mono (toda grandeza econômica).

## Como os dados entram

Este projeto leva dados a sério, e isso é **documentado como contrato**:

- [`DATA-GUIDELINES.md`](DATA-GUIDELINES.md) — política editorial: fonte primária + ano em
  todo número, níveis de leitura, flag `estimate`, semântica de cores conceituais.
- [`DATA-STANDARD.md`](DATA-STANDARD.md) — contrato legível por humanos **e por IA**:
  schemas TypeScript, vocabulários controlados, tabela de roteamento "fato → arquivo
  canônico" e workflow de verificação.
- [`src/data/sources.ts`](src/data/sources.ts) — registro canônico das fontes, com
  **três estados de verificação** honestos:
  - `url-incluida` — link direto conferido
  - `fonte-declarada` — instituição e safra existem; página exata ainda não reaberta
  - `revisao-pendente` — **não citar como fato fechado**; a `observacao` diz o que falta

O Módulo 10 expõe esse registro na UI, incluindo o que ainda está pendente. Um dado
incompleto é exibido com honestidade, não escondido.

As **101 estatísticas dos tours** apontam para uma ou mais entradas canônicas desse
registro e exibem atalho para a fonte diretamente nos cards do mapa 2D e do globo 3D.
Em 2026-10-02 não havia nenhuma entrada efetivamente marcada `revisao-pendente`.

**Fontes dinâmicas de mercado** (BRAPI/B3 e Alpha Vantage) são **desligadas por
padrão** e ficam na própria página do Módulo 05. Quando ligadas, o token é o **do
usuário**, guardado no `localStorage` do navegador dele e enviado apenas ao endpoint do
provedor — não há chave do maintainer no repositório. Registros vindos de API recebem
`estimate: true` e estimativas setoriais são sinalizadas com `API·est.`.

## Metodologia e limites

- **Estimativas são rotuladas.** Decomposições `c/v/m` de empresas, frações internas
  de PIB, wages por país e valores de private markets são **estimativas didáticas para
  visualização**, não estatística oficial.
- **Granularidades não se misturam.** Valor anual nunca é somado com parcial; safras
  diferentes são sempre sinalizadas.
- **Fontes em disputa preservam a disputa.** Intervalos e estimadores nomeados são
  mantidos, não achatados numa média.
- **O valor do imobiliário mundial é estimativa** (estoque de private markets); o app
  também sinaliza a distinção entre *valor do estoque* e *volume de investimento*.
- **Sem backend, sem telemetria, sem rastreamento.** Nenhum dado sai do navegador a não
  ser para as APIs que o usuário liga manualmente.

## Contribuindo

O projeto tem quatro documentos normativos que **prevalecem** sobre qualquer
convenção usual: `THEORY.md` → `DATA-GUIDELINES.md` → `DATA-STANDARD.md`. Antes de
mexer em qualquer número, texto, país, fluxo ou tour, leia os três.

Fluxo sugerido:

```bash
npm install
npm test          # deve passar antes e depois da sua mudança
npm run build     # typecheck limpo é obrigatório
```

Adicionar um fato novo tem um caminho documentado na seção 5 do `DATA-STANDARD.md` —
basicamente: escolher o dataset pela tabela de roteamento → registrar/atualizar a
`SourceRecord` → adicionar o fato com `fatoId`, `valor`, `ano`, `fontes` e `arquivos`.
Ao renumerar um módulo, edite **apenas** `src/data/modules.ts`.

## Licença

**CC BY-NC-SA 4.0** — código e conteúdo sob a **mesma** licença. Ver
[`LICENSE`](LICENSE) (texto legal) e [`LICENSE.md`](LICENSE.md) (escopo e como citar).

Tradução: reutilize, adapte e compartilhe livremente, com atribuição, **desde que
não use com finalidade comercial** e distribua derivados sob a mesma licença. Uso
educacional, pesquisa e material de estudo estão explicitamente permitidos.

**Aviso.** Protótipo educacional. As decomposições, frações e métricas são estimativas
pedagógicas para visualização e não constituem estatística oficial nem recomendação de
investimento. Conceitos teóricos seguem as fontes citadas em `THEORY.md`; divergências
entre autores são apresentadas como tais.

---

Leituras que sustentam o conteúdo: **FMI** (WEO, COFER, Fiscal Monitor) · **UNCTAD** ·
**BIS** · **SIPRI** · **OIT/ILOSTAT** · **Tesouro Nacional** · **Banco Central do
Brasil** · **IBGE** · **CBO** · **Comex Stat/MDIC** · **UBS Global Wealth Report** ·
**Savills** · e a literatura crítica citada em `THEORY.md` (Marini, dos Santos,
Bambirra, Prebisch-Singer, Kalecki, Minsky, Wray, Kelton, Hudson, Shaikh).
