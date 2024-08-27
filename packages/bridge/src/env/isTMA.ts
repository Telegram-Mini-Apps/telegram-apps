import { BetterPromise, type AsyncOptions } from '@telegram-apps/toolkit';

import { request } from '@/utils/request.js';
import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';

/**
 * Returns true if the current environment is Telegram Mini Apps.
 *
 * First of all, it checks if the current environment contains traits specific to the
 * Mini Apps environment.
 * Then, it attempts to call a Mini Apps method and waits for a response to be received.
 *
 * In case you have no need to use these strict checks, take a look at the `isTMASimple`
 * alternative.
 * @see isTMASimple
 */
export function isTMA(options?: AsyncOptions): BetterPromise<boolean> {
  return BetterPromise.withFn(async () => {
    if (hasWebviewProxy(window)) {
      return true;
    }
    try {
      await request('web_app_request_theme', 'theme_changed', { timeout: 100 });
      return true;
    } catch {
      return false;
    }
  }, options);
}
