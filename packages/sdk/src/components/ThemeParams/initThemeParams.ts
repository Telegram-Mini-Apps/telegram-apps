import { ThemeParams } from '@/components/ThemeParams/ThemeParams.js';
import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

/**
 * @returns A new initialized instance of the `ThemeParams` class.
 * @see ThemeParams
 */
export const initThemeParams = createComponentInitFn(
  'themeParams',
  ({ themeParams, state = themeParams, addCleanup }) => {
    const tp = new ThemeParams(state);
    addCleanup(tp.listen());
    return tp;
  },
);
