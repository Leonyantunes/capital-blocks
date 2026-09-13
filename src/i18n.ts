/** i18n LEVE — tradução do CHROME da interface (PT/EN/ES).
 *  O conteúdo dos módulos permanece em PT-BR (tradução integral = próxima fase).
 *  Uso: t(lang, 'chave') — cada entrada é [pt, en, es]. */

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
  fluxos: ['fluxos', 'flows', 'flujos'],
  copiar: ['copiar link', 'copy link', 'copiar enlace'],
  tour: ['tour guiado', 'guided tour', 'tour guiada'],
  mortes: ['mortes corporativas (10 casos)', 'corporate deaths (10 cases)', 'muertes corporativas (10 casos)'],
  salario: ['salário médio por país', 'average wage by country', 'salario medio por país'],
  apresentacao: ['Modo apresentação: fonte ampliada', 'Presentation mode: larger font', 'Modo presentación: fuente grande'],
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

/** Cabeçalhos dos módulos trilíngues (kicker + título). Corpo dos textos: PT-BR (fase editorial). */
export const MOD_META: Record<string, { kicker: [string, string, string]; title: [string, string, string] }> = {
  home: {
    kicker: ['Home · Módulo 01', 'Home · Module 01', 'Inicio · Módulo 01'],
    title: ['O tabuleiro do capitalismo global', 'The global capitalism board', 'El tablero del capitalismo global'],
  },
  circuit: {
    kicker: ['Módulo 02', 'Module 02', 'Módulo 02'],
    title: ['O Circuito do Capital', 'The Circuit of Capital', 'El Circuito del Capital'],
  },
  war: {
    kicker: ['Módulo 03 · War Room', 'Module 03 · War Room', 'Módulo 03 · Sala de Guerra'],
    title: ['Guerra de Capitais & Conflitos Imperialistas', 'War of Capitals & Imperialist Conflicts', 'Guerra de Capitales y Conflictos Imperialistas'],
  },
  debt: {
    kicker: ['Módulo 04 · Moeda × Dívida', 'Module 04 · Money × Debt', 'Módulo 04 · Moneda × Deuda'],
    title: ['Morte e Ressurreição do Capital', 'Death and Resurrection of Capital', 'Muerte y Resurrección del Capital'],
  },
  companies: {
    kicker: ['Módulo 05 · Raio-X', 'Module 05 · X-Ray', 'Módulo 05 · Radiografía'],
    title: ['Raio-X das Empresas: Exploração & Capital Fictício', 'Corporate X-Ray: Exploitation & Fictitious Capital', 'Radiografía Empresarial: Explotación y Capital Ficticio'],
  },
  platform: {
    kicker: ['Módulo 06 · Plataformização', 'Module 06 · Platformization', 'Módulo 06 · Plataformización'],
    title: ['Indústria 4.0 & Plataformização do Trabalho', 'Industry 4.0 & the Platformization of Work', 'Industria 4.0 y la Plataformización del Trabajo'],
  },
  wealth: {
    kicker: ['Módulo 07 · Trabalho & Concentração', 'Module 07 · Labor & Concentration', 'Módulo 07 · Trabajo y Concentración'],
    title: ['Quem Sustenta Quê?', 'Who Sustains Whom?', '¿Quién Sostiene a Quién?'],
  },
  consequences: {
    kicker: ['Módulo 08 · As Mortes do Capitalismo', 'Module 08 · The Deaths of Capitalism', 'Módulo 08 · Las Muertes del Capitalismo'],
    title: ['Consequências Sistêmicas', 'Systemic Consequences', 'Consecuencias Sistémicas'],
  },
  alternatives: {
    kicker: ['Módulo 09 · O Terceiro Ato', 'Module 09 · The Third Act', 'Módulo 09 · El Tercer Acto'],
    title: ['E Para Onde Podemos Ir?', 'And Where Can We Go?', '¿Y Hacia Dónde Podemos Ir?'],
  },
  sources: {
    kicker: ['Módulo 10 · Base documental', 'Module 10 · Source base', 'Módulo 10 · Base documental'],
    title: ['Fontes & Referências', 'Sources & References', 'Fuentes y Referencias'],
  },
}

export function mt(lang: Lang, tab: string): { kicker: string; title: string } {
  const m = MOD_META[tab]
  const i = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2
  return m ? { kicker: m.kicker[i], title: m.title[i] } : { kicker: '', title: '' }
}
