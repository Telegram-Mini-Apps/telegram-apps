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

interface CustomSupportValidator {
  fn: () => boolean;
  error: string;
}

export type IsSupported =
  | MethodName
  | CustomSupportValidator
  | (MethodName | CustomSupportValidator)[]
  | { any: (MethodName | CustomSupportValidator)[] };

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
  isMounted?: () => boolean;
  isSupported?: IsSupported;
}

export function wrapSafe<Fn extends AnyFn>(
  method: string,
  fn: Fn,
): SafeWrapped<Fn, false>;

export function wrapSafe<Fn extends AnyFn, O extends Options>(
  method: string,
  fn: Fn,
  options: O,
): SafeWrapped<Fn, O extends { isSupported: any } ? true : false>

/*@__NO_SIDE_EFFECTS__*/
export function wrapSafe<Fn extends AnyFn>(
  method: string,
  fn: Fn,
  { isSupported, isMounted, component }: Options = {},
): SafeWrapped<Fn, boolean> {
  // Full function identifier.
  const fullName = `${component ? `${component}.` : ''}${method}()`;

  // Simplify the isSupported value to work with an array of validators or a single object.
  isSupported = isSupported
    ? Array.isArray(isSupported)
      // (MethodName | CustomSupportValidator)[]
      ? isSupported
      : typeof isSupported === 'object' && 'any' in isSupported
        // { any: (MethodName | CustomSupportValidator)[] }
        ? isSupported
        // MethodName | CustomSupportValidator
        : [isSupported]
    : undefined;

  /**
   * @returns An error related to support check.
   */
  const supportError = (): string | undefined => {
    // isSupported was not specified. In this case we assume that the function has no dependencies
    // and is always supported.
    if (!isSupported) {
      return;
    }

    const defaultErr = `it is unsupported in Mini Apps version ${$version()}`;

    function getError(item: MethodName | CustomSupportValidator): string | undefined {
      return typeof item === 'string'
        ? supports(item, $version())
          ? undefined
          : defaultErr
        : item.fn()
          ? undefined
          : item.error;
    }

    // Should check each array item.
    // (MethodName | CustomSupportValidator)[]
    if (Array.isArray(isSupported)) {
      for (const item of isSupported) {
        const err = getError(item);
        if (err) {
          return err;
        }
      }
      return;
    }

    // Should check if any item didn't return an error.
    let lastErr: string | undefined;
    for (const item of isSupported.any) {
      lastErr = getError(item);
      if (!lastErr) {
        return;
      }
    }
    return defaultErr;
  };

  const $isSupported = computed(() => !supportError());
  const $isInitialized = computed(() => $version() !== '0.0');
  const $isMounted = computed(() => !isMounted || isMounted());

  return Object.assign(
    (...args: Parameters<Fn>): ReturnType<Fn> => {
      const errMessagePrefix = `Unable to call the ${fullName} ${component ? 'method' : 'function'}:`;

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
      const supportErr = supportError();
      if (supportErr) {
        throw new TypedError(ERR_NOT_SUPPORTED, `${errMessagePrefix} ${supportErr}`);
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
  );
}
