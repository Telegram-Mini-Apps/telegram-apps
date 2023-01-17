/**
 * Information about Popup events.
 */
interface PopupEventsMap {
  /**
   * Open status changed.
   * @param isOpened - current state.
   */
  openChanged: (isOpened: boolean) => void;
}

/**
 * Known Popup event name.
 */
type PopupEventName = keyof PopupEventsMap;

/**
 * Listener for specified Popup event.
 */
type PopupEventListener<E extends PopupEventName> = PopupEventsMap[E];

export {PopupEventName, PopupEventListener, PopupEventsMap};