import {
  supports,
  type MethodVersionedParams,
  type MethodNameWithVersionedParams,
} from '@telegram-apps/bridge';

import { $version } from '@/scopes/globals.js';

type HasCheckSupportMethodTuple = {
  [M in MethodNameWithVersionedParams]: [M, MethodVersionedParams<M>]
}[MethodNameWithVersionedParams];

export type WithSupports<
  F extends (...args: any) => any,
  S extends Record<string, HasCheckSupportMethodTuple>
> = F & {
  /**
   * @returns True, if this function is supported.
   */
  supports(method: keyof S): boolean;
};

/**
 * Adds the "supports" method to the passed function returning true, if specified action is
 * supported by the current Mini Apps version.
 * @param fn - function to extend.
 * @param schema - map where key is an action name and value is a tuple containing Mini Apps
 * method name and its option.
 */

/*@__NO_SIDE_EFFECTS__*/
export function withSupports<
  F extends (...args: any) => any,
  S extends Record<string, HasCheckSupportMethodTuple>,
>(fn: F, schema: S): WithSupports<F, S> {
  return Object.assign(fn, {
    supports(method: keyof S): boolean {
      const tuple = schema[method];
      return supports(tuple[0], tuple[1], $version());
    },
  });
}
