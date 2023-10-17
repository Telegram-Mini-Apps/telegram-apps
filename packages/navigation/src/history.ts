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
      window.addEventListener('popstate', function listener() {
        window.removeEventListener('popstate', listener);
        res(true);
      });

      window.history.go(delta);
    }),

    // Usually, it takes about 1ms to emit this event, but we use some buffer.
    new Promise((res) => {
      setTimeout(res, 10, false);
    }),
  ]);
}

/**
 * Drops current browser history switching browser history cursor to the first one entry.
 */
export async function drop(): Promise<void> {
  if (window.history.length <= 1) {
    return;
  }

  // Push empty state to cut states we have no access to.
  window.history.pushState(null, '');

  // By this line of code we cover the most recent case, when application is opened in WebView,
  // but not in iframe. Applications opened in WebView have simple browser history containing
  // only entries belonging to the current web application.
  const goPerformed = await go(1 - window.history.length);
  if (goPerformed) {
    return;
  }

  // Nevertheless, iframe works a bit different in context of browser history. Calling
  // window.history.length in iframe will return browser history information related to the
  // external web environment too (e.g. browser tab). So, iframe shares the browser history with
  // the external application, but has no access to its history entries. Calling window.history.go
  // pointing out to the entry belonging to the external application will have no impact, so the
  // previous idea with go(1 - ...) will not work.
  //
  // This is the reason why we iteratively call go(-1) to meet the entry which is recognized as
  // the initial one for the current iframe.
  let shouldGoBack = await go(-1);
  while (shouldGoBack) {
    // eslint-disable-next-line no-await-in-loop
    shouldGoBack = await go(-1);
  }
}
