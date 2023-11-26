import React, { type ComponentType } from 'react';

import type { InitResultKey, InitResultValue } from './types.js';
import type { Hook } from './createHook.js';

export type Hoc<K extends InitResultKey> = <P extends { [Key in K]?: InitResultValue<K> }>(
  Component: ComponentType<P>,
) => ComponentType<P>;

/**
 * Creates HOC for static init result value.
 * @param initResultKey - init result key.
 * @param hook - hook which returns init result value.
 */
export function createHoc<K extends InitResultKey>(initResultKey: K, hook: Hook<K>): Hoc<K> {
  return (Component: ComponentType<any>) => {
    function Wrapper(props: Record<string, unknown>) {
      const wrappedProps = {
        ...props,
        [initResultKey]: hook(),
      };

      return <Component {...wrappedProps} />;
    }

    Object.defineProperty(Wrapper, 'name', {
      value: `With${initResultKey[0].toUpperCase()}${initResultKey.slice(1)}`,
    });

    return Wrapper;
  };
}
