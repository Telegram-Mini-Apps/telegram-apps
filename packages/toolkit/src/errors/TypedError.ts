export interface TypedErrorOptions {
  message?: string;
  cause?: unknown;
}

export class TypedError<T extends string> extends Error {
  constructor(type: T, options?: TypedErrorOptions);
  constructor(type: T, message?: string, cause?: unknown);
  constructor(public readonly type: T, messageOrOptions?: string | TypedErrorOptions, cause?: unknown) {
    super(
      typeof messageOrOptions === 'object' ? messageOrOptions.message : messageOrOptions || type,
      {
        cause: typeof messageOrOptions === 'object' ? messageOrOptions.cause : cause,
      },
    );
    Object.setPrototypeOf(this, TypedError.prototype);
  }
}
