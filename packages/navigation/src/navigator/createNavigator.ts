import {
  batch,
  computed,
  signal,
  type Computed,
  type Signal,
  type SignalOptions,
} from '@telegram-apps/signals';
import { off, on, postEvent } from '@telegram-apps/bridge';
import { createCbCollector, BetterPromise, createLogger } from '@telegram-apps/toolkit';

import { formatItem } from './formatItem.js';
import { ensurePrefix } from '../ensurePrefix.js';
import { urlToPath } from '../url/urlToPath.js';
import { createSafeURL } from '../url/createSafeURL.js';
import { dropHistory as historyDrop } from '../history/dropHistory.js';
import { historyGo } from '../history/historyGo.js';
import { ERR_CURSOR_INVALID, ERR_HISTORY_EMPTY } from '../errors.js';
import type {
  AnyHistoryItem,
  CtrOptions,
  HistoryItem,
  NavigationType,
  Navigator,
} from './types.js';

const CURSOR_VOID = 0;
const CURSOR_BACK = 1;
const CURSOR_FORWARD = 2;

/**
 * Creates a new navigator.
 * @param history - navigation history.
 * @param cursor - currently active history item.
 * @param options - additional options.
 * @throws {Error} ERR_HISTORY_EMPTY
 * @throws {Error} ERR_CURSOR_INVALID
 */
