import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const root = process.cwd()
const dist = path.join(root, 'dist')
const assetsDir = path.join(dist, 'assets')

const LIMITS = {
  initialGzip: 128 * 1024,
  entryGzip: 75 * 1024,
  cssGzip: 16 * 1024,
  lazyChunkGzip: 400 * 1024,
  threeControlsGzip: 8 * 1024,
}

const errors = []
const warnings = []

function fail(message) {
  errors.push(message)
}

function gzipSize(file) {
  return zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length
}

function pretty(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`
}

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('ERRO: dist/index.html ausente. Rode npm run build antes deste gate.')
  process.exit(1)
}

const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const entry = (html.match(/<script[^>]+src="([^"]+\.js)"/) || [])[1]
const preloads = [...html.matchAll(/modulepreload[^>]+href="([^"]+\.js)"/g)].map((m) => m[1])
const styles = [...html.matchAll(/stylesheet[^>]+href="([^"]+\.css)"/g)].map((m) => m[1])
const initialRefs = [entry, ...preloads, ...styles].filter(Boolean)

function distPathForRef(ref) {
  const assetIndex = ref.indexOf('/assets/')
  if (assetIndex >= 0) return path.join(dist, ref.slice(assetIndex + 1))
  return path.join(dist, ref.replace(/^\//, ''))
}

const initialFiles = initialRefs.map((ref) => {
  const file = distPathForRef(ref)
  if (!fs.existsSync(file)) {
    fail(`asset inicial não encontrado: ${ref}`)
    return { ref, raw: 0, gzip: 0 }
  }
  return { ref, raw: fs.statSync(file).size, gzip: gzipSize(file) }
})

const initialGzip = initialFiles.reduce((sum, item) => sum + item.gzip, 0)
const entryInfo = initialFiles.find((x) => x.ref === entry)
const cssInfo = initialFiles.filter((x) => x.ref.endsWith('.css'))

if (initialGzip > LIMITS.initialGzip) {
  fail(`bundle inicial: ${pretty(initialGzip)} > ${pretty(LIMITS.initialGzip)}`)
}
if (entryInfo && entryInfo.gzip > LIMITS.entryGzip) {
  fail(`entry JS: ${pretty(entryInfo.gzip)} > ${pretty(LIMITS.entryGzip)}`)
}
for (const css of cssInfo) {
  if (css.gzip > LIMITS.cssGzip) {
    fail(`CSS inicial ${path.basename(css.ref)}: ${pretty(css.gzip)} > ${pretty(LIMITS.cssGzip)}`)
  }
}

const forbiddenInitial = initialRefs.filter((ref) => /vendor-(?:deck|three|duckdb|graph)/.test(ref))
if (forbiddenInitial.length) {
  fail(`vendor pesado no preload inicial: ${forbiddenInitial.join(', ')}`)
}

const assets = fs.readdirSync(assetsDir)
  .filter((name) => /\.(?:js|css)$/.test(name))
  .map((name) => {
    const file = path.join(assetsDir, name)
    return { name, raw: fs.statSync(file).size, gzip: gzipSize(file) }
  })
  .sort((a, b) => b.gzip - a.gzip)

for (const asset of assets) {
  if (asset.gzip > LIMITS.lazyChunkGzip) {
    fail(`chunk ${asset.name}: ${pretty(asset.gzip)} > ${pretty(LIMITS.lazyChunkGzip)}`)
  }
}

const globeAsset = assets.find((x) => /^GlobeModule-.*\.js$/.test(x.name))
if (!globeAsset) {
  fail('chunk GlobeModule não encontrado')
} else {
  const source = fs.readFileSync(path.join(assetsDir, globeAsset.name), 'utf8').slice(0, 16000)
  const forbidden = ['vendor-deck-', 'vendor-graph-', 'vendor-duckdb-'].filter((needle) => source.includes(needle))
  if (forbidden.length) {
    fail(`GlobeModule importa vendor desnecessário: ${forbidden.join(', ')}`)
  }
}

const controls = assets.find((x) => /^vendor-three-controls-.*\.js$/.test(x.name))
if (!controls) {
  warnings.push('vendor-three-controls não encontrado; confirme que OrbitControls continua isolado')
} else if (controls.gzip > LIMITS.threeControlsGzip) {
  fail(`vendor-three-controls: ${pretty(controls.gzip)} > ${pretty(LIMITS.threeControlsGzip)}`)
}

console.log('=== PERFORMANCE BUDGET ===')
console.log(`inicial: ${pretty(initialGzip)} / ${pretty(LIMITS.initialGzip)}`)
for (const item of initialFiles) {
  console.log(`  ${path.basename(item.ref)}: ${pretty(item.gzip)} gzip`)
}
console.log('maiores chunks lazy:')
for (const asset of assets.slice(0, 8)) {
  console.log(`  ${asset.name}: ${pretty(asset.gzip)} gzip`)
}
if (warnings.length) {
  for (const warning of warnings) console.warn(`AVISO: ${warning}`)
}
if (errors.length) {
  for (const error of errors) console.error(`ERRO: ${error}`)
  console.error(`RESULTADO: ${errors.length} falha(s)`)
  process.exit(1)
}
console.log('RESULTADO: dentro do orçamento')
