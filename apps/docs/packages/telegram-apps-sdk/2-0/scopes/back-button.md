# Back Button

The scope responsible for the Telegram Mini Apps [back button](../../../../platform/back-button.md).

## Mounting

Before using the scope, it is necessary to mount it to work with properly configured properties. To
do so, use the `mount` method.

```ts
import { backButton } from '@telegram-apps/sdk';

backButton.mount();
```

To unmount, use the `unmount` method:

```ts
backButton.unmount();
```

## Visibility

To change the button's visibility, use the `hide()` and `show()` methods. These methods update
the `isVisible` signal property value.

```ts
backButton.show(); // backButton.isVisible() -> true
backButton.hide(); // backButton.isVisible() -> false
```

## Click Listeners

To add a button click listener, use the `onClick` method. It returns a function to remove the bound
listener. Alternatively, you can use the `offClick` method.

```ts
function listener() {
  console.log('Clicked!');
}

const removeListener = backButton.onClick(listener);
removeListener();
// Or
backButton.offClick(listener);
```