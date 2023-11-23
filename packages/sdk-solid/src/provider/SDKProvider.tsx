import { init } from '@tma.js/sdk';
import { createMemo, createResource } from 'solid-js';

import { SDKContext } from './SDKContext.js';
import type { SDKProviderProps } from './types.js';

export function SDKProvider(props: SDKProviderProps) {
  const options = createMemo(() => props.options || {});
  const [data] = createResource(options, init);

  const initResult = createMemo(() => (data.state === 'ready' ? data() : null));
  const loading = createMemo(() => data.loading);
  const error = createMemo(() => (data.error === undefined ? null : data.error));

  return (
    <SDKContext.Provider value={{ initResult, loading, error }}>
      {props.children}
    </SDKContext.Provider>
  );
}
