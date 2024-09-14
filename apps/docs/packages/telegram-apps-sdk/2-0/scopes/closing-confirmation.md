# Closing Confirmation

The scope responsible for the Telegram Mini
Apps [closing behavior](../../../../platform/closing-behavior.md).

## Mounting

Before using the scope, it is necessary to mount it to work with properly configured properties. To
do so, use the `mount` method. It will update the `isMounted` signal property.

```ts
import { closingConfirmation } from '@telegram-apps/sdk';

closingConfirmation.mount(); // closingConfirmation.isMounted() -> true
```

To unmount, use the `unmount` method:

```ts
closingConfirmation.unmount(); // closingConfirmation.isMounted() -> false
```

Alternative functional approach:

```ts
import {
  mountClosingConfirmation,
  unmountClosingConfirmation,
  isClosingConfirmationMounted,
} from '@telegram-apps/sdk';

mountClosingConfirmation(); // isClosingConfirmationMounted() -> true
unmountClosingConfirmation(); // isClosingConfirmationMounted() -> false
```

## Enabling and Disabling

To change the closing confirmation behavior, use the `enable()` and `disable()` methods. These
methods update the `isEnabled` signal property value.

```ts
closingConfirmation.enable();
// closingConfirmation.isEnabled() -> true

closingConfirmation.disable();
// closingConfirmation.isEnabled() -> false
```

Using functions:

```ts
import {
  enableClosingConfirmation,
  disableClosingConfirmation,
  isClosingConfirmationEnabled,
} from '@telegram-apps/sdk';

if (enableClosingConfirmation.isSupported()) {
  enableClosingConfirmation();
  // isClosingConfirmationEnabled() -> true
}

if (disableClosingConfirmation.isSupported()) {
  disableClosingConfirmation.hide();
  // isClosingConfirmationEnabled() -> false
}
```