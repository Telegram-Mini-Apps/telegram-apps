import {
  BrowserNavigator,
  type BrowserNavigatorConOptions,
  createBrowserNavigatorFromLocation,
  isPageReload,
} from '@tma.js/sdk-react';

function instantiate<State>(
  sessionStorageKey: string,
  options?: BrowserNavigatorConOptions,
): BrowserNavigator<State> {
  // If page was reloaded, we assume that navigator had to previously save its state in the
  // session storage.
  if (isPageReload()) {
    const stateRaw = sessionStorage.getItem(sessionStorageKey);
    if (stateRaw) {
      try {
        const { index, history } = JSON.parse(stateRaw);
        return new BrowserNavigator(history, index, options);
      } catch (e) {
        console.error('Unable to restore hash navigator state.', e);
      }
    }
  }

  // In case, we could not restore its state, or it is a fresh start, we can create an empty
  // navigator. We are creating BrowserNavigator from the window.location.
  return window.location.hash.includes('?')
    ? createBrowserNavigatorFromLocation(options)
    : new BrowserNavigator(['/'], 0, options);
}

/**
 * Creates Mini Apps navigator.
 * @param sessionStorageKey - session storage key, containing this navigator state.
 * @param options - additional BrowserNavigator options.
 */
export function createNavigator<State>(
  sessionStorageKey: string,
  options?: BrowserNavigatorConOptions,
): BrowserNavigator<State> {
  const navigator = instantiate<State>(sessionStorageKey, options);

  const saveState = () => sessionStorage.setItem(sessionStorageKey, JSON.stringify({
    index: navigator.index,
    history: navigator.history,
  }));

  // Whenever navigator changes its state, we save it in the session storage.
  navigator.on('change', saveState);

  // Save the initial state to make sure nothing will break when a page will be reloaded.
  saveState();

  return navigator;
}
