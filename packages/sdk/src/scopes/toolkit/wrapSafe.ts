import {
  ERR_UNKNOWN_ENV,
  type If,
  type MethodName,
  supports,
  isTMA,
  TypedError,
  type MethodNameWithVersionedParams,
  type MethodVersionedParams, IsNever,
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

type HasCheckSupportMethodTuple<FnArgs extends any[]> = {
  [M in MethodNameWithVersionedParams]: [
    method: M,
    parameter: MethodVersionedParams<M>,
    shouldCheck: (...args: FnArgs) => boolean,
  ]
}[MethodNameWithVersionedParams];

interface CustomSupportValidator {
  fn: () => boolean;
  error: string;
}

export type IsSupported =
  | MethodName
  | CustomSupportValidator
  | (MethodName | CustomSupportValidator)[]
  | { any: (MethodName | CustomSupportValidator)[] };

export type Supports<Fn extends AnyFn> = Record<string, HasCheckSupportMethodTuple<Parameters<Fn>>>

export type SafeWrapped<
  Fn extends AnyFn,
  Supported extends boolean,
  SupportsSchema extends Record<string, any>
> =
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
  /**
   * Calls the function only in case it is available.
   * @example
   * showBackButton.ifAvailable();
   */
  ifAvailable(...args: Parameters<Fn>): ReturnType<Fn> | undefined;
}
  & If<Supported, {
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
  & If<IsNever<SupportsSchema>, {}, {
  /**
   * A map where the key is the function-specific option name and value is a signal indicating
   * if it is supported by the current environment.
   * @example
   * if (setHeaderColor.isAvailable()) {
   *   if (setHeaderColor.supports.rgb()) {
   *     setHeaderColor('#ffaabb');
   *   } else {
   *     setHeaderColor('bg_color');
   *   }
   * }
   */
  supports: Record<keyof SupportsSchema, Computed<boolean>>
}>

interface Options<Fn extends AnyFn> {
  component?: string;
  isMounted?: () => boolean;
  isSupported?: IsSupported;
  supports?: Supports<Fn>,
}

export function wrapSafe<Fn extends AnyFn>(
  method: string,
  fn: Fn,
): SafeWrapped<Fn, false, never>;

export function wrapSafe<Fn extends AnyFn, O extends Options<Fn>>(
  method: string,
  fn: Fn,
  options: O,
): SafeWrapped<
  Fn,
  O extends { isSupported: any } ? true : false,
  O extends { supports: infer S extends Record<string, any> } ? S : never
>

/*@__NO_SIDE_EFFECTS__*/
export function wrapSafe<Fn extends AnyFn>(
  method: string,
  fn: Fn,
  { isSupported, isMounted, component, supports: supportsOption }: Options<Fn> = {},
): SafeWrapped<Fn, boolean, Record<string, any> | never> {
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
   * @returns True if the specified option is supported.
   * @param option - option name.
   */
  function isOptionSupported(option: string): boolean {
    if (supportsOption) {
      const tuple = supportsOption[option];
      return supports(tuple[0], tuple[1], $version());
    }
    return true;
  }

  /**
   * @returns An error related to isSupported() check.
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

  /**
   * @returns An error related to supports.<name> check.
   */
  const supportsOptionError = (...args: Parameters<Fn>): string | undefined => {
    if (supportsOption) {
      for (const k in supportsOption) {
        if (supportsOption[k][2](...args) && !isOptionSupported(k)) {
          return `option ${k} is not supported in Mini Apps version ${$version()}`;
        }
      }
    }
  };

  const $isSupported = computed(() => !supportError());
  const $isInitialized = computed(() => $version() !== '0.0');
  const $isMounted = computed(() => !isMounted || isMounted());
  const $isAvailable = computed(
    () => isTMA('simple')
      && !isSSR()
      && $isInitialized()
      && $isSupported()
      && $isMounted(),
  );

  let supportsMap: Record<string, Computed<boolean>> | undefined;
  if (supportsOption) {
    supportsMap = {};
    for (const option in supportsOption) {
      supportsMap[option] = computed(() => isOptionSupported(option));
    }
  }

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
      const supportsOptionErr = supportsOptionError(...args);
      if (supportsOptionErr) {
        throw new TypedError(ERR_NOT_SUPPORTED, `${errMessagePrefix} ${supportsOptionErr}`);
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
      isAvailable: $isAvailable,
      ifAvailable(...args: Parameters<Fn>): ReturnType<Fn> | undefined {
        return $isAvailable()
          ? fn(...args)
          : undefined;
      },
    },
    isSupported ? {
      isSupported: $isSupported,
    } : {},
    supportsMap ? {
      supports: supportsMap,
    } : {},
  );
}
