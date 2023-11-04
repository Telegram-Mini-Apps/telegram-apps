import { EventEmitter } from '@tma.js/event-emitter';
import { postEvent as defaultPostEvent, type PostEvent } from '@tma.js/bridge';

import { State } from '../../state/index.js';

import type { ClosingBehaviourEvents, ClosingBehaviourState } from './types.js';

/**
 * Component responsible for controlling current closing confirmation
 * status.
 */
export class ClosingBehaviour {
  private readonly ee = new EventEmitter<ClosingBehaviourEvents>();

  private readonly state: State<ClosingBehaviourState>;

  constructor(
    isConfirmationNeeded: boolean,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    this.state = new State({ isConfirmationNeeded }, this.ee);
  }

  private set isConfirmationNeeded(value: boolean) {
    this.state.set('isConfirmationNeeded', value);
    this.postEvent('web_app_setup_closing_behavior', { need_confirmation: value });
  }

  /**
   * Returns true, if the confirmation dialog enabled while the user is trying
   * to close the Mini App.
   */
  get isConfirmationNeeded(): boolean {
    return this.state.get('isConfirmationNeeded');
  }

  /**
   * Disables the confirmation dialog while the user is trying to close the
   * Mini App.
   */
  disableConfirmation(): void {
    this.isConfirmationNeeded = false;
  }

  /**
   * Enables the confirmation dialog while the user is trying to close the
   * Mini App.
   */
  enableConfirmation(): void {
    this.isConfirmationNeeded = true;
  }

  /**
   * Adds new event listener.
   */
  on: typeof this.ee.on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: typeof this.ee.off = this.ee.off.bind(this.ee);
}
