import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';

import { off } from '../../bridge/events/off.js';
import { on } from '../../bridge/events/on.js';
import { postEvent } from '../../bridge/methods/postEvent.js';
import { Navigator } from '../Navigator/Navigator.js';
import type {
  NavigationEntry,
  NavigatorConEntry,
  PerformGoOptions,
  PerformPushOptions,
  PerformReplaceOptions,
} from '../Navigator/types.js';
import { drop } from './drop.js';
import { go } from './go.js';
import type {
  HashNavigatorEventsMap,
  HashNavigatorOptions,
} from './types.js';

const CURSOR_VOID = 0;
const CURSOR_BACK = 1;
const CURSOR_FORWARD = 2;

type HashNavigatorEventEmitter = EventEmitter<HashNavigatorEventsMap>;

export class HashNavigator extends Navigator<Promise<void>> {
  /**
   * Creates navigator from current window location hash.
   * @param options - options passed to constructor.
   */
  static fromLocation(options?: HashNavigatorOptions): HashNavigator {
    const {
      search,
      pathname,
      hash,
    } = new URL(
      window.location.hash.slice(1),
      window.location.href,
    );

    return new HashNavigator([{ search, pathname, hash }], 0, options);
  }

  private readonly ee = new EventEmitter<HashNavigatorEventsMap>();

  private attached = false;

  constructor(
    entries: NavigatorConEntry[],
    entriesCursor: number,
    options: HashNavigatorOptions = {},
  ) {
    super(entries, entriesCursor, {
      ...options,
      loggerPrefix: 'HashNavigator',
    });
  }

  /**
   * Handles window "popstate" event.
   * @param state - event state.
   */
  private onPopState = async ({ state }: PopStateEvent) => {
    this.logger.log('"popstate" event received. State:', state);

    // In case state is null, we recognize current event as occurring whenever user clicks
    // any anchor.
    // TODO: Should we do it?
    if (state === null) {
      return this.push(window.location.hash.slice(1));
    }

    // There is only one case when state can be CURSOR_VOID - when history contains
    // only one element. In this case, we should return user to the current history element.
    if (state === CURSOR_VOID) {
      this.logger.log('Void reached. Moving history forward');
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

  protected async performGo(options: PerformGoOptions): Promise<void> {
    if (!options.updated) {
      return;
    }

    if (this.attached) {
      await this.syncHistory();
    }

    this.emitChanged(options.before, options.after);
  }

  protected async performPush({ before, after }: PerformPushOptions): Promise<void> {
    if (this.attached) {
      await this.syncHistory();
    }

    this.emitChanged(before, after);
  }

  protected async performReplace(options: PerformReplaceOptions): Promise<void> {
    if (!options.updated) {
      return;
    }

    if (this.attached) {
      window.history.replaceState(null, '', `#${this.path}`);
    }

    this.emitChanged(options.before, options.after);
  }

  /**
   * Synchronizes current navigator state with browser history.
   */
  private async syncHistory(): Promise<void> {
    // Remove history change event listener to get rid of side effects related to possible
    // future calls of history.go.
    window.removeEventListener('popstate', this.onPopState);

    const hash = `#${this.path}`;

    // Drop the browser history and work with the clean one.
    await drop();

    // Actualize Telegram Mini Apps BackButton state.
    postEvent('web_app_setup_back_button', { is_visible: this.canGoBack });

    if (this.canGoBack && this.canGoForward) {
      // We have both previous and next elements. History should be:
      // [back, *current*, forward]
      this.logger.log('Setting up history: [<-, *, ->]');

      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(null, '', hash);
      window.history.pushState(CURSOR_FORWARD, '');

      await go(-1);
    } else if (this.canGoBack) {
      // We have only previous element. History should be:
      // [back, *current*]
      this.logger.log('Setting up history: [<-, *]');

      window.history.replaceState(CURSOR_BACK, '');
      window.history.pushState(null, '', hash);
    } else if (this.canGoForward) {
      // We have only next element. History should be:
      // [*current*, forward]
      this.logger.log('Setting up history: [*, ->]');

      window.history.replaceState(null, hash);
      window.history.pushState(CURSOR_FORWARD, '');

      await go(-1);
    } else {
      // We have no back and next elements. History should be:
      // [void, *current*]
      this.logger.log('Setting up history: [~, *]');

      window.history.replaceState(CURSOR_VOID, '');
      window.history.pushState(null, '', hash);
    }

    window.addEventListener('popstate', this.onPopState);
  }

  private emitChanged(from: NavigationEntry, to: NavigationEntry) {
    this.ee.emit('change', {
      navigator: this,
      from,
      to,
    });
  }

  /**
   * Attaches current navigator to the browser history allowing navigator to manipulate it.
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

  back = (): Promise<void> => super.back();

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
   * Adds new event listener.
   */
  on: HashNavigatorEventEmitter['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: HashNavigatorEventEmitter['off'] = this.ee.off.bind(this.ee);
}
