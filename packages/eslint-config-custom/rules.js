/**
 * Creates regular expression for the "simple-import-sort" plugin using specified options.
 * @param {RegExp} regexp - base for regular expression.
 * @param {boolean} [types] - should types be enabled.
 * @returns {String} Generated regular expression.
 */
function constructRegExp(regexp, types = false) {
  return `${regexp.source}.+${types ? '\\u0000' : '[^\\u0000]'}$`;
}

/**
 * Returns group of imports containing usual imports first, and then type imports.
 * @param {RegExp[]} regexps - list of regular expressions bases.
 * @returns {String[]} List of regular expressions.
 */
function defaultImportsGroup(regexps) {
  return regexps
      .reduce((acc, regexp) => {
        acc[0].push(constructRegExp(regexp));
        acc[1].push(constructRegExp(regexp, true));
        return acc;
      }, [[], []])
      .flat(1);
}

/**
 * Creates imports group for the rule "simple-import-sort/imports".
 *
 * @example
 * // External imports + node:*
 * import { readFileSync } from 'node:fs';
 * import { useEffect } from 'react';
 * import type { Component } from 'react';
 *
 * // Alias imports.
 * import { SettingsButton } from '@components/SettingsButton';
 * import { BackButton } from '@/components/BackButton';
 * import type { MainButton } from '@/components/MainButton';
 * import type { Headline } from '@/components/Headline';
 *
 * // Relative imports.
 * import { Parent } from '../Parent';
 * import { SomeSearch } from './-Search';
 * import type { ParentType } from '../Parent.types';
 * import type { SearchType } from './-Search.types';
 *
 * @returns {String[][]}
 */
function simpleSortGroups() {
  // node:*
  const node = /^node:/;
  // react
  const external = /^@?\w/;
  // @/components
  const alias = /^@\//;
  // ../Suggest
  const parent = /^\.\./;
  // ./Suggest
  const sibling = /^\./;

  return [
    defaultImportsGroup([node, external]),
    defaultImportsGroup([alias]),
    defaultImportsGroup([parent, sibling]),
  ];
}

module.exports = {
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/indent': 0,
  '@typescript-eslint/no-unused-expressions': 0,
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
  'import/order': 0,
  // We don't use default exports anywhere.
  'import/prefer-default-export': 0,
  // We select line endings depending on current OS.
  // See: https://stackoverflow.com/q/39114446/2771889
  'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
  'no-await-in-loop': 0,
  'no-console': 0,
  'no-continue': 0,
  'no-nested-ternary': 0,
  'no-return-assign': 0,
  'no-underscore-dangle': 0,
  // Sometimes we need to write "void promise".
  'no-void': 0,
  'object-curly-newline': ['error', { consistent: true }],
  'simple-import-sort/exports': 'error',
  'simple-import-sort/imports': ['error', { groups: simpleSortGroups() }]
};