export function createNavigator<State>(
  history: AnyHistoryItem<State>[],
  cursor: number,
  options?: CtrOptions<State>,
): Navigator<State> {
  type Nav = Navigator<State>;

  if (history.length === 0) {
    throw new Error(ERR_HISTORY_EMPTY);
  }
  if (cursor < 0 || cursor >= history.length) {
    throw new Error(ERR_CURSOR_INVALID);
  }

  options ||= {};
  const shouldNavigate = options.shouldNavigate || (() => true);

  const [, logError] = createLogger('Navigator', {
    bgColor: 'yellow',
    textColor: 'white',
    shouldLog: options.debug,
  });

  /* SHORTCUTS */

  const w = window;
  const h = w.history;

  /* SIGNALS REGISTRY */

  const [addSignalDestroy, destroySignals] = createCbCollector();

  function registerSignal<T>(value: T, options?: SignalOptions<T>): Signal<T> {
    const s = signal(value, options);
    addSignalDestroy(s.destroy);
    return s;
  }

  function registerComputed<T>(fn: () => T, options?: SignalOptions<T>): Computed<T> {
    const s = computed(fn, options);
    addSignalDestroy(s.destroy);
    return s;
  }

  /* PRIVATE SIGNALS */

  const $_attached = registerSignal(false);
  const $_cursor = registerSignal(cursor);
  const $_hasPrev = registerComputed(() => $_cursor() > 0);
  const $_history = registerSignal<Readonly<HistoryItem<State>>[]>(
    history.map(item => formatItem(item)),
    {
      // Disabling comparing to avoid spreading the same history array.
      equals() {
        return false;
      },
    },
  );
  const $_location = registerComputed(() => $_history()[$_cursor()]);

  /* PRIVATE VARIABLES */

  let syncHistoryPromise: BetterPromise<void> | undefined;

  /* PUBLIC SIGNALS */

  const $hasNext = registerComputed(() => $_cursor() !== $_history().length - 1);

  /* METHODS */

  const back: Nav['back'] = () => go(-1);
  const forward: Nav['forward'] = () => go(1);
  const go: Nav['go'] = (delta, fit) => {
    if (delta) {
      const cursor = $_cursor() + delta;

      // Cut the cursor to be in bounds [0, history.length - 1].
      const fitCursor = Math.min(
        Math.max(0, cursor),
        $_history().length - 1,
      );

      if ((cursor === fitCursor || fit) && shouldNavigate.call(n, {
        type: 'go',
        cursor: fitCursor,
        item: $_history()[fitCursor],
      })) {
        $_cursor.set(fitCursor);
      }
    }
  };
  const detach: Nav['detach'] = () => {
    // Remove the back button click listener.
    bbOffClick(bbOnClicked);
    // Remove the listener updating the back button visibility state.
    $_hasPrev.unsub(bbSetVisibility);
    // Remove the listeners synchronizing the browser history state.
    $_location.unsub(syncHistory);
    // Remove browser history change listener.
    w.removeEventListener('popstate', onPopState);
    // Cancel history synchronization promise.
    syncHistoryPromise && syncHistoryPromise.cancel();
    $_attached.set(false);
  };
  const renderPath: Nav['renderPath'] = value => {
    return ensurePrefix(
      ensurePrefix(urlToPath(value), '/').slice(1),
      (options.hashMode || 'slash') === 'slash' ? '#/' : '#',
    );
  };
  const parsePath: Nav['parsePath'] = path => {
    return createSafeURL(createSafeURL(path).hash.slice(1));
  };
  const push: Navigator<State>['push'] = (item, state?: State) => {
    batch(() => {
      const changed = setByCursor('push', $_cursor() + 1, formatItem(item, {
        relativePath: $_location().pathname,
        state,
      }));

      // Remove all items after the current one if something changed, and we have the next items.
      changed && $_history.set($_history().slice(0, $_cursor() + 1));
    });
  };

  /* BACK BUTTON FUNCTIONALITY */

  const bb = options.bb || {};
  const bbOnClicked = bb.onClicked || back;
  const bbSetVisibility = bb.setVisibility || ((visible) => {
    (options.postEvent || postEvent)('web_app_setup_back_button', { is_visible: visible });
  });
  const bbClickEvent = 'back_button_pressed';
  const bbOnClick = bb.onClick || on.bind(null, bbClickEvent);
  const bbOffClick = bb.offClick || off.bind(null, bbClickEvent);

  /* ------------ */

  /**
   * Sets the history item by the specified cursor.
   * @param type - navigation type.
   * @param cursor - history item index to replace.
   * @param item - history item to set.
   * @returns True if changes were applied,
   */
  function setByCursor(
    type: NavigationType,
    cursor: number,
    item: Readonly<HistoryItem<State>>,
  ): boolean {
    if (
      (cursor !== $_cursor() || $_location().id !== item.id)
      && shouldNavigate.call(n, { type, cursor, item })
    ) {
      batch(() => {
        const h = $_history();
        h[cursor] = item;
        $_history.set(h);
        $_cursor.set(cursor);
      });
      return true;
    }
    return false;
  }

  /**
   * Synchronizes the current navigator state with browser history.
   */
  function syncHistory(): void {
    if (!syncHistoryPromise) {
      syncHistoryPromise = BetterPromise
        .withFn(() => {
          // FIXME: Unable to cancel.
          // Drop the browser history and work with the clean one.
          return historyDrop();
        })
        .then(async () => {
          const replaceState = h.replaceState.bind(h);
          const pushState = h.pushState.bind(h);
          const location = $_location();
          const { state } = location;
          const path = renderPath(location);

          // Remove history change event listener to get rid of side effects related to the possible
          // future calls of history.go.
          w.removeEventListener('popstate', onPopState);

          if ($hasNext()) {
            if ($_hasPrev()) {
              // We have both previous and next elements. History should be:
              // [back, *current*, forward]
              replaceState(CURSOR_BACK, '');
              pushState(state, '', path);
              pushState(CURSOR_FORWARD, '');
            } else {
              // We have only next element. History should be:
              // [*current*, forward]
              replaceState(state, path);
              pushState(CURSOR_FORWARD, '');
            }
            // FIXME unable to cancel
            await historyGo(-1);
          } else {
            if ($_hasPrev()) {
              // We have only the previous element. History should be:
              // [back, *current*]
              replaceState(CURSOR_BACK, '');
            } else {
              // We have no back and next elements. History should be:
              // [void, *current*]
              replaceState(CURSOR_VOID, '');
            }
            pushState(state, '', path);
          }
        })
        .catch(logError)
        .finally(() => {
          w.addEventListener('popstate', onPopState);
          syncHistoryPromise = undefined;
        });
    }
  }

  /**
   * Callback which is being called every time, browser emits the "popstate" event. When it
   * happens, we should determine what navigator action should be applied.
   * @param state - popstate event "state" property.
   */
  function onPopState({ state }: PopStateEvent) {
    // There is only one case when state can be CURSOR_VOID - when history contains
    // only one element. In this case, we should return user to the current history element.
    if (state === CURSOR_VOID) {
      h.forward();
    } else if (state === CURSOR_BACK) {
      back();
    } else if (state === CURSOR_FORWARD) {
      forward();
    } else if (state === null) {
      // In case state is null, we recognize current event as occurring whenever user clicks
      // any anchor.
      // TODO: Should we do it?
      push(parsePath(w.location.href));
    }
  }

  const n: Navigator<State> = {
    attach() {
      if (!$_attached()) {
        // Synchronize the state with browser history.
        syncHistory();
        // Add the back button click listener.
        bbOnClick(bbOnClicked);
        // Actualize the back button visibility state.
        bbSetVisibility($_hasPrev());
        // Whenever the current previous navigation element existence state changes, we
        // should actualize the back button visibility state.
        $_hasPrev.sub(bbSetVisibility);
        // Whenever the current location changes, synchronize the navigator state with
        // the browser history.
        $_location.sub(syncHistory);
        // Track browser history changes.
        w.addEventListener('popstate', onPopState);
        $_attached.set(true);
      }
    },
    attached: registerComputed($_attached),
    back,
    cursor: registerComputed($_cursor),
    destroy() {
      // Detach the navigator.
      detach();
      // Destroy all created signals.
      destroySignals();
    },
    detach,
    forward,
    go,
    goTo(index, fit?) {
      return go(index - $_cursor(), fit);
    },
    hasNext: $hasNext,
    hasPrev: registerComputed($_hasPrev),
    history: registerComputed($_history),
    location: registerComputed($_location),
    parsePath,
    push,
    renderPath,
    replace(item, state?: State) {
      setByCursor('replace', $_cursor(), formatItem(item, {
        relativePath: $_location().pathname,
        state,
      }));
    },
  };

  return n;
}