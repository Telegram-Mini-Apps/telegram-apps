import { Navigator } from './Navigator.js';
import type { NavigatorOptions } from './types.js';

/**
 * Creates navigator from current window location hash.
 * @param options - options passed to constructor.
 */
export function fromLocation(options?: NavigatorOptions): Navigator {
  const { hash, href } = window.location;
  const { search, pathname } = new URL(hash.slice(1), href);

  return new Navigator([{ search, pathname }], 0, options);
}
