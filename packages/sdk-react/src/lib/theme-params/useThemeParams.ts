import {ThemeParams} from '@twa.js/sdk';

import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';

/**
 * Returns ThemeParams component instance.
 */
export function useThemeParams(): ThemeParams {
  const theme = useComponent('themeParams');
  useEventsTracking(theme, ['change']);

  return theme;
}