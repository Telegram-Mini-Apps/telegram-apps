import { ThemeParams, type ThemeParamsParsed } from '~/theme-params/index.js';

/**
 * Creates synced instance of ThemeParams.
 * @param params - theme parameters.
 */
export function createThemeParams(params: ThemeParamsParsed): ThemeParams {
  const themeParams = new ThemeParams(params);
  themeParams.listen();
  return themeParams;
}
