import { createInitFn } from '@/components/createInitFn.js';
import { ThemeParams } from '@/components/theme-params/ThemeParams.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

/**
 * @returns A new initialized instance of ThemeParams class.
 */
export const initThemeParams = createInitFn(
  'themeParams',
  (_, state) => {
    // Create component instance.
    const tp = new ThemeParams({
      ...retrieveLaunchParams().themeParams,
      ...state,
    });

    // Start listening to the theme changes.
    tp.listen();

    return tp;
  },
);
