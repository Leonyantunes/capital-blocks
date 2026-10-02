/**
 * AUDITORIA DE INTEGRIDADE DOS TOURS
 *
 * Verifica o CONTRATO DE PARADA declarado no cabeçalho de `src/data/tours.ts`:
 * toda parada com assunto específico precisa destacar ALGO (flowId ou isos);
 * coordenadas e zoom precisam ser válidos; flowId precisa existir em flows.ts;
 * finalTab precisa ser uma aba real; textos dual-mode não podem faltar.
 *
 * Lê os .ts como texto (mesma abordagem de flight-test.mjs / framing-test.mjs,
 * que também não usam um compilador) para não depender de build.
 *
 * Rodar: `npm run test:tours`
 */
import { readFileSync } from 'fs'

const tourSrc = readFileSync('src/data/tour.ts', 'utf8')
const toursSrc = readFileSync('src/data/tours.ts', 'utf8')
const flowsSrc = readFileSync('src/data/flows.ts', 'utf8')
const modulesSrc = readFileSync('src/data/modules.ts', 'utf8')

let erros = 0
let avisos = 0
const erro = (m) => { console.log(`  ERRO   ${m}`); erros++ }
const aviso = (m) => { console.log(`  AVISO  ${m}`); avisos++ }
const ok = (m) => console.log(`  ok     ${m}`)

/* ── extração ─────────────────────────────────────────────────────────── */

/** Blocos de objeto `{ ... }` que começam com `id: 'x', chapter:`. */
function paradas(src) {
  const out = []
  const re = /\{\s*\n\s*id:\s*'([a-z0-9-]+)',\s*chapter:/g
  let m
  while ((m = re.exec(src))) {
    /* acha o fechamento contando chaves */
    let i = src.indexOf('{', m.index)
    let depth = 0
    let end = i
    for (; end < src.length; end++) {
      if (src[end] === '{') depth++
      else if (src[end] === '}') {
        depth--
        if (depth === 0) break
      }
    }
    out.push({ id: m[1], body: src.slice(i, end + 1) })
  }
  return out
}

const todasParadas = [...paradas(tourSrc), ...paradas(toursSrc)]

const field = (body, nome) => {
  const m = body.match(new RegExp(`\\b${nome}:\\s*'([^']*)'`))
  return m ? m[1] : null
}
const numField = (body, nome) => {
  const m = body.match(new RegExp(`\\b${nome}:\\s*(-?[\\d.]+)`))
  return m ? Number(m[1]) : null
}
const arrayField = (body, nome) => {
  const m = new RegExp(`\\b${nome}:\\s*\\[`).exec(body)
  if (!m) return null
  const start = body.indexOf('[', m.index)
  let depth = 0
  for (let i = start; i < body.length; i++) {
    if (body[i] === '[') depth++
    else if (body[i] === ']') {
      depth--
      if (depth === 0) return body.slice(start + 1, i)
    }
  }
  return null
}
const has = (body, re) => re.test(body)

const flowIds = new Set(
  [...flowsSrc.matchAll(/^\s{2}\{\s*\n?\s*id:\s*'([a-z0-9-]+)'/gm)].map((m) => m[1]),
)
const abas = new Set(
  [...modulesSrc.matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1]),
)

/* ── 1. estrutura ─────────────────────────────────────────────────────── */
console.log('=== 1. ESTRUTURA DOS TOURS ===')
const tours = [...toursSrc.matchAll(/^\s+id:\s*'([a-z0-9-]+)',\s*$/gm)].map((m) => m[1])
console.log(`  tours: ${tours.length} | paradas: ${todasParadas.length}`)

if (tours.length === 0) erro('nenhum tour encontrado')
const dupTour = tours.filter((t, i) => tours.indexOf(t) !== i)
if (dupTour.length) erro(`tours com id duplicado: ${dupTour.join(', ')}`)
else ok(`${tours.length} tours com id único`)

/* ── 2. contrato de parada ────────────────────────────────────────────── */
console.log('')
console.log('=== 2. CONTRATO DE PARADA ===')
for (const s of todasParadas) {
  const b = s.body
  const flowId = field(b, 'flowId')
  const isosM = b.match(/isos:\s*\[([^\]]*)\]/)
  const isos = isosM ? (isosM[1].match(/'([^']*)'/g) || []).map((x) => x.replace(/'/g, '')) : []
  const lng = numField(b, 'lng')
  const lat = numField(b, 'lat')
  const k = numField(b, 'k')
  const dist = numField(b, 'dist')

  if (!has(b, /titulo:/)) erro(`${s.id}: sem titulo`)
  if (!has(b, /did:/)) erro(`${s.id}: sem texto didático`)
  if (!has(b, /adv:/)) erro(`${s.id}: sem texto avançado`)

  if (lng === null || lat === null) erro(`${s.id}: coordenadas ausentes`)
  else {
    if (lng < -180 || lng > 180) erro(`${s.id}: lng ${lng} fora de [-180,180]`)
    if (lat < -90 || lat > 90) erro(`${s.id}: lat ${lat} fora de [-90,90]`)
  }

  if (k === null) erro(`${s.id}: sem zoom (k)`)
  else if (k <= 0) erro(`${s.id}: zoom k inválido (${k})`)

  /* contrato: assunto específico precisa destacar ALGO.
     Aberturas e fechamentos em visão mundial (capítulo "Abertura"/"Fechamento"
     ou o próprio id terminando em -intro/-fim) são a exceção declarada no
     cabeçalho de tours.ts. Uma `layer` temática TAMBÉM é destaque: ela pinta
     o mapa inteiro (salários, desastres, guerras). */
  const layer = field(b, 'layer')
  const conflict = field(b, 'conflict')
  const ehAberturaFechamento =
    /Abertura|Fechamento|Encerramento/i.test(field(b, 'chapter') ?? '') ||
    /-(intro|fim|abertura|fechamento)$/.test(s.id)

  const temDestaque = !!flowId || isos.length > 0 || !!layer || !!conflict
  if (!temDestaque && !ehAberturaFechamento) {
    erro(`${s.id}: sem flowId, isos, layer ou conflict, e não é abertura/fechamento`)
  } else if (!temDestaque) {
    ok(`${s.id}: abertura/fechamento em visão mundial (sem destaque, permitido)`)
  }
  if (flowId && !flowIds.has(flowId)) erro(`${s.id}: flowId '${flowId}' não existe em flows.ts`)

  for (const iso of isos) {
    if (!/^\d{3}$/.test(iso)) erro(`${s.id}: ISO '${iso}' não é numérico de 3 dígitos`)
  }
  if (dist !== null && dist < 0.2) aviso(`${s.id}: dist ${dist} muito perto do globo`)
  if (dist !== null && dist > 4) aviso(`${s.id}: dist ${dist} muito longe do globo`)
}
if (!erros) ok('todas as paradas respeitam o contrato')

