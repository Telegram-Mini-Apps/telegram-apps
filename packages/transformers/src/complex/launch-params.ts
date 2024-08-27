import type { LaunchParams } from '@telegram-apps/types';

import { searchParams } from '@/transformers/searchParams.js';
import { boolean as createBoolean } from '@/transformers/boolean.js';
import { string as createString } from '@/transformers/string.js';

import { serializeThemeParams, themeParams } from './theme-params.js';
import { initData } from './initData.js';

export const launchParams = (() => {
  const string = createString();
  const stringOptional = createString(true);
  const boolOptional = createBoolean(true);

  return searchParams<LaunchParams>({
    botInline: ['tgWebAppBotInline', boolOptional],
    initData: ['tgWebAppData', initData(true)],
    initDataRaw: ['tgWebAppData', stringOptional],
    platform: ['tgWebAppPlatform', string],
    showSettings: ['tgWebAppShowSettings', boolOptional],
    startParam: ['tgWebAppStartParam', stringOptional],
    themeParams: ['tgWebAppThemeParams', themeParams()],
    version: ['tgWebAppVersion', string],
  }, 'launchParams');
})();

/**
 * Serializes launch parameters to representation sent from the Telegram application.
 */
export function serializeLaunchParams(lp: LaunchParams): string {
  const { initDataRaw, startParam } = lp;

  const params = new URLSearchParams();

  params.set('tgWebAppPlatform', lp.platform);
  params.set('tgWebAppThemeParams', serializeThemeParams(lp.themeParams));
  params.set('tgWebAppVersion', lp.version);
  params.set('tgWebAppShowSettings', lp.showSettings ? '1' : '0');
  params.set('tgWebAppBotInline', lp.botInline ? '1' : '0');

  initDataRaw && params.set('tgWebAppData', initDataRaw);
  startParam && params.set('tgWebAppStartParam', startParam);

  return params.toString();
}

export type { LaunchParams };