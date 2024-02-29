# `ClosingBehavior`

Implements Telegram Mini
Apps [closing behavior](../../../platform/closing-behavior.md) functionality.

## Initialization

Component constructor accepts closing confirmation needed flag and optional function to call
Telegram Mini Apps methods.

```typescript
import { ClosingBehavior, postEvent } from '@tma.js/sdk';

const closingBehaviour = new ClosingBehavior(false, postEvent);  
```

## Closing confirmation

To enable and disable closing confirmation, it is required to use `enableConfirmation()`
and `disableConfirmation()` methods. These methods update `isConfirmationNeeded` property:

```typescript  
closingBehaviour.enableConfirmation();
console.log(closingBehaviour.isConfirmationNeeded); // true  

closingBehaviour.disableConfirmation();
console.log(closingBehaviour.isConfirmationNeeded); // false
```

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event                       | Listener                   | Triggered when                          |
|-----------------------------|----------------------------|-----------------------------------------|
| change                      | `() => void`               | Something in component changed          |
| change:isConfirmationNeeded | `(value: boolean) => void` | `isConfirmationNeeded` property changed |