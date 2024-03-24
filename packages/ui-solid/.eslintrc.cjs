module.exports = {
  extends: ['custom/solid'],
  rules: {
    // TODO: For some reason, eslint can't resolve tsconfig aliases.
    'import/no-unresolved': 0,
    // Simple sort.
    // https://github.com/lydell/eslint-plugin-simple-import-sort?tab=readme-ov-file#custom-grouping
    'simple-import-sort/imports': ['error', {
      groups: [
        // Node.js builtins prefixed with `node:`.
        // node:fs
        [/^node:/.source],

        // Packages.
        // solid-js
        [/^@?\w/.source],

        // Tsconfig alias.
        // ~/helpers
        [/^~\/(?!components|icons|styles)/.source],

        // Styles utils.
        // ~/styles
        [/^~\/styles/.source],

        // Components and icons.
        // ~/components
        // ~/icons
        [/^~\/components/.source, /^~\/icons/.source],

        // Parent imports.
        // ../Typography.js
        [/^\.\.\//.source],

        // Current folder imports.
        // ./utils.js
        [/\.\/.+\.(?!s?css)/.source],

        // Styles.
        // ./Typography.scss
        // ./Typography.css
        [/\.s?css$/.source],
      ],
    }],
  },
};
