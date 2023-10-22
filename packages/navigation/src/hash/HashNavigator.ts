import { Logger } from '@tma.js/logger';
import { EventEmitter } from '@tma.js/event-emitter';
import { on, off, postEvent } from '@tma.js/bridge';

import { BasicNavigator } from '../BasicNavigator.js';
import { drop, go } from './history.js';
import type {
  NavigationEntry,
  NavigatorOptions,
  AllowedEntry,
  NavigatorState,
  NavigatorEventsMap,
} from '../types.js';

const CURSOR_VOID = 0;
const CURSOR_BACK = 1;
const CURSOR_FORWARD = 2;

export class HashNavigator {
  private readonly ee = new EventEmitter<NavigatorEventsMap>();

  private readonly logger: Logger;

  private navigator: BasicNavigator;

  private attached = false;

  constructor(
    history: NavigationEntry[],
    cursor: number,
    { debug = false }: NavigatorOptions = {},
  ) {
    this.navigator = new BasicNavigator(history, cursor);
    this.logger = new Logger('[Hash Navigator]', debug);
  }

  /**
   * Creates browser history state associated with the current navigator state.
   */
  private get state(): NavigatorState {
    return {
      cursor: this.navigator.cursor,
      entries: [...this.navigator.getEntries()],
    };
  }

  /**
   * Handles window "popstate" event.
   * @param state - event state.
   */
  private onPopState = async ({ state }: PopStateEvent) => {
    this.logger.log('Received state', state);

    // In case state is null, we recognize current event as occurring whenever user clicks
    // any anchor.
    // TODO: Should we do it?
    if (state === null) {
      return this.push(window.location.hash.slice(1));
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
   * Synchronizes current navigator state with browser history.
   */
  private async syncHistory(): Promise<void> {
    this.logger.log('Synchronizing with browser history');

    // Remove history change event listener to get rid of side effects related to possible
    // future calls of history.go.
    window.removeEventListener('popstate', this.onPopState);

    const hash = `#${this.path}`;

    // Drop the browser history and work with the clean one.
    await drop();

    // Actualize Telegram Mini Apps BackButton state.
    postEvent('web_app_setup_back_button', { is_visible: this.navigator.canGoBack() });

    if (this.navigator.canGoBack() && this.navigator.canGoForward()) {
      // We have both previous and next elements. History should be:
      // [back, *current*, forward]
      this.logger.log('Setting up history: [back, current, forward]');

      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(this.state, '', hash);
      window.history.pushState(CURSOR_FORWARD, '');

      await go(-1);
    } else if (this.navigator.canGoBack()) {
      // We have only previous element. History should be:
      // [back, *current*]
      this.logger.log('Setting up history: [back, current]');

      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(this.state, '', hash);
    } else if (this.navigator.canGoForward()) {
      // We have only next element. History should be:
      // [*current*, forward]
      this.logger.log('Setting up history: [current, forward]');

      window.history.replaceState(this.state, hash);
      window.history.pushState(CURSOR_FORWARD, '');

      await go(-1);
    } else {
      // We have no back and next elements. History should be:
      // [void, *current*]
      this.logger.log('Setting up history: [void, current]');

      window.history.replaceState(CURSOR_VOID, '');
      window.history.pushState(this.state, '', hash);
    }

    window.addEventListener('popstate', this.onPopState);
  }

  /**
   * Attaches current navigator to the browser history.
   */
  async attach(): Promise<void> {
    if (this.attached) {
      return;
    }
    this.logger.log('Attaching', this);
    this.attached = true;
    on('back_button_pressed', this.back);
    return this.syncHistory();
  }

  /**
   * Goes back in history.
   * @returns Promise which will be resolved when transition was completed.
   */
  back = (): Promise<void> => this.go(-1);

  /**
   * Detaches current navigator from the browser history.
   */
  detach() {
    if (!this.attached) {
      return;
    }
    this.logger.log('Detaching', this);
    this.attached = false;
    window.removeEventListener('popstate', this.onPopState);
    off('back_button_pressed', this.back);
  }

  /**
   * Goes forward in history.
   * @returns Promise which will be resolved when transition was completed.
   */
  forward(): Promise<void> {
    return this.go(1);
  }

  /**
   * Goes in history by specified delta.
   * @param delta - history change delta.
   * @returns Promise which will be resolved when transition was completed.
   * @see BasicNavigator.go
   */
  async go(delta: number): Promise<void> {
    if (!this.navigator.go(delta)) {
      return;
    }

    if (this.attached) {
      await this.syncHistory();
    }

    this.ee.emit('change', {
      pathname: this.pathname,
      search: this.search,
    });
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
   * @see BasicNavigator.path
   */
  get path() {
    return this.navigator.path;
  }

  /**
   * @see BasicNavigator.pathname
   */
  get pathname() {
    return this.navigator.pathname;
  }

  /**
   * Pushes new entry.
   * @param entry - new entry to push.
   * @returns Promise which will be resolved when transition was completed.
   * @see BasicNavigator.push
   */
  async push(entry: AllowedEntry): Promise<void> {
    this.navigator.push(entry);

    if (this.attached) {
      await this.syncHistory();
    }

    this.ee.emit('change', {
      pathname: this.pathname,
      search: this.search,
    });
  }

  /**
   * Replaces current history entry.
   * @param entry - entry to replace current with.
   * @see BasicNavigator.replace
   */
  replace(entry: AllowedEntry): void {
    if (!this.navigator.replace(entry)) {
      return;
    }

    if (this.attached) {
      window.history.replaceState(this.state, '', `#${this.path}`);
    }

    this.ee.emit('change', {
      pathname: this.pathname,
      search: this.search,
    });
  }

  /**
   * @see BasicNavigator.search
   */
  get search() {
    return this.navigator.search;
  }
}
