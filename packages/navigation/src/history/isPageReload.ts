import { getFirstNavigationEntry } from './getFirstNavigationEntry.js';

/**
 * @returns True, if the current page was reloaded.
 * @see https://stackoverflow.com/a/36444134/11894710
 */
export function isPageReload(): boolean {
  const entry = getFirstNavigationEntry();
  return !!entry && entry.type === 'reload';
}
