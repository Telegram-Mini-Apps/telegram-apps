# `BackButton`

Implements Telegram Mini Apps [Back Button](../../../../platform/ui/back-button.md).

## Initialization

Component constructor accepts visibility state, Telegram Mini Apps version and optional function
to call Telegram Mini Apps methods.

```typescript
import { BackButton, postEvent } from '@tma.js/sdk';

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

| Event            | Listener                   | Triggered when                 |
|------------------|----------------------------|--------------------------------|
| click            | `() => void`               | Back Button was clicked        |
| change           | `() => void`               | Something in component changed |
| change:isVisible | `(value: boolean) => void` | `isVisible` property changed   |

## Methods Support

List of methods, which could be used in `supports` component instance method:

- `show`
- `hide`

```typescript
import { BackButton } from '@tma.js/sdk';

const backButton = new BackButton(...);
backButton.supports('show');
backButton.supports('hide');
```
