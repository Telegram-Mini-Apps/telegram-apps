import {
  type PostEvent,
  postEvent as defaultPostEvent,
  request,
} from '~/bridge/index.js';
import { EventEmitter } from '~/event-emitter/index.js';
import { State } from '~/state/index.js';
import {
  createSupportsFunc,
  type SupportsFunc,
} from '~/supports/index.js';
import type { Version } from '~/version/index.js';

import { preparePopupParams } from './preparePopupParams.js';
import type { OpenPopupOptions, PopupEvents, PopupState } from './types.js';

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

  private set isOpened(value) {
    this.state.set('isOpened', value);
  }

  /**
   * True if popup is currently opened.
   */
  get isOpened(): boolean {
    return this.state.get('isOpened');
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
   * A method that shows a native popup described by the `params` argument.
   * Promise will be resolved when popup is closed. Resolved value will have
   * an identifier of pressed button.
   *
   * In case, user clicked outside the popup or clicked top right popup close
   * button, null will be returned.
   *
   * FIXME: In desktop, this function may work incorrectly.
   *  Issue: https://github.com/Telegram-Mini-Apps/tma.js/issues/7
   * @param options - popup parameters.
   * @throws {Error} Popup is already opened.
   */
  open(options: OpenPopupOptions): Promise<string | null> {
    if (this.isOpened) {
      throw new Error('Popup is already opened.');
    }

    this.isOpened = true;

    return request(
      'web_app_open_popup',
      preparePopupParams(options),
      'popup_closed',
      { postEvent: this.postEvent },
    )
      .then(({ button_id = null }) => button_id)
      .finally(() => {
        this.isOpened = false;
      });
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'open'>;
}
