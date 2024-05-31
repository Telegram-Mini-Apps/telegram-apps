import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import { BasicNavigator } from '@/navigation/BasicNavigator/BasicNavigator.js';
import { basicItemToBrowser } from '@/navigation/BrowserNavigator/basicItemToBrowser.js';
import { prepareItem } from '@/navigation/BrowserNavigator/prepareItem.js';
import { createSafeURL } from '@/navigation/createSafeURL.js';
import { drop } from '@/navigation/drop.js';
import { ensurePrefix } from '@/navigation/ensurePrefix.js';
import { getPathname } from '@/navigation/getPathname.js';
import { go } from '@/navigation/go.js';
import { urlToPath } from '@/navigation/urlToPath.js';
import type { BasicNavigatorEvents } from '@/navigation/BasicNavigator/types.js';
import type {
  BrowserNavigatorAnyHistoryItem,
  BrowserNavigatorConOptions,
  BrowserNavigatorEvents,
  BrowserNavigatorHashMode,
  BrowserNavigatorHistoryItem,
  BrowserNavigatorHistoryItemParams,
  URLLike,
} from '@/navigation/BrowserNavigator/types.js';

const CURSOR_VOID = 0;
const CURSOR_BACK = 1;
const CURSOR_FORWARD = 2;

type Navigator<State> = BasicNavigator<BrowserNavigatorHistoryItemParams<State>>;
type Emitter<State> = EventEmitter<BrowserNavigatorEvents<State>>;

export class BrowserNavigator<State = {}> {
  private readonly navigator: Navigator<State>;

  private readonly ee: Emitter<State> = new EventEmitter();

  readonly hashMode: BrowserNavigatorHashMode | null;

  readonly base: string;

  constructor(
    /**
     * Navigation history.
     */
    history: readonly BrowserNavigatorAnyHistoryItem<State>[],
    /**
     * Currently active history item index.
     */
    index: number,
    { postEvent, hashMode = 'classic', base }: BrowserNavigatorConOptions = {},
  ) {
    this.navigator = new BasicNavigator(
      history.map((item) => prepareItem(item, '/')),
      index,
      postEvent,
    );
    this.navigator.on('change', (e) => {
      void this.onNavigatorChange(e);
    });
    this.hashMode = hashMode;
    this.base = getPathname(base || '');
  }

  /**
   * Shows whether the navigator is currently attached to the browser history.
   */
  private attached = false;

  /**
   * Attaches current navigator to the browser history allowing navigator to manipulate it.
   */
  async attach(): Promise<void> {
    if (!this.attached) {
      this.attached = true;
      this.navigator.attach();
      window.addEventListener('popstate', this.onPopState);
      await this.syncHistory();
    }
  }

  /**
   * Goes back in history by 1.
   */
  back(): void {
    this.navigator.back();
  }

  /**
   * Detaches current navigator from the browser history.
   */
  detach() {
    this.attached = false;
    this.navigator.detach();
    window.removeEventListener('popstate', this.onPopState);
  }

  /**
   * Goes forward in history.
   */
  forward(): void {
    return this.navigator.forward();
  }

  /**
   * Current history cursor.
   */
  get index(): number {
    return this.navigator.index;
  }

  /**
   * Current history item identifier.
   */
  get id(): string {
    return this.navigator.current.id;
  }

  /**
   * Changes currently active history item index by the specified delta. This method doesn't
   * change index in case, the updated index points to the non-existing history item. This behavior
   * is preserved until the `fit` argument is specified.
   * @param delta - index delta.
   * @param fit - cuts the delta argument to fit the bounds `[0, history.length - 1]`.
   */
  go(delta: number, fit?: boolean): void {
    return this.navigator.go(delta, fit);
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
    this.navigator.goTo(index, fit);
  }

  /**
   * Current history item hash.
   * @see URL.hash
   * @example
   * "", "#my-hash"
   */
  get hash(): string {
    return (this.navigator.current.params || {}).hash || '';
  }

  /**
   * True if navigator has items before the current item.
   */
  get hasPrev(): boolean {
    return this.navigator.hasPrev;
  }

  /**
   * True if navigator has items after the current item.
   */
  get hasNext(): boolean {
    return this.navigator.hasNext;
  }

  /**
   * Navigation history.
   */
  get history(): BrowserNavigatorHistoryItem<State>[] {
    return this.navigator.history.map(basicItemToBrowser);
  }

