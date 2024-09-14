# Main Button

The scope responsible for the Telegram Mini Apps [back button](../../../../platform/main-button.md).

## Mounting

Before using the scope, it is necessary to mount it to work with properly configured properties. To
do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Using object]
import { mainButton } from '@telegram-apps/sdk';

mainButton.mount(); // mainButton.isMounted() -> true
```

```ts [Using functions]
import { mountMainButton, isMainButtonMounted } from '@telegram-apps/sdk';

mountMainButton(); // isMainButtonMounted() -> true
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Using object]
mainButton.unmount(); // mainButton.isMounted() -> false
```

```ts [Using functions]
import { unmountMainButton } from '@telegram-apps/sdk';

unmountMainButton(); // isMainButtonMounted() -> false
```

:::

## Settings Properties

To update the button properties, use the `setParams` method. It accepts an object with optional
properties, each responsible for its own button trait.

In turn, calling this method updates such signals as `backgroundColor`,`isVisible`, `isEnabled`,
`isLoaderVisible`, `state`, `textColor` and `text`.

::: code-group

```ts [Using object]
mainButton.setParams({
  backgroundColor: '#000000',
  isEnabled: true,
  isLoaderVisible: true,
  isVisible: true,
  text: 'My text',
  textColor: '#ffffff'
});
mainButton.backgroundColor(); // '#000000'
mainButton.isEnabled(); // true
mainButton.isLoaderVisible(); // true
mainButton.isVisible(); // true
mainButton.text(); // 'My text'
mainButton.textColor(); // '#ffffff'

mainButton.state();
// {
//   backgroundColor: '#000000',
//   isActive: true,
//   isLoaderVisible: true,
//   isVisible: true,
//   text: 'My text',
//   textColor: '#ffffff'
// }
```

```ts [Using functions]
import { 
  setMainButtonParams,
  mainButtonBackgroundColor,
  isMainButtonVisible,
  isMainButtonEnabled,
  isMainButtonLoaderVisible,
  mainButtonState,
  mainButtonTextColor,
  mainButtonText,
} from '@telegram-apps/sdk';

setMainButtonParams({
  backgroundColor: '#000000',
  isEnabled: true,
  isLoaderVisible: true,
  isVisible: true,
  text: 'My text',
  textColor: '#ffffff'
});
mainButtonBackgroundColor(); // '#000000'
isMainButtonEnabled(); // true
isMainButtonLoaderVisible(); // true
isMainButtonVisible(); // true
mainButtonText(); // 'My text'
mainButtonTextColor(); // '#ffffff'

mainButtonState();
// {
//   backgroundColor: '#000000',
//   isActive: true,
//   isLoaderVisible: true,
//   isVisible: true,
//   text: 'My text',
//   textColor: '#ffffff'
// }
```

:::

## Tracking Click

To add a button click listener, use the `onClick` method. It returns a function to remove the bound
listener. Alternatively, you can use the `offClick` method.

::: code-group

```ts [Using object]
const listener = () => console.log('Clicked!');

const removeListener = mainButton.onClick(listener);
removeListener();
// or
mainButton.onClick(listener);
mainButton.offClick(listener);
```

```ts [Using functions]
import { onMainButtonClick, offMainButtonClick } from '@telegram-apps/sdk';

const listener = () => console.log('Clicked!');

const removeListener = onMainButtonClick(listener);
removeListener();
// or
onMainButtonClick(listener);
offMainButtonClick(listener);
```

:::
