# twa-theme-params <sup><img src="https://static.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" alt="ts" width="20"/></sup>

[npm-badge]: https://img.shields.io/npm/v/twa-theme-params?logo=npm

[npm-link]: https://npmjs.com/package/twa-theme-params

[size-badge]: https://img.shields.io/bundlephobia/minzip/twa-theme-params

[license-badge]: https://img.shields.io/github/license/telegram-web-apps/theme-params

[tree-shaking-badge]: https://img.shields.io/badge/Tree%20Shaking-enabled-success

[tree-shaking-link]: https://webpack.js.org/guides/tree-shaking/

[gh-org-badge]: https://img.shields.io/badge/-Ecosystem_Component-%23555?logo=github

[gh-org-link]: https://github.com/Telegram-Web-Apps

[![Ecosystem Component][gh-org-badge]][gh-org-link]
[![Tree Shaking][tree-shaking-badge]][tree-shaking-link]
[![NPM][npm-badge]][npm-link]
![Size][size-badge]
![License][license-badge]

Web Apps theme parameters contain rather important information to follow visual
consistency of client application with native one. It provides developer
information about which colors are currently used by native application and
expects developer to use them.

## Motivation

As long as it is important to create applications which look native, developers
have to watch for current theme parameters and their changes.

Moreover, user will have better experience in case, when application is loading
without "flashes", which usually occur due to on-flight color changes. That's
why this library should provide theme information even when application script
is still not loaded.

## Installation

```bash  
npm i twa-theme-params
```  

or

```bash  
yarn add twa-theme-params
```

## Usage

### CSS variables

It is important to display application with colors already known. The only one
easy way of getting theme colors before application is displayed, is to get them
from current window's location.

To do this, we should create script and place it in `head` section of document
which will extract required parameters. Otherwise, due to some specific problems
in platform ([issue](https://github.com/Telegram-Web-Apps/client-sdk/issues/10))
, application will "flash".

Thanks to this library, it already has script ready to use. To make
everything work, just add `script` tag with `src` attribute as follows:

```html

<html>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/twa-theme-params/dist/preload.js"></script>
</head>
<body>
</body>
```

> It is recommended to specify version of `twa-theme-params` to make sure,
> nothing will break in case library updated. For example, you could use
> such URL as https://cdn.jsdelivr.net/npm/twa-theme-params@0.0.11/dist/preload.js

As a result, a set of CSS variables will be ready to use even when `body` is not
loaded. It means, you could display your application with already known colors
and use these colors in you CSS files.

- [Script source](https://github.com/Telegram-Web-Apps/theme-params/blob/master/src/preload.ts)
- [Usage example](https://github.com/Telegram-Web-Apps/theme-params/blob/master/preview.html)

### Programmatic control

#### Extracting from JSON

This library contains such useful function as `extractThemeFromJson`. It accepts
JSON object or its string representation and
returns [ThemeParams](https://github.com/Telegram-Web-Apps/theme-params/blob/master/src/types.ts#L7)
interface with already prepared and known colors.

```typescript
import {extractThemeFromJson} from 'twa-theme-params';

// Extract parameter, responsible for application theme parameters.
const tp = new URLSearchParams(window.location.hash.slice(1))
  .get('tgWebAppThemeParams');

// Extract required colors.
console.log(extractThemeFromJson(tp));

// Output:
// {
//   backgroundColor: '#17212b',
//   buttonColor: '#5288c1',
//   buttonTextColor: '#ffffff',
//   hintColor: '#708499',
//   linkColor: '#6ab3f3',
//   secondaryBackgroundColor: '#232e3c',
//   textColor: '#f5f5f5',
// }
```

#### Extracting from current window location

As long as Telegram specifies theme information in window location hash, we
could extract it directly from it:

```typescript
import {extractThemeFromLocation} from 'twa-theme-params';

// Extract required colors.
console.log(extractThemeFromLocation());

// Output:
// {
//   backgroundColor: '#17212b',
//   buttonColor: '#5288c1',
//   buttonTextColor: '#ffffff',
//   hintColor: '#708499',
//   linkColor: '#6ab3f3',
//   secondaryBackgroundColor: '#232e3c',
//   textColor: '#f5f5f5',
// }
```

## Contribution

Any contribution is appreciated. Feel free to create new feature requests, bug
reports etc.
