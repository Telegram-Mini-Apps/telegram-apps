# Motivation

This document describes the motivation that inspired us to create `@tma.js/sdk`.

Here is the list of problems, we found in the official SDK and decided to create our own:

1. [Unproductive Package Format](#unproductive-package-format)
2. [No Public Review](#no-public-review)
3. [Vanilla JavaScript](#vanilla-javascript)
4. [Possible Security Issues](#possible-security-issues)
5. [Mixed Code Quality](#mixed-code-quality)
6. [Bundle Size](#bundle-size)
7. [Inconsistent Components State](#inconsistent-components-state)
8. [1700 Lines of Code, Single File](#1700-lines-of-code-single-file)
9. [Unused Code](#unused-code)
10. [Implicit Methods Inactivity](#implicit-methods-inactivity)
11. [Uncontrolled Initialization](#uncontrolled-initialization)
12. [Forced CSS Variables](#forced-css-variables)
13. [Forced Logs](#forced-logs)
14. [Ancient Bugs](#ancient-bugs)

## Unproductive Package Format

The Telegram SDK is provided as an IIFE package, which may lead to a variety
of potential issues. Modern development typically avoids this format unless it is genuinely
necessary. Developers tend to prefer more contemporary technologies and formats. The world of
development has advanced significantly beyond the ES5 standard and traditional JavaScript.

### Solution

Despite the issues associated with IIFE, `@tma.js/sdk` is available in three formats:
CommonJS (CJS),
ECMAScript Modules (ESM), and IIFE. Developers have the flexibility to choose any of these formats,
and they can reap the benefits of selecting ESM.

All project packages are available on [npm.js](https://www.npmjs.com/org/tma.js) and can be
installed in the standard manner via `npm i`, `pnpm i`, `yarn add`, etc.

## No Public Review

Developers are unable to track file changes in the usual and familiar way. They must rely on
third-party software such as Telegram Crawler or similar tools to monitor the modifications made.
Additionally, developers are unable to report some problems in code or suggest an enhancement.

### Solution

`@tma.js/sdk` uses GitHub as its codebase repository. Every developer can track changes made
to any
files and review them.

## Vanilla JavaScript

The Telegram SDK is written in ES5 JavaScript, which appears unsuitable for large projects that
necessitate type definitions. While there are external projects that address this issue, the problem
is that **they are external** and might become outdated. The Telegram SDK should be written in
TypeScript, offering type support out of the box.

### Solution

`@tma.js/sdk` is written in TypeScript and doesn't require help of other packages to provide
typings.

## Possible Security Issues

A year later, Telegram SDK still contains "code for testing purposes" (lines 140-143):

```javascript
var trustedTarget = 'https://web.telegram.org';
// For now we don't restrict target, for testing purposes
trustedTarget = '*';
window.parent.postMessage(JSON.stringify({
  eventType: eventType,
  eventData: eventData
}), trustedTarget);
```

This section of code determines which parent iframes can receive `message` events from the
developer's application. For typical developers, this means determining which iframes are capable of
receiving [Telegram Mini Apps methods](https://docs.telegram-mini-apps.com/platform/methods)
data along
with their parameters. Despite the fact that the average developer does not need to disable
this security mechanism, Telegram does it for them for "testing purposes".

### Solution

`@tma.js/sdk` does not disable any security mechanisms. If a developer needs to configure the
list of
allowed parent iframe origins, the package provides corresponding methods.

## Mixed Code Quality

The current code format suggests that there were numerous developers from Telegram involved in its
development. The issue is that the coding approach varies between different parts, giving the
impression that both frontend and backend (or more likely, C++) developers were working on
implementing new features and re-implementing mechanisms and utilities that are already included in
web browsers.

The absence of code comments makes it difficult for external developers to quickly comprehend what
is happening in the code, which, in turn, makes it more challenging to contribute.

### Solution

`@tma.js/sdk` code is extensively documented with various types of comments and
documentation. The
project follows well-established and widely
recognized [ESLint rules as described by Airbnb](https://github.com/airbnb/javascript). External
developers are welcome to explore the code and propose improvements.

## Bundle Size

The SDK provided by Telegram appears more like source code for the package rather than a
production-ready version. In typical web project development, code minification is employed to
reduce the amount of data loaded by browsers. However, it seems that this has not been implemented
here.

### Solution

`@tma.js/sdk` packages are built using Vite (Rollup), which minifies the code and provides
ready-to-use
libraries.

## Inconsistent Components State

The Telegram SDK does not preserve component states between application refreshes (using the 'Reload
Page' button in the top-right three dots menu). It assumes that all components have their initial
states, but this is not always the case.

To verify this, developers can perform the following steps:

1. Open the [Durger King Bot](https://t.me/DurgerKingBot) application (by clicking the Menu Button).
2. Open the console and enter `window.Telegram.WebApp.BackButton.isVisible`. It will return `false`.
3. Add any product and click the MainButton ('View order'). The BackButton should become visible.
4. Click the three dots in the top-right corner of the application interface and select 'Reload
   Page.'
5. Repeat step #2. It will return `false` again, even though the BackButton is currently visible.

So, the SDK lacks awareness of the actual state of components.

### Solution

`@tma.js/sdk` packages consistently provide the current component state.

## 1700 Lines of Code, Single File

Telegram SDK is provided as a single file with 1700 lines of code, which makes it research
way too hard, decreasing code understanding and external developers code contribution.

### Solution

`@tma.js/sdk` packages are finely detailed, with each package being responsible for its
specific part of
the platform and having an intuitive file structure.

## Unused Code

In addition to the fact that the Telegram SDK code is not compressed, it also includes code that is
typically inaccessible in common applications. At first glance, this code appears to be exclusively
utilized by Telegram developers during library development.

To identify this type of code, developers can examine line 743 using a "debug button" that relies on
a launch parameter, such as `tgWebAppDebug`, which is not present in normal applications.

```typescript
 if (initParams.tgWebAppDebug) {
  debugBtn = document.createElement('tg-main-button');
  debugBtnStyle = {
    font: '600 14px/18px sans-serif',
    display: 'none',
    width: '100%',
    height: '48px',
    borderRadius: '0',
    background: 'no-repeat right center',
    position: 'fixed',
    left: '0',
// ...
```

This parameter also involves the definition of certain large functions that are exclusively
associated with this button.

While it is possible to explore further to uncover additional unused code, this particular case is
already a concern.

### Solution

`@tma.js/sdk` does not contain any code specifically oriented towards a distinct group of
developers.
The functionality it provides covers scenarios that all developers are likely to encounter.

## Implicit Methods Inactivity

The Telegram SDK does not offer any functions to check if the called Telegram Mini Apps methods are
supported by the current platform version. Even though each SDK method checks if it's supported,
developers are unable to reuse this type of functionality.

The related issue here is that calling SDK methods does not inform a developer when something is not
functioning as expected. In other words, the called method either performs an action or does
nothing, but developers have no way of knowing it. There will only be a warning in the console,
which cannot and should not be handled by a developer.

Instead, SDK methods should throw an error if the method is unsupported. With this behavior, a
developer will be certain that the method does not work. Otherwise, a developer will either hope
that the called method will work or be required to investigate which methods are supported by which
platform versions and implement the corresponding functionality themselves.

### Solution

The `@tma.js/bridge` package offers utilities to verify whether a specific Telegram Mini Apps
method
is supported in a specified platform version. This ensures that the developer can be confident the
method call will work as intended. It also allows checking if specified method **parameter** is
supported by specified version.

The `@tma.js/sdk` package provides higher-level components that make use of Telegram Mini
Apps. Each
component has a special method, `supports`, which returns `true` if the component's method is
supported in the current platform version. By default, calling methods that are not supported in the
current platform version will result in an error. Nevertheless, this type of behavior is
configurable.

## Uncontrolled Initialization

The process of SDK initialization cannot be controlled by the developer. SDK initialization itself
is synchronous, but it cannot technically be considered as such as long as Telegram Mini Apps does
not provide a synchronous way to receive the state of its components (for example, MainButton,
BackButton, Viewport, etc.). That's why the initialization process is asynchronous - it will take
some time for the code to retrieve the actual state from the Telegram application.

The resulting problem here is that the developer cannot be sure if the current component state
they are working with is up-to-date, and not the initial one. There is no way to know if the
initialization has been completed.

### Solution

`@tma.js/sdk` provides asynchronous initialization to ensure that developers are working with
components in their actual state. However, it does not restrict developers from implementing
their own initialization process.

## Forced CSS Variables

Developers are unable to prevent the creation of CSS variables that could potentially impact
application performance. For instance, the Telegram SDK generates a CSS variable
called `--tg-viewport-height`, which is updated each time a user moves a Mini App window. During
extensive changes in viewport height, the SDK updates this variable frequently, which could
potentially result in a decrease in application performance.

This is not a particularly crucial point of motivation because, in most cases, applications are not
actively processing changes in viewport height. However, it appears that this behavior could be made
configurable.

### Solution

CSS variables feature is configurable in `@tma.js/sdk` packages.

## Forced Logs

Developers are unable to disable logs, related to the package lifecycle.
This makes application debugging a bit harder, and sometimes, may lead
to sending unnecessary logs to external services.

## Ancient Bugs

The Telegram SDK contains bugs that have not been fixed for a long time.

These bugs have existed since the library's inception.

For example, the SDK does not allow a developer to track the closing of a popup when it is closed by
clicking outside it or by clicking the close icon. To handle this, developers must use a
workaround not intended for this purpose.

The main issue here is not the bug itself, but the inability to notify the library owners about it.

### Solution

All `@tma.js` packages are public, and developers are allowed to create an issue for a bug.
The community will then work to fix it.
