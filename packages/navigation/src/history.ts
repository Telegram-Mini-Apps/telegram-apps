import { withTimeout } from '@tma.js/utils';

/**
 * Performs window.history.go operation waiting for it to be completed.
 * @param delta - history change delta.
 */
export async function go(delta: number): Promise<boolean> {
  if (delta === 0) {
    return true;
  }

  return withTimeout(
    new Promise<void>((res) => {
      window.addEventListener('popstate', function listener() {
        window.removeEventListener('popstate', listener);
        res();
      });

      window.history.go(delta);
    }),
    10,
  )
    .then(() => true)
    .catch(() => false);
}

/**
 * Drops current browser history.
 */
export async function drop(): Promise<void> {
  if (window.history.length <= 1) {
    return;
  }

  // Push empty state to cut states we have no access to. After this, we will be sure, next
  // call of history.go will move us to the first browser history entry.
  window.history.pushState(null, '');

  const goPerformed = await go(1 - window.history.length);
  if (goPerformed) {
    return;
  }

  let shouldGoBack = await go(-1);
  while (shouldGoBack) {
    // eslint-disable-next-line no-await-in-loop
    shouldGoBack = await go(-1);
  }
}
