import { encodeBase64Url } from '@/base64-url/encode.js';

/**
 * @returns True if the passed value is safe to be used to create a start parameter value from it.
 * If true is returned, the value can be safely passed to the `createStartParam` function.
 * @param value - value to check.
 * @see createStartParam
 */
export function isSafeToCreateStartParam(value: string): boolean {
  return encodeBase64Url(value).length <= 512;
}
