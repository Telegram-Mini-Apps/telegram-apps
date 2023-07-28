import React, { type ComponentType } from 'react';

import { useClosingBehaviour } from './useClosingBehaviour.js';
import type { ClosingBehaviour } from './types.js';

/**
 * HOC which passes ClosingBehaviour SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withClosingBehaviour<P extends { closingBehaviour?: ClosingBehaviour }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'closingBehaviour'>> {
  return function WithClosingConfirmation(props: Omit<P, 'closingBehaviour'>) {
    const p = { ...props, closingBehaviour: useClosingBehaviour() } as P;

    return <Component {...p} />;
  };
}
