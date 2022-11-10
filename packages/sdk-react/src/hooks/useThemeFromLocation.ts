import {extractThemeFromLocation, ThemeParams} from 'twa-theme-params';
import {useMemo} from 'react';

/**
 * Hook which returns theme parameters from current window location. It is not
 * recommended to use this hook all over the application and prior should be
 * sent to useThemeParams, but when SDK is not loaded, there is no other way of
 * getting current theme parameters.
 */
export function useThemeFromLocation(): ThemeParams {
  return useMemo(extractThemeFromLocation, []);
}