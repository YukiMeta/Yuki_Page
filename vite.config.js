import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    entries: ['index.html']
  },
  build: {
    outDir: 'dist',
    minify: false
  }
})
