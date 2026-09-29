import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * VITE_BASE: prefixo de path quando hospedado em subpasta
 * (ex.: GitHub Pages de projeto → https://user.github.io/repo/).
 * O workflow de deploy define isso automaticamente; local usa '/'.
 *
 * `defineConfig` vem de `vitest/config` (e não de `vite`) para que a chave
 * `test` abaixo seja tipada; em tempo de build o Vite lê o mesmo arquivo.
 */
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-motion': ['framer-motion'],
          'vendor-geo': ['d3-geo', 'topojson-client', 'world-atlas/countries-110m.json'],
          'vendor-three': ['three'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
