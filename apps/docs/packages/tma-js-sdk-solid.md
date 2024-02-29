---
outline: [2, 3]
---

# @tma.js/sdk-solid

<p style="display: inline-flex; gap: 8px">
  <a href="https://npmjs.com/package/@tma.js/sdk-solid">
    <img src="https://img.shields.io/npm/v/@tma.js/sdk-solid?logo=npm"/>
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/@tma.js/sdk-solid"/>
  <a href="https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/sdk-solid">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

Solid JS bindings for [client SDK](tma-js-sdk.md). Includes hooks, components and utilities
for comfortable usage of Solid JS on the Telegram Mini Apps platform.

## Installation

Before anything else, it is assumed that you have already installed the `solid-js` package, as it is
a peer dependency of this package.

::: code-group

```bash [pnpm]
pnpm i @tma.js/sdk-solid
```

```bash [npm]
npm i @tma.js/sdk-solid
```

```bash [yarn]
yarn add @tma.js/sdk-solid
```

:::

## Initialization

`SDKProvider` is a component responsible for providing the SDK functionality. Internally, it
utilizes the `init` function from [@tma.js/sdk](tma-js-sdk.md). It accepts an optional list of
parameters through the [options](tma-js-sdk/init.md#options) property.

```jsx
import { SDKProvider, type InitOptions } from '@tma.js/sdk-solid';

/**
 * Root component for the whole project.
 */
export function Root() {
  const options: InitOptions = {
    acceptCustomStyles: true,
    cssVars: true,
  };

  return (
    <SDKProvider options={options}>
      <div>My application!</div>
    </SDKProvider>
  );
}
```

### Asynchronous

SDK initialization is considered asynchronous in case the `async` init option equals `true`.
This mode is useful in case the developer is using Server-Side Rendering or when the valid state of
all components is required.

Nevertheless, as long as this process is asynchronous, developers should be careful when calling
package-specific component hooks, such as `useBackButton`, `useMainButton`, etc. When the SDK is not
yet initialized, these hooks will throw an error as long as they will be unable to retrieve
the component from the SDK.

```jsx
import {
  SDKProvider,
  DisplayGate,
  useMainButton,
} from '@tma.js/sdk-solid';

function App() {
  const mainButton = useMainButton();
  // We will get an error here as long as SDK is not yet initialized.
  // The solution will be provided further.
  return <div>My application!</div>;
}

/**
 * Root component for the whole project.
 */
export function Root() {
  return (
    <SDKProvider options={{ async: true }}>
      <DisplayGate>
        <App/>
      </DisplayGate>
    </SDKProvider>
  );
}
```

You might wonder why we need a component like `DisplayGate`. The reason is that the SDK
initialization process can be asynchronous. Some of its components need to send requests to the
Telegram application to fetch their current state. Due to this, we cannot determine the required
properties for these components until the initialization is completed.

As a result, all hooks that return component instances will throw an error because they cannot
retrieve the necessary component from the SDK initialization result. Therefore, these hooks should
not be called until the SDK is fully initialized.

`DisplayGate` is the built-in component which encapsulates logic related to application display.
It provides 3 optional properties, such as `initial`, `error` and `loading`. Each of them could
either be a `JSX.Element` or Solid component accepting no properties.

`error` property is allowed to accept Solid component, which accepts property `error: unknown`.
Here is the complete example:

```jsx
import { createMemo, createEffect } from 'solid-js';
import {
  SDKProvider,
  DisplayGate,
  useBackButton,
  useMiniApp,
} from '@tma.js/sdk-solid';

/**
 * Part of the application which doesn't know anything about SDK
 * initialization and which should be rendered only in case, SDK is already
 * initialized and could provide init result.
 */
function App() {
  const backButton = useBackButton();
  const miniApp = useMiniApp();

  // When App is attached to DOM, lets show back button and
  // add "click" event handler, which should close current application.
  // When component will unmount, listener will be removed.
  createEffect(() => {
    const bb = backButton();
    const ma = miniApp();

    bb().show();
    return bb().on('click', () => ma.close());
  });

  return <div>My application!</div>;
}

interface SDKProviderErrorProps {
  error: unknown;
}

function SDKProviderError(props: SDKProviderErrorProps) {
  const message = () => {
    return props.error instanceof Error
      ? props.error.message
      : JSON.stringify(props.error);
  }

  return (
    <div>
      Oops. Something went wrong.
      <blockquote>
        <code>
          {message()}
        </code>
      </blockquote>
    </div>
  );
}

function SDKProviderLoading() {
  return <div>SDK is loading.</div>;
}

function SDKInitialState() {
  return <div>Waiting for initialization to start.</div>;
}

/**
 * Root component of the whole project.
 */
export function Root() {
  return (
    <SDKProvider options={{ async: true }}>
      <DisplayGate
        error={SDKProviderError}
        loading={SDKProviderLoading}
        initial={SDKInitialState}
      >
        <App/>
      </DisplayGate>
    </SDKProvider>
  );
}
```

### Synchronous

SDK initialization is considered synchronous in case the `async` init option is omitted or
equals `false`. In this case, `SDKProvider` will call the `init` function on the first render
(before the mount). This simplifies the application structure and allows avoiding the
definition of intermediate components.

```jsx
import { SDKProvider, useMainButton } from '@tma.js/sdk-solid';

function App() {
  const mainButton = useMainButton();
  // There will be no error here as long as initialization is synchronous
  // and at this moment SDK is already initialized.
  return <div>My application!</div>;
}

/**
 * Root component for the whole project.
 */
export function Root() {
  return (
    <SDKProvider>
      <App/>
    </SDKProvider>
  );
}
```

::: info

The default initialization accepted by the package is synchronous.

:::

## Hooks

### Launch Parameters

There may be cases where a developer needs to retrieve launch parameters without initializing the
entire SDK. For example, they might want to access current theme parameters stored
in `window.location`. In such cases, SDK initialization may not be necessary.

To retrieve Mini App launch parameters, the `useLaunchParams` hook can be used.

```jsx
import { useLaunchParams, type LaunchParams } from '@tma.js/sdk-solid';

function DisplayLaunchParams() {
  const launchParams = useLaunchParams();
  return <pre><code>{JSON.stringify(launchParams, null, ' ')}</code></pre>;
}
```

### Init Result Related

The library provides a collection of simple hooks and higher-order components (HOCs) for each init
result value. Here is the list of following hooks and corresponding higher-order components:

- `useBackButton`. Returns the [BackButton](tma-js-sdk/components/back-button.md) component accessor
- `useClosingBehavior`. Returns the [ClosingBehavior](tma-js-sdk/components/closing-behavior.md)
  component accessor
- `useCloudStorage`. Returns the [CloudStorage](tma-js-sdk/components/cloud-storage.md) component
  accessor
- `useHapticFeedback`. Returns the [HapticFeedback](tma-js-sdk/components/haptic-feedback.md)
  component accessor
- `useInitData`. Returns the [InitData](tma-js-sdk/components/init-data.md) component accessor
- `useInitDataRaw`. Returns init data raw representation accessor
- `useInvoice`. Returns the [Invoice](tma-js-sdk/components/invoice.md) component accessor
- `useMainButton`. Returns the [MainButton](tma-js-sdk/components/main-button.md) component accessor
- `useMiniApp`. Returns the [MiniApp](tma-js-sdk/components/mini-app.md) component accessor
- `usePopup`. Returns the [Popup](tma-js-sdk/components/popup.md) component accessor
- `usePostEvent`. Returns the `postEvent` function accessor to call Telegram Mini Apps methods
- `useQRScanner`. Returns the [QRScanner](tma-js-sdk/components/qr-scanner.md) component accessor
- `useSettingsButton`. Returns the [SettingsButton](tma-js-sdk/components/settings-button.md)
  component accessor
- `useThemeParams`. Returns the [ThemeParams](tma-js-sdk/components/theme-params.md) component
  accessor
- `useUtils`. Returns the [Utils](tma-js-sdk/components/utils.md) component accessor
- `useViewport`. Returns the [Viewport](tma-js-sdk/components/viewport.md) component accessor

::: tip

Each of these hooks returns SDK components signals which are automatically triggered if some of
their properties change.

:::

::: danger

Using these hooks with an uninitialized SDK will result in throwing a corresponding error.

:::

## Template

We have already created a [template](https://github.com/Telegram-Mini-Apps/solidjs-template) for
Solid JS that utilizes the current package, so you can use it.