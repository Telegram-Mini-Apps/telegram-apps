export interface ClosingBehaviourEvents {
  isConfirmationNeededChanged: (value: boolean) => void;
}

export type ClosingBehaviourEventName = keyof ClosingBehaviourEvents;

export type ClosingBehaviourEventListener<E extends ClosingBehaviourEventName> =
  ClosingBehaviourEvents[E];
