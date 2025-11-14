import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // By adding proxy here, the server will think that the request is coming from the same origin (3000) because the server is also running on the same 3000 port.
    }
  },
  plugins: [react()],
})
