[code-badge]: https://img.shields.io/badge/source-black?logo=github

[docs-badge]: https://img.shields.io/badge/documentation-blue?logo=gitbook&logoColor=white

[react-badge]: https://img.shields.io/badge/React-244654?logo=react&logoColor=61DAFB

[solid-badge]: https://img.shields.io/badge/Solid-203A59?logo=solid&logoColor=38659F

[node-badge]: https://img.shields.io/badge/Node-1f491f?logo=node.js&logoColor=339933

# @tma.js

Mono-repository, containing all the packages, connected with comfortable and safe TypeScript
development on Telegram Mini Apps platform. To learn more about specific packages, follow
their own documentations.

To learn more about platform itself, visit its [documentation](https://docs.telegram-mini-apps.com).

## Examples

This repository provides the list of examples, using different frontend technologies:

- [TypeScript and Vite](./apps/typescript-example)
- [React and Vite](./apps/react-sdk-example)
- [Solid and Vite](./apps/solid-sdk-example)
- [Vanilla JavaScript](./apps/vanilla-js-example) `⚠️ not recommended`

## Packages

### `@tma.js/sdk`

[sdk-code]: packages/sdk

[sdk-docs]: https://docs.telegram-mini-apps.com/docs/libraries/tma-js-sdk

[![docs-badge]][sdk-docs]
[![code-badge]][sdk-code]

Made from scratch production-ready TypeScript Telegram Mini Apps Source Development Kit. It includes
all features provided by other packages extending them with intuitively clear functionality.

### `@tma.js/sdk-react` <sub>![react-badge]</sub>

[sdk-react-code]: packages/sdk-react

[sdk-react-docs]: https://docs.telegram-mini-apps.com/docs/libraries/tma-js-sdk-react

[![docs-badge]][sdk-react-docs]
[![code-badge]][sdk-react-code]

React bindings for client SDK. Contains hooks, components and other
useful tools which allow usage of React along with Web Apps client SDK.
Tracks SDK components changes out of box.

### `@tma.js/sdk-solid` <sub>![solid-badge]</sub>

[sdk-solid-code]: packages/sdk-solid

[sdk-solid-docs]: https://docs.telegram-mini-apps.com/docs/libraries/tma-js-sdk-solid

[![docs-badge]][sdk-solid-docs]
[![code-badge]][sdk-solid-code]

Solid JS bindings for client SDK. Provides signals, hooks and components to be used in Solid JS
application.

### `@tma.js/bridge`

[bridge-code]: packages/bridge

[bridge-docs]: https://docs.telegram-mini-apps.com/docs/libraries/tma-js-bridge

[![docs-badge]][bridge-docs]
[![code-badge]][bridge-code]

Package which provides utilities to simplify communication flow between frontend and Telegram native
applications. It also solves some across-platform data difference problems to protect developers
code and save their time.

### `@tma.js/launch-params`

[launch-params-code]: packages/launch-params

[launch-params-docs]: https://docs.telegram-mini-apps.com/docs/libraries/tma-js-launch-params

[![docs-badge]][launch-params-docs]
[![code-badge]][launch-params-code]

Package which contains utilities to work with Telegram Mini
Apps [launch parameters](https://docs.telegram-mini-apps.com/docs/launch-params/about).

### `@tma.js/theme-params`

[theme-params-code]: packages/theme-params

[theme-params-docs]: https://docs.telegram-mini-apps.com/docs/libraries/tma-js-theme-params

[![docs-badge]][theme-params-docs]
[![code-badge]][theme-params-code]

Utilities to work with Telegram Mini Apps theme parameters.

### `@tma.js/init-data`

[init-data-code]: packages/init-data

[init-data-docs]: https://docs.telegram-mini-apps.com/docs/libraries/tma-js-init-data

[![docs-badge]][init-data-docs]
[![code-badge]][init-data-code]

Package providing utilities connected with Telegram Mini Apps init data. It
allows init data validation and parse, works both in browser and NodeJS.

### `@tma.js/init-data-node` <sub>![node-badge]</sub>

[init-data-node-code]: packages/init-data-node

[init-data-node-docs]: https://docs.telegram-mini-apps.com/docs/libraries/tma-js-init-data-node

[![docs-badge]][init-data-node-docs]
[![code-badge]][init-data-node-code]

Package providing utilities connected with Telegram Mini Apps init data. It
allows init data validation and parse, works both in browser and NodeJS.

## Packages formats

Almost each package is provided in 3 formats: **CJS**, **IIFE** and **ESM**.
Where defined (for example, not in Node), developers are allowed to use **IIFE**
format in browser.

### IIFE

#### Why not using it

> **TLDR**: Do not use packages presented in this monorepo directly in browser. They are supposed to
> be used as ES modules to improve the quality of a final product.

Despite the fact that `@tma.js` is generated in IIFE format and available in browser, it is **highly
recommended** not to use it.

Some of the packages use other `@tma.js` packages as dependencies. In this case there are 2
ways of importing them:

1. **By inserting another `script` tag which loads the dependency**.
   This way makes usage of package with a lot of dependencies almost unreal.
2. **By inlining these packages**.
   This way leads to code duplication between several packages using the same package as dependency.

As you can see, there is no optimal solution between both of them. As the additional problem
developer gets here, is bundler is unable to
use [tree shaking](https://stackoverflow.com/questions/45884414/what-is-tree-shaking-and-why-would-i-need-it),
making browser to load the code not used in the application. Imagine using the only 1 function from
some library like `lodash`, but fully load it.

Unfortunately, developer is unable to avoid these problems when using IIFE format. This is the
reason why it is recommended to use modern technologies along with ESM format.

#### When there is no other choice

First of all, it is required to load the package. Developer could
use [JSDelivr](https://www.jsdelivr.com/) to do it:

```html

<head>
  <script src="https://cdn.jsdelivr.net/npm/@tma.js/bridge"></script>
</head>
```

Loaded packages of `@tma.js` in IIFE format are accessible by path `window.tmajs.*`:

```html

<head>
  <script src="https://cdn.jsdelivr.net/npm/@tma.js/utils"></script>
</head>
<body>
  <script>
    var utils = window.tmajs.utils;

    console.log(utils.isRecord('Telegram Mini Apps')); // false
    console.log(utils.isRecord({})); // true
  </script>
</body>
```

> ⚠️ In this example we did not specify the exact version of required package. In this case,
> JSDelivr CDN will return the latest version of the package which in some cases may lead to
> unexpected behavior. To prevent such case, specify the exact version.

In case, you've met some problems related to using IIFE packages in browser, take a look at [Vanilla
JavaScript example](./apps/vanilla-js-example) utilizing IIFE packages.
