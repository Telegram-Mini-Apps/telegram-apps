/**
 * Error thrown in case, unsupported method was called.
 */
export class MethodUnsupportedError extends Error {
  constructor(method: string, version: string) {
    super(
      `Method "${method}" is not supported in the Web Apps version ${version}.`,
    );
    Object.setPrototypeOf(this, MethodUnsupportedError.prototype);
  }
}
