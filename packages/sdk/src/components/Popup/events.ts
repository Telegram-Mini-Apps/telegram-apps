/**
 * Information about Popup events.
 */
export interface PopupEventsMap {
  /**
   * Open status changed.
   * @param isOpened - current state.
   */
  isOpenedChanged: (isOpened: boolean) => void;
}

/**
 * Known Popup event name.
 */
export type PopupEventName = keyof PopupEventsMap;

/**
 * Listener for specified Popup event.
 */
export type PopupEventListener<E extends PopupEventName> = PopupEventsMap[E];
