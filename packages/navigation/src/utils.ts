import type { Pathname } from './types.js';

/**
 * Ensures that specified value contains slash in the beginning.
 * @param value - value to check.
 */
export function ensurePrefixSlash(value: string): `/${string}` {
  return value.startsWith('/') ? value as `/${string}` : `/${value}`;
}

/**
 * Converts passed to pathname
 * @param value - value to convert.
 */
export function toPathname(value: string): Pathname {
  const withSlash = ensurePrefixSlash(value);

  for (let i = 0; i < withSlash.length; i += 1) {
    if (withSlash[i] === '?' || withSlash[i] === '#') {
      return withSlash.slice(0, i) as Pathname;
    }
  }

  return withSlash;
}

/**
 * Merges 2 absolute path names into a single one.
 *
 * @example
 * what: /a
 * where: /b/c/d/e
 * result: /b/c/d/a
 *
 * @example
 * what: /a/m
 * where: /b/c/d/e
 * result: /b/c/a/m
 *
 * @example
 * what: /a/b/c
 * where: /b
 * result: /a/b/c
 *
 * @param what
 * @param where
 */
export function mergePathnames(what: Pathname, where: Pathname): Pathname {
  const [, ...whatParts] = what.split('/');
  const [, ...whereParts] = where.split('/');

  // Example.
  // what: /a/b/c
  // where: /b
  // As long as "what" is bigger than "where" or has the same length, it fully overwrites the path.
  if (whereParts.length - whatParts.length <= 0) {
    return what;
  }

  return ensurePrefixSlash([
    // Take all source parts, but not the last "what" parts length. We will replace them with
    // "what" parts.
    ...whereParts.slice(0, -whatParts.length),
    ...whatParts,
  ].join('/'));
}

/**
 * Formats specified string appending question mark before in case, its not empty.
 * @param search - value to format.
 */
export function formatSearch(search: string): string {
  if (search.startsWith('?')) {
    return search;
  }
  return search ? `?${search}` : '';
}
