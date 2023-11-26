import { init } from '@tma.js/sdk';
import React, { useEffect, useMemo, useState } from 'react';

import { SDKContext } from './SDKContext.js';
import type { SDKContextType, SDKProviderProps } from './types.js';
import type { InitResult } from '../types.js';

function AsyncProvider({ options, children }: SDKProviderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | undefined>();
  const [initResult, setInitResult] = useState<InitResult | undefined>();

  useEffect(() => {
    setLoading(true);

    init({ ...options, async: true })
      .then(setInitResult)
      .catch(setError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo<SDKContextType>(() => {
    const result: SDKContextType = { loading };
    if (error) {
      result.error = error;
    }

    if (initResult) {
      result.initResult = initResult;
    }

    return result;
  }, [loading, initResult, error]);

  return <SDKContext.Provider value={context}>{children}</SDKContext.Provider>;
}

function SyncProvider({ options = {}, children }: SDKProviderProps) {
  const context = useMemo<SDKContextType>(() => {
    const result: SDKContextType = { loading: false };

    try {
      result.initResult = init({ ...options, async: false });
    } catch (e) {
      result.error = e;
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SDKContext.Provider value={context}>{children}</SDKContext.Provider>;
}

/**
 * Component which provides access to SDK initialization state.
 */
export function SDKProvider(props: SDKProviderProps) {
  // eslint-disable-next-line react/destructuring-assignment
  return props.options?.async
    ? <AsyncProvider {...props} />
    : <SyncProvider {...props} />;
}
