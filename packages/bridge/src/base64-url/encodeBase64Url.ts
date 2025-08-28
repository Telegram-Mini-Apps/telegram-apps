/**
 * Creates a base-64-url encoded ASCII string from the passed value.
 * @param value - the value to encode.
 * @see Learn more about base64url:
 * https://herongyang.com/Encoding/Base64URL-Encoding-Algorithm.html
 * @see Source:
 * https://developer.mozilla.org/ru/docs/Glossary/Base64#solution_1_–_escaping_the_string_before_encoding_it
 */
export function encodeBase64Url(value: string): string {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(`0x${p1}`));
    }),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
