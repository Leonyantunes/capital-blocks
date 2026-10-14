import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { SOURCES } from '../src/data/sources'
import { COMPANIES_ALL } from '../src/data/companies'
import { THEORY_TOPICS } from '../src/data/theory'

type TargetLang = 'en' | 'es'

const SEP = '<<<CBSEP>>>'
const outputPath = path.join(process.cwd(), 'src', 'data', 'generatedTranslations.ts')

const MANUAL_TRANSLATIONS: Record<string, readonly [en: string, es: string]> = {
  'Dívida pública': ['Public debt', 'Deuda pública'],
  '“O Estado deve gastar como uma família: primeiro arrecadar, depois gastar. Dívida alta é fardo para os netos e acima de certo % do PIB vira calote iminente — cortar gastos demonstra responsabilidade.”': [
    '“The state must spend like a household: collect revenue first, then spend. High debt is a burden on future generations, and above a certain share of GDP default becomes imminent — cutting spending demonstrates responsibility.”',
    '“El Estado debe gastar como una familia: primero recaudar y después gastar. Una deuda alta es una carga para las generaciones futuras y, por encima de cierto porcentaje del PIB, el impago se vuelve inminente — recortar el gasto demuestra responsabilidad.”',
  ],
  'Premissa contestada: trata o emissor da moeda como usuário dela. Japão (~230–250% do PIB) refuta o “teto”; austeridade encolhe o PIB (denominador) e piora a própria razão.': [
    'Contested premise: it treats the currency issuer as if it were merely a user of the currency. Japan (~230–250% of GDP) contradicts the supposed “ceiling”; austerity shrinks GDP (the denominator) and can worsen the ratio itself.',
    'Premisa cuestionada: trata al emisor de la moneda como si fuera un simple usuario de ella. Japón (~230–250% del PIB) contradice el supuesto “techo”; la austeridad reduce el PIB (el denominador) y puede empeorar la propia relación.',
  ],
  'Emissor soberano paga sempre seus títulos na própria moeda: a dívida é o ativo financeiro líquido do setor privado, e seu limite é inflação/recursos reais — nunca “falta de dinheiro”. Quem detém os títulos (rentistas) captura os juros: leitura marxista do MESMO fato.': [
    'A sovereign currency issuer can always service securities denominated in its own currency: public debt is a net financial asset of the private sector, and its constraint is inflation/real resources — never a literal “lack of money”. Bondholders (rentiers) capture the interest: a Marxist reading of the SAME fact.',
    'Un emisor soberano puede pagar siempre los títulos denominados en su propia moneda: la deuda pública es un activo financiero neto del sector privado y su límite es la inflación/los recursos reales — nunca una “falta de dinero” literal. Quienes poseen los títulos (rentistas) capturan los intereses: una lectura marxista del MISMO hecho.',
  ],
  'MMT: Mosler, Wray, Kelton · Marx: capital fictício/portador de juros · Kalecki: déficit sustenta lucros': [
    'MMT: Mosler, Wray, Kelton · Marx: fictitious/interest-bearing capital · Kalecki: deficits sustain profits',
    'MMT: Mosler, Wray, Kelton · Marx: capital ficticio/portador de interés · Kalecki: el déficit sostiene los beneficios',
  ],
  'Câmbio do Sul Global': ['Global South exchange rate', 'Tipo de cambio del Sur Global'],
  '“Câmbio flutuante se ajusta sozinho às forças de mercado e equilibra o comércio; intervenção só gera distorção.”': [
    '“A floating exchange rate adjusts on its own to market forces and balances trade; intervention only creates distortions.”',
    '“Un tipo de cambio flotante se ajusta por sí solo a las fuerzas del mercado y equilibra el comercio; la intervención solo genera distorsiones.”',
  ],
  'Premissa contestada: fluxos financeiros dominam o comércio — ciclos de juros do centro e fuga de capitais produzem sobrevalorizações/colapsos, nada de “ajuste suave”.': [
    'Contested premise: financial flows can dominate trade — core-country interest-rate cycles and capital flight produce overvaluations and crashes, not a “smooth adjustment”.',
    'Premisa cuestionada: los flujos financieros pueden dominar el comercio — los ciclos de tipos de interés del centro y la fuga de capitales producen sobrevaloraciones y colapsos, no un “ajuste suave”.',
  ],
  'Câmbio periférico é estruturalmente volátil e tende ao rebaixamento: desvalorização barateia exportações E salários (superexploração via câmbio), facilita aquisições estrangeiras e encarece tecnologia — mecanismo de dependência, não acidente.': [
    'Peripheral exchange rates are structurally volatile and tend toward depreciation: devaluation cheapens exports AND wages (super-exploitation through the exchange rate), facilitates foreign acquisitions, and makes technology more expensive — a dependency mechanism, not an accident.',
    'Los tipos de cambio periféricos son estructuralmente volátiles y tienden a depreciarse: la devaluación abarata las exportaciones Y los salarios (superexplotación vía tipo de cambio), facilita adquisiciones extranjeras y encarece la tecnología — un mecanismo de dependencia, no un accidente.',
  ],
  'Marini (superexploração) · Tavares/Serra (ciclos) · Keynes (controle de capitais)': [
    'Marini (super-exploitation) · Tavares/Serra (cycles) · Keynes (capital controls)',
    'Marini (superexplotación) · Tavares/Serra (ciclos) · Keynes (controles de capital)',
  ],
  'Comércio exterior': ['Foreign trade', 'Comercio exterior'],
  '“Livre comércio beneficia todos: cada país explora suas vantagens comparativas e todos ganham.”': [
    '“Free trade benefits everyone: each country exploits its comparative advantages and everyone gains.”',
    '“El libre comercio beneficia a todos: cada país aprovecha sus ventajas comparativas y todos ganan.”',
  ],
  'Premissa contestada: vantagem comparativa é fotografia estática; especialização primária trava trajetória tecnológica e perpetua a hierarquia (evidência: desindustrialização brasileira 27%→11%).': [
    'Contested premise: comparative advantage is a static snapshot; primary-specialization can lock in a technological trajectory and perpetuate hierarchy (evidence: Brazilian deindustrialization from 27% to 11%).',
    'Premisa cuestionada: la ventaja comparativa es una fotografía estática; la especialización primaria puede bloquear la trayectoria tecnológica y perpetuar la jerarquía (evidencia: desindustrialización brasileña del 27% al 11%).',
  ],
  'Troca desigual: o intercâmbio Centro–Sul transfere trabalho incorporado do Sul ao Norte; a superexploração local compensa a perda e financia o consumo/financeirização imperialistas.': [
    'Unequal exchange: Center–South trade transfers embodied labor from the South to the North; local super-exploitation compensates for the loss and finances imperialist consumption/financialization.',
    'Intercambio desigual: el comercio Centro–Sur transfiere trabajo incorporado del Sur al Norte; la superexplotación local compensa la pérdida y financia el consumo/la financiarización imperialistas.',
  ],
  'Prebisch–Singer · Marini · dos Santos · Emmanuel (troca desigual)': [
    'Prebisch–Singer · Marini · dos Santos · Emmanuel (unequal exchange)',
    'Prebisch–Singer · Marini · dos Santos · Emmanuel (intercambio desigual)',
  ],
}

