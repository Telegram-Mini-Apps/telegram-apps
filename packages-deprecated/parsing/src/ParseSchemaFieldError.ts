interface Options {
  /**
   * Type name.
   */
  type?: string;

  /**
   * Original occurred error.
   */
  cause?: unknown;
}

/**
 * Error thrown in case, there was an error during parse.
 */
export class ParseSchemaFieldError extends Error {
  constructor(field: string, { cause, type }: Options = {}) {
    super(`Unable to parse field "${field}"${type ? ` as ${type}` : ''}`, { cause });
    Object.setPrototypeOf(this, ParseSchemaFieldError.prototype);
  }
}
