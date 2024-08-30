import { urlToPath } from '@/url/urlToPath.js';
import { createNavigator } from '@/navigator/createNavigator.js';

import type { CtrOptions, Navigator } from './types.js';

export function createNavigatorFromLocation<State>(options?: CtrOptions<State>): Navigator<State> {
  const { hash } = window.location;
  return createNavigator<State>([
    urlToPath(
      // We should create a navigator based on the location's hash.
      // In this case, we have 2 possible situations:
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
      hash.includes('?') ? hash.slice(1) : `?${hash.slice(1)}`,
    )
  ], 0, options);
}
