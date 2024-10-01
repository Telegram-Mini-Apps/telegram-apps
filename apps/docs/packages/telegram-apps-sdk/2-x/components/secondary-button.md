# Secondary Button

The 💠[component](../scopes.md) responsible for the Telegram Mini Apps Secondary Button.

## Checking Support

To check if the Secondary Button is supported by the current Telegram Mini Apps version, use the
`isSupported` method:

::: code-group

```ts [Variable]
import { secondaryButton } from '@telegram-apps/sdk';

secondaryButton.isSupported(); // boolean
```

```ts [Functions]
import { isSecondaryButtonSupported } from '@telegram-apps/sdk';

isSecondaryButtonSupported(); // boolean
```

:::

## Mounting

Before using this component, it is necessary to mount it to work with properly configured
properties. To do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Variable]
import { secondaryButton } from '@telegram-apps/sdk';

secondaryButton.mount();
secondaryButton.isMounted(); // true
```

```ts [Functions]
import {
  mountSecondaryButton,
  isSecondaryButtonMounted,
} from '@telegram-apps/sdk';

mountSecondaryButton();
isSecondaryButtonMounted(); // true
```

:::

> [!INFO]
> To extract correctly configured values from theme parameters, this method also mounts
> the [Theme Params](theme-params.md) scope.

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
secondaryButton.unmount();
secondaryButton.isMounted(); // false
```

```ts [Functions]
import {
  unmountSecondaryButton,
  isSecondaryButtonMounted,
} from '@telegram-apps/sdk';

unmountSecondaryButton();
isSecondaryButtonMounted(); // false
```

:::

## Settings Properties

To update the button properties, use the `setParams` method. It accepts an object with optional
properties, each responsible for its own button trait.

In turn, calling this method updates such signals
as `backgroundColor`, `hasShineEffect`, `isVisible`, `isEnabled`, `isLoaderVisible`, `position`,
`state`, `textColor` and `text`.

::: code-group

```ts [Variable]
secondaryButton.setParams({
  backgroundColor: '#000000',
  hasShineEffect: true,
  isEnabled: true,
  isLoaderVisible: true,
  isVisible: true,
  position: 'top',
  text: 'My text',
  textColor: '#ffffff'
});
secondaryButton.backgroundColor(); // '#000000'
secondaryButton.hasShineEffect(); // true
secondaryButton.isEnabled(); // true
secondaryButton.isLoaderVisible(); // true
secondaryButton.isVisible(); // true
secondaryButton.position(); // 'top'
secondaryButton.text(); // 'My text'
secondaryButton.textColor(); // '#ffffff'

secondaryButton.state();
// {
//   backgroundColor: '#000000',
//   hasShineEffect: true,
//   isActive: true,
//   isLoaderVisible: true,
//   isVisible: true,
//   position: 'top',
//   text: 'My text',
//   textColor: '#ffffff'
// }
```

```ts [Functions]
import {
  setSecondaryButtonParams,
  secondaryButtonBackgroundColor,
  secondaryButtonHasShineEffect,
  isSecondaryButtonVisible,
  isSecondaryButtonEnabled,
  isSecondaryButtonLoaderVisible,
  secondaryButtonState,
  secondaryButtonTextColor,
  secondaryButtonText,
  secondaryButtonPosition,
} from '@telegram-apps/sdk';

setSecondaryButtonParams({
  backgroundColor: '#000000',
  hasShineEffect: true,
  isEnabled: true,
  isLoaderVisible: true,
  isVisible: true,
  position: 'top',
  text: 'My text',
  textColor: '#ffffff'
});
secondaryButtonBackgroundColor(); // '#000000'
secondaryButtonHasShineEffect(); // true
isSecondaryButtonEnabled(); // true
isSecondaryButtonLoaderVisible(); // true
isSecondaryButtonVisible(); // true
secondaryButtonPosition(); // 'top'
secondaryButtonText(); // 'My text'
secondaryButtonTextColor(); // '#ffffff'

secondaryButtonState();
// {
//   backgroundColor: '#000000',
//   hasShineEffect: true,
//   isActive: true,
//   isLoaderVisible: true,
//   isVisible: true,
//   position: 'top',
//   text: 'My text',
//   textColor: '#ffffff'
// }
```

:::

## Tracking Click

To add a button click listener, use the `onClick` method. It returns a function to remove the bound
listener. Alternatively, you can use the `offClick` method.

::: code-group

```ts [Variable]
function listener() {
  console.log('Clicked!');
}

const offClick = secondaryButton.onClick(listener);
offClick();
// or
secondaryButton.onClick(listener);
secondaryButton.offClick(listener);
```

```ts [Functions]
import {
  onSecondaryButtonClick,
  offSecondaryButtonClick,
} from '@telegram-apps/sdk';

function listener() {
  console.log('Clicked!');
}

const offClick = onSecondaryButtonClick(listener);
offClick();
// or
onSecondaryButtonClick(listener);
offSecondaryButtonClick(listener);
```

:::
