module.exports = {
  // Works incorrectly in some IDEs. Should be equal to 2.
  '@typescript-eslint/indent': 0,
  '@typescript-eslint/consistent-type-imports': 'error',
  // We don't use default exports anywhere.
  'import/prefer-default-export': 0,
  // We have no problem related to extraneous dependencies.
  'import/no-extraneous-dependencies': 0,
  // Usage of "continue" is normal and prevents code from nesting.
  'no-continue': 0,
  // Enable default behavior of this rule.
  'object-curly-newline': ['error', { consistent: true }],
  'consistent-return': 0,
  // We select line endings depending on current OS.
  // See: https://stackoverflow.com/q/39114446/2771889
  'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
};