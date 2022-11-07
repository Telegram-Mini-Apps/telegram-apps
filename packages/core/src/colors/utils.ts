import {toRGB} from './rgb';

/**
 * Returns true in case, color is recognized as dark.
 *
 * @param color - color in format #RGB or #RRGGBB.
 * @see toRGB
 */
export function isColorDark(color: string): boolean {
  // Convert color to RGB.
  color = toRGB(color);

  // hsp = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b)
  const hsp = Math.sqrt(
    new Array(3).fill(null).reduce<number>((acc, _, idx) => {
      // Extract part of #RRGGBB pattern and convert it to DEC.
      const dec = parseInt(color.slice(1 + idx * 2, 1 + (idx + 1) * 2), 16);

      // Each component of RGB has its own modifier.
      // See: https://stackoverflow.com/a/596243
      const modifier = idx === 0
        ? 0.299
        : idx === 1
          ? 0.587
          : 0.114;

      return acc + dec * dec * modifier;
    }, 0),
  );
  return hsp < 120;
}
