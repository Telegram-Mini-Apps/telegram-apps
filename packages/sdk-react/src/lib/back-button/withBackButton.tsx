import React, {ComponentType} from 'react';
import {BackButton} from 'twa-sdk';

import {useBackButton} from './useBackButton';

/**
 * HOC which passes BackButton SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withBackButton<P extends {backButton?: BackButton}>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'backButton'>> {
  return function WithBackButton(props: Omit<P, 'backButton'>) {
    const p = {...props, backButton: useBackButton()} as P;

    return <Component {...p}/>;
  };
}
