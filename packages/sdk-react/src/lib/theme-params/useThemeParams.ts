import {ThemeParams} from 'twa-sdk';
import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns ThemeParams component instance.
 */
export function useThemeParams(): ThemeParams {
  const theme = useComponent('theme');
  useEventsTracking(theme, ['change']);

  return theme;
}