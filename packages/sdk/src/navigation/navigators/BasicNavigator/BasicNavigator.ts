import { createError } from '@/errors/createError.js';
import { ERROR_NAVIGATION_CURSOR_INVALID, ERROR_NAVIGATION_LIST_EMPTY } from '@/errors/errors.js';
import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';

import type {
  BasicNavigatorAnyEntry,
  BasicNavigatorConEntry,
  BasicNavigatorEntry,
  BasicNavigatorEvents,
} from './types.js';

type Emitter<Params> = EventEmitter<BasicNavigatorEvents<Params>>;

export class BasicNavigator<Params = {}> {
  readonly entries: Readonly<BasicNavigatorEntry<Params>>[];

  private readonly ee: Emitter<Params> = new EventEmitter();

  constructor(
    entries: readonly BasicNavigatorConEntry<Params>[],
    protected _cursor: number,
  ) {
    if (entries.length === 0) {
      throw createError(ERROR_NAVIGATION_LIST_EMPTY, 'Entries list should not be empty.');
    }

    if (_cursor < 0 || _cursor >= entries.length) {
      throw createError(
        ERROR_NAVIGATION_CURSOR_INVALID,
        'Cursor should not be zero and higher or equal than entries count.',
      );
    }
    this.entries = entries.map(this.formatEntry.bind(this));
  }

  /**
   * Goes to the previous entry.
   */
  back(): void {
    this.go(-1);
  }

  /**
   * Current navigation entries cursor.
   */
  get cursor(): number {
    return this._cursor;
  }

  /**
   * Current navigation entry information.
   */
  get entry(): Readonly<BasicNavigatorEntry<Params>> {
    return this.entries[this.cursor];
  }

  /**
   * Converts any known entry type to the local one.
   * @param entry - entry presented as string or object.
   */
  private formatEntry(
    entry: BasicNavigatorAnyEntry<Params>,
  ): Readonly<BasicNavigatorEntry<Params>> {
    let path: string;
    let params: Params | undefined;
    let id: string | undefined;

    if (typeof entry === 'string') {
      path = entry;
    } else {
      const { pathname: entryPath = this.entry.pathname } = entry;
      path = entryPath;
      params = entry.params;
      id = entry.id;
    }

    return Object.freeze({
      id: id || Math.random().toString(),
      pathname: path,
      params,
    });
  }

  /**
   * True if navigator has navigation entries before the current cursor.
   */
  get hasPrev(): boolean {
    return this.cursor > 0;
  }

  /**
   * True if navigator has navigation entries after the current cursor.
   */
  get hasNext(): boolean {
    return this.cursor !== this.entries.length - 1;
  }

  /**
   * Goes to the next entry.
   */
  forward(): void {
    this.go(1);
  }

  /**
   * Moves entries cursor by specified delta.
   * @param delta - cursor delta.
   */
  go(delta: number): void {
    const nextCursor = this.cursor + delta;
    if (nextCursor < 0 || nextCursor >= this.entries.length) {
      return;
    }
    const from = this.entry;
    this._cursor = nextCursor;
    this.ee.emit('change', {
      navigator: this,
      from,
      to: this.entry,
      delta,
    });
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
   * Adds new entry removing all after the current one.
   * @param entry - entry to add.
   */
  push(entry: BasicNavigatorAnyEntry<Params>): void {
    // In case, current cursor refers not to the last one element in the history, we should
    // remove everything after the current cursor.
    if (this.hasNext) {
      this.entries.splice(this.cursor + 1);
    }
    this.setByDelta(1, this.formatEntry(entry));
  }

  /**
   * Replaces current entry.
   * @param entry - entry to replace with.
   */
  replace(entry: BasicNavigatorAnyEntry<Params>): void {
    this.setByDelta(0, this.formatEntry(entry));
  }

  /**
   * Sets entry by specified cursor delta.
   * @param delta - cursor delta.
   * @param entry - entry to set.
   */
  private setByDelta(delta: number, entry: BasicNavigatorEntry<Params>): void {
    const nextCursor = this.cursor + delta;
    const from = this.entry;
    this._cursor = nextCursor;
    this.entries[this.cursor] = entry;
    this.ee.emit('change', {
      navigator: this,
      from,
      to: this.entry,
      delta,
    });
  }
}
