import { toRGB } from '@telegram-apps/transformers';

/**
 * @param color - color in any format acceptable by the `toRGB` function.
 * @returns True if the color is recognized as dark.
 * @see toRGB
 */
export function isColorDark(color: string): boolean {
  const rgb = toRGB(color);

  // Real formula: hsp = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b)
  // See: https://stackoverflow.com/a/596243
  return Math.sqrt(
    [0.299, 0.587, 0.114].reduce<number>((acc, modifier, idx) => {
      // Extract part of #RRGGBB pattern and convert it to DEC.
      const dec = parseInt(rgb.slice(1 + idx * 2, 1 + (idx + 1) * 2), 16);
      return acc + dec * dec * modifier;
    }, 0),
  ) < 120;
}
