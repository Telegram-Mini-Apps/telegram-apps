import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve MiniApp component.
 */
export const useMiniApp = createHook('miniApp', true);

/**
 * HOC to wrap specified component to pass MiniApp instance.
 */
export const withMiniApp = createHoc('miniApp', useMiniApp);
