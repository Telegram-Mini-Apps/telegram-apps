# @tma.js/solid-router-integration

<p style="display: inline-flex; gap: 8px">
  <a href="https://npmjs.com/package/@tma.js/solid-router-integration">
    <img src="https://img.shields.io/npm/v/@tma.js/solid-router-integration?logo=npm"/>
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/@tma.js/solid-router-integration"/>
  <a href="https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/solid-router-integration">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

Telegram Mini Apps [Navigator](tma-js-sdk/navigation.md) integration
for [@solidjs/router](https://www.npmjs.com/package/@solidjs/router).

## Installation

::: code-group

```bash [pnpm]
pnpm i @tma.js/solid-router-integration
```

```bash [npm]
npm i @tma.js/solid-router-integration
```

```bash [yarn]
yarn add @tma.js/solid-router-integration
```

:::

## Usage

At the moment, this package provides the only 1 function, which creates the integration for
`@solidjs/router` Router - `createIntegration`.

Here is how it could be used:

```jsx
import {
  Routes,
  Route,
  Navigate,
  Router,
} from '@solidjs/router';
import { HashNavigator } from '@tma.js/sdk';
import { createIntegration } from '@tma.js/solid-router-integration';

import { IndexPage } from './IndexPage.js';

function App() {
  // We should create navigator to pass it to integration creation.
  const navigator = new HashNavigator([{}], 0);

  // Then, to allow this navigator update current browser history, 
  // we should attach it. Otherwise, it will work in memory mode.
  void navigator.attach();

  return (
    <Router source={createIntegration(() => navigator)}>
      <Routes>
        <Route path={'/'} component={IndexPage}/>
        <Route path={'*'} element={<Navigate href={'/'}/>}/>
      </Routes>
    </Router>
  );
}
```

And also a bit more complex example with navigation state restoration:

::: code-group

```jsx [App.tsx]
import {
  Routes,
  Route,
  Navigate,
  Router,
} from '@solidjs/router';
import { HashNavigator } from '@tma.js/sdk';

import { createNavigator } from './createNavigator.js';
import { IndexPage } from './IndexPage.js';

function App() {
  // We should create navigator to pass it to integration creation.
  const navigator = createNavigator();

  // Then, to allow this navigator update current browser history, 
  // we should attach it. Otherwise, it will work in memory mode.
  void navigator.attach();

  return (
    <Router source={createIntegration(() => navigator)}>
      <Routes>
        <Route path={'/'} component={IndexPage}/>
        <Route path={'*'} element={<Navigate href={'/'}/>}/>
      </Routes>
    </Router>
  );
}
```

```typescript [createNavigator.ts]
import {
  retrieveLaunchParams,
  isPageReload,
  HashNavigator,
  type HashNavigatorOptions,
} from '@tma.js/sdk';

export function createNavigator(): HashNavigator {
  let navigator: HashNavigator | undefined;
  const navigatorOptions: HashNavigatorOptions = {
    debug: true,
  };

  // If page was reloaded, we assume that navigator had to previously save
  // its state in the session storage.
  if (isPageReload()) {
    const stateRaw = sessionStorage.getItem('hash-navigator-state');
    if (stateRaw) {
      try {
        const { cursor, entries } = JSON.parse(stateRaw);
        navigator = new HashNavigator(entries, cursor, navigatorOptions);
      } catch (e) {
        console.error('Unable to restore hash navigator state.', e);
      }
    }
  }

  // In case, we could not restore its state, or it is the fresh start, we
  // can create empty navigator.
  if (!navigator) {
    navigator = new HashNavigator([{}], 0, navigatorOptions);
  }

  const saveState = (nav: HashNavigator) => {
    sessionStorage.setItem('hash-navigator-state', JSON.stringify({
      cursor: nav.cursor,
      entries: nav.getEntries(),
    }));
  }

  // Whenever navigator changes its state, we save it in the session storage.
  navigator.on('change', ({ navigator: nav }) => saveState(nav));

  // Save initial state to make sure nothing will break when page will
  // be reloaded.
  saveState(navigator);

  return navigator;
}
```

:::

## Template

We have already created a [template](https://github.com/Telegram-Mini-Apps/solidjs-template) for
Solid JS that utilizes the current package, so you can use it.
