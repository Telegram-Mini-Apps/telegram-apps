import { type Accessor, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';

import type { SDKInitResult, SDKInitResultKey, SDKInitResultValue } from './types.js';
import { useSDKContext } from './hooks.js';

interface Trackable {
  on: (event: any, ...args: any[]) => void;
  off: (event: any, ...args: any[]) => void;
}

type EventName<T extends Trackable> = T extends {
  on(event: infer E, ...args: any[]): any
} ? E : never;

type DynamicComponentKey = {
  [K in SDKInitResultKey]: SDKInitResultValue<K> extends Trackable
    ? K
    : never;
}[SDKInitResultKey];

export type SDK = {
  [K in SDKInitResultKey]: Accessor<SDKInitResultValue<K>>
};

function useDynamicComponent<K extends DynamicComponentKey>(
  initResult: Accessor<SDKInitResult>,
  key: K,
  events: EventName<SDKInitResultValue<K>>[],
): Accessor<SDKInitResultValue<K>> {
  const [component, setComponent] = createSignal(initResult()[key], { equals: false });

  createEffect(() => {
    const obj = component();

    events.forEach(event => {
      (obj as any).on(event, () => setComponent(() => obj));
    });

    onCleanup(() => {
      events.forEach(event => {
        (obj as any).off(event, () => setComponent(() => obj));
      });
    });
  });

  return component;
}

function useInitResultValue<K extends SDKInitResultKey>(initResult: Accessor<SDKInitResult>, key: K) {
  const value = createMemo<SDKInitResultValue<K>>(() => initResult()[key]);

  return value;
}

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
    backButton: useDynamicComponent(sdk, 'backButton', ['isVisibleChanged']),
    closingBehavior: useDynamicComponent(sdk, 'closingBehavior', ['isConfirmationNeededChanged']),
    haptic: useInitResultValue(sdk, 'haptic'),
    initData: useInitResultValue(sdk, 'initData'),
    initDataRaw: useInitResultValue(sdk, 'initDataRaw'),
    mainButton: useDynamicComponent(sdk, 'mainButton', [
      'backgroundColorChanged',
      'isVisibleChanged',
      'isProgressVisibleChanged',
      'isEnabledChanged',
      'textChanged',
      'textColorChanged',
    ]),
    popup: useDynamicComponent(sdk, 'popup', ['isOpenedChanged']),
    postEvent: useInitResultValue(sdk, 'postEvent'),
    qrScanner: useDynamicComponent(sdk, 'qrScanner', ['isOpenedChanged']),
    themeParams: useDynamicComponent(sdk, 'themeParams', ['changed']),
    viewport: useDynamicComponent(sdk, 'viewport', [
      'heightChanged',
      'isExpandedChanged',
      'stableHeightChanged',
      'widthChanged',
    ]),
    webApp: useDynamicComponent(sdk, 'webApp', ['backgroundColorChanged', 'headerColorChanged']),
  };
}