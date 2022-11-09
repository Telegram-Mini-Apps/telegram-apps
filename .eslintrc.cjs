module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['src/**/*.test.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
  root: true,
};