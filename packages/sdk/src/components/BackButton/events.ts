/**
 * Information about BackButton supported events.
 */
interface BackButtonEventsMap {
  /**
   * Back button clicked.
   */
  click: () => void;

  /**
   * Visibility changed.
   * @param visible - current visibility state.
   */
  visibleChanged: (visible: boolean) => void;
}

/**
 * Known BackButton event name.
 */
type BackButtonEventName = keyof BackButtonEventsMap;

/**
 * Listener for specified BackButton event.
 */
type BackButtonEventListener<E extends BackButtonEventName> =
  BackButtonEventsMap[E];

export {BackButtonEventsMap, BackButtonEventName, BackButtonEventListener};