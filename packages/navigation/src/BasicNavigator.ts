import { EventEmitter } from '@tma.js/event-emitter';

import type {
  NavigationEntry,
  NavigatorEventsMap,
  AllowedEntry,
} from './types.js';

/**
 * Represents a navigator which can be used in Telegram Mini Apps providing stable routing.
 */
export class BasicNavigator {
  private readonly ee = new EventEmitter<NavigatorEventsMap>();

  constructor(
    private entries: NavigationEntry[],
    private entriesCursor: number,
  ) {
    if (entries.length === 0) {
      throw new Error('Entries should not be empty');
    }

    if (entriesCursor >= entries.length) {
      throw new Error('Cursor should be less than or equal to entries count');
    }
  }

  /**
   * Converts externally specified entry data to the full entry.
   * @param entry - entry data
   */
  private formatAllowedEntry(entry: AllowedEntry): NavigationEntry {
    let url: URL;
    const absolutePath = `https://localhost${this.path}`;

    if (typeof entry === 'string') {
      url = new URL(entry, absolutePath);
    } else {
      const { pathname = '', search = '' } = entry;
      url = new URL(`${pathname}${search.startsWith('?') ? '' : '?'}${search}`);
    }

    return {
      pathname: url.pathname,
      search: url.search,
    };
  }

  /**
   * Emits "change" event with current navigator data.
   */
  private emitChange() {
    this.ee.emit('change', {
      pathname: this.pathname,
      search: this.search,
    });
  }

  /**
   * Returns current entries cursor.
   */
  get cursor(): number {
    return this.entriesCursor;
  }

  /**
   * Returns true in case, navigator can go back.
   */
  canGoBack(): boolean {
    return this.entriesCursor > 0;
  }

  /**
   * Returns true in case, navigator can go forward.
   */
  canGoForward(): boolean {
    return this.entriesCursor !== this.entries.length - 1;
  }

  /**
   * Moves cursor by specified delta.
   * @param delta - cursor delta.
   * @returns True if changes were done.
   */
  go(delta: number): boolean {
    // Cursor should be in bounds: [0, this.entries).
    const cursor = Math.min(
      this.entries.length - 1,
      Math.max(this.entriesCursor + delta, 0),
    );

    if (this.entriesCursor === cursor) {
      return false;
    }

    this.entriesCursor = cursor;
    this.emitChange();

    return true;
  }

  /**
   * Returns readonly version of current entries.
   */
  getEntries(): readonly Readonly<NavigationEntry>[] {
    return this.entries.map((item) => Object.freeze(item));
  }

  /**
   * Adds new event listener.
   */
  on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off = this.ee.off.bind(this.ee);

  /**
   * Pushes new entry. It removes all entries after the current one and inserts new one.
   * @param entry - entry data.
   *
   * @example Pushing absolute pathname.
   * push("/absolute-path"); // "/absolute-path"
   *
   * @example Pushing relative pathname.
   * // Pushing relative path replaces N last path parts, where N is pushed pathname parts count.
   * // Pushing empty path is recognized as relative, but not replacing the last pathname part.
   * push("relative"); // "/home/root" -> "/home/relative"
   *
   * @example Pushing query parameters.
   * push("/absolute?my-param=1"); // "/home" -> "/absolute?my-param=1"
   * push("relative?my-param=1"); // "/home/root" -> "/home/relative?my-param=1"
   * push("?my-param=1"); // "/home" -> "/home?my-param=1"
   */
  push(entry: AllowedEntry): void {
    // In case, current cursor refers not to the last one element in the history, we should
    // remove everything after the cursor.
    if (this.entriesCursor !== this.entries.length - 1) {
      this.entries = this.entries.slice(0, this.entriesCursor + 1);
    }

    const formatted = this.formatAllowedEntry(entry);
    this.entriesCursor += 1;
    this.entries[this.entriesCursor] = formatted;
    this.emitChange();
  }

  /**
   * Returns current full path including pathname and query parameters.
   */
  get path(): string {
    return `${this.pathname}${this.search}`;
  }

  /**
   * Returns current pathname.
   *
   * @example Always returned value.
   * "/abc"
   */
  get pathname(): string {
    return this.entries[this.entriesCursor].pathname;
  }

  /**
   * Replaces current entry. Has the same logic as "push" method does.
   * @param entry - entry data.
   * @see push
   * @returns True if changes were done.
   */
  replace(entry: AllowedEntry): boolean {
    const item = this.formatAllowedEntry(entry);
    if (this.search === item.search && this.pathname === item.pathname) {
      return false;
    }

    this.entries[this.entriesCursor] = item;
    this.emitChange();

    return true;
  }

  /**
   * Returns current query parameters.
   *
   * @example Empty parameters.
   * ""
   *
   * @example Empty parameters but with question mark.
   * "?"
   *
   * @example Parameters list.
   * "?param=1"
   */
  get search(): string {
    return this.entries[this.entriesCursor].search;
  }
}
