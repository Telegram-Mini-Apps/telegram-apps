# Home Screen

## `addToHomeScreen`

To prompt the user to add the Mini App to the home screen, use the `addToHomeScreen` function.

```ts
import { addToHomeScreen } from '@tma.js/sdk';

addToHomeScreen();
```

To track whether the current Mini App is added to the device's home screen, use
the `onAddedToHomeScreen` and `offAddedToHomeScreen` functions:

```ts
import {
  onAddedToHomeScreen,
  onAddToHomeScreenFailed,
  offAddedToHomeScreen,
  offAddToHomeScreenFailed,
} from '@tma.js/sdk';

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
> If the device cannot determine the installation status, the corresponding event may not be received even if the icon
> has been added.

## `checkHomeScreenStatus`

The `checkHomeScreenStatus` function checks if the user has already added the Mini App to the
device's home screen.

```ts
import { checkHomeScreenStatus } from '@tma.js/sdk';

const status = await checkHomeScreenStatus();
```
