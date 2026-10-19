import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/itineraries-website/',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
})
