/**
 * @param value - string to take hash part from.
 * @returns String after the first met "#" symbol. In case, value doesn't contain hashtag, the
 * function will return null.
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
