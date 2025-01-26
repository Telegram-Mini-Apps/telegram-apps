import { AbortablePromise, type PromiseOptions } from 'better-promises';

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
export function isTMA(): boolean;

/**
 * Returns promise with true if the current environment is Telegram Mini Apps.
 *
 * First of all, it checks if the current environment contains traits specific to the
 * Mini Apps environment.
 * Then, it attempts to call a Mini Apps method and waits for a response to be received.
 *
 * In case you need less strict checks, use sync override of this function.
 */
export function isTMA(type: 'complete', options?: PromiseOptions): AbortablePromise<boolean>

export function isTMA(
  type?: 'complete',
  options?: PromiseOptions,
): boolean | AbortablePromise<boolean> {
  if (!type) {
    try {
      retrieveLaunchParams();
      return true;
    } catch {
      return false;
    }
  }

  return AbortablePromise.fn(async context => {
    if (hasWebviewProxy(window)) {
      return true;
    }
    try {
      await request('web_app_request_theme', 'theme_changed', context);
      return true;
    } catch {
      return false;
    }
  }, options || { timeout: 100 });
}
