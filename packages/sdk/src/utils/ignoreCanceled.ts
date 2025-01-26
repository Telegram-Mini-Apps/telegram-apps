import { isCancelledError } from 'better-promises';

/**
 * Throw the value if is not CanceledError.
 * @param e - value to check.
 */
export function ignoreCanceled(e: unknown): never | void {
  if (!isCancelledError(e)) {
    throw e;
  }
}