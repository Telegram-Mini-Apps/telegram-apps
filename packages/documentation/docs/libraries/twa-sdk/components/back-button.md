# `BackButton`

Controls the back button displayed in the header of the Web App in the
Telegram interface. It is mostly used in case, when you want to provide a way to
go back in routing history or rollback some action.

To learn more, visit description of this feature
in [documentation](../../../features/back-button).

## Init

```typescript  
import {BackButton} from '@twa.js/sdk';  
import {init} from '@twa.js/bridge';  
  
const backButton = new BackButton(init(), '6.3');  
```  

## Showing and hiding

```typescript  
// Show back button.  
backButton.show();  
console.log(backButton.isVisible); // true  
  
// Hide back button.  
backButton.hide();  
console.log(backButton.isVisible); // false  
```  

## Events

Events available for [listening](../about#events):

- `click: () => void`
- `isVisibleChanged: (isVisible: boolean) => void`

## Methods support

Methods available for [support check](../about#methods-support):

- `show`
- `hide`  