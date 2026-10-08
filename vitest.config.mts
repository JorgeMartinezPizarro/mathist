import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Quick checks for every change: npm test
// The long reports with millions of runs stay in /api/test (src/tests/test-*.ts).
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
