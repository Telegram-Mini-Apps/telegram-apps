# `SwipeBehavior`

Implements Telegram Mini Apps [swipe behavior](../../../platform/swipe-behavior.md) functionality.

## Initialization

To initialize the component, use the `initSwipeBehavior` function:

```typescript
import { initSwipeBehavior } from '@telegram-apps/sdk';

const [swipeBehavior] = initSwipeBehavior();  
```

## Vertical Swipe

By default, users are allowed to hide the application just by swiping the application down.
To prevent a possible closure, you can disable this behavior by calling the `disableVerticalSwipe()`
method, or enable via the `enableVerticalSwipe()` method. In turn,
both of these methods update the `isVerticalSwipeEnabled` property:

```typescript  
swipeBehavior.enableVerticalSwipe();
console.log(swipeBehavior.isVerticalSwipeEnabled); // true  

swipeBehavior.disableVerticalSwipe();
console.log(swipeBehavior.isVerticalSwipeEnabled); // false
```

## Events

List of events, which could be [tracked](../components#events):

| Event                           | Listener                   | Triggered when                            |
|---------------------------------|----------------------------|-------------------------------------------|
| `change`                        | `() => void`               | Something in component changed            |
| `change:isVerticalSwipeEnabled` | `(value: boolean) => void` | `isVerticalSwipeEnabled` property changed |

## Methods Support

List of methods, which could be used in [support checks](../components#methods-support):
`disableVerticalSwipe`, `enableVerticalSwipe`.