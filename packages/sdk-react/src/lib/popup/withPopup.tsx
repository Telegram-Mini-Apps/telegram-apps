import React, { type ComponentType } from 'react';

import { usePopup } from './usePopup.js';
import type { Popup } from './types.js';

/**
 * HOC which passes Popup SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withPopup<P extends { popup?: Popup }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'popup'>> {
  return function WithPopup(props: Omit<P, 'popup'>) {
    const p = { ...props, popup: usePopup() } as P;

    return <Component {...p} />;
  };
}
