/**
 * Information about events supported by ThemeParamsEventsMap.
 */
interface ThemeParamsEventsMap {
  /**
   * Theme parameters were updated.
   */
  change: () => void;
}

/**
 * Known ThemeParams event name.
 */
type ThemeParamsEventName = keyof ThemeParamsEventsMap;

/**
 * Listener for specified ThemeParams event.
 */
type ThemeParamsEventListener<E extends ThemeParamsEventName> =
  ThemeParamsEventsMap[E];

export {ThemeParamsEventName, ThemeParamsEventsMap, ThemeParamsEventListener};