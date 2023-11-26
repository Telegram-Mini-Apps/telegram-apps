import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve ClosingBehavior component.
 */
export const useClosingBehavior = createHook('closingBehavior', true);

/**
 * HOC to wrap specified component to pass ClosingBehavior instance.
 */
export const withClosingBehavior = createHoc('closingBehavior', useClosingBehavior);
