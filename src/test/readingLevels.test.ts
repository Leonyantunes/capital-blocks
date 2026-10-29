import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { COMPANIES_ALL } from '../data/companies'
import { EPISODES } from '../data/consequences'
import { consequenceDeepSimple, consequenceMechanismSimple, consequenceSimpleCoverage } from '../data/consequenceSimple'
import { hasGeneratedTranslation } from '../data/generatedTranslations'
import { glossaryForLang } from '../data/glossary'
import { glossarySimpleForLang } from '../data/glossarySimple'
import { INDICATORS, indicatorSimpleForLang } from '../data/indicators'
import { SOURCES } from '../data/sources'
import { THEORY_TOPICS } from '../data/theory'
import { TOURES, toursForLang } from '../data/tours'
import { TOUR_STOPS } from '../data/tour'
import { FLOWS, flowForLang, flowSimpleForLang } from '../data/flows'

const LANGS = ['pt', 'en', 'es'] as const

function statSignature(stop: { didStats: { v: string; sourceIds: string[] }[] }) {
  return stop.didStats.map((s) => ({ v: s.v, sourceIds: [...s.sourceIds] }))
}

const SIMPLE_BLOCKED: Record<(typeof LANGS)[number], RegExp[]> = {
  pt: [
    /\bmais-valia\b/i, /\bcapital constante\b/i, /\bcapital vari[aá]vel\b/i,
    /\bcomposi[cç][aã]o org[aâ]nica\b/i, /\bsuperexplora[cç][aã]o\b/i,
    /\bchokepoint\b/i, /\bGVC\b/, /\bcost-plus\b/i,
  ],
  en: [
    /\bsurplus value\b/i, /\bconstant capital\b/i, /\bvariable capital\b/i,
    /\borganic composition\b/i, /\bsuper-exploitation\b/i,
    /\bchokepoint\b/i, /\bGVC\b/, /\bcost-plus\b/i,
  ],
  es: [
    /\bplusval[ií]a\b/i, /\bcapital constante\b/i, /\bcapital variable\b/i,
    /\bcomposici[oó]n org[aá]nica\b/i, /\bsuperexplotaci[oó]n\b/i,
    /\bchokepoint\b/i, /\bGVC\b/, /\bcost-plus\b/i,
  ],
}

