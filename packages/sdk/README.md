# twa-sdk <sup><img src="https://static.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" alt="drawing" width="20"/></sup>

[npm-badge]: https://img.shields.io/npm/v/twa-sdk?logo=npm

[npm-link]: https://npmjs.com/package/twa-sdk

[size-badge]: https://img.shields.io/bundlephobia/minzip/twa-sdk

[![NPM][npm-badge]][npm-link]
![Size][size-badge]

Made from scratch TypeScript library for communication with Telegram Web Apps
functionality.

Code of this library was written with aim to make developers communication with
Telegram Web Apps way easier. It contains a lot of separate components which are
responsible for their own part of Telegram Web Apps ecosystem.

Before starting to use SDK, we highly recommend learning Web Apps
[documentation](../documentation) to understand platform concepts.

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

### Visual first

It is not a secret, that visual part of application is rather important for
user.
It means, your application should not have any visual problems. One of them is
called "flashing", which happens in case, visual part of application changes
too fast for user. To prevent application from flashing, it is required to
know theme colors at the moment, when DOM body starts rendering.

This package itself has no utility which provides such kind of behavior. The
reason is, ecosystem contains separate package
[`twa-theme-params`](../theme-params) responsible for this functionality.

### Init

According to logic, this package provides full control over its lifecycle,
its initialization is on your shoulders. It means, that there are no already
initialized global components which could be used by developer, he has to
create them.

To make developers life easier, package contains special function called `init`,
which returns initialized components instances:

```typescript
import {init} from 'twa-sdk';

init().then(components => {
  // Now we have all initialized components.
  const {mainButton, viewport} = components;

  // Add main button event click which will lead to
  // application expansion.
  mainButton.on('click', () => viewport.expand());

  // Update main button information and show it.
  mainButton
    .setColor('#ff0000')
    .setTextColor('#ffffff')
    .setText('Expand')
    .enable()
    .show()
    .commit();
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

### Methods support

Almost each component is capable of checking whether is its method supported by
passed Web App version or not. To check if some methods are supported, you
should use `{Component}.supports()` function. For example:

```typescript  
import {BackButton} from 'twa-sdk';  
  
console.log(BackButton.supports('show', '6.0')); // false  
console.log(BackButton.supports('hide', '6.3')); // true  
```  

It is recommended to use this functionality before calling some component  
method as long as this will make you sure, it will work. Component itself  
is not checking if method is supported by current Web App version, what could  
lead to issues.

List of supported methods by components is described in each component's  
documentation.

> ⚠️ This behaviour (not checking if method is supported in methods
> themselves) will change in next major version of SDK. Consider
> using `supports` functionality where it is possible.

### Constructors

Some components which require usage of `Bridge` functionality can
apply its custom instance in constructor. In case, `Bridge` is not passed,
component will create it via `init()` method from `twa-bridge` package. We
recommend passing your own single instance of `Bridge` to avoid unexpected  
behaviour or errors.

### Events listening

Component instances use common way of events listening through `on` and `off`  
functions:

```typescript  
const listener = (...args) => {  
 // Do something I need.};  
component.on(event, listener); // add listener.  
component.off(event, listener); // remove listener.  
```  

Example with `BackButton` component:

```typescript
import {BackButton} from 'twa-sdk';

const backButton = new BackButton();
backButton.on('click', () => {
  console.log('Back button clicked.');
});
```

You can find list of supported events in components own documentations.