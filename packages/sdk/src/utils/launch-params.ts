/* eslint-disable no-empty */
import { searchParams, string } from '@twa.js/utils';
import { initData, type InitData } from '@twa.js/init-data';

import { themeParams, type ThemeParams } from './theme-params.js';
import type { Platform } from '../types.js';

export interface LaunchParams {
  version: string;
  initData?: InitData;
  initDataRaw?: string;
  platform: Platform;
  themeParams: ThemeParams;
}

const launchParams = searchParams({
  version: { type: (value) => value, from: 'tgWebAppVersion' },
  // This property is optional as long as it can be missing in case, application was
  // launched via Inline Keyboard Button.
  initData: { type: initData, from: 'tgWebAppData', optional: true },
  initDataRaw: { type: string, from: 'tgWebAppData', optional: true },
  platform: { type: (value) => value, from: 'tgWebAppPlatform' },
  themeParams: { type: themeParams, from: 'tgWebAppThemeParams' },
});

/**
 * Parses query parameters as launch parameters.
 * @param query - query parameters presented as string or URLSearchParams
 * instance.
 */
export function parseLaunchParams(query: string | URLSearchParams): LaunchParams {
  return launchParams(query);
}

/**
 * Extracts launch params from the current environment.
 */
export function retrieveLaunchParams(): LaunchParams {
  const sessionStorageKey = '__telegram-launch-params__';
  const errors: string[] = [];

  // Try to extract Web App data from search parameters. This block of code
  // covers usual flow, when application was firstly opened by user and its
  // hash always contains required parameters.
  try {
    const hash = window.location.hash.slice(1);
    const webAppData = launchParams(hash);
    sessionStorage.setItem(sessionStorageKey, hash);

    return webAppData;
  } catch (e) {
    errors.push(e instanceof Error ? e.message : 'unknown error');
  }

  // Web Apps allows reloading current page. In this case,
  // window.location.reload() will be called which means, that init will be
  // called again. As the result, current window location will lose Web App
  // data. To solve this problem, we could use session storage.
  try {
    return launchParams(sessionStorage.getItem(sessionStorageKey) || '');
  } catch (e) {
    errors.push(e instanceof Error ? e.message : 'unknown error');
  }

  throw new Error(
    `Unable to extract launch params. Occurred errors: "${errors.join('", "')}"`,
  );
}
