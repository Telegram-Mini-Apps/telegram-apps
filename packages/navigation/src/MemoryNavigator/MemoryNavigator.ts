import {
  signal,
  batch,
  computed,
  type Signal,
  type Computed,
} from '@telegram-apps/signals';

import { ERR_NAVIGATION_HISTORY_EMPTY, ERR_NAVIGATION_CURSOR_INVALID } from '../errors.js';
import { formatItem } from './formatItem.js';
import type { AnyHistoryItem, HistoryItem } from './types.js';

export class MemoryNavigator<Params = {}> {
  private readonly _history: Signal<HistoryItem<Params>[]>;
  protected readonly _cursor: Signal<number>;

  /**
   * @param history - navigation history.
   * @param cursor - currently active navigation history item index.
   * @throws {Error} ERR_NAVIGATION_HISTORY_EMPTY
   * @throws {Error} ERR_NAVIGATION_CURSOR_INVALID
   */
  constructor(
    history: AnyHistoryItem<Params>[],
    cursor: number,
  ) {
    if (history.length === 0) {
      throw new Error(ERR_NAVIGATION_HISTORY_EMPTY);
    }
    if (cursor < 0 || cursor >= history.length) {
      throw new Error(ERR_NAVIGATION_CURSOR_INVALID);
    }
    const historySignal = signal(history.map(formatItem), {
      // Disable comparing to avoid spreading the same history array.
      equals: () => false,
    });
    const cursorSignal = signal(cursor);
    const readonlyHistorySignal = computed(() => {
      return historySignal().map(item => Object.freeze({ ...item }));
    });

    this._history = historySignal;
    this._cursor = cursorSignal;

    this.history = readonlyHistorySignal;
    this.cursor = computed(cursorSignal);
    this.location = computed(() => readonlyHistorySignal()[cursorSignal()]);
    this.hasPrev = computed(() => cursorSignal() > 0);
    this.hasNext = computed(() => cursorSignal() !== historySignal().length - 1);
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
   * Goes to the next history item.
   */
  forward(): void {
    this.go(1);
  }

  /**
   * Changes the currently active history item cursor by the specified delta.
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
      this._history().length - 1,
    );

    if (cursor === fitCursor || fit) {
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
  readonly history: Computed<Readonly<HistoryItem<Params>[]>>;

  /**
   * Currently active navigator location.
   */
  readonly location: Computed<Readonly<HistoryItem<Params>>>;

  /**
   * Adds a new history item removing all after the current one.
   * @param item - item to add.
   */
  push(item: AnyHistoryItem<Params>): void {
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
  replace(item: AnyHistoryItem<Params>): void {
    this.replaceAndMove(this._cursor(), formatItem(item));
  }

  /**
   * Sets the history item by the specified cursor.
   * @param cursor - history item index to replace.
   * @param historyItem - history item to set.
   */
  private replaceAndMove(cursor: number, historyItem: HistoryItem<Params>): void {
    const delta = cursor - this._cursor();
    if (!delta && this.location().id === historyItem.id) {
      return;
    }

    batch(() => {
      const h = this._history();
      h[cursor] = historyItem;
      this._cursor.set(cursor);
      this._history.set(h);
    });
  }
}
