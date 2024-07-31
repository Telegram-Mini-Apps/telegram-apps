/**
 * Creates function which generated request identifiers.
 */
export function createRequestIdGenerator(): () => string {
  let requestId = 0;
  return () => (requestId += 1).toString();
}
