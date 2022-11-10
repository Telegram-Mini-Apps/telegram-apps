import React, {
  memo,
  PropsWithChildren, useEffect,
  useMemo,
  useState,
} from 'react';
import {init} from 'twa-sdk';
import {sdkContext} from './context';
import {SDKComponents, SDKContext} from './types';

export type SDKProviderProps = PropsWithChildren<{
  debug?: boolean;
}>;

const {Provider} = sdkContext;

/**
 * Component which provides access to SDK components.
 */
export const SDKProvider = memo<SDKProviderProps>(props => {
  const {children, debug} = props;
  const [didInit, setDidInit] = useState(false);
  const [components, setComponents] = useState<SDKComponents | null>(null);

  // Initialize SDK on DOM attach.
  useEffect(() => {
    // Update init status.
    setDidInit(true);

    // Init SDK.
    init(debug)
      .then(setComponents)
      .catch(e => console.error('Unable to initialize SDK:', e));
  }, []);

  const context = useMemo<SDKContext>(() => ({
    components,
    didInit,
  }), [didInit, components]);

  return <Provider value={context}>{children}</Provider>;
});

SDKProvider.displayName = 'SDKProvider';