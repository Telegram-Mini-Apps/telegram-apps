/**
 * Creates resettable singleton. We mostly need it for test purposes.
 * @param create - function which creates singleton entity.
 * @param onReset - function which will be called in case, singleton was reset.
 */
export function createSingleton<T>(
  create: (reset: () => void) => T,
  onReset?: (entity: T) => void,
): [
  /**
   * Returns singleton entity.
   */
  get: () => T,
  /**
   * Resets last stored entity.
   */
  reset: () => void,
] {
  let cached: T | undefined;
  const reset = () => {
    cached !== undefined && onReset && onReset(cached);
    cached = undefined;
  };

  return [() => (cached === undefined ? cached = create(reset) : cached), reset];
}
