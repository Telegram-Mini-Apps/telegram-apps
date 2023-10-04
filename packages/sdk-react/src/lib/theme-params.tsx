import React, { type ComponentType } from 'react';
import type { ThemeParams } from '@tma.js/sdk';

import { useUnit } from '../provider/index.js';
import { useEventsTracking } from './hooks.js';

/**
 * Returns ThemeParams component instance.
 */
export function useThemeParams(): ThemeParams {
  const theme = useUnit('themeParams');
  useEventsTracking(theme, ['changed']);

  return theme;
}

/**
 * HOC which passes ThemeParams SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withThemeParams<P extends { themeParams?: ThemeParams }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'themeParams'>> {
  return function WithThemeParams(props: Omit<P, 'themeParams'>) {
    const p = { ...props, themeParams: useThemeParams() } as P;

    return <Component {...p} />;
  };
}
