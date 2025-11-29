import prettier from 'eslint-plugin-prettier';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    ignores: ['.next/**', 'node_modules/**'],
    plugins: {
      prettier,
      '@next/next': nextPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@next/next/no-img-element': 'off',
    },
  },
];
