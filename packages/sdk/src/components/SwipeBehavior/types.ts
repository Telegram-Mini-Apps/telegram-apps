import type { StateEvents } from '@/classes/State/types.js';

/**
 * Swipe internal state.
 */
export interface SwipeBehaviorState {
  isVerticalSwipesEnabled: boolean;
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
