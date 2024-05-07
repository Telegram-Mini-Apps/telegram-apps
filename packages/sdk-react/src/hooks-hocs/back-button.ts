import { initBackButton } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the BackButton component instance.
 */
export const useBackButton: Hook<typeof initBackButton> = createHook(initBackButton);

/**
 * HOC to pass the BackButton component instance to the wrapped component.
 */
export const withBackButton: HOC<'backButton', typeof useBackButton> = createHOC('backButton', useBackButton);
