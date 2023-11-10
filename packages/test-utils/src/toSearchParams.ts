/**
 * Creates search parameters from the specified JSON object.
 * @param json - JSON object.
 */
export function toSearchParams(json: Record<string, unknown>): string {
  const params = new URLSearchParams();

  Object.entries(json).forEach(([key, value]) => {
    if (typeof value === 'object') {
      params.set(key, JSON.stringify(value));
      return;
    }

    if (typeof value === 'boolean') {
      params.set(key, String(Number(value)));
      return;
    }

    params.set(key, String(value));
  });

  return params.toString();
}
