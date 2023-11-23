import React, { type ComponentType } from 'react';

import type { SDKInitResultKey, SDKInitResultValue } from './provider/index.js';
import { Hook } from './createHook.js';

type HOC<K extends SDKInitResultKey> =
  <P extends { [Key in K]?: SDKInitResultValue<Key> }>(
    Component: ComponentType<P>,
  ) => ComponentType<P>

export function createHoc<K extends SDKInitResultKey>(
  initResultKey: SDKInitResultKey,
  hook: Hook<K>,
): HOC<K> {
  return (Component: ComponentType<any>) => {
    function Wrapper(props: Record<string, unknown>) {
      const wrappedProps = {
        ...props,
        [initResultKey]: hook(),
      };

      return <Component {...wrappedProps} />;
    }

    Object.defineProperty(Wrapper, 'name', {
      value: initResultKey[0].toUpperCase() + initResultKey.slice(1),
    });

    return Wrapper;
  };
}