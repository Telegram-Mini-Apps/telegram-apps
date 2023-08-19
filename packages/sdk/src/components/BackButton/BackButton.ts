import { EventEmitter, type Version } from '@twa.js/utils';
import { on, off, postEvent as bridgePostEvent, type PostEvent } from '@twa.js/bridge';

import { WithSupports } from '../../lib/index.js';

import type { BackButtonEventListener, BackButtonEvents } from './events.js';

type Emitter = EventEmitter<BackButtonEvents>;

/**
 * Class which controls the back button displayed in the header
 * of the Web App in the Telegram interface. It is mostly used in case, when
 * you want to provide a way to go bach in routing history or "rollback" some
 * action.
 */
export class BackButton extends WithSupports<'show' | 'hide'> {
  readonly #ee: Emitter = new EventEmitter();

  readonly #postEvent: PostEvent;

  #isVisible = false;

  constructor(version: Version, postEvent: PostEvent = bridgePostEvent) {
    super(version, {
      show: 'web_app_setup_back_button',
      hide: 'web_app_setup_back_button',
    });
    this.#postEvent = postEvent;
  }

  private set isVisible(visible: boolean) {
    this.#postEvent('web_app_setup_back_button', { is_visible: visible });

    if (this.#isVisible === visible) {
      return;
    }

    this.#isVisible = visible;
    this.#ee.emit('isVisibleChanged', visible);
  }

  /**
   * True if BackButton is currently visible.
   */
  get isVisible(): boolean {
    return this.#isVisible;
  }

  /**
   * Hides the BackButton.
   */
  hide(): void {
    this.isVisible = false;
  }

  /**
   * Adds event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  on: Emitter['on'] = (event, listener) => {
    if (event === 'click') {
      return on('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }

    this.#ee.on(event, listener);
  };

  /**
   * Removes event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  off: Emitter['off'] = (event, listener) => {
    if (event === 'click') {
      return off('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }

    this.#ee.off(event, listener);
  };

  /**
   * Shows the BackButton.
   */
  show(): void {
    this.isVisible = true;
  }
}
