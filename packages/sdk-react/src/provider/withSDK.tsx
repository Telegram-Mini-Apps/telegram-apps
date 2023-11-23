import React, { type ComponentType } from 'react';

import type { SDKContextType } from './types.js';
import { useSDKContext } from './useSDKContext.js';

/**
 * HOC which passes SDK context to wrapped React component.
 * @param Component - component to wrap.
 */
export function withSDK<P extends { sdk?: SDKContextType }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'sdk'>> {
  return function WithSDK(props: Omit<P, 'sdk'>) {
    const p = {
      ...props,
      sdk: useSDKContext(),
    } as P;

    return <Component {...p} />;
  };
}
