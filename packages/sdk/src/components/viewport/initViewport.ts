import { createInitFn } from '@/components/createInitFn.js';
import { Viewport } from '@/components/viewport/Viewport.js';

/**
 * @returns A new initialized instance of Viewport class.
 */
export const initViewport = createInitFn(
  'viewport',
  (options, state) => new Viewport({
    ...options,
    height: 0,
    width: 0,
    stableHeight: 0,
    isExpanded: false,
    ...state,
  }),
);
