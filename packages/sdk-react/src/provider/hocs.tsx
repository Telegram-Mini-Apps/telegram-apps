import React, { type ComponentType } from 'react';

import type { SDKContext } from './types.js';
import { useSDK } from './hooks.js';

/**
 * HOC which passes SDK context to wrapped React component.
 * @param Component - component to wrap.
 */
export function withSDK<P extends { sdk?: SDKContext }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'sdk'>> {
  return function WithLaunchParams(props: Omit<P, 'sdk'>) {
    const p = { ...props, sdk: useSDK() } as P;

    return <Component {...p} />;
  };
}
