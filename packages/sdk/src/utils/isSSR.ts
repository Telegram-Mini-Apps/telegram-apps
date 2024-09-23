/**
 * @returns True, if current environment is server.
 */
export function isSSR(): boolean {
  return typeof window === 'undefined';
}
