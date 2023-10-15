import { log } from '@tma.js/logger';
import { EventEmitter } from '@tma.js/event-emitter';
import { postEvent, on, off } from '@tma.js/bridge';

import { formatSearch, mergePathnames, toPathname } from './utils.js';
import { drop, go } from './history.js';

import type {
  HistoryCurrentState,
  HistoryEntry,
  NavigatorEventsMap,
  NavigatorOptions,
  Pathname,
} from './types.js';

const CURSOR_VOID = 0;
const CURSOR_BACK = 1;
const CURSOR_FORWARD = 2;

/**
 * Represents a navigator which can be used in Telegram Mini Apps to provide stable routing.
 */
export class Navigator {
  private readonly ee = new EventEmitter<NavigatorEventsMap>();

  private readonly debug: boolean;

  private isAttached = false;

  constructor(
    private history: HistoryEntry[],
    private cursor: number,
    { debug = false }: NavigatorOptions = {},
  ) {
    if (history.length === 0) {
      throw new Error('History should not be empty');
    }

    if (history.length <= cursor) {
      throw new Error('Cursor should be less than or equal to history length');
    }

    this.debug = debug;
  }

  /**
   * Logs a message in case, debug mode is enabled.
   */
  private log(...args: any[]) {
    if (this.debug) {
      log('log', '[Navigator]', ...args);
    }
  }

  /**
   * Creates browser history state associated with the current navigator state.
   */
  private createCurrentState(): HistoryCurrentState {
    return { cursor: this.cursor, history: this.history };
  }

  /**
   * Synchronizes current navigator state with browser history.
   */
  private async syncHistory(): Promise<void> {
    this.log('Synchronizing with browser history');

    // Remove history change event listener to get rid of side effects related to possible
    // future calls of history.go.
    window.removeEventListener('popstate', this.onPopState);

    const hash = `#${this.path}`;
    const currentState = this.createCurrentState();

    // Drop the browser history and work with the clean one.
    await drop();

    // Actualize TMA BackButton state.
    postEvent('web_app_setup_back_button', { is_visible: this.canGoBack() });

    if (this.canGoBack() && this.canGoForward()) {
      // We have both previous and next elements. History should be:
      // [back, *current*, forward]
      this.log('Setting up history: [back, current, forward]');

      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(currentState, '', hash);
      window.history.pushState(CURSOR_FORWARD, '');
      await go(-1);
    } else if (this.canGoBack()) {
      // We have only previous element. History should be:
      // [back, *current*]
      this.log('Setting up history: [back, current]');

      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(currentState, '', hash);
    } else if (this.canGoForward()) {
      // We have only next element. History should be:
      // [*current*, forward]
      this.log('Setting up history: [current, forward]');

      window.history.replaceState(currentState, hash);
      window.history.pushState(CURSOR_FORWARD, '');
      await go(-1);
    } else {
      // We have no back and next elements. History should be:
      // [void, *current*]
      this.log('Setting up history: [void, current]');

      window.history.replaceState(CURSOR_VOID, '');
      window.history.pushState(currentState, '', hash);
    }

    window.addEventListener('popstate', this.onPopState);
  }

  /**
   * Returns true in case, we can move back from the current history element.
   */
  private canGoBack(): boolean {
    return this.cursor > 0;
  }

  /**
   * Returns true in case, we can move forward from the current history element.
   */
  private canGoForward(): boolean {
    return this.cursor !== this.history.length - 1;
  }

  /**
   * Converts externally specified history entry data to the history item.
   * @param entry - entry data
   */
  private entryToHistoryItem(entry: Partial<HistoryEntry> = {}): HistoryEntry {
    const { search = '', pathname = this.pathname } = entry;

    return {
      pathname: pathname.startsWith('/')
        // Full path from the root. Example: /a/b/c
        ? toPathname(pathname)
        // Otherwise, it's the relative path. We should merge it with the current one.
        : mergePathnames(toPathname(pathname), this.pathname),
      search: search || '',
    };
  }

