import type {
  MiniAppsMethodVersionedParams,
  MiniAppsMethodWithVersionedParams,
} from '@/bridge/methods/types/methods.js';
import { supports } from '@/supports/supports.js';
import type { SupportsFn } from '@/supports/types.js';
import type { Version } from '@/version/types.js';

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
export function createSupportsParamFn<Method extends string>(
  version: Version,
  schema: Record<Method, HasCheckSupportMethodTuple>,
): SupportsFn<Method> {
  return (method) => {
    const [tmaMethod, param] = schema[method];

    return supports(tmaMethod, param, version);
  };
}
