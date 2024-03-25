function regexp(regex) {
  return [
    new RegExp(regex.source + '.*[^\\u0000]$').source,
    regex.source,
  ]
}

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
        regexp(/^node:/),

        // Packages.
        // solid-js
        regexp(/^@?\w/),

        // Tsconfig alias.
        // ~/helpers
        regexp(/^~\/(?!components|icons|styles)/),

        // Styles utils.
        // ~/styles
        regexp(/^~\/styles/),

        // Components.
        // ~/components
        regexp(/^~\/components/),

        // Icons.
        // ~/icons
        regexp(/^~\/icons/),

        // Parent imports.
        // ../Typography.js
        regexp(/^\.\.\//),

        // Current folder imports.
        // ./utils.js
        regexp(/^\.\/.+\.(?!s?css)/),

        // Styles.
        // ./Typography.scss
        // ./Typography.css
        [/\.s?css$/.source],
      ],
    }],
  },
};
