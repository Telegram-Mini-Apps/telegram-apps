/**
 * Converts array buffer to hex.
 * @param buffer - buffer to convert
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  return new Uint8Array(buffer).reduce((acc, byte) => {
    // Convert byte to hex and pad with zero if needed (e.g., "0a" instead of "a")
    return acc + byte.toString(16).padStart(2, '0');
  }, '');
}
