module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    'simple-import-sort',
  ],
  rules: require('./rules'),
  ignorePatterns: ['**/*.test.*'],
};
