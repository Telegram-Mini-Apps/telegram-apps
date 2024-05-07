import { initUtils } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the Utils component instance.
 */
export const useUtils: Hook<typeof initUtils> = createHook(initUtils);

/**
 * HOC to pass the Utils component instance to the wrapped component.
 */
export const withUtils: HOC<'utils', typeof useUtils> = createHOC('utils', useUtils);
