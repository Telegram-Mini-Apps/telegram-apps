import { supports } from './supports.js';
import type { SupportsFunc } from './types.js';
import type { MiniAppsMethodName } from '../bridge/index.js';
import type { Version } from '../version/index.js';

/**
 * Returns function, which accepts predefined method name and checks if it is supported
 * via passed schema and version.
 * @param schema - object which contains methods names and TWA method as a dependency.
 * @param version - platform version.
 */
export function createSupportsFunc<M extends string>(
  version: Version,
  schema: Record<M, MiniAppsMethodName>,
): SupportsFunc<M> {
  return (method) => supports(schema[method], version);
}
