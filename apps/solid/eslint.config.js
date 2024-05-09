import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginSolidConfig from 'eslint-plugin-solid/configs/typescript';

export default [
  {
    languageOptions:
      {
        globals: globals.browser
      }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginSolidConfig
];