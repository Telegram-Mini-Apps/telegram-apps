import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { SwipeBehavior } from './SwipeBehavior.js';

/**
 * @returns A new initialized instance of the `SwipeBehavior` class.
 * @see SwipeBehavior
 */
export const initSwipeBehavior = createComponentInitFn(
  'swipeBehavior',
  ({
    postEvent,
    state = { isVerticalSwipesEnabled: false },
  }) => new SwipeBehavior(state.isVerticalSwipesEnabled, postEvent),
);
