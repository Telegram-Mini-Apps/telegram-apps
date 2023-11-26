import { type LaunchParams, retrieveLaunchData } from '@tma.js/sdk';
import React, { type ComponentType, useMemo } from 'react';

/**
 * Hooks to retrieve launch parameters.
 */
export function useLaunchParams(): LaunchParams {
  return useMemo(() => retrieveLaunchData().launchParams, []);
}

/**
 * HOC to wrap specified component to pass launch parameters.
 * @param Component - wrapped component.
 */
export function withLaunchParams<P extends { launchParams?: LaunchParams }>(
  Component: ComponentType<P>,
) {
  return function WithInvoice(props: P) {
    return <Component {...props} launchParams={useLaunchParams()} />;
  };
}
