/**
 * List of events supported for listening by ThemeParams.
 */
export interface ThemeParamsEventsMap {
  /**
   * Being emitted when current theme params instance gets updated.
   */
  change: () => void;
}