const values = new Set<string>()
const add = (value?: string) => {
  const text = value?.trim()
  if (text && /[A-Za-zÀ-ÿ]/.test(text)) values.add(text)
}

for (const source of SOURCES) {
  add(source.nome)
  add(source.instituicao)
  add(source.ano)
  add(source.resumoDidatico)
  add(source.resumoAvancado)
  add(source.observacao)
  source.cobre.forEach(add)
  source.urls.forEach((url) => add(url.rotulo))
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

const input = [...values]

async function translateBatch(batch: string[], target: TargetLang): Promise<string[]> {
  const params = new URLSearchParams({
    client: 'gtx', sl: 'pt', tl: target, dt: 't', q: batch.join(`\n${SEP}\n`),
  })
  const res = await fetch('https://translate.googleapis.com/translate_a/single', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: params,
  })
  if (!res.ok) throw new Error(`translation ${target}: HTTP ${res.status}`)
  const json = await res.json() as [Array<[string]>]
  const joined = json[0].map((part) => part[0]).join('').replace(/\r/g, '')
  const translated = joined.split(new RegExp(`\\n?${SEP}\\n?`, 'g')).map((s) => s.trim())
  if (translated.length !== batch.length) {
    throw new Error(`translation ${target}: expected ${batch.length} segments, got ${translated.length}`)
  }
  return translated
}

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  let current: T[] = []
  let chars = 0
  for (const item of items) {
    const len = String(item).length
    if (current.length && (current.length >= size || chars + len > 7000)) {
      out.push(current); current = []; chars = 0
    }
    current.push(item); chars += len
  }
  if (current.length) out.push(current)
  return out
}

