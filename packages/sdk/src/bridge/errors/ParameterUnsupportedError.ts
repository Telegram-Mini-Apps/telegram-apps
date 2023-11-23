import type { Version } from '~/version/index.js';

import type { MiniAppsMethodName } from '../methods/index.js';

/**
 * Error thrown in case, unsupported parameter was used.
 */
export class ParameterUnsupportedError extends Error {
  constructor(method: MiniAppsMethodName, param: string, version: Version) {
    super(`Parameter "${param}" in method "${method}" is unsupported in the Mini Apps version ${version}.`);
    Object.setPrototypeOf(this, ParameterUnsupportedError.prototype);
  }
}
