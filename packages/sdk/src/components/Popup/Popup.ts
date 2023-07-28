import { EventEmitter, type Version } from '@twa.js/utils';
import { on, postEvent as bridgePostEvent } from '@twa.js/bridge';

import type { PopupParams } from './types.js';
import type { PopupEvents } from './events.js';
import type { PostEvent } from '../../types.js';
import { preparePopupParams } from './utils.js';
import { WithSupports } from '../../lib/index.js';

/**
 * Controls currently displayed application popup. It allows developers to
 * open new custom popups and detect popup-connected events.
 */
export class Popup extends WithSupports<'open'> {
  readonly #ee = new EventEmitter<PopupEvents>();

  readonly #postEvent: PostEvent;

  #isOpened = false;

  constructor(version: Version, postEvent: PostEvent = bridgePostEvent) {
    super(version, { open: 'web_app_open_popup' });
    this.#postEvent = postEvent;
  }

  private set isOpened(value: boolean) {
    if (this.#isOpened === value) {
      return;
    }

    this.#isOpened = value;
    this.#ee.emit('isOpenedChanged', this.#isOpened);
  }

  /**
   * Shows whether popup is currently opened.
   */
  get isOpened(): boolean {
    return this.#isOpened;
  }

  /**
   * Adds new event listener.
   */
  on = this.#ee.on.bind(this.#ee);

  /**
   * Removes event listener.
   */
  off = this.#ee.off.bind(this.#ee);

  /**
   * A method that shows a native popup described by the `params` argument.
   * Promise will be resolved when popup is closed. Resolved value will have
   * an identifier of pressed button.
   *
   * In case, user clicked outside the popup or clicked top right popup close
   * button, null will be returned.
   *
   * FIXME: In desktop, this function may work incorrectly.
   *  Issue: https://github.com/Telegram-Web-Apps/twa.js/issues/7
   * @param params - popup parameters.
   * @throws {Error} Popup is already opened.
   */
  open(params: PopupParams): Promise<string | null> {
    if (this.isOpened) {
      throw new Error('Popup is already opened.');
    }

    this.#postEvent('web_app_open_popup', preparePopupParams(params));
    this.isOpened = true;

    return new Promise<string | null>((res) => {
      const off = on('popup_closed', ({ button_id = null }) => {
        off();
        this.isOpened = false;
        res(button_id);
      });
    });
  }
}
