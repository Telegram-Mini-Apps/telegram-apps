# `ClosingBehaviour`

Controls the application closing behavior. There is more information about this functionality in
this [documentation](../../../../platform/functionality/closing-behavior.md).

## Initialization

Component constructor accepts closing confirmation needed flag and optional function to call
Telegram Mini Apps methods.

```typescript
import { postEvent } from '@tma.js/bridge';
import { ClosingBehaviour } from '@tma.js/sdk';

const closingBehaviour = new ClosingBehaviour(false, postEvent);  
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

- `isConfirmationNeededChanged: (isConfirmationNeeded: boolean) => void`
