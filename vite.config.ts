import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/esl-grammar-games/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
