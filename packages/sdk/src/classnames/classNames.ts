/**
 * Inserts a space between a and b in case both of them are
 * non-empty strings.
 * @param a
 * @param b
 */
function space(a: string, b: string): string {
  return a + (a.length + b.length > 0 ? ` ${b}` : b);
}

/**
 * Function which joins passed values with space following these rules:
 * 1. If value is non-empty string, it will be added to output.
 * 2. If value is object, only those keys will be added, which values are truthy.
 * 3. All other values are ignored.
 *
 * You can find this function to similar one from package {@link https://www.npmjs.com/package/classnames|classnames}.
 * @param values - values array.
 */
export function classNames(...values: any[]): string {
  return values.reduce<string>((acc, value) => {
    let formattedValue = '';

    if (typeof value === 'string') {
      formattedValue = value;
    } else if (typeof value === 'object' && value !== null) {
      formattedValue = Object
        .entries(value)
        .reduce<string>((valueAcc, [className, enable]) => (enable ? space(valueAcc, className) : valueAcc), '');
    }

    return space(acc, formattedValue);
  }, '');
}
