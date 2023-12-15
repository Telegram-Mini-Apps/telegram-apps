/**
 * Awaits for specified amount of time.
 * @param duration - duration to await.
 */
export function sleep(duration: number): Promise<void> {
  // eslint-disable-next-line no-await-in-loop,@typescript-eslint/no-loop-func
  return new Promise((res) => {
    setTimeout(res, duration);
  });
}
