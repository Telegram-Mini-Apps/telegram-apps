import type { PostEvent } from '@telegram-apps/bridge';
import type { Computed } from '@telegram-apps/signals';

export interface HistoryItem<State> {
  id: string;
  pathname: string;
  hash: string;
  search: string;
  state?: State;
}

export type AnyHistoryItem<State> = string | {
  id?: string;
  pathname: string;
  hash?: string;
  search?: string;
  state?: State;
}

/**
 * Minimal set of URL properties we are working with in this library.
 */
export interface URLLike {
  /**
   * @see URL.pathname
   */
  pathname: string;
  /**
   * @see URL.hash
   */
  hash: string;
  /**
   * @see URL.search
   */
  search: string;
}

export interface Navigator<State> {
  /**
   * Allows this navigator to control the back button visibility state and browser history.
   * It also tracks the back button clicks and calls the corresponding callback.
   *
   * Updates the `attached` and `attaching` signals.
   * @see attached
   * @see attaching
   */
  attach(): void;
  /**
   * True if the current navigator is currently attached.
   */
  readonly attached: Computed<boolean>;
  /**
   * True if the current navigator is currently attaching.
   */
  readonly attaching: Computed<boolean>;
  /**
   * Goes to the previous history item. Alias for `go(-1)`.
   * @see go
   */
  back(): void;
  /**
   * Currently active navigation history item index.
   */
  readonly cursor: Computed<number>;
  /**
   * Detaches the navigator.
   * @see attach
   */
  detach(): void;
  /**
   * Goes to the next history item. Alias for `go(1)`.
   * @see go
   */
  forward(): void;
  /**
   * Changes the currently active history item cursor by the specified delta.
   *
   * This method doesn't change the cursor in case the updated cursor points to the non-existing
   * history item. This behavior is preserved until the `fit` argument is specified.
   *
   * There will also be no changes if delta argument is equal to zero.
   * @param delta - cursor delta.
   * @param fit - cuts the delta argument to fit the bounds `[0, history.length - 1]`.
   * @see history
   */
  go(delta: number, fit?: boolean): void;
  /**
   * Goes to the specified index. Method does nothing in case, passed index is out of bounds.
   *
   * If "fit" option was specified and index is out of bounds, it will be cut to the nearest
   * bound.
   *
   * It uses the `go` method with the target cursor.
   * @param index - target index.
   * @param fit - cuts the index argument to fit the bounds `[0, history.length - 1]`.
   * @see go
   */
  goTo(index: number, fit?: boolean): void;
  /**
   * True if the navigator has items after the currently active one.
   */
  readonly hasNext: Computed<boolean>;
  /**
   * True if the navigator has items before the currently active one.
   */
  readonly hasPrev: Computed<boolean>;
  /**
   * Navigation history.
   */
  readonly history: Computed<Readonly<HistoryItem<State>[]>>;
  /**
   * Currently active navigator location.
   */
  readonly location: Computed<Readonly<HistoryItem<State>>>;
  /**
   * Depending on the current navigation type, parses the incoming path and returns it presented as
   * an object. In other words, this method parses the passed path and returns an object, describing
   * how the navigator "sees" it.
   *
   * @example
   * parsePath('http://example.com/abc?a=1#telegram-mini-apps?is=cool#yeah');
   * // { pathname: '/telegram-mini-apps', search: '?is=cool', hash: '#yeah' }
   */
  parsePath(path: string | Partial<URLLike>): URLLike;
  /**
   * Pushes a new history item. The method replaces all entries after the current one with the one
   * being pushed. Take note that passed item is always relative. In case, you want to use
   * it as an absolute one, use the "/" prefix. Examples: "/absolute", { pathname: "/absolute" }.
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
   */
  push(path: string, state?: State): void;
  /**
   * Pushes a new history item. The method replaces all entries after the current one with the one
   * being pushed. Take note that passed item is always relative. In case, you want to use
   * it as an absolute one, use the "/" prefix. Examples: "/absolute", { pathname: "/absolute" }.
   *
   * To create a final path, navigator uses a method, used in the URL class constructor, resolving
   * a path based on the current one.
   * @param item - entry information.
   *
   * @example Pushing an absolute path.
   * push({ pathname "/absolute" }); // "/absolute"
   *
   * @example Pushing a relative path.
   * push({pathname: "relative" }); // "/home/root" -> "/home/relative"
   *
   * @example Pushing query parameters.
   * push({ pathname: "/absolute", search: "?my-param=1" }); // "/home/root" -> "/absolute?my-param=1"
   * push({ pathname: "relative", search: "?my-param=1" });; // "/home/root" -> "/home/relative?my-param=1"
   * push({ search: "?my-param=1" }); // "/home" -> "/home?my-param=1"
   *
   * @example Pushing hash.
   * push({ hash: "#my-hash" }); // "/home" -> "/home#my-hash"
   * push({ pathname: "relative", hash: "#my-hash"); // "/home/root" -> "/home/relative#my-hash"
   *
   * @example Pushing state.
   * push({ state: 'my-state' }); "/home/root" -> "/home/root"
   */
  push(item: AnyHistoryItem<State>): void;
  /**
   * Combines the navigator `base` property with the passed path data applying the navigator
   * navigation mode.
   * @param value - path presented as string or URLLike.
   * @example base is "slash"
   * renderPath('/my-path?q=1#hash') // "#/my-path?q=1#hash"
   * renderPath({ pathname: '/my-path', search: '?q=1', hash: '#hash' }) // "#/my-path?q=1#hash"
   *
   * @example base is "no-slash"
   * renderPath('/my-path?q=1#hash') // "#my-path?q=1#hash"
   * renderPath({ pathname: '/my-path', search: '?q=1', hash: '#hash' }) // "#my-path?q=1#hash"
   */
  renderPath(value: string | Partial<URLLike>): string;
  /**
   * Replaces the current history item with the passed one. Has the same logic as the `push` method.
   * @param path - entry path.
   * @param state - entry state.
   * @see push
   */
  replace(path: string, state?: State): void;
  /**
   * Replaces the current history item with the passed one. Has the same logic as the `push` method.
   * @param item - entry information.
   * @see push
   */
  replace(item: AnyHistoryItem<State>): void;
  /**
   * True if the navigator is currently synchronizing its state with the browser history.
   */
  readonly syncing: Computed<boolean>;
}

