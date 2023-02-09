/* eslint-disable no-empty */
import {createSearchParamsParser} from '@twa.js/utils';
import {parseInitData, InitData} from '@twa.js/init-data';

import {parseThemeParams, ThemeParams} from '../utils';
import {Platform} from '../components';

interface LaunchParams {
  version: string;
  initData: InitData;
  platform: Platform;
  themeParams: ThemeParams;
}

const parseLaunchParams = createSearchParamsParser({
  version: {type: value => value, from: 'tgWebAppVersion'},
  initData: {type: parseInitData, from: 'tgWebAppData'},
  platform: {type: value => value, from: 'tgWebAppPlatform'},
  themeParams: {type: parseThemeParams, from: 'tgWebAppThemeParams'},
});

/**
 * Extracts launch params from current environment.
 */
export function retrieveLaunchParams(): LaunchParams {
  const sessionStorageKey = '__telegram-launch-params__';

  // Try to extract Web App data from search parameters. This block of code
  // covers usual flow, when application was firstly opened by user and its
  // hash always contains required parameters.
  try {
    const initParams = window.location.hash.slice(1);
    const webAppData = parseLaunchParams(initParams);
    sessionStorage.setItem(sessionStorageKey, initParams);

    return webAppData;
  } catch (e) {
  }

  // Web Apps allows reloading current page. In this case,
  // window.location.reload() will be called which means, that init will be
  // called again. As the result, current window location will lose Web App
  // data. To solve this problem, we could use session storage.
  try {
    return parseLaunchParams(sessionStorage.getItem(sessionStorageKey) || '');
  } catch (e) {
  }
  throw new Error('Unable to extract launch params.');
}
