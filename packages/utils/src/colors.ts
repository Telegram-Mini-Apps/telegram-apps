/**
 * Color in format #RGB.
 */
export type RGBShort = `#${string}`;

/**
 * Color in format #RRGGBB.
 */
export type RGB = `#${string}`;

/**
 * Returns true in case, passed value has #RGB format.
 * @param value - value to check.
 */
export function isRGBShort(value: string): value is RGBShort {
  return /^#[\da-f]{3}$/i.test(value);
}

/**
 * Returns true in case, passed value has #RRGGBB format.
 * @param value - value to check.
 */
export function isRGB(value: string): value is RGB {
  return /^#[\da-f]{6}$/i.test(value);
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
  // Remove all spaces.
  const clean = value.replace(/\s/g, '').toLowerCase();

  // Value already has required format.
  if (isRGB(clean)) {
    return clean;
  }

  // Convert from #RGB.
  if (isRGBShort(clean)) {
    let color = '#';

    for (let i = 0; i < 3; i += 1) {
      color += clean[1 + i].repeat(2);
    }
    return color as RGB;
  }

  // Example valid values: rgb(0,3,10) rgba(32,114,8,0)
  const match = clean.match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/)
    || clean.match(/^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),\d{1,3}\)$/);

  // In case, this didn't work as well, we can't extract RGB color from passed
  // text.
  if (match === null) {
    throw new Error(`Value "${value}" does not satisfy any of known RGB formats.`);
  }

  // Otherwise, take R, G and B components, convert to hex and create #RRGGBB
  // string.
  return match.slice(1).reduce((acc, component) => {
    const formatted = parseInt(component, 10).toString(16);
    return acc + (formatted.length === 1 ? '0' : '') + formatted;
  }, '#') as RGB;
}
