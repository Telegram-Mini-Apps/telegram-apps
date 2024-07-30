import { themeParamsParser } from './themeParamsParser.js';
import type { ThemeParams } from './types.js';

/**
 * Converts a palette key from the local representation to the representation sent from the
 * Telegram application.
 * @param key - palette key.
 */
function keyToExternal(key: string): string {
  return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

/**
 * Parses incoming value as theme parameters.
 * @param value - value to parse.
 */
export function parse(value: unknown): ThemeParams {
  return themeParamsParser().parse(value);
}

/**
 * Serializes theme parameters to representation sent from the Telegram application.
 */
export function serialize(themeParams: ThemeParams): string {
  return JSON.stringify(
    Object.fromEntries(
      Object
        .entries(themeParams)
        .map(([key, value]) => [keyToExternal(key), value]),
    ),
  );
}
