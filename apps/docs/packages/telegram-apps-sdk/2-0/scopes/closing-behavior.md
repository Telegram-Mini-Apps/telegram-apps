# Closing Behavior

The scope responsible for the Telegram Mini
Apps [closing behavior](../../../../platform/closing-behavior.md).

## Mounting

Before using the scope, it is necessary to mount it to work with properly configured properties. To
do so, use the `mount` method. It will update the `isMounted` signal property.

```ts
import { closingBehavior } from '@telegram-apps/sdk';

closingBehavior.mount(); // closingBehavior.isMounted() -> true
```

To unmount, use the `unmount` method:

```ts
closingBehavior.unmount(); // closingBehavior.isMounted() -> false
```

## Changing Closing Confirmation

To change the closing confirmation behavior, use the `enableConfirmation()`
and `disableConfirmation()` methods. These methods update the `isConfirmationNeeded` signal property value.

```ts
closingBehavior.enableConfirmation();
// closingBehavior.isConfirmationNeeded() -> true

closingBehavior.disableConfirmation();
// closingBehavior.isConfirmationNeeded() -> false
```
