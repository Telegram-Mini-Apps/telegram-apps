# @tma.js/launch-params

[npm-link]: https://npmjs.com/package/@tma.js/launch-params

[npm-shield]: https://img.shields.io/npm/v/@tma.js/launch-params?logo=npm

![[npm-link]][npm-shield]

Provides utilities to work with Telegram Mini
Apps [launch parameters](../../platform/launch-parameters/common-information.md).

::: danger
This project has been deprecated. All its functionality was moved to
the [@tma.js/sdk](./tma-js-sdk/about.md) package.
:::

## Installation

::: code-group

```bash [pnpm]
pnpm i @tma.js/launch-params
```

```bash [npm]
npm i @tma.js/launch-params
```

```bash [yarn]
yarn add @tma.js/launch-params
```

:::

## Parsing

To parse value as launch parameters, package provides method `parse` and parser `launchParams`
which is being utilized by `parse`.

Method and parser accept query parameters presented as a string or an instance of `URLSearchParams`,
returning the `LaunchParams` interface. It throws an error if the passed data is invalid.

::: code-group

```typescript [Usage example]
import { parse, launchParams } from '@tma.js/launch-params';

const searchParams = new URLSearchParams([
  ['tgWebAppVersion', '6.7'],
  ['tgWebAppPlatform', 'tdekstop'],
  ['tgWebAppBotInline', '1'],
  ['tgWebAppData', new URLSearchParams([
    ['query_id', 'AAHdF6IQAAAAAN0XohAOqR8k'],
    ['user', JSON.stringify({
      id: 279058397,
      first_name: 'Vladislav',
      last_name: 'Kibenko',
      username: 'vdkfrost',
      language_code: 'ru',
      is_premium: true,
      allows_write_to_pm: true,
    })],
    ['auth_date', '1691441944'],
    ['hash', 'abc'],
  ]).toString()],
  ['tgWebAppThemeParams', JSON.stringify({
    bg_color: '#17212b',
    button_color: '#5288c1',
    button_text_color: '#ffffff',
    hint_color: '#708499',
    link_color: '#6ab3f3',
    secondary_bg_color: '#232e3c',
    text_color: '#f5f5f5',
  })],
]);

const lp = parse(searchParams);
// or
const lp = launchParams().parse(searchParams);
```

```typescript [Expected result]
const result = {
  botInline: true,
  version: '6.7',
  platform: 'tdesktop',
  themeParams: {
    backgroundColor: '#17212b',
    buttonColor: '#5288c1',
    buttonTextColor: '#ffffff',
    hintColor: '#708499',
    linkColor: '#6ab3f3',
    secondaryBackgroundColor: '#232e3c',
    textColor: '#f5f5f5',
  },
  initDataRaw: 'query_id=AAHdF6IQAAAAAN0XohAOqR8k&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1691441944&hash=abc',
  initData: {
    queryId: 'AAHdF6IQAAAAAN0XohAOqR8k',
    authDate: new Date(1691441944000),
    hash: 'abc',
    user: {
      id: 279058397,
      firstName: 'Vladislav',
      lastName: 'Kibenko',
      username: 'vdkfrost',
      languageCode: 'ru',
      isPremium: true,
      allowsWriteToPm: true,
    },
  },
};
```

:::

## Serializing

To convert the launch parameters object representation to a string, developers should use
the `serialize` function:

```typescript
import { serialize } from '@tma.js/launch-params';

serialize({
  version: '6.7',
  platform: 'tdesktop',
  themeParams: {
    backgroundColor: '#17212b',
    buttonColor: '#5288c1',
    buttonTextColor: '#ffffff',
    hintColor: '#708499',
    linkColor: '#6ab3f3',
    secondaryBackgroundColor: '#232e3c',
    textColor: '#f5f5f5',
  },
});

// Result:
// tgWebAppVersion=6.7&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D
```

## Retrieving

This package enables the extraction of launch parameters from the current environment using
the [retrieveFromLocation](#retrievefromlocation), [retrieveFromPerformance](#retrievefromperformance),
and [retrieveFromStorage](#retrievefromstorage) functions. Developer is also able
to use [retrieveLaunchData](#retrievelaunchdata) to surely extract launch parameters and determine
if current page was reloaded. Each of these functions throws an error if the source contains invalid
data.

### `retrieveLaunchData`

Extracts actual launch parameters and page reload flag.

```typescript
import { retrieveLaunchData } from '@tma.js/launch-params';

const { launchParams, isPageReload } = retrieveLaunchData();
```

::: info

This function is more likely to be used by developers because it offers a stable way of retrieving
the actual launch parameters.

:::

### `retrieveFromStorage`

Extracts launch parameters from `sessionStorage`. This method expects that launch parameters have
been saved in the `sessionStorage` via the `saveToStorage` method.

```typescript
import {
  retrieveFromStorage,
  saveToStorage,
} from '@tma.js/launch-params';

saveToStorage({
  initData: {
    authDate: new Date(16552413000),
    hash: 'hash',
  },
  initDataRaw: 'auth_date=16552413&hash=hash',
  themeParams: {},
  version: '7.0',
  platform: 'macos',
});

const launchParameters = retrieveFromStorage();
```

### `retrieveFromLocation`

Extracts launch parameters from `window.location.hash`:

```typescript
import { retrieveFromLocation } from '@tma.js/launch-params';

const launchParameters = retrieveFromLocation();
```

### `retrieveFromPerformance`

Extracts launch parameters from `window.performance`. This function allows retrieving launch
parameters
using [performance navigation entries](https://developer.mozilla.org/en-US/docs/Web/Performance/Navigation_and_resource_timings).

```typescript
import { retrieveFromPerformance } from '@tma.js/launch-params';

const launchParameters = retrieveFromPerformance();
```