async function translateAll(items: string[], target: TargetLang): Promise<string[]> {
  const batches = chunks(items, 12)
  const results = new Array<string[]>(batches.length)
  let cursor = 0
  const workers = Array.from({ length: 1 }, async () => {
    while (true) {
      const index = cursor++
      if (index >= batches.length) return
      let lastError: unknown
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          results[index] = await translateBatch(batches[index], target)
          lastError = undefined
          break
        } catch (error) {
          lastError = error
          await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)))
        }
      }
      if (lastError) throw lastError
    }
  })
  await Promise.all(workers)
  return results.flat()
}

const cache = new Map<string, readonly [string, string]>()
try {
  const previous = await fs.readFile(outputPath, 'utf8')
  const rowRe = /^\s*("(?:\\.|[^"\\])*"):\s*\[("(?:\\.|[^"\\])*")\s*,\s*("(?:\\.|[^"\\])*")\],$/gm
  for (const match of previous.matchAll(rowRe)) {
    cache.set(JSON.parse(match[1]), [JSON.parse(match[2]), JSON.parse(match[3])])
  }
} catch {
  // Primeira geração: cache vazio.
}

for (const [pt, translations] of Object.entries(MANUAL_TRANSLATIONS)) {
  cache.set(pt, translations)
}

const missing = input.filter((text) => !cache.has(text))
console.log(`Translation keys: ${input.length}; cached: ${input.length - missing.length}; missing: ${missing.length}`)
if (missing.length) {
  const en = await translateAll(missing, 'en')
  const es = await translateAll(missing, 'es')
  missing.forEach((pt, i) => cache.set(pt, [en[i], es[i]]))
}

const rows = input.map((pt) => {
  const translated = cache.get(pt)
  if (!translated) throw new Error(`missing cached translation: ${pt.slice(0, 80)}`)
  return `  ${JSON.stringify(pt)}: [${JSON.stringify(translated[0])}, ${JSON.stringify(translated[1])}],`
})

const output = `/**\n * AUTO-GENERATED static EN/ES translations for long-form source/company metadata.\n * Source: scripts/generate-content-i18n.ts. Runtime performs no network requests.\n */\n\nimport type { Lang } from '../i18n'\n\nconst GENERATED_TRANSLATIONS: Record<string, readonly [en: string, es: string]> = {\n${rows.join('\n')}\n}\n\nexport function generatedText(lang: Lang, value?: string): string {\n  if (!value || lang === 'pt') return value ?? ''\n  const translated = GENERATED_TRANSLATIONS[value]\n  if (!translated) return value\n  return translated[lang === 'en' ? 0 : 1]\n}\n\nexport const GENERATED_TRANSLATION_COUNT = ${input.length}\n`

await fs.writeFile(outputPath, output, 'utf8')
console.log(`Wrote ${input.length} translation keys to ${path.relative(process.cwd(), outputPath)}`)
