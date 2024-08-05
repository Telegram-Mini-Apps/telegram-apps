/**
 * Minimal set of URL properties we are working with in this library.
 */
export type URLLike = Pick<URL, 'pathname' | 'search' | 'hash'>;