import { createMemo, type Accessor } from 'solid-js';

import { useSDKContext } from './hooks.js';
import { useInitResultValue } from './useInitResultValue.js';
import { useDynamicInitResultValue } from './useDynamicInitResultValue.js';
import type { SDKInitResultKey, SDKInitResultValue } from './types.js';

export type SDK = {
  [K in SDKInitResultKey]: Accessor<SDKInitResultValue<K>>
};

/**
 * Returns ready to use SDK components.
 */
export function useSDK(): SDK {
  const { initResult } = useSDKContext();

  const sdk = createMemo(() => {
    const result = initResult();

    if (result === null) {
      throw new Error('Unable to use SDK as it is not ready.');
    }
    return result;
  });

  return {
    backButton: useDynamicInitResultValue(sdk, 'backButton', ['isVisibleChanged']),
    closingBehavior: useDynamicInitResultValue(sdk, 'closingBehavior', ['isConfirmationNeededChanged']),
    cloudStorage: useInitResultValue(sdk, 'cloudStorage'),
    haptic: useInitResultValue(sdk, 'haptic'),
    initData: useInitResultValue(sdk, 'initData'),
    initDataRaw: useInitResultValue(sdk, 'initDataRaw'),
    mainButton: useDynamicInitResultValue(sdk, 'mainButton', [
      'backgroundColorChanged',
      'isVisibleChanged',
      'isProgressVisibleChanged',
      'isEnabledChanged',
      'textChanged',
      'textColorChanged',
    ]),
    popup: useDynamicInitResultValue(sdk, 'popup', ['isOpenedChanged']),
    postEvent: useInitResultValue(sdk, 'postEvent'),
    qrScanner: useDynamicInitResultValue(sdk, 'qrScanner', ['isOpenedChanged']),
    themeParams: useDynamicInitResultValue(sdk, 'themeParams', ['changed']),
    viewport: useDynamicInitResultValue(sdk, 'viewport', [
      'heightChanged',
      'isExpandedChanged',
      'stableHeightChanged',
      'widthChanged',
    ]),
    webApp: useDynamicInitResultValue(sdk, 'webApp', ['backgroundColorChanged', 'headerColorChanged']),
  };
}