import { ensurePrefix } from '@/browser/ensurePrefix.js';
import { urlToPath } from '@/browser/urlToPath.js';
import type { BrowserNavigatorAnyHistoryItem } from '@/browser/BrowserNavigator/types.js';

interface PrepareItemResult<State> {
  id?: string;
  pathname: string;
  params: {
    hash: string;
    search: string;
    state?: State;
  };
}

/**
 * Converts a path, presented as a string to a basic navigator appropriate form.
 * @param path - full path.
 * @param relativePath - relative path.
 * @param state - history item state.
 */
export function prepareItem<State>(
  path: string,
  relativePath: string,
  state?: State,
): PrepareItemResult<State>;

/**
 * Converts a path, presented as an object to a basic navigator appropriate form.
 * @param item - history item data.
 * @param relativePath - relative path.
 */
export function prepareItem<State>(
  item: BrowserNavigatorAnyHistoryItem<State>,
  relativePath: string,
): PrepareItemResult<State>;

export function prepareItem<State>(
  itemOrPath: string | BrowserNavigatorAnyHistoryItem<State>,
  relativePath: string,
  state?: State,
): PrepareItemResult<State> {
  let path: string;
  let id: string | undefined;

  if (typeof itemOrPath === 'string') {
    path = itemOrPath;
  } else {
    path = urlToPath(itemOrPath);
    state = itemOrPath.state;
    id = itemOrPath.id;
  }

  const { pathname, search, hash } = new URL(path, `http://a${ensurePrefix(relativePath, '/')}`);
  return { id, pathname, params: { hash, search, state } };
}
