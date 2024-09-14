# Closing Confirmation

The scope responsible for the Telegram Mini
Apps [closing behavior](../../../../platform/closing-behavior.md).

## Mounting

Before using the scope, it is necessary to mount it to work with properly configured properties. To
do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Using object]
import { closingConfirmation } from '@telegram-apps/sdk';

closingConfirmation.mount(); // closingConfirmation.isMounted() -> true
```

```ts [Using functions]
import {
  mountClosingConfirmation,
  isClosingConfirmationMounted,
} from '@telegram-apps/sdk';

mountClosingConfirmation(); // isClosingConfirmationMounted() -> true
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Using object]
closingConfirmation.unmount(); // closingConfirmation.isMounted() -> false
```

```ts [Using functions]
import { unmountClosingConfirmation } from '@telegram-apps/sdk';

unmountClosingConfirmation(); // isClosingConfirmationMounted() -> false
```

:::

## Enabling and Disabling

To change the closing confirmation behavior, use the `enable()` and `disable()` methods. These
methods update the `isEnabled` signal property value.

::: code-group

```ts [Using object]
closingConfirmation.enable();
// closingConfirmation.isEnabled() -> true

closingConfirmation.disable();
// closingConfirmation.isEnabled() -> false
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