import { onWindow } from '@/events/onWindow.js';

/**
 * Performs window.history.go operation waiting for it to be completed.
 * @param delta - history change delta.
 */
export async function go(delta: number): Promise<boolean> {
  if (delta === 0) {
    return true;
  }

  // We expect popstate event to occur during some time. Yeah, this seems tricky and not stable,
  // but it seems like we have no other way out. Waiting for Navigation API to be implemented in
  // browsers.
  return Promise.race<boolean>([
    new Promise((res) => {
      const remove = onWindow('popstate', () => {
        remove();
        res(true);
      });

      window.history.go(delta);
    }),

    // Usually, it takes about 1ms to emit this event, but we use some buffer.
    new Promise((res) => {
      setTimeout(res, 50, false);
    }),
  ]);
}
