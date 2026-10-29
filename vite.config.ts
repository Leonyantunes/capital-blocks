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
        /* manualChunks em função (e não objeto) por um motivo específico:
           o helper de preload do Vite é um módulo virtual que o formato-objeto
           não consegue direcionar — sem esta regra, o Rollup o mesclava dentro
           do chunk do deck.gl e o ENTRY passava a importar vendor-deck
           estaticamente (deck.gl baixado/executado no primeiro load, mesmo com
           o modo GPU sendo opcional). Isolá-lo em 'vendor-preload' mantém o
           deck.gl 100% no grafo dinâmico. */
        manualChunks(id) {
          if (id.includes('vite/preload-helper')) return 'vendor-preload'
          if (id.includes('node_modules/framer-motion/')) return 'vendor-motion'
          if (id.includes('node_modules/d3-geo/') || id.includes('node_modules/topojson-client/') || id.includes('world-atlas/')) return 'vendor-geo'
          /* APENAS o core do three (three.module/three.core): o three.webgpu,
             importado por three-render-objects (grafo corporativo), NÃO pode
             entrar aqui — dobraria o chunk baixado pelo globo 3D. */
          if (/node_modules\/three\/build\/three\.(core|module)\.js$/.test(id)) return 'vendor-three'
          /* OrbitControls é usado pelo globo e também por 3d-force-graph. Sem
             regra própria o Rollup o anexava ao vendor-graph, fazendo o globo
             baixar o grafo (e dependências dele) sem usar a feature. */
          if (id.includes('node_modules/three/examples/jsm/controls/OrbitControls.js')) return 'vendor-three-controls'
          if (id.includes('node_modules/cytoscape/') || id.includes('node_modules/3d-force-graph/')) return 'vendor-graph'
          if (id.includes('node_modules/@deck.gl/')) return 'vendor-deck'
          if (id.includes('node_modules/@duckdb/duckdb-wasm/')) return 'vendor-duckdb'
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
  test: {
    environment: 'jsdom',
    fileParallelism: false,
    maxWorkers: 1,
    include: ['src/**/*.test.ts'],
  },
})
