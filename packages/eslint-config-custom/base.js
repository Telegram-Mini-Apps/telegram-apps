module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['**/__tests__/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    'import',
  ],
  rules: require('./rules'),
  settings: {
    'import/resolver': {
      // This is enough to make resolver work properly.
      typescript: {},
    },
  },
};
