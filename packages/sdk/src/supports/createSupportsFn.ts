import type { MiniAppsMethodName } from '@/bridge/methods/types/methods.js';
import { supports } from '@/supports/supports.js';
import type { SupportsFn } from '@/supports/types.js';
import type { Version } from '@/version/types.js';

export type SupportsSchema<Method extends string> = Record<Method, MiniAppsMethodName>;

/**
 * Returns function, which accepts predefined method name and checks if it is supported
 * via passed schema and version.
 * @param schema - object which contains methods names and TWA method as a dependency.
 * @param version - platform version.
 */
export function createSupportsFn<Method extends string>(
  version: Version,
  schema: SupportsSchema<Method>,
): SupportsFn<Method> {
  return (method) => supports(schema[method], version);
}
