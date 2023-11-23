import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve InitData component.
 */
export const useInitData = createHook('initData');

/**
 * HOC to wrap specified component to pass InitData instance.
 */
export const withInitData = createHoc('initData', useInitData);
