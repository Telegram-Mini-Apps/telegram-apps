module.exports = {
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    ...require('./rules'),
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
  },
};
