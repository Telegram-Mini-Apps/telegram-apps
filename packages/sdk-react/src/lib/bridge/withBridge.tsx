import React, { type ComponentType } from 'react';

import { useBridge } from './useBridge';
import type { Bridge } from './types';

/**
 * HOC which passes Bridge SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withBridge<P extends { bridge?: Bridge }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'bridge'>> {
  return function WithBridge(props: Omit<P, 'bridge'>) {
    const p = { ...props, bridge: useBridge() } as P;

    return <Component {...p} />;
  };
}
