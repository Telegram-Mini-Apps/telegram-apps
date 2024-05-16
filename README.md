[code-badge]: https://img.shields.io/badge/source-black?logo=github

# @tma.js

Mono-repository, containing all the packages, connected with comfortable and safe TypeScript
development on Telegram Mini Apps platform. To learn more about specific packages, follow
their own [documentations](https://docs.telegram-mini-apps.com).

> ⚠️ Working with @tma.js packages, you must not install the SDK from Telegram presented by
> a single file - telegram-web-app.js. Using both @tma.js packages and telegram-web-app.js
> will surely lead to bugs.

## Packages

[docs-badge]: https://img.shields.io/badge/documentation-a?logo=gitbook&logoColor=white&color=%23007AFF

### `@tma.js/sdk`

[sdk-npm-badge]: https://img.shields.io/npm/v/@tma.js/sdk?logo=npm

[![docs-badge]](https://docs.telegram-mini-apps.com/packages/tma-js-sdk)
[![sdk-npm-badge]](https://npmjs.com/package/@tma.js/sdk)
![Size](https://img.shields.io/bundlephobia/minzip/@tma.js/sdk)
[![code-badge]](https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/sdk)

Made from scratch TypeScript library for seamless communication with Telegram Mini Apps
functionality.

The code of this library is designed to simplify the process of developers interacting with Telegram
Mini Apps. It consists of several individual components, each responsible for a specific aspect of
the Telegram Mini Apps ecosystem.

Before you begin using the SDK, we highly recommend familiarizing yourself with the Telegram Mini
Apps [documentation](https://docs.telegram-mini-apps.com/platform/about-platform)
to grasp the fundamental concepts of the platform.

### `@tma.js/sdk-react`

[sdk-react-npm-badge]: https://img.shields.io/npm/v/@tma.js/sdk-react?logo=npm

[![docs-badge]](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-react)
[![sdk-react-npm-badge]](https://npmjs.com/package/@tma.js/sdk-react)
![Size](https://img.shields.io/bundlephobia/minzip/@tma.js/sdk-react)
[![code-badge]](https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/sdk-react)

React JS bindings for [client SDK](https://docs.telegram-mini-apps.com/packages/tma-js-sdk/about). Includes
hooks, components and utilities for comfortable usage of React JS on the Telegram Mini Apps platform.

### `@tma.js/sdk-solid`

[sdk-solid-npm-badge]: https://img.shields.io/npm/v/@tma.js/sdk-solid?logo=npm

[![docs-badge]](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-solid)
[![sdk-solid-npm-badge]](https://npmjs.com/package/@tma.js/sdk-solid)
![Size](https://img.shields.io/bundlephobia/minzip/@tma.js/sdk-solid)
[![code-badge]](https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/sdk-solid)

Solid JS bindings
for [client SDK](https://docs.telegram-mini-apps.com/packages/tma-js-sdk/about). Includes
hooks, components and utilities
for comfortable usage of Solid JS on the Telegram Mini Apps platform.

### `@tma.js/init-data-node`

[init-data-node-npm-badge]: https://img.shields.io/npm/v/@tma.js/init-data-node?logo=npm

[![docs-badge]](https://docs.telegram-mini-apps.com/packages/tma-js-init-data-node)
[![init-data-node-npm-badge]](https://npmjs.com/package/@tma.js/init-data-node)
![Size](https://img.shields.io/bundlephobia/minzip/@tma.js/init-data-node)
[![code-badge]](https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/init-data-node)

The package provides utilities to work with the initialization data of Telegram Mini Apps on the
server side. To learn more about the initialization data and its usage, please refer to
the [documentation](https://docs.telegram-mini-apps.com/platform/launch-parameters/common-information).

### `@tma.js/solid-router-integration`

[solid-router-integration-npm-badge]: https://img.shields.io/npm/v/@tma.js/solid-router-integration?logo=npm

[![docs-badge]](https://docs.telegram-mini-apps.com/packages/tma-js-solid-router-integration)
[![solid-router-integration-npm-badge]](https://npmjs.com/package/@tma.js/solid-router-integration)
![Size](https://img.shields.io/bundlephobia/minzip/@tma.js/solid-router-integration)
[![code-badge]](https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/solid-router-integration)

Telegram Mini Apps [Navigator](https://docs.telegram-mini-apps.com/packages/tma-js-sdk/navigation)
integration for [@solidjs/router](https://www.npmjs.com/package/@solidjs/router).

### `@tma.js/react-router-integration`

[react-router-integration-npm-badge]: https://img.shields.io/npm/v/@tma.js/react-router-integration?logo=npm

[![docs-badge]](https://docs.telegram-mini-apps.com/packages/tma-js-react-router-integration)
[![react-router-integration-npm-badge]](https://npmjs.com/package/@tma.js/react-router-integration)
![Size](https://img.shields.io/bundlephobia/minzip/@tma.js/react-router-integration)
[![code-badge]](https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/react-router-integration)

Telegram Mini Apps [Navigator](https://docs.telegram-mini-apps.com/packages/tma-js-sdk/navigation)
integration for [react-router-dom](https://www.npmjs.com/package/react-router-dom).

## Why not Telegram SDK

Why bother creating a project like `@tma.js` when there are existing solutions from the developers
who own the platform? The answer is rather simple: the currently provided solution (SDK) does not
seem to meet the required minimum quality standards. Of course, the term 'quality' is rather
specific and subjective, but this section should make it more objective.

This project was born during the research of a solution provided by
Telegram - [telegram-web-app.js](https://telegram.org/js/telegram-web-app.js), which is considered
the only existing official SDK for Telegram Mini Apps by Telegram. Therefore, all the points
described in this section will be related to this package.

Because of the large section size, the complete motivation description has been moved to a [separate
document](./MOTIVATION.md).

## Contribution

Any contribution is appreaciated. To start contributing, please, follow
the [Contribution Guidelines](./CONTRIBUTING.md).
