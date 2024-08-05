import {
  type PostEvent,
  postEvent as defaultPostEvent,
  on, off,
} from '@telegram-apps/bridge';
import { signal, computed, type Signal, type Computed, batch } from '@telegram-apps/signals';

import { ERR_NAVIGATION_HISTORY_EMPTY, ERR_NAVIGATION_CURSOR_INVALID } from '../errors.js';
import { formatItem } from './formatItem.js';
import type {
  AnyNavigatorHistoryItem,
  NavigatorConOptions,
  NavigatorHistoryItem,
} from './types.js';

export class Navigator<Params = {}> {
  private readonly _history: Signal<NavigatorHistoryItem<Params>[]>;
  private readonly _cursor: Signal<number>;
  private readonly _isAttached: Signal<boolean>;

  private readonly postEvent: PostEvent;
  private readonly onBackButtonPressed: () => void;

  /**
   * @param history - navigation history.
   * @param cursor - currently active navigation history item index.
   * @param options - additional navigator options.
   * @throws {Error} ERR_NAVIGATION_HISTORY_EMPTY
   * @throws {Error} ERR_NAVIGATION_CURSOR_INVALID
   */
  constructor(
    history: AnyNavigatorHistoryItem<Params>[],
    cursor: number,
    options?: NavigatorConOptions,
  ) {
    if (history.length === 0) {
      throw new Error(ERR_NAVIGATION_HISTORY_EMPTY);
    }
    if (cursor < 0 || cursor >= history.length) {
      throw new Error(ERR_NAVIGATION_CURSOR_INVALID);
    }
    options ||= {};
    this.postEvent = options.postEvent || defaultPostEvent;
    this.onBackButtonPressed = options.onBackButtonPressed || this.back.bind(this);

    const historySignal = signal(history.map(formatItem));
    const cursorSignal = signal(cursor);
    const isAttachedSignal = signal(false);

    const readonlyHistorySignal = computed(() => {
      return historySignal().map(item => Object.freeze({ ...item }));
    });

    this._history = historySignal;
    this._isAttached = isAttachedSignal;
    this._cursor = cursorSignal;

    this.history = readonlyHistorySignal;
    this.isAttached = computed(isAttachedSignal);
    this.cursor = computed(cursorSignal);
    this.location = computed(() => readonlyHistorySignal()[cursorSignal()]);
    this.hasPrev = computed(() => cursorSignal() > 0);
    this.hasNext = computed(() => cursorSignal() !== historySignal().length - 1);
  }

  /**
   * True if the current navigator is currently attached.
   */
  readonly isAttached: Computed<boolean>;

  /**
   * Allows this navigator to control the back button visibility state.
   * It also tracks the back button clicks and calls the corresponding callback.
   */
  attach(): void {
    if (!this._isAttached()) {
      this.sync();
      on('back_button_pressed', this.onBackButtonPressed);
      this._cursor.sub(this.sync);
      this._isAttached.set(true);
    }
  }

  /**
   * Goes to the previous history item.
   */
  back(): void {
    this.go(-1);
  }

  /**
   * Currently active navigation history item index.
   */
  readonly cursor: Computed<number>;

  /**
   * Prevents the current navigator from working with the back button.
   */
  detach(): void {
    off('back_button_pressed', this.onBackButtonPressed);
    this._cursor.unsub(this.sync);
    this._isAttached.set(false);
  }

  /**
   * Goes to the next history item.
   */
  forward(): void {
    this.go(1);
  }

  /**
   * Changes currently active history item cursor by the specified delta.
   *
   * This method doesn't change the cursor in case the updated cursor points to the non-existing
   * history item. This behavior is preserved until the `fit` argument is specified.
   * @param delta - cursor delta.
   * @param fit - cuts the delta argument to fit the bounds `[0, history.length - 1]`.
   */
  go(delta: number, fit?: boolean): void {
    // Compute the next cursor.
    const cursor = this._cursor() + delta;

    // Cut the cursor to be in bounds [0, history.length - 1].
    const fitCursor = Math.min(
      Math.max(0, cursor),
      this.history.length - 1,
    );

    if (cursor !== fitCursor || fit) {
      this.replaceAndMove(fitCursor, this._history()[fitCursor]);
    }
  }

  /**
   * Goes to the specified index. Method does nothing in case, passed index is out of bounds.
   *
   * If "fit" option was specified and index is out of bounds, it will be cut to the nearest
   * bound.
   * @param index - target index.
   * @param fit - cuts the index argument to fit the bounds `[0, history.length - 1]`.
   */
  goTo(index: number, fit?: boolean): void {
    this.go(index - this._cursor(), fit);
  }

  /**
   * True if navigator has items before the current item.
   */
  readonly hasPrev: Computed<boolean>;

  /**
   * True if navigator has items after the current item.
   */
  readonly hasNext: Computed<boolean>;

  /**
   * Navigation history.
   */
  readonly history: Computed<Readonly<NavigatorHistoryItem<Params>[]>>;

  /**
   * Currently active navigator location.
   */
  readonly location: Computed<Readonly<NavigatorHistoryItem<Params>>>;

  /**
   * Adds a new history item removing all after the current one.
   * @param item - item to add.
   */
  push(item: AnyNavigatorHistoryItem<Params>): void {
    batch(() => {
      const cursor = this._cursor();
      if (this.hasNext()) {
        this._history.set(this._history().slice(0, cursor + 1));
      }
      this.replaceAndMove(cursor + 1, formatItem(item));
    });
  }

  /**
   * Replaces the currently active navigation item.
   * @param item - item to replace the current one with.
   */
  replace(item: AnyNavigatorHistoryItem<Params>): void {
    this.replaceAndMove(this._cursor(), formatItem(item));
  }

  /**
   * Sets the history item by the specified cursor.
   * @param cursor - history item index to replace.
   * @param historyItem - history item to set.
   */
  private replaceAndMove(cursor: number, historyItem: NavigatorHistoryItem<Params>): void {
    const delta = cursor - this._cursor();
    if (!delta && this.location().id === historyItem.id) {
      return;
    }

    batch(() => {
      const h = this._history();
      h[cursor] = historyItem;
      this._cursor.set(cursor);
      this._history.set([...h]);
    });
  }

  /**
   * Actualizes the `BackButton` visibility state.
   */
  private sync = (): void => {
    this.postEvent('web_app_setup_back_button', { is_visible: !!this._cursor() });
  };
}
