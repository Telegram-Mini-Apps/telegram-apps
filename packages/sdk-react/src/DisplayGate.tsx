import React, { type ComponentType, type PropsWithChildren, type ReactNode } from 'react';

import { useSDKContext } from './provider/index.js';

export interface DisplayGateProps extends PropsWithChildren {
  /**
   * Element or component, which will be displayed in case, SDK is not loading, didn't receive
   * any error during initialization as well as the initialization result.
   */
  initial?: ReactNode | ComponentType;

  /**
   * Element or component which will be displayed in case, SDK initialization failed.
   */
  error?: ReactNode | ComponentType<{ error: unknown }>;

  /**
   * Element or component which will be displayed in case, SDK is currently loading.
   */
  loading?: ReactNode | ComponentType;
}

function render(Component: ReactNode | ComponentType): ReactNode;
function render<T extends object>(Component: ReactNode | ComponentType<T>, props: T): ReactNode;
function render(Component: ReactNode | ComponentType, props = {}): ReactNode {
  return typeof Component === 'function' ? <Component {...props}/> : Component;
}

/**
 * This component is the layer controlling the application display. It displays application in
 * case, the SDK is initialized, displays an error if something went wrong, and a loader
 * if the SDK is warming up.
 */
export function DisplayGate(props: DisplayGateProps): ReactNode {
  const { loading, initResult, error } = useSDKContext();

  return initResult
    ? props.children
    : error
      ? render(props.error, { error })
      : render(loading ? props.loading : props.initial);
}