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
        if (Array.isArray(value)) {
          acc.push(...value.map(v => [key, String(v)] as [string, string]));
        } else {
          if (value !== null && value !== undefined) {
            acc.push([
              key,
              value instanceof Date
                ? (value.getTime() / 1000 | 0).toString()
                : typeof value === 'string' || typeof value === 'number'
                  ? String(value)
                  : typeof value === 'boolean'
                    ? value ? '1' : '0'
                    : onObject(key, value),
            ]);
          }
        }
        return acc;
      }, []),
  ).toString();
}