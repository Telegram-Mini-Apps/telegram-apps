import React, {ComponentType} from 'react';
import {ThemeParams} from 'twa-sdk';

import {useThemeParams} from './useThemeParams';

/**
 * HOC which passes ThemeParams SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withThemeParams<P extends {themeParams?: ThemeParams}>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'themeParams'>> {
  return function WithThemeParams(props: Omit<P, 'themeParams'>) {
    const p = {...props, themeParams: useThemeParams()} as P;

    return <Component {...p}/>;
  };
}
