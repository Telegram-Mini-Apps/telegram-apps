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
 * Error thrown in case, there was an error during parsing.
 */
export class ParseError extends Error {
  /**
   * Parser name.
   */
  public readonly type?: string;

  constructor(public readonly value: unknown, { cause, type }: Options = {}) {
    super(`Unable to parse value${type ? ` as ${type}` : ''}`, { cause });
    Object.setPrototypeOf(this, ParseError.prototype);
    this.type = type;
  }
}
