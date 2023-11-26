---
outline: [2, 3]
---

# @tma.js/sdk-react

[npm-link]: https://npmjs.com/package/@tma.js/sdk-react

[npm-shield]: https://img.shields.io/npm/v/@tma.js/sdk-react?logo=npm

![[npm-link]][npm-shield]

React JS bindings for [client SDK](tma-js-sdk/about.md). Includes hooks, components and utilities
for comfortable usage of React JS on the Telegram Mini Apps platform.

## Installation

Before anything else, it is assumed that you have already installed the `react` package, as it is a
peer dependency of this package.

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

## Initialization

`SDKProvider` is a component responsible for providing the SDK functionality. Internally, it
utilizes the `init` function from [@tma.js/sdk](tma-js-sdk/about.md). It accepts an optional list of
parameters through the [options](tma-js-sdk/init.md#options) property.

```jsx
import { SDKProvider, type InitOptions } from '@tma.js/sdk-react';

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

SDK initialization is considered asynchronous in case the `async` init option equals `true`. In this
case, `SDKProvider` will start initialization using the React `useEffect` hook. This mode is useful
in case the developer is using Server-Side Rendering or when the valid state of all components is
required.

Nevertheless, as long as this process is asynchronous, developers should be careful when calling
package-specific component hooks, such as `useBackButton`, `useMainButton`, etc. When the SDK is not
yet initialized, these hooks will throw an error as long as they will be unable to retrieve
the component from the SDK.

```jsx
import {
  SDKProvider,
  useMainButton,
  type SDKInitOptions,
} from '@tma.js/sdk-react';

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
      <App/>
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
import { SDKProvider, useMainButton } from '@tma.js/sdk-react';

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

## Getting SDK context

Retrieving the SDK context is important in asynchronous mode to prevent the application from
crashing. To get the current SDK context, it is required to use the `useSDKContext` hook or
the `withSDKContext` higher-order component.

```jsx
import {
  SDKProvider,
  useSDKContext,
  withSDKContext,
  type SDKContextType,
} from '@tma.js/sdk-react';

function App() {
  const sdk = useSDKContext();
  // Here, we can use SDK information.
  return <div>My application!</div>;
}

// or
const AppWrapped = withSDK(({ sdk }) => {
  // Here, we can use SDK information.
  return <div>My application!</div>;
});

function Root() {
  return (
    <SDKProvider>
      <App/>
      <AppWrapped/>
    </SDKProvider>
  );
}
```

Let's enhance the previous example and introduce crucial logic associated with the SDK lifecycle:

```jsx
import { useEffect, type PropsWithChildren } from 'react';
import {
  SDKProvider,
  useSDKContext,
  useBackButton,
  useMiniApp,
} from '@tma.js/sdk-react';

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
  useEffect(() => {
    backButton.show();
    return backButton.on('click', () => miniApp.close());
  }, []);

  return <div>My application!</div>;
}

/**
 * This component is the layer controlling the application display.
 * It displays application in case, the SDK is initialized, displays an error
 * if something went wrong, and a loader if the SDK is warming up.
 */
function Loader({ children }: PropsWithChildren) {
  const { loading, initResult, error } = useSDKContext();

  // Each value is falsy. It means, init function was not called.
  if (!loading && !error && !initResult) {
    return <div>SDK init function is not yet called.</div>;
  }

  // Error occurred during SDK init.
  if (error) {
    return <div>Something went wrong.</div>;
  }

  // SDK is currently initializing.
  if (loading) {
    return <div>Warming up SDK.</div>;
  }

  // Safely render application.
  return <>{children}</>;
}

/**
 * Root component of the whole project.
 */
export function Root() {
  return (
    <SDKProvider options={{ async: true }}>
      <Loader>
        <App/>
      </Loader>
    </SDKProvider>
  );
}
```

You might wonder why we need a component like `Loader`. The reason is that the SDK initialization
process can be asynchronous. Some of its components need to send requests to the Telegram
application to fetch their current state. Due to this, we cannot determine the required properties
for these components until the initialization is completed.

As a result, all hooks that return component instances will throw an error because they cannot
retrieve the necessary component from the `initResult` property. Therefore, these hooks should not
be called until the SDK is fully initialized.

### When init is done

Once the initialization is successfully completed, developers should call the `miniApp.ready()`
method. It notifies the Telegram application that the current Mini App is ready to be
displayed.

```jsx
import { useEffect } from 'react';
import { useMiniApp } from '@tma.js/sdk-react';

function App() {
  const miniApp = useMiniApp();

  useEffect(() => {
    miniApp.ready();
  }, []);

  return <div>Here is my App</div>;
}
```

## Hooks and HOCs

### Launch parameters

There may be cases where a developer needs to retrieve launch parameters without initializing the
entire SDK. For example, they might want to access current theme parameters stored
in `window.location`. In such cases, SDK initialization may not be necessary.

To retrieve Mini App launch parameters, the `useLaunchParams` hook (or the `withLaunchParams`
higher-order component) can be used.

```jsx
import {
  useLaunchParams,
  withLaunchParams,
  type LaunchParams,
} from '@tma.js/sdk-react';

function DisplayLaunchParams() {
  const launchParams = useLaunchParams();
  return <pre><code>{JSON.stringify(launchParams, null, ' ')}</code></pre>;
}

// or

const DisplayLaunchParamsWrapped = withLaunchParams(({ launchParams }) => {
  return <pre><code>{JSON.stringify(launchParams, null, ' ')}</code></pre>;
});
```

### Init result related

The library provides a collection of simple hooks and higher-order components (HOCs) for each init
result value. Here is the list of following hooks and corresponding higher-order components:

- `useBackButton`, `withBackButton`. Returns the [BackButton](tma-js-sdk/components/back-button.md)
  component
- `useClosingBehavior`, `withClosingBehavior`. Returns
  the [ClosingBehavior](tma-js-sdk/components/closing-behavior.md) component
- `useCloudStorage`, `withCloudStorage`. Returns
  the [CloudStorage](tma-js-sdk/components/cloud-storage.md) component
- `useHapticFeedback`, `withHapticFeedback`. Returns
  the [HapticFeedback](tma-js-sdk/components/haptic-feedback.md) component
- `useInitData`, `withInitData`. Returns
  the [InitData](tma-js-sdk/components/init-data.md) component
- `useInitDataRaw`, `withInitDataraw`. Returns init data raw representation
- `useInvoice`, `withInvoice`. Returns
  the [Invoice](tma-js-sdk/components/invoice.md) component
- `useMainButton`, `withMainButton`. Returns
  the [MainButton](tma-js-sdk/components/main-button.md) component
- `useMiniApp`, `withMiniApp`. Returns
  the [MiniApp](tma-js-sdk/components/mini-app.md) component
- `usePopup`, `withPopup`. Returns
  the [Popup](tma-js-sdk/components/popup.md) component
- `usePostEvent`, `withPostEvent`. Returns the `postEvent` function to call Telegram Mini Apps
  methods
- `useQRScanner`, `withQRScanner`. Returns
  the [QRScanner](tma-js-sdk/components/qr-scanner.md) component
- `useThemeParams`, `withThemeParams`. Returns
  the [ThemeParams](tma-js-sdk/components/theme-params.md) component
- `useUtils`, `withUtils`. Returns
  the [Utils](tma-js-sdk/components/utils.md) component
- `useViewport`, `withViewport`. Returns
  the [Viewport](tma-js-sdk/components/viewport.md) component

::: tip

Each of these hooks and higher-order components returns SDK components that are automatically
updated if some of their properties change. As a result, the hook or HOC will return a new instance
of the component.

:::

::: danger

Using these hooks and higher-order components with an uninitialized SDK will result in throwing a
corresponding error.

:::