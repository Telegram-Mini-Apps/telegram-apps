/**
 * Converts palette key from Telegram application to representation used by the package.
 * @param key - palette key.
 */
export function keyToLocal(key: string): string {
  return key
    // Replace all "background" strings to "bg".
    .replace(/(^|_)bg/, (_, prefix) => `${prefix}background`)
    // Convert camel case to snake case.
    .replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
}

/**
 * Converts palette key from local representation to representation sent from the Telegram
 * application.
 * @param key - palette key.
 */
export function keyToExternal(key: string): string {
  return key
    // Convert camel case to snake case.
    .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    // Replace all "background" strings to "bg".
    .replace(/(^|_)background/, (_, prefix) => `${prefix}bg`);
}
