import { ensurePrefixSlash } from './utils.js';
import { Navigator } from './Navigator.js';
import type { NavigatorOptions, Pathname } from './types.js';

/**
 * Creates navigator from current window location.
 * @param options - options passed to constructor.
 */
export function fromLocation(options?: NavigatorOptions): Navigator {
  const { search, pathname } = new URL(
    `${origin}${ensurePrefixSlash(window.location.hash.slice(1))}`,
  );

  return new Navigator([{ search, pathname: pathname as Pathname }], 0, options);
}
