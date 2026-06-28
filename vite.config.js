import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Digit-flow-pro3.0/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
