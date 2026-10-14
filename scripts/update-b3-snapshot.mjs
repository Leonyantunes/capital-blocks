import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const sourceUrl = 'https://brapi.dev/api/quote/list?limit=2000'
const companiesPath = path.join(root, 'src', 'data', 'companies.ts')
const universePath = path.join(root, 'src', 'lib', 'marketApi', 'universe.ts')
const outputPath = path.join(root, 'src', 'data', 'b3Snapshot.ts')

const [companiesSource, universeSource] = await Promise.all([
  fs.readFile(companiesPath, 'utf8'),
  fs.readFile(universePath, 'utf8'),
])

const tickerRe = /ticker:\s*'([A-Z0-9]+)'/g
const curatedTickers = new Set()
for (const source of [companiesSource, universeSource]) {
  for (const match of source.matchAll(tickerRe)) curatedTickers.add(match[1])
}

const issuerNameRe = /nome:\s*'([^']+)'/g
const curatedNames = Array.from(companiesSource.matchAll(issuerNameRe), (match) => match[1])
const legalStopwords = new Set([
  'sa', 'cia', 'companhia', 'bco', 'banco', 'holding', 'holdings', 'participacao',
  'participacoes', 'participation', 'participations', 'grupo', 'group', 'inc', 'corp',
  'corporation', 'ltda', 'limited', 'plc', 'nv',
])
const issuerTokens = (value) => value
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/)
  .filter((token) => token && !legalStopwords.has(token))
const sameIssuer = (a, b) => {
  const aa = issuerTokens(a)
  const bb = issuerTokens(b)
  if (!aa.length || !bb.length) return false
  const [small, large] = aa.length <= bb.length ? [aa, bb] : [bb, aa]
  if (!small.some((token) => token.length >= 4)) return false
  const bag = new Set(large)
  return small.every((token) => bag.has(token))
}

const res = await fetch(sourceUrl, { headers: { accept: 'application/json' } })
if (!res.ok) throw new Error(`BRAPI snapshot failed: HTTP ${res.status}`)
const body = await res.json()
const stocks = Array.isArray(body?.stocks) ? body.stocks : []

const groups = new Map()
for (const raw of stocks) {
  if (raw?.type !== 'stock') continue
  const ticker = String(raw.stock ?? '').trim().toUpperCase()
  const nome = String(raw.name ?? '').trim()
  const marketCap = Number(raw.market_cap)
  if (!ticker || !nome || !Number.isFinite(marketCap) || marketCap <= 0) continue
  const key = nome.toLocaleUpperCase('pt-BR')
  const item = {
    ticker,
    nome,
    setor: String(raw.subsector || raw.sector || 'Outros').trim(),
    marketCapBi: marketCap / 1e9,
    volume: Number(raw.volume) || 0,
  }
  const list = groups.get(key) ?? []
  list.push(item)
  groups.set(key, list)
}

const snapshot = []
for (const list of groups.values()) {
  // If any share class is already curated in the app, skip the whole issuer.
  if (list.some((item) => curatedTickers.has(item.ticker))) continue
  if (list.some((item) => curatedNames.some((name) => sameIssuer(item.nome, name)))) continue
  list.sort((a, b) => (b.volume - a.volume) || (b.marketCapBi - a.marketCapBi))
  snapshot.push(list[0])
}

snapshot.sort((a, b) => b.marketCapBi - a.marketCapBi)

const snapshotDate = process.env.CB_B3_SNAPSHOT_DATE || new Date().toISOString().slice(0, 10)
const rows = snapshot.map((item) =>
  `  { ticker: ${JSON.stringify(item.ticker)}, nome: ${JSON.stringify(item.nome)}, setor: ${JSON.stringify(item.setor)}, marketCapBi: ${item.marketCapBi.toFixed(6)} },`,
)

const output = `/**\n * Snapshot público do catálogo de ações da B3 via BRAPI.\n * Gerado por scripts/update-b3-snapshot.mjs em ${snapshotDate}.\n *\n * Apenas campos públicos do catálogo são persistidos aqui. Receita, lucro,\n * folha e headcount dos registros suplementares são estimativas pedagógicas\n * calculadas em runtime e recebem badge est. no Raio-X.\n */\n\nexport interface B3PublicSnapshotEntry {\n  ticker: string\n  nome: string\n  setor: string\n  /** capitalização de mercado em R$ bilhões na data do snapshot */\n  marketCapBi: number\n}\n\nexport const B3_SNAPSHOT_DATE = ${JSON.stringify(snapshotDate)}\nexport const B3_SNAPSHOT_SOURCE = ${JSON.stringify(sourceUrl)}\n\nexport const B3_PUBLIC_SNAPSHOT: B3PublicSnapshotEntry[] = [\n${rows.join('\n')}\n]\n`

await fs.writeFile(outputPath, output, 'utf8')
console.log(`Wrote ${snapshot.length} B3 issuers to ${path.relative(root, outputPath)} (${snapshotDate})`)
