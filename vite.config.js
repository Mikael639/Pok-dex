import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3201,
    proxy: {
      '/types': 'http://localhost:8080',
      '/pokemons': 'http://localhost:8080',
      '/play': 'http://localhost:8080',
    }
  }
})
