import { off } from '@/bridge/events/listening/off.js';
import { on } from '@/bridge/events/listening/on.js';
import { postEvent } from '@/bridge/methods/postEvent.js';
import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';

import { ensurePrefix } from '../../utils/ensurePrefix.js';
import { BasicNavigator } from '../BasicNavigator/BasicNavigator.js';
import { drop } from './utils/drop.js';
import { go } from './utils/go.js';
import type { BasicNavigatorConEntry, BasicNavigatorEvents } from '../BasicNavigator/types.js';
import type {
  BrowserNavigatorAnyEntry,
  BrowserNavigatorConEntry,
  BrowserNavigatorEntry,
  BrowserNavigatorEntryParams,
  BrowserNavigatorEvents,
  BrowserNavigatorHashMode,
} from './types.js';

const CURSOR_VOID = 0;
const CURSOR_BACK = 1;
const CURSOR_FORWARD = 2;

type Navigator<State> = BasicNavigator<BrowserNavigatorEntryParams<State>>;
type Emitter<State> = EventEmitter<BrowserNavigatorEvents<State>>;

export class BrowserNavigator<State = {}> {
  private readonly navigator: Navigator<State>;

  private readonly ee: Emitter<State> = new EventEmitter();

  constructor(
    /**
     * Navigation entries.
     */
    entries: readonly BrowserNavigatorConEntry<State>[],
    /**
     * Currently active navigation entry.
     */
    cursor: number,
    /**
     * Hash navigation mode. Omit, if non-hash mode is required.
     */
    private readonly hashMode?: BrowserNavigatorHashMode,
  ) {
    this.navigator = new BasicNavigator(
      entries.map((entry) => this.formatEntry(entry, true)),
      cursor,
    );
  }

  /**
   * True, if navigator is currently attached to the browser history.
   */
  private attached = false;

  /**
   * Currently active navigation entry.
   */
  private get entry(): BrowserNavigatorEntry<State> {
    const { params, ...rest } = this.navigator.entry;
    return { ...(params || {}), ...rest };
  }

  /**
   * Converts any browser navigation entry to the generic one.
   * @param entry - any browser navigation entry.
   * @param isAbsolute - is this entry absolute.
   */
  private formatEntry(
    entry: BrowserNavigatorAnyEntry<State>,
    isAbsolute?: boolean,
  ): BasicNavigatorConEntry<BrowserNavigatorEntryParams<State>> {
    let base = 'http://a';
    let path: string;
    let state: State | undefined;
    let id: string | undefined;

    if (typeof entry === 'string') {
      path = entry;
    } else {
      path = (entry.pathname || '')
        + ensurePrefix(entry.search || '', '?')
        + ensurePrefix(entry.hash || '', '#');
      state = entry.state;
      id = entry.id;
    }

    if (isAbsolute) {
      path = ensurePrefix(path, '/');
    } else {
      base += this.path;
    }

    const { pathname, search, hash } = new URL(path, base);
    return {
      id,
      pathname,
      params: { hash, search, state },
    };
  }

  /**
   * Handles window "popstate" event.
   * @param state - event state.
   */
  private onPopState = async ({ state }: PopStateEvent) => {
    // In case state is null, we recognize current event as occurring whenever user clicks
    // any anchor.
    // TODO: Should we do it?
    if (state === null) {
      return this.push(this.hashMode ? window.location.hash.slice(1) : window.location.href);
    }

    // There is only one case when state can be CURSOR_VOID - when history contains
    // only one element. In this case, we should return user to the current history element.
    if (state === CURSOR_VOID) {
      window.history.forward();
      return;
    }

    // User pressed Back button.
    if (state === CURSOR_BACK) {
      return this.back();
    }

    // User pressed Forward button.
    if (state === CURSOR_FORWARD) {
      return this.forward();
    }
  };

  /**
   * Underlying navigator change event listener.
   */
  private onNavigatorChange = async (
    {
      navigator,
      ...rest
    }: BasicNavigatorEvents<BrowserNavigatorEntryParams<State>>['change'],
  ) => {
    await this.syncHistory();
    this.ee.emit('change', { ...rest, navigator: this });
  };

