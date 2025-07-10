/**
 * Converts the passed object to query parameters.
 * @param value - value to serialize.
 * @param onObject - function returning serialized object value.
 */
export function serializeToQuery(
  value: object,
  onObject?: (key: string, value: object) => string,
): string {
  onObject ||= (_, value) => JSON.stringify(value);

  return new URLSearchParams(
    Object
      .entries(value)
      .reduce<[string, string][]>((acc, [key, value]) => {
        if (value === null || value === undefined) {
          return acc;
        }

        let parsed: string

        if (Array.isArray(value)) {
          acc.push(...value.map(v => [key, String(v)] as [string, string]));
        } else if (value instanceof Date) {
          parsed = (value.getTime() / 1000 | 0).toString()
        } else if (typeof value === 'number' || typeof value === 'string') {
          parsed = String(value);
        } else if (typeof value === 'boolean') {
          parsed = value ? '1' : '0'
        } else {
          parsed = onObject(key, value)
        }

        acc.push([key, parsed])

        return acc;
      }, []),
  ).toString();
}
