/* Capital Blocks — service worker v3
 *
 * Estratégia:
 * • navegações (HTML): NETWORK-FIRST com fallback ao cache — um deploy novo
 *   NUNCA fica preso ao index.html antigo (era isso que causava app "travado").
 * • /assets/* (nomes com hash, imutáveis): cache-first — instantâneo e offline.
 * • demais GET same-origin (manifest, ícone): cache-first com atualização em fundo.
 */
const CACHE = 'cb-v3'
/* BASE derivado da localização do PRÓPRIO sw.js (o Vite não reescreve arquivos
 * de public/): funciona tanto na raiz do domínio quanto em deploy de subpath
 * (GitHub Pages /repo/) — caminhos absolutos ('/', '/index.html') quebrariam
 * o subpath apontando para a raiz do domínio. */
const BASE = new URL('./', self.location)
const SHELL = [
  BASE.href,
  new URL('index.html', BASE).href,
  new URL('manifest.webmanifest', BASE).href,
  new URL('icon.svg', BASE).href,
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return

  /* navegação: rede primeiro, cache como fallback offline */
  if (req.mode === 'navigate') {
    const INDEX_URL = new URL('index.html', BASE).href
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(INDEX_URL, copy))
          return res
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match(INDEX_URL)),
        ),
    )
    return
  }

  const url = new URL(req.url)
  const immutable = url.pathname.startsWith(BASE.pathname + 'assets/')

  if (immutable) {
    /* asset com hash: imutável → cache-first puro */
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
            return res
          }),
      ),
    )
    return
  }

  /* outros GET: cache-first + revalidação em fundo (stale-while-revalidate) */
  event.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
          return res
        })
        .catch(() => hit)
      return hit || net
    }),
  )
})
