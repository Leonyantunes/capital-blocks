/** i18n LEVE — tradução do CHROME da interface (PT/EN/ES).
 *  O conteúdo dos módulos permanece em PT-BR (tradução integral = próxima fase).
 *  Uso: t(lang, 'chave') — cada entrada é [pt, en, es].
 *
 *  A NUMERAÇÃO DOS MÓDULOS NÃO VIVE AQUI: ela vem de `data/modules.ts`
 *  (registro canônico). Só os sufixos ("· War Room", "· Raio-X"…) são
 *  traduzidos aqui; o número é sempre MODULES[id].num. */

import { MODULES, modRef, type TabId } from './data/modules'

export type Lang = 'pt' | 'en' | 'es'

const D: Record<string, [string, string, string]> = {
  mapa: ['Mapa', 'Map', 'Mapa'],
  circuito: ['Circuito', 'Circuit', 'Circuito'],
  guerra: ['Guerra', 'War', 'Guerra'],
  divida: ['Dívida', 'Debt', 'Deuda'],
  raio: ['Raio-X', 'X-Ray', 'Rayos-X'],
  plataformas: ['Plataformas', 'Platforms', 'Plataformas'],
  riqueza: ['Riqueza', 'Wealth', 'Riqueza'],
  consequencias: ['Consequências', 'Consequences', 'Consecuencias'],
  alternativas: ['Alternativas', 'Alternatives', 'Alternativas'],
  fontes: ['Fontes', 'Sources', 'Fuentes'],
  glossario: ['Glossário', 'Glossary', 'Glosario'],
  didatico: ['Didático', 'Simple', 'Didáctico'],
  avancado: ['Avançado', 'Advanced', 'Avanzado'],
  simples: ['Simples', 'Basic', 'Fácil'],
  nivelLeitura: ['Nível de leitura', 'Reading level', 'Nivel de lectura'],
  fluxos: ['fluxos', 'flows', 'flujos'],
  copiar: ['copiar link', 'copy link', 'copiar enlace'],
  tour: ['tour guiado', 'guided tour', 'tour guiada'],
  mortes: ['mortes corporativas (10 casos)', 'corporate deaths (10 cases)', 'muertes corporativas (10 casos)'],
  salario: ['salário médio por país', 'average wage by country', 'salario medio por país'],
  apresentacao: ['Modo apresentação: fonte ampliada', 'Presentation mode: larger font', 'Modo presentación: fuente grande'],
  /* ── chrome ampliado (2026-09): o que aparece em toda tela ── */
  idioma: ['Idioma', 'Language', 'Idioma'],
  fechar: ['Fechar', 'Close', 'Cerrar'],
  menu: ['Menu', 'Menu', 'Menú'],
  voltar: ['Voltar', 'Back', 'Volver'],
  continuar: ['Continuar', 'Continue', 'Continuar'],
  proximo: ['Próximo', 'Next', 'Siguiente'],
  anterior: ['Anterior', 'Previous', 'Anterior'],
  terminar: ['Terminar', 'Finish', 'Terminar'],
  sair: ['Sair', 'Exit', 'Salir'],
  carregando: ['Carregando…', 'Loading…', 'Cargando…'],
  erro: ['Algo deu errado', 'Something went wrong', 'Algo salió mal'],
  tentarNovamente: ['Tentar novamente', 'Try again', 'Intentar de nuevo'],
  fonte: ['fonte', 'source', 'fuente'],
  ano: ['ano', 'year', 'año'],
  estimativa: ['estimativa', 'estimate', 'estimación'],
  revisar: ['revisão pendente', 'review pending', 'revisión pendiente'],
  fonteDeclarada: ['fonte declarada', 'source declared', 'fuente declarada'],
  urlInclusa: ['link verificado', 'verified link', 'enlace verificado'],
  busca: ['Buscar', 'Search', 'Buscar'],
  semResultado: ['Nada encontrado', 'Nothing found', 'Nada encontrado'],
  total: ['Total', 'Total', 'Total'],
  mais: ['Mais', 'More', 'Más'],
  menos: ['Menos', 'Less', 'Menos'],
  abrir: ['Abrir', 'Open', 'Abrir'],
  salvar: ['Salvar', 'Save', 'Guardar'],
  cancelar: ['Cancelar', 'Cancel', 'Cancelar'],
  confirmar: ['Confirmar', 'Confirm', 'Confirmar'],
  clicaAviso: ['Clique/toque', 'Click/tap', 'Clic/toca'],
  zoom: ['Zoom', 'Zoom', 'Zoom'],
  mover: ['Mover', 'Pan', 'Mover'],
  camadas: ['Camadas', 'Layers', 'Capas'],
  legenda: ['Legenda', 'Legend', 'Leyenda'],
  guiaRapido: ['guia rápido', 'quick guide', 'guía rápida'],
  lerMais: ['ler mais', 'read more', 'leer más'],
  mostrarMenos: ['mostrar menos', 'show less', 'mostrar menos'],
  aviso: [
    'Protótipo didático. As decomposições, frações e métricas são estimativas pedagógicas — não são estatística oficial nem recomendação de investimento. Consulte as fontes primárias no Módulo 10 antes de usar qualquer número.',
    'Didactic prototype. Decompositions, shares and metrics are pedagogical estimates — not official statistics or investment advice. Check the primary sources in Module 10 before using any figure.',
    'Prototipo didáctico. Las descomposiciones, fracciones y métricas son estimaciones pedagógicas — no son estadística oficial ni recomendación de inversión. Consulta las fuentes primarias en el Módulo 10 antes de usar cualquier cifra.',
  ],
  footer: [
    'Protótipo didático — fundamentado em O Capital (Marx, 1867) e no formato do Anuário ILAESE. Dados de PIB aproximados (FMI); decomposições por frações de capital, métricas empresariais e orçamentárias são estimativas pedagógicas.',
    'Didactic prototype — grounded in Capital (Marx, 1867) and the ILAESE yearbook format. GDP data approximate (IMF); capital-fraction, corporate and budget breakdowns are pedagogical estimates.',
    'Prototipo didáctico — basado en El Capital (Marx, 1867) y el formato del Anuario ILAESE. Datos de PIB aproximados (FMI); las descomposiciones por fracciones son estimaciones pedagógicas.',
  ],
}

