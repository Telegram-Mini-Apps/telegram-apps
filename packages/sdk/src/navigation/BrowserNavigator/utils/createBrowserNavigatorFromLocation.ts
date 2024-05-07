import { BrowserNavigator } from '@/navigation/BrowserNavigator/BrowserNavigator.js';
import type { BrowserNavigatorConOptions } from '@/navigation/BrowserNavigator/types.js';

/**
 * Creates a new `BrowserNavigator` from the window.location.
 * @param options - BrowserNavigator constructor options.
 */
export function createBrowserNavigatorFromLocation<State = {}>(
  options?: BrowserNavigatorConOptions,
): BrowserNavigator<State> {
  const opt = options || {};
  const { href, hash } = window.location;

  return new BrowserNavigator<State>([
    new URL(opt.hashMode ? hash.slice(1) : href, href),
  ], 0, opt);
}
