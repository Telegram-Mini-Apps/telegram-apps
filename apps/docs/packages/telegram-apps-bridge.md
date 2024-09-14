# @telegram-apps/bridge

<p style="display: flex; gap: 8px; min-height: 20px">
  <a href="https://npmjs.com/package/@telegram-apps/bridge">
    <img src="https://img.shields.io/npm/v/@telegram-apps/bridge?logo=npm"/>
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/@telegram-apps/bridge"/>
  <a href="https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/bridge">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

The lowest level communication layer with Telegram Mini Apps.

This package provides fundamental utilities and types for developing applications on the Telegram
Mini Apps platform. While you can use this package alone, it's recommended to use a higher-level
package like [@telegram-apps/sdk](telegram-apps-sdk.md).

## Installation

::: code-group

```bash [pnpm]
pnpm i @telegram-apps/bridge
```

```bash [npm]
npm i @telegram-apps/bridge
```

```bash [yarn]
yarn add @telegram-apps/bridge
```

:::

## Example

Here’s a basic example of how to use this package. For more details, refer to the next articles in
the documentation.

```ts
import {
  defineEventHandlers,
  on,
  postEvent,
} from '@telegram-apps/bridge';

// Define Mini Apps event handlers to receive 
// events from the Telegram native application.
defineEventHandlers();

// Show the back button, wait for it to be clicked once,
// then hide it.
postEvent('web_app_setup_back_button', { is_visible: true });

on('back_button_pressed', () => {
  postEvent('web_app_setup_back_button', { is_visible: false });
}, true);
```