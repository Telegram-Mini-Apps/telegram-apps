export { getFirstNavigationEntry } from './history/getFirstNavigationEntry.js';
export { isPageReload } from './history/isPageReload.js';

export { createNavigator } from './navigator/createNavigator.js';
export { createNavigatorFromLocation } from './navigator/createNavigatorFromLocation.js';
export { initNavigator, type InitNavigatorOptions } from './navigator/initNavigator.js';
export type {
  Navigator,
  NavigationType,
  AnyHistoryItem,
  BackButtonOptions,
  NavigatorCtrOptions,
  HistoryItem
} from './navigator/types.js';

export { createSafeURL } from './url/createSafeURL.js';
export type { URLLike } from './url/types.js';
export { urlToPath } from './url/urlToPath.js';

export { ensurePrefix } from './ensurePrefix.js';
export { ERR_HISTORY_EMPTY, ERR_CURSOR_INVALID } from './errors.js';
