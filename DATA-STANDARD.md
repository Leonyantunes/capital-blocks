# DATA-STANDARD — Contrato legível por humanos e por IA

Este arquivo é o **contrato executável** de dados do Capital Blocks.
Ele implementa `DATA-GUIDELINES.md` e tem a mesma força normativa.

Ordem de precedência:

1. `THEORY.md` — constituição teórica; nenhuma informação pode violá-la.
2. `DATA-GUIDELINES.md` — política editorial e didática.
3. `DATA-STANDARD.md` — este contrato: schemas, vocabulários, arquivos, verificação e workflow.

Se houver conflito, o documento de número menor vence.

## 0. Como uma IA deve ler este arquivo

Antes de criar ou alterar qualquer fato, número, texto didático, país, fluxo,
tour, modo ou referência:

1. Leia `THEORY.md`, `DATA-GUIDELINES.md` e este arquivo.
2. Localize o dataset correto na **tabela de roteamento** da seção 4.
3. Use somente os tipos e vocabulários controlados das seções 1–2.
4. Não invente URL, ano, valor, autor, editora, instituição ou definição.
5. Se a fonte exata não foi aberta/verificada, marque `revisao-pendente`
   e não apresente o dado como fato fechado.
6. Rode `npm run build` no final.

Proibido para qualquer contribuidor humano ou IA:

- número sem fonte primária/instituição e sem ano;
- URL inventada, encurtada, adivinhada ou não aberta;
- média “de cabeça” apresentada como estatística oficial;
- alterar um valor para adaptá-lo à teoria;
- remover intervalo/ambiguidade de estimativas contestadas;
- misturar safras diferentes sem sinalizar;
- usar premissa neoclássica proibida por `THEORY.md`.

## 1. Schemas canônicos

### 1.1 Registro de fonte

```ts
export type SourceCategory =
  | 'macro'
  | 'moeda'
  | 'riqueza'
  | 'trabalho'
  | 'comercio'
  | 'guerra'
  | 'fiscal-br'
  | 'empresas'
  | 'brasil'
  | 'teoria'
  | 'alternativas'
  | 'impactos'
  | 'geo'
  | 'metodo';

export type SourceKind =
  | 'fonte-primaria'
  | 'base-oficial'
  | 'anuario'
  | 'relatorio-anual'
  | 'academica'
  | 'ong-especializada'
  | 'midia-especializada'
  | 'enciclopedia'
  | 'audiovisual'
  | 'metodologia-interna'
  | 'portal-oficial';

export type VerificationState =
  | 'fonte-declarada'
  | 'url-incluida'
  | 'revisao-pendente';

export interface SourceLink {
  rotulo: string;
  url: string;
  acessoEm: string; // AAAA-MM-DD
}

export interface SourceRecord {
  id: string; // kebab-case, ASCII, estável
  nome: string;
  instituicao?: string;
  categoria: SourceCategory;
  tipo: SourceKind;
  ano: string; // safra: AAAA, AAAA-MM, AAAA-TN, AAAA→AAAA
  urls: SourceLink[];
  resumoDidatico: string;
  resumoAvancado: string;
  cobre: string[];
  usadoEm: string[];
  estimate?: boolean;
  verificacao: VerificationState;
  observacao?: string;
}
```

### 1.2 Citação de dado

```ts
export interface DataCitation {
  fatoId: string; // kebab-case, ASCII, estável
  valor: string; // formato pt-BR: `US$ 2,718 bi`, `56,8%`
  unidade?: string;
  ano: string;
  fontes: string[]; // IDs de SourceRecord
  arquivos: string[]; // arquivos exatos onde o fato aparece
  textos: {
    didatico: string;
    avancado: string;
    superDidatico?: string;
    infantil?: string;
  };
  estimate?: boolean;
  status: 'publicado' | 'revisao-pendente' | 'removido';
}
```

Os campos `superDidatico` e `infantil` estão reservados para a futura expansão
de 3–4 modos. Não devem ser usados até a UI suportá-los.

