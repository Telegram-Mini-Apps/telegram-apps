import {
  ERR_UNKNOWN_ENV,
  type If,
  type MethodName,
  supports,
  isTMA,
  TypedError,
} from '@telegram-apps/bridge';
import { type Computed, computed } from '@telegram-apps/signals';

import { $version } from '@/scopes/globals.js';
import {
  ERR_NOT_INITIALIZED,
  ERR_NOT_MOUNTED,
  ERR_NOT_SUPPORTED,
} from '@/errors.js';
import { isSSR } from '@/utils/isSSR.js';
import type { AnyFn } from '@/types.js';

export type IsSupported =
// (() => boolean) fixme
  | MethodName
  | MethodName[];

export type SafeWrapped<Fn extends AnyFn, S extends boolean> =
  & Fn
  & {
  /**
   * The signal returning `true` if the function is available in the
   * current environment.
   *
   * To be more accurate, the method checks the following:
   * 1. The current environment is not TMA or server.
   * 2. The SDK package is initialized.
   * 3. If passed, the `isSupported` signal returns true.
   * 4. If passed, the `isMounted` signal returns true.
   *
   * *You should use this function when possible because it provides
   * must-have code security mechanisms and makes a developer sure that
   * he is using the package properly.*
   *
   * @returns True if the function is available in the current environment.
   * @example
   * if (showBackButton.isAvailable()) {
   *   showBackButton();
   * }
   */
  isAvailable: Computed<boolean>;
}
  & If<S, {
  /**
   * The signal returning `true` if the function is supported by
   * the current Mini Apps version including some possible additional
   * conditions.
   *
   * It is highly recommended to use this signal only in certain narrow cases
   * when only the function support check is required.
   *
   * This signal is not applying additional operations like checking if the
   * current environment is Mini Apps and the SDK is initialized.
   *
   * To check if the function is available for use, use the `isAvailable`
   * signal.
   *
   * @returns True if this function is supported.
   * @see isAvailable
   * @example
   * if (setMiniAppBottomBarColor.isSupported()) {
   *   console.log('Mini App bottom bar is supported, but the function is still probably unavailable');
   * }
   */
  isSupported: Computed<boolean>;
}, {}>

interface Options {
  component?: string;
  method: string;
  isMounted?: () => boolean;
  isSupported?: IsSupported;
}

/**
 * Adds the `isAvailable` and `isSupported` signals to the function checking
 * if the function call is safe.
 */

/*@__NO_SIDE_EFFECTS__*/
export function wrapSafe<Fn extends AnyFn, O extends Options>(fn: Fn, {
  isSupported,
  isMounted,
  component,
  method,
}: O): SafeWrapped<Fn, O extends { isSupported: any } ? true : false> {
  const fullMethod = `${component ? `${component}.` : ''}${method}()`;

  const $isSupported = computed(() => {
    return isSupported
      ? Array.isArray(isSupported)
        // Mini Apps methods specified.
        ? isSupported.some(m => supports(m, $version()))
        // Mini Apps method specified.
        : supports(isSupported, $version())
      // Support function or Mini Apps method was not specified.
      // The function is supported by default then.
      : true;
    // fixme
    // return isSupported
    //   ? typeof isSupported === 'string'
    //     // Mini Apps method specified.
    //     ? supports(isSupported, $version())
    //     // Custom function specified.
    //     : isSupported()
    //   // Support function or Mini Apps method was not specified.
    //   // The function is supported by default then.
    //   : true;
  });

  const $isInitialized = computed(() => {
    return $version() !== '0.0';
  });
  const $isMounted = computed(() => {
    return !isMounted || isMounted();
  });

  return Object.assign(
    (...args: Parameters<Fn>): ReturnType<Fn> => {
      const errMessagePrefix = `Unable to call the ${fullMethod} method:`;

      if (isSSR() || !isTMA('simple')) {
        throw new TypedError(
          ERR_UNKNOWN_ENV,
          `${errMessagePrefix} it can't be called outside Mini Apps`,
        );
      }
      if (!$isInitialized()) {
        throw new TypedError(
          ERR_NOT_INITIALIZED,
          `${errMessagePrefix} the SDK was not initialized. Use the SDK init() function`,
        );
      }
      if (!$isSupported()) {
        throw new TypedError(
          ERR_NOT_SUPPORTED,
          `${errMessagePrefix} it is unsupported${
            typeof isSupported === 'string'
              ? ` in Mini Apps version ${$version()}`
              : ''
          }`,
        );
      }
      if (!$isMounted()) {
        throw new TypedError(
          ERR_NOT_MOUNTED,
          `${errMessagePrefix} the component is not mounted. Use the ${component}.mount() method`,
        );
      }
      return fn(...args);
    },
    fn,
    {
      isAvailable: computed(
        () => isTMA('simple')
          && !isSSR()
          && $isInitialized()
          && $isSupported()
          && $isMounted(),
      ),
    },
    isSupported ? {
      isSupported: $isSupported,
    } : {},
  ) as SafeWrapped<Fn, O extends { isSupported: any } ? true : false>;
}
