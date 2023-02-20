# `ClosingConfirmation`

Controls the application closing behavior. There is more
information about this component in this
[documentation](../../../features/closing-behavior).

## Initialization

```typescript  
import {ClosingConfirmation} from '@twa.js/sdk';  
import {Bridge} from '@twa.js/bridge';  
  
const closingConfirmation = new ClosingConfirmation(Bridge.init());  
```

## Enabling and disabling

To enable and disable closing confirmation, it is required to use `enable()`
and `disable()` functions. These methods update the `ClosingConfirmation` 
`isEnabled` property:

```typescript  
closingConfirmation.enable();  
console.log(closingConfirmation.isEnabled); // true  
  
closingConfirmation.disable();  
console.log(closingConfirmation.isEnabled); // false  
```  

## Events

Events available for the [listening](../about#events):

- `isEnabledChanged: (isEnabled: boolean) => void`
