# Main Button

The 💠[component](../scopes.md) responsible for the Telegram Mini
Apps [main button](../../../../platform/main-button.md).

## Mounting

Before using this component, it is necessary to mount it to work with properly configured
properties. To do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Variable]
import { mainButton } from '@telegram-apps/sdk';

if (mainButton.mount.isAvailable()) {
  mainButton.mount();
  mainButton.isMounted(); // true
}
```

```ts [Functions]
import { mountMainButton, isMainButtonMounted } from '@telegram-apps/sdk';

if (mountMainButton.isAvailable()) {
  mountMainButton();
  isMainButtonMounted(); // true
}
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
mainButton.unmount(); 
mainButton.isMounted(); // false
```

```ts [Functions]
import { unmountMainButton, isMainButtonMounted } from '@telegram-apps/sdk';

unmountMainButton();
isMainButtonMounted(); // false
```

:::

> [!WARNING]
> This component's properties depend on values from the [Theme Params](theme-params.md) component.
> Make sure to mount Theme Params before using the Main Button.

## Settings Properties

To update the button properties, use the `setParams` method. It accepts an object with optional
properties, each responsible for its own button trait.

In turn, calling this method updates such signals
as `backgroundColor`, `hasShineEffect`, `isVisible`, `isEnabled`, `isLoaderVisible`, `state`, `textColor`
and `text`.

::: code-group

```ts [Variable]
if (mainButton.setParams.isAvailable()) {
  mainButton.setParams({
    backgroundColor: '#000000',
    hasShineEffect: true,
    isEnabled: true,
    isLoaderVisible: true,
    isVisible: true,
    text: 'My text',
    textColor: '#ffffff'
  });
  mainButton.backgroundColor(); // '#000000'
  mainButton.hasShineEffect(); // true
  mainButton.isEnabled(); // true
  mainButton.isLoaderVisible(); // true
  mainButton.isVisible(); // true
  mainButton.text(); // 'My text'
  mainButton.textColor(); // '#ffffff'

  mainButton.state();
  // {
  //   backgroundColor: '#000000',
  //   hasShineEffect: true,
  //   isActive: true,
  //   isLoaderVisible: true,
  //   isVisible: true,
  //   text: 'My text',
  //   textColor: '#ffffff'
  // }
}
```

```ts [Functions]
import {
  setMainButtonParams,
  mainButtonBackgroundColor,
  mainButtonHasShineEffect,
  isMainButtonVisible,
  isMainButtonEnabled,
  isMainButtonLoaderVisible,
  mainButtonState,
  mainButtonTextColor,
  mainButtonText,
} from '@telegram-apps/sdk';

if (setMainButtonParams.isAvailable()) {
  setMainButtonParams({
    backgroundColor: '#000000',
    hasShineEffect: true,
    isEnabled: true,
    isLoaderVisible: true,
    isVisible: true,
    text: 'My text',
    textColor: '#ffffff'
  });
  mainButtonBackgroundColor(); // '#000000'
  mainButtonHasShineEffect(); // true
  isMainButtonEnabled(); // true
  isMainButtonLoaderVisible(); // true
  isMainButtonVisible(); // true
  mainButtonText(); // 'My text'
  mainButtonTextColor(); // '#ffffff'

  mainButtonState();
  // {
  //   backgroundColor: '#000000',
  //   hasShineEffect: true,
  //   isActive: true,
  //   isLoaderVisible: true,
  //   isVisible: true,
  //   text: 'My text',
  //   textColor: '#ffffff'
  // }
}
```

:::

## Tracking Click

To add a button click listener, use the `onClick` method. It returns a function to remove the bound
listener. Alternatively, you can use the `offClick` method.

::: code-group

```ts [Variable]
if (mainButton.onClick.isAvailable()) {
  function listener() {
    console.log('Clicked!');
  }

  const offClick = mainButton.onClick(listener);
  offClick();
  // or
  mainButton.onClick(listener);
  mainButton.offClick(listener);
}
```

```ts [Functions]
import {
  onMainButtonClick,
  offMainButtonClick,
} from '@telegram-apps/sdk';

if (onMainButtonClick.isAvailable()) {
  function listener() {
    console.log('Clicked!');
  }

  const offClick = onMainButtonClick(listener);
  offClick();
  // or
  onMainButtonClick(listener);
  offMainButtonClick(listener);
}
```

:::
