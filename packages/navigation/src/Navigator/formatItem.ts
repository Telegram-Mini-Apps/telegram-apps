import type { AnyNavigatorHistoryItem, NavigatorHistoryItem } from './types.js';

/**
 * Converts any known history item type to the local one.
 * @param item - history item presented as a string or an object.
 */
export function formatItem<Params>(item: AnyNavigatorHistoryItem<Params>): NavigatorHistoryItem<Params> {
  let pathname: string;
  let params: Params | undefined;
  let id: string | undefined;

  if (typeof item === 'string') {
    pathname = item;
  } else {
    pathname = item.pathname;
    params = item.params;
    id = item.id;
  }

  return {
    id: id || ((Math.random() * 2 ** 14) | 0).toString(16),
    pathname,
    params,
  };
}
