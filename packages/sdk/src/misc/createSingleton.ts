/**
 * Creates resettable singleton. We mostly need it for test purposes.
 * @param create - function which creates singleton entity.
 * @param onDispose - function which will be called in case, singleton was reset.
 */
export function createSingleton<T>(
  create: () => T,
  onDispose?: (entity: T) => void,
): [
  /**
   * Returns singleton entity.
   */
  get: () => T,
  /**
   * Resets last stored entity.
   */
  dispose: () => void,
] {
  let cached: T | undefined;
  return [
    () => (cached === undefined ? cached = create() : cached),
    () => {
      cached !== undefined && onDispose && onDispose(cached);
      cached = undefined;
    },
  ];
}