/* ── 3. cobertura: toda parada de tour.ts é usada? ────────────────────── */
/* O tour 'principal' faz `stops: TOUR_STOPS` (o array inteiro), então TODAS as
 * paradas de tour.ts são usadas por ele. Os outros tours declaram as paradas
 * inline e precisam ser conferidas por id. */
console.log('')
console.log('=== 3. COBERTURA ===')
const usaTodasAsParadas = /stops:\s*TOUR_STOPS/.test(toursSrc)
const deTour = new Set(paradas(tourSrc).map((s) => s.id))
const deTours = new Set(paradas(toursSrc).map((s) => s.id))

if (usaTodasAsParadas) {
  ok(`'principal' usa TOUR_STOPS inteiro (${deTour.size} paradas cobertas)`)
} else {
  const huerfanas = [...deTour].filter((id) => !deTours.has(id))
  if (huerfanas.length) {
    erro(`paradas em tour.ts não usadas por nenhum tour: ${huerfanas.length} (${huerfanas.slice(0, 6).join(', ')})`)
  } else {
    ok('toda parada de tour.ts é usada por algum tour')
  }
}

/* referências por id (byId('x')) devem existir em TOUR_STOPS */
for (const m of toursSrc.matchAll(/byId\('([a-z0-9-]+)'\)/g)) {
  if (!deTour.has(m[1])) erro(`byId('${m[1]}') aponta para parada inexistente em tour.ts`)
}

/* ── 4. finalTab e finalLabel ─────────────────────────────────────────── */
/* Os 4 tours de guerra fazem `...WAR_FINAL` (spread), então o finalTab não
 * aparece literalmente — conta os dois formatos. */
