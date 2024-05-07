import { initWeb, isIframe } from '@tma.js/sdk';
import { useEffect, useMemo, useState } from 'react';
import type { AnyFn } from '@tma.js/sdk';

import { SDKContext } from './SDKContext.js';
import type { SDKContextType, SDKProviderProps } from './SDKProvider.types.js';

/**
 * Provides access to SDK components and initializes some event listeners for the web version
 * of Telegram.
 */
export function SDKProvider({ children, acceptCustomStyles }: SDKProviderProps) {
  const [map, setMap] = useState(new Map<AnyFn, any>());
  const context = useMemo<SDKContextType>(() => ({
    get(fn) {
      return map.get(fn);
    },
    set(fn, value) {
      map.set(fn, value);
      setMap(new Map(map));
    },
    has(fn) {
      return map.has(fn);
    },
  }), [map]);

  useEffect(() => {
    if (isIframe()) {
      return initWeb(acceptCustomStyles);
    }
  }, [acceptCustomStyles]);

  return <SDKContext.Provider value={context}>{children}</SDKContext.Provider>;
}
