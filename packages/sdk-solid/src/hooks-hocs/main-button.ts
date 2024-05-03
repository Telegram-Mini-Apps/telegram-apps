import { initMainButton } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the MainButton component instance.
 */
export const useMainButton: Hook<typeof initMainButton> = createHook(initMainButton);

/**
 * HOC to pass the MainButton component instance to the wrapped component.
 */
export const withMainButton: HOC<'mainButton', typeof useMainButton> = createHOC('mainButton', useMainButton);
