import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@': path.resolve(__dirname, './src')
    }
  }
})
