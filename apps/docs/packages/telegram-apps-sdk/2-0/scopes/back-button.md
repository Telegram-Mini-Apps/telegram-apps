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

## Showing and Hiding

To change the button's visibility, use the `hide()` and `show()` methods. These methods update
the `isVisible` signal property value.

```ts
backButton.show(); // backButton.isVisible() -> true
backButton.hide(); // backButton.isVisible() -> false
```

To check if these methods are supported, use the `isSupported()` method.

```ts
backButton.show.isSupported() && backButton.show();
backButton.hide.isSupported() && backButton.hide();
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