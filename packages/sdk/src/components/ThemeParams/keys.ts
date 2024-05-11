/**
 * Converts a palette key from the Telegram application to the representation used by the package.
 * @param key - palette key.
 */
export function keyToLocal(key: string): string {
  return key.replace(/_[a-z]/g, (match) => match[1].toUpperCase());
}

/**
 * Converts palette key from the local representation to the representation sent from the
 * Telegram application.
 * @param key - palette key.
 */
export function keyToExternal(key: string): string {
  return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}
