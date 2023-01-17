import useIsBrowser from '@docusaurus/useIsBrowser';
import {useMemo} from 'react';
import {
  isWindowsPhoneEnv,
  isDesktopOrMobileEnv,
  isBrowserEnv,
} from '@twa.js/bridge';

/**
 * Returns true in case, current environment is Telegram Web App.
 */
export function useIsWebAppEnv(): boolean {
  const isBrowser = useIsBrowser();

  return useMemo<boolean>(() => {
    // In case, code is executed on server side of project, it is enough
    // to check if there are some Telegram specific launch parameters in hash.
    if (!isBrowser) {
      return new URLSearchParams(window.location.hash.slice(1))
        .has('tgWebAppData');
    }
    return (isBrowserEnv() && document.referrer.startsWith('https://web.telegram.org/'))
      || isWindowsPhoneEnv(window)
      || isDesktopOrMobileEnv(window);
  }, [isBrowser]);
}