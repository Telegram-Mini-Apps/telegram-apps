import { EventEmitter } from '@twa.js/event-emitter';
import { on, off, postEvent as defaultPostEvent, type PostEvent } from '@twa.js/bridge';

import type { Version } from '@twa.js/utils';

import { createSupportsFunc, type SupportsFunc } from '../../supports.js';
import { State } from '../../state/index.js';

import type { BackButtonEvents, BackButtonState, BackButtonEventListener } from './types.js';

/**
 * Class which controls the back button displayed in the header
 * of the Web App in the Telegram interface. It is mostly used in case, when
 * you want to provide a way to go bach in routing history or "rollback" some
 * action.
 */
export class BackButton {
  private readonly ee = new EventEmitter<BackButtonEvents>();

  private readonly state: State<BackButtonState>;

  constructor(
    isVisible: boolean,
    version: Version,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    this.state = new State({ isVisible }, this.ee);
    this.supports = createSupportsFunc(version, {
      show: 'web_app_setup_back_button',
      hide: 'web_app_setup_back_button',
    });
  }

  private set isVisible(visible: boolean) {
    this.state.set('isVisible', true);
    this.postEvent('web_app_setup_back_button', { is_visible: visible });
  }

  /**
   * True if BackButton is currently visible.
   */
  get isVisible(): boolean {
    return this.state.get('isVisible');
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
  on: typeof this.ee.on = (event, listener) => {
    if (event === 'click') {
      return on('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }

    this.ee.on(event, listener);
  };

  /**
   * Removes event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  off: typeof this.ee.off = (event, listener) => {
    if (event === 'click') {
      return off('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }

    this.ee.off(event, listener);
  };

  /**
   * Shows the BackButton.
   */
  show(): void {
    this.isVisible = true;
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'show' | 'hide'>;
}
