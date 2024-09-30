import { createSafeURL } from './createSafeURL.js';
import type { URLLike } from './types.js';

/**
 * Extracts path part from a URL.
 * @param urlOrPath - URL instance or path.
 */
export function urlToPath(urlOrPath: string | Partial<URLLike>): string {
  const isAbsolute = (
    typeof urlOrPath === 'string'
      ? urlOrPath
      : urlOrPath.pathname || ''
  ).startsWith('/');
  const url = createSafeURL(urlOrPath);
  const { pathname } = url;

  return `${isAbsolute ? pathname : pathname.slice(1)}${url.search}${url.hash}`;
}
