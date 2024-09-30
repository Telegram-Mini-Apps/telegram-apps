import { CancelablePromise, type AsyncOptions } from '@telegram-apps/toolkit';

import { request } from '@/utils/request.js';
import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

/**
 * Returns true if the current environment is Telegram Mini Apps.
 *
 * It uses the `retrieveLaunchParams` function to determine if the environment contains
 * launch parameters. In case it does, true will be returned.
 *
 * In case you need stricter checks, use async override of this function.
 */
export function isTMA(type: 'simple'): boolean;

/**
 * Returns promise with true if the current environment is Telegram Mini Apps.
 *
 * First of all, it checks if the current environment contains traits specific to the
 * Mini Apps environment.
 * Then, it attempts to call a Mini Apps method and waits for a response to be received.
 *
 * In case you need less strict checks, use sync override of this function.
 */
export function isTMA(options?: AsyncOptions): CancelablePromise<boolean>

export function isTMA(optionsOrType?: AsyncOptions | 'simple'): boolean | CancelablePromise<boolean> {
  if (optionsOrType === 'simple') {
    try {
      retrieveLaunchParams();
      return true;
    } catch {
      return false;
    }
  }

  return CancelablePromise.withFn(async () => {
    if (hasWebviewProxy(window)) {
      return true;
    }
    try {
      await request('web_app_request_theme', 'theme_changed', { timeout: 100 });
      return true;
    } catch {
      return false;
    }
  }, optionsOrType);
}
