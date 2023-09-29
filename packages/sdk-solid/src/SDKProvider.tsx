import { createMemo, createResource, ParentProps } from 'solid-js';
import { init } from '@tma.js/sdk';

import { SDKContext } from './context.js';
import type { SDKInitOptions } from './types.js';

export type SDKProviderProps = ParentProps<{ initOptions?: SDKInitOptions }>;

export function SDKProvider(props: SDKProviderProps) {
  const initOptions = createMemo(() => props.initOptions || {});
  const [data] = createResource(initOptions, init);

  const initResult = createMemo(() => {
    return data.state === 'ready' ? data() : null;
  });
  const loading = createMemo(() => data.loading);
  const error = createMemo(() => data.error === undefined ? null : data.error);

  return (
    <SDKContext.Provider value={{ initResult, loading, error }}>
      {props.children}
    </SDKContext.Provider>
  );
}
