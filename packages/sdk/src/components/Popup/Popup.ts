import { EventEmitter } from '@tma.js/event-emitter';
import { postEvent as defaultPostEvent, request, type PostEvent } from '@tma.js/bridge';

import type { Version } from '@tma.js/utils';

import { preparePopupParams } from './utils.js';
import { createSupportsFunc, type SupportsFunc } from '../../supports.js';
import { State } from '../../state/index.js';

import type { PopupParams, PopupEvents, PopupState } from './types.js';

/**
 * Controls currently displayed application popup. It allows developers to
 * open new custom popups and detect popup-connected events.
 */
export class Popup {
  private readonly ee = new EventEmitter<PopupEvents>();

  private readonly state: State<PopupState>;

  constructor(version: Version, private readonly postEvent: PostEvent = defaultPostEvent) {
    this.state = new State({ isOpened: false }, this.ee);
    this.supports = createSupportsFunc(version, { open: 'web_app_open_popup' });
  }

  /**
   * Shows whether popup is currently opened.
   */
  get isOpened(): boolean {
    return this.state.get('isOpened');
  }

  /**
   * Adds new event listener.
   */
  on: typeof this.ee.on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: typeof this.ee.off = this.ee.off.bind(this.ee);

  /**
   * A method that shows a native popup described by the `params` argument.
   * Promise will be resolved when popup is closed. Resolved value will have
   * an identifier of pressed button.
   *
   * In case, user clicked outside the popup or clicked top right popup close
   * button, null will be returned.
   *
   * FIXME: In desktop, this function may work incorrectly.
   *  Issue: https://github.com/Telegram-Mini-Apps/tma.js/issues/7
   * @param params - popup parameters.
   * @throws {Error} Popup is already opened.
   */
  async open(params: PopupParams): Promise<string | null> {
    if (this.isOpened) {
      throw new Error('Popup is already opened.');
    }

    this.state.set('isOpened', true);

    try {
      const { button_id: buttonId = null } = await request(
        'web_app_open_popup',
        preparePopupParams(params),
        'popup_closed',
        { postEvent: this.postEvent },
      );

      return buttonId;
    } finally {
      this.state.set('isOpened', false);
    }
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'open'>;
}
