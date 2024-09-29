# Swipe Behavior

The 💠[component](../scopes.md) responsible for the Telegram Mini Apps swipe behavior.

## Checking Support

To check if the swipe behavior supported by the current Telegram Mini Apps version, the
`isSupported` method is used:

::: code-group

```ts [Variable]
import { swipeBehavior } from '@telegram-apps/sdk';

swipeBehavior.isSupported(); // boolean
```

```ts [Functions]
import { isSwipeBehaviorSupported } from '@telegram-apps/sdk';

isSwipeBehaviorSupported(); // boolean
```

:::

## Mounting

Before using the component, it is necessary to mount it to work with properly configured properties.
To do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Variable]
import { swipeBehavior } from '@telegram-apps/sdk';

swipeBehavior.mount();
swipeBehavior.isMounted(); // true
```

```ts [Functions]
import {
  mountSwipeBehavior,
  isSwipeBehaviorMounted,
} from '@telegram-apps/sdk';

mountSwipeBehavior(); 
isSwipeBehaviorMounted(); // true
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
swipeBehavior.unmount(); 
swipeBehavior.isMounted(); // false
```

```ts [Functions]
import {
  unmountClosingBehavior,
  isSwipeBehaviorMounted,
} from '@telegram-apps/sdk';

unmountSwipeBehavior(); 
isSwipeBehaviorMounted(); // false
```

:::

## Controlling Vertical Swipes

To enable or disable vertical swipes, use the `enableVertical` and `disableVertical` methods.
Calling these methods, update the `isVerticalEnabled` signal property value.

::: code-group

```ts [Variable]
swipeBehavior.enableVertical();
swipeBehavior.isVerticalEnabled(); // true

swipeBehavior.disableVertical();
swipeBehavior.isVerticalEnabled(); // false
```

```ts [Functions]
import {
  enableVerticalSwipes,
  disableVerticalSwipes,
  isVerticalSwipesEnabled,
} from '@telegram-apps/sdk';

enableVerticalSwipes();
isVerticalSwipesEnabled(); // true

disableVerticalSwipes();
isVerticalSwipesEnabled(); // false
```

:::