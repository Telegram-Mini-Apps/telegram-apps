import React, { type ComponentType } from 'react';

import { useLaunchParams } from './useLaunchParams.js';
import type { LaunchParams } from './types.js';

/**
 * HOC which passes launch parameters to wrapped React component.
 * @param Component - component to wrap.
 */
export function withLaunchParams<P extends { launchParams?: LaunchParams }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'launchParams'>> {
  return function WithLaunchParams(props: Omit<P, 'launchParams'>) {
    const p = { ...props, launchParams: useLaunchParams() } as P;

    return <Component {...p} />;
  };
}
