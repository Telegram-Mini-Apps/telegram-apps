/**
 * Format int color to hex color.
 * @param color - color from event.
 * @returns string color in hex format.
 */
export function intToHexColor(
    color?: `#${string}` | number,
): `#${string}` | undefined {
    return color !== undefined && typeof color === 'number' ? `#${(color & 0x00FFFFFF).toString(16)}` : color;
}