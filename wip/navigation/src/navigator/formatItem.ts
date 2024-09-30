import { urlToPath } from '@/url/urlToPath.js';
import { createSafeURL } from '@/url/createSafeURL.js';

import type { AnyHistoryItem, HistoryItem } from './types.js';

/**
 * Converts any known history item type to the local one.
 * @param item - navigator constructor history item.
 */
export function formatItem<State>(item: AnyHistoryItem<State>): Readonly<HistoryItem<State>>;

/**
 * Converts any known history item type to the local one.
 * @param item - push or replace method item.
 * @param relativePath - entry relative path.
 */
export function formatItem<State>(
  item: Partial<HistoryItem<State>>,
  relativePath: string,
): Readonly<HistoryItem<State>>;

/**
 * Converts any known history item type to the local one.
 * @param item - push or replace method item.
 * @param state - item state.
 * @param relativePath - entry relative path.
 */
export function formatItem<State>(
  item: string,
  state: State | undefined,
  relativePath: string,
): Readonly<HistoryItem<State>>;

export function formatItem<State>(
  arg1: Partial<HistoryItem<State>> | AnyHistoryItem<State>,
  arg2?: string | State,
  arg3?: string,
): Readonly<HistoryItem<State>> {
  let id: string | undefined;
  let state: State | undefined;
  let relativePath: string | undefined;

  if (typeof arg1 === 'object') {
    id = arg1.id;
    state = arg1.state as State;
  }

  if (typeof arg3 === 'string') {
    // Override 3.
    state = arg2 as State;
    relativePath = arg3;
  } else if (typeof arg2 === 'string') {
    // Override 2.
    relativePath = arg2 as string;
  }

  const url = new URL(urlToPath(arg1), createSafeURL(relativePath || ''));
  return Object.freeze({
    id: id || ((Math.random() * 2 ** 14) | 0).toString(16),
    pathname: url.pathname,
    hash: url.hash,
    search: url.search,
    state,
  });
}
