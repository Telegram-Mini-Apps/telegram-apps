# `SwipeBehavior`

Implements Telegram Mini
Apps [swipe behavior](../../../platform/swipe-behavior.md) functionality.

## Initialization

To initialize the component, use the `initSwipeBehavior` function:

```typescript
import {initSwipeBehavior} from '@telegram-apps/sdk';

const [swipeBehavior] = initSwipeBehavior();  
```

## Swipe Behavior

To enable and disable vertical swipes, it is required to use `enableVerticalSwipes()`
and `disableVerticalSwipes()` methods. These methods update `isVerticalSwipesEnabled` property:

```typescript  
swipeBehavior.enableVerticalSwipes();
console.log(swipeBehavior.isVerticalSwipesEnabled); // true  

swipeBehavior.disableVerticalSwipes();
console.log(swipeBehavior.isVerticalSwipesEnabled); // false
```

## Events

List of events, which could be [tracked](../components#events):

| Event                            | Listener                   | Triggered when                             |
|----------------------------------|----------------------------|--------------------------------------------|
| `change`                         | `() => void`               | Something in component changed             |
| `change:isVerticalSwipesEnabled` | `(value: boolean) => void` | `isVerticalSwipesEnabled` property changed |