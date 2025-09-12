/**
 * Converts a hex string to ArrayBuffer.
 * @param hexString - value to convert.
 */
export function hexToArrayBuffer(hexString: string): ArrayBuffer {
  if (hexString.length % 2 !== 0) {
    throw new Error('Hex string must have an even number of characters');
  }

  const buffer = new ArrayBuffer(hexString.length / 2);
  const uint8Array = new Uint8Array(buffer);
  for (let i = 0; i < hexString.length; i += 2) {
    uint8Array[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  return buffer;
}