import {PostEventName, supports} from 'twa-bridge';
import {Version} from 'twa-core';

export type SupportChecker<Method extends string> = (
  method: Method,
  version: Version,
) => boolean;

/**
 * Function which applies schema, which is record with keys as method names
 * and values as bridge post event name or names. It returns function which
 * validates if specified method name is supported assuming, it uses specified
 * bridge event names.
 * @param schema - validation schema.
 */
export function createSupportChecker<Method extends string>(
  schema: Record<Method, PostEventName | PostEventName[]>,
): SupportChecker<Method> {
  const formattedSchema = Object
    .entries(schema)
    .reduce((acc, [method, deps]) => {
      (acc as any)[method] = Array.isArray(deps) ? deps : [deps];
      return acc;
    }, {} as Record<Method, PostEventName[]>);

  return (method, version) => {
    for (let i = 0; i < formattedSchema[method].length; i++) {
      if (!supports(formattedSchema[method][i], version)) {
        return false;
      }
    }
    return true;
  };
}