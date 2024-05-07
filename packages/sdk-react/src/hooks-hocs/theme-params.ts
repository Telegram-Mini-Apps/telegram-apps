import { initThemeParams } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the ThemeParams component instance.
 */
export const useThemeParams: Hook<typeof initThemeParams> = createHook(initThemeParams);

/**
 * HOC to pass the ThemeParams component instance to the wrapped component.
 */
export const withThemeParams: HOC<'themeParams', typeof useThemeParams> = createHOC('themeParams', useThemeParams);
