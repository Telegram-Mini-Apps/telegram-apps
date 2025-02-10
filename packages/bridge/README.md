# @telegram-apps/bridge

[code-badge]: https://img.shields.io/badge/source-black?logo=github

[docs-badge]: https://img.shields.io/badge/documentation-blue?logo=gitbook&logoColor=white

[link]: https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/bridge

[docs-link]: https://docs.telegram-mini-apps.com/packages/telegram-apps-bridge/2-x

[npm-link]: https://npmjs.com/package/@telegram-apps/bridge

[npm-badge]: https://img.shields.io/npm/v/@telegram-apps/bridge?logo=npm

[size-badge]: https://img.shields.io/bundlephobia/minzip/@telegram-apps/bridge

[![NPM][npm-badge]][npm-link]
![Size][size-badge]
[![docs-badge]][docs-link]
[![code-badge]][link]

The lowest level communication layer with Telegram Mini Apps.

This package provides fundamental utilities and types for developing applications on the Telegram
Mini Apps platform.

While a developer can use this package alone, it's recommended to use a higher-level package
like [@telegram-apps/sdk](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/3-x).

## Installation

```bash
pnpm i @telegram-apps/bridge
# or
npm i @telegram-apps/bridge
# or
yarn add @telegram-apps/bridge
```

## Usage

Here’s a basic example of how to use this package. For more details, refer to the package complete
[documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-bridge/2-x).

```ts
import { on, postEvent } from '@telegram-apps/bridge';

// Show the back button, wait for it to be clicked once,
// then hide it.
postEvent('web_app_setup_back_button', { is_visible: true });

const off = on('back_button_pressed', () => {
  postEvent('web_app_setup_back_button', { is_visible: false });
  off();
});
```