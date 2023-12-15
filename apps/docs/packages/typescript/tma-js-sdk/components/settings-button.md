# `SettingsButton`

Implements Telegram Mini Apps [Settings Button](../../../../platform/ui/settings-button.md).

## Initialization

Component constructor accepts visibility state, Telegram Mini Apps version and optional function
to call Telegram Mini Apps methods.

```typescript
import { SettingsButton, postEvent } from '@tma.js/sdk';

const settingsButton = new SettingsButton(false, '6.3', postEvent);  
```  

## Showing and hiding

To show and hide the `SettingsButton`, it is required to use `show()` and `hide()` methods. These
methods update the button's `isVisible` property:

```typescript  
settingsButton.show();
console.log(settingsButton.isVisible); // true  

settingsButton.hide();
console.log(settingsButton.isVisible); // false  
```  

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event            | Listener                   | Triggered when                 |
|------------------|----------------------------|--------------------------------|
| click            | `() => void`               | Settings Button was clicked    |
| change           | `() => void`               | Something in component changed |
| change:isVisible | `(value: boolean) => void` | `isVisible` property changed   |

## Methods Support

List of methods, which could be used in `supports` component instance method:

- `show`
- `hide`

```typescript
import { SettingsButton } from '@tma.js/sdk';

const settingsButton = new SettingsButton(...);
settingsButton.supports('show');
settingsButton.supports('hide');
```
