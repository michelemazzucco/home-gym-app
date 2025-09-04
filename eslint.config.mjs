import { FlatCompat } from '@eslint/eslintrc'
import prettierPlugin from 'eslint-plugin-prettier'
import { fileURLToPath } from 'url'
import path from 'path'

// Resolve directory for FlatCompat in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  // Next.js core rules (includes React, TS, etc.)
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),

  // Ignore build output and config files
  { ignores: ['node_modules/**', '.next/**', 'out/**', 'dist/**', 'eslint.config.*'] },

  // Project rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // No tabs; indentation is enforced by Prettier
      'no-tabs': 'error',

      // Defer style to Prettier; ensure no semicolons
      'prettier/prettier': ['error', { semi: false, useTabs: false, tabWidth: 2 }],
    },
  },

  // Turn off stylistic rules that may conflict with Prettier
  ...compat.extends('prettier'),
]
