import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//export default defineConfig({
  //plugins: [react()],
//})

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // add your Pi’s DNS name here (or use 'all' to disable host checks)
    allowedHosts: ['rpi4bw.student.rit.edu']
    // allowedHosts: 'all'
  }
})