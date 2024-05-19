---
outline: [2, 3]
---

# @tma.js/sdk-react

<p style="display: inline-flex; gap: 8px">
  <a href="https://npmjs.com/package/@tma.js/sdk-react">
    <img src="https://img.shields.io/npm/v/@tma.js/sdk-react?logo=npm"/>
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/@tma.js/sdk-react"/>
  <a href="https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/sdk-react">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

React JS bindings for [client SDK](tma-js-sdk.md). Includes hooks, components and utilities
for comfortable usage of React JS on the Telegram Mini Apps platform.

## Installation

Before anything else, it is assumed that you have already installed the `react` package, as it is
a peer dependency of this package.

::: code-group

```bash [pnpm]
pnpm i @tma.js/sdk-react
```

```bash [npm]
npm i @tma.js/sdk-react
```

```bash [yarn]
yarn add @tma.js/sdk-react
```

:::

## SDKProvider

`SDKProvider` is a component responsible for providing the SDK functionality. It accepts
such properties as `acceptCustomStyles: boolean` and `debug: boolean`. Both of them are optional.

The `acceptCustomStyles` property is responsible for accepting custom styles from the web version of
Telegram.

The `debug` property is responsible for enabling a debug mode.

```jsx
import { SDKProvider } from '@tma.js/sdk-react';

/**
 * Root component for the whole project.
 */
export function Root() {
  return (
    <SDKProvider acceptCustomStyles debug>
      <div>My application!</div>
    </SDKProvider>
  );
}
```

## Hooks

For better understanding, each component hook uses its own component-related init function. If the
init function returns a non-promise value, the hook will instantly retrieve it. If the init function
is asynchronous, the hook will return an `undefined` value while the component is still
initializing. Then, it will be updated to the initialized value.

All component hooks in this package are divided into two parts:

1. Retrieving the actual init function value. These hooks are non-suffixed, like `useBackButton`.
2. Retrieving a meta item related to the init function value. These hooks include a suffix such
   as `Raw`, like `useBackButtonRaw`.

The first category of hooks returns the actual init function value. They throw an error if something
goes wrong during component initialization.

The second category of hooks returns an object containing the initialization process information.
Here is the object shape:

```ts
export interface SDKContextItem<T> {
  /**
   * This item execution result. The property may be missing
   * in case the execution is async.
   */
  result?: T;
  /**
   * Function to clean up item side effects.
   */
  cleanup?(): void;
  /**
   * An error occurred during execution.
   */
  error?: unknown;
}
```

Using the second category of hooks, you can extract an error without throwing it.

Here is the complete usage example:

```ts
import {
  useBackButton,
  useBackButtonRaw,
  useViewport,
  useViewportRaw,
  useBiometryManagerRaw,
} from '@tma.js/sdk-react';
import { useEffect } from 'react';

// BackButton initializes synchronously. So, bb will be 
// the BackButton instance.
const bb = useBackButton();

// Viewport is being initialized asynchronously, so signal may return undefined.
// After some time it will receive a valid value.
const vp = useViewport();

useEffect(() => {
  console.log(vp); // will be undefined and then Viewport instance.
}, [vp]);

const bm = useBiometryManagerRaw();

useEffect(() => {
  if (bm.error) {
    console.error('Something went wrong for BiometryManager', bm.error);
  }
}, [bm]);
```

## Hooks List

| Hook (Raw)              | Hook (Result)        | Returned value                                                              |
|-------------------------|----------------------|-----------------------------------------------------------------------------|
| `useBackButtonRaw`      | `useBackButton`      | [BackButton](tma-js-sdk/components/back-button.md)                          |
| `useBiometryManagerRaw` | `useBiometryManager` | [BiometryManager](tma-js-sdk/components/biometry-manager.md) or `undefined` |
| `useClosingBehaviorRaw` | `useClosingBehavior` | [ClosingBehavior](tma-js-sdk/components/closing-behavior.md)                |
| `useCloudStorageRaw`    | `useCloudStorage`    | [CloudStorage](tma-js-sdk/components/cloud-storage.md)                      |
| `useHapticFeedbackRaw`  | `useHapticFeedback`  | [HapticFeedback](tma-js-sdk/components/haptic-feedback.md)                  |
| `useInitDataRaw`        | `useInitData`        | [InitData](tma-js-sdk/components/init-data.md)                              |
| `useInvoiceRaw`         | `useInvoice`         | [Invoice](tma-js-sdk/components/invoice.md)                                 |
| `useMainButtonRaw`      | `useMainButton`      | [MainButton](tma-js-sdk/components/main-button.md)                          |
| `useMiniAppRaw`         | `useMiniApp`         | [MiniApp](tma-js-sdk/components/mini-app.md)                                |
| `usePopupRaw`           | `usePopup`           | [Popup](tma-js-sdk/components/popup.md)                                     |
| `useQRScannerRaw`       | `useQRScanner`       | [QRScanner](tma-js-sdk/components/qr-scanner.md)                            |
| `useSettingsButtonRaw`  | `useSettingsButton`  | [SettingsButton](tma-js-sdk/components/settings-button.md)                  |
| `useThemeParamsRaw`     | `useThemeParams`     | [ThemeParams](tma-js-sdk/components/theme-params.md)                        |
| `useUtilsRaw`           | `useUtils`           | [Utils](tma-js-sdk/components/utils.md)                                     |
| `useViewportRaw`        | `useViewport`        | [Viewport](tma-js-sdk/components/viewport.md) or `undefined`                |

## Template

We have already created a [template](https://github.com/Telegram-Mini-Apps/reactjs-template) for
React JS that utilizes the current package, so you can use it.