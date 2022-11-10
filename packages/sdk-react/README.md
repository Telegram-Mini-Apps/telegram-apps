# twa-sdk-react <sup><img src="https://static.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" alt="drawing" width="20"/></sup>

[npm-badge]: https://img.shields.io/npm/v/twa-sdk-react.svg

[npm-link]: https://npmjs.com/package/twa-sdk-react

[size-badge]: https://img.shields.io/bundlephobia/minzip/twa-sdk-react

[![NPM][npm-badge]][npm-link]
![Size][size-badge]

React bindings for client SDK. Contains hooks, components and other
useful tools which allow usage of React along with Web Apps client SDK.
Tracks SDK components changes out of box.

To learn how client SDK works, please, refer to its official
[documentation](https://github.com/Telegram-Web-Apps/twa/tree/master/packages/sdk).

## Installation

Before everything, it is assumed, that you already installed `react` package
as long as this plugin has it as peer dependency. Installation of SDK itself is
not required, current package already includes it.

Then, you can install this package via this command:

```bash
npm i twa-sdk-react
```  

or

```bash  
yarn add twa-sdk-react
```

## Usage

### Initializing

According to SDK documentation, it represents a set of components, which are
not initialized by default and developer should create them by himself.
Additionally, SDK provides function called `init` which allows developers
not to think about "how do I even should create these components?" and creates
components by itself.

So, as you could think, the first thing we have to do is to provide application
SDK functionality and allow it calling initialization to get newly
created components. For this purpose, component `SDKProvider` exist:

```typescript jsx
import React from 'react';
import {SDKProvider} from 'twa-sdk-react';

function Root() {
  return (
    <SDKProvider debug={true}>
      <div>My application!</div>
    </SDKProvider>
  );
}
```

Insertion of this component allows its child elements to use hook
`useSDK` returning core SDK information:

```typescript jsx
import React from 'react';
import {SDKProvider, useSDK} from 'twa-sdk-react';

function App() {
  const sdk = useSDK();

  // Here, we can use SDK information.

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

Ok, we have access to SDK now, but what about `init` function? We don't have
to call this function as long as `SDKProvider` will do it for us when it was
attached to DOM. Let's complicate previous example and add important logic
connected with SDK lifecycle:

```typescript jsx
import React, {PropsWithChildren, useEffect} from 'react';
import {SDKProvider, useSDK, useBackButton, useWebApp} from 'twa-sdk-react';

/**
 * Part of application which is free of using SDK components.
 */
function App() {
  const backButton = useBackButton();
  const webApp = useWebApp();

  // When App is attached to DOM, lets show back button and
  // add click event handler, which will close application.
  useEffect(() => {
    backButton.on('click', webApp.close);
    backButton.show();

    return () => {
      backButton.off('click', webApp.close);
      backButton.hide();
    };
    // We know, that backButton and webApp will never change,
    // but let's follow React rules.
  }, [backButton, webApp]);

  return <div>My application!</div>;
}

/**
 * This component controls render of important part of application
 * which uses hooks, returning SDK components.
 */
function Loader({children}: PropsWithChildren) {
  const {didInit, components} = useSDK();

  // There were no calls of SDK's init function. It means, we did not
  // even try to do it.
  if (!didInit) {
    return <div>SDK init function is not yet called.</div>;
  }

  // If components is null, it means, SDK is not ready at the
  // moment and currently initializing. Usually, it takes like
  // several milliseconds or something like that, but we should
  // have this check.
  if (components === null) {
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
    <SDKProvider>
      <Loader>
        <App/>
      </Loader>
    </SDKProvider>
  );
}
```

You could probably ask why we should use component like `Loader`. The problem
is, as long as SDK initialization is asynchronous (some of its components should
send requests to native app), we could not determine which properties its
components should have. That is the reason, why `SDKProvider` can not provide
valid `components` property until initialization is completed.

As a result, all hooks which return component instances will throw an error
as long as they could not get their component from `components` property. That
is the reason, why these hooks should not be called until SDK is initialized.

### When init is done

When initialization was completed successfully, do not forget to
call `webApp.ready` function. This will notify native application about current
Web App is ready to be displayed.

```typescript jsx
import {useWebApp} from 'twa-sdk-react';
import React, {useEffect} from 'react';

function App() {
  const webApp = useWebApp();

  useEffect(() => {
    webApp.ready();
  }, [webApp]);
  
  return <div>Here is my App</div>;
}
```

## Hooks and HOCs

### Theme

There are some cases, when it is required to use theme parameters information
even when SDK is not ready yet. For example, you would probably want to
know theme colors to render app loader with appropriate colors.

For this purpose, hook `useThemeFromLocation` is used:

```typescript jsx
import {useThemeFromLocation} from 'twa-sdk-react';
import React, {useEffect} from 'react';

function App() {
  const theme = useThemeFromLocation();

  return <div>Background color: {theme.backgroundColor}</div>;
}
```

Internally, this hook uses `twa-theme-params`s package `extractFromLocation`
function, which extracts theme information from current window location.

### Other

Library provides list of dead simple hooks and HOCs for each SDK component.
Returned instances are always the same, but force updates will be called
in case, something changed in component.

> **WARNING**: In case, you use HOCs, pay attention to the fact, passed
> components are always the same instances. This may lead to problems with
> `PureComponent`s as long as they will not see any changes in references.
> Do not create new components instances as long as it will lead to new
> problems connected with events listening done during SDK initialization
> process.