  /**
   * Being called whenever "popstate" event occurs.
   * @param state - event state.
   */
  private onPopState = async ({ state }: PopStateEvent) => {
    this.log('Received state', state);

    // There is only one case when state can be CURSOR_VOID - when history contains
    // only one element. In this case, we should return user to the current history element.
    if (state === CURSOR_VOID) {
      window.history.forward();
      return;
    }

    // User pressed Back button.
    if (state === CURSOR_BACK) {
      return this.setCursor(this.cursor - 1);
    }

    // User pressed Forward button.
    if (state === CURSOR_FORWARD) {
      return this.setCursor(this.cursor + 1);
    }
  };

  /**
   * Sets new cursor and synchronizes current navigator state with browser history.
   * @param value - next cursor value.
   */
  private async setCursor(value: number): Promise<void> {
    const prevCursor = this.cursor;
    this.cursor = value;

    this.log('Setting up cursor', prevCursor, '->', this.cursor);

    // Notify listeners about state change.
    this.ee.emit('change', { pathname: this.pathname, search: this.search });

    // Cursor did not change, but setCursor could be called after calling the replace method, what
    // means, we should actualize current URL.
    if (prevCursor === this.cursor) {
      window.history.replaceState(this.createCurrentState(), '', `#${this.path}`);
      return;
    }

    return this.syncHistory();
  }

  /**
   * Attaches current navigator to the browser history.
   */
  async attach(): Promise<void> {
    if (this.isAttached) {
      return;
    }
    this.isAttached = true;

    this.log('Attaching navigator', this);
    on('back_button_pressed', this.back);
    return this.syncHistory();
  }

  /**
   * Goes back in history.
   */
  back = (): Promise<void> => this.go(-1);

  /**
   * Detaches current navigator from the browser history.
   */
  detach() {
    this.log('Detaching navigator', this);

    // When detaching, we just remove all event listeners.
    this.isAttached = false;
    window.removeEventListener('popstate', this.onPopState);
    off('back_button_pressed', this.back);
  }

  /**
   * Goes forward in history.
   */
  forward(): Promise<void> {
    return this.go(1);
  }

  /**
   * Goes in history by specified delta.
   * @param delta
   */
  async go(delta = 0): Promise<void> {
    // Cursor should be in bounds: [0, this.history.length - 1].
    const cursor = Math.min(
      this.history.length - 1,
      Math.max(this.cursor + delta, 0),
    );

    return cursor === this.cursor ? undefined : this.setCursor(cursor);
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
   * Pushes new entry in history. It removes all history entries after the current one and
   * inserts new one.
   * @param entry - entry data.
   */
  push(entry?: Partial<HistoryEntry>): Promise<void> {
    // In case, current cursor refers not to the last one element in the history, we should
    // remove everything after the cursor.
    if (this.cursor !== this.history.length - 1) {
      this.history = this.history.slice(0, this.cursor + 1);
    }

    this.history.push(this.entryToHistoryItem(entry));
    this.log('Pushed new entry', this.history[this.history.length - 1]);

    return this.setCursor(this.cursor + 1);
  }

  /**
   * Returns current full path including pathname and query parameters.
   */
  get path(): string {
    return `${this.pathname}${formatSearch(this.search)}`;
  }

  /**
   * Returns current pathname.
   */
  get pathname(): Pathname {
    return this.history[this.cursor].pathname;
  }

  /**
   * Replaces current entry.
   * @param entry - entry data.
   */
  replace(entry?: Partial<HistoryEntry>): Promise<void> {
    this.history[this.cursor] = this.entryToHistoryItem(entry);
    this.log('Replace current entry with', this.history[this.cursor]);

    return this.setCursor(this.cursor);
  }

  /**
   * Returns current query parameters.
   */
  get search(): string {
    return this.history[this.cursor].search;
  }
}
