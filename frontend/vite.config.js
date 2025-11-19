import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['chatmin-frontend.loca.lt', 'chatmin-backend.loca.lt', '17e3bc76a114.ngrok-free.app', 'https://8026af3bddba.ngrok-free.app', 'http://127.0.0.1:5173', 'http://127.0.0.1:8000'],
  },
})
