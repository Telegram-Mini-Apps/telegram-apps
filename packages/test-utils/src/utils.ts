export type MockImplementation<T> = T | (() => T);

/**
 * Formats mock implementation.
 * @param impl - mock implementation.
 */
export function formatImplementation<T>(impl: MockImplementation<T>): () => T {
  return typeof impl === 'function'
    ? impl as any
    : () => impl;
}
