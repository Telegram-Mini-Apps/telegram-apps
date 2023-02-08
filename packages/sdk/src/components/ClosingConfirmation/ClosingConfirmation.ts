import {EventEmitter} from '@twa.js/utils';

import {ClosingConfirmationEventsMap} from './events';
import {BridgeLike} from '../../types';

/**
 * Component responsible for controlling current closing confirmation
 * status.
 */
export class ClosingConfirmation {
  private readonly ee = new EventEmitter<ClosingConfirmationEventsMap>();
  private _isEnabled = false;

  constructor(private readonly bridge: BridgeLike) {
  }

  private set isEnabled(value: boolean) {
    // Send request to native app.
    this.bridge.postEvent('web_app_setup_closing_behavior', {
      need_confirmation: value,
    });

    if (this._isEnabled === value) {
      return;
    }

    // Update current value.
    this._isEnabled = value;

    // Emit event.
    this.ee.emit('change', value);
  }

  /**
   * Returns true, if the confirmation dialog enabled while the user is trying
   * to close the Web App.
   */
  get isEnabled(): boolean {
    return this._isEnabled;
  }

  /**
   * Disables the confirmation dialog while the user is trying to close the
   * Web App.
   */
  disable(): void {
    this.isEnabled = false;
  }

  /**
   * Enables the confirmation dialog while the user is trying to close the
   * Web App.
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * Adds new event listener.
   */
  on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off = this.ee.off.bind(this.ee);
}
