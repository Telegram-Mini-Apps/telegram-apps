# Back Button

The scope responsible for the Telegram Mini Apps [back button](../../../../platform/back-button.md).

## Mounting

Before using the scope, it is necessary to mount it to work with properly configured properties. To
do so, use the `mount` method. It will update the `isMounted` signal property.

```ts
import { backButton } from '@telegram-apps/sdk';

backButton.mount(); // backButton.isMounted() -> true
```

To unmount, use the `unmount` method:

```ts
backButton.unmount(); // backButton.isMounted() -> false
```

Alternative functional approach:

```ts
import {
  mountBackButton,
  unmountBackButton,
  isBackButtonMounted,
} from '@telegram-apps/sdk';

mountBackButton(); // isBackButtonMounted() -> true
unmountBackButton(); // isBackButtonMounted() -> false
```

## Showing and Hiding

To change the button's visibility, use the `hide()` and `show()` methods. These methods update
the `isVisible` signal property value.

```ts
if (backButton.show.isSupported()) {
  backButton.show(); // backButton.isVisible() -> true
}

if (backButton.hide.isSupported()) {
  backButton.hide(); // backButton.isVisible() -> false
}
```

Using functions:

```ts
import {
  showBackButton,
  hideBackButton,
  isBackButtonVisible,
} from '@telegram-apps/sdk';

if (showBackButton.isSupported()) {
  showBackButton(); // isBackButtonVisible() -> true
}

if (hideBackButton.isSupported()) {
  hideBackButton.hide(); // isBackButtonVisible() -> false
}
```

## Tracking Click

To add a button click listener, use the `onClick` method. It returns a function to remove the bound
listener. Alternatively, you can use the `offClick` method.

```ts
const listener = () => console.log('Clicked!');

const removeListener = backButton.onClick(listener);
removeListener();
// or
backButton.onClick(listener);
backButton.offClick(listener);
```

Using functions:

```ts
import { onBackButtonClick, offBackButtonClick } from '@telegram-apps/sdk';

const listener = () => console.log('Clicked!');

const removeListener = onBackButtonClick(listener);
removeListener();
// or
onBackButtonClick(listener);
offBackButtonClick(listener);
```