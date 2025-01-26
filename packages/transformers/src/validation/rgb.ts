import type { RGB, RGBShort } from '@telegram-apps/types';

/**
 * Returns true in case, passed value has #RRGGBB format.
 * @param value - value to check.
 */
export function isRGB(value: string): value is RGB {
  return /^#[\da-f]{6}$/i.test(value);
}

/**
 * Returns true in case, passed value has #RGB format.
 * @param value - value to check.
 */
export function isRGBShort(value: string): value is RGBShort {
  return /^#[\da-f]{3}$/i.test(value);
}

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
  const clean = value.replace(/\s/g, '').toLowerCase();
  if (isRGB(clean)) {
    return clean;
  }

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

  // If this didn't work as well, we can't extract RGB color from passed text.
  if (!match) {
    throw new Error(`Value "${value}" does not satisfy any of known RGB formats.`);
  }

  // Otherwise, take R, G and B components, convert to hex and create #RRGGBB string.
  return match.slice(1).reduce((acc, component) => {
    return acc + parseInt(component, 10).toString(16).padStart(2, '0');
  }, '#') as RGB;
}
