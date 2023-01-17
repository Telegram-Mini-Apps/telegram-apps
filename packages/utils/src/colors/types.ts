/**
 * Component of RGB color.
 */
type Hex = string;

/**
 * Color in format #RGB.
 */
type RGBShort = `#${Hex}${Hex}${Hex}`;

/**
 * Color in format #RRGGBB.
 */
type RGB = `#${Hex}${Hex}${Hex}${Hex}${Hex}${Hex}`;

export {RGBShort, RGB};