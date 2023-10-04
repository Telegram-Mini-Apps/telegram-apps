import { searchParams, string } from '@tma.js/parsing';
import { initData } from '@tma.js/init-data';
import { parse as parseThemeParams } from '@tma.js/theme-params';

import type { LaunchParams } from './types.js';

const parser = searchParams<LaunchParams>({
  version: {
    type: string(),
    from: 'tgWebAppVersion',
  },
  initData: {
    type: initData.optional(),
    from: 'tgWebAppData',
  },
  initDataRaw: {
    type: string().optional(),
    from: 'tgWebAppData',
  },
  platform: {
    type: string(),
    from: 'tgWebAppPlatform',
  },
  themeParams: {
    type: parseThemeParams,
    from: 'tgWebAppThemeParams',
  },
});

/**
 * Parses query parameters as launch parameters.
 * @param query - query parameters presented as string or URLSearchParams
 * instance.
 */
export function parse(query: string | URLSearchParams): LaunchParams {
  return parser.parse(query);
}
