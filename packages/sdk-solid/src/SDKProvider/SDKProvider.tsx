import { initWeb, isIframe } from '@tma.js/sdk';
import { type Component, createEffect, onCleanup } from 'solid-js';

import { SDKContext } from './SDKContext.js';
import type { SDKProviderProps } from './SDKProvider.types.js';

/**
 * Provides access to SDK components and initializes some event listeners for the web version
 * of Telegram.
 */
export const SDKProvider: Component<SDKProviderProps> = (props) => {
  createEffect(() => {
    if (isIframe()) {
      onCleanup(initWeb(props.acceptCustomStyles));
    }
  });

  return <SDKContext.Provider value={new Map()}>{props.children}</SDKContext.Provider>;
};
