# `Popup`

The component which controls the currently displayed application [popup](../../../../platform/ui/popup.md).

## Initialization

Component constructor accepts Telegram Mini Apps version and optional function to call Telegram Mini
Apps methods.

```typescript
import { postEvent } from '@tma.js/bridge';
import { Popup } from '@tma.js/sdk';

const popup = new Popup('6.3', postEvent);
```

## Opening new popup

The `open` function returns a promise which will be resolved in case, the opened popup was
closed. `Popup` will resolve a button identifier in case, a user clicked it. Otherwise, `null` will
be resolved.

```typescript
popup.open({
  title: 'Hello!',
  message: 'Here is a test message.',
  buttons: [{ id: 'my-id', type: 'default', text: 'Default text' }]
});
console.log(popup.isOpened); // true
```

## Events

List of events, which could be used in `on` and `off` component instance methods:

- `isOpenedChanged: (isOpened: boolean) => void`

## Methods support

List of methods, which could be used in `supports` component instance method:

- `open` - to check if the `open` method supported.
- `hide` - to check if the `hide` method supported.
