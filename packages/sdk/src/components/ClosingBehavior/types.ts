import type { StateEvents } from '@/classes/with-state/types.js';

/**
 * ClosingBehavior internal state.
 */
export interface ClosingBehaviorState {
  isConfirmationNeeded: boolean;
}

/**
 * ClosingBehavior trackable events.
 */
export type ClosingBehaviorEvents = StateEvents<ClosingBehaviorState>;

/**
 * ClosingBehavior event name.
 */
export type ClosingBehaviorEventName = keyof ClosingBehaviorEvents;

/**
 * ClosingBehavior event listener.
 */
export type ClosingBehaviorEventListener<E extends ClosingBehaviorEventName> =
  ClosingBehaviorEvents[E];
