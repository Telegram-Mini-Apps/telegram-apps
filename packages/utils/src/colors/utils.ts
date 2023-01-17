import {toRGB} from './rgb';

/**
 * Returns true in case, color is recognized as dark.
 * @param color - color in format, accepted by `toRGB` function.
 * @see toRGB
 */
function isColorDark(color: string): boolean {
  // Convert color to RGB.
  color = toRGB(color);

  // Real formula: hsp = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b)
  // See: https://stackoverflow.com/a/596243
  const hsp = Math.sqrt(
    [0.299, 0.587, 0.114].reduce<number>((acc, modifier, idx) => {
      // Extract part of #RRGGBB pattern and convert it to DEC.
      const dec = parseInt(color.slice(1 + idx * 2, 1 + (idx + 1) * 2), 16);
      return acc + dec * dec * modifier;
    }, 0),
  );
  return hsp < 120;
}

export {isColorDark};
