import type { LaunchParams } from '@telegram-apps/types';

import { createTransformerGen } from '@/transformers/createTransformerGen.js';

import { searchParams } from './searchParams.js';
import { boolean } from './boolean.js';
import { string } from './string.js';
import { initData } from './initData.js';
import { themeParams } from './themeParams.js';

export const launchParams = createTransformerGen<LaunchParams>(value => {
  return searchParams({
    botInline: ['tgWebAppBotInline', boolean(true)],
    initData: ['tgWebAppData', initData(true)],
    initDataRaw: ['tgWebAppData', string(true)],
    platform: ['tgWebAppPlatform', string()],
    showSettings: ['tgWebAppShowSettings', boolean(true)],
    startParam: ['tgWebAppStartParam', string(true)],
    themeParams: ['tgWebAppThemeParams', themeParams()],
    version: ['tgWebAppVersion', string()],
  })(false)(value);
});

export type { LaunchParams };