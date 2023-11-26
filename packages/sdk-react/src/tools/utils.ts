import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve Utils component.
 */
export const useUtils = createHook('utils');

/**
 * HOC to wrap specified component to pass Utils instance.
 */
export const withUtils = createHoc('utils', useUtils);
