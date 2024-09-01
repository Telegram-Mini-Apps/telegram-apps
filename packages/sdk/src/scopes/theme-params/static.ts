import { themeParams } from '@telegram-apps/transformers';
import type { ThemeParams } from '@telegram-apps/bridge';

/**
 * Parses incoming value as theme parameters.
 * @param value - value to parse.
 */
export function parse(value: unknown): ThemeParams {
  return themeParams()(value);
}

export { serializeThemeParams as serialize } from '@telegram-apps/transformers';

export type * from './types.js';
