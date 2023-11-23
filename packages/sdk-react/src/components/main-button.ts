import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve MainButton component.
 */
export const useMainButton = createHook('mainButton', true);

/**
 * HOC to wrap specified component to pass MainButton instance.
 */
export const withMainButton = createHoc('mainButton', useMainButton);
