import { TonConnectUI } from '@tonconnect/ui';
import { createMemo } from 'solid-js';

import { TonConnectUIContext } from '@/tonconnect/TonConnectUIContext.js';

/**
 * @typedef TonConnectUIProviderProps
 * @property {import('solid-js').JSXElement} [children]
 * @property {String} manifestUrl
 */

/**
 * @param {TonConnectUIProviderProps} props
 * @constructor
 */
export function TonConnectUIProvider(props) {
  const tonConnectUI = createMemo(() => {
    return new TonConnectUI({
      manifestUrl: props.manifestUrl,
    });
  });

  return (
    <TonConnectUIContext.Provider
      value={[
        tonConnectUI,
        {
          setUIOptions(options) {
            tonConnectUI().uiOptions = options;
          },
        },
      ]}
    >
      {props.children}
    </TonConnectUIContext.Provider>
  );
}
