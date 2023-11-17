/**
 * Converts passed URL to its full form.
 * @param url - URL to format.
 */
export function formatURL(url: string): string {
  return new URL(url, window.location.href).toString();
}
