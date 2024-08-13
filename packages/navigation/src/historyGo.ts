/**
 * Performs window.history.go operation waiting for it to be completed.
 * @param delta - history change delta.
 */
export async function historyGo(delta: number): Promise<boolean> {
  if (delta === 0) {
    return true;
  }
  const w = window;
  const h = w.history;

  let resolve: (value: boolean) => void;
  const promise = new Promise<boolean>(res => {
    resolve = res;
  });

  function listener() {
    resolve(true);
  }

  // We expect popstate event to occur during some time. Yeah, this seems tricky and not stable,
  // but it seems like we have no other way out. Waiting for Navigation API to be implemented in
  // browsers.
  w.addEventListener('popstate', listener);
  h.go(delta);

  // Usually, it takes about 1ms to emit this event, but we use some buffer.
  setTimeout(resolve!, 50, false);

  return promise.finally(() => {
    w.removeEventListener('popstate', listener);
  });
}