### 1.3 JSON Schema mínimo para validação

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CapitalBlocksSourceRecord",
  "type": "object",
  "required": [
    "id",
    "nome",
    "categoria",
    "tipo",
    "ano",
    "urls",
    "resumoDidatico",
    "resumoAvancado",
    "cobre",
    "usadoEm",
    "verificacao"
  ],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    "nome": { "type": "string", "minLength": 3 },
    "categoria": {
      "type": "string",
      "enum": [
        "macro",
        "moeda",
        "riqueza",
        "trabalho",
        "comercio",
        "guerra",
        "fiscal-br",
        "empresas",
        "brasil",
        "teoria",
        "alternativas",
        "impactos",
        "geo",
        "metodo"
      ]
    },
    "tipo": {
      "type": "string",
      "enum": [
        "fonte-primaria",
        "base-oficial",
        "anuario",
        "relatorio-anual",
        "academica",
        "ong-especializada",
        "midia-especializada",
        "enciclopedia",
        "audiovisual",
        "metodologia-interna",
        "portal-oficial"
      ]
    },
    "ano": { "type": "string", "minLength": 4 },
    "urls": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["rotulo", "url", "acessoEm"],
        "properties": {
          "rotulo": { "type": "string" },
          "url": { "type": "string", "format": "uri" },
          "acessoEm": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" }
        }
      }
    },
    "verificacao": {
      "type": "string",
      "enum": ["fonte-declarada", "url-incluida", "revisao-pendente"]
    }
  }
}
```

## 2. Vocabulários controlados

### 2.1 Estado de verificação

| Estado | Significado | Quando usar |
| :--- | :--- | :--- |
| `fonte-declarada` | Instituição/safra copiada do dataset atual. | Fonte nomeada existe, mas a página/tabela exata ainda não foi reaberta. |
| `url-incluida` | Há link direto copiado do app ou conferido como acessível. | Link não garante atualidade automática. |
| `revisao-pendente` | Falta página exata, há inconsistência interna ou safra desatualizada. | Nunca citar como fato fechado em material educacional. |

### 2.2 Hierarquia de confiança

1. Fonte primária oficial: FMI, Banco Mundial, ONU/UNCTAD, OIT, Tesouro/BCB/IBGE,
   SIPRI, BIS, CBO, GAO, CRS, estatísticas nacionais.
2. Base oficial de mercado ou anuário especializado: WFE/SIFMA, SEC/CVM/B3,
   ILAESE, ICA/World Cooperative Monitor.
3. Pesquisa acadêmica revisada ou relatório técnico com metodologia aberta.
4. ONG especializada, mídia especializada e base enciclopédica confiável.
5. Estimativa didática interna, sempre com `estimate: true`.

A Wikipédia pode apoiar contexto não controverso. Ela nunca é fonte única para
números contestados, vítimas, intervenções, guerras ou teses teóricas centrais.

### 2.3 Idiomas

Fontes podem estar em português, inglês ou espanhol. Em caso de divergência,
vale a fonte primária, não a tradução. Termos técnicos mantêm o original entre
parênteses quando necessário: `lógica de ponta (leading-edge)`.

## 3. Regras de citação

- Cada número relevante precisa de instituição e safra.
- Prefira a página/tabela exata ao portal genérico.
- Se usar portal genérico, marque `revisao-pendente` e escreva em `observacao`
  qual tabela/página falta localizar.
- Números voláteis, como capitalização de mercado, exigem data explícita.
- Intervalos contestados devem ser preservados com os estimadores nomeados.
- Estimativas didáticas usam `estimate: true` e badge `est.` ou `API·est.`.
- Links externos usam `target="_blank"` e `rel="noreferrer"`.

## 4. Tabela de roteamento: fato → arquivo correto

| Assunto | Arquivo canônico | Observação |
| :--- | :--- | :--- |
| Indicadores globais curados | `src/data/indicators.ts` | Modelo ideal: `Indicator` com `year`, `source`, `sourceUrl`, `didatico`, `avancado`. |
| PIB, frações, facções, ILAESE e TMD por bloco | `src/data/countries.ts` | Frações devem somar 100%. |
| Fluxos geopolíticos | `src/data/flows.ts` | Usar `tier: 'base' \| 'detail'`; no máximo 3 partículas por rota. |
| Guerras, conflitos, fornecedores e estatísticas | `src/data/wars.ts` | Cada conflito pertence a exatamente uma época. |
| Orçamento e morte/ressurreição do capital | `src/data/debt.ts` | Percentuais do orçamento devem somar 100%. |
| Empresas BR e globais | `src/data/companies.ts` | Schema unificado `CompanyRecord`; motor `metricsFor`. |
| Riqueza mundial | `src/data/worldWealth.ts` | Vintage distinto por item. |
| Brasil, UFs e fluxos internos | `src/data/brazil.ts` | Distinguir valor parcial de valor anual. |
| Salários por país | `src/data/wages.ts` | Ordem de grandeza didática; distinguir média/mediana quando possível. |
| Teoria MMT, soberania e TMD | `src/data/theory.ts` | Textos conceituais com autores e categorias. |
| Glossário | `src/data/glossary.ts` | Definições teóricas, não estatísticas. |
| Consequências e vítimas | `src/data/consequences.ts` | Preservar intervalos e estimadores. |
| Alternativas, cooperativas e garantia de emprego | `src/data/alternatives.ts` | Casos com dado, local, pilares e safra. |
| Países afetados e intervenções | `src/data/affected.ts` | Distinguir PIB/per capita de interpretações históricas. |
| Concentração, top 1% e bilionários | `src/data/concentration.ts` | Safra por ponto/série. |
| Desastres corporativos | `src/data/disasters.ts` | Separar mortos diretos, expostos e projeções. |
| Tours e estatísticas de tour | `src/data/tour.ts`, `src/data/tours.ts` | Estatísticas de tour devem apontar para a fonte do fluxo. |
| Premissas setoriais e decomposição | `src/lib/companyMetrics.ts` | Margem/folha são premissas, não estatísticas oficiais. |
| APIs dinâmicas | `src/lib/marketApi/*` | Sempre `origem: 'api'` e `estimate: true` quando houver estimativa. |
| Geografia, blocos e ISO | `src/lib/world.ts` | País novo: `BLOC_MEMBERS` + `countries.ts`. |
| Registro canônico de referências | `src/data/sources.ts` | Toda fonte relevante deve ter entrada estável. |
| Página de referências | `src/components/sources/SourcesModule.tsx` | Busca, filtros, badges e links externos. |

## 5. Workflow para novos dados

1. Escolha o dataset na tabela acima.
2. Crie ou atualize o `SourceRecord` em `src/data/sources.ts`.
3. Adicione o fato com `fatoId`, `valor`, `ano`, `fontes`, `arquivos` e textos.
4. Para país novo:
   - ISO numérico em `BLOC_MEMBERS` (`src/lib/world.ts`);
   - entrada completa em `src/data/countries.ts`;
   - BRICS+ em `BRICS_ISO` e indicadores/conflitos relevantes.
5. Para fluxo novo:
   - entrada em `FLOWS` (`src/data/flows.ts`);
   - âncoras `[lng, lat]` reais;
   - `type` válido e `tier: 'base' | 'detail'`;
   - `totalAnual`, itens, fonte e textos duplos.
6. Para tour novo:
   - paradas em `src/data/tour.ts` / coleção em `src/data/tours.ts`;
   - cada `didStats` deve reutilizar fonte já registrada;
   - coordenadas, zoom, fluxo/conflito e camada precisam existir.
7. Para modo novo:
   - não usar `superDidatico`/`infantil` antes da UI suportá-los;
   - atualizar `UIMode`, textos, `ModeBadge`, `DATA-GUIDELINES.md` e esta norma.
8. Atualize a página Fontes & Referências quando a fonte for nova ou relevante.
9. Rode `npm run build`.

## 6. Exemplo mínimo válido

```ts
export const SOURCES: SourceRecord[] = [
  {
    id: 'imf-cofer',
    nome: 'Currency Composition of Official Foreign Exchange Reserves',
    instituicao: 'Fundo Monetário Internacional',
    categoria: 'moeda',
    tipo: 'fonte-primaria',
    ano: 'Q4 2025',
    urls: [
      {
        rotulo: 'Conjunto de dados COFER',
        url: 'https://data.imf.org/en/datasets/IMF.STA:COFER',
        acessoEm: '2026-09-13',
      },
    ],
    resumoDidatico:
      'Mostra em quais moedas os bancos centrais guardam reservas internacionais.',
    resumoAvancado:
      'Base para medir a hierarquia monetária e a desdolarização gradual das reservas oficiais.',
    cobre: ['Participação do dólar, euro, iene, libra e renminbi nas reservas.'],
    usadoEm: ['src/data/indicators.ts', 'Indicadores Globais', 'Mapa 2D'],
    verificacao: 'url-incluida',
  },
];
```

## 7. Auditoria atual e regra de honestidade

A página Fontes & Referências pode exibir `revisao-pendente` sem esconder o
dado. Isso é melhor do que publicar um número duvidoso como fato fechado.

Toda entrada marcada como `revisao-pendente` precisa dizer, em `observacao`,
exatamente o que falta: página exata, safra, metodologia, URL direta ou
segunda fonte independente.
