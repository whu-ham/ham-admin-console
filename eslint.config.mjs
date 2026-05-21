/**
 * @datetime 2026-05-21 00:00:00
 * @model GLM-5.1
 */
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import tailwindPlugin from 'eslint-plugin-tailwindcss'

export default withNuxt(
  {
    name: 'tailwindcss:base',
    plugins: {
      tailwindcss: tailwindPlugin,
    },
    settings: {
      tailwindcss: {
        callees: ['classNames', 'twMerge', 'cn', 'clsx', 'cva'],
      },
    },
  },
  {
    name: 'tailwindcss:rules',
    rules: tailwindPlugin.configs['flat/recommended'][1].rules,
  },
  eslintPluginPrettier,
  {
    name: 'global-ignores',
    ignores: ['**/node_modules/**', '.nuxt/**', '.output/**', 'dist/**'],
  },
)
