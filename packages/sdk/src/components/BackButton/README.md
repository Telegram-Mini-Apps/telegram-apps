# BackButton

Class which controls the back button displayed in the header
of the Web App in the Telegram interface. It is mostly used in case, when
you want to provide a way to go bach in routing history or "rollback" some
action.

## Usage

To create new instance of `BackButton`, we need current Web App version
and optional `Bridge` instance.

```typescript
import {BackButton} from 'twa-client-sdk';
import {Bridge} from 'twa-bridge';

const backButton = new BackButton('6.1');
// or
const backButton = new BackButton('6.1', {bridge: Bridge.init()});
```

### Showing and hiding

BackButton can be shown and hidden via methods like `show` and `hide`:

```typescript jsx
// Show back button.
backButton.show();

// Hide back button.
backButton.hide();
```

To get current visibility state, we should use `isVisible` property:

```typescript
// Show back button.
backButton.show();
console.log(backButton.isVisible); // true

// Hide back button.
backButton.hide();
console.log(backButton.isVisible); // false
```

### Events

#### Common usage

`BackButton` follows default way of events listening through `on` and `off`
functions:

```typescript
const listener = (...args) => { ... };

backButton.on(event, listener);
backButton.off(event, listener);
```

#### Back button clicked

```typescript
// Show back button.
backButton.show();

// When user clicked back button, we hide it.
backButton.on('click', () => backButton.hide());
```

#### Property-connected events

This list of events is back button properties connected and is being called
whenever property changes:

- `visibleChange: (isVisible: boolean) => void`