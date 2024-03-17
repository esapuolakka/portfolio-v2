import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    base: '/',
    plugins: [react()],
  }

  if (command !== 'serve') {
    config.base = '/portfolio-v2/'
  }
  return config;
})
