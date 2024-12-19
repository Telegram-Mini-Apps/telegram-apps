# Home Screen

## `addToHomeScreen`

To prompt the user to add the Mini App to the home screen, use the `addToHomeScreen` function.

::: code-group

```ts [Using isAvailable]
import { addToHomeScreen } from '@telegram-apps/sdk';

if (addToHomeScreen.isAvailable()) {
  addToHomeScreen();
}
```

```ts [Using ifAvailable]
import { addToHomeScreen } from '@telegram-apps/sdk';

addToHomeScreen.ifAvailable();
```

:::

To track whether the current Mini App is added to the device's home screen, use
the `onAddedToHomeScreen` and `offAddedToHomeScreen` functions:

```ts
import {
  onAddedToHomeScreen,
  onAddToHomeScreenFailed,
  offAddedToHomeScreen,
  offAddToHomeScreenFailed,
} from '@telegram-apps/sdk';

function onAdded() {
  console.log('Added');
}

onAddedToHomeScreen(onAdded);
offAddedToHomeScreen(onAdded);

function onFailed() {
  console.log('User declined the request');
}

onAddToHomeScreenFailed(onFailed);
offAddToHomeScreenFailed(onFailed);
```

> [!NOTE]  
> If the device cannot determine the installation status, the corresponding event may not be
> received even if the icon has been added.

## `checkHomeScreenStatus`

The `checkHomeScreenStatus` function checks if the user has already added the Mini App to the
device's home screen.

```ts
import { checkHomeScreenStatus } from '@telegram-apps/sdk';

if (checkHomeScreenStatus.isAvailable()) {
  checkHomeScreenStatus().then(status => {
    console.log(status);
  });
}
```
