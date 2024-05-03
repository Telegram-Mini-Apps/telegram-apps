import { TonConnectUI, type TonConnectUiOptions } from '@tonconnect/ui';
import { createMemo, type Component, type ParentProps } from 'solid-js';

import { TonConnectUIContext } from '@/tonconnect/TonConnectUIContext.js';

export interface TonConnectUIProviderProps extends ParentProps {
  manifestUrl: string;
}

// FIXME: Well, we found this code in the official tonconnect implementation for React. Doesn't
//  seem to work the other way due to **constructor side effects**. Sad.
//  https://github.com/ton-connect/sdk/blob/main/packages/ui-react/src/components/TonConnectUIProvider.tsx#L75
let cached: TonConnectUI | undefined;

export const TonConnectUIProvider: Component<TonConnectUIProviderProps> = (props) => {
  const tonConnectUI = createMemo(() => {
    return cached || (cached = new TonConnectUI({
      manifestUrl: props.manifestUrl,
    }));
  });

  return (
    <TonConnectUIContext.Provider
      value={[
        tonConnectUI,
        {
          setUIOptions(options: TonConnectUiOptions) {
            tonConnectUI().uiOptions = options;
          },
        },
      ]}
    >
      {props.children}
    </TonConnectUIContext.Provider>
  );
};
