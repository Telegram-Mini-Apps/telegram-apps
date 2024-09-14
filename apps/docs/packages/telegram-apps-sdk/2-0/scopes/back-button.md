# Back Button

The scope responsible for the Telegram Mini Apps [back button](../../../../platform/back-button.md).

## Mounting

Before using the scope, it is necessary to mount it to work with properly configured properties. To
do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Using object]
import { backButton } from '@telegram-apps/sdk';

backButton.mount(); // backButton.isMounted() -> true
```

```ts [Using functions]
import { mountBackButton, isBackButtonMounted } from '@telegram-apps/sdk';

mountBackButton(); // isBackButtonMounted() -> true
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Using object]
backButton.unmount(); // backButton.isMounted() -> false
```

```ts [Using functions]
import { unmountBackButton } from '@telegram-apps/sdk';

unmountBackButton(); // isBackButtonMounted() -> false
```

:::


## Showing and Hiding

To change the button's visibility, use the `hide()` and `show()` methods. These methods update
the `isVisible` signal property value.

::: code-group

```ts [Using object]
if (backButton.show.isSupported()) {
  backButton.show(); // backButton.isVisible() -> true
}

if (backButton.hide.isSupported()) {
  backButton.hide(); // backButton.isVisible() -> false
}
```

```ts [Using functions]
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

:::

## Tracking Click

To add a button click listener, use the `onClick` method. It returns a function to remove the bound
listener. Alternatively, you can use the `offClick` method.

::: code-group

```ts [Using object]
const listener = () => console.log('Clicked!');

const removeListener = backButton.onClick(listener);
removeListener();
// or
backButton.onClick(listener);
backButton.offClick(listener);
```

```ts [Using functions]
import { onBackButtonClick, offBackButtonClick } from '@telegram-apps/sdk';

const listener = () => console.log('Clicked!');

const removeListener = onBackButtonClick(listener);
removeListener();
// or
onBackButtonClick(listener);
offBackButtonClick(listener);
```

:::
