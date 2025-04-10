import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// vite.config.js
export default {
  root: './', // if your root is custom
  build: {
    rollupOptions: {
      input: '/src/main.js' // or whatever file you're using
    }
  }
}
