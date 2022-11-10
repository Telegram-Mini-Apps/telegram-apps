import React, {ComponentType} from 'react';
import {Bridge} from 'twa-bridge';
import {useBridge} from './useBridge';

/**
 * HOC which passes Bridge SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withBridge<P extends {bridge?: Bridge}>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'bridge'>> {
  return function WithBridge(props: Omit<P, 'bridge'>) {
    const p = {...props, bridge: useBridge()} as P;

    return <Component {...p}/>;
  };
}
