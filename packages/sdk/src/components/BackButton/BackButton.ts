import {EventEmitter} from 'twa-core';
import {BackButtonEventListener, BackButtonEventsMap} from './events';
import {Bridge} from 'twa-bridge';
import {
  createSupportChecker,
  processBridgeProp,
} from '../../utils';
import {WithCommonProps} from '../../types';

export interface BackButtonProps extends WithCommonProps {
  isVisible?: boolean;
}

/**
 * Class which controls the back button displayed in the header
 * of the Web App in the Telegram interface. It is mostly used in case, when
 * you want to provide a way to go bach in routing history or "rollback" some
 * action.
 */
export class BackButton {
  /**
   * Checks if method is supported by specified version of Web App.
   */
  static supports = createSupportChecker({
    show: 'web_app_setup_back_button',
    hide: 'web_app_setup_back_button',
  });

  private readonly ee = new EventEmitter<BackButtonEventsMap>();
  private readonly bridge: Bridge;
  private _isVisible: boolean;

  constructor(props: BackButtonProps = {}) {
    const {bridge, isVisible = false} = props;
    this.bridge = processBridgeProp(bridge);
    this._isVisible = isVisible;
  }

  private set isVisible(visible: boolean) {
    this.bridge.postEvent('web_app_setup_back_button', {is_visible: visible});

    if (this._isVisible === visible) {
      return;
    }
    this._isVisible = visible;
    this.ee.emit('visibleChange', visible);
  }

  /**
   * Shows whether the button is visible.
   */
  get isVisible() {
    return this._isVisible;
  }

  /**
   * Hides the button.
   */
  hide() {
    this.isVisible = false;
  }

  /**
   * Adds new event listener.
   */
  on: typeof this.ee.on = (event, listener) => {
    if (event === 'click') {
      return this.bridge.on('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }
    this.ee.on(event, listener);
  };

  /**
   * Removes event listener.
   */
  off: typeof this.ee.off = (event, listener) => {
    if (event === 'click') {
      return this.bridge.off('back_button_pressed', listener as BackButtonEventListener<'click'>);
    }
    this.ee.off(event, listener);
  };

  /**
   * Shows the button.
   */
  show() {
    this.isVisible = true;
  }
}
