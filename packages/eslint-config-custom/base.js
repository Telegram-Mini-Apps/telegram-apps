module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  plugins: [
    'simple-import-sort',
    'import',
  ],
  rules: require('./rules'),
};
