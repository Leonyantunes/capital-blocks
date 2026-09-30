/**
 * REGISTRO CANÔNICO DE MÓDULOS — fonte única da numeração e dos títulos.
 *
 * Este arquivo é a verdade sobre "qual é o número do módulo X". Antes ele
 * existia espalhado em três lugares que divergiam (Navbar TABS, i18n MOD_META,
 * cabeçalhos `MÓDULO NN` nos arquivos de `src/data`), o que fazia a UI
 * mandar o leitor para um número que não existia.
 *
 * REGRAS:
 * • Para exibir o número/título de um módulo em qualquer lugar do app
 *   (Navbar, cabeçalho de página, dica de tour, texto didático), use
 *   `MODULES[id].num` / `MODULES[id].title` / `modTitle(id)` — nunca
 *   escreva o número à mão.
 * • Para texto corrido que cita outro módulo ("veja o Módulo NN"), use
 *   `modRef(id)` e coloque no array de interpolação. Ele devolve
 *   "Módulo 04" (pt) / "Module 04" (en) / "Módulo 04" (es).
 * • `globe3d` não é um módulo numerado: é a variante 3D do Módulo 01
 *   (mapa). Aparece na UI como o chip "3D" ao lado do "01".
 *
 * Ver README.md §"Módulos" e TODO.md (P2-24, concluída).
 */

/** Identificador de uma aba do app. `globe3d` = variante 3D do Módulo 01;
 *  `settings` = página de configurações (não é módulo numerado). */
export type TabId =
  | 'home'
  | 'globe3d'
  | 'circuit'
  | 'war'
  | 'debt'
  | 'companies'
  | 'platform'
  | 'wealth'
  | 'consequences'
  | 'alternatives'
  | 'sources'
  | 'settings'

/** Todas as abas, na ordem em que aparecem na navegação. */
export const TABS: TabId[] = [
  'home',
  'globe3d',
  'circuit',
  'war',
  'debt',
  'companies',
  'platform',
  'wealth',
  'consequences',
  'alternatives',
  'sources',
  'settings',
]

/** Chave de tradução da etiqueta curta exibida na navegação. */
export type ModuleLabelKey =
  | 'mapa'
  | 'circuito'
  | 'guerra'
  | 'divida'
  | 'raio'
  | 'plataformas'
  | 'riqueza'
  | 'consequencias'
  | 'alternativas'
  | 'fontes'
  | 'configuracoes'

export interface ModuleMeta {
  /** Número canônico do módulo ("01"…"10"). Vazio para `globe3d`. */
  num: string
  /** Chave i18n da etiqueta curta da navegação. */
  labelKey: ModuleLabelKey
  /** Título curto em pt-BR usado em dicas, tooltips e textos didáticos. */
  shortTitle: string
  /** Nome do componente/arquivo dono do módulo (referência para o README). */
  component: string
}

/**
 * REGISTRO CANÔNICO. A ordem é a ordem de navegação.
 * Fonte única — não duplique numeração em outro arquivo.
 */
export const MODULES: Record<TabId, ModuleMeta> = {
  home: {
    num: '01',
    labelKey: 'mapa',
    shortTitle: 'Mapa Geopolítico',
    component: 'MapWorld.tsx',
  },
  /* globe3d é a variante 3D do Módulo 01 — sem número próprio. */
  globe3d: { num: '', labelKey: 'mapa', shortTitle: 'Mapa 3D', component: 'globe3d/GlobeModule.tsx' },
  circuit: { num: '02', labelKey: 'circuito', shortTitle: 'O Circuito do Capital', component: 'CircuitDiagram.tsx' },
  war: { num: '03', labelKey: 'guerra', shortTitle: 'Guerra de Capitais', component: 'war/WarModule.tsx' },
  debt: { num: '04', labelKey: 'divida', shortTitle: 'Morte e Ressurreição do Capital', component: 'DebtModule.tsx' },
  companies: { num: '05', labelKey: 'raio', shortTitle: 'Raio-X das Empresas', component: 'CompaniesModule.tsx' },
  platform: { num: '06', labelKey: 'plataformas', shortTitle: 'Plataformização do Trabalho', component: 'PlatformModule.tsx' },
  wealth: { num: '07', labelKey: 'riqueza', shortTitle: 'Quem Sustenta Quê?', component: 'wealth/WealthModule.tsx' },
  consequences: {
    num: '08',
    labelKey: 'consequencias',
    shortTitle: 'As Mortes do Capitalismo',
    component: 'consequences/ConsequencesModule.tsx',
  },
  alternatives: {
    num: '09',
    labelKey: 'alternativas',
    shortTitle: 'E Para Onde Podemos Ir?',
    component: 'alternatives/AlternativesModule.tsx',
  },
  sources: {
    num: '10',
    labelKey: 'fontes',
    shortTitle: 'Fontes & Referências',
    component: 'sources/SourcesModule.tsx',
  },
  /* settings não é módulo numerado: página de preferências (aberta pelo
     botão ⚙ da Navbar; fora da fileira de chips numerados). */
  settings: {
    num: '',
    labelKey: 'configuracoes',
    shortTitle: 'Configurações',
    component: 'SettingsModule.tsx',
  },
}

/**
 * Rótulo de acesso/aria da aba do mapa (varia entre 2D e 3D).
 * Derivado de `modRef('home')` — renumerar o mapa reflete aqui automaticamente.
 */
export const MAP_TAB_TOOLTIP: Record<'pt' | 'en' | 'es', string> = {
  pt: `${modRef('home', 'pt')} ⇄ Mapa 3D — clique para alternar entre as duas versões`,
  en: `${modRef('home', 'en')} ⇄ 3D Map — click to switch between both versions`,
  es: `${modRef('home', 'es')} ⇄ Mapa 3D — haz clic para alternar entre ambas versiones`,
}

/** Só o número cru ("04") — para números grandes em cards/gráficos. */
export function modNum(tab: TabId): string {
  return MODULES[tab].num
}

/** "Módulo 04" (pt) / "Module 04" (en) / "Módulo 04" (es) — para texto corrido. */
export function modRef(tab: TabId, lang: 'pt' | 'en' | 'es' = 'pt'): string {
  const num = MODULES[tab].num
  const word = lang === 'en' ? 'Module' : 'Módulo'
  return num ? `${word} ${num}` : MODULES[tab].shortTitle
}

/** "Módulo 04 · Morte e Ressurreição do Capital" — para links/dicas. */
export function modTitle(tab: TabId, lang: 'pt' | 'en' | 'es' = 'pt'): string {
  const num = MODULES[tab].num
  const word = lang === 'en' ? 'Module' : 'Módulo'
  return num ? `${word} ${num} · ${MODULES[tab].shortTitle}` : MODULES[tab].shortTitle
}
