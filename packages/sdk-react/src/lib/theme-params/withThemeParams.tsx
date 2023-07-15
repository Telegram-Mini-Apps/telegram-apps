import React, { type ComponentType } from 'react';

import { useThemeParams } from './useThemeParams.js';
import type { ThemeParams } from './types.js';

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
