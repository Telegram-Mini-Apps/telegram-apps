import type { Version } from '@tma.js/utils';
import {
  supports,
  type MethodName,
  type MethodVersionedParams,
  type MethodWithVersionedParams,
} from '@tma.js/bridge';

export type SupportsFunc<M extends string> = (method: M) => boolean;

type HasCheckSupportMethodTuple = {
  [M in MethodWithVersionedParams]: [M, MethodVersionedParams<M>]
}[MethodWithVersionedParams];

/**
 * Returns function, which accepts predefined method name and checks if it is supported
 * via passed schema and version.
 * @param schema - object which contains methods names and TWA method as a dependency.
 * @param version - platform version.
 */
export function createSupportsFunc<M extends string>(
  version: Version,
  schema: Record<M, MethodName>,
): SupportsFunc<M> {
  return (method) => supports(schema[method], version);
}

/**
 * Returns function, which accepts predefined method name and checks if it is supported
 * via passed schema and version.
 * @param schema - object which contains methods names and TWA methods with specified parameter
 * as a dependency.
 * @param version - platform version.
 */
export function createSupportsParamFunc<P extends string>(
  version: Version,
  schema: Record<P, HasCheckSupportMethodTuple>,
): SupportsFunc<P> {
  return (method) => {
    const [tmaMethod, param] = schema[method];

    return supports(tmaMethod, param, version);
  };
}
