module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  ignorePatterns: ['**/__tests__/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: [
    'simple-import-sort',
  ],
  rules: require('./rules'),
};
