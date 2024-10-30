import type { AnyFn } from '@/types.js';
import { MethodName, supports, TypedError } from '@telegram-apps/bridge';
import { $version } from '@/scopes/globals.js';
import { ERR_NOT_MOUNTED, ERR_NOT_SUPPORTED } from '@/errors.js';

export type SafeWrap<Fn extends AnyFn, O extends Options> =
  & Fn
  & {
  /**
   * @returns True if the call function is safe in terms of support and
   * mount checks.
   */
  isAvailable: () => boolean;
}
  & (
  O extends { isSupported: any }
    ? {
      /**
       * @returns True if this function is supported.
       */
      isSupported: () => boolean;
    }
    : {}
  );

interface Options {
  component: string;
  method: string;
  isMounted: () => boolean;
  isSupported?: MethodName | (() => boolean),
}

/**
 * Adds the isAvailable method to the function checking if the
 * function call is safe in terms of support and mount checks.
 * @param fn - function to wrap.
 * @param isSupported - signal returning true if the function is supported.
 * @param isMounted - signal returning true if the component is mounted.
 */

/*@__NO_SIDE_EFFECTS__*/
export function safeWrap<Fn extends AnyFn, O extends Options>(
  fn: Fn,
  {
    isSupported: isSupportedOrMethod,
    isMounted,
    component,
    ...options
  }: Options,
): SafeWrap<Fn, O> {
  const methodName = `${component}.${options.method}()`;

  let isSupported: (() => boolean) | undefined;
  if (isSupportedOrMethod) {
    isSupported = () => {
      return typeof isSupportedOrMethod === 'string'
        ? supports(isSupportedOrMethod, $version())
        : isSupportedOrMethod();
    };
  }

  function isAvailable(): boolean {
    return isMounted() && (!isSupported || isSupported());
  }

  return Object.assign(
    (...args: Parameters<Fn>): ReturnType<Fn> => {
      if (isSupported && !isSupported()) {
        throw new TypedError(
          ERR_NOT_SUPPORTED,
          `${methodName} method is not supported in version ${$version()}`,
        );
      }
      if (!isMounted()) {
        throw new TypedError(
          ERR_NOT_MOUNTED,
          `${component} component is not mounted`,
        );
      }
      return fn(...args);
    },
    fn,
    { isAvailable },
    isSupported ? { isSupported } : {},
  ) as SafeWrap<Fn, O>;
}

export function createSafeWrap(
  component: string,
  isMounted: () => boolean,
) {

}