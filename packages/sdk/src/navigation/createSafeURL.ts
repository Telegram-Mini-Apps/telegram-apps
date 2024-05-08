import { ensurePrefix } from '@/navigation/ensurePrefix.js';
import type { URLLike } from '@/navigation/BrowserNavigator/types.js';

/**
 * Safely creates new instance of URL with some predefined protocol and hostname.
 * @param urlOrPath - URL instance or path.
 */
export function createSafeURL(urlOrPath: string | Partial<URLLike>): URL {
  return new URL(
    typeof urlOrPath === 'string'
      ? urlOrPath
      : `${urlOrPath.pathname || ''}${ensurePrefix(urlOrPath.search || '', '?')}${ensurePrefix(urlOrPath.hash || '', '#')}`,
    'http://a',
  );
}
