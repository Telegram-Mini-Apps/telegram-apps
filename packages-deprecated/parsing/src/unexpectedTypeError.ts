/**
 * Creates instance of TypeError stating, that value has unexpected type.
 */
export function unexpectedTypeError(): TypeError {
  return new TypeError('Value has unexpected type');
}
