# `HapticFeedback`

Controls the haptic feedback. It allows calling different types of haptic notifications which
usually occur after the user interaction with the application. There is more information about this
component in this [documentation](../../../../functionality/haptic-feedback.md).

## Initialization

Component constructor accepts Telegram Mini Apps version and optional function to call
Telegram Mini Apps methods.

```typescript
import { postEvent } from '@tma.js/bridge';
import { HapticFeedback } from '@tma.js/sdk';

const haptic = new HapticFeedback('6.3', postEvent);
```

## Notifications

`HapticFeedback` supports 3 types of haptic events - `impactOccurred`, `notificationOccurred`
and `selectionChanged`.

### `impactOccurred`

A method tells that an impact occurred. The Telegram app may play the appropriate haptics based on
style value passed. Style of impact occurred haptic event:

- `light`, indicates a collision between small or lightweight UI objects
- `medium`, indicates a collision between medium-sized or medium-weight UI objects
- `heavy`, indicates a collision between large or heavyweight UI objects
- `rigid`, indicates a collision between hard or inflexible UI objects
- `soft`, indicates a collision between soft or flexible UI objects

```typescript
haptic.impactOccurred('medium');
```

### `notificationOccurred`

A method tells that a task or action has succeeded, failed, or produced a warning. The Telegram app
may play the appropriate haptics based on type value passed. Type of notification occurred type
event.

- `error`, indicates that a task or action has failed,
- `success`, indicates that a task or action has completed successfully,
- `warning`, indicates that a task or action produced a warning.

```typescript
haptic.notificationOccurred('success');
```

### `selectionChanged`

A method tells that the user has changed a selection.

```typescript
haptic.selectionChanged();
```

## Methods support

List of methods, which could be used in `supports` component instance method:

- `notificationOccurred` - to check if the `notificationOccurred` method supported.
- `impactOccurred` - to check if the `impactOccurred` method supported.
- `selectionChanged` - to check if the `selectionChanged` method supported.
