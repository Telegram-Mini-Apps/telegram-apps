import React, {
  memo,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { init, type InitOptions } from '@tma.js/sdk';

import { sdkContext } from './context.js';
import type { SDKComponents, SDKContext } from './types.js';

export type SDKInitOptions = InitOptions;

export type SDKProviderProps = PropsWithChildren<{ initOptions?: SDKInitOptions }>;

/**
 * Component which provides access to SDK components.
 */
export const SDKProvider = memo<SDKProviderProps>((props) => {
  const { children, initOptions } = props;
  const [didInit, setDidInit] = useState(false);
  const [error, setError] = useState<null | unknown>(null);
  const [components, setComponents] = useState<SDKComponents | null>(null);

  // Initialize SDK on DOM attach.
  useEffect(() => {
    // Update init status.
    setDidInit(true);

    // Init SDK.
    init(initOptions)
      .then(setComponents)
      .catch(setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo<SDKContext>(() => ({
    components,
    didInit,
    error,
  }), [didInit, components, error]);

  return <sdkContext.Provider value={context}>{children}</sdkContext.Provider>;
});

SDKProvider.displayName = 'SDKProvider';
