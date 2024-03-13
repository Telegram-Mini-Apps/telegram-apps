import { ThemeParams } from '../../components/theme-params/ThemeParams.js';
import type { ThemeParamsParsed } from '../../components/theme-params/types.js';

/**
 * Creates synced instance of ThemeParams.
 * @param params - theme parameters.
 */
export function createThemeParams(params: ThemeParamsParsed): ThemeParams {
  const themeParams = new ThemeParams(params);
  themeParams.listen();
  return themeParams;
}
