# Closing Behavior

The 💠[component](../scopes.md) responsible for the Telegram Mini
Apps [closing behavior](../../../../platform/closing-behavior.md).

## Mounting

Before using this component, it is necessary to mount it to work with properly configured
properties. To do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Variable]
import { closingBehavior } from '@telegram-apps/sdk';

if (closingBehavior.mount.isAvailable()) {
  closingBehavior.mount();
  closingBehavior.isMounted(); // true
}
```

```ts [Functions]
import {
  mountClosingBehavior,
  isClosingBehaviorMounted,
} from '@telegram-apps/sdk';

if (mountClosingBehavior.isAvailable()) {
  mountClosingBehavior();
  isClosingBehaviorMounted(); // true
}
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
closingBehavior.unmount();
closingBehavior.isMounted(); // false
```

```ts [Functions]
import {
  unmountClosingBehavior,
  isClosingBehaviorMounted,
} from '@telegram-apps/sdk';

unmountClosingBehavior();
isClosingBehaviorMounted(); //  false
```

:::

## Closing Confirmation

To change the closing confirmation behavior, use the `enableConfirmation()`
and `disableConfirmation()` methods. These methods update the `isConfirmationEnabled` signal
property value.

::: code-group

```ts [Variable]
if (closingBehavior.enableConfirmation.isAvailable()) {
  closingBehavior.enableConfirmation();
  closingBehavior.isConfirmationEnabled(); // true
}

if (closingBehavior.disableConfirmation.isAvailable()) {
  closingBehavior.disableConfirmation();
  closingBehavior.isConfirmationEnabled(); // false
}
```

```ts [Functions]
import {
  enableClosingConfirmation,
  disableClosingConfirmation,
} from '@telegram-apps/sdk';

if (enableClosingConfirmation.isAvailable()) {
  enableClosingConfirmation();
  isClosingConfirmationEnabled(); // true
}

if (disableClosingConfirmation.isAvailable()) {
  disableClosingConfirmation();
  isClosingConfirmationEnabled(); // false
}
```

:::