import { initInitData } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the InitData component instance.
 */
export const useInitData: Hook<typeof initInitData> = createHook(initInitData);

/**
 * HOC to pass the InitData component instance to the wrapped component.
 */
export const withInitData: HOC<'initData', typeof useInitData> = createHOC('initData', useInitData);
