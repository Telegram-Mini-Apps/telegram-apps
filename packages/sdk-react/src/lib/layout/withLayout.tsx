import React, {ComponentType} from 'react';
import {Layout} from 'twa-sdk';

import {useLayout} from './useLayout';

/**
 * HOC which passes Layout SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withLayout<P extends {layout?: Layout}>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'layout'>> {
  return function WithLayout(props: Omit<P, 'layout'>) {
    const p = {...props, layout: useLayout()} as P;

    return <Component {...p}/>;
  };
}
