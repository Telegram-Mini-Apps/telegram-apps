import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve BackButton component.
 */
export const useBackButton = createHook('backButton', true);

/**
 * HOC to wrap specified component to pass BackButton instance.
 */
export const withBackButton = createHoc('backButton', useBackButton);
