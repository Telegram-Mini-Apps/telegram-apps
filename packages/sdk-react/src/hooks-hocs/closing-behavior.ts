import { initClosingBehavior } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the ClosingBehavior component instance.
 */
export const useClosingBehavior: Hook<typeof initClosingBehavior> = createHook(initClosingBehavior);

/**
 * HOC to pass the ClosingBehavior component instance to the wrapped component.
 */
export const withClosingBehavior: HOC<'closingBehavior', typeof useClosingBehavior> = createHOC('closingBehavior', useClosingBehavior);
