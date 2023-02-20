import React, {ComponentType, useMemo} from 'react';
import {LaunchParams, retrieveLaunchParams} from '@twa.js/sdk';

/**
 * The hook which returns launch parameters initially passed to Web App.
 */
export function useLaunchParams(): LaunchParams {
  return useMemo(retrieveLaunchParams, []);
}

/**
 * HOC which passes launch parameters to wrapped React component.
 * @param Component - component to wrap.
 */
export function withLaunchParams<P extends { launchParams?: LaunchParams }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'launchParams'>> {
  return function WithLaunchParams(props: Omit<P, 'launchParams'>) {
    const p = {...props, launchParams: useLaunchParams()} as P;

    return <Component {...p}/>;
  };
}

export {LaunchParams};