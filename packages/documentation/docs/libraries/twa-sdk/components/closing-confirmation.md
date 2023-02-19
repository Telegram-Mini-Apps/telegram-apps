# `ClosingConfirmation`

Controls application closing behavior. 

To learn more, visit description of this feature
in [documentation](../../../features/closing-behavior.md).

## Init

```typescript  
import {ClosingConfirmation} from '@twa.js/sdk';  
import {init} from '@twa.js/bridge';  
  
const closingConfirmation = new ClosingConfirmation(init());  
```

## Enabling and disabling

```typescript  
// Enable closing confirmation.
closingConfirmation.enable();  
console.log(closingConfirmation.isEnabled); // true  
  
// Disable closing confirmation.
closingConfirmation.disable();  
console.log(closingConfirmation.isEnabled); // false  
```  

## Events

Events available for [listening](../about#events):

- `isEnabledChanged: (isEnabled: boolean) => void`
