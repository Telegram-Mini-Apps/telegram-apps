import { retrieveFromStorage } from './storage.js';
import { retrieveCurrent } from './retrieveCurrent.js';
import { computePageReload } from './computePageReload.js';
import type { LaunchData, LaunchParams } from './types.js';

export interface ComputeLaunchDataOptions {
  /**
   * Previous known launch parameters. If not passed, function attempts to extract them by
   * itself.
   */
  previousLaunchParams?: LaunchParams;
  /**
   * Currently known launch parameters.
   */
  currentLaunchParams?: LaunchParams;
}

/**
 * Returns true in case, current environment is iframe.
 * @see https://stackoverflow.com/a/326076
 */
function isIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

/**
 * Computes launch data information. Extracts both previous and current launch parameters
 * to compute current list of them. Additionally, computes if page was reloaded.
 */
export function computeLaunchData(options: ComputeLaunchDataOptions = {}): LaunchData {
  const {
    // Retrieve launch parameters from the session storage. We consider this value as the launch
    // parameters saved previously, in the previous runtime session (before the page reload).
    previousLaunchParams: lpPrevious = retrieveFromStorage(),

    // Currently used launch parameters passed to the Mini App.
    currentLaunchParams: lpCurrent = retrieveCurrent(),
  } = options;

  const isPageReload = computePageReload();

  if (lpPrevious) {
    if (lpCurrent) {
      return {
        launchParams: lpCurrent,
        isPageReload: isIframe()
          // In iframes we should check page reload via 2 ways:
          // 1. Native one via navigation entry.
          // 2. By comparing raw init data representations, when the first step did not return
          // explicit true.
          //
          // The reason is Telegram provides the horrible way of reloading current iframes which
          // does not guarantee, that reload will be proceeded properly.
          // Issue: https://github.com/morethanwords/tweb/issues/271
          //
          // We trust isPageReload variable value only in case it is "true". Otherwise, it can be
          // wrong. That's why we compare raw init data raw representations, which is unstable
          // also. This will not work as expected in cases, user launches applications via
          // KeyboardButton-s which can lack of init data. So, this code will not differ reload
          // from the fresh start.
          ? isPageReload || lpPrevious.initDataRaw === lpCurrent.initDataRaw

          // In environments different from iframe, when we have both previous and current launch
          // parameters it is guaranteed that page was reloaded as long as session is created only
          // for the Mini App launch and will be automatically disposed after it is closed.
          : true,
      };
    }

    // Explicit page reload allows us to trust previously saved launch parameters.
    if (isPageReload) {
      return {
        launchParams: lpPrevious,
        isPageReload,
      };
    }

    // We can't trust previously saved launch parameters as long as we don't really know if
    // current session was born due to restart. It is better to throw an error.
    throw new Error('Unable to retrieve current launch parameters, which must exist.');
  }

  if (lpCurrent) {
    return {
      launchParams: lpCurrent,
      isPageReload: false,
    };
  }

  throw new Error('Unable to retrieve any launch parameters.');
}
