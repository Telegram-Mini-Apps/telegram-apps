import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve Viewport component.
 */
export const useViewport = createHook('viewport', true);

/**
 * HOC to wrap specified component to pass Viewport instance.
 */
export const withViewport = createHoc('viewport', useViewport);
