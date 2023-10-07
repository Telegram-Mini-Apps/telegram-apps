interface Options {
  /**
   * Type name.
   */
  type?: string;
  /**
   * Original occurred error.
   */
  error?: unknown;
  /**
   * Field name.
   */
  field?: string;
}

/**
 * Error thrown in case, there was an error during parse.
 */
export class ParsingError extends Error {
  constructor(value: unknown, { type, error, field }: Options = {}) {
    super(`Unable to parse ${field ? `field "${field}"` : 'value'} as ${type}`, {
      cause: { value, error },
    });
    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}
