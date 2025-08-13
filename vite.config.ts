/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// also don't forget to `npm i -D @types/node`, so __dirname won't complain
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
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
  }
  // test: {
  //   /* for example, use global to avoid globals imports (describe, test, expect): */
  //   globals: true,
  //   // typecheck: {
  //   //   enabled: true
  //   // },
  //   environment: 'jsdom',
  //   setupFiles: ['./test/setup.ts']
  // }
})
