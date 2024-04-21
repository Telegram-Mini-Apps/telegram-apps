/**
 * Creates object with specified keys and value.
 * @param keys - object keys.
 * @param value - keys value.
 */
export function objectFromKeys<K extends string, V>(keys: K[], value: V): Record<K, V> {
  return Object.fromEntries(keys.map((k) => [k, value])) as Record<K, V>;
}
