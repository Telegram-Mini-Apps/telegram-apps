import { themeParams } from '@telegram-apps/transform';
import type { ThemeParams } from '@telegram-apps/bridge';

import { camelToSnake } from '@/utils/casing.js';

/**
 * Parses incoming value as theme parameters.
 * @param value - value to parse.
 */
export function parse(value: unknown): ThemeParams {
  return themeParams()(value);
}

/**
 * Serializes theme parameters to representation sent from the Telegram application.
 */
export function serialize(themeParams: ThemeParams): string {
  return JSON.stringify(
    Object.fromEntries(
      Object
        .entries(themeParams)
        .map(([key, value]) => [camelToSnake(key), value]),
    ),
  );
}

export type * from './types.js';
