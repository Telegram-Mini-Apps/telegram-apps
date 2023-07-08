module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // We don't use default exports anywhere.
    'import/prefer-default-export': 0,
    // Usage of "continue" is normal and prevents code from nesting.
    'no-continue': 0,
  }
};
