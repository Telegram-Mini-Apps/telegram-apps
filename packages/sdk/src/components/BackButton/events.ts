/**
 * Information about BackButton supported events.
 */
export interface BackButtonEventsMap {
  /**
   * Back button clicked.
   */
  click: () => void;

  /**
   * Visibility changed.
   * @param visible - current visibility state.
   */
  isVisibleChanged: (visible: boolean) => void;
}

/**
 * Known BackButton event name.
 */
export type BackButtonEventName = keyof BackButtonEventsMap;

/**
 * Listener for specified BackButton event.
 */
export type BackButtonEventListener<E extends BackButtonEventName> =
  BackButtonEventsMap[E];
