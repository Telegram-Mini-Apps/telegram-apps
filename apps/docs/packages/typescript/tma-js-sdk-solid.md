# @tma.js/sdk-solid

[npm-link]: https://npmjs.com/package/@tma.js/sdk-solid

[npm-shield]: https://img.shields.io/npm/v/@tma.js/sdk-solid?logo=npm

![[npm-link]][npm-shield]

Solid JS bindings for [client SDK](tma-js-sdk/about.md). Includes hooks, components and utilities
for comfortable usage of Solid JS on the Telegram Mini Apps platform.

## Installation

Before anything else, it is assumed that you have already installed the `solid-js` package, as it is
a peer dependency of this package. The installation of the SDK itself is not required, as it is
already included in `@tma.js/sdk-solid`.

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

## Usage

### SDKProvider

According to the `@tma.js/sdk` [documentation](tma-js-sdk/about.md), it consists of a set of
components that are not initialized by default. Developers are responsible for creating these
components themselves. However, the SDK provides the `init` function, which simplifies the process
of creating the components and using the standard TWA flow. It handles all the necessary steps for
developers.

To make the SDK functionality available to the application and allow the initialization of newly
created components, we need to use the `SDKProvider` component.

```jsx
import { SDKProvider } from '@tma.js/sdk-solid';

function Root() {
  return (
    <SDKProvider>
      <div>My application!</div>
    </SDKProvider>
  );
}
```

Internally, the `SDKProvider` utilizes the `init` function from `@tma.js/sdk`. It accepts an
optional list of parameters through the `initOptions` property, which is
described [here](tma-js-sdk/about.md#initialization).

```jsx
import { SDKProvider, SDKInitOptions } from '@tma.js/sdk-solid';

function Root() {
  const options: SDKInitOptions = {
    acceptScrollbarStyle: true,
    checkCompat: true,
    debug: true
  };

  return (
    <SDKProvider initOptions={options}>
      <div>My application!</div>
    </SDKProvider>
  );
}
```

Most of the time, there is no need to use `initOptions` unless you have specific logic in your
application. Typically, the SDK handles everything necessary for developers, so there is no need for
additional configuration.

### useSDKContext

By using the `SDKProvider` component, the child elements are able to utilize the `useSDK` hook to
access core SDK information.

```jsx
import { SDKProvider, useSDKContext } from '@tma.js/sdk-solid';

function App() {
  const sdk = useSDKContext();

  // Here we can use the SDK init information.

  return <div>My application!</div>;
}

function Root() {
  return (
    <SDKProvider>
      <App/>
    </SDKProvider>
  );
}
```

### useSDK

Hook `useSDK` is used to gain access to provided SDK components.

::: warning
`useSDK` will throw an error in case, SDK is not yet ready to be used. To avoid this problem
use `useSDKContext` to track the SDK init process.
:::

```jsx
import { createMemo, Switch, Match, ParentProps } from 'solid-js';
import { SDKProvider, useSDK, useSDKContext } from '@tma.js/sdk-solid';

function App() {
  const sdk = useSDK();

  // useSDK will not throw an error here as long as the App
  // component will only be displayed in case, SDK is ready
  // to be used.

  return <div>My application!</div>;
}

/**
 * Component responsible for controlling the process of application display.
 */
function DisplayGate(props: ParentProps) {
  const { loading, error } = useSDKContext();
  const errorMessage = createMemo < null | string > (() => {
    const err = error();

    if (!err) {
      return null;
    }

    return err instanceof Error ? err.message : 'Unknown error';
  });

  return (
    <Switch fallback={props.children}>
      <Match when={errorMessage()}>
        <p>
          SDK was unable to initialize. Probably, current application is being used
          not in Telegram Mini Apps environment.
        </p>
        <blockquote>
          <p>{errorMessage()}</p>
        </blockquote>
      </Match>
      <Match when={loading()}>
        <div>Loading..</div>
      </Match>
    </Switch>
  );
}

function Root() {
  return (
    <SDKProvider initOptions={{ debug: true }}>
      <DisplayGate>
        <App/>
      </DisplayGate>
    </SDKProvider>
  );
}
```
