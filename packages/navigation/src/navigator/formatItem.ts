import { urlToPath } from '../url/urlToPath.js';
import { createSafeURL } from '../url/createSafeURL.js';
import type { AnyHistoryItem, HistoryItem } from './types.js';

interface Options<State> {
  /**
   * Relative path.
   */
  relativePath?: string;
  /**
   * Item state.
   */
  state?: State;
}

/**
 * Converts any known history item type to the local one.
 * @param itemOrPath - history item presented as a string or an object.
 * @param options - additional options.
 */
export function formatItem<State>(
  itemOrPath: string | AnyHistoryItem<State>,
  options?: Options<State>,
): Readonly<HistoryItem<State>> {
  let path: string;
  let id: string | undefined;
  let state: State | undefined;
  options ||= {};

  if (typeof itemOrPath === 'string') {
    path = itemOrPath;
    state = options.state;
  } else {
    path = urlToPath(itemOrPath);
    state = itemOrPath.state;
    id = itemOrPath.id;
  }

  const url = new URL(path, createSafeURL(options.relativePath || ''));
  return Object.freeze({
    id: id || ((Math.random() * 2 ** 14) | 0).toString(16),
    pathname: url.pathname,
    hash: url.hash,
    search: url.search,
    state,
  });
}
