import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Same rules as the old .eslintrc.json (next/core-web-vitals), in the flat
// config format that ESLint 9 and eslint-config-next 16 require.
export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
