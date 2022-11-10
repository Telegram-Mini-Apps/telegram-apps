interface PropertyEventsMap {
  /**
   * Being emitted when back button changes visibility status.
   * @param visible - current visibility status.
   */
  visibleChange: (visible: boolean) => void;
}

/**
 * List of events supported for listening by BackButton.
 */
export interface BackButtonEventsMap extends PropertyEventsMap {
  /**
   * Being emitted when user pressed back button.
   */
  click: () => void;
}

/**
 * Known BackButton event name.
 */
export type BackButtonEventName = keyof BackButtonEventsMap;

/**
 * Returns listener for specified BackButton event.
 */
export type BackButtonEventListener<E extends BackButtonEventName> =
  BackButtonEventsMap[E];
