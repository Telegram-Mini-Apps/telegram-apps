import { themeParamsParser } from './themeParamsParser.js';
import type { ThemeParamsParsed } from './types.js';

/**
 * Parses incoming value as theme parameters.
 * @param value - value to parse.
 */
export function parseThemeParams(value: unknown): ThemeParamsParsed {
  return themeParamsParser().parse(value);
}
