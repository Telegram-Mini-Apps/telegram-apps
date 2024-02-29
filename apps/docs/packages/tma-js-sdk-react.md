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
utilizes the `init` function from [@tma.js/sdk](tma-js-sdk.md). It accepts an optional list of
parameters through the [options](tma-js-sdk/init.md#options) property.

```jsx
import { SDKProvider, type SDKInitOptions } from '@tma.js/sdk-react';

/**
 * Root component for the whole project.
 */
export function Root() {
  const options: SDKInitOptions = {
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

SDK initialization is considered asynchronous in case the `async` SDKProvider component property
or initialization option `complete` equal `true`. In this case, `SDKProvider` will start
initialization using the React `useEffect` hook. This mode is useful in case the developer is using
Server-Side Rendering or when the valid state of all components is required.

Nevertheless, as long as this process is asynchronous, developers should be careful when calling
package-specific component hooks, such as `useBackButton`, `useMainButton`, etc. When the SDK is not
yet initialized, these hooks will throw an error as long as they will be unable to retrieve
the component from the SDK.

```jsx
import {
  SDKProvider,
  DisplayGate,
  useMainButton,
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
      <DisplayGate>
        <App/>
      </DisplayGate>
    </SDKProvider>
  );
}
```

You might wonder why we need a component like `DisplayGate`. The reason is that the SDK
initialization process can be asynchronous (when `complete` initialization option is `true`).
Some of its components need to send requests to the Telegram application to fetch their current
state. Due to this, we cannot determine the required properties for these components until the
initialization is completed.

As a result, all hooks that return component instances will throw an error because they cannot
retrieve the necessary component from the SDK initialization result. Therefore, these hooks should
not be called until the SDK is fully initialized.

`DisplayGate` is the built-in component which encapsulates logic related to application display.
It provides 3 optional properties, such as `initial`, `error` and `loading`. Each of them could
either be a `ReactNode` (React element, string, number, null, etc.) or React component accepting
no properties.

`error` property is allowed to accept React component, which accepts property `error: unknown`.
Here is the complete example:

```jsx
import {
  SDKProvider,
  DisplayGate,
  useMainButton,
  type SDKInitOptions,
} from '@tma.js/sdk-react';

function App() {
  const mainButton = useMainButton();
  // We will get an error here as long as SDK is not yet initialized.
  // The solution will be provided further.
  return <div>My application!</div>;
}

interface SDKProviderErrorProps {
  error: unknown;
}

function SDKProviderError({ error }: SDKProviderErrorProps) {
  return (
    <div>
      Oops. Something went wrong.
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : JSON.stringify(error)}
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
    <SDKProvider options={{ async: true, complete: true }}>
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
import { SDKProvider, useMainButton } from '@tma.js/sdk-react';

function App() {
  const mainButton = useMainButton();
  // There will be no error here as long as initialization is 
  // synchronous and at this moment SDK is already initialized.
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

### When Init is Done

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

### Launch Parameters

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
  return (
    <pre>
      <code>{JSON.stringify(launchParams, null, ' ')}</code>
    </pre>
  );
}

// or

const DisplayLaunchParamsWrapped = withLaunchParams(props => {
  return (
    <pre>
      <code>{JSON.stringify(props.launchParams, null, ' ')}</code>
    </pre>
  );
});
```

### Init Result Related

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
- `useSettingsButton`, `withSettingsButton`. Returns
  the [SettingsButton](tma-js-sdk/components/settings-button.md) component
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

## Declarative vs Imperative

This package does not offer declarative components that can be used during development. This section
of the documentation provides information on why this solution was chosen.

The main difference between declarative and imperative approaches is that the declarative approach
hides the implementation behind a simple entity. In contrast, the imperative approach requires
describing the process step-by-step.

This makes the imperative approach more flexible and intuitive, as long as the developer can see
each step hidden behind the process.

### Declarative

Let's start from the example of how we could use the declarative approach in this package:

```jsx
import { MainButton } from '@tma.js/sdk-react';

function App() {
  return (
    <div>
      <p>Just an example</p>
      <MainButton text='Submit' textColor='#aabb01'/>
    </div>
  );
}
```

This code will have to display the Main Button, set text `Submit` and the color of text equal
to `#aabb01`. This usage of the component seems comfortable.

### Imperative

Now, let's see the imperative alternative of the same code:

```jsx
import { useEffect } from 'react';
import { useMainButton } from '@tma.js/sdk-react';

function App() {
  const mainButton = useMainButton();

  useEffect(() => {
    mainButton.setParams({
      text: 'Submit',
      textColor: '#aabb01'
    });
  }, []);

  return (
    <div>
      <p>Just an example</p>
    </div>
  );
}
```

As you can see, the imperative approach requires writing more code. Nevertheless, this implication
has more advantages than disadvantages.

### Comparison

The declarative approach seems more comfortable, requiring less code to write but has at least one
disadvantage, which becomes more visible in larger projects. This drawback manifests when there are
several application components using the MainButton component. All these parent components could be
placed anywhere in the application.

You can imagine such a case with a simplified structure like this:

```jsx
import { MainButton } from '@tma.js/sdk-react';

function ComponentA() {
  return (
    <MainButton
      text='Submit'
      textColor='#aabb01'
      onClick={...}
    />
  );
}

function ComponentB() {
  return (
    <MainButton
      text='Cancel'
      textColor='#010101'
      onClick={...}
      backgroundColor='#000000'
    />
  );
}

function ParentOfA() {
  return (
    <div>
      ...
      <ComponentA/>
    </div>
  );
}

function Root() {
  return (
    <div>
      <ParentOfA/>
      ...
      <div>
        ...
        <div>
          ...
          <ComponentB/>
        </div>
      </div>
    </div>
  );
}
```

In this case, you don't really know what would happen if `ComponentA` or `ComponentB` were
re-rendered. Will `MainButton` update all properties, or only the changed ones? Will they ever
update anything in the Main Button? Which properties of the `MainButton` component would be applied?
Well, there is no intuitive answer to these questions.

That's why we prefer using the imperative approach which directly notifies the developer of
what action will be performed. This also allows developer to select the strategy he really needs -
update all properties or maybe just some of them:

```jsx
import { useEffect } from 'react';
import { useMainButton } from '@tma.js/sdk-react';

function ComponentA() {
  const mb = useMainButton();

  useEffect(() => {
    mb.setParams({
      text: 'Submit',
      textColor: '#aabb01',
    });

    return mb.on('click', ...);
  }, []);

  return null;
}

function ComponentB() {
  const mb = useMainButton();

  useEffect(() => {
    mb.setParams({
      text: 'Cancel',
      textColor: '#010101',
      backgroundColor: '#000000',
    });

    return mb.on('click', ...);
  }, []);

  return null;
}

function ParentOfA() {
  return (
    <div>
      ...
      <ComponentA/>
    </div>
  );
}

function Root() {
  return (
    <div>
      <ParentOfA/>
      ...
      <div>
        ...
        <div>
          ...
          <ComponentB/>
        </div>
      </div>
    </div>
  );
}
```

In this case, we know that when ComponentA and ComponentB are mounted, they will try to set
specified parameters. No other re-renders will have an effect on the Main Button.

## Template

We have already created a [template](https://github.com/Telegram-Mini-Apps/reactjs-template) for
React JS that utilizes the current package, so you can use it.
