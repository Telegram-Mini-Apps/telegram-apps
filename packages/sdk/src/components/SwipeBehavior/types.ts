import type { StateEvents } from '@/classes/State/types.js';

/**
 * SwipeBehavior internal state.
 */
export interface SwipeBehaviorState {
  isVerticalSwipeEnabled: boolean;
}

/**
 * SwipeBehavior trackable events.
 */
export type SwipeBehaviorEvents = StateEvents<SwipeBehaviorState>;

/**
 * SwipeBehavior event name.
 */
export type SwipeBehaviorEventName = keyof SwipeBehaviorEvents;

/**
 * SwipeBehavior event listener.
 */
export type SwipeBehaviorEventListener<E extends SwipeBehaviorEventName> =
  SwipeBehaviorEvents[E];
