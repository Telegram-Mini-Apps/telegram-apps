import { createError } from '@/errors/createError.js';
import {
  ERROR_NAVIGATION_CURSOR_INVALID,
  ERROR_NAVIGATION_HISTORY_EMPTY,
} from '@/errors/errors.js';
import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import type {
  BasicNavigatorAnyHistoryItem,
  BasicNavigatorEvents,
  BasicNavigatorHistoryItem,
} from '@/navigation/BasicNavigator/types.js';

type Emitter<Params> = EventEmitter<BasicNavigatorEvents<Params>>;

export class BasicNavigator<Params = {}> {
  readonly history: Readonly<BasicNavigatorHistoryItem<Params>>[];

  private readonly ee: Emitter<Params> = new EventEmitter();

  constructor(
    history: readonly BasicNavigatorAnyHistoryItem<Params>[],
    protected _cursor: number,
  ) {
    if (history.length === 0) {
      throw createError(ERROR_NAVIGATION_HISTORY_EMPTY, 'History should not be empty.');
    }

    if (_cursor < 0 || _cursor >= history.length) {
      throw createError(
        ERROR_NAVIGATION_CURSOR_INVALID,
        'Cursor should not be zero and higher or equal than history size.',
      );
    }
    this.history = history.map(this.formatHistoryItem.bind(this));
  }

  /**
   * Goes to the previous history item.
   */
  back(): void {
    this.go(-1);
  }

  /**
   * Current history cursor.
   */
  get cursor(): number {
    return this._cursor;
  }

  /**
   * Currently active history item.
   */
  get historyItem(): Readonly<BasicNavigatorHistoryItem<Params>> {
    return this.history[this.cursor];
  }

  /**
   * Converts any known history item type to the local one.
   * @param historyItem - history item presented as a string or an object.
   */
  private formatHistoryItem(
    historyItem: BasicNavigatorAnyHistoryItem<Params>,
  ): Readonly<BasicNavigatorHistoryItem<Params>> {
    let path: string;
    let params: Params | undefined;
    let id: string | undefined;

    if (typeof historyItem === 'string') {
      path = historyItem;
    } else {
      path = historyItem.pathname === undefined
        // History may be undefined, if current function is being called in constructor.
        ? this.history
          ? this.historyItem.pathname
          : ''
        : historyItem.pathname;
      params = historyItem.params;
      id = historyItem.id;
    }

    return Object.freeze({
      id: id || ((Math.random() * 2 ** 14) | 0).toString(16),
      pathname: path,
      params,
    });
  }

  /**
   * Goes to the next history item.
   */
  forward(): void {
    this.go(1);
  }

  /**
   * Moves history cursor by specified delta.
   * @param delta - cursor delta.
   * @param performCut - true, if method should be performed with allowed cut value in case, delta
   * is out of bounds. By default, method will not be performed if delta is out of bounds.
   */
  go(delta: number, performCut?: boolean): void {
    // Zero delta does nothing.
    if (!delta) {
      return;
    }

    // Compute the next cursor.
    const nextCursor = this.cursor + delta;

    // Compute the cut cursor and make it be in bounds [0, this.entries.length).
    const cutCursor = Math.min(
      Math.max(0, nextCursor),
      this.history.length - 1,
    );

    // If computed and cut cursors are different, it means, delta is out of bounds. We stop
    // method performing if "performCut" is not set.
    if (nextCursor !== cutCursor && !performCut) {
      return;
    }

    const from = this.historyItem;
    const prevCursor = this.cursor;
    this._cursor = cutCursor;
    this.ee.emit('change', {
      navigator: this,
      from,
      to: this.historyItem,
      delta: cutCursor - prevCursor,
    });
  }

  /**
   * True if navigator has items before the current cursor.
   */
  get hasPrev(): boolean {
    return this.cursor > 0;
  }

  /**
   * True if navigator has items after the current cursor.
   */
  get hasNext(): boolean {
    return this.cursor !== this.history.length - 1;
  }

  /**
   * Adds new event listener.
   */
  on: Emitter<Params>['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: Emitter<Params>['off'] = this.ee.off.bind(this.ee);

  /**
   * Adds new history item removing all after the current one.
   * @param entry - entry to add.
   */
  push(entry: BasicNavigatorAnyHistoryItem<Params>): void {
    if (this.hasNext) {
      this.history.splice(this.cursor + 1);
    }
    this.setByDelta(1, this.formatHistoryItem(entry));
  }

  /**
   * Replaces current history item.
   * @param entry - entry to replace with.
   */
  replace(entry: BasicNavigatorAnyHistoryItem<Params>): void {
    this.setByDelta(0, this.formatHistoryItem(entry));
  }

  /**
   * Sets history item by specified cursor delta.
   * @param delta - cursor delta.
   * @param historyItem - history item to set.
   */
  private setByDelta(delta: number, historyItem: BasicNavigatorHistoryItem<Params>): void {
    const nextCursor = this.cursor + delta;
    const from = this.historyItem;
    this._cursor = nextCursor;
    this.history[this.cursor] = historyItem;
    this.ee.emit('change', {
      navigator: this,
      from,
      to: this.historyItem,
      delta,
    });
  }
}
