import { BrowserNavigator } from '@/navigation/BrowserNavigator/BrowserNavigator.js';
import type { BrowserNavigatorHashMode } from '@/navigation/BrowserNavigator/types.js';

/**
 * Creates a new `BrowserNavigator` from the window.location.
 * @param hashMode - hash navigation mode. Omit, if non-hash mode is required.
 */
export function createBrowserNavigatorFromLocation<State = {}>(
  hashMode?: BrowserNavigatorHashMode,
): BrowserNavigator<State> {
  const { href, hash } = window.location;

  return new BrowserNavigator<State>([
    new URL(hashMode ? hash.slice(1) : href, href),
  ], 0, hashMode);
}
