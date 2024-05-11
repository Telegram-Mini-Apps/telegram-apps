let currentTargetOrigin = 'https://web.telegram.org';

/**
 * Sets new global targetOrigin, used by `postEvent` method.
 * Default value is "https://web.telegram.org". You don't need to
 * use this method until you know what you are doing.
 *
 * This method could be used for test purposes.
 * @param value - new target origin.
 */
export function setTargetOrigin(value: string): void {
  currentTargetOrigin = value;
}

/**
 * Returns current global target origin.
 */
export function targetOrigin(): string {
  return currentTargetOrigin;
}
