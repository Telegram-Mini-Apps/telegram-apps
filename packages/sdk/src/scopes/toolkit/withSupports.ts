import {
  MethodNameWithVersionedParams,
  MethodVersionedParams,
  supports, TypedError,
} from '@telegram-apps/bridge';
import { $version } from '@/scopes/globals.js';
import { ERR_NOT_SUPPORTED } from '@/errors.js';

type HasCheckSupportMethodTuple<FnArgs extends any[]> = {
  [M in MethodNameWithVersionedParams]: [
    method: M,
    parameter: MethodVersionedParams<M>,
    shouldCheck: (...args: FnArgs) => boolean,
  ]
}[MethodNameWithVersionedParams];

export type WithSupports<
  F extends (...args: any) => any,
  S extends Record<string, unknown>
> = F & {
  /**
   * @returns True, if this function is supported.
   */
  supports(method: keyof S): boolean;
};

/**
 * Adds the "supports" method to the passed function returning true, if specified action is
 * supported by the current Mini Apps version.
 *
 * Wrapped function throws an error in case, the passed arguments are subject to check for one
 * of the schema properties.
 * @param fn - function to extend.
 * @param schema - map where key is an action name and value is a tuple containing Mini Apps
 * method name and its option.
 */

/*@__NO_SIDE_EFFECTS__*/
export function withSupports<
  F extends (...args: any) => any,
  S extends Record<string, HasCheckSupportMethodTuple<Parameters<F>>>,
>(fn: F, schema: S): WithSupports<F, S> {
  function sup(param: keyof S): boolean {
    const tuple = schema[param];
    return supports(tuple[0], tuple[1], $version());
  }

  return Object.assign(
    (...args: Parameters<F>): ReturnType<F> => {
      for (const k in schema) {
        if (schema[k][2](...args) && !sup(k)) {
          throw new TypedError(ERR_NOT_SUPPORTED, `Parameter "${k}" is not supported`);
        }
      }
      return fn(...args);
    },
    fn,
    { supports: sup },
  );
}