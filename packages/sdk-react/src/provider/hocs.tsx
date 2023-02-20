import React, {ComponentType} from 'react';
import {SDKContext} from './types';
import {useSDK} from './hooks';

/**
 * HOC which passes SDK context to wrapped React component.
 * @param Component - component to wrap.
 */
export function withSDK<P extends { sdk?: SDKContext }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'sdk'>> {
  return function WithLaunchParams(props: Omit<P, 'sdk'>) {
    const p = {...props, sdk: useSDK()} as P;

    return <Component {...p}/>;
  };
}