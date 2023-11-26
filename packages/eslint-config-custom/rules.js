module.exports = {
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/indent': 0,
  // Sometimes this rule decreases readability.
  'arrow-body-style': 0,
  'consistent-return': 0,
  'import/extensions': 0,
  // We use special module resolution, that's why we need extensions.
  'import/first': 'error',
  'import/newline-after-import': 'error',
  'import/no-duplicates': 'error',
  // We have extraneous deps, because we have workspace.
  'import/no-extraneous-dependencies': 0,
  // We don't use default exports anywhere.
  'import/prefer-default-export': 0,
  // We select line endings depending on current OS.
  // See: https://stackoverflow.com/q/39114446/2771889
  'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
  'no-continue': 0,
  // Sometimes we need to write "void promise".
  'no-void': 0,
  'object-curly-newline': ['error', { consistent: true }],
  'simple-import-sort/imports': [
    2,
    {
      groups: [
        // Side effect imports.
        [/^\u0000/.source],

        // Node.js builtins.
        [/^node:/.source],

        // Externals.
        [/^/.source],

        // Special current package imports.
        // Paths starting with "~/". Then go their types.
        [/^~\//.source, /^~\/.+\u0000$/.source],

        // Relative imports.
        [/^\.[^.]/.source, /^\.\./.source],
      ],
    },
  ],
};