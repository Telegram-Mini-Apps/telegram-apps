import { themeParams } from './themeParams.js';
import type { ThemeParams } from './types.js';

/**
 * Parses incoming value as theme parameters.
 * @param value - value to parse.
 */
export function parse(value: unknown): ThemeParams {
  return themeParams().parse(value);
}
