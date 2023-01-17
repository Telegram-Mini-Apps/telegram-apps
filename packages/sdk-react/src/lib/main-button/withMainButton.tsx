import React, {ComponentType} from 'react';
import {MainButton} from '@twa.js/sdk';

import {useMainButton} from './useMainButton';

/**
 * HOC which passes MainButton SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withMainButton<P extends {mainButton?: MainButton}>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'mainButton'>> {
  return function WithMainButton(props: Omit<P, 'mainButton'>) {
    const p = {...props, mainButton: useMainButton()} as P;

    return <Component {...p}/>;
  };
}
