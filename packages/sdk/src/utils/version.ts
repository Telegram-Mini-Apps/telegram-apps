import {PostEventName, supports} from '@twa.js/bridge';
import {Version} from '@twa.js/utils';

type SupportsFunc<Method extends string> = (
  method: Method,
) => boolean;

/**
 * Function which applies schema, which is record with keys as method names
 * and values as bridge post event name or names. It returns function which
 * validates if specified method name is supported assuming, it uses specified
 * bridge event names.
 * @param version - Web Apps version.
 * @param schema - validation schema.
 */
function createSupportsFunc<Method extends string>(
  version: Version,
  schema: Record<Method, PostEventName>,
): SupportsFunc<Method> {
  return method => supports(schema[method], version);
}

export {SupportsFunc, createSupportsFunc};
