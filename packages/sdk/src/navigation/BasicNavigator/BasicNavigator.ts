import { off } from '@/bridge/events/listening/off.js';
import { on } from '@/bridge/events/listening/on.js';
import { type PostEvent, postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { createError } from '@/errors/createError.js';
import {
  ERROR_NAVIGATION_HISTORY_EMPTY,
  ERROR_NAVIGATION_INDEX_INVALID,
} from '@/errors/errors.js';
import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import type {
  BasicNavigatorAnyHistoryItem,
  BasicNavigatorEvents,
  BasicNavigatorHistoryItem,
} from '@/navigation/BasicNavigator/types.js';

type Emitter<Params> = EventEmitter<BasicNavigatorEvents<Params>>;

export class BasicNavigator<Params = {}> {
  /**
   * Navigation history.
   */
  readonly history: Readonly<BasicNavigatorHistoryItem<Params>>[];

  private readonly ee: Emitter<Params> = new EventEmitter();

  constructor(
    /**
     * Navigation history.
     */
    history: readonly BasicNavigatorAnyHistoryItem<Params>[],
    /**
     * Currently active history item.
     */
    private _index: number,
    /**
     * Function to call Mini Apps methods.
     * @default Global `postEvent` function.
     */
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    if (history.length === 0) {
      throw createError(ERROR_NAVIGATION_HISTORY_EMPTY, 'History should not be empty.');
    }

    if (_index < 0 || _index >= history.length) {
      throw createError(
        ERROR_NAVIGATION_INDEX_INVALID,
        'Index should not be zero and higher or equal than history size.',
      );
    }
    this.history = history.map(this.formatHistoryItem.bind(this));
  }

  /**
   * True, if current navigator is currently attached.
   */
  private attached = false;

  /**
   * Allows this navigator to control the `BackButton` visibility state. It also tracks the
   * `BackButton` clicks and calls the `back` method.
   */
  attach(): void {
    if (!this.attached) {
      this.attached = true;
      this.sync();
      on('back_button_pressed', this.back);
    }
  }

  /**
   * Goes to the previous history item.
   */
  back = (): void => this.go(-1);

  /**
   * Prevents current navigator from controlling the BackButton visibility state.
   */
  detach(): void {
    this.attached = false;
    off('back_button_pressed', this.back);
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
   * Changes currently active history item index by the specified delta. This method doesn't
   * change index in case, the updated index points to the non-existing history item. This behavior
   * is preserved until the `fit` argument is specified.
   * @param delta - index delta.
   * @param fit - cuts the delta argument to fit the bounds `[0, history.length - 1]`.
   */
  go(delta: number, fit?: boolean): void {
    // Compute the next index.
    const index = this.index + delta;

    // Cut the index to be in bounds [0, history.length - 1].
    const fitIndex = Math.min(
      Math.max(0, index),
      this.history.length - 1,
    );

    // We perform "go" only in case, computed and cut indexes are equal or "fit" option was
    // specified.
    if (index === fitIndex || fit) {
      // We are just calling setter to update the index and emit all related events.
      this.replaceAndMove(fitIndex, this.history[fitIndex]);
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
    this.go(index - this.index, fit);
  }

  /**
   * Currently active history item.
   */
  get historyItem(): Readonly<BasicNavigatorHistoryItem<Params>> {
    return this.history[this.index];
  }

  /**
   * True if navigator has items before the current item.
   */
  get hasPrev(): boolean {
    return this.index > 0;
  }

  /**
   * True if navigator has items after the current item.
   */
  get hasNext(): boolean {
    return this.index !== this.history.length - 1;
  }

  /**
   * Currently active history item index.
   */
  get index(): number {
    return this._index;
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
   * @param item - item to add.
   */
  push(item: BasicNavigatorAnyHistoryItem<Params>): void {
    if (this.hasNext) {
      this.history.splice(this.index + 1);
    }
    this.replaceAndMove(this.index + 1, this.formatHistoryItem(item));
  }

  /**
   * Replaces current history item.
   * @param entry - entry to replace with.
   */
  replace(entry: BasicNavigatorAnyHistoryItem<Params>): void {
    this.replaceAndMove(this.index, this.formatHistoryItem(entry));
  }

  /**
   * Sets history item by the specified index.
   * @param index - history item index to replace.
   * @param historyItem - history item to set.
   */
  private replaceAndMove(index: number, historyItem: BasicNavigatorHistoryItem<Params>): void {
    const delta = index - this.index;
    if (!delta && this.historyItem === historyItem) {
      // Nothing changed.
      return;
    }

    const from = this.historyItem;

    if (this.index !== index) {
      const prevIndex = this._index;
      this._index = index;

      // If navigator is attached and back button local visibility state changed, we should
      // notify Telegram app about it.
      if (this.attached && prevIndex > 0 !== index > 0) {
        this.sync();
      }
    }

    this.history[index] = historyItem;
    this.ee.emit('change', {
      navigator: this,
      from,
      to: this.historyItem,
      delta,
    });
  }

  /**
   * Actualizes the BackButton visibility state.
   */
  private sync(): void {
    this.postEvent('web_app_setup_back_button', { is_visible: !!this.index });
  }
}
