/// <reference types="vitest/config" />

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load biến môi trường tương ứng với mode (development, production, v.v.)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@auth': path.resolve(__dirname, './src/modules/auth'),
        '@editor': path.resolve(__dirname, './src/modules/editor'),
        '@templates': path.resolve(__dirname, './src/modules/templates'),
        '@mngRecipients': path.resolve(__dirname, './src/modules/mngRecipients'),
        '@group': path.resolve(__dirname, './src/modules/group')
      }
    },
    optimizeDeps: {
      include: ['react-window']
    },
    server: {
      port: Number(env.VITE_PORT) || 5175, // fallback nếu biến không có
      host: true // cho phép truy cập từ mạng LAN nếu cần
    }
  }
})
