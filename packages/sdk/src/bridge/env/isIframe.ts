/**
 * Returns true in case, current environment is iframe.
 * @see https://stackoverflow.com/a/326076
 */
export function isIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
