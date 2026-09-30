import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { localWaitlistPlugin } from './server/waitlist.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), localWaitlistPlugin()],
  base: './',
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  server: { port: 4310, strictPort: true },
})