  /**
   * Synchronizes current navigator state with browser history.
   */
  private async syncHistory(): Promise<void> {
    // Remove history change event listener to get rid of side effects related to the possible
    // future calls of history.go.
    window.removeEventListener('popstate', this.onPopState);

    const {
      path,
      hashMode,
      entry: { state },
    } = this;
    const finalPath = hashMode
      ? `#${hashMode === 'slash' ? path : path.slice(1)}`
      : path;

    // Drop the browser history and work with the clean one.
    await drop();

    // Actualize Telegram Mini Apps BackButton state.
    postEvent('web_app_setup_back_button', { is_visible: this.hasPrev });

    if (this.hasPrev && this.hasNext) {
      // We have both previous and next elements. History should be:
      // [back, *current*, forward]
      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(state, '', finalPath);
      window.history.pushState(CURSOR_FORWARD, '');

      await go(-1);
    } else if (this.hasPrev) {
      // We have only previous element. History should be:
      // [back, *current*]
      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(state, '', finalPath);
    } else if (this.hasNext) {
      // We have only next element. History should be:
      // [*current*, forward]
      window.history.replaceState(state, finalPath);
      window.history.pushState(CURSOR_FORWARD, '');

      await go(-1);
    } else {
      // We have no back and next elements. History should be:
      // [void, *current*]
      window.history.replaceState(CURSOR_VOID, '');
      window.history.pushState(state, '', finalPath);
    }

    window.addEventListener('popstate', this.onPopState);
  }

  /**
   * Attaches current navigator to the browser history allowing navigator to manipulate it.
   */
  async attach(): Promise<void> {
    if (!this.attached) {
      this.attached = true;
      on('back_button_pressed', this.back);
      this.navigator.on('change', this.onNavigatorChange);
      await this.syncHistory();
    }
  }

  /**
   * Goes back in history.
   */
  back = (): void => {
    return this.navigator.back();
  };

  /**
   * Current navigation entries cursor.
   */
  get cursor(): number {
    return this.navigator.cursor;
  }

  /**
   * Detaches current navigator from the browser history.
   */
  detach() {
    if (this.attached) {
      this.attached = false;
      window.removeEventListener('popstate', this.onPopState);
      off('back_button_pressed', this.back);
      this.navigator.off('change', this.onNavigatorChange);
    }
  }

  /**
   * True if navigator has navigation entries before the current cursor.
   */
  get hasPrev(): boolean {
    return this.navigator.hasPrev;
  }

  /**
   * True if navigator has navigation entries after the current cursor.
   */
  get hasNext(): boolean {
    return this.navigator.hasNext;
  }

  /**
   * Goes forward in history.
   */
  forward(): void {
    return this.navigator.forward();
  }

  /**
   * Moves entries cursor by specified delta.
   * @param delta - cursor delta.
   */
  go(delta: number): void {
    return this.navigator.go(delta);
  }

  /**
   * Current navigation entry hash.
   * @example
   * "", "#my-hash"
   */
  get hash(): string {
    return this.entry.hash || '';
  }

  /**
   * Adds new event listener.
   */
  on: Emitter<State>['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: Emitter<State>['off'] = this.ee.off.bind(this.ee);

  /**
   * Path, including pathname, search and hash.
   * @example Pathname only.
   * "/pathname"
   * @example Pathname + search.
   * "/pathname?search"
   * @example Pathname + hash.
   * "/pathname#hash"
   * @example Pathname + search + hash.
   * "/pathname?search#hash"
   */
  get path(): string {
    return `${this.pathname}${this.search}${this.hash}`;
  }

  /**
   * Current pathname. Always starts with slash.
   * @example
   * "/", "/abc"
   */
  get pathname(): string {
    return this.entry.pathname;
  }

  /**
   * Pushes new navigation entry. Method replaces all entries after the current one with the
   * inserted.
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
  push(entry: BrowserNavigatorAnyEntry<State>): void {
    this.navigator.push(this.formatEntry(entry));
  }

  /**
   * Replaces current entry. Has the same logic as `push` method.
   * @param entry - entry data.
   * @see push
   */
  replace(entry: BrowserNavigatorAnyEntry<State>): void {
    this.navigator.replace(this.formatEntry(entry));
  }

  /**
   * Current query parameters.
   * @example
   * "", "?", "?a=1"
   */
  get search(): string {
    return this.entry.search || '';
  }
}
