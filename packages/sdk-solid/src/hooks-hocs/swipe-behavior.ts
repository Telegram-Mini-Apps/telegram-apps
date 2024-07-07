import { initSwipeBehavior } from '@telegram-apps/sdk';

import { createHOC } from '../createHOC.js';
import { createHook } from '../createHook.js';

/**
 * Hook to receive the SwipeBehavior component instance.
 */
export const useSwipeBehavior = createHook(initSwipeBehavior);

/**
 * HOC to pass the SwipeBehavior component instance to the wrapped component.
 */
export const withSwipeBehavior = createHOC(useSwipeBehavior);
