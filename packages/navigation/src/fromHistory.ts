import { array, json, number, string } from '@tma.js/parsing';

import { Navigator } from './Navigator.js';
import type { NavigatorOptions, HistoryCurrentState } from './types.js';

const parser = json<HistoryCurrentState>({
  cursor: number(),
  history: array().of(
    json({
      pathname: string(),
      search: string(),
    }),
  ),
});

/**
 * Attempts to create a navigator from the current browser history state. This function will
 * properly work in case, the last time browser history was managed by some other `Navigator`.
 *
 * Method returns null in case, it was unable to create `Navigator`.
 * @param options - options passed to constructor.
 */
export function fromHistory(options?: NavigatorOptions): Navigator | null {
  try {
    const state = parser.parse(window.history.state);

    return state ? new Navigator(state.history, state.cursor, options) : null;
  } catch (e) {
    return null;
  }
}
