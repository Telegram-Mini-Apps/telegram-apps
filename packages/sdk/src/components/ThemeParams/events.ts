/**
 * Information about events supported by ThemeParamsEventsMap.
 */
export interface ThemeParamsEventsMap {
  /**
   * Theme parameters were updated.
   */
  change: () => void;
}

/**
 * Known ThemeParams event name.
 */
export type ThemeParamsEventName = keyof ThemeParamsEventsMap;

/**
 * Listener for specified ThemeParams event.
 */
export type ThemeParamsEventListener<E extends ThemeParamsEventName> =
  ThemeParamsEventsMap[E];