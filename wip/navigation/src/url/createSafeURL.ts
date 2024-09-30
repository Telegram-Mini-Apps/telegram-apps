import { ensurePrefix } from '@/ensurePrefix.js';

import type { URLLike } from './types.js';

/**
 * Safely creates a new instance of URL with some predefined protocol "http://" and host "a".
 * @param urlOrPath - URL instance or path.
 */
export function createSafeURL(urlOrPath: string | Partial<URLLike>): URL {
  return new URL(
    typeof urlOrPath === 'string' ? urlOrPath : [
      urlOrPath.pathname || '',
      ensurePrefix(urlOrPath.search || '', '?'),
      ensurePrefix(urlOrPath.hash || '', '#'),
    ].join(''),
    'http://a',
  );
}
