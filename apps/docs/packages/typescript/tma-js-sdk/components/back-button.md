# `BackButton`

Controls the [Back Button](../../../../platform/ui/back-button.md) displayed in the header of the Mini App in
the Telegram interface.

## Initialization

Component constructor accepts visibility state, Telegram Mini Apps version and optional function
to call Telegram Mini Apps methods.

```typescript
import { postEvent } from '@tma.js/bridge';
import { BackButton } from '@tma.js/sdk';

const backButton = new BackButton(false, '6.3', postEvent);  
```  

## Showing and hiding

To show and hide `BackButton`, it is required to use `show()` and `hide()` methods. These methods
update the button's `isVisible` property:

```typescript  
backButton.show();
console.log(backButton.isVisible); // true  

backButton.hide();
console.log(backButton.isVisible); // false  
```  

## Events

List of events, which could be used in `on` and `off` component instance methods:

- `click: () => void`
- `isVisibleChanged: (isVisible: boolean) => void`

## Methods support

List of methods, which could be used in `supports` component instance method:

- `show` - to check if the `show` method supported.
- `hide` - to check if the `hide` method supported.
