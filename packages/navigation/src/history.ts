/**
 * Performs window.history.go operation waiting for it to be completed.
 * @param delta - history change delta.
 */
export function go(delta: number): Promise<void> {
  return delta === 0 ? Promise.resolve() : new Promise((res) => {
    window.addEventListener('popstate', function listener() {
      window.removeEventListener('popstate', listener);
      res();
    });

    window.history.go(delta);
  });
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

  return go(1 - window.history.length);
}
