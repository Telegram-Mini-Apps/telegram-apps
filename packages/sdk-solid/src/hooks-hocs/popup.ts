import { initPopup } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the Popup component instance.
 */
export const usePopup: Hook<typeof initPopup> = createHook(initPopup);

/**
 * HOC to pass the Popup component instance to the wrapped component.
 */
export const withPopup: HOC<'popup', typeof usePopup> = createHOC('popup', usePopup);
