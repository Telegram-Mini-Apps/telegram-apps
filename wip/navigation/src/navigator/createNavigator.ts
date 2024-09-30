import {
  batch,
  computed,
  signal,
  type Computed,
  type Signal,
  type SignalOptions,
} from '@telegram-apps/signals';
import { off, on, postEvent } from '@telegram-apps/bridge';
import { createCbCollector } from '@telegram-apps/toolkit';

import { formatItem } from './formatItem.js';
import { ensurePrefix } from '../ensurePrefix.js';
import { urlToPath } from '../url/urlToPath.js';
import { createSafeURL } from '../url/createSafeURL.js';
import { ERR_CURSOR_INVALID, ERR_HISTORY_EMPTY } from '../errors.js';
import {
  NavigatorCtrOptions,
  NavigationType,
  Navigator,
  AnyHistoryItem, HistoryItem,
} from './types.js';

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
  options?: NavigatorCtrOptions<State>,
): Navigator<State> {
  type Nav = Navigator<State>;

  // region Arguments validation.
  if (history.length === 0) {
    throw new Error(ERR_HISTORY_EMPTY);
  }
  if (cursor < 0 || cursor >= history.length) {
    throw new Error(ERR_CURSOR_INVALID);
  }
  // endregion

  options ||= {};
  const shouldNavigate = options.shouldNavigate || (() => true);

  // region Signals registry.

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

  // endregion

  // region Private signals.

  const $_attached = registerSignal(false);
  const $_cursor = registerSignal(cursor);
  const $_hasPrev = registerComputed(() => $_cursor() > 0);
  const $_history = registerSignal<Readonly<Readonly<HistoryItem<State>>[]>>(
    Object.freeze(
      history.map(item => formatItem(item))
    ),
  );
  const $_location = registerComputed(() => $_history()[$_cursor()]);

  // endregion

  // region Public signals.

  const $hasNext = registerComputed(() => $_cursor() !== $_history().length - 1);

  // endregion

  // region Methods

  function back() {
    go(-1);
  }
  const go: Nav['go'] = (delta, fit) => {
    if (delta) {
      const cursor = $_cursor() + delta;

      // Cut the cursor to be in bounds [0, history.length - 1].
      const fitCursor = Math.min(
        Math.max(0, cursor),
        $_history().length - 1,
      );

      if ((cursor === fitCursor || fit) && shouldNavigate({
        type: 'go',
        cursor: fitCursor,
        item: $_history()[fitCursor],
      })) {
        $_cursor.set(fitCursor);
      }
    }
  };
  const push = ((item: AnyHistoryItem<State>, maybeState?: State) => {
    batch(() => {
      const relativePath = $_location().pathname;
      const formatted = typeof item === 'string'
        ? formatItem(item, maybeState, relativePath)
        : formatItem(item, relativePath);
      const changed = setByCursor('push', $_cursor() + 1, formatted);

      // Remove all items after the current one if something changed, and we have the next items.
      changed && $_history.set($_history().slice(0, $_cursor() + 1));
    });
  }) as Nav['push'];
  const detach: Nav['detach'] = () => {
    // Remove the back button click listener.
    bbOffClick(bbOnClicked);
    // Remove the listener updating the back button visibility state.
    $_hasPrev.unsub(bbSetVisibility);
    $_attached.set(false);
  };
  const renderPath: Nav['renderPath'] = value => {
    return ensurePrefix(ensurePrefix(urlToPath(value), '/').slice(1), '#/');
  };
  const parsePath: Nav['parsePath'] = path => {
    return createSafeURL(createSafeURL(path).hash.slice(1));
  };

  // endregion

  // region Back button functionality.

  const bb = options.bb || {};
  const bbOnClicked = bb.onClicked || back;
  const bbSetVisibility = bb.setVisibility || ((visible) => {
    (options.postEvent || postEvent)('web_app_setup_back_button', { is_visible: visible });
  });
  const bbClickEvent = 'back_button_pressed';
  const bbOnClick = bb.onClick || on.bind(null, bbClickEvent);
  const bbOffClick = bb.offClick || off.bind(null, bbClickEvent);

  // endregion

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
      && shouldNavigate({ type, cursor, item })
    ) {
      batch(() => {
        const h = [...$_history()];
        h[cursor] = item;
        $_history.set(h);
        $_cursor.set(cursor);
      });
      return true;
    }
    return false;
  }

  return {
    attach() {
      if (!$_attached()) {
        bbOnClick(bbOnClicked);
        bbSetVisibility($_hasPrev());
        $_hasPrev.sub(bbSetVisibility);
        $_attached.set(true);
      }
    },
    attached: registerComputed($_attached),
    back,
    cursor: registerComputed($_cursor),
    destroy() {
      detach();
      destroySignals();
    },
    detach,
    forward() {
      go(1);
    },
    go,
    goTo(index, options) {
      return go(index - $_cursor(), options);
    },
    hasNext: $hasNext,
    hasPrev: registerComputed($_hasPrev),
    history: registerComputed($_history),
    location: registerComputed($_location),
    parsePath,
    push,
    renderPath,
    replace: ((item: AnyHistoryItem<State>, maybeState?: State) => {
      const relativePath = $_location().pathname;
      const formatted = typeof item === 'string'
        ? formatItem(item, maybeState, relativePath)
        : formatItem(item, relativePath);
      setByCursor('replace', $_cursor(), formatted);
    }) as Nav['replace'],
  };
}