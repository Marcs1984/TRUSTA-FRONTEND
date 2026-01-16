import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // listen on 0.0.0.0 so localhost/127.0.0.1 both work
    port: 5173,
    strictPort: true, // fail if 5173 is taken (don’t silently change)
    open: '/',        // open root; SPA router will handle deep links
  },
  preview: {
    host: true,
    port: 5173,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
