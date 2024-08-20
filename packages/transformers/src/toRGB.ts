import type { RGB } from '@telegram-apps/types';

import { isRGB } from './validators/isRGB.js';
import { isRGBShort } from './validators/isRGBShort.js';

/**
 * Converts passed value to #RRGGBB format. Accepts following color formats:
 * - `#RGB`
 * - `#RRGGBB`
 * - `rgb(1,2,3)`
 * - `rgba(1,2,3,4)`
 * @param value - value to convert.
 * @throws {Error} Passed value does not satisfy any of known RGB formats.
 */
export function toRGB(value: string): RGB {
  // Remove all spaces.
  const clean = value.replace(/\s/g, '').toLowerCase();

  // Value already has required format.
  if (isRGB(clean)) {
    return clean;
  }

  // Convert from #RGB.
  if (isRGBShort(clean)) {
    let color: RGB = '#';
    for (let i = 0; i < 3; i += 1) {
      color += clean[1 + i].repeat(2);
    }
    return color;
  }

  // Example valid values: rgb(0,3,10) rgba(32,114,8,0)
  const match = clean.match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/)
    || clean.match(/^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),\d{1,3}\)$/);

  // In case, this didn't work as well, we can't extract RGB color from passed
  // text.
  if (!match) {
    throw new Error(`Value "${value}" does not satisfy any of known RGB formats.`);
  }

  // Otherwise, take R, G and B components, convert to hex and create #RRGGBB
  // string.
  return match.slice(1).reduce((acc, component) => {
    const formatted = parseInt(component, 10).toString(16);
    return acc + (formatted.length === 1 ? '0' : '') + formatted;
  }, '#') as RGB;
}