/**
 * Hash navigation mode.
 * @example 'classic'
 * '#pathname?search'
 * @example 'slash'
 * '#/pathname?search'
 */
export type HashMode = 'no-slash' | 'slash';

export interface BackButtonOptions {
  /**
   * Custom behavior on the back button press.
   *
   * Note that this method will only be called in case the navigator was attached via
   * the `attach()` method.
   * @default The navigator's `back()` method will be called.
   */
  onPressed?(this: void): void;
  /**
   * Function to update the back button visibility state.
   * @default The bridge `postEvent` function will be called.
   */
  setVisibility?(this: void, visible: boolean): void;
  /**
   * Function which will be called, whenever the navigator wants to start tracking
   * the back button clicks.
   * @param fn - the back button click callback.
   * @default The bridge `on` function will be used.
   */
  trackPress?(this: void, fn: () => void): void;
  /**
   * Function which will be called, whenever the navigator wants to stop tracking
   * the back button clicks.
   * @param fn - the back button click callback.
   * @default The bridge `off` function will be used.
   */
  untrackPress?(this: void, fn: () => void): void;
}

export type NavigationType = 'go' | 'push' | 'replace';

export interface CtrOptions<State> {
  /**
   * Options related to the back button.
   *
   * Using these options, a developer could disable some predefined behavior related to the back
   * button.
   */
  bb?: Partial<BackButtonOptions>;
  /**
   * fixme
   */
  dev?: boolean;
  /**
   * Hash navigation mode. The hash navigation mode only affects how rendered URLs will look like.
   *
   * @example `no-slash`
   * #pathname?query#hash
   * @example `slash`
   * #pathname?query#hash
   * @default 'slash'
   */
  hashMode?: HashMode;
  /**
   * Custom function to call Mini Apps methods.
   * @default The `postEvent` function from the `@telegram-apps/bridge` package.
   */
  postEvent?: PostEvent;
  /**
   * Function which determines if navigation with passed information is allowed.
   * @param action - action information.
   * @default Navigator doesn't block any navigations.
   */
  shouldNavigate?: (
    this: Navigator<State>,
    action: {
      /**
       * Incoming cursor.
       */
      cursor: number;
      /**
       * History item information.
       */
      item: HistoryItem<State>;
      /**
       * Navigation type.
       */
      type: NavigationType;
    },
  ) => boolean;
}
