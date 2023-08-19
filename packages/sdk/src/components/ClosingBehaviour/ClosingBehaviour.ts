import { EventEmitter } from '@twa.js/utils';
import { postEvent as bridgePostEvent, type PostEvent } from '@twa.js/bridge';

import type { ClosingBehaviourEvents } from './events.js';

type Emitter = EventEmitter<ClosingBehaviourEvents>;

/**
 * Component responsible for controlling current closing confirmation
 * status.
 */
export class ClosingBehaviour {
  readonly #ee: Emitter = new EventEmitter();

  readonly #postEvent: PostEvent;

  #isConfirmationNeeded = false;

  constructor(postEvent: PostEvent = bridgePostEvent) {
    this.#postEvent = postEvent;
  }

  private set isConfirmationNeeded(value: boolean) {
    this.#postEvent('web_app_setup_closing_behavior', {
      need_confirmation: value,
    });

    if (this.#isConfirmationNeeded === value) {
      return;
    }

    this.#isConfirmationNeeded = value;
    this.#ee.emit('isConfirmationNeededChanged', value);
  }

  /**
   * Returns true, if the confirmation dialog enabled while the user is trying
   * to close the Web App.
   */
  get isConfirmationNeeded(): boolean {
    return this.#isConfirmationNeeded;
  }

  /**
   * Disables the confirmation dialog while the user is trying to close the
   * Web App.
   */
  disableConfirmation(): void {
    this.isConfirmationNeeded = false;
  }

  /**
   * Enables the confirmation dialog while the user is trying to close the
   * Web App.
   */
  enableConfirmation(): void {
    this.isConfirmationNeeded = true;
  }

  /**
   * Adds new event listener.
   */
  on = this.#ee.on.bind(this.#ee);

  /**
   * Removes event listener.
   */
  off = this.#ee.off.bind(this.#ee);
}
