import { initMiniApp } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the MiniApp component instance.
 */
export const useMiniApp: Hook<typeof initMiniApp> = createHook(initMiniApp);

/**
 * HOC to pass the MiniApp component instance to the wrapped component.
 */
export const withMiniApp: HOC<'miniApp', typeof useMiniApp> = createHOC('miniApp', useMiniApp);
