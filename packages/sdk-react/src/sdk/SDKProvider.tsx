import React, {
  memo,
  PropsWithChildren, useEffect,
  useMemo,
  useState,
} from 'react';
import {init, InitOptions} from '@twa.js/sdk';

import {sdkContext} from './context';
import {SDKComponents, SDKContext} from './types';

export type SDKProviderProps = PropsWithChildren<{ initOptions?: InitOptions }>;

/**
 * Component which provides access to SDK components.
 */
export const SDKProvider = memo<SDKProviderProps>(props => {
  const {children, initOptions} = props;
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
  }, []);

  const context = useMemo<SDKContext>(() => ({
    components,
    didInit,
    error,
  }), [didInit, components, error]);

  return <sdkContext.Provider value={context}>{children}</sdkContext.Provider>;
});

SDKProvider.displayName = 'SDKProvider';