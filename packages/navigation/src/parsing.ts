import { array, json, number, string } from '@tma.js/parsing';

import { toPathname } from './utils.js';

import type { HistoryCurrentState, HistoryEntry, Pathname } from './types.js';

const parser = json<HistoryCurrentState>({
  cursor: number(),
  history: array().of(json<HistoryEntry>({
    pathname: (value) => {
      const formatted = string().parse(value);

      if (formatted === toPathname(formatted)) {
        return formatted as Pathname;
      }
      throw new TypeError(`Unable to parse value "${formatted}" as RGB.`);
    },
    search: string(),
  })),
});

/**
 * Attempts to parse value as HistoryCurrentState.
 * @param value - value to parse.
 */
export function parseAsHistoryCurrentState(value: unknown): HistoryCurrentState | null {
  try {
    return parser.parse(value);
  } catch (e) {
    return null;
  }
}
