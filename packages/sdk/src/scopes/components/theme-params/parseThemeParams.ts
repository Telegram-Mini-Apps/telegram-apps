import { themeParams } from '@telegram-apps/transformers';
import type { ThemeParams } from '@telegram-apps/bridge';

/**
 * Parses incoming value as theme parameters.
 * @param value - value to parse.
 */
export function parseThemeParams(value: unknown): ThemeParams {
  return themeParams()(value);
}
