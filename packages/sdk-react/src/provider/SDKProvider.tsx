import {
  init,
  type InitResult,
} from '@tma.js/sdk';
import React, { useEffect, useMemo, useState } from 'react';

import { SDKContext } from './SDKContext.js';
import type {
  SDKContextType,
  SDKInitResult,
  SDKProviderProps,
} from './types.js';

function AsyncProvider({ options, children }: SDKProviderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | unknown>(null);
  const [initResult, setInitResult] = useState<SDKInitResult | null>(null);

  useEffect(() => {
    setLoading(true);

    init({ ...options, async: true })
      .then(setInitResult)
      .catch(setError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo<SDKContextType>(() => ({
    error,
    initResult,
    loading,
  }), [loading, initResult, error]);

  return <SDKContext.Provider value={context}>{children}</SDKContext.Provider>;
}

function SyncProvider({ options = {}, children }: SDKProviderProps) {
  const context = useMemo<SDKContextType>(() => {
    let initResult: InitResult | null = null;
    let error: unknown;

    try {
      initResult = init({ ...options, async: false });
    } catch (e) {
      error = e;
    }

    return {
      error,
      initResult,
      loading: true,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SDKContext.Provider value={context}>{children}</SDKContext.Provider>;
}

/**
 * Component which provides access to SDK initialization state.
 */
export function SDKProvider(props: SDKProviderProps) {
  return props.options?.async
    ? <AsyncProvider {...props}/>
    : <SyncProvider {...props}/>;
}
