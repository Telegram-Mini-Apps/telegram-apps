import React, { type ComponentType } from 'react';

import type { CloudStorage } from '@tma.js/sdk';

import { useUnit } from '../provider/index.js';

/**
 * Returns CloudStorage component instance.
 */
export function useCloudStorage(): CloudStorage {
  return useUnit('cloudStorage');
}

/**
 * HOC which passes CloudStorage SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withCloudStorage<P extends { cloudStorage?: CloudStorage }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'cloudStorage'>> {
  return function WithCloudStorage(props: Omit<P, 'cloudStorage'>) {
    const p = { ...props, cloudStorage: useCloudStorage() } as P;

    return <Component {...p} />;
  };
}

export type { CloudStorage };
