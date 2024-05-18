import { createError } from '@/errors/createError.js';
import { ERR_INVALID_PATH_BASE } from '@/errors/errors.js';
import { BrowserNavigator } from '@/navigation/BrowserNavigator/BrowserNavigator.js';
import { getPathname } from '@/navigation/getPathname.js';
import { urlToPath } from '@/navigation/urlToPath.js';
import type { BrowserNavigatorConOptions } from '@/navigation/BrowserNavigator/types.js';

export function createBrowserNavigatorFromLocation<State>(
  options?: BrowserNavigatorConOptions,
): BrowserNavigator<State> {
  options ||= {};
  const { href, hash } = window.location;

  let path = urlToPath(
    options.hashMode === null
      // Hash mode is explicitly disabled. We are working with the usual location path.
      ? href
      // If hash mode is enabled, we should create a navigator based on the location's hash.
      // In this case we have 2 possible situations:
      // 1. Hash contains only launch parameters. Example:
      // #tgWebAppData=...&tgWebAppPlatform=...&...
      // Here we should mark the launch parameters as query parameters and have pathname "/" as
      // the initial one.
      //
      // 2. Hash contains value, passed from above and launch parameters as query parameters.
      // For instance, we could have such a URL:
      // https://t.me/mybot/myapp#my-hash
      // In this case, the Mini App will be opened with this URL:
      // https://example.com/#my-hash?tgWebAppData=...&tgWebAppPlatform=...&...
      : hash.includes('?') ? hash.slice(1) : `?${hash.slice(1)}`,
  );

  // If some base was specified, we should check if computed path starts with this base. In
  // case it does, it should be removed from the path. Otherwise, an error must be thrown.
  const base = options.base ? getPathname(options.base) : undefined;
  if (base) {
    if (!path.startsWith(base)) {
      throw createError(
        ERR_INVALID_PATH_BASE,
        `Path "${path}" expected to be starting with "${base}"`,
      );
    }
    path = path.slice(base.length);
  }

  return new BrowserNavigator<State>([path], 0, options);
}
