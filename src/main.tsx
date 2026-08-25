import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/* PWA: service worker apenas em produção (dev usa HMR).
 * Em DEV, remove qualquer SW/cache órfão herdado da origem — evita o caso
 * de um workbox/SW de outro projeto (ou build antigo) responder às navegações
 * com uma página velha e o dev server parecer "não carregar". */
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((rs) => {
    for (const r of rs) r.unregister()
  })
  if ('caches' in window) {
    caches.keys().then((keys) => {
      for (const k of keys) caches.delete(k)
    })
  }
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
