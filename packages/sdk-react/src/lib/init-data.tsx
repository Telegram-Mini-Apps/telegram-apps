import React, { type ComponentType } from 'react';
import type { InitData } from '@tma.js/sdk';

import { useUnit } from '../provider/index.js';

interface EnhancedProps {
  initData: InitData | null;
  initDataRaw: string | null;
}

/**
 * Returns InitData component instance.
 */
export function useInitData(): InitData | null {
  return useUnit('initData') || null;
}

/**
 * Returns init data raw representation.
 */
export function useInitDataRaw(): string | null {
  return useUnit('initDataRaw') || null;
}

/**
 * HOC which passes InitData SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withInitData<P extends Partial<EnhancedProps>>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, keyof EnhancedProps>> {
  return function WithInitData(props) {
    const enhancedProps = {
      ...props,
      initData: useInitData(),
      initDataRaw: useInitDataRaw(),
    } as P;

    return <Component {...enhancedProps} />;
  };
}

export { InitData };
