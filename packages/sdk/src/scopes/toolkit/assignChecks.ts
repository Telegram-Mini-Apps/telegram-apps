import { type If, type MethodName, supports, TypedError } from '@telegram-apps/bridge';

import type { AnyFn } from '@/types.js';
import { $version } from '@/scopes/globals.js';
import {
  ERR_NOT_INITIALIZED,
  ERR_NOT_MOUNTED,
  ERR_NOT_SUPPORTED,
} from '@/errors.js';

export type SafeWrapped<Fn extends AnyFn, S extends boolean> =
  & Fn
  & {
  /**
   * The method which is mostly used to check if the function call will
   * not surely lead to error.
   *
   * It checks if the component is mounted and the function itself is
   * supported. It also checks if the package itself is initialized.
   *
   * You should use this function when possible because it provides
   * must-have code security mechanisms and makes a developer sure that
   * he is using the package properly.
   *
   * @returns True if the owner component is mounted, function is supported
   * and the packages initialized.
   *
   * @example
   * if (showBackButton.isAvailable()) {
   *   showBackButton();
   * }
   */
  isAvailable: () => boolean;
}
  & If<S, {
  /**
   * The method which notifies a developer that the function is supported by
   * the current Mini Apps version including some possible additional
   * conditions.
   *
   * @returns True if this function is supported.
   *
   * @example
   * if (setMiniAppBottomBarColor.isSupported()) {
   *   console.log('Mini App bottom bar is supported');
   * }
   */
  isSupported: () => boolean;
}, {}>

export type IsSupported = MethodName | (() => boolean);

interface Options {
  /**
   * The owner component name.
   */
  component: string;
  /**
   * The method name.
   */
  method: string;
  /**
   * Signal returning true if the owner component is mounted.
   */
  isMounted?: () => boolean;
  /**
   * Should the package init check be performed.
   */
  checkInit?: boolean;
  /**
   * Mini Apps method name or function returning true determining if
   * the function is supported.
   */
  isSupported?: IsSupported,
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
  function isSupported() {
    return maybeIsSupported
      ? typeof maybeIsSupported === 'function'
        ? maybeIsSupported()
        : supports(maybeIsSupported, $version())
      : true;
  }

  function isMounted() {
    return !maybeIsMounted || maybeIsMounted();
  }

  function isInitialized(): boolean {
    return !checkInit || $version() !== '0.0';
  }

  function isAvailable() {
    return isInitialized() && isSupported() && isMounted();
  }

  return Object.assign(
    (...args: Parameters<Fn>): ReturnType<Fn> => {
      if (!isInitialized()) {
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
