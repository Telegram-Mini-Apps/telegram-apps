import type { ThemeParams as ThemeParamsType } from '@tma.js/theme-params';

import { ThemeParams } from '../../components/index.js';

/**
 * Creates synced instance of ThemeParams.
 * @param params - theme parameters.
 */
export function createThemeParams(params: ThemeParamsType): ThemeParams {
  const themeParams = new ThemeParams(params);
  ThemeParams.sync(themeParams);

  return themeParams;
}
