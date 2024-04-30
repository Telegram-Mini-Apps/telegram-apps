import { request } from '@/bridge/utils/request.js';
import { WithStateAndSupports } from '@/classes/with-state-and-supports/WithStateAndSupports.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { Version } from '@/version/types.js';

import { preparePopupParams } from './preparePopupParams.js';
import type { OpenPopupOptions, PopupState } from './types.js';

/**
 * @see Usage: https://docs.telegram-mini-apps.com/platform/popup
 * @see API: https://docs.telegram-mini-apps.com/packages/tma-js-sdk/components/popup
 */
export class Popup extends WithStateAndSupports<PopupState, 'open'> {
  constructor(isOpened: boolean, version: Version, private readonly postEvent: PostEvent) {
    super({ isOpened }, version, { open: 'web_app_open_popup' });
  }

  private set isOpened(value) {
    this.set('isOpened', value);
  }

  /**
   * True if the Popup is opened.
   */
  get isOpened(): boolean {
    return this.get('isOpened');
  }

  /**
   * A method that shows a native popup described by the `params` argument.
   * Promise will be resolved when popup is closed. Resolved value will have
   * an identifier of pressed button.
   *
   * In case, user clicked outside the popup or clicked top right popup close
   * button, null will be returned.
   *
   * @param options - popup parameters.
   * @throws {Error} Popup is already opened.
   */
  async open(options: OpenPopupOptions): Promise<string | null> {
    if (this.isOpened) {
      throw new Error('Popup is already opened.');
    }

    this.isOpened = true;

    try {
      const { button_id: buttonId = null } = await request({
        event: 'popup_closed',
        method: 'web_app_open_popup',
        postEvent: this.postEvent,
        params: preparePopupParams(options),
      });
      return buttonId;
    } finally {
      this.isOpened = false;
    }
  }
}
