import { SESSION_STORAGE_KEY } from './const.js';
import type { LaunchParams } from './types.js';

/**
 * Saves specified launch params to session storage.
 * @param launchParams - launch params to save.
 */
export function saveToStorage(launchParams: Omit<LaunchParams, 'initData'>): void {
  const {
    initDataRaw,
    version,
    platform,
    themeParams,
  } = launchParams;

  const searchParams = new URLSearchParams();
  searchParams.set('tgWebAppVersion', version);
  searchParams.set('tgWebAppPlatform', platform);
  searchParams.set('tgWebAppThemeParams', JSON.stringify(themeParams));

  if (initDataRaw) {
    searchParams.set('tgWebAppData', initDataRaw);
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, searchParams.toString());
}
