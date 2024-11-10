# Settings Button

The 💠[component](../scopes.md) responsible for the Telegram Mini
Apps [settings button](../../../../platform/settings-button.md).

## Checking Support

To check if the settings button supported by the current Telegram Mini Apps version, the
`isSupported` method is used:

::: code-group

```ts [Variable]
import { settingsButton } from '@telegram-apps/sdk';

settingsButton.isSupported(); // boolean
```

```ts [Functions]
import { isSettingsButtonSupported } from '@telegram-apps/sdk';

isSettingsButtonSupported(); // boolean
```

:::

## Mounting

Before using the component, it is necessary to mount it to work with properly configured properties.
To do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Variable]
import { settingsButton } from '@telegram-apps/sdk';

if (settingsButton.mount.isAvailable()) {
  settingsButton.mount();
  settingsButton.isMounted(); // true
}
```

```ts [Functions]
import {
  mountSettingsButton,
  isSettingsButtonMounted,
} from '@telegram-apps/sdk';

if (mountSettingsButton.isAvailable()) {
  mountSettingsButton();
  isSettingsButtonMounted(); // true
}
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
settingsButton.unmount();
settingsButton.isMounted(); // false
```

```ts [Functions]
import { 
  unmountSettingsButton,
  isSettingsButtonMounted,
} from '@telegram-apps/sdk';

unmountSettingsButton();
isSettingsButtonMounted(); // false
```

:::

## Showing and Hiding

To change the button's visibility, use the `hide()` and `show()` methods. These methods update
the `isVisible` signal property value.

::: code-group

```ts [Variable]
if (settingsButton.show.isAvailable()) {
  settingsButton.show();
  settingsButton.isVisible(); // true
}

if (settingsButton.hide.isAvailable()) {
  settingsButton.hide();
  settingsButton.isVisible(); // false
}
```

```ts [Functions]
import {
  showSettingsButton,
  hideSettingsButton,
  isSettingsButtonVisible,
} from '@telegram-apps/sdk';

if (showSettingsButton.isAvailable()) {
  showSettingsButton();
  isSettingsButtonVisible(); // true
}

if (hideSettingsButton.isAvailable()) {
  hideSettingsButton();
  isSettingsButtonVisible(); // false
}
```

:::

## Tracking Click

To add a button click listener, use the `onClick` method. It returns a function to remove the bound
listener. Alternatively, you can use the `offClick` method.

::: code-group

```ts [Variable]
if (settingsButton.onClick.isAvailable()) {
  function listener() {
    console.log('Clicked!');
  }

  const offClick = settingsButton.onClick(listener);
  offClick();
  // or
  settingsButton.onClick(listener);
  settingsButton.offClick(listener);
}
```

```ts [Functions]
import {
  onSettingsButtonClick,
  offSettingsButtonClick,
} from '@telegram-apps/sdk';

if (onSettingsButtonClick.isAvailable()) {
  function listener() {
    console.log('Clicked!');
  }

  const offClick = onSettingsButtonClick(listener);
  offClick();
  // or
  onSettingsButtonClick(listener);
  offSettingsButtonClick(listener);
}
```

:::
