import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve postEvent function.
 */
export const usePostEvent = createHook('postEvent');

/**
 * HOC to wrap specified component to pass postEvent function.
 */
export const withPostEvent = createHoc('postEvent', usePostEvent);
