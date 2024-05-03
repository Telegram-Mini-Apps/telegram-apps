import { off } from '@/bridge/events/listening/off.js';
import { on } from '@/bridge/events/listening/on.js';
import { postEvent } from '@/bridge/methods/postEvent.js';
import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import { BasicNavigator } from '@/navigation/BasicNavigator/BasicNavigator.js';
import {
  basicNavigatorHistoryItemToBrowser,
} from '@/navigation/BrowserNavigator/utils/basicNavigatorHistoryItemToBrowser.js';
import { createSafeURL } from '@/navigation/utils/createSafeURL.js';
import { drop } from '@/navigation/utils/drop.js';
import { ensurePrefix } from '@/navigation/utils/ensurePrefix.js';
import { go } from '@/navigation/utils/go.js';
import { urlToPath } from '@/navigation/utils/urlToPath.js';
import type { BasicNavigatorEvents } from '@/navigation/BasicNavigator/types.js';
import type {
  BrowserNavigatorAnyHistoryItem,
  BrowserNavigatorEvents,
  BrowserNavigatorFormatHistoryItemResult,
  BrowserNavigatorHashMode,
  BrowserNavigatorHistoryItem,
  BrowserNavigatorHistoryItemParams, URLLike,
} from '@/navigation/BrowserNavigator/types.js';

const CURSOR_VOID = 0;
const CURSOR_BACK = 1;
const CURSOR_FORWARD = 2;

type Navigator<State> = BasicNavigator<BrowserNavigatorHistoryItemParams<State>>;
type Emitter<State> = EventEmitter<BrowserNavigatorEvents<State>>;

export class BrowserNavigator<State = {}> {
  private readonly navigator: Navigator<State>;

  private readonly ee: Emitter<State> = new EventEmitter();

