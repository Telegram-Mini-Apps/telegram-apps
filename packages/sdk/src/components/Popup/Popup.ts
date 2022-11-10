import {PopupParams} from './types';
import {EventEmitter, Version} from 'twa-core';
import {PopupEventsMap} from './events';
import {preparePopupParams} from './utils';
import {
  createSupportChecker,
  processBridgeProp,
  SupportChecker,
} from '../../utils';
import {Bridge, BridgeEventListener} from 'twa-bridge';
import {WithCommonProps} from '../../types';

export interface PopupProps extends WithCommonProps {
  isOpened?: boolean;
}

type SupportsFunc = SupportChecker<'show'>;

/**
 * Controls currently displayed application popup. It allows developers to
 * open new custom popups and detect popup-connected events.
 */
export class Popup {
  private readonly ee = new EventEmitter<PopupEventsMap>();
  private readonly bridge: Bridge;
  private _isOpened: boolean;

  constructor(version: Version, props: PopupProps = {}) {
    const {bridge, isOpened = false} = props;
    this.bridge = processBridgeProp(bridge);
    this.supports = createSupportChecker(version, {show: 'web_app_open_popup'});
    this._isOpened = isOpened;
  }

  /**
   * Changes current open state.
   * @param value - new open state.
   * @private
   */
  private set isOpened(value: boolean) {
    if (this._isOpened === value) {
      return;
    }
    this._isOpened = value;
    this.ee.emit('openChange', this._isOpened);
  }

  /**
   * Shows whether popup is currently opened.
   */
  get isOpened(): boolean {
    return this._isOpened;
  }

  /**
   * Hides currently opened popup. This function has no real effect for native
   * opened Popup. We currently need this function to update open status.
   * Feature request: https://github.com/Telegram-Web-Apps/twa/issues/4
   */
  hide(): void {
    this.isOpened = false;
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
   * button, `null` will be returned.
   *
   * FIXME: On desktop, this function may work incorrectly.
   *  Issue: https://github.com/Telegram-Web-Apps/twa/issues/7
   * @param params - popup parameters.
   * @since Web App version 6.2+
   * @see preparePopupParams
   * @throws {Error} Popup is already opened.
   */
  show(params: PopupParams): Promise<string | null> {
    // Don't allow opening several popups.
    if (this._isOpened) {
      throw new Error('Popup is already opened.');
    }

    // Format all required parameters.
    const preparedParams = preparePopupParams(params);

    // Update popup opened status.
    this.isOpened = true;

    return new Promise<string | null>(res => {
      // Create 'popup_closed' event listener to catch clicked button.
      const listener: BridgeEventListener<'popup_closed'> = ({button_id}) => {
        // Remove event listener.
        this.bridge.off('popup_closed', listener);

        // Update popup opened status.
        this.isOpened = false;

        // Emit local close event.
        this.ee.emit('close', button_id);

        // Resolve received value.
        res(button_id);
      };

      // Emit local open event.
      this.ee.emit('open', preparedParams);

      // Add listener which will resolve promise.
      this.bridge.on('popup_closed', listener);

      // Send bridge event to make popup show.
      this.bridge.postEvent('web_app_open_popup', preparedParams);
    });
  }

  /**
   * A method that shows message in a simple alert with a 'Close' button.
   * Promise will be resolved when popup is closed.
   * @param message - message to display.
   * @since Web App version 6.2+
   * @see show
   */
  async showAlert(message: string): Promise<void> {
    await this.show({message, buttons: [{type: 'close'}]});
  }

  /**
   * A method that shows message in a simple confirmation window with `OK`
   * and `Cancel` buttons. Promise will be resolved when popup is closed.
   * Resolved value will be `true` in case, user pressed `OK` button. The
   * result will be `false` otherwise.
   * @param message - message to display.
   * @since Web App version 6.2+
   * @see show
   */
  showConfirm(message: string): Promise<boolean> {
    return this
      .show({
        message,
        buttons: [{type: 'ok', id: 'ok'}, {id: 'cancel', type: 'cancel'}],
      })
      .then(id => id === 'ok');
  }

  /**
   * Returns true in case, specified method is supported by Popup.
   */
  supports: SupportsFunc;
}
