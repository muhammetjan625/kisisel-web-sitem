import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // GitHub'a yüklerken repo adını kullan, localde çalışırken '/' kullan
    base: command === 'serve' ? '/' : '/kisisel-web-sitem/',
  }
})