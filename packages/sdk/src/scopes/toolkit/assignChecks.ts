import {
  ERR_UNKNOWN_ENV,
  type If,
  type MethodName,
  supports,
  TypedError,
} from '@telegram-apps/bridge';

import type { AnyFn } from '@/types.js';
import { $version } from '@/scopes/globals.js';
import {
  ERR_NOT_INITIALIZED,
  ERR_NOT_MOUNTED,
  ERR_NOT_SUPPORTED,
} from '@/errors.js';
import { isTMA } from '@telegram-apps/bridge';

export type IsSupported = (() => boolean) | MethodName;

export type SafeWrapped<Fn extends AnyFn, S extends boolean> =
  & Fn
  & {
  /**
   * The method which is used to check if the function is available in the
   * current environment.
   *
   * The method may throw an error if the current environment is Telegram Mini
   * Apps, but the package was not initialized.
   *
   * It does the following:
   * 1. If the current environment is not TMA, return `false`.
   * 2. Check if the package was initialized. If it wasn't, throw an error. It
   * will happen because we will not be able to check if the function is
   * supported as long as it will use an invalid Mini Apps version to do it.
   * 3. If the `isSupported()` function was passed, check if it returns `true`.
   * 4. If the `isMounted` signal was passed, check if it returns `true`.
   *
   * *You should use this function when possible because it provides
   * must-have code security mechanisms and makes a developer sure that
   * he is using the package properly.*
   *
   * @returns True if the function is available in the current environment.
   * @throws {TypedError} ERR_NOT_INITIALIZED
   *
   * @example
   * if (showBackButton.isAvailable()) {
   *   showBackButton();
   * }
   */
  isAvailable(): boolean;
}
  & If<S, {
  /**
   * The method which notifies a developer that the function is supported by
   * the current Mini Apps version including some possible additional
   * conditions.
   *
   * @returns True if this function is supported.
   * @example
   * if (setMiniAppBottomBarColor.isSupported()) {
   *   console.log('Mini App bottom bar is supported');
   * }
   */
  isSupported: () => boolean;
}, {}>

interface Options {
  component: string;
  method: string;
  isMounted?: () => boolean;
  checkInit?: boolean;
  isSupported?: IsSupported;
}

/**
 * Adds the isAvailable method to the function checking if the
 * function call is safe in terms of support and mount checks.
 * @param fn - function to wrap.
 * @param isSupported - signal returning true if the function is supported.
 * @param isMounted - signal returning true if the component is mounted.
 */

/*@__NO_SIDE_EFFECTS__*/
export function assignChecks<Fn extends AnyFn, O extends Options>(
  fn: Fn,
  {
    isSupported: maybeIsSupported,
    isMounted: maybeIsMounted,
    component,
    checkInit,
    ...options
  }: O,
): SafeWrapped<Fn, O extends { isSupported: any } ? true : false> {
  const method = `${component}.${options.method}()`;

  function isSupported() {
    return maybeIsSupported
      ? typeof maybeIsSupported === 'function'
        ? maybeIsSupported()
        : supports(maybeIsSupported, $version())
      : true;
  }

  function isInitialized(): boolean {
    return $version() !== '0.0';
  }

  function isMounted() {
    return !maybeIsMounted || maybeIsMounted();
  }

  function isAvailable() {
    // Non-TMA environments don't support our functions.
    if (!isTMA('simple')) {
      return false;
    }

    // Check if the package is initialized.
    if (checkInit && !isInitialized()) {
      throw new TypedError(
        ERR_NOT_INITIALIZED,
        `Can't check if the ${method} method is available: the package is not initialized. Consider using the package init() function`,
      );
    }
    return isSupported() && isMounted();
  }

  return Object.assign(
    (...args: Parameters<Fn>): ReturnType<Fn> => {
      if (!isTMA('simple')) {
        throw new TypedError(
          ERR_UNKNOWN_ENV,
          `${method} method can't be called outside Mini Apps environment`,
        );
      }

      if (checkInit && !isInitialized()) {
        throw new TypedError(
          ERR_NOT_INITIALIZED,
          'The package was not initialized. Consider using the package init() function',
        );
      }
      if (!isSupported()) {
        throw new TypedError(
          ERR_NOT_SUPPORTED,
          `${component}.${options.method}() method is not supported in Mini Apps version ${$version()}`,
        );
      }
      if (!isMounted()) {
        throw new TypedError(
          ERR_NOT_MOUNTED,
          `${component} component is not mounted. Consider using the mount() method`,
        );
      }
      return fn(...args);
    },
    fn,
    { isAvailable },
    maybeIsSupported ? { isSupported } : {},
  ) as SafeWrapped<Fn, O extends { isSupported: any } ? true : false>;
}
