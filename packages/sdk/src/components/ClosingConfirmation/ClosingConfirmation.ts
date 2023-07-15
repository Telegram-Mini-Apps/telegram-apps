import { EventEmitter } from '@twa.js/utils';

import type { ClosingConfirmationEventsMap } from './events.js';
import type { BridgeLike } from '../../types.js';

/**
 * Component responsible for controlling current closing confirmation
 * status.
 */
export class ClosingConfirmation {
  private readonly ee = new EventEmitter<ClosingConfirmationEventsMap>();

  #isEnabled = false;

  constructor(private readonly bridge: BridgeLike) {
  }

  private set isEnabled(value: boolean) {
    // Send request to native app.
    this.bridge.postEvent('web_app_setup_closing_behavior', {
      need_confirmation: value,
    });

    if (this.#isEnabled === value) {
      return;
    }

    // Update current value.
    this.#isEnabled = value;

    // Emit event.
    this.ee.emit('isEnabledChanged', value);
  }

  /**
   * Returns true, if the confirmation dialog enabled while the user is trying
   * to close the Web App.
   */
  get isEnabled(): boolean {
    return this.#isEnabled;
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
