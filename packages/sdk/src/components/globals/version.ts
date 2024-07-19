import { signal } from '@/reactivity/signal.js';
import { SDKError } from '@/errors/SDKError.js';
import { ERR_SDK_NOT_INITIALIZED } from '@/errors/errors.js';
import type { Version } from '@/version/types.js';

const [
  _get,
  set,
  track,
  untrack,
  untrackAll,
] = signal('');

/**
 * Returns a currently supported maximum Mini Apps version.
 * @throws {SDKError} ERR_SDK_NOT_INITIALIZED
 * @see ERR_SDK_NOT_INITIALIZED
 */
export function get(): Version {
  const v = _get();
  if (!v) {
    throw new SDKError(
      ERR_SDK_NOT_INITIALIZED,
      'SDK was not initialized. Consider using the init() method before trying to access this accessor',
    );
  }
  return v;
}

export {
  /**
   * Updates the currently supported maximum Mini Apps version.
   */
  set,
  /**
   * Adds a new listener tracking the currently supported maximum Mini Apps version changes.
   */
    track,
  /**
   * Removes a listener tracking the currently supported maximum Mini Apps version changes.
   */
    untrack,
  /**
   * Removes all listeners tracking the currently supported maximum Mini Apps version changes.
   */
    untrackAll,
};