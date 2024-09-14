# Closing Behavior

The scope responsible for the Telegram Mini
Apps [closing behavior](../../../../platform/closing-behavior.md).

## Mounting

Before using the scope, it is necessary to mount it to work with properly configured properties. To
do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Using object]
import { closingBehavior } from '@telegram-apps/sdk';

closingBehavior.mount(); // closingBehavior.isMounted() -> true
```

```ts [Using functions]
import {
  mountclosingBehavior,
  isClosingBehaviorMounted,
} from '@telegram-apps/sdk';

mountclosingBehavior(); // isclosingBehaviorMounted() -> true
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Using object]
closingBehavior.unmount(); // closingBehavior.isMounted() -> false
```

```ts [Using functions]
import { unmountClosingBehavior } from '@telegram-apps/sdk';

unmountclosingBehavior(); // isclosingBehaviorMounted() -> false
```

:::

## Enabling and Disabling Confirmation

To change the closing confirmation behavior, use the `enableConfirmation()`
and `disableConfirmation()` methods. These methods update the `isConfirmationEnabled` signal
property value.

::: code-group

```ts [Using object]
closingBehavior.enableConfirmation();
// closingBehavior.isConfirmationEnabled() -> true

closingBehavior.disableConfirmation();
// closingBehavior.isConfirmationEnabled() -> false
```

```ts [Using functions]
import {
  enableClosingConfirmation,
  disableClosingConfirmation,
} from '@telegram-apps/sdk';

enableClosingConfirmation();
// isClosingConfirmationEnabled() -> true

disableClosingConfirmation();
// isClosingConfirmationEnabled() -> false
```

:::