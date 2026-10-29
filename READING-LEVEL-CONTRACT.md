# Contrato dos três níveis de leitura

Este documento define o contrato editorial e técnico dos modos **Simples**, **Didático** e **Avançado** do Capital Blocks. Ele complementa `THEORY.md`, `DATA-GUIDELINES.md` e `DATA-STANDARD.md`: nenhum nível pode alterar o fato, a magnitude, a unidade, o período ou a proveniência para “facilitar” a explicação.

## Invariantes

Para a mesma entidade pedagógica:

1. **Fato, número, unidade e período são invariantes.**
2. **`sourceIds` são invariantes.** Um nível pode acrescentar método ou ressalva, nunca remover a proveniência factual.
3. **O nível muda linguagem, profundidade e repertório explicativo, não o dado.**
4. **PT, EN e ES devem possuir a mesma profundidade pedagógica.** Tradução ausente é erro; não há fallback silencioso para PT.
5. **Conteúdo pedagógico exige três versões explícitas.** O resolver `textoPorModo()` não faz fallback entre níveis.
6. Textos realmente neutros — nomes próprios, unidades, valores e rótulos factuais curtos — podem ser compartilhados, desde que não carreguem uma explicação pedagógica.

## Simples

Público: Fundamental II e início do Ensino Médio.

- Frases curtas e vocabulário cotidiano.
- Jargão só aparece quando explicado imediatamente.
- Fórmulas formais não aparecem no corpo simples; quando indispensáveis, a ideia é descrita em palavras.
- Preserva todos os números que sustentam a afirmação exibida.
- Explica mecanismo em poucos passos e usa exemplo concreto.
- Não infantiliza e não transforma hipótese, interpretação ou estimativa em fato.

Faixa editorial inicial:
- tooltip: ~10–20 palavras;
- card: ~35–70 palavras;
- drawer: pode ser maior, com parágrafos curtos e scroll deliberado.

## Didático

Público: Ensino Médio, ENEM e graduação introdutória.

- Narrativa + mecanismo + exemplo.
- Destaca 2–3 números-âncora quando houver.
- Explica o “porquê” e conecta o conteúdo ao fenômeno observado.
- Fórmulas podem aparecer com legenda e interpretação.
- Evita artigo acadêmico dentro do card.

Faixa editorial inicial:
- tooltip: ~15–30 palavras;
- card: ~60–110 palavras.

## Avançado

Público: graduação avançada, pós-graduação e pesquisa.

- Usa categorias formais quando elas aumentam a precisão.
- Explicita identidade contábil, hipótese, método, safra e limitação quando relevantes.
- Mantém **os mesmos números e links de fonte** dos demais níveis.
- Distingue dado observado, cálculo derivado e proxy/modelo pedagógico.
- Evita slogan didático e não trata interpretação teórica como consenso empírico.

Faixa editorial inicial:
- tooltip: ~20–40 palavras;
- card: ~80–150 palavras, com disclosure/scroll quando necessário.

## Idiomas

EN e ES são adaptações pedagógicas, não traduções literais.

- Ausência de locale de tour gera erro.
- Ausência no catálogo `generatedTranslations.ts` gera erro.
- Convenções locais de decimal e abreviação podem mudar; a magnitude não.
- Termos técnicos devem ser naturais no idioma de destino.

## Implementação

### Resolver estrito

`textoPorModo(mode, did, adv, simples)` exige as três strings.

O fallback legado de `resolve()` existe apenas para compatibilidade de utilidades/testes antigos e não deve ser usado em nova UI pedagógica.

### Tours

- Toda parada tem `simples`, `did`, `adv`.
- Toda estatística mantém `v` e `sourceIds` entre idiomas e níveis.
- Stats e fontes aparecem também no modo Avançado.
- Quizzes preservam a resposta factual, mas possuem pergunta, distratores e explicação adaptados por nível.
- Estado de quiz é reiniciado ao trocar de parada.

### URL reproduzível

Links pedagógicos podem carregar:
- `t`: aba;
- `m`: nível de leitura;
- `l`: idioma.

Valores válidos da URL têm prioridade sobre preferências persistidas para que professor, revisor e aluno abram o mesmo estado editorial.

## Testes obrigatórios

Antes de considerar uma alteração de conteúdo pronta:

```bash
npm run build
npm test
npm run test:tours
npm run test:tours:editorial
npm run test:globe
npm run test:framing
```

`src/test/readingLevels.test.ts` deve garantir:

- três níveis explícitos;
- cobertura EN/ES dos tours;
- geometria, valores e `sourceIds` invariantes;
- ausência de fórmulas/jargões bloqueados no Simples dos tours;
- cobertura dos helpers Simples;
- cobertura do catálogo de traduções geradas.

`scripts/tour-editorial.mjs` complementa o teste com heurísticas editoriais e deve terminar com **0 erros e 0 avisos**.

## Checklist para novo conteúdo

Antes de adicionar uma tela, card, parada, tooltip, quiz ou drawer:

- [ ] Há Simples, Didático e Avançado explícitos?
- [ ] Os números, unidades e períodos são os mesmos?
- [ ] Os mesmos `sourceIds` sustentam o fato?
- [ ] EN e ES têm versões próprias do mesmo nível?
- [ ] Simples está sem fórmula/jargão indecifrável?
- [ ] Didático explica o mecanismo?
- [ ] Avançado explicita método/limitação quando necessário?
- [ ] O texto cabe no componente em 375×812 e desktop?
- [ ] Teclado, foco e leitor de tela continuam funcionando?
- [ ] Build, testes, auditorias e smoke estão verdes?

## Definition of Done editorial

Uma superfície só pode ser chamada de completa quando:

- não há fallback silencioso de nível ou idioma;
- fatos/números/fontes são invariantes;
- os três níveis cumprem seus contratos;
- PT/EN/ES têm paridade pedagógica;
- não há truncamento ou overflow não intencional;
- o fluxo é navegável por mouse, toque e teclado;
- build, testes e smoke não registram regressão.
