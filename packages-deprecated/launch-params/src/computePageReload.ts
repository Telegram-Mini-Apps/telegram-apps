import { getFirstNavigationEntry } from './getFirstNavigationEntry.js';

/**
 * Determines if current page was reloaded.
 * @returns Boolean if function was able to compute any valid value. Null in case, no
 * navigation entries were found.
 */
export function computePageReload(): boolean | null {
  const firstNavigationEntry = getFirstNavigationEntry();
  return firstNavigationEntry
    ? firstNavigationEntry.type === 'reload'
    : null;
}