console.log('')
console.log('=== 4. SAÍDA DOS TOURS ===')
const finaisLiterais = [...toursSrc.matchAll(/finalTab:\s*'([a-z0-9]+)'/g)]
  /* a linha 58 é a DECLARAÇÃO de WAR_FINAL, não um tour — descarta */
  .filter((m) => !/WAR_FINAL/.test(toursSrc.slice(Math.max(0, m.index - 60), m.index)))
  .map((m) => m[1])
const spreads = (toursSrc.match(/\.\.\.WAR_FINAL/g) || []).length
for (const t of finaisLiterais) {
  if (!abas.has(t)) erro(`finalTab '${t}' não é uma aba válida`)
}
const totalSaidas = finaisLiterais.length + spreads
if (totalSaidas !== tours.length) {
  erro(`${tours.length} tours mas ${totalSaidas} saídas (${finaisLiterais.length} literais + ${spreads} spreads)`)
} else {
  ok(`${totalSaidas}/${tours.length} tours com saída (${finaisLiterais.length} literais + ${spreads} via WAR_FINAL)`)
}
/* finalLabel: 1 na declaração de WAR_FINAL + 4 nos spreads = 5 Declarações
 * para 4 tours, mais 1 do 'mortes' e 1 do 'principal' = 6. Contar pelo total
 * de atribuições diretas + o spread uma vez. */
const labelsDiretos = (toursSrc.match(/finalLabel:/g) || []).length - 1 /* -WAR_FINAL */
if (labelsDiretos < tours.length - spreads) {
  erro(`finalLabel: ${labelsDiretos} diretos + ${spreads} spreads < ${tours.length} tours`)
} else {
  ok(`finalLabel presente em todos (${labelsDiretos} literais + ${spreads} via WAR_FINAL)`)
}

/* ── 5. didStats com valor e rótulo ───────────────────────────────────── */
console.log('')
console.log('=== 5. ESTATÍSTICAS DAS PARADAS (didStats) ===')
let nStats = 0
for (const s of todasParadas) {
  const statsBody = arrayField(s.body, 'didStats')
  if (statsBody === null) continue
  for (const st of statsBody.matchAll(/\{\s*v:\s*'([^']*)'\s*,\s*k:\s*'([^']*)'/g)) {
    nStats++
    if (!st[1].trim()) erro(`${s.id}: didStat sem valor`)
    if (!st[2].trim()) erro(`${s.id}: didStat sem rótulo`)
  }
  /* detecta didStat malformado (sem o par v/k esperado) */
  const abertos = (statsBody.match(/\{/g) || []).length
  const fechados = (statsBody.match(/\}/g) || []).length
  if (abertos !== fechados) erro(`${s.id}: didStats com chaves desbalanceadas`)
}
ok(`${nStats} estatísticas verificadas`)

/* ── 6. números sem unidade aparente ──────────────────────────────────────
 * Só sinaliza o que é REALMENTE suspeito: contagens de mortos ('1.134'),
 * frações ('1/8') e anos ('2020') são legíveis por si — o contexto está no
 * rótulo (didStats.k), que a auditoria de comportamento (tour.test.ts) exige
 * que não seja vazio. Aqui só resta o número solto sem nenhuma pista.      */
console.log('')
console.log('=== 6. NÚMEROS NAS PARADAS ===')
let statsOk = 0
for (const s of todasParadas) {
  const statsBody = arrayField(s.body, 'didStats')
  if (statsBody === null) continue
  for (const st of statsBody.matchAll(/\{\s*v:\s*'([^']*)'\s*,\s*k:\s*'([^']*)'/g)) {
    statsOk++
    const [, v, k] = st
    /* o valor é um número puro E o rótulo é curto/genérico → sem contexto */
    const numeroPuro = /^[\d.,]+$/.test(v)
    const rotuloCurto = k.trim().length <= 2
    if (numeroPuro && rotuloCurto) {
      aviso(`${s.id}: estatística '${v}' com rótulo curto ('${k}') — unidade pode estar ausente`)
    }
  }
}
ok(`${statsOk} estatísticas com valor e rótulo conferidos`)

console.log('')
console.log(`=== RESULTADO: ${erros} erro(s), ${avisos} aviso(s) ===`)
process.exit(erros > 0 ? 1 : 0)
