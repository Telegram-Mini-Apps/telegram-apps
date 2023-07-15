import { useComponent } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { ThemeParams } from './types.js';

/**
 * Returns ThemeParams component instance.
 */
export function useThemeParams(): ThemeParams {
  const theme = useComponent('themeParams');
  useEventsTracking(theme, ['change']);

  return theme;
}
