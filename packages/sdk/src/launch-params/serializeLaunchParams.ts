import { serialize } from '@/scopes/theme-params/static.js';

import type { LaunchParams } from './types.js';

/**
 * Converts launch parameters to its initial representation.
 * @param value - launch parameters.
 */
export function serializeLaunchParams(value: LaunchParams): string {
  const {
    initDataRaw,
    themeParams,
    platform,
    version,
    showSettings,
    startParam,
    botInline,
  } = value;

  const params = new URLSearchParams();

  params.set('tgWebAppPlatform', platform);
  params.set('tgWebAppThemeParams', serialize(themeParams));
  params.set('tgWebAppVersion', version);

  if (initDataRaw) {
    params.set('tgWebAppData', initDataRaw);
  }

  if (startParam) {
    params.set('tgWebAppStartParam', startParam);
  }

  if (typeof showSettings === 'boolean') {
    params.set('tgWebAppShowSettings', showSettings ? '1' : '0');
  }

  if (typeof botInline === 'boolean') {
    params.set('tgWebAppBotInline', botInline ? '1' : '0');
  }

  return params.toString();
}
