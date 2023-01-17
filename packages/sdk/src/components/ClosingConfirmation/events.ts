/**
 * Information about ClosingConfirmation supported events.
 */
interface ClosingConfirmationEventsMap {
  /**
   * Confirmation status changed.
   * @param isEnabled - current status.
   */
  change: (isEnabled: boolean) => void;
}

/**
 * Known ClosingConfirmation event name.
 */
type ClosingConfirmationEventName = keyof ClosingConfirmationEventsMap;

/**
 * Listener for specified ClosingConfirmation event.
 */
type ClosingConfirmationEventListener<E extends ClosingConfirmationEventName> =
  ClosingConfirmationEventsMap[E];

export {
  ClosingConfirmationEventName,
  ClosingConfirmationEventListener,
  ClosingConfirmationEventsMap,
};
