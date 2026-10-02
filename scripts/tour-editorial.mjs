/**
 * AUDITORIA EDITORIAL DOS TOURS
 * Complementa scripts/tour-audit.mjs (que valida a ESTRUTURA).
 * Aqui o foco e a QUALIDADE do texto: progressão didático→avançado,
 * tamanho, pedido de ação, e coerência entre o que o texto afirma e o que
 * a parada destaca no mapa.
 */
import { readFileSync } from 'fs'

const src = readFileSync('src/data/tour.ts', 'utf8') + readFileSync('src/data/tours.ts', 'utf8')
const flowsSrc = readFileSync('src/data/flows.ts', 'utf8')

/* extrai o corpo de cada parada por contagem de chaves */
function blocos() {
  const out = []
  const re = /\{\s*\n\s*id:\s*'([a-z0-9-]+)',\s*chapter:/g
  let m
  while ((m = re.exec(src))) {
    let i = src.indexOf('{', m.index)
    let d = 0
    let e = i
    for (; e < src.length; e++) {
      if (src[e] === '{') d++
      else if (src[e] === '}') { d--; if (d === 0) break }
    }
    out.push({ id: m[1], body: src.slice(i, e + 1) })
  }
  return out
}

/* template literal: `...` sem escape, ou string simples '...' */
function texto(body, campo) {
  const re = new RegExp(`\\b${campo}:\\s*\`([\\s\\S]*?)\``)
  const m = body.match(re)
  if (m) return m[1]
  const re2 = new RegExp(`\\b${campo}:\\s*'([^']*)'`)
  const m2 = body.match(re2)
  return m2 ? m2[1] : null
}

const campo = (b, n) => {
  const simples = b.match(new RegExp(`\\b${n}:\\s*'([^']*)'`))
  if (simples) return simples[1]
  const template = b.match(new RegExp(`\\b${n}:\\s*\`([\\s\\S]*?)\``))
  return template ? template[1] : null
}

const paradas = blocos()
let avisos = 0
let erros = 0
const aviso = (m) => { console.log(`  AVISO  ${m}`); avisos++ }
const erro = (m) => { console.log(`  ERRO   ${m}`); erros++ }
const ok = (m) => console.log(`  ok     ${m}`)

console.log('=== 1. TEXTOS DIDÁTICO E AVANÇADO ===')
let semDid = 0
let semAdv = 0
const curtosDid = []
const curtosAdv = []
for (const p of paradas) {
  const did = texto(p.body, 'did')
  const adv = texto(p.body, 'adv')
  if (!did) { semDid++; erro(`${p.id}: sem texto didático`) }
  if (!adv) { semAdv++; erro(`${p.id}: sem texto avançado`) }
  if (did && did.length < 160) curtosDid.push(`${p.id}(${did.length})`)
  if (adv && adv.length < 110) curtosAdv.push(`${p.id}(${adv.length})`)
}
if (!semDid && !semAdv) ok(`todas as ${paradas.length} paradas têm did e adv`)
if (curtosDid.length) aviso(`did curto (<160): ${curtosDid.join(', ')}`)
if (curtosAdv.length) aviso(`adv curto (<110): ${curtosAdv.join(', ')}`)

console.log('')
console.log('=== 1B. MODO SIMPLES (FUNDAMENTAL / INÍCIO DO MÉDIO) ===')
const semSimples = []
const simplesTecnico = []
const termosSimplesProibidos = [
  'mais-valia', 'capital constante', 'capital variável', 'composição orgânica',
  'superexploração', 'chokepoint', 'clearing', 'default', 'foundry',
  'export controls', 'nearshoring', 'offshore', 'proletariado', 'burguesia',
  'cost-plus', 'GVC', 'TMD', 'financeirização', 'rentismo',
]
for (const p of paradas) {
  const simples = texto(p.body, 'simples')
  if (!simples) {
    semSimples.push(p.id)
    continue
  }
  for (const termo of termosSimplesProibidos) {
    if (simples.toLowerCase().includes(termo.toLowerCase())) simplesTecnico.push(`${p.id}: '${termo}'`)
  }
}
if (semSimples.length) erro(`paradas sem texto simples: ${semSimples.join(', ')}`)
else ok(`todas as ${paradas.length} paradas têm texto simples explícito`)
if (simplesTecnico.length) aviso(`jargão técnico no simples: ${simplesTecnico.join(' | ')}`)
else ok('nenhum jargão técnico bloqueado aparece no texto simples')

console.log('')
console.log('=== 2. PROGRESSÃO DID → ADV ===')
/* O did é prosa para quem não conhece o conceito; o adv usa terminologia
   técnica (GVC, CSB, TMD), que é naturalmente MAIS COMPACTA que a prosa.
   Exigir adv > did em tamanho seria errado: "captura de margem pelo detentor
   da marca/IP" (42 chars) ensina mais que uma frase longa.
   O que medimos de verdade: o adv NÃO pode ser mais curto que o did com
   pouca terminologia — sinal de que o "avançado" só resumiu. */
const semDensidade = []
for (const p of paradas) {
  const did = texto(p.body, 'did')
  const adv = texto(p.body, 'adv')
  if (!did || !adv) continue
  if (adv.length > did.length) continue
  /* conta terminologia técnica no adv. A lista precisa cobrir o vocabulário
     REAL do projeto — uma lista curta acusaria como "sem densidade" textos
     que na verdade usam termos como enclave extrativo, jurisdição-produto,
     hierarquia monetária e chokepoint. */
  const TERMOS = [
    'GVC', 'IP', 'CSB', 'TMD', 'DIT', 'TLC', 'FDI', 'SWIFT', 'OMC', 'CMOC',
    'enclave', 'enclaves', 'jurisdição', 'jurisdições', 'suserania', 'hegemonia',
    'chokepoint', 'alavanca', 'déficit', 'balanço', 'critério', 'excedente',
    'acumulação', 'força de trabalho', 'mais-valia', 'capital variável',
    'capital constante', 'transferência de renda', 'superprodução',
    'financeirização', 'rentismo', 'dependência', 'subordinação',
    'externalização', 'terceirização', 'desindustrialização', 'primarização',
    'industrialização', 'exploração', 'monopólio', 'passivo', 'concentração',
    'especialização', 'hierarquia', 'precificação', 'dolarizada', 'dívida',
    'Pilar', 'canal', 'captura de margem', 'cadeia', 'transnaciona',
    'hedge funds', 'offshore', 'asset', 'mark-to-market', 'fluxo',
    'reprimarização', 'comprim', 'extração', 'extrativ', 'exportador',
    /* vocabulário financeiro e institucional que também é densidade */
    'superávit', 'superávits', 'dívida corporativa', 'duration', 'rendimento',
    'anchor', 'ancora', 'swap', 'liquidação', 'desdolarização', 'CBDC',
    'mBridge', 'ICBC', 'GPIF', 'LuxLeaks', 'ruling', 'rulings', 'fundos',
    'royalties', 'paradiso', 'paraíso', 'juros', 'juros longos', 'renda',
    'rendas', 'remessas', 'diáspora', 'microeconomia', 'contabilidade',
    'déficit comercial', 'balanço', 'ativo', 'passivo', 'burocracia',
  ]
  const termos = TERMOS.filter((t) => adv.toLowerCase().includes(t.toLowerCase())).length
  if (termos < 2) semDensidade.push(`${p.id}(termos:${termos})`)
}
if (semDensidade.length) {
  /* INFORMATIVO, não erro: o dicionário de termos é um proxy imperfeito.
     Um adv curto e correto (ex.: "Macondo: decisões de custo documentadas
     (CSB) + acordo de US$20,8 bi") não cabe em nenhum catálogo. A cobertura
     de `dica` (seção 4) é o sinal editorial que realmente importa. */
  console.log(`  info    ${semDensidade.length} adv mais curtos — revisar à mão:`)
  console.log(`          ${semDensidade.join(', ')}`)
} else {
  ok('todo adv ou é mais longo, ou é mais denso (terminologia técnica)')
}

console.log('')
console.log('=== 3. VOCABULÁRIO MARXISTA SEM EXPLICAÇÃO NO DID ===')
/* termos técnicos que NÃO podem aparecer no did sem serem explicados */
const termos = [
  'mais-valia', 'força de trabalho', 'acumulação primitiva', 'superplus value',
  'M—M', 'M-M', 'capital constante', 'capital variável', 'mercadoria',
  'proletariado', 'mais-valia', 'excedente', 'sociedade do capital',
]
const termoSemContexto = []
for (const p of paradas) {
  const did = texto(p.body, 'did') || ''
  for (const t of termos) {
    if (new RegExp(`\\b${t}\\b`, 'i').test(did)) {
      /* o did precisa explicar — busca sinal de explicação na mesma frase */
      const idx = did.toLowerCase().indexOf(t.toLowerCase())
      const janela = did.slice(Math.max(0, idx - 90), idx + 130)
      const explica =
        /—|=|que (é|era|são|significa)|ou seja|isto é|isto é|quer dizer|\.\.\./.test(janela)
      if (!explica) termoSemContexto.push(`${p.id}: '${t}'`)
    }
  }
}
if (termoSemContexto.length) {
  aviso(`termo técnico no did sem explicação próxima: ${termoSemContexto.slice(0, 6).join(' | ')}`)
} else ok('nenhum termo marxista solto no texto didático')

console.log('')
console.log('=== 4. PEDIDO DE AÇÃO (o tour precisa convidar) ===')
const semAcao = []
for (const p of paradas) {
  const did = texto(p.body, 'did') || ''
  const dica = campo(p.body, 'dica') || ''
  const temAcao = /\b(arraste|clique|toque|veja|observe|compare|perceba|note|arraste|pressione|escolha|puxe)\b/i.test(did) ||
    dica.length > 0
  if (!temAcao) semAcao.push(p.id)
}
if (semAcao.length) aviso(`parada sem ação nem dica: ${semAcao.length} (${semAcao.slice(0, 6).join(', ')})`)
else ok('toda parada tem ação ou dica')

console.log('')
console.log('=== 5. NÚMERO NO TEXTO vs DESTACAQUE ===')
/* se o texto cita um país/rota, a parada deveria destacá-lo */
const citePaisSemDestacar = []
for (const p of paradas) {
  const did = texto(p.body, 'did') || ''
  const temFlow = !!campo(p.body, 'flowId')
  const temIsos = /\bisos:\s*\[/.test(p.body)
  const temLayer = !!campo(p.body, 'layer')
  const mencaoPais = /(Brasil|Estados Unidos|China|India|Japão|Alemanha|Rússia|China|Taiwan|Coreia|Vietnã|México|Argentina|Chile|Peru|Colômbia|África|Nigéria|Indonésia|Ucrânia|Irã|Saudi|Emirados|Turquia|França|Itália|Espanha|Portugal|Polônia|Israel|Iraque|Argélia|Marro|Angola|Egito)/.test(did)
  if (mencaoPais && !temFlow && !temIsos && !temLayer) citePaisSemDestacar.push(p.id)
}
if (citePaisSemDestacar.length) {
  aviso(`fala de país/rota mas não destaca nada: ${citePaisSemDestacar.length} (${citePaisSemDestacar.slice(0, 5).join(', ')})`)
} else ok('toda menção a país vem acompanhada de destaque no mapa')

console.log('')
console.log('=== 6. DIDSTATS: CONTEXTO POR NÚMERO ===')
let statSemContexto = 0
for (const p of paradas) {
  const m = p.body.match(/didStats:\s*\[([\s\S]*?)\]/)
  if (!m) continue
  for (const st of m[1].matchAll(/\{\s*v:\s*'([^']*)'\s*,\s*k:\s*'([^']*)'/g)) {
    const [, v, k] = st
    /* um número puro (ex.: '28') precisa de rótulo descritivo (ex.: 'paradas') */
    const numeroPuro = /^[\d.,]+$/.test(v)
    if (numeroPuro && k.trim().length <= 4) statSemContexto++
  }
}
if (statSemContexto) aviso(`${statSemContexto} estatística(s) numérica(s) com rótulo vago`)
else ok('toda estatística numérica tem rótulo descritivo')

console.log('')
console.log(`=== RESULTADO: ${erros} erro(s), ${avisos} aviso(s) ===`)
process.exit(erros > 0 ? 1 : 0)
