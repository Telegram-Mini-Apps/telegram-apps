import {
  batch,
  computed,
  signal,
  type Computed,
  type Signal,
  type SignalOptions,
} from '@telegram-apps/signals';
import { off, on, postEvent } from '@telegram-apps/bridge';
import {
  type AsyncOptions,
  CancelablePromise,
  createCbCollector,
  createLogger,
  isCancelledError, sleep,
} from '@telegram-apps/toolkit';

import { formatItem } from './formatItem.js';
import { ensurePrefix } from '../ensurePrefix.js';
import { urlToPath } from '../url/urlToPath.js';
import { createSafeURL } from '../url/createSafeURL.js';
import { historyGo } from '../history/historyGo.js';
import { ERR_CURSOR_INVALID, ERR_HISTORY_EMPTY } from '../errors.js';
import type {
  AnyHistoryItem,
  NavigatorCtrOptions,
  HistoryItem,
  NavigationType,
  Navigator,
} from './types.js';

const CURSOR_BACK = -1;
const CURSOR_VOID = 0;
const CURSOR_FORWARD = 1;

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

  const [, logError] = createLogger('Navigator', {
    bgColor: 'yellow',
    textColor: 'white',
    shouldLog: options.debug,
  });

  // region Shortcuts.

  const w = window;
  const h = w.history;
  const hLength = () => h.length;
  const replaceState = h.replaceState.bind(h);
  const pushState = h.pushState.bind(h);

  // endregion

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

  // endregion

  // region Private variables.

  let attachPromise: CancelablePromise<void> | undefined;
  let isSyncing = false;
  let syncHistoryPromise: CancelablePromise<void> | undefined;
  let baseHistoryLength = 0;

  // endregion

  // region Public signals.

  const $hasNext = registerComputed(() => $_cursor() !== $_history().length - 1);

  // endregion

  // region Methods

  const go: Nav['go'] = (delta, options) => {
    return withFnCatched(abortSignal => {
      if (delta) {
        const cursor = $_cursor() + delta;

        // Cut the cursor to be in bounds [0, history.length - 1].
        const fitCursor = Math.min(
          Math.max(0, cursor),
          $_history().length - 1,
        );

        options ||= {};
        if ((cursor === fitCursor || options.fit) && shouldNavigate({
          type: 'go',
          cursor: fitCursor,
          item: $_history()[fitCursor],
        })) {
          if ($_cursor() !== fitCursor) {
            $_cursor.set(fitCursor);
            return syncHistory(abortSignal);
          }
        }
      }
    }, options);
  };
  const back: Nav['back'] = go.bind(undefined, -1);
  const forward: Nav['forward'] = go.bind(undefined, 1);
  const push: Nav['push'] = (item, optionsOrState?) => {
    return withFnCatched((abortSignal) => {
      let changed: boolean;

      batch(() => {
        changed = setByCursor('push', $_cursor() + 1, formatItem(item, {
          relativePath: $_location().pathname,
          state: optionsOrState && 'state' in optionsOrState ? optionsOrState.state : undefined,
        }));

        // Remove all items after the current one if something changed, and we have the next items.
        changed && $_history.set($_history().slice(0, $_cursor() + 1));
      });

      return changed! ? syncHistory(abortSignal) : undefined;
    }, optionsOrState);
  };
  const detach: Nav['detach'] = () => {
    // Cancel promises.
    syncHistoryPromise && syncHistoryPromise.cancel();
    attachPromise && attachPromise.cancel();

    // Remove the back button click listener.
    bbOffClick(bbOnClicked);
    // Remove the listener updating the back button visibility state.
    $_hasPrev.unsub(bbSetVisibility);
    // Remove browser history change listener.
    w.removeEventListener('popstate', onPopState);

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
  const bbOnClicked = bb.onClicked || (() => {
    void back();
  });
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
   * Callback which is being called every time, browser emits the "popstate" event. When it
   * happens, we should determine what navigator action should be applied.
   * @param state - popstate event "state" property.
   */
  function onPopState({ state }: PopStateEvent) {
    //fixme: take a look at back and forward result
    if (isSyncing) {
      return;
    }
    console.warn('State', state)

    // There is only one case when state can be CURSOR_VOID - when history contains
    // only one element. In this case, we should return user to the current history element.
    if (state === CURSOR_VOID) {
      h.forward();
    } else if (state === CURSOR_BACK) {
      console.log('Popstate go back');
      void back();
    } else if (state === CURSOR_FORWARD) {
      console.log('Popstate go forward');
      void forward();
    }
  }

  /**
   * Creates a new CancelablePromise and with a catcher catching the promise and re-throwing
   * non-cancellation errors, logging them.
   * @param fn - promise constructor.
   * @param options - additional options.
   */
  function withFnCatched<T>(
    fn: (abortSignal: AbortSignal) => (T | PromiseLike<T>),
    options?: AsyncOptions,
  ): CancelablePromise<T | void> {
    return CancelablePromise.withFn(fn, options).catch(e => {
      if (!isCancelledError(e)) {
        logError(e);
        throw e;
      }
    });
  }

  /**
   * Setups the history making it ready to be modified by us.
   * @param abortSignal - signal to abort the operation.
   */
  function setupHistory(abortSignal?: AbortSignal): CancelablePromise<void> {
    return withFnCatched(
      async abortSignal => {
        const historyLength = hLength();

        // Push an empty state, so we know, the browser allows us to manipulate the history.
        pushState(null, '');

        if (historyLength === hLength()) {
          // Some browsers may prevent the pushState from being executed initially. I have found
          // such behavior in Google Chrome when history.length === 1. It shows the following
          // warning:
          // > Use of history.pushState in a trivial session history context, which maintains
          // > only one session history entry, is treated as history.replaceState.
          //
          // I wasn't able to find any information on this warning, so I decided to write some
          // magic here. To be honest, we will meet this problem only in development mode in
          // Google Chrome.
          //
          // In this case, all pushState and replaceState calls will be merged into a single one,
          // but after some time the browser unlocks the history and appends a newly created
          // navigation entry, allowing us to manipulate it.
          while (historyLength === hLength() && !abortSignal.aborted) {
            // Each 50ms we are checking if history changed.
            await sleep(50, abortSignal);
          }
          // Add another empty entry to work with the single behavior we expected before.
          pushState(null, '');
        }
        baseHistoryLength = hLength() - 1;
        console.log('Base len', baseHistoryLength);
        // await historyGo(-1, { abortSignal });
      }, { abortSignal, timeout: 2000 },
    );
  }

  /**
   * Synchronizes the current navigator state with browser history.
   * @param abortSignal - signal to abort the execution.
   */
  function syncHistory(abortSignal?: AbortSignal): CancelablePromise<void> {
    return syncHistoryPromise || (
      syncHistoryPromise = withFnCatched(
        async (abortSignal) => {
          isSyncing = true;

          // Push an empty state to cut states we have no access to, placed after the current one.
          // It will also actualize the history length removing those after the currently
          // pointed (history.length may remain the same even if we use go(N), we don't
          // want that).
          pushState(null, '');

          // Then, let's go to the initial browser history element.
          const asyncOptions = { abortSignal };
          console.log('Diff', baseHistoryLength, hLength(), baseHistoryLength - hLength());
          await historyGo(baseHistoryLength - hLength(), asyncOptions);

          // Then, actualize the browser navigation elements state.
          // We should have the following history:
          // [void or back, current, [forward]]
          const location = $_location();

          replaceState($_hasPrev() ? CURSOR_BACK : CURSOR_VOID, '');
          pushState(location.state, '', renderPath(location));
          console.log('has prev', $_hasPrev());
          console.log('has next', $hasNext());
          if ($hasNext()) {
            pushState(CURSOR_FORWARD, '');
            await historyGo(-1, asyncOptions);
          }
        },
        { abortSignal },
      ).finally(() => {
        isSyncing = false;
        syncHistoryPromise = undefined;
      })
    );
  }

  return {
    attach(options) {
      if ($_attached()) {
        return CancelablePromise.resolve();
      }
      if (!attachPromise) {
        attachPromise = withFnCatched(
          async (signal) => {
            // Setup the history, so we can work with it.
            await setupHistory(signal);
            // Synchronize the state with the browser history.
            await syncHistory(signal);

            // Add the back button click listener.
            bbOnClick(bbOnClicked);
            // Actualize the back button visibility state.
            bbSetVisibility($_hasPrev());

            // Whenever the previous element accessibility changes, we should actualize
            // the back button visibility state.
            $_hasPrev.sub(bbSetVisibility);

            // Track all popstate events and make the navigator react.
            w.addEventListener('popstate', onPopState);

            $_attached.set(true);
          },
          options,
        )
          .finally(() => {
            attachPromise = undefined;
          });
      }
      return attachPromise;
    },
    attached: registerComputed($_attached),
    back,
    cursor: registerComputed($_cursor),
    destroy() {
      detach();
      destroySignals();
    },
    detach,
    forward,
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
    replace(item, optionsOrState) {
      return withFnCatched((abortSignal) => {
        const changed = setByCursor('replace', $_cursor(), formatItem(item, {
          relativePath: $_location().pathname,
          state: optionsOrState && 'state' in optionsOrState ? optionsOrState.state : undefined,
        }));

        return changed ? syncHistory(abortSignal) : undefined;
      }, optionsOrState);
    },
  };
}