  /**
   * Handles the window "popstate" event.
   * @param state - event state.
   */
  private onPopState = ({ state }: PopStateEvent) => {
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
    } else if (state === CURSOR_BACK) {
      this.back();
    }
    if (state === CURSOR_FORWARD) {
      this.forward();
    }
  };

  /**
   * Underlying navigator change event listener.
   */
  private onNavigatorChange = async ({
    to,
    from,
    delta,
  }: BasicNavigatorEvents<BrowserNavigatorHistoryItemParams<State>>['change']) => {
    // If this navigator is attached to the browser history, we should synchronize.
    if (this.attached) {
      await this.syncHistory();
    }
    this.ee.emit('change', {
      delta,
      from: basicItemToBrowser(from),
      to: basicItemToBrowser(to),
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
   * Current pathname. Always starts with the slash.
   * @see URL.pathname
   * @example
   * "/", "/abc"
   */
  get pathname(): string {
    return this.navigator.current.pathname;
  }

  /**
   * Depending on the current navigation type, parses incoming path and returns it presented as
   * an object. In other words, this method parses the passed path and returns object, describing
   * how the navigator "sees" it.
   *
   * @example Hash mode is omitted.
   * parsePath('/abc?a=1#hash');
   * // { pathname: '/abc', search: '?a=1', hash: '#hash' }
   * parsePath('http://example.com/abc?a=1#hash');
   * // { pathname: '/abc', search: '?a=1', hash: '#hash' }
   *
   * @example Hash mode is enabled.
   * parsePath('/abc?a=1#tma?is=cool#yeah');
   * // { pathname: '/tma', search: '?is=cool', hash: '#yeah' }
   * parsePath('http://example.com/abc?a=1#tma?is=cool#yeah');
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
   * Pushes new history item. Method replaces all entries after the current one with the one
   * being pushed. Take a note, that passed item is always relative. In case, you want to use
   * it as an absolute one, use the "/" prefix. Example: "/absolute", { pathname: "/absolute" }.
   *
   * To create a final path, navigator uses a method, used in the URL class constructor, resolving
   * a path based on the current one.
   * @param path - entry path.
   * @param state - entry state.
   *
   * @example Pushing an absolute path.
   * push("/absolute"); // "/absolute"
   *
   * @example Pushing a relative path.
   * push("relative"); // "/home/root" -> "/home/relative"
   *
   * @example Pushing query parameters.
   * push("/absolute?my-param=1"); // "/home/root" -> "/absolute?my-param=1"
   * push("relative?my-param=1"); // "/home/root" -> "/home/relative?my-param=1"
   * push("?my-param=1"); // "/home" -> "/home?my-param=1"
   *
   * @example Pushing hash.
   * push("#my-hash"); // "/home" -> "/home#my-hash"
   * push("relative#my-hash"); // "/home/root" -> "/home/relative#my-hash"
   *
   * @example Pushing state.
   * push("", { state: 'my-state' }); "/home/root" -> "/home/root"
   * push({ state: 'my-state' }); "/home/root" -> "/home/root"
   */
  push(path: string, state?: State): void;
  push(item: BrowserNavigatorAnyHistoryItem<State>): void;
  push(itemOrPath: string | BrowserNavigatorAnyHistoryItem<State>, fnState?: State): void {
    const item = prepareItem(itemOrPath, this.path);
    const { state = fnState } = item.params;
    this.navigator.push({ ...item, params: { ...item.params, state } });
  }

  /**
   * Replaces the current history item. Has the same logic as the `push` method.
   * @param path - entry path.
   * @param state - entry state.
   * @see push
   */
  replace(path: string, state?: State): void;
  replace(item: BrowserNavigatorAnyHistoryItem<State>): void;
  replace(itemOrPath: string | BrowserNavigatorAnyHistoryItem<State>, fnState?: State): void {
    const item = prepareItem(itemOrPath, this.path);
    const { state = fnState } = item.params;
    this.navigator.replace({ ...item, params: { ...item.params, state } });
  }

  /**
   * Combines the navigator `base` property with the passed path data applying the navigator
   * navigation mode.
   * @param value - path presented as string or URLLike.
   */
  renderPath(value: string | URLLike): string {
    const path = (this.base.length === 1 ? '' : this.base)
      + ensurePrefix(urlToPath(value), '/');

    return this.hashMode
      ? ensurePrefix(path.slice(1), this.hashMode === 'classic' ? '#' : '#/')
      : path;
  }

  /**
   * Synchronizes current navigator state with browser history.
   */
  private async syncHistory(): Promise<void> {
    // Remove history change event listener to get rid of side effects related to the possible
    // future calls of history.go.
    window.removeEventListener('popstate', this.onPopState);

    const { state } = this;
    const path = this.renderPath(this);

    // Drop the browser history and work with the clean one.
    await drop();

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
    return (this.navigator.current.params || {}).search || '';
  }

  /**
   * Current history item state.
   */
  get state(): State | undefined {
    return (this.navigator.current.params || {}).state;
  }
}
