import { parseAsHistoryCurrentState } from './parsing.js';
import { Navigator } from './Navigator.js';
import type { NavigatorOptions } from './types.js';

/**
 * Attempts to create a navigator from the current browser history. This will properly work
 * in case, the last time browser history was managed by some navigator.
 *
 * Method returns true in case, it was unable to create Navigator.
 * @param options - options passed to constructor.
 */
export function fromHistory(options?: NavigatorOptions): Navigator | null {
  const state = parseAsHistoryCurrentState(window.history.state);

  return state ? new Navigator(state.history, state.cursor, options) : null;
}
