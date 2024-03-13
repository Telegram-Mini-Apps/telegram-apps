import type { StateEvents } from '../state/index.js';

export interface ClosingBehaviorState {
  isConfirmationNeeded: boolean;
}

export type ClosingBehaviorEvents = StateEvents<ClosingBehaviorState>;

export type ClosingBehaviorEventName = keyof ClosingBehaviorEvents;

export type ClosingBehaviorEventListener<E extends ClosingBehaviorEventName> =
  ClosingBehaviorEvents[E];
