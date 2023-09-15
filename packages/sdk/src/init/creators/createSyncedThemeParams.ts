import { ThemeParams } from '../../components/index.js';

import type { ThemeParamsType } from '../../theme-params.js';

/**
 * Creates synced instance of ThemeParams.
 * @param params - theme parameters.
 */
export function createSyncedThemeParams(params: ThemeParamsType): ThemeParams {
  const themeParams = new ThemeParams(params);
  ThemeParams.sync(themeParams);

  return themeParams;
}
