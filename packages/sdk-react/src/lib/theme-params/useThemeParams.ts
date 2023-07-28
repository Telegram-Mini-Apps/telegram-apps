import { useUnit } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { ThemeParams } from './types.js';

/**
 * Returns ThemeParams component instance.
 */
export function useThemeParams(): ThemeParams {
  const theme = useUnit('themeParams');
  useEventsTracking(theme, ['changed']);

  return theme;
}
