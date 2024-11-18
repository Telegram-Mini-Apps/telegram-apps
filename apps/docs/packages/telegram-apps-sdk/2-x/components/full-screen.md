# Full Screen

The 💠[component](../scopes.md) responsible for the Telegram Mini Apps full screen mode.

## Checking Support

To check if the full screen supported by the current Telegram Mini Apps version, the
`isSupported` method is used:

::: code-group

```ts [Variable]
import { fullScreen } from '@telegram-apps/sdk';

fullScreen.isSupported(); // boolean
```

```ts [Functions]
import { isFullScreenSupported } from '@telegram-apps/sdk';

isFullScreenSupported(); // boolean
```

:::

## Mounting

Before using the component, it is necessary to mount it to work with properly configured properties.
To do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Variable]
import { fullScreen } from '@telegram-apps/sdk';

if (fullScreen.mount.isAvailable()) {
  fullScreen.mount();
  fullScreen.isMounted(); // true
}
```

```ts [Functions]
import {
  mountFullScreen,
  isFullScreenMounted,
} from '@telegram-apps/sdk';

if (mountFullScreen.isAvailable()) {
  mountFullScreen();
  isFullScreenMounted(); // true
}
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
fullScreen.unmount();
fullScreen.isMounted(); // false
```

```ts [Functions]
import {
  unmountFullScreen,
  isFullScreenMounted,
} from '@telegram-apps/sdk';

unmountFullScreen(); 
isFullScreenMounted(); // false
```

:::

## Controlling Full Screen

To enable or disable full screen mode, use the `requestFullScreen` and `exitFullScreen` methods.
Calling these methods, update the `isFullScreen` signal property value.

Async methods `requestFullScreen` and `exitFullScreen` returns promise of type `FullScreenState`:
- **true** - FullScreen enabled.
- **false** - FullScreen disabled.
- **ALREADY_FULLSCREEN** – The Mini App is already in fullscreen mode.
- **UNSUPPORTED** – Fullscreen mode is not supported on this device or platform.
- **string** – Any other error received by requests.

::: code-group

```ts [Variable]
if (fullScreen.requestFullScreen.isAvailable()) {
  fullScreen.requestFullScreen((response) => console.log(response)); // true
  fullScreen.isFullScreen(); // true
}

if (fullScreen.exitFullScreen.isAvailable()) {
  fullScreen.exitFullScreen((response) => console.log(response)); // false
  fullScreen.isFullScreen(); // false
}

// better to check if application is already in full screen
if (fullScreen.requestFullScreen.isAvailable() && !fullScreen.isFullScreen()) {
  fullScreen.requestFullScreen((response) => console.log(response)); // true
}

// otherwise you could receive 'ALREADY_FULLSCREEN'
if (fullScreen.requestFullScreen.isAvailable()) {
  fullScreen.requestFullScreen((response) => console.log(response)); // ALREADY_FULLSCREEN
}

// if somehow current device doesn't support full screen mode, you will receive 'UNSUPPORTED'
if (fullScreen.requestFullScreen.isAvailable()) {
  fullScreen.requestFullScreen((response) => console.log(response)); // UNSUPPORTED
}
```

```ts [Functions]
import {
  requestFullScreen,
  exitFullScreen,
  isFullScreen,
} from '@telegram-apps/sdk';

if (requestFullScreen.isAvailable()) {
  requestFullScreen((response) => console.log(response)); // true
  isFullScreen(); // true
}

if (exitFullScreen.isAvailable()) {
  exitFullScreen((response) => console.log(response)); // false
  isFullScreen(); // false
}

// better to check if application is already in full screen
if (requestFullScreen.isAvailable() && !isFullScreen()) {
  requestFullScreen((response) => console.log(response)); // true
}

// otherwise you could receive 'ALREADY_FULLSCREEN'
if (requestFullScreen.isAvailable()) {
  requestFullScreen((response) => console.log(response)); // ALREADY_FULLSCREEN
}

// if somehow current device doesn't support full screen mode, you will receive 'UNSUPPORTED'
if (requestFullScreen.isAvailable()) {
  requestFullScreen((response) => console.log(response)); // UNSUPPORTED
}
```

:::