import { batch, computed, signal } from '@telegram-apps/signals';
import { off, on, postEvent } from '@telegram-apps/bridge';

import { formatItem } from './formatItem.js';
import { ensurePrefix } from './ensurePrefix.js';
import { urlToPath } from './urlToPath.js';
import { createSafeURL } from './createSafeURL.js';
import { dropHistory as historyDrop } from './dropHistory.js';
import { historyGo as historyGo } from './historyGo.js';
import { ERR_CURSOR_INVALID, ERR_HISTORY_EMPTY } from './errors.js';
import type {
  AnyHistoryItem,
  CtrOptions,
  HistoryItem,
  NavigationType,
  Navigator,
  URLLike,
} from './types.js';

const CURSOR_VOID = 0;
const CURSOR_BACK = 1;
const CURSOR_FORWARD = 2;

/**
 * Creates a new navigator.
 * @param history - navigation history.
 * @param cursor - currently active history item.
 * @param options - additional options.
 * @throws {Error} ERR_NAVIGATION_HISTORY_EMPTY
 * @throws {Error} ERR_NAVIGATION_CURSOR_INVALID
 */
export function createNavigator<State>(
  history: AnyHistoryItem<State>[],
  cursor: number,
  options?: CtrOptions<State>,
): Navigator<State> {
  if (history.length === 0) {
    throw new Error(ERR_HISTORY_EMPTY);
  }
  if (cursor < 0 || cursor >= history.length) {
    throw new Error(ERR_CURSOR_INVALID);
  }

  options ||= {};
  const bb = options.bb || {};
  const mode = options.hashMode || 'slash';
  const shouldNavigate = options.shouldNavigate || (() => true);

  /* PRIVATE SIGNALS */

  const $_attached = signal(false);
  const $_attaching = signal(false);
  const $_cursor = signal(cursor);
  const $_hasPrev = computed(() => $_cursor() > 0);
  const $_history = signal<Readonly<HistoryItem<State>>[]>(
    history.map(item => formatItem(item)),
    {
      // Disabling comparing to avoid spreading the same history array.
      equals() {
        return false;
      },
    },
  );
  const $_location = computed(() => $_history()[$_cursor()]);
  const $_syncing = signal(false);

  /* PUBLIC SIGNALS */

  const $hasNext = computed(() => $_cursor() !== $_history().length - 1);

  /* METHODS */

  const back = go.bind(0, -1);
  const forward = go.bind(0, 1);

  function go(delta: number, fit?: boolean): void {
    if (!delta) {
      return;
    }

    // Compute the next cursor.
    const cursor = $_cursor() + delta;

    // Cut the cursor to be in bounds [0, history.length - 1].
    const fitCursor = Math.min(
      Math.max(0, cursor),
      $_history().length - 1,
    );

    if (
      (cursor === fitCursor || fit)
      && shouldNavigate.call(n, {
        type: 'go',
        cursor: fitCursor,
        item: $_history()[fitCursor],
      })
    ) {
      $_cursor.set(fitCursor);
    }
  }

  function renderPath(value: string | Partial<URLLike>): string {
    return ensurePrefix(
      ensurePrefix(urlToPath(value), '/').slice(1),
      mode === 'slash' ? '#/' : '#',
    );
  }

  function parsePath(path: string | Partial<URLLike>): URLLike {
    return createSafeURL(createSafeURL(path).hash.slice(1));
  }

  const push: Navigator<State>['push'] = (item, state?: State) => {
    batch(() => {
      const changed = setByCursor('push', $_cursor() + 1, formatItem(item, {
        relativePath: $_location().pathname,
        state,
      }));

      // Remove all items after the current one if something changed, and we have the next items.
      changed && $hasNext() && $_history.set(
        $_history().slice(0, $_cursor() + 1),
      );
    });
  };

  /* BACK BUTTON FUNCTIONALITY */

  const onBbPressed = bb.onPressed || back;
  const setBbVisibility = bb.setVisibility || ((visible) => {
    (options.postEvent || postEvent)('web_app_setup_back_button', { is_visible: visible });
  });
  const trackBbPress = bb.trackPress || on.bind(null, 'back_button_pressed');
  const untrackBbPress = bb.untrackPress || off.bind(null, 'back_button_pressed');

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
  function syncHistory(): Promise<void> {
    $_syncing.set(true);

    const h = window.history;
    const replaceState = h.replaceState.bind(h);
    const pushState = h.pushState.bind(h);

    // Remove history change event listener to get rid of side effects related to the possible
    // future calls of history.go.
    window.removeEventListener('popstate', onPopState);

    const location = $_location();
    const { state } = location;
    const path = renderPath(location);

    // Drop the browser history and work with the clean one.
    return historyDrop().then(async () => {
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

      window.addEventListener('popstate', onPopState);
      $_syncing.set(false);
    });
  }

  /**
   * Sync alternative for the syncHistory function, but ignoring its result.
   */
  function syncHistorySync() {
    void syncHistory();
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
      window.history.forward();
    } else if (state === CURSOR_BACK) {
      back();
    } else if (state === CURSOR_FORWARD) {
      forward();
    } else if (state === null) {
      // In case state is null, we recognize current event as occurring whenever user clicks
      // any anchor.
      // TODO: Should we do it?
      push(parsePath(window.location.href));
    }
  }

  const n: Navigator<State> = {
    attach() {
      if ($_attaching() || $_attached()) {
        return;
      }
      $_attaching.set(true);

      void syncHistory().then(() => {
        window.addEventListener('popstate', onPopState);
        trackBbPress(onBbPressed);
        setBbVisibility($_hasPrev());
        $_location.sub(syncHistorySync);
        $_hasPrev.sub(setBbVisibility);

        batch(() => {
          $_attached.set(true);
          $_attaching.set(false);
        });
      });
    },
    attached: computed($_attached),
    attaching: computed($_attaching),
    back,
    cursor: computed($_cursor),
    detach() {
      if ($_attached()) {
        window.removeEventListener('popstate', onPopState);
        untrackBbPress(onBbPressed);
        $_location.unsub(syncHistorySync);
        $_hasPrev.unsub(setBbVisibility);
        $_attached.set(false);
      }
    },
    forward,
    go,
    goTo(index, fit?) {
      return go(index - $_cursor(), fit);
    },
    hasNext: $hasNext,
    hasPrev: computed($_hasPrev),
    history: computed($_history),
    location: computed($_location),
    parsePath,
    push,
    renderPath,
    replace(item, state?: State) {
      setByCursor('replace', $_cursor(), formatItem(item, {
        relativePath: $_location().pathname,
        state,
      }));
    },
    syncing: computed($_syncing),
  };

  return n;
}