  constructor(
    /**
     * Navigation entries.
     */
    history: readonly BrowserNavigatorAnyHistoryItem<State>[],
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
      history.map((item) => this.formatHistoryItem(item)),
      cursor,
    );
    this.navigator.on('change', this.onNavigatorChange);
  }

  /**
   * Shows whether navigator is currently attached to the browser history.
   */
  private attached = false;

  /**
   * Attaches current navigator to the browser history allowing navigator to manipulate it.
   */
  async attach(): Promise<void> {
    if (!this.attached) {
      this.attached = true;
      on('back_button_pressed', this.back);
      await this.syncHistory();
    }
  }

  /**
   * Goes back in history by 1.
   */
  back = (): void => this.go(-1);

  /**
   * Current history cursor.
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
   * Goes forward in history.
   */
  forward(): void {
    return this.navigator.forward();
  }

  /**
   * Converts path, presented as a string to a basic navigator appropriate form.
   * @param path - full path.
   * @param state - history item state.
   */
  private formatHistoryItem(
    path: string,
    state?: State,
  ): BrowserNavigatorFormatHistoryItemResult<State>;

  /**
   * Converts path, presented as an object to a basic navigator appropriate form.
   * @param historyItem - history item data.
   */
  private formatHistoryItem(
    historyItem: BrowserNavigatorAnyHistoryItem<State>,
  ): BrowserNavigatorFormatHistoryItemResult<State>;

  private formatHistoryItem(
    historyItemOrPath: string | BrowserNavigatorAnyHistoryItem<State>,
    state?: State,
  ): BrowserNavigatorFormatHistoryItemResult<State> {
    let path: string;
    let id: string | undefined;

    if (typeof historyItemOrPath === 'string') {
      path = historyItemOrPath;
    } else {
      path = urlToPath(historyItemOrPath);
      state = historyItemOrPath.state;
      id = historyItemOrPath.id;
    }

    const { pathname, search, hash } = new URL(
      path,
      // If we have currently an active history item, we should build a new one based on it. We may
      // not have a navigator in case, current function is being called in the constructor.
      `http://a${this.navigator ? this.path : ''}`,
    );
    return { id, pathname, params: { hash, search, state } };
  }

  /**
   * Moves cursor by specified delta.
   * @param delta - cursor delta.
   * @param performCut - true, if method should be performed with allowed cut value in case, delta
   * is out of bounds. By default, method will not be performed if delta is out of bounds.
   */
  go(delta: number, performCut?: boolean): void {
    return this.navigator.go(delta, performCut);
  }

  /**
   * Current navigation entry hash.
   * @see URL.hash
   * @example
   * "", "#my-hash"
   */
  get hash(): string {
    return this.historyItem.hash || '';
  }

  /**
   * Currently active history item.
   */
  private get historyItem(): BrowserNavigatorHistoryItem<State> {
    return basicNavigatorHistoryItemToBrowser(this.navigator.historyItem);
  }

  /**
   * Navigation history.
   */
  get history(): BrowserNavigatorHistoryItem<State>[] {
    return this.navigator.history.map(basicNavigatorHistoryItemToBrowser);
  }

  /**
   * True if navigator has items before the current cursor.
   */
  get hasPrev(): boolean {
    return this.navigator.hasPrev;
  }

  /**
   * True if navigator has items after the current cursor.
   */
  get hasNext(): boolean {
    return this.navigator.hasNext;
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
      return this.push(this.parsePath(window.location.href));
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
  private onNavigatorChange = async ({
    navigator,
    to,
    from,
    ...rest
  }: BasicNavigatorEvents<BrowserNavigatorHistoryItemParams<State>>['change']) => {
    // If this navigator is attached to the browser history, we should synchronize.
    if (this.attached) {
      await this.syncHistory();
    }
    this.ee.emit('change', {
      ...rest,
      from: basicNavigatorHistoryItemToBrowser(from),
      to: basicNavigatorHistoryItemToBrowser(to),
      navigator: this,
    });
  };

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
    return urlToPath(this);
  }

  /**
   * Current pathname. Always starts with slash.
   * @see URL.pathname
   * @example
   * "/", "/abc"
   */
  get pathname(): string {
    return this.historyItem.pathname;
  }

  /**
   * Depending on the current navigation type, parses incoming path and returns it presented as
   * an object.
   *
   * @example Hash mode is omitted.
   * parsePath('/abc?a=1#hash');
   * // { pathname: '/abc', search: '?a=1', hash: '#hash' }
   *
   * @example Hash mode is enabled
   * parsePath('/abc?a=1#tma?is=cool#yeah');
   * // { pathname: '/tma', search: '?is=cool', hash: '#yeah' }
   */
  parsePath(path: string | URL): URLLike {
    let url = createSafeURL(path);
    if (this.hashMode) {
      url = createSafeURL(url.hash.slice(1));
    }

    return {
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    };
  }

  /**
   * Pushes new navigation entry. Method replaces all entries after the current one with the
   * inserted. Take a note, that passed pathname is always relative. In case, you want to use
   * it as an absolute one, use "/" prefix. Example: "/absolute".
   *
   * To create a final path, navigator uses a method, used in the URL class constructor, resolving
   * a path based on the current one.
   * @param path - entry path.
   * @param state - entry state.
   *
   * @example Pushing absolute pathname.
   * push("/absolute-path"); // "/absolute-path"
   *
   * @example Pushing relative pathname.
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
   *
   * @example Pushing with state.
   * push("", { state: 'my-state' }); "/home/root" -> "/home/root"
   */
  push(path: string, state?: State): void;
  push(historyItem: BrowserNavigatorAnyHistoryItem<State>): void;
  push(historyItemOrPath: string | BrowserNavigatorAnyHistoryItem<State>, state?: State): void {
    this.navigator.push(this.formatHistoryItem(historyItemOrPath as string, state));
  }

  /**
   * Replaces current entry. Has the same logic as `push` method.
   * @param entry - entry data.
   * @see push
   */
  replace(entry: BrowserNavigatorAnyHistoryItem<State>): void {
    this.navigator.replace(this.formatHistoryItem(entry));
  }

  /**
   * Renders specified path as one, expected by the current navigator.
   * @param value - path presented as string or URLLike.
   */
  renderPath(value: string | URLLike): string {
    const path = ensurePrefix(urlToPath(value), '/');
    return this.hashMode
      ? ensurePrefix(path.slice(1), this.hashMode === 'default' ? '#' : '#/')
      : path;
  }

  /**
   * Synchronizes current navigator state with browser history.
   */
  private async syncHistory(): Promise<void> {
    // Remove history change event listener to get rid of side effects related to the possible
    // future calls of history.go.
    window.removeEventListener('popstate', this.onPopState);

    const { historyItem } = this;
    const { state } = historyItem;
    const path = this.renderPath(historyItem);

    // Drop the browser history and work with the clean one.
    await drop();

    // Actualize Telegram Mini Apps BackButton state.
    postEvent('web_app_setup_back_button', { is_visible: this.hasPrev });

    if (this.hasPrev && this.hasNext) {
      // We have both previous and next elements. History should be:
      // [back, *current*, forward]
      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(state, '', path);
      window.history.pushState(CURSOR_FORWARD, '');

      await go(-1);
    } else if (this.hasPrev) {
      // We have only previous element. History should be:
      // [back, *current*]
      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(state, '', path);
    } else if (this.hasNext) {
      // We have only next element. History should be:
      // [*current*, forward]
      window.history.replaceState(state, path);
      window.history.pushState(CURSOR_FORWARD, '');

      await go(-1);
    } else {
      // We have no back and next elements. History should be:
      // [void, *current*]
      window.history.replaceState(CURSOR_VOID, '');
      window.history.pushState(state, '', path);
    }

    window.addEventListener('popstate', this.onPopState);
  }

  /**
   * Current query parameters.
   * @see URL.search
   * @example
   * "", "?", "?a=1"
   */
  get search(): string {
    return this.historyItem.search || '';
  }
}
