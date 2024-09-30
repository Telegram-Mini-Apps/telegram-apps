/**
 * Minimal set of URL properties we are working with in this library.
 */
export interface URLLike {
  /**
   * @see URL.pathname
   */
  pathname: string;
  /**
   * @see URL.hash
   */
  hash?: string;
  /**
   * @see URL.search
   */
  search?: string;
}