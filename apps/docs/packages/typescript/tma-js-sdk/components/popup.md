# `Popup`

Implements Telegram Mini Apps [popup](../../../../platform/ui/popup.md).

## Initialization

Component constructor accepts Telegram Mini Apps version and optional function to call Telegram Mini
Apps methods.

```typescript
import { Popup, postEvent } from '@tma.js/sdk';

const popup = new Popup('6.3', postEvent);
```

## Opening new popup

To open a popup, it is required to call the `open` method specifying popup properties: title,
message, and a list of up to 3 buttons.

```typescript
popup.open({
  title: 'Hello!',
  message: 'Here is a test message.',
  buttons: [{ id: 'my-id', type: 'default', text: 'Default text' }]
});
console.log(popup.isOpened); // true
```

This method returns a promise, which will be fulfilled with the clicked button identifier. In the
case where the user didn't click any button, the method will return `null`.

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event            | Listener                   | Triggered when                 |
|------------------|----------------------------|--------------------------------|
| changed          | `() => void`               | Something in component changed |
| changed:isOpened | `(value: boolean) => void` | `isOpened` property changed    |

## Methods support

List of methods, which could be used in `supports` component instance method:

- `open`

```typescript
import { Popup } from '@tma.js/sdk';

const popup = new Popup(...);
popup.supports('open');
```
