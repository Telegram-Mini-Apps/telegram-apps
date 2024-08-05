import {
  BrowserNavigatorConOptions,
  BrowserNavigatorHistoryItem,
} from '@/browser/BrowserNavigator/types.js';
import { BrowserNavigator } from '@/browser/BrowserNavigator/BrowserNavigator.js';
import { isPageReload } from '@/browser/isPageReload.js';
import {
  createBrowserNavigatorFromLocation
} from '@/browser/BrowserNavigator/createBrowserNavigatorFromLocation.js';


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
        return new BrowserNavigator(
          history as BrowserNavigatorHistoryItem<State>[],
          index as number,
          options
        );
      } catch (e) {
        console.error('Unable to restore hash navigator state.', e);
      }
    }
  }

  // In case, we could not restore its state, or it is a fresh start, we can create an empty
  // navigator. We are creating BrowserNavigator from the window.location.
  return createBrowserNavigatorFromLocation(options);
}

/**
 * Initializes a standard Mini Apps navigator.
 * @param sessionStorageKey - session storage key, containing the navigator state.
 * @param options - additional BrowserNavigator options.
 */
export function initNavigator<State>(
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

  // Save the initial state to make sure nothing will break when the page was reloaded.
  saveState();

  return navigator;
}
