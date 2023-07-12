module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: require('./rules'),
};
