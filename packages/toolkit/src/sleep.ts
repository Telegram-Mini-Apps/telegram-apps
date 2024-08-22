/**
 * Awaits for specified amount of time.
 * @param duration - duration in ms to await.
 */
export function sleep(duration: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(res, duration);
  });
}
