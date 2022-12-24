/* eslint-disable no-empty */
import {
  createSearchParamsStructParser,
  parseSearchParamAsString,
} from 'twa-core';
import {extractInitDataFromSearchParams, InitData} from 'twa-init-data';
import {extractThemeFromJson, ThemeParams} from 'twa-theme-params';

interface WebAppData {
  version: string;
  initData: InitData;
  platform: string;
  themeParams: ThemeParams;
}

const extractWebAppData = createSearchParamsStructParser<WebAppData>({
  version: ['tgWebAppVersion', parseSearchParamAsString],
  initData: ['tgWebAppData', extractInitDataFromSearchParams],
  platform: ['tgWebAppPlatform', parseSearchParamAsString],
  themeParams: ['tgWebAppThemeParams', extractThemeFromJson],
});

export function getWebAppData(): WebAppData {
  const sessionStorageKey = '__initParams';

  // Try to extract Web App data from search parameters. This block of code
  // covers usual flow, when application was firstly opened by user and its
  // hash always contains required parameters.
  try {
    const initParams = window.location.hash.slice(1);
    const webAppData = extractWebAppData(initParams);
    sessionStorage.setItem(sessionStorageKey, initParams);

    return webAppData;
  } catch (e) {
  }

  // Web Apps allows reloading current page. In this case,
  // window.location.reload() will be called which means, that init will be
  // called again. As the result, current window location will lose Web App
  // data. To solve this problem, we could use session storage.
  try {
    return extractWebAppData(sessionStorage.getItem(sessionStorageKey) || '');
  } catch (e) {
  }
  throw new Error('Unable to extract Web App data.');
}