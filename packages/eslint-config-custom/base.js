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
    'import',
  ],
  rules: require('./rules'),
};
