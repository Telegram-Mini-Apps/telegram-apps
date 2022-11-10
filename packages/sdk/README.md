# twa-sdk <sup><img src="https://static.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" alt="drawing" width="20"/></sup>

[npm-badge]: https://img.shields.io/npm/v/twa-sdk?logo=npm

[npm-link]: https://npmjs.com/package/twa-sdk

[size-badge]: https://img.shields.io/bundlephobia/minzip/twa-sdk

[license-badge]: https://img.shields.io/github/license/telegram-web-apps/client-sdk

[tree-shaking-badge]: https://img.shields.io/badge/Tree%20Shaking-enabled-success

[tree-shaking-link]: https://webpack.js.org/guides/tree-shaking/

[gh-org-badge]: https://img.shields.io/badge/-Ecosystem_Component-%23555?logo=github

[gh-org-link]: https://github.com/Telegram-Web-Apps

[![Ecosystem Component][gh-org-badge]][gh-org-link]
[![Tree Shaking][tree-shaking-badge]][tree-shaking-link]
[![NPM][npm-badge]][npm-link]
![Size][size-badge]
![License][license-badge]

Made from scratch TypeScript library for communication with Telegram Web Apps
functionality.

Code of this library was written with aim to make developers communication with
Telegram way easier. It contains a lot of separate components which are
responsible for their own part of Telegram Web Apps ecosystem.

Before starting to use SDK, we highly recommend learning Web Apps
[documentation](https://github.com/Telegram-Web-Apps/documentation)
to understand platform concepts.

> ⚠️ This library is independent. Please, do not associate this SDK with
> library created by Telegram or TON Foundation developers and their
> documentation.

## Table of contents

- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)

## Motivation

- Official implementation supports usage only through global `window`
  object that is not modern and not that comfortable as importing functionality
  with ES6 imports. Nevertheless, it does not mean, this use case should not
  exist. Some applications may not support modern way of using packages and as a
  result, the only one possible solution for them is usage through `window`
  object;
- Official implementation language is JavaScript without usage of JSDoc. It is
  rather important to use TypeScript to let developers know which types they
  use. Additionally, TS code is way more supportable;
- Official implementation contains almost no comments. So, most of the time, it
  is hard to understand current code flow;
- Original library contains bugs and potential weak spots.

## Installation

```bash  
npm i twa-sdk
```  

or

```bash  
yarn add twa-sdk
```

## Usage

### Preparing visual part

It is not secret, that visual part of application is rather important for user.
It means, that your application should not have any visual problems. We can say
the same about application "flashes", when its color scheme changes on flight.
To prevent application from flashing, it is required to know theme colors at the
moment, when DOM body starts rendering.

This package itself has no utility which provides such kind of behavior. The
reason is, ecosystem contains separate component responsible for this
functionality named ThemeParams. To learn how it works,
visit [this link](../theme-params).

### Initialization

According to logic, this package provides full control over its lifecycle,
its initialization is on your shoulders. It means, that there are no already
initialized global components which could be used by developer, he has to
create them.

To make developers life easier, package contains special function called `init`,
which allows to get everything package needs and work with created components:

```typescript
import {init} from 'twa-sdk';

init().then(components => {
  // Now we have all initialized components.
});
```

After this step, it is allowed to start using Web Apps functionality and trust
components properties.

```typescript
import {init} from 'twa-sdk';

init().then(components => {
  const {mainButton, viewport} = components;

  // Add main button event click which will lead to
  // application expansion.
  mainButton.on('click', viewport.expand);

  // Update main button information and show it.
  mainButton
    .setColor('#ff0000')
    .setTextColor('#ffffff')
    .setText('Expand')
    .enable()
    .show();
});
```

### Debug mode

To display additional debug messages, use the first argument in `init`
function:

```typescript
import {init} from 'twa-sdk';

// Init with debug mode.
init(true);
```

## Components

Each component contains its own documentation:

- [BackButton](src/components/BackButton)
- [HapticFeedback](src/components/HapticFeedback)
- [InitData](src/components/InitData)
- [MainButton](src/components/MainButton)
- [Popup](src/components/Popup)
- [ThemeParams](src/components/ThemeParams)
- [Viewport](src/components/Viewport)
- [WebApp](src/components/WebApp)

## Contribution

Any contribution is appreciated. Feel free to create new feature requests, bug
reports etc.

In case, you found a bug in Web Apps platform (not this SDK), please, create new
issue [here](https://github.com/Telegram-Web-Apps/sdk/issues/new/choose).