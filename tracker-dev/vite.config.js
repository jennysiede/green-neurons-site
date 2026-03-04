import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
    open: true,   // auto-opens browser on dev start
  },
  resolve: {
    alias: {
      // lets you import the tracker from the parent folder
      '@tracker': '../supply-chain-tracker.jsx'
    }
  }
})
