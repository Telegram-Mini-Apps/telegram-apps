import type { HashNavigatorOptions } from '@tma.js/sdk';
import { HashNavigator, isPageReload } from '@tma.js/sdk';

function instantiate(options?: HashNavigatorOptions): HashNavigator {
  // If page was reloaded, we assume that navigator had to previously save
  // its state in the session storage.
  if (isPageReload()) {
    const stateRaw = sessionStorage.getItem('hash-navigator-state');
    if (stateRaw) {
      try {
        const { cursor, entries } = JSON.parse(stateRaw);
        return new HashNavigator(entries, cursor, options);
      } catch (e) {
        console.error('Unable to restore hash navigator state.', e);
      }
    }
  }

  // In case, we could not restore its state, or it is the fresh start, we
  // can create an empty navigator.
  return new HashNavigator([{}], 0, options);
}

/**
 * Creates Telegram Mini Apps navigator.
 * @param options - navigator creation options.
 */
export function createNavigator(options?: HashNavigatorOptions): HashNavigator {
  const navigator = instantiate(options);

  const saveState = () => sessionStorage.setItem('hash-navigator-state', JSON.stringify({
    cursor: navigator.cursor,
    entries: navigator.getEntries(),
  }));

  // Whenever navigator changes its state, we save it in the session storage.
  navigator.on('change', saveState);

  // Save initial state to make sure nothing will break when page will be reloaded.
  saveState();

  return navigator;
}
