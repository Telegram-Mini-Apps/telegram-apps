import { array, json, number, string } from '@tma.js/parsing';

import { HashNavigator } from './HashNavigator.js';
import type { NavigatorOptions, NavigatorState } from '../types.js';

const parser = json<NavigatorState>({
  cursor: number(),
  entries: array().of(
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
 *
 * FIXME: This method will not work as expected in Telegram Web. Learn more:
 *  https://github.com/Telegram-Mini-Apps/tma.js/issues/150
 * @param options - options passed to constructor.
 */
export function fromHistory(options?: NavigatorOptions): HashNavigator | null {
  try {
    const state = parser.parse(window.history.state);

    return state ? new HashNavigator(state.entries, state.cursor, options) : null;
  } catch (e) {
    return null;
  }
}
