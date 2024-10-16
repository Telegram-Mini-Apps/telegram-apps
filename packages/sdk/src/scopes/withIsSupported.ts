import { type MethodName, supports, TypedError } from '@telegram-apps/bridge';

import { $version } from '@/scopes/globals.js';
import { ERR_NOT_SUPPORTED } from '@/errors.js';

export type WithIsSupported<F extends (...args: any) => any> = F & {
  /**
   * @returns True, if this function is supported.
   */
  isSupported(): boolean;
};

/**
 * Adds the "isSupported" method to the passed function returning true, if the current Mini Apps
 * version supports passed Mini Apps method.
 *
 * Also, if the "isSupported" method returned true during the function execution,
 * the ERR_NOT_SUPPORTED error will be thrown.
 * @param fn - function to extend.
 * @param miniAppsMethod - Mini Apps method.
 * @param additionalCheck - additional function to be called along with method support.
 */

/*@__NO_SIDE_EFFECTS__*/
export function withIsSupported<F extends (...args: any) => any>(
  fn: F,
  method: MethodName,
  // todo: refactor it
  additionalCheck?: () => boolean,
): WithIsSupported<F> {
  function isSupported() {
    return supports(method, $version()) && (!additionalCheck || additionalCheck());
  }

  return Object.assign(((...args) => {
    if (!isSupported()) {
      throw new TypedError(ERR_NOT_SUPPORTED);
    }
    fn(...args);
  }) as F, {
    isSupported,
  });
}
