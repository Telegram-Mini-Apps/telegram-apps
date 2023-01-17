import React, {ComponentType} from 'react';
import {ClosingConfirmation} from '@twa.js/sdk';

import {useClosingConfirmation} from './useClosingConfirmation';

/**
 * HOC which passes ClosingConfirmation SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withClosingConfirmation<P extends { closingConfirmation?: ClosingConfirmation }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'closingConfirmation'>> {
  return function WithClosingConfirmation(props: Omit<P, 'closingConfirmation'>) {
    const p = {...props, closingConfirmation: useClosingConfirmation()} as P;

    return <Component {...p}/>;
  };
}