export function t(lang: Lang, key: keyof typeof D): string {
  const e = D[key]
  return e ? e[lang === 'pt' ? 0 : lang === 'en' ? 1 : 2] : key
}

/** Cabeçalhos dos módulos trilíngues (kicker + título). Corpo dos textos: PT-BR.
 *
 * O KICKER é derivado de `MODULES` — o número nunca é escrito à mão, então
 * renumerar um módulo é uma edição em `data/modules.ts` só. O TÍTULO é a
 * tradução editorial do nome do módulo (aqui e só aqui). */
const MOD_TITLES: Record<TabId, [string, string, string]> = {
  home: ['O tabuleiro do capitalismo global', 'The global capitalism board', 'El tablero del capitalismo global'],
  globe3d: ['O tabuleiro do capitalismo global', 'The global capitalism board', 'El tablero del capitalismo global'],
  circuit: ['O Circuito do Capital', 'The Circuit of Capital', 'El Circuito del Capital'],
  war: ['Guerra de Capitais & Conflitos Imperialistas', 'War of Capitals & Imperialist Conflicts', 'Guerra de Capitales y Conflictos Imperialistas'],
  debt: ['Morte e Ressurreição do Capital', 'Death and Resurrection of Capital', 'Muerte y Resurrección del Capital'],
  companies: ['Raio-X das Empresas: Exploração & Capital Fictício', 'Corporate X-Ray: Exploitation & Fictitious Capital', 'Radiografía Empresarial: Explotación y Capital Ficticio'],
  platform: ['Indústria 4.0 & Plataformização do Trabalho', 'Industry 4.0 & the Platformization of Work', 'Industria 4.0 y la Plataformización del Trabajo'],
  wealth: ['Quem Sustenta Quê?', 'Who Sustains Whom?', '¿Quién Sostiene a Quién?'],
  consequences: ['Consequências Sistêmicas', 'Systemic Consequences', 'Consecuencias Sistémicas'],
  alternatives: ['E Para Onde Podemos Ir?', 'And Where Can We Go?', '¿Y Hacia Dónde Podemos Ir?'],
  sources: ['Fontes & Referências', 'Sources & References', 'Fuentes y Referencias'],
}

/** Sufixos temáticos do kicker, por aba (traduzidos; o número vem de MODULES). */
const KICKER_SUFFIX: Partial<Record<TabId, [string, string, string]>> = {
  home: ['Home · ', 'Home · ', 'Inicio · '],
  war: [' · War Room', ' · War Room', ' · Sala de Guerra'],
  debt: [' · Moeda × Dívida', ' · Money × Debt', ' · Moneda × Deuda'],
  companies: [' · Raio-X', ' · X-Ray', ' · Radiografía'],
  platform: [' · Plataformização', ' · Platformization', ' · Plataformización'],
  wealth: [' · Trabalho & Concentração', ' · Labor & Concentration', ' · Trabajo y Concentración'],
  consequences: [' · As Mortes do Capitalismo', ' · The Deaths of Capitalism', ' · Las Muertes del Capitalismo'],
  alternatives: [' · O Terceiro Ato', ' · The Third Act', ' · El Tercer Acto'],
  sources: [' · Base documental', ' · Source base', ' · Base documental'],
}

/** Monta o kicker final: ex. "Módulo 04 · Moeda × Dívida" / "Home · Módulo 01". */
function buildKicker(tab: TabId, lang: Lang): string {
  const i = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2
  const { num, shortTitle } = MODULES[tab]
  if (!num) return shortTitle
  const base = lang === 'en' ? `Module ${num}` : `Módulo ${num}`
  const suffix = KICKER_SUFFIX[tab]?.[i] ?? ''
  /* prefixo vem antes do número (só o mapa abre com "Home · "), sufixo depois */
  if (tab === 'home') return `${KICKER_SUFFIX.home![i]}${base}`
  return `${base}${suffix}`
}

export function mt(lang: Lang, tab: string): { kicker: string; title: string } {
  /* `tab` chega de dados externos (?t=) e pode ser inválido — nunca quebrar a UI */
  const key = (tab in MODULES ? tab : 'home') as TabId
  const i = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2
  const titles = MOD_TITLES[key]
  return {
    kicker: buildKicker(key, lang),
    title: titles ? titles[i] : '',
  }
}

/** Reexporta o helper de referência cruzada ("veja o Módulo 04"). */
export { modRef }
