import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    // ÖNEMLİ KISIM BURASI:
    // Eğer 'npm run dev' (serve) yapıyorsan base '/' olsun (Temiz URL)
    // Eğer 'npm run build' yapıyorsan GitHub repo adın olsun
    base: command === 'serve' ? '/' : '/kisisel-web-sitem/',
  }

  return config
})