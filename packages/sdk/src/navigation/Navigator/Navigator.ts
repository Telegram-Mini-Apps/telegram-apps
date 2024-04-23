import { Logger } from '../../logger/Logger.js';
import { ensurePrefix } from '../ensurePrefix.js';
import type {
  AnyEntry,
  NavigationEntry,
  NavigatorConEntry,
  NavigatorOptions,
  PerformGoOptions,
  PerformPushOptions,
  PerformReplaceOptions,
} from './types.js';

/**
 * Represents basic navigator implementation which uses only memory to store and control
 * navigation state.
 */
export abstract class Navigator<T> {
  protected logger: Logger;

  protected readonly entries: NavigationEntry[];

  constructor(
    entries: NavigatorConEntry[],
    protected entriesCursor: number,
    {
      debug = false,
      loggerPrefix = 'Navigator',
    }: NavigatorOptions,
  ) {
    if (entries.length === 0) {
      throw new Error('Entries list should not be empty.');
    }

    if (entriesCursor >= entries.length) {
      throw new Error('Cursor should be less than entries count.');
    }

    this.entries = entries.map(({ pathname = '', search, hash }) => {
      if (!pathname.startsWith('/') && pathname.length > 0) {
        throw new Error('Pathname should start with "/"');
      }

      return {
        pathname: ensurePrefix(pathname, '/'),
        search: search ? ensurePrefix(search, '?') : '',
        hash: hash ? ensurePrefix(hash, '#') : '',
      };
    });
    this.logger = new Logger({ text: loggerPrefix }, debug);
  }

  protected abstract performGo(options: PerformGoOptions): T;

  protected abstract performPush(options: PerformPushOptions): T;

  protected abstract performReplace(options: PerformReplaceOptions): T;

  /**
   * Converts entry to the navigation entry.
   * @param entry - entry data
   */
  private formatEntry(entry: AnyEntry): NavigationEntry {
    let path: string;

    if (typeof entry === 'string') {
      path = entry;
    } else {
      const {
        pathname = '',
        search,
        hash,
      } = entry;

      path = pathname
        + (search ? ensurePrefix(search, '?') : '')
        + (hash ? ensurePrefix(hash, '#') : '');
    }

    const {
      pathname,
      search,
      hash,
    } = new URL(path, `https://localhost${this.path}`);
    return {
      pathname,
      search,
      hash,
    };
  }

  /**
   * Current entry.
   */
  protected get entry(): NavigationEntry {
    return this.entries[this.entriesCursor];
  }

  /**
   * Goes back in history.
   */
  back(): T {
    return this.go(-1);
  }

  /**
   * Current entries cursor.
   */
  get cursor(): number {
    return this.entriesCursor;
  }

  /**
   * True if navigator can go back.
   */
  get canGoBack(): boolean {
    return this.entriesCursor > 0;
  }

  /**
   * True if navigator can go forward.
   */
  get canGoForward(): boolean {
    return this.entriesCursor !== this.entries.length - 1;
  }

  /**
   * Goes forward in history.
   */
  forward(): T {
    return this.go(1);
  }

  /**
   * Moves entries cursor by specified delta.
   * @param delta - cursor delta.
   */
  go(delta: number): T {
    this.logger.log(`called go(${delta})`);

    // Cursor should be in bounds: [0, this.entries).
    const cursor = Math.min(
      this.entries.length - 1,
      Math.max(this.entriesCursor + delta, 0),
    );

    if (this.entriesCursor === cursor) {
      return this.performGo({
        updated: false,
        delta,
      });
    }

    const before = this.entry;
    this.entriesCursor = cursor;
    const after = this.entry;

    this.logger.log('State changed', { before, after });

    return this.performGo({
      updated: true,
      delta,
      before,
      after,
    });
  }

  /**
   * Returns copy of navigator entries.
   */
  getEntries(): NavigationEntry[] {
    return this.entries.map((entry) => ({ ...entry }));
  }

  /**
   * Current hash.
   * @example
   * "", "#", "#hash"
   */
  get hash(): string {
    return this.entry.hash;
  }

  /**
   * Pushes new entry. Method replaces all entries after the current one with the inserted.
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
   *
   * @example Pushing hash.
   * push("#my-hash"); // "/home" -> "/home#my-hash"
   * push("johny#my-hash"); // "/home/root" -> "/home/johny#my-hash"
   */
  push(entry: AnyEntry): T {
    // In case, current cursor refers not to the last one element in the history, we should
    // remove everything after the cursor.
    if (this.entriesCursor !== this.entries.length - 1) {
      this.entries.splice(this.entriesCursor + 1);
    }

    const formatted = this.formatEntry(entry);
    const before = this.entry;
    this.entriesCursor += 1;
    this.entries[this.entriesCursor] = formatted;
    const after = this.entry;

    this.logger.log('State changed', { before, after });

    return this.performPush({
      before,
      after,
    });
  }

  /**
   * Current full path including pathname, query parameters and hash.
   */
  get path(): string {
    return `${this.pathname}${this.search}${this.hash}`;
  }

  /**
   * Current pathname.
   * @example
   * "/", "/abc"
   */
  get pathname(): string {
    return this.entry.pathname;
  }

  /**
   * Replaces current entry. Has the same logic as `push` method.
   * @param entry - entry data.
   * @see push
   * @returns True if changes were done.
   */
  replace(entry: AnyEntry): T {
    const formattedEntry = this.formatEntry(entry);
    if (
      this.search === formattedEntry.search
      && this.pathname === formattedEntry.pathname
      && this.hash === formattedEntry.hash
    ) {
      return this.performReplace({
        updated: false,
        entry: formattedEntry,
      });
    }

    const before = this.entry;
    this.entries[this.entriesCursor] = formattedEntry;
    const after = this.entry;

    this.logger.log('State changed', { before, after });

    return this.performReplace({
      updated: true,
      before,
      after,
    });
  }

  /**
   * Current query parameters.
   * @example
   * "", "?", "?a=1"
   */
  get search(): string {
    return this.entry.search;
  }
}
