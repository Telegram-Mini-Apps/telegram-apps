import { EventEmitter, type Version } from '@twa.js/utils';

import type { BackButtonEventListener, BackButtonEventsMap } from './events.js';
import type { BridgeLike } from '../../types.js';
import { createSupportsFunc, type SupportsFunc } from '../../utils/index.js';

type Emitter = EventEmitter<BackButtonEventsMap>;

/**
 * Class which controls the back button displayed in the header
 * of the Web App in the Telegram interface. It is mostly used in case, when
 * you want to provide a way to go bach in routing history or "rollback" some
 * action.
 */
export class BackButton {
  private readonly ee: Emitter = new EventEmitter();

  #isVisible = false;

  constructor(private readonly bridge: BridgeLike, version: Version) {
    this.supports = createSupportsFunc(version, {
      show: 'web_app_setup_back_button',
      hide: 'web_app_setup_back_button',
    });
  }

  private set isVisible(visible: boolean) {
    this.bridge.postEvent('web_app_setup_back_button', { is_visible: visible });

    if (this.#isVisible === visible) {
      return;
    }
    this.#isVisible = visible;
    this.ee.emit('isVisibleChanged', visible);
  }

  /**
   * Returns true if back button is currently visible.
   */
  get isVisible(): boolean {
    return this.#isVisible;
  }

  /**
   * Hides the button.
   */
  hide(): void {
    this.isVisible = false;
  }

  /**
   * Adds new event listener.
   */
  on: Emitter['on'] = (event, listener) => {
    if (event === 'click') {
      return this.bridge.on('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }
    this.ee.on(event, listener);
  };

  /**
   * Removes event listener.
   */
  off: Emitter['off'] = (event, listener) => {
    if (event === 'click') {
      return this.bridge.off('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }
    this.ee.off(event, listener);
  };

  /**
   * Shows the button.
   */
  show(): void {
    this.isVisible = true;
  }

  /**
   * Returns true in case, specified method is supported by current component
   * including Web Apps platform version.
   */
  supports: SupportsFunc<'show' | 'hide'>;
}
