import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * VITE_BASE: prefixo de path quando hospedado em subpasta
 * (ex.: GitHub Pages de projeto → https://user.github.io/repo/).
 * O workflow de deploy define isso automaticamente; local usa '/'.
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
        },
      },
    },
  },
})
