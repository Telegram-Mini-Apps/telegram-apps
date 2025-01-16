export type SafeCallResult<Data, Error> = [ok: true, data: Data] | [ok: false, error: Error];

/**
 * Calls the function and prevents it from throwing an error.
 * Instead, it handles the error and returns it as a value.
 * The returned tuple reminds tuples in GoLang.
 *
 * You can use this function to safely execute any other function.
 * @param fn - function to call.
 * @returns A tuple with either true on the first place and date on the second if the call
 * is successful, or false on the first place and error on the second if something went wrong.
 */
export function safeCall<T, E = unknown>(fn: () => T): SafeCallResult<T, E> {
  try {
    return [true, fn()];
  } catch (error) {
    return [false, error as E];
  }
}
