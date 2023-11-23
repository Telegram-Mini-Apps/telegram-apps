import type { Version } from '@tma.js/utils';

import type { MethodName } from '../methods/index.js';

/**
 * Error thrown in case, unsupported parameter was used.
 */
export class ParameterUnsupportedError extends Error {
  constructor(method: MethodName, param: string, version: Version) {
    super(`Parameter "${param}" in method "${method}" is unsupported in the Mini Apps version ${version}.`);
    Object.setPrototypeOf(this, ParameterUnsupportedError.prototype);
  }
}
