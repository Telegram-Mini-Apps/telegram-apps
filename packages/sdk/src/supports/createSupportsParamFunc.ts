import { supports } from './supports.js';
import type { SupportsFunc } from './types.js';
import type { MiniAppsMethodVersionedParams, MiniAppsMethodWithVersionedParams } from '../bridge/index.js';
import type { Version } from '../version/index.js';

type HasCheckSupportMethodTuple = {
  [M in MiniAppsMethodWithVersionedParams]: [M, MiniAppsMethodVersionedParams<M>]
}[MiniAppsMethodWithVersionedParams];

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