const SIMPLE_FORMULAS = [
  /\b[cvmkeg]\s*=\s*/i,
  /\b[cvmkeg]\s*\/\s*[cvmkeg(]/i,
  /[∂≡]/,
  /\bM\s*[—-]\s*M[′']/,
]

describe('contrato estrito dos níveis de leitura', () => {
  it('todas as paradas canônicas têm simples, didático e avançado explícitos', () => {
    for (const stop of TOUR_STOPS) {
      expect(stop.simples.trim().length, stop.id).toBeGreaterThan(0)
      expect(stop.did.trim().length, stop.id).toBeGreaterThan(0)
      expect(stop.adv.trim().length, stop.id).toBeGreaterThan(0)
    }
    for (const tour of TOURES) {
      for (const stop of tour.stops) {
        expect(stop.simples.trim().length, `${tour.id}/${stop.id}`).toBeGreaterThan(0)
        expect(stop.did.trim().length, `${tour.id}/${stop.id}`).toBeGreaterThan(0)
        expect(stop.adv.trim().length, `${tour.id}/${stop.id}`).toBeGreaterThan(0)
      }
    }
  })

  it('EN/ES cobrem todos os tours e preservam ids, geometria, valores e sourceIds', () => {
    for (const lang of ['en', 'es'] as const) {
      const localized = toursForLang(lang)
      expect(localized).toHaveLength(TOURES.length)
      for (let ti = 0; ti < TOURES.length; ti++) {
        const baseTour = TOURES[ti]
        const trTour = localized[ti]
        expect(trTour.id).toBe(baseTour.id)
        expect(trTour.titulo.trim().length).toBeGreaterThan(0)
        expect(trTour.descricao.trim().length).toBeGreaterThan(0)
        expect(trTour.stops).toHaveLength(baseTour.stops.length)
        for (let si = 0; si < baseTour.stops.length; si++) {
          const base = baseTour.stops[si]
          const tr = trTour.stops[si]
          expect(tr.id).toBe(base.id)
          expect([tr.lng, tr.lat, tr.k, tr.dist, tr.flowId, tr.layer, tr.conflict, tr.isos]).toEqual(
            [base.lng, base.lat, base.k, base.dist, base.flowId, base.layer, base.conflict, base.isos],
          )
          expect(statSignature(tr)).toEqual(statSignature(base))
          expect(tr.simples.trim().length).toBeGreaterThan(0)
          expect(tr.did.trim().length).toBeGreaterThan(0)
          expect(tr.adv.trim().length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('o texto simples dos tours não contém fórmulas nem jargão bloqueado', () => {
    for (const lang of LANGS) {
      const tours = lang === 'pt' ? TOURES : toursForLang(lang)
      for (const tour of tours) {
        for (const stop of tour.stops) {
          for (const re of SIMPLE_BLOCKED[lang]) {
            expect(re.test(stop.simples), `${lang}/${tour.id}/${stop.id}: ${re}`).toBe(false)
          }
          for (const re of SIMPLE_FORMULAS) {
            expect(re.test(stop.simples), `${lang}/${tour.id}/${stop.id}: fórmula ${re}`).toBe(false)
          }
        }
      }
    }
  })

  it('helpers de Simples têm cobertura trilíngue para glossário, indicadores e rotas', () => {
    for (const lang of LANGS) {
      for (const term of glossaryForLang(lang)) {
        expect(glossarySimpleForLang(term.id, lang).trim().length, `${lang}/glossary/${term.id}`).toBeGreaterThan(0)
      }
      for (const indicator of INDICATORS) {
        expect(indicatorSimpleForLang(indicator, lang).trim().length, `${lang}/indicator/${indicator.id}`).toBeGreaterThan(0)
      }
      for (const flow of FLOWS) {
        const localized = flowForLang(flow, lang)
        const simple = flowSimpleForLang(localized, lang)
        expect(simple.trim().length, `${lang}/flow/${flow.id}`).toBeGreaterThan(0)
        expect(simple, `${lang}/flow/${flow.id}: total anual ausente`).toContain(localized.totalAnual)
      }
    }
  })

  it('Consequências tem Simples editorial explícito para 43 mecanismos e 8 fechamentos', () => {
    const coverage = consequenceSimpleCoverage()
    expect(Object.keys(coverage).sort()).toEqual(EPISODES.map((ep) => ep.id).sort())
    expect(Object.values(coverage).reduce((sum, n) => sum + n, 0)).toBe(43)
    for (const ep of EPISODES) {
      expect(coverage[ep.id], ep.id).toBe(ep.mecanismos.length)
      for (const lang of LANGS) {
        expect(consequenceDeepSimple(ep.id, lang).trim().length, `${ep.id}/deep/${lang}`).toBeGreaterThan(20)
        ep.mecanismos.forEach((_, i) => {
          expect(consequenceMechanismSimple(ep.id, i, lang).trim().length, `${ep.id}/${i}/${lang}`).toBeGreaterThan(20)
        })
      }
    }
  })

  it('quizzes preservam resposta factual e têm cópia própria em Simples/Didático/Avançado', () => {
    for (const tour of TOURES) {
      for (const stop of tour.stops) {
        if (!stop.quiz) continue
        const q = stop.quiz
        expect(q.simples.pergunta.every((x) => x.trim().length > 0), `${tour.id}/${stop.id}/quiz simples`).toBe(true)
        expect(q.avancado.pergunta.every((x) => x.trim().length > 0), `${tour.id}/${stop.id}/quiz avançado`).toBe(true)
        expect(q.simples.opcoes).toHaveLength(q.opcoes.length)
        expect(q.avancado.opcoes).toHaveLength(q.opcoes.length)
        expect(q.correta).toBeGreaterThanOrEqual(0)
        expect(q.correta).toBeLessThan(q.opcoes.length)
      }
    }
  })

  it('componentes não importam o resolver/simplificador legado de nível', () => {
    const root = join(process.cwd(), 'src', 'components')
    const files: string[] = []
    const visit = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const file = join(dir, name)
        if (statSync(file).isDirectory()) visit(file)
        else if (/\.(ts|tsx)$/.test(name)) files.push(file)
      }
    }
    visit(root)
    const offenders = files.filter((file) => {
      const src = readFileSync(file, 'utf8')
      return /import\s*\{[^}]*\b(?:resolve|simplificarTexto)\b[^}]*\}\s*from\s*['"][^'"]*lib\/simples['"]/.test(src)
    })
    expect(offenders.map((x) => x.replace(process.cwd(), ''))).toEqual([])
  })
})

describe('cobertura estrita de traduções geradas', () => {
  const required = new Set<string>()
  const add = (v?: string) => {
    const text = v?.trim()
    if (text && /[A-Za-zÀ-ž]/.test(text)) required.add(text)
  }

  for (const source of SOURCES) {
    add(source.nome)
    add(source.instituicao)
    add(source.ano)
    add(source.resumoDidatico)
    add(source.resumoAvancado)
    add(source.observacao)
    source.cobre.forEach(add)
    source.urls.forEach((u) => add(u.rotulo))
  }
  for (const company of COMPANIES_ALL) {
    add(company.pais)
    add(company.setor)
    add(company.fonte)
    add(company.nota)
  }
  for (const topic of THEORY_TOPICS) {
    add(topic.titulo)
    add(topic.ortodoxa.tese)
    add(topic.ortodoxa.contra)
    add(topic.heterodoxa.tese)
    add(topic.heterodoxa.autores)
  }

  it('toda string dinâmica usada por EN/ES possui entrada no catálogo estático', () => {
    const missing = [...required].filter((value) => !hasGeneratedTranslation(value))
    expect(missing, `Traduções ausentes:\n${missing.join('\n')}`).toEqual([])
  })
})
