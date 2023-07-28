/* eslint-disable no-empty */
import { searchParams } from '@twa.js/utils';
import { parseInitData, type InitData } from '@twa.js/init-data';

import { themeParams, type ThemeParams } from './theme-params.js';
import { type Platform } from '../types.js';

export interface LaunchParams {
  version: string;
  initData?: InitData;
  platform: Platform;
  themeParams: ThemeParams;
}

const launchParams = searchParams({
  version: { type: (value) => value, from: 'tgWebAppVersion' },
  // This property is optional as long as it can be missing in case, application was
  // launched via Inline Keyboard Button.
  initData: { type: parseInitData, from: 'tgWebAppData', optional: true },
  platform: { type: (value) => value, from: 'tgWebAppPlatform' },
  themeParams: { type: themeParams, from: 'tgWebAppThemeParams' },
});

/**
 * Extracts launch params from the current environment.
 */
export function retrieveLaunchParams(): LaunchParams {
  const sessionStorageKey = '__telegram-launch-params__';

  // Try to extract Web App data from search parameters. This block of code
  // covers usual flow, when application was firstly opened by user and its
  // hash always contains required parameters.
  try {
    const initParams = window.location.hash.slice(1);
    const webAppData = launchParams(initParams);
    sessionStorage.setItem(sessionStorageKey, initParams);

    return webAppData;
  } catch (e) {
  }

  // Web Apps allows reloading current page. In this case,
  // window.location.reload() will be called which means, that init will be
  // called again. As the result, current window location will lose Web App
  // data. To solve this problem, we could use session storage.
  try {
    return launchParams(sessionStorage.getItem(sessionStorageKey) || '');
  } catch (e) {
  }
  throw new Error('Unable to extract launch params.');
}
