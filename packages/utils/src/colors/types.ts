/**
 * Component of RGB color.
 */
type Hex = string;

/**
 * Color in format #RGB.
 */
export type RGBShort = `#${Hex}${Hex}${Hex}`;

/**
 * Color in format #RRGGBB.
 */
export type RGB = `#${Hex}${Hex}${Hex}${Hex}${Hex}${Hex}`;
