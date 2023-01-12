import React, {ComponentType} from 'react';
import {QRScanner} from 'twa-sdk';

import {useQRScanner} from './useQRScanner';

/**
 * HOC which passes QRScanner SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withQRScanner<P extends {qrScanner?: QRScanner}>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'qrScanner'>> {
  return function WithQRScanner(props: Omit<P, 'qrScanner'>) {
    const p = {...props, qrScanner: useQRScanner()} as P;

    return <Component {...p}/>;
  };
}
