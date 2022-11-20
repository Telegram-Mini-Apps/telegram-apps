import {
  createSearchParamsStructParser,
  parseSearchParamAsString,
} from 'twa-core';
import {extractInitDataFromSearchParams} from 'twa-init-data';
import {extractThemeFromJson} from 'twa-theme-params';

export const extractWebAppData = createSearchParamsStructParser({
  version: ['tgWebAppVersion', parseSearchParamAsString],
  initData: ['tgWebAppData', extractInitDataFromSearchParams],
  platform: ['tgWebAppPlatform', parseSearchParamAsString],
  themeParams: ['tgWebAppThemeParams', extractThemeFromJson],
});