import {BridgeEventListener} from 'twa-bridge';
import {EventEmitter, Version} from 'twa-core';

import {PopupParams} from './types';
import {PopupEventsMap} from './events';
import {preparePopupParams} from './utils';
import {createSupportsFunc, SupportsFunc} from '../../utils';
import {BridgeLike} from '../../types';

/**
 * Controls currently displayed application popup. It allows developers to
 * open new custom popups and detect popup-connected events.
 */
export class Popup {
  private readonly ee = new EventEmitter<PopupEventsMap>();
  private _isOpened = false;

  constructor(private readonly bridge: BridgeLike, version: Version) {
    this.supports = createSupportsFunc(version, {open: 'web_app_open_popup'});
  }

  private set isOpened(value: boolean) {
    if (this._isOpened === value) {
      return;
    }
    this._isOpened = value;
    this.ee.emit('openChanged', this._isOpened);
  }

  /**
   * Shows whether popup is currently opened.
   */
  get isOpened(): boolean {
    return this._isOpened;
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
   *  Issue: https://github.com/Telegram-Web-Apps/twa/issues/7
   * @param params - popup parameters.
   * @throws {Error} Popup is already opened.
   */
  open(params: PopupParams): Promise<string | null> {
    // Don't allow opening several popups.
    if (this.isOpened) {
      throw new Error('Popup is already opened.');
    }

    // Format all required parameters.
    const preparedParams = preparePopupParams(params);

    // Send bridge event to make popup show.
    this.bridge.postEvent('web_app_open_popup', preparedParams);

    // Update popup opened status.
    this.isOpened = true;

    return new Promise<string | null>(res => {
      // Create 'popup_closed' event listener to catch clicked button.
      const listener: BridgeEventListener<'popup_closed'> = ({button_id = null}) => {
        this.bridge.off('popup_closed', listener);
        res(button_id);
        this.isOpened = false;
      };

      // Add listener which will resolve promise.
      this.bridge.on('popup_closed', listener);
    });
  }

  /**
   * Returns true in case, specified method is supported by current component
   * including Web Apps platform version.
   */
  supports: SupportsFunc<'open'>;
}
