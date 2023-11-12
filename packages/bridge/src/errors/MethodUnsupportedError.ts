import type { Version } from '@tma.js/utils';

import type { MethodName } from '../methods/index.js';

/**
 * Error thrown in case, unsupported method was called.
 */
export class MethodUnsupportedError extends Error {
  constructor(method: MethodName, version: Version) {
    super(`Method "${method}" is unsupported in the Mini Apps version ${version}.`);
    Object.setPrototypeOf(this, MethodUnsupportedError.prototype);
  }
}
