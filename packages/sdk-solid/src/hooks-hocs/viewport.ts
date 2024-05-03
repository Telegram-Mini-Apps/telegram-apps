import { initViewport } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the Viewport component instance.
 */
export const useViewport: Hook<typeof initViewport> = createHook(initViewport);

/**
 * HOC to pass the Viewport component instance to the wrapped component.
 */
export const withViewport: HOC<'viewport', typeof useViewport> = createHOC('viewport', useViewport);
