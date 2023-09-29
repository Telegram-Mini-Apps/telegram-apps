import { searchParams, string } from '@tma.js/parsing';
import { initData, type InitData } from '@tma.js/init-data';

import { parseThemeParams, type ThemeParamsType } from './theme-params.js';
import { saveStorageValue, getStorageValue } from './storage.js';

import type { Platform } from './types.js';

export interface LaunchParams {
  version: string;
  initData?: InitData;
  initDataRaw?: string;
  platform: Platform;
  themeParams: ThemeParamsType;
}

const launchParamsParser = searchParams<LaunchParams>({
  version: { type: string(), from: 'tgWebAppVersion' },
  initData: { type: initData.optional(), from: 'tgWebAppData' },
  initDataRaw: { type: string().optional(), from: 'tgWebAppData' },
  platform: { type: string(), from: 'tgWebAppPlatform' },
  themeParams: { type: parseThemeParams, from: 'tgWebAppThemeParams' },
});

/**
 * Parses query parameters as launch parameters.
 * @param query - query parameters presented as string or URLSearchParams
 * instance.
 */
export function parseLaunchParams(query: string | URLSearchParams): LaunchParams {
  return launchParamsParser.parse(query);
}

/**
 * Extracts launch params from the current environment.
 */
export function retrieveLaunchParams(): LaunchParams {
  const errors: string[] = [];

  // Try to extract Web App data from hash. This block of code  covers usual flow, when
  // application was firstly opened by the user and its hash always contains required parameters.
  try {
    const launchParamsRaw = window.location.hash.slice(1);
    const launchParamsParsed = parseLaunchParams(launchParamsRaw);

    // Previous line of code worked fine. Then, we can save taken launch params raw value.
    saveStorageValue('launch-params', launchParamsRaw);

    return launchParamsParsed;
  } catch (e) {
    errors.push(e instanceof Error ? e.message : 'unknown error');
  }

  // Web Apps allows reloading current page. In this case, window.location.reload() will be
  // called which means, that init will be called again. As the result, current window
  // location will lose Web App data. To solve this problem, we are extracting launch
  // params saved previously.
  try {
    const launchParamsRaw = getStorageValue('launch-params');
    if (launchParamsRaw) {
      return parseLaunchParams(launchParamsRaw);
    }

    errors.push('Launch params are missing in local storage');
  } catch (e) {
    errors.push(e instanceof Error ? e.message : 'unknown error');
  }

  throw new Error(`Unable to extract launch params. Errors: "${errors.join('", "')}"`);
}
