/**
 * Information about ClosingConfirmation supported events.
 */
export interface ClosingConfirmationEventsMap {
  /**
   * Confirmation status changed.
   * @param isEnabled - current status.
   */
  change: (isEnabled: boolean) => void;
}

/**
 * Known ClosingConfirmation event name.
 */
export type ClosingConfirmationEventName = keyof ClosingConfirmationEventsMap;

/**
 * Listener for specified ClosingConfirmation event.
 */
export type ClosingConfirmationEventListener<E extends ClosingConfirmationEventName> =
  ClosingConfirmationEventsMap[E];
