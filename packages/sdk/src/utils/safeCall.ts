export type SafeCallResult<Data, Error> = [ok: true, data: Data] | [ok: false, error: Error];

/**
 * Calls the function and prevents it from throwing error. It returns an object
 * with one of two properties: `result` or `error`.
 *
 * You can use this function to safely execute any other function.
 * @param fn - function to call.
 */
export function safeCall<T, E = unknown>(fn: () => T): SafeCallResult<T, E> {
  try {
    return [true, fn()];
  } catch (error) {
    return [false, error as E];
  }
}
