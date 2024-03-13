import type { Version } from '../../version/types.js';
import type { MiniAppsMethodName } from '../methods/methods.js';

/**
 * Error thrown in case, unsupported method was called.
 */
export class MethodUnsupportedError extends Error {
  constructor(method: MiniAppsMethodName, version: Version) {
    super(`Method "${method}" is unsupported in the Mini Apps version ${version}.`);
    Object.setPrototypeOf(this, MethodUnsupportedError.prototype);
  }
}
