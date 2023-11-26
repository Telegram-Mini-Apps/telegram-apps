import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve ThemeParams component.
 */
export const useThemeParams = createHook('themeParams', true);

/**
 * HOC to wrap specified component to pass ThemeParams instance.
 */
export const withThemeParams = createHoc('themeParams', useThemeParams);
