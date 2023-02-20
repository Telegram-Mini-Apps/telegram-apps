# `BackButton`

Controls the back button displayed in the header of the Web App in the
Telegram interface. It is mostly used in case, when developer wants to provide
a way to go back in routing history or rollback some action. There is more
information about this component in this
[documentation](../../../features/back-button).

## Initialization

```typescript  
import {BackButton} from '@twa.js/sdk';
import {Bridge} from '@twa.js/bridge';

const backButton = new BackButton(Bridge.init(), '6.3');  
```  

## Showing and hiding

To show and hide `BackButton`, it is required to use `show()` and `hide()`
functions. These methods update the button's `isVisible` property: 

```typescript  
backButton.show();
console.log(backButton.isVisible); // true  

backButton.hide();
console.log(backButton.isVisible); // false  
```  

## Events

Events available for the [listening](../about#events):

- `click: () => void`
- `isVisibleChanged: (isVisible: boolean) => void`

## Methods support

Methods available for the [support check](../about#methods-support):

- `show`
- `hide`  