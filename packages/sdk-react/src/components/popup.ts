import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve Popup component.
 */
export const usePopup = createHook('popup', true);

/**
 * HOC to wrap specified component to pass Popup instance.
 */
export const withPopup = createHoc('popup', usePopup);
