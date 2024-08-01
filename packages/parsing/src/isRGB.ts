import type { RGB } from '@telegram-apps/types';

/**
 * Returns true in case, passed value has #RRGGBB format.
 * @param value - value to check.
 */
export function isRGB(value: string): value is RGB {
  return /^#[\da-f]{6}$/i.test(value);
}
