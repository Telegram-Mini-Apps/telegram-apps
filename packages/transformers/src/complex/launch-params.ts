import type { LaunchParams } from '@telegram-apps/types';

import { searchParams } from '@/transformers/searchParams.js';
import { boolean as createBoolean } from '@/transformers/boolean.js';
import { string as createString } from '@/transformers/string.js';

import { serializeThemeParams, themeParams } from './theme-params.js';
import { initData } from './initData.js';
import type { TransformerGen } from '@/types.js';

export const launchParams: TransformerGen<LaunchParams> = (optional) => {
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
  }, 'launchParams')(optional);
};

/**
 * Serializes launch parameters to representation sent from the Telegram application.
 */
// #__NO_SIDE_EFFECTS__
export function serializeLaunchParams(lp: LaunchParams): string {
  const { initDataRaw, startParam, showSettings, botInline } = lp;

  const params = new URLSearchParams();

  params.set('tgWebAppPlatform', lp.platform);
  params.set('tgWebAppThemeParams', serializeThemeParams(lp.themeParams));
  params.set('tgWebAppVersion', lp.version);
  initDataRaw && params.set('tgWebAppData', initDataRaw);
  startParam && params.set('tgWebAppStartParam', startParam);
  typeof showSettings === 'boolean' && params.set('tgWebAppShowSettings', showSettings ? '1' : '0');
  typeof botInline === 'boolean' && params.set('tgWebAppBotInline', botInline ? '1' : '0');

  return params.toString();
}

export type { LaunchParams };