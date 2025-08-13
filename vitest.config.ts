import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Add this line to enable global test functions
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts']
  }
})
