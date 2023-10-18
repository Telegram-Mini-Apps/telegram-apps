import { serialize as serializeThemeParams } from '@tma.js/theme-params';

import type { LaunchParams } from './types.js';

/**
 * Converts launch parameters to its initial representation.
 * @param value - launch parameters.
 */
export function serialize(value: LaunchParams): string {
  const { initDataRaw, themeParams, platform, version } = value;

  const params = new URLSearchParams();

  if (initDataRaw) {
    params.set('tgWebAppData', initDataRaw);
  }
  params.set('tgWebAppPlatform', platform);
  params.set('tgWebAppThemeParams', serializeThemeParams(themeParams));
  params.set('tgWebAppVersion', version);

  return params.toString();
}
