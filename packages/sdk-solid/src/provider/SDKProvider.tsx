import { init } from '@tma.js/sdk';
import { createMemo, createResource } from 'solid-js';

import { SDKContext } from './SDKContext.js';
import type { SDKProviderProps } from './types.js';

export function SDKProvider(props: SDKProviderProps) {
  const [data] = createResource(() => props.options, init);

  const initResult = createMemo(() => {
    return data.state === 'ready' ? data() : undefined;
  });
  const loading = createMemo(() => data.loading);
  const error = createMemo(() => (data.error === undefined ? null : data.error));

  return (
    <SDKContext.Provider value={{ initResult, loading, error }}>
      {props.children}
    </SDKContext.Provider>
  );
}
