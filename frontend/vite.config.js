import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // ─────────────────────────────────────────────────────────────────────
      // Proxy /predict & /ocr ke Flask backend (localhost:5000)
      // sehingga tidak ada CORS issue saat development.
      // Afin: pastikan Flask berjalan di port 5000 sebelum menjalankan frontend.
      // ─────────────────────────────────────────────────────────────────────
      '/predict': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/ocr': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})
