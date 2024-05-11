import type {
  BasicNavigatorAnyHistoryItem,
  BasicNavigatorHistoryItem,
} from '@/navigation/BasicNavigator/types.js';

/**
 * Converts any known history item type to the local one.
 * @param item - history item presented as a string or an object.
 * @param relativePathname - relative pathname.
 */
export function prepareItem<Params>(
  item: BasicNavigatorAnyHistoryItem<Params>,
  relativePathname: string,
): Readonly<BasicNavigatorHistoryItem<Params>> {
  let pathname: string;
  let params: Params | undefined;
  let id: string | undefined;

  if (typeof item === 'string') {
    pathname = item;
  } else {
    pathname = item.pathname === undefined
      ? relativePathname
      : item.pathname;
    params = item.params;
    id = item.id;
  }

  return Object.freeze({
    id: id || ((Math.random() * 2 ** 14) | 0).toString(16),
    pathname,
    params,
  });
}
