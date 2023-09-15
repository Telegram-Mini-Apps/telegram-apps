import type { StateEvents } from '../../state/index.js';

export interface ClosingBehaviourState {
  isConfirmationNeeded: boolean;
}

export type ClosingBehaviourEvents = StateEvents<ClosingBehaviourState>;

export type ClosingBehaviourEventName = keyof ClosingBehaviourEvents;

export type ClosingBehaviourEventListener<E extends ClosingBehaviourEventName> =
  ClosingBehaviourEvents[E];
