import { createSafeURL } from '@/navigation/createSafeURL.js';
import type { URLLike } from '@/navigation/BrowserNavigator/types.js';

/**
 * Extracts path part from a URL.
 * @param urlOrPath - URL instance or path.
 */
export function urlToPath(urlOrPath: string | Partial<URLLike>): string {
  const isAbsolute = typeof urlOrPath === 'string'
    ? urlOrPath.startsWith('/')
    : !!(urlOrPath.pathname && urlOrPath.pathname.startsWith('/'));
  const url = createSafeURL(urlOrPath);

  return `${isAbsolute ? url.pathname : url.pathname.slice(1)}${url.search}${url.hash}`;
}
