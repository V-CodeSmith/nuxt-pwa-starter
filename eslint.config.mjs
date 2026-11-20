// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default createConfigForNuxt({
  features: {
    // Prettier owns formatting; don't fight it with stylistic rules.
    stylistic: false,
    tooling: true,
  },
})
  .override('nuxt/typescript/rules', {
    rules: {
      // Every PWA composable must be fully typed; `any` would erode that.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  })
  .append(
    {
      name: 'prettier/config',
      plugins: { prettier: prettierPlugin },
      rules: {
        ...prettierConfig.rules,
        'prettier/prettier': 'error',
      },
    },
    {
      name: 'pwa/starter-ignores',
      ignores: [
        '**/.nuxt/**',
        '**/.output/**',
        '**/.data/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/public/sw.js',
        '**/public/workbox-*.js',
        '**/public/registerSW.js',
        '**/public/manifest.webmanifest',
        '**/dev-dist/**',
      ],
    },
  )
