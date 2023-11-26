module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:solid/typescript'
  ],
  plugins: [
    'simple-import-sort',
    'import',
    'solid'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: require('./rules'),
};
