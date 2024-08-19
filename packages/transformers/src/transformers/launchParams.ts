import type { LaunchParams } from '@telegram-apps/types';

import { createTransformerGen } from '@/transformers/createTransformerGen.js';

import { searchParams } from './searchParams.js';
import { boolean as createBoolean } from './boolean.js';
import { string as createString } from './string.js';
import { themeParams } from './themeParams.js';
import { initData } from './initData.js';

export const launchParams = createTransformerGen<LaunchParams>(value => {
  const string = createString();
  const stringOptional = createString(true);
  const boolOptional = createBoolean(true);

  return searchParams({
    botInline: ['tgWebAppBotInline', boolOptional],
    initData: ['tgWebAppData', initData(true)],
    initDataRaw: ['tgWebAppData', stringOptional],
    platform: ['tgWebAppPlatform', string],
    showSettings: ['tgWebAppShowSettings', boolOptional],
    startParam: ['tgWebAppStartParam', stringOptional],
    themeParams: ['tgWebAppThemeParams', themeParams()],
    version: ['tgWebAppVersion', string],
  })()(value);
});

export type { LaunchParams };