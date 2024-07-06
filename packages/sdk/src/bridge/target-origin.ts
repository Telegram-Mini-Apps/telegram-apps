const INITIAL_TARGET_ORIGIN = 'https://web.telegram.org'

let currentTargetOrigin = INITIAL_TARGET_ORIGIN;

/**
 * Sets a new global targetOrigin, used by the `postEvent` method.
 * The default value is "https://web.telegram.org".
 * You don't need to use this method until you know what you are doing.
 *
 * This method could be used for test purposes.
 * @param value - new target origin.
 * @see postEvent
 */
export function setTargetOrigin(value: string): void {
  currentTargetOrigin = value;
}

/**
 * Sets the initial target origin.
 */
export function resetTargetOrigin(): void {
  setTargetOrigin(INITIAL_TARGET_ORIGIN);
}

/**
 * Returns current global target origin.
 */
export function targetOrigin(): string {
  return currentTargetOrigin;
}
