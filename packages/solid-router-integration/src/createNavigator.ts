import {
  BrowserNavigator,
  type BrowserNavigatorHashMode,
  createBrowserNavigatorFromLocation,
  isPageReload,
} from '@tma.js/sdk-solid';

function instantiate<State>(
  sessionStorageKey: string,
  hashMode?: BrowserNavigatorHashMode,
): BrowserNavigator<State> {
  // If page was reloaded, we assume that navigator had to previously save
  // its state in the session storage.
  if (isPageReload()) {
    const stateRaw = sessionStorage.getItem(sessionStorageKey);
    if (stateRaw) {
      try {
        const { cursor, entries } = JSON.parse(stateRaw);
        return new BrowserNavigator<State>(entries, cursor, hashMode);
      } catch (e) {
        console.error('Unable to restore hash navigator state.', e);
      }
    }
  }

  // In case, we could not restore its state, or it is the fresh start, we
  // can create an empty navigator.
  return window.location.hash.includes('?')
    ? createBrowserNavigatorFromLocation<State>(hashMode)
    : new BrowserNavigator(['/'], 0, hashMode);
}

/**
 * Creates Mini Apps navigator.
 * @param hashMode - navigator hash mode. Omit, if non-hash navigation is required.
 * @param sessionStorageKey - session storage key, containing this navigator state.
 */
export function createNavigator<State>(
  sessionStorageKey: string,
  hashMode?: BrowserNavigatorHashMode,
): BrowserNavigator<State> {
  const navigator = instantiate<State>(sessionStorageKey, hashMode);

  const saveState = () => sessionStorage.setItem(sessionStorageKey, JSON.stringify({
    cursor: navigator.cursor,
    entries: navigator.history,
  }));

  // Whenever navigator changes its state, we save it in the session storage.
  navigator.on('change', saveState);

  // Save initial state to make sure nothing will break when page will be reloaded.
  saveState();

  return navigator;
}
