// eslint.config.mjs
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  prettier,

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'prettier': prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // Prettier
      'prettier/prettier': 'error',

      // React
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      // Hooks (ВАЖНО)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Imports
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
]
