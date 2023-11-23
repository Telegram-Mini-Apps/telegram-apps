/**
 * Returns string after first met "#" symbol.
 * @param value - string to take hash part from.
 *
 * @example No hash.
 * getHash('/path'); // null
 *
 * @example Has hash.
 * getHash('/path#abc'); // 'abc'
 *
 * @example Has double hash.
 * getHash('/path#abc#another'); // 'abc#another'
 */
export function getHash(value: string): string | null {
  const match = value.match(/#(.+)/);
  return match ? match[1] : null;
}
