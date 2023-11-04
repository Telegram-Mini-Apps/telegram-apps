/**
 * Error thrown in case, unsupported parameter was used.
 */
export class ParameterUnsupportedError extends Error {
  constructor(method: string, param: string, version: string) {
    super(`Parameter "${param}" in method "${method}" is not supported in the Mini Apps version ${version}.`);
    Object.setPrototypeOf(this, ParameterUnsupportedError.prototype);
  }